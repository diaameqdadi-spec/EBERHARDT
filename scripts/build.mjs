import fs from 'node:fs/promises';
import path from 'node:path';
const data=JSON.parse(await fs.readFile('content.json','utf8'));const template=await fs.readFile('index.html','utf8');
const out='dist';await fs.mkdir(out,{recursive:true});
// The legacy ASPX address is an HTML rewrite, not a static file download.
await fs.rm(path.join(out,'ada.aspx'),{force:true});
for(const name of ['index.html','styles.css','app.js','content.json'])await fs.copyFile(name,path.join(out,name));
await fs.cp('assets',path.join(out,'assets'),{recursive:true});
const extra=['/patient-resources/','/site-directory/'];
for(const route of [...data.pages.map(p=>p.path),...extra]){if(route==='/'||route==='/ada.aspx')continue;const page=data.pages.find(p=>p.path===route);const title=(page?.title|| (route.includes('directory')?'Site directory':'Patient resources'))+' | Eberhardt Dental';let html=template.replace(/<title>[^]*?<\/title>/,`<title>${title.replaceAll('&','&amp;')}</title>`);if(page?.html&&!['/appointment-request/','/smile-analysis/','/contact/','/reviews/post-a-review/'].includes(route))html=html.replace('<div class="loading wrap">Preparing your visit…</div>',`<section class="wrap section"><h1>${page.title}</h1><article class="article">${page.html}</article></section>`);const destination=route.endsWith('/')?path.join(out,route,'index.html'):path.join(out,route);await fs.mkdir(path.dirname(destination),{recursive:true});await fs.writeFile(destination,html);}
await fs.writeFile(path.join(out,'404.html'),template);
await fs.writeFile(path.join(out,'_redirects'),'/Procedures.aspx /procedures/ 301\n/Contact.aspx /contact/ 301\n/AppointmentRequest.aspx /appointment-request/ 301\n/* /index.html 200\n');
console.log('Built',data.pages.length+extra.length,'routes in dist/.');
