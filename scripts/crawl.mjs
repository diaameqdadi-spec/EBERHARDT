import fs from 'node:fs/promises';
const root=new URL('../',import.meta.url); const base='https://www.eberhardtdental.com';
await fs.mkdir(new URL('source-pages/',root),{recursive:true});
const initial=await fs.readFile(new URL('original.html',root),'utf8');
const queue=['/'];const seen=new Set();const records=[];const errors=[];
const decode=s=>s.replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&nbsp;/g,' ');
function links(html){return [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map(m=>({href:decode(m[1]),label:decode(m[2].replace(/<[^>]*>/g,'').trim())}));}
const nav=links(initial).filter(x=>x.href.startsWith('/')&&!x.href.startsWith('//'));
queue.push(...nav.map(x=>x.href));
let cursor=0;
async function worker(){while(cursor<queue.length){const path=queue[cursor++];if(seen.has(path))continue;seen.add(path);if(/\.(pdf|jpg|png|gif|js|css|ashx)(\?|$)/i.test(path))continue;try{const html=path==='/'?initial:await (async()=>{const r=await fetch(base+path,{signal:AbortSignal.timeout(45000)});if(!r.ok)throw Error(r.status);return r.text()})();await fs.writeFile(new URL('source-pages/'+encodeURIComponent(path).replaceAll('%','_')+'.html',root),html);const section=html.match(/<section\b[^>]*id="content"[^>]*>([\s\S]*?)<\/section>/i)?.[1]||'';const heading=decode(section.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)?.[1]?.replace(/<[^>]*>/g,'').trim()||nav.find(x=>x.href===path)?.label||'Eberhardt Dental');let content=section.replace(/^[\s\S]*?<!--content control-->/,'').replace(/<script\b[\s\S]*?<\/script>/gi,'').replace(/<input\b[^>]*>/gi,'').replace(/(?:\s*<\/div>){3}\s*$/,'');records.push({path,title:heading,html:content,links:links(content)});for(const l of links(content)){if(l.href.startsWith('/')&&!l.href.startsWith('//')&&!seen.has(l.href)&&!queue.includes(l.href))queue.push(l.href);}console.log(records.length,path,content.length);}catch(e){errors.push({path,error:e.message});console.log('FAILED',path,e.message);}}}
await Promise.all(Array.from({length:6},worker));
await fs.writeFile(new URL('content.json',root),JSON.stringify({fetchedAt:new Date().toISOString(),pages:records.sort((a,b)=>a.path.localeCompare(b.path)),navigation:nav,errors},null,2));
console.log('COMPLETE',records.length,'pages',errors.length,'errors');
