"use strict";
/* ===== STUDIO COMPOSEUR (Fabric.js) ===== */
var fc=null, cmpItems=[], cmpPrint="uni";
var EL={
  "Silhouettes":[
    {n:"Robe trapèze",w:180,svg:'<svg viewBox="0 0 120 170"><path d="M40 12 L80 12 L88 56 L104 162 L16 162 L32 56 Z" fill="#9c5d7c"/></svg>'},
    {n:"Robe droite",w:160,svg:'<svg viewBox="0 0 120 170"><path d="M40 12 L80 12 L86 56 L84 162 L36 162 L34 56 Z" fill="#9c5d7c"/></svg>'},
    {n:"Robe patineuse",w:190,svg:'<svg viewBox="0 0 140 170"><path d="M48 12 L92 12 L96 60 L130 162 L10 162 L44 60 Z" fill="#9c5d7c"/></svg>'},
    {n:"Jupe évasée",w:170,svg:'<svg viewBox="0 0 120 100"><path d="M30 8 L90 8 L108 92 L12 92 Z" fill="#c08552"/></svg>'},
    {n:"Top / blouse",w:150,svg:'<svg viewBox="0 0 120 90"><path d="M38 10 L82 10 L88 40 L84 80 L36 80 L32 40 Z" fill="#5b7591"/></svg>'},
    {n:"Pantalon",w:140,svg:'<svg viewBox="0 0 120 160"><path d="M34 8 L86 8 L84 150 L66 150 L60 70 L54 150 L36 150 Z" fill="#5b7152"/></svg>'},
    {n:"Manteau",w:180,svg:'<svg viewBox="0 0 140 175"><path d="M44 10 L96 10 L104 50 L100 165 L40 165 L36 50 Z" fill="#7a6a86"/><line x1="70" y1="14" x2="70" y2="160" stroke="#4b4252" stroke-width="2"/></svg>'}
  ],
  "Cols & encolures":[
    {n:"Col claudine",w:90,svg:'<svg viewBox="0 0 100 56"><path d="M50 8 C30 8 18 30 24 50 C36 40 44 42 50 50 C56 42 64 40 76 50 C82 30 70 8 50 8 Z" fill="#f3efe7" stroke="#5a4a52" stroke-width="2"/></svg>'},
    {n:"Col V",w:80,svg:'<svg viewBox="0 0 100 60"><path d="M18 6 L50 54 L82 6" fill="none" stroke="#5a4a52" stroke-width="6"/></svg>'},
    {n:"Col chemise",w:90,svg:'<svg viewBox="0 0 100 56"><path d="M50 10 L24 18 L38 48 L50 30 L62 48 L76 18 Z" fill="#f3efe7" stroke="#5a4a52" stroke-width="2"/></svg>'},
    {n:"Col montant",w:70,svg:'<svg viewBox="0 0 100 40"><rect x="30" y="8" width="40" height="26" rx="4" fill="#9c5d7c" stroke="#5a4a52" stroke-width="2"/></svg>'},
    {n:"Encolure bardot",w:110,svg:'<svg viewBox="0 0 120 40"><path d="M8 24 Q60 4 112 24" fill="none" stroke="#5a4a52" stroke-width="6"/></svg>'}
  ],
  "Manches":[
    {n:"Manche ballon",w:80,svg:'<svg viewBox="0 0 90 90"><path d="M40 12 C6 18 4 64 30 80 L52 40 Z" fill="#9c5d7c" stroke="#5a4a52" stroke-width="2"/></svg>'},
    {n:"Manche bishop",w:70,svg:'<svg viewBox="0 0 80 130"><path d="M44 10 C2 40 8 110 36 122 L56 116 L52 30 Z" fill="#9c5d7c" stroke="#5a4a52" stroke-width="2"/></svg>'},
    {n:"Manche longue",w:55,svg:'<svg viewBox="0 0 60 130"><path d="M18 8 L46 18 L40 122 L12 122 Z" fill="#9c5d7c" stroke="#5a4a52" stroke-width="2"/></svg>'},
    {n:"Manche courte",w:70,svg:'<svg viewBox="0 0 80 60"><path d="M14 12 L62 22 L54 54 L10 48 Z" fill="#9c5d7c" stroke="#5a4a52" stroke-width="2"/></svg>'},
    {n:"Manche flutter",w:80,svg:'<svg viewBox="0 0 90 60"><path d="M10 10 Q22 40 34 12 Q46 44 58 14 Q70 44 82 12 L82 50 L10 50 Z" fill="#d9b8a3" stroke="#5a4a52" stroke-width="1.5"/></svg>'}
  ],
  "Bas & volumes":[
    {n:"Volant",w:160,svg:'<svg viewBox="0 0 140 40"><path d="M6 12 Q20 38 34 12 Q48 38 62 12 Q76 38 90 12 Q104 38 118 12 Q132 38 134 14 L134 34 L6 34 Z" fill="#d9b8a3" stroke="#5a4a52" stroke-width="1.5"/></svg>'},
    {n:"Ourlet asymétrique",w:160,svg:'<svg viewBox="0 0 140 60"><path d="M6 10 L134 10 L110 54 L24 30 Z" fill="#9c5d7c" stroke="#5a4a52" stroke-width="1.5"/></svg>'},
    {n:"Plis",w:150,svg:'<svg viewBox="0 0 140 90"><g stroke="#5a4a52" stroke-width="3"><line x1="20" y1="6" x2="20" y2="84"/><line x1="50" y1="6" x2="50" y2="84"/><line x1="80" y1="6" x2="80" y2="84"/><line x1="110" y1="6" x2="110" y2="84"/></g></svg>'},
    {n:"Jupon / tutu",w:170,svg:'<svg viewBox="0 0 150 70"><path d="M10 14 Q40 70 75 22 Q110 70 140 14 L140 60 L10 60 Z" fill="#d9b8a3" stroke="#5a4a52" stroke-width="1.5"/></svg>'}
  ],
  "Détails":[
    {n:"Ceinture",w:160,svg:'<svg viewBox="0 0 160 26"><rect x="4" y="6" width="152" height="14" rx="3" fill="#5a4a52"/><rect x="70" y="2" width="20" height="22" rx="3" fill="#bd8a3e"/></svg>'},
    {n:"Nœud",w:70,svg:'<svg viewBox="0 0 80 50"><path d="M40 25 L10 10 L10 40 Z" fill="#9c5d7c" stroke="#5a4a52" stroke-width="1.5"/><path d="M40 25 L70 10 L70 40 Z" fill="#9c5d7c" stroke="#5a4a52" stroke-width="1.5"/><rect x="35" y="18" width="10" height="14" rx="2" fill="#5a4a52"/></svg>'},
    {n:"Boutons",w:28,svg:'<svg viewBox="0 0 24 120"><g fill="#5a4a52"><circle cx="12" cy="12" r="6"/><circle cx="12" cy="42" r="6"/><circle cx="12" cy="72" r="6"/><circle cx="12" cy="102" r="6"/></g></svg>'},
    {n:"Poche",w:60,svg:'<svg viewBox="0 0 80 80"><rect x="12" y="12" width="56" height="56" rx="8" fill="none" stroke="#5a4a52" stroke-width="4"/></svg>'},
    {n:"Lacets",w:60,svg:'<svg viewBox="0 0 60 110"><g stroke="#5a4a52" stroke-width="3"><line x1="10" y1="10" x2="50" y2="30"/><line x1="50" y1="10" x2="10" y2="30"/><line x1="10" y1="40" x2="50" y2="60"/><line x1="50" y1="40" x2="10" y2="60"/><line x1="10" y1="70" x2="50" y2="90"/><line x1="50" y1="70" x2="10" y2="90"/></g></svg>'},
    {n:"Fronces",w:120,svg:'<svg viewBox="0 0 120 30"><g fill="none" stroke="#5a4a52" stroke-width="2.5"><path d="M8 8 Q14 22 20 8"/><path d="M24 8 Q30 22 36 8"/><path d="M40 8 Q46 22 52 8"/><path d="M56 8 Q62 22 68 8"/><path d="M72 8 Q78 22 84 8"/><path d="M88 8 Q94 22 100 8"/><path d="M104 8 Q110 22 116 8"/></g></svg>'}
  ],
  "Formes":[
    {n:"Cercle",w:80,svg:'<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#9c5d7c"/></svg>'},
    {n:"Rectangle",w:100,svg:'<svg viewBox="0 0 120 80"><rect x="6" y="6" width="108" height="68" rx="6" fill="#9c5d7c"/></svg>'},
    {n:"Triangle",w:90,svg:'<svg viewBox="0 0 100 90"><path d="M50 8 L92 82 L8 82 Z" fill="#9c5d7c"/></svg>'},
    {n:"Étoile",w:80,svg:'<svg viewBox="0 0 100 100"><path d="M50 6 L61 38 L95 38 L67 58 L78 92 L50 70 L22 92 L33 58 L5 38 L39 38 Z" fill="#bd8a3e"/></svg>'},
    {n:"Cœur",w:80,svg:'<svg viewBox="0 0 100 90"><path d="M50 84 C10 54 14 20 38 20 C48 20 50 30 50 30 C50 30 52 20 62 20 C86 20 90 54 50 84 Z" fill="#d4537e"/></svg>'},
    {n:"Ligne",w:120,svg:'<svg viewBox="0 0 140 14"><rect x="4" y="5" width="132" height="4" rx="2" fill="#5a4a52"/></svg>'}
  ]
};

function cmpInit(){
  if(fc)return;
  if(!window.fabric){$("cmpElements").innerHTML='<div class="muted" style="font-size:13px;">Moteur graphique non chargé (hors-ligne ?). Reconnecte-toi puis recharge.</div>';return;}
  fc=new fabric.Canvas("fabCanvas",{backgroundColor:"#ffffff",preserveObjectStacking:true});
  cmpBuildCats();
  cmpRenderPalette();
  $("cmpColor").addEventListener("input",function(){cmpApply(function(o){cmpSetFill(o,$("cmpColor").value);});});
  document.querySelectorAll("#cmpPrint button").forEach(function(b){b.addEventListener("click",function(){document.querySelectorAll("#cmpPrint button").forEach(function(n){n.classList.remove("on");});b.classList.add("on");cmpPrint=b.dataset.p;cmpApply(function(o){cmpSetPrint(o,cmpPrint,$("cmpColor").value);});});});
}
var cmpCat="Silhouettes";
function cmpBuildCats(){var seg=$("cmpCat");seg.innerHTML="";Object.keys(EL).forEach(function(k,i){var b=document.createElement("button");b.textContent=k;if(i===0)b.classList.add("on");b.addEventListener("click",function(){document.querySelectorAll("#cmpCat button").forEach(function(n){n.classList.remove("on");});b.classList.add("on");cmpCat=k;cmpRenderEls();});seg.appendChild(b);});cmpRenderEls();}
function cmpRenderEls(){var box=$("cmpElements");box.innerHTML="";(EL[cmpCat]||[]).forEach(function(el){var btn=document.createElement("button");btn.className="btn ghost sm";btn.style.cssText="display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 4px;height:auto;";btn.title=el.n;btn.innerHTML='<span style="width:42px;height:42px;display:flex;align-items:center;justify-content:center;">'+el.svg.replace("<svg","<svg width=\"42\" height=\"42\"")+'</span><span style="font-size:11px;line-height:1.1;">'+el.n+'</span>';btn.addEventListener("click",function(){cmpAdd(el);});box.appendChild(btn);});}
function cmpRenderPalette(){var el=$("cmpPalette");if(!el)return;el.innerHTML="";(state.palette||[]).forEach(function(c){var b=document.createElement("button");b.className="swatch";b.style.cssText="width:24px;height:24px;background:"+c+";cursor:pointer;";b.title="appliquer";b.addEventListener("click",function(){$("cmpColor").value=c;cmpApply(function(o){cmpSetFill(o,c);});});el.appendChild(b);});}
function cmpAdd(el){fabric.loadSVGFromString(el.svg,function(objs,opts){var o=fabric.util.groupSVGElements(objs,opts);o.set({originX:"center",originY:"center",left:240,top:300});o.scaleToWidth(el.w||140);fc.add(o);fc.setActiveObject(o);fc.requestRenderAll();cmpItems.push(el.n);});}
function cmpEach(o,fn){if(o._objects&&o._objects.length){o._objects.forEach(fn);}else{fn(o);}}
function cmpSetFill(o,color){cmpEach(o,function(s){if(s.fill!=null&&s.fill!=="none"&&s.fill!=="")s.set("fill",color);else if((s.stroke&&s.stroke!=="none")&&(!s.fill||s.fill==="none"))s.set("stroke",color);else s.set("fill",color);});}
function cmpPatternCanvas(name,color){var c=document.createElement("canvas");c.width=24;c.height=24;var x=c.getContext("2d");x.fillStyle=color;x.fillRect(0,0,24,24);x.fillStyle="rgba(255,255,255,0.6)";if(name==="pois"){x.beginPath();x.arc(6,6,3,0,7);x.fill();x.beginPath();x.arc(18,18,3,0,7);x.fill();}else if(name==="rayures"){x.fillRect(0,0,12,24);}else if(name==="fleuri"){x.beginPath();x.arc(8,8,2.5,0,7);x.arc(16,16,2.5,0,7);x.fill();x.fillStyle="rgba(255,216,107,0.9)";x.beginPath();x.arc(8,8,1.2,0,7);x.arc(16,16,1.2,0,7);x.fill();}return c;}
function cmpSetPrint(o,name,color){if(name==="uni"){cmpSetFill(o,color);return;}var pat=new fabric.Pattern({source:cmpPatternCanvas(name,color),repeat:"repeat"});cmpEach(o,function(s){if(s.fill!=null&&s.fill!=="none")s.set("fill",pat);});}
function cmpApply(fn){var a=fc&&fc.getActiveObject();if(!a){toast("Sélectionne un élément d'abord");return;}if(a._objects&&a.type==="activeSelection"){a._objects.forEach(fn);}else{fn(a);}fc.requestRenderAll();}
function cmpForward(){var o=fc&&fc.getActiveObject();if(o){fc.bringForward(o);fc.requestRenderAll();}}
function cmpBackward(){var o=fc&&fc.getActiveObject();if(o){fc.sendBackwards(o);fc.requestRenderAll();}}
function cmpDuplicate(){var o=fc&&fc.getActiveObject();if(!o)return;o.clone(function(c){c.set({left:o.left+24,top:o.top+24});fc.add(c);fc.setActiveObject(c);fc.requestRenderAll();});}
function cmpDelete(){if(!fc)return;var a=fc.getActiveObjects();a.forEach(function(o){fc.remove(o);});fc.discardActiveObject();fc.requestRenderAll();}
function cmpAddText(){var t=new fabric.Textbox("Texte",{left:240,top:120,fontSize:34,fill:$("cmpColor").value,fontFamily:"Georgia, serif",originX:"center",textAlign:"center",width:200});fc.add(t);fc.setActiveObject(t);fc.requestRenderAll();}
function cmpClear(){if(!fc)return;fc.clear();fc.backgroundColor="#ffffff";fc.requestRenderAll();cmpItems=[];window._cmpManne=null;}
function cmpMannequin(){if(!fc)return;if(window._cmpManne){fc.remove(window._cmpManne);window._cmpManne=null;fc.requestRenderAll();toast("Mannequin retiré");return;}if(typeof mannequinSVG!=="function")return;fabric.loadSVGFromString(mannequinSVG(),function(objs,opts){var o=fabric.util.groupSVGElements(objs,opts);o.set({originX:"center",originY:"center",left:240,top:310,selectable:false,evented:false,opacity:0.22});o.scaleToHeight(560);fc.add(o);fc.sendToBack(o);window._cmpManne=o;fc.requestRenderAll();toast("Compose sur le mannequin");});}
function cmpData(){return fc.toDataURL({format:"jpeg",quality:0.85,multiplier:1});}
function cmpSave(){if(!fc)return;var obj={id:uid(),title:"Mon design",img:cmpData(),note:cmpItems.slice(0,8).join(", "),url:"",platform:"Design",tags:[]};state.inspirations.unshift(obj);if(!save()){state.inspirations.shift();toast("Mémoire pleine");return;}if(typeof renderInspo==="function")renderInspo();if(typeof refreshRefSelect==="function")refreshRefSelect();toast("Design enregistré dans tes inspirations");}
function cmpToCarnet(){if(!fc)return;state.projets.unshift({id:uid(),name:"Mon design — "+(cmpItems[0]||"pièce"),piece:"Design",diff:"Intermédiaire",stat:"envie",tissu:cmpItems.slice(0,6).join(", "),date:""});save();if(typeof renderProjets==="function"){renderProjets();renderCarnetStats();}toast("Design ajouté au carnet");}
function cmpRenderAI(){
  var out=$("cmpAiOut");
  var prov=(state.ai&&state.ai.provider)||"none";
  if(prov!=="openai"||!state.ai.key){out.innerHTML='<div class="muted" style="font-size:13px;">Le rendu réaliste utilise la génération d\'image OpenAI : choisis « OpenAI » et colle ta clé dans l\'onglet Assistant IA.</div>';return;}
  var items=cmpItems.length?cmpItems.join(", "):"un vêtement";
  var extra=$("cmpPrompt").value.trim();
  var prompt="Photographie de mode réaliste en studio d'un vêtement porté par un mannequin : "+items+(extra?". "+extra:"")+". Lumière douce, fond neutre, rendu textile réaliste et détaillé, haute qualité.";
  out.innerHTML='<div class="muted"><span class="spin"></span> Génération du rendu… (quelques secondes)</div>';
  fetch("https://api.openai.com/v1/images/generations",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+state.ai.key},body:JSON.stringify({model:"gpt-image-1",prompt:prompt,size:"1024x1024",n:1})})
    .then(function(r){return r.json();})
    .then(function(d){if(d.error)throw d.error.message;var b64=d.data[0].b64_json;var url=b64?("data:image/png;base64,"+b64):d.data[0].url;window._cmpRender=url;out.innerHTML='<div class="card"><img src="'+url+'" style="width:100%;max-width:360px;border-radius:10px;border:1px solid var(--line);"><div style="margin-top:10px;"><button class="btn sm" onclick="cmpSaveRender()">Enregistrer ce rendu</button></div></div>';})
    .catch(function(e){out.innerHTML='<div class="muted" style="font-size:13px;">Rendu impossible ('+esc(String(e).slice(0,90))+').</div>';});
}
function cmpSaveRender(){if(!window._cmpRender)return;var obj={id:uid(),title:"Rendu IA",img:window._cmpRender,note:cmpItems.slice(0,8).join(", "),url:"",platform:"Image",tags:[]};state.inspirations.unshift(obj);if(!save()){state.inspirations.shift();toast("Mémoire pleine");return;}if(typeof renderInspo==="function")renderInspo();toast("Rendu enregistré");}

document.querySelectorAll("#studioMode button").forEach(function(b){b.addEventListener("click",function(){var s=b.dataset.s;var el=$("studioComposer");if(el)el.style.display=s=="composer"?"block":"none";if(s=="composer")cmpInit();});});
cmpInit();
