import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.pdf':'application/pdf'};
const server=http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');let pathname=decodeURIComponent(url.pathname);if(pathname.includes('..')||pathname.includes('source-pages')||pathname.includes('scripts/')||pathname==='/original.html'){res.writeHead(404);return res.end('Not found');}let file=path.join(root,pathname);if(!path.extname(file)||pathname.endsWith('/')||pathname==='/ada.aspx')file=path.join(root,'index.html');const data=await fs.readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(data);}catch{res.writeHead(404);res.end('Not found');}});
server.listen(Number(process.env.PORT)||4173,'127.0.0.1',()=>console.log('Eberhardt Dental preview: http://localhost:4173'));
