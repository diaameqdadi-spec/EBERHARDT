import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const data=JSON.parse(await fs.readFile(path.join(root,'content.json'),'utf8'));
const dec=s=>s.replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
const links=s=>[...s.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map(m=>({href:dec(m[1]),label:dec(m[2].replace(/<[^>]*>/g,'').trim())}));
const assets=new Map();
for(const page of data.pages){let html;try{html=await fs.readFile(path.join(root,'source-pages',encodeURIComponent(page.path).replaceAll('%','_')+'.html'),'utf8')}catch{html=''};if(page.path==='/')html=await fs.readFile(path.join(root,'original.html'),'utf8');const section=html.match(/<section\b[^>]*id="content"[^>]*>([\s\S]*?)<\/section>/i)?.[1]||'';page.title=dec(section.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)?.[1]?.replace(/<[^>]*>/g,'').trim()||data.navigation.find(x=>x.href===page.path)?.label||page.title);let body=section.replace(/^[\s\S]*?<!--content control-->/,'').replace(/<script\b[\s\S]*?<\/script>/gi,'').replace(/<link\b[^>]*>/gi,'').replace(/<input\b[^>]*type=["']hidden["'][^>]*>/gi,'').replace(/(?:\s*<\/div>){3}\s*$/,'').replace(/\s(?:on\w+|id|class|style|align|width|height|face|color|size|bgcolor|border|cellpadding|cellspacing)\s*=\s*(?:"[^"]*"|'[^']*')/gi,'').replace(/<\/?font\b[^>]*>/gi,'').replace(/<!--[^]*?-->/g,'');
body=body.replace(/\b(href|src)=["']([^"']+)["']/gi,(match,attr,value)=>{value=dec(value);if(value.startsWith('//'))value='https:'+value;else if(!/^(https?:|mailto:|tel:|#|javascript:)/i.test(value)){value=new URL(value,'https://www.eberhardtdental.com'+page.path).href;}if(attr.toLowerCase()==='href'&&value.startsWith('https://www.eberhardtdental.com/')){const u=new URL(value);if(!/\.(pdf|jpg|png|gif|ashx|mp4)$/i.test(u.pathname))value=decodeURI(u.pathname)+u.search+u.hash;}
if(/javascript:/i.test(value))value='https://www.eberhardtdental.com'+page.path;
if(attr.toLowerCase()==='src'&&/\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(value)||attr.toLowerCase()==='href'&&/\.pdf(\?|$)/i.test(value)){if(!assets.has(value)){const ext=new URL(value).pathname.split('.').pop().toLowerCase();assets.set(value,'assets/imported-'+(assets.size+1)+'.'+ext);}value='/'+assets.get(value);}
return `${attr}="${value.replaceAll('"','&quot;')}"`;});
page.html=body;page.links=links(body);page.sourceBytes=html.length;
}
data.errors=data.pages.filter(p=>!p.sourceBytes||(!p.html&&p.path!='/ada.aspx')).map(p=>({path:p.path,error:'No extractable content'}));
await fs.writeFile(path.join(root,'content.json'),JSON.stringify(data,null,2));
await fs.writeFile(path.join(root,'asset-manifest.json'),JSON.stringify([...assets].map(([url,file])=>({url,file})),null,2));
console.log('Imported',data.pages.length,'pages;',assets.size,'assets;',data.errors.length,'extraction issues');console.log(data.errors);
