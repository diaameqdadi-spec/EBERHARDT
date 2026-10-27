import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const d=JSON.parse(await fs.readFile('content.json','utf8'));const paths=new Set([...d.pages.map(p=>p.path),'/patient-resources/','/site-directory/']);
assert(d.pages.length>=128,'Original page coverage');assert.equal(d.errors.length,0,'Content extraction issues');
const failures=[];let internal=0,assets=0;
for(const page of d.pages){assert(page.title&&page.html.trim(),'Missing content for '+page.path);assert(!/<script\b|on(?:click|load|error)=/i.test(page.html),'Legacy executable code in '+page.path);for(const m of page.html.matchAll(/\b(href|src)="([^"]+)"/gi)){const target=m[2];if(target.startsWith('/assets/')){assets++;try{const bytes=await fs.readFile('.'+target);assert(bytes.length>0);if(target.endsWith('.pdf'))assert(bytes.subarray(0,4).toString()==='%PDF');}catch{failures.push(page.path+' missing asset '+target);}}else if(target.startsWith('/')){internal++;if(!paths.has(target.split('#')[0].split('?')[0]))failures.push(page.path+' broken link '+target);}}}
const formPage=d.pages.find(p=>p.path==='/patient-forms/');assert.equal((formPage.html.match(/\.pdf"/g)||[]).length,8,'Seven forms plus repeated privacy packet link retained');
for(const route of ['/meet-the-dr_s/','/disclosures/','/financial-information/','/technology/','/procedures/surgical-instructions/after-tooth-extractions/'])assert(paths.has(route));
assert.equal(failures.length,0,failures.join('\n'));console.log(`PASS: ${d.pages.length} content routes, ${internal} internal links, ${assets} local asset references, and patient PDF signatures.`);
