const schema={type:'OBJECT',properties:{goal:{type:'STRING'},problem:{type:'STRING'},process:{type:'STRING'},outcome:{type:'STRING'},learning:{type:'STRING'}},required:['goal','problem','process','outcome','learning']};

export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  const {prompt,json}=req.body||{};if(!prompt?.trim())return res.status(400).json({error:'다듬을 내용을 입력해 주세요.'});
  const generationConfig=json?{responseMimeType:'application/json',responseSchema:schema}:{temperature:.6,maxOutputTokens:350};
  try{
    const upstream=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':process.env.GEMINI_API_KEY},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig})});
    const result=await upstream.json(),text=result.candidates?.[0]?.content?.parts?.map(part=>part.text||'').join('').trim();return res.status(upstream.ok?200:upstream.status).json(upstream.ok?{text}:{error:result.error?.message||'Gemini 요청에 실패했어요.'})
  }catch(error){return res.status(500).json({error:error.message})}
}
