import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=fileURLToPath(new URL('.',import.meta.url));
const env=await readFile(join(root,'.env.local'),'utf8');
const apiKey=env.match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim();
if(!apiKey)throw new Error('.env.local에 GEMINI_API_KEY가 필요합니다.');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'};
const send=(res,status,body,type='application/json; charset=utf-8')=>{res.writeHead(status,{'Content-Type':type,'Cache-Control':'no-store'});res.end(body)};

createServer(async(req,res)=>{
  try{
    if(req.method==='POST'&&req.url==='/api/gemini'){
      let body='';for await(const chunk of req){body+=chunk;if(body.length>20000)throw new Error('요청이 너무 깁니다.')}const {prompt,json}=JSON.parse(body);if(!prompt?.trim())return send(res,400,JSON.stringify({error:'다듬을 내용을 입력해 주세요.'}));
      const generationConfig=json?{responseMimeType:'application/json',responseSchema:{type:'OBJECT',properties:{goal:{type:'STRING'},problem:{type:'STRING'},process:{type:'STRING'},outcome:{type:'STRING'},learning:{type:'STRING'}},required:['goal','problem','process','outcome','learning']}}:{temperature:.6,maxOutputTokens:350};
      const upstream=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':apiKey},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig})});
      const result=await upstream.json(),text=result.candidates?.[0]?.content?.parts?.map(part=>part.text||'').join('').trim();return send(res,upstream.ok?200:upstream.status,JSON.stringify(upstream.ok?{text}:{error:result.error?.message||'Gemini 요청에 실패했어요.'}))
    }
    if(req.method!=='GET')return send(res,405,JSON.stringify({error:'Method not allowed'}));
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),relative=pathname==='/'?'index.html':pathname.slice(1),safe=normalize(relative);if(safe.startsWith('..')||safe.startsWith('.')||safe.includes('.env'))return send(res,404,'Not found','text/plain; charset=utf-8');
    const file=await readFile(join(root,safe));send(res,200,file,types[extname(safe).toLowerCase()]||'application/octet-stream')
  }catch(error){send(res,error.code==='ENOENT'?404:500,JSON.stringify({error:error.message}))}
}).listen(4173,'127.0.0.1',()=>console.log('Portfolio Maker: http://127.0.0.1:4173'));
