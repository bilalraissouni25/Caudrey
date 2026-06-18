"use strict";
/* ===== Bibliothèque de patrons FreeSewing — 100% in-app, sans redirection ===== */
var FSCATALOG=[
  {slug:"teagan",name:"Teagan — t-shirt",type:"top",level:"Débutant",desc:"T-shirt ajusté, parfait pour débuter le jersey."},
  {slug:"aaron",name:"Aaron — débardeur",type:"top",level:"Débutant",desc:"Débardeur simple, idéal premier vêtement en maille."},
  {slug:"sandy",name:"Sandy — jupe cercle",type:"jupe",level:"Débutant",desc:"Jupe cercle évasée, très peu de coutures."},
  {slug:"shin",name:"Shin — short",type:"pantalon",level:"Débutant",desc:"Short confortable à taille élastique."},
  {slug:"hortensia",name:"Hortensia — sac banane",type:"accessoire",level:"Débutant",desc:"Petit sac banane, rapide à coudre."},
  {slug:"sven",name:"Sven — sweat-shirt",type:"top",level:"Intermédiaire",desc:"Sweat-shirt classique en molleton."},
  {slug:"hugo",name:"Hugo — sweat à capuche",type:"top",level:"Intermédiaire",desc:"Hoodie avec capuche et poche kangourou."},
  {slug:"wahid",name:"Wahid — gilet",type:"manteau",level:"Intermédiaire",desc:"Gilet sans manche structuré."},
  {slug:"holmes",name:"Holmes — cagoule",type:"accessoire",level:"Intermédiaire",desc:"Cagoule chaude et ajustée."},
  {slug:"simone",name:"Simone — chemise femme",type:"top",level:"Avancé",desc:"Chemise classique : col, poignets, pli dos."},
  {slug:"simon",name:"Simon — chemise",type:"top",level:"Avancé",desc:"Chemise à coupe nette, col et empiècement."},
  {slug:"breanna",name:"Breanna — bloc robe",type:"robe",level:"Avancé",desc:"Bloc de base robe femme, à personnaliser."}
];
var FSMETA={}; FSCATALOG.forEach(function(d){FSMETA[d.slug]=d;});
try{ if(typeof PATLIB!=="undefined")PATLIB.length=0; }catch(e){}

function fsOverrides(){
  var m=(state.profil&&state.profil.mesures)||{}, o={};
  if(m.poitrine)o.chest=Math.round(m.poitrine*10);
  if(m.taille)o.waist=Math.round(m.taille*10);
  if(m.hanches){o.hips=Math.round(m.hanches*10);o.seat=Math.round(m.hanches*10);}
  if(m.dos)o.hpsToWaistBack=Math.round(m.dos*10);
  if(m.genou)o.waistToKnee=Math.round(m.genou*10);
  if(m.poignet)o.wrist=Math.round(m.poignet*10);
  return o;
}
function renderPatList(){
  var ft=$("patFType").value, fl=$("patFLevel").value, el=$("patList"); if(!el)return; var cards=[];
  state.patrons.forEach(function(p){ if(ft!="tous"&&ft!="repere"&&p.type!=ft)return; if(fl!="tous")return; cards.push(reperedCard(p)); });
  if(ft!="repere"){ FSCATALOG.filter(function(d){return (ft=="tous"||d.type==ft)&&(fl=="tous"||d.level==fl);}).forEach(function(d){ cards.push(fsCard(d)); }); }
  if(!cards.length){ el.innerHTML='<div class="empty" style="grid-column:1/-1;">Aucun patron pour ce filtre.</div>'; return; }
  el.innerHTML=cards.join(""); lazyFsThumbs();
}
function fsCard(d){
  var col=(typeof TYPECOL!=="undefined"&&TYPECOL[d.type])||"#9c5d7c";
  var cached=state.patImg&&state.patImg["fs:"+d.slug];
  var top=cached
    ? '<div class="top" data-fs="'+d.slug+'" style="background:#fff;background-image:url(\''+cached+'\');background-size:contain;background-repeat:no-repeat;background-position:center;"></div>'
    : '<div class="top" data-fs="'+d.slug+'" style="background:'+col+';">'+(typeof garmentFlat==="function"?garmentFlat(d.type):"")+'</div>';
  return '<div class="patcard">'+top+'<div class="bd"><div style="font-weight:600;">'+esc(d.name)+'</div>'+
    '<div class="muted" style="font-size:13px;margin-bottom:6px;">FreeSewing · open-source</div>'+
    '<div style="margin-bottom:8px;"><span class="tag lvl">'+esc(d.level)+'</span></div>'+
    '<div class="muted" style="font-size:13px;min-height:38px;">'+esc(d.desc)+'</div>'+
    '<button class="btn sm" style="margin-top:10px;" onclick="openPattern(\''+d.slug+'\')">Ouvrir le patron</button> '+
    '<button class="btn ghost sm" onclick="fsCatToCarnet(\''+d.slug+'\')">+ carnet</button></div></div>';
}
function reperedCard(p){
  var ph=p.img?'<div class="ph" style="background-image:url(\''+(p.img.indexOf("data:")===0?p.img:esc(p.img))+'\')"></div>':'<div class="ph">&#9986; patron</div>';
  var src=p.url?'<a href="'+esc(p.url)+'" target="_blank" rel="noopener">ouvrir la source &#8599;</a>':'';
  return '<div class="insp">'+ph+'<div class="bd"><div style="display:flex;justify-content:space-between;align-items:center;gap:6px;"><span class="tag typ">repéré'+(p.type?" · "+esc(p.type):"")+'</span><button class="x" onclick="delPattern('+p.id+')">&times;</button></div><h4>'+esc(p.title)+'</h4>'+(p.note?'<div class="muted" style="font-size:13px;">'+esc(p.note)+'</div>':'')+'<div style="margin-top:10px;display:flex;gap:10px;align-items:center;font-size:13px;flex-wrap:wrap;"><button class="btn ghost sm" onclick="patternReperToProjet('+p.id+')">&#8594; carnet</button>'+src+'</div></div></div>';
}
function fsCatToCarnet(slug){
  var d=FSMETA[slug]||{name:slug,level:"Intermédiaire"};
  state.projets.unshift({id:uid(),name:d.name+" (FreeSewing, sur mesure)",piece:"Patron sur mesure",diff:d.level||"Intermédiaire",stat:"envie",tissu:"",date:""});
  save(); if(typeof renderProjets==="function"){renderProjets();renderCarnetStats();} toast("Ajouté au carnet");
}

/* ===== Page patron interne ===== */
function openPattern(slug){
  var d=FSMETA[slug]; if(!d)return; var host=$("patternpage"); if(!host)return;
  host.innerHTML='<div class="vhead"><button class="btn ghost sm" onclick="closePattern()">&#8592; Retour à la bibliothèque</button>'+
    '<h2 class="serif" style="margin-top:12px;">'+esc(d.name)+'</h2><p>FreeSewing · open-source · niveau '+esc(d.level)+'</p></div>'+
    '<div class="card" style="margin-bottom:16px;"><p class="muted" style="font-size:14px;margin:0 0 12px;line-height:1.6;">'+esc(d.desc)+' Le patron est généré sur mesure à partir de tes mesures (onglet Mon profil), complétées par une base taille 38.</p>'+
    '<div style="display:flex;gap:8px;flex-wrap:wrap;"><button class="btn" onclick="patGenerate(\''+slug+'\')">Générer / régénérer</button>'+
    '<button class="btn ghost" onclick="patPrint()">Imprimer le patron</button>'+
    '<button class="btn ghost" onclick="fsCatToCarnet(\''+slug+'\')">+ carnet</button></div>'+
    '<div id="patpStatus" class="muted" style="font-size:13px;margin-top:10px;"></div></div>'+
    '<div id="patpOut" style="background:#fff;border-radius:12px;border:1px solid var(--line);padding:10px;min-height:320px;"></div>';
  goView("patternpage"); patGenerate(slug);
}
function closePattern(){ goView("patrons"); }
function patGenerate(slug){
  var st=$("patpStatus"), out=$("patpOut");
  if(!window.FS||typeof window.FS.draft!=="function"){ if(st)st.textContent="Moteur FreeSewing non chargé. Recharge la page (en ligne)."; return; }
  if(st)st.innerHTML='<span class="spin"></span> Génération de ton patron sur mesure…';
  setTimeout(function(){
    try{ var svg=window.FS.draft(slug, fsOverrides()); if(!svg||svg.indexOf("<svg")<0)throw new Error("rendu vide");
      window._patpSvg=svg; if(out)out.innerHTML='<div style="overflow:auto;max-height:640px;">'+svg+'</div>'; if(st)st.textContent="Patron généré à partir de tes mesures.";
    }catch(e){ if(st)st.textContent="Erreur de génération : "+String((e&&e.message)||e).slice(0,120); }
  },40);
}
function patPrint(){
  if(!window._patpSvg)return; var w=window.open("","_blank"); if(!w){toast("Autorise les pop-ups pour imprimer");return;}
  w.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Mon patron</title><style>@page{margin:8mm}body{margin:0}</style></head><body>'+window._patpSvg+'</body></html>'); w.document.close();
  setTimeout(function(){try{w.print();}catch(e){}},500);
}

/* ===== Vignettes : vrai patron rasterisé, mis en cache ===== */
function lazyFsThumbs(){
  if(!window.FS)return;
  var nodes=[].slice.call(document.querySelectorAll('#patList .top[data-fs]')).filter(function(n){return !n.style.backgroundImage;});
  var i=0;
  function nx(){ if(i>=nodes.length)return; var n=nodes[i++]; var slug=n.getAttribute("data-fs");
    if(state.patImg&&state.patImg["fs:"+slug]){ setThumb(n,state.patImg["fs:"+slug]); return nx(); }
    fsThumb(slug,function(data){ if(data){ if(!state.patImg)state.patImg={}; state.patImg["fs:"+slug]=data; save(); setThumb(n,data); } setTimeout(nx,80); });
  }
  nx();
}
function setThumb(n,data){ n.style.background="#fff"; n.style.backgroundImage="url('"+data+"')"; n.style.backgroundSize="contain"; n.style.backgroundRepeat="no-repeat"; n.style.backgroundPosition="center"; n.innerHTML=""; }
function fsThumb(slug,cb){ try{ var svg=window.FS.draft(slug, fsOverrides()); rasterizeSvg(svg,320,240,cb); }catch(e){ cb(null); } }
function rasterizeSvg(svg,w,h,cb){
  try{
    var blob=new Blob([svg],{type:"image/svg+xml;charset=utf-8"}); var url=URL.createObjectURL(blob); var img=new Image();
    img.onload=function(){ try{ var cv=document.createElement("canvas"); cv.width=w; cv.height=h; var x=cv.getContext("2d"); x.fillStyle="#fff"; x.fillRect(0,0,w,h);
      var iw=img.width||320, ih=img.height||240; var r=Math.min(w/iw,h/ih); var dw=iw*r, dh=ih*r; x.drawImage(img,(w-dw)/2,(h-dh)/2,dw,dh); URL.revokeObjectURL(url); cb(cv.toDataURL("image/jpeg",0.82)); }catch(e){ cb(null); } };
    img.onerror=function(){ URL.revokeObjectURL(url); cb(null); };
    img.src=url;
  }catch(e){ cb(null); }
}

/* (ré)initialise la bibliothèque avec la nouvelle logique */
(function(){
  var a=$("patFType"), b=$("patFLevel");
  if(a)a.addEventListener("change",renderPatList);
  if(b)b.addEventListener("change",renderPatList);
  renderPatList();
})();
