const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.woff':'font/woff'};
http.createServer((req,res)=>{
 let filename;
 try{filename=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));}catch{res.writeHead(400);return res.end();}
 if(filename===root) filename=path.join(root,'index.html');
 const relative=path.relative(root,filename);
 if(relative.startsWith('..')||path.isAbsolute(relative)||relative.split(path.sep).some(p=>p.startsWith('.'))){res.writeHead(403);return res.end();}
 fs.readFile(filename,(err,data)=>{res.writeHead(err?404:200,{'Content-Type':types[path.extname(filename)]||'application/octet-stream','Cache-Control':'no-store'});res.end(err?'Not found':data);});
}).listen(4173,'127.0.0.1',()=>console.log('HSAS preview: http://127.0.0.1:4173'));
