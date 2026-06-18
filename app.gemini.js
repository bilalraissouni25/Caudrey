"use strict";
/* ===== Support Google Gemini (texte, vision, image) — surcharge callText/callVision/cmpRenderAI ===== */
var GEM_TEXT="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";
var GEM_IMG="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=";

function callText(prompt){
  var prov=state.ai.provider,key=state.ai.key;
  if(prov==="gemini")return fetch(GEM_TEXT+encodeURIComponent(key),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:prompt}]}]})}).then(function(r){return r.json();}).then(function(d){if(d.error)throw d.error.message;var c=d.candidates&&d.candidates[0];if(!c)throw "réponse vide";return (c.content.parts||[]).map(function(p){return p.text||"";}).join("");});
  if(prov==="openai")return fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+key},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"user",content:prompt}],max_tokens:600})}).then(function(r){return r.json();}).then(function(d){if(d.error)throw d.error.message;return d.choices[0].message.content;});
  if(prov==="anthropic")return fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-3-5-haiku-latest",max_tokens:600,messages:[{role:"user",content:prompt}]})}).then(function(r){return r.json();}).then(function(d){if(d.error)throw d.error.message;return d.content[0].text;});
  return Promise.reject("fournisseur");
}
function callVision(prompt,imgUrl){
  var prov=state.ai.provider,key=state.ai.key;
  if(prov==="gemini"){
    var mm=imgUrl.match(/^data:(.*?);base64,(.*)$/);
    if(!mm)return Promise.reject("Gemini lit les images uploadées (data) — pour un lien, importe l'image.");
    return fetch(GEM_TEXT+encodeURIComponent(key),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:prompt},{inline_data:{mime_type:mm[1],data:mm[2]}}]}]})}).then(function(r){return r.json();}).then(function(d){if(d.error)throw d.error.message;var c=d.candidates&&d.candidates[0];if(!c)throw "réponse vide";return (c.content.parts||[]).map(function(p){return p.text||"";}).join("");});
  }
  if(prov==="openai")return fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+key},body:JSON.stringify({model:"gpt-4o-mini",max_tokens:200,messages:[{role:"user",content:[{type:"text",text:prompt},{type:"image_url",image_url:{url:imgUrl}}]}]})}).then(function(r){return r.json();}).then(function(d){if(d.error)throw d.error.message;return d.choices[0].message.content;});
  if(prov==="anthropic"){
    var m2=imgUrl.match(/^data:(.*?);base64,(.*)$/);var srcObj=m2?{type:"base64",media_type:m2[1],data:m2[2]}:{type:"url",url:imgUrl};
    return fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-3-5-haiku-latest",max_tokens:200,messages:[{role:"user",content:[{type:"image",source:srcObj},{type:"text",text:prompt}]}]})}).then(function(r){return r.json();}).then(function(d){if(d.error)throw d.error.message;return d.content[0].text;});
  }
  return Promise.reject("fournisseur");
}
function cmpRenderAI(){
  var out=document.getElementById("cmpAiOut"); if(!out)return;
  var prov=(state.ai&&state.ai.provider)||"none";
  if((prov!=="openai"&&prov!=="gemini")||!state.ai.key){out.innerHTML='<div class="muted" style="font-size:13px;">Le rendu réaliste utilise OpenAI ou Google Gemini : choisis l\'un des deux et colle ta clé dans l\'onglet Assistant IA.</div>';return;}
  var items=(typeof cmpItems!=="undefined"&&cmpItems.length)?cmpItems.join(", "):"un vêtement";
  var extra=(document.getElementById("cmpPrompt")||{}).value||"";
  var prompt="Photographie de mode réaliste en studio d'un vêtement porté par un mannequin : "+items+(extra?". "+extra:"")+". Lumière douce, fond neutre, rendu textile réaliste et détaillé, haute qualité.";
  out.innerHTML='<div class="muted"><span class="spin"></span> Génération du rendu…</div>';
  var pr;
  if(prov==="gemini"){
    pr=fetch(GEM_IMG+encodeURIComponent(state.ai.key),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseModalities:["TEXT","IMAGE"]}})}).then(function(r){return r.json();}).then(function(d){if(d.error)throw d.error.message;var parts=(d.candidates&&d.candidates[0]&&d.candidates[0].content.parts)||[];for(var i=0;i<parts.length;i++){var p=parts[i].inlineData||parts[i].inline_data;if(p&&p.data)return "data:"+(p.mimeType||p.mime_type||"image/png")+";base64,"+p.data;}throw "pas d'image renvoyée";});
  }else{
    pr=fetch("https://api.openai.com/v1/images/generations",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+state.ai.key},body:JSON.stringify({model:"gpt-image-1",prompt:prompt,size:"1024x1024",n:1})}).then(function(r){return r.json();}).then(function(d){if(d.error)throw d.error.message;var b64=d.data[0].b64_json;return b64?("data:image/png;base64,"+b64):d.data[0].url;});
  }
  pr.then(function(url){window._cmpRender=url;out.innerHTML='<div class="card"><img src="'+url+'" style="width:100%;max-width:360px;border-radius:10px;border:1px solid var(--line);"><div style="margin-top:10px;"><button class="btn sm" onclick="cmpSaveRender()">Enregistrer ce rendu</button></div></div>';}).catch(function(e){out.innerHTML='<div class="muted" style="font-size:13px;">Rendu impossible ('+esc(String(e).slice(0,100))+').</div>';});
}
