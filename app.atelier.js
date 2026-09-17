"use strict";
/* ===== Mode Atelier : la construction pas à pas, à côté de la machine =====
 * Pensé pour le téléphone, debout, les mains prises : grosses cibles, peu de texte.
 */

/* ---------- carnet : barre d'avancement + accès à l'atelier ---------- */
function projetProgress(p){
  var e=p.etapes||[]; if(!e.length)return null;
  var f=e.filter(function(x){return x.fait;}).length;
  return {faites:f, total:e.length, pct:Math.round(f/e.length*100)};
}
function dureeFr(sec){
  sec=Math.max(0,Math.round(sec||0));
  var h=Math.floor(sec/3600), m=Math.floor((sec%3600)/60);
  if(h)return h+" h "+(m<10?"0":"")+m;
  if(m)return m+" min";
  return sec+" s";
}
window.renderProjets=function(){
  var list=state.projets.filter(function(p){
    if(carnetFilter!="tous"&&p.stat!=carnetFilter)return false;
    if(carnetQuery){var h=((p.name||"")+" "+(p.piece||"")+" "+(p.tissu||"")).toLowerCase();if(h.indexOf(carnetQuery)<0)return false;}
    return true;
  });
  var el=$("projetList"); if(!el)return;
  if(!list.length){ el.innerHTML='<div class="empty" style="grid-column:1/-1;">Aucun projet ici pour l\'instant. <button class="btn ghost sm" style="margin-left:8px;" onclick="goView(\'demarrer\')">Trouver une idée</button></div>'; return; }
  el.innerHTML=list.map(function(p){
    var pr=projetProgress(p);
    return '<div class="card">'+
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">'+
        '<div><h3 style="font-size:16px;">'+esc(p.name)+'</h3>'+
        '<div class="muted" style="font-size:13px;margin-top:2px;">'+(p.piece?esc(p.piece):"")+
          (p.piece&&p.diff?" &middot; ":"")+(p.diff?'<span class="tag diff">'+esc(p.diff)+'</span>':"")+'</div></div>'+
        '<button class="x" title="Supprimer" onclick="delProjet('+p.id+')">&times;</button></div>'+
      (p.tissu?'<div style="font-size:13.5px;margin-top:10px;">&#9763; '+esc(p.tissu)+'</div>':'')+
      (p.date?'<div class="muted" style="font-size:13px;margin-top:4px;">&#9200; pour le '+esc(p.date)+'</div>':'')+
      (pr?'<div class="prg"><div class="prg-b"><i style="width:'+pr.pct+'%"></i></div>'+
          '<div class="prg-t">'+pr.faites+' / '+pr.total+' étapes'+(p.tempsPasse?' &middot; '+dureeFr(p.tempsPasse)+' passées':'')+'</div></div>':'')+
      '<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;">'+
        '<button class="pill '+p.stat+'" onclick="cycleStat('+p.id+')" style="border:none;cursor:pointer;">'+STAT[p.stat]+' &#8635;</button>'+
        (pr?'<button class="btn sm" onclick="atelierOpen('+p.id+')">'+(pr.faites?"Reprendre":"Ouvrir l'atelier")+'</button>':
            '<button class="btn ghost sm" onclick="atelierAddSteps('+p.id+')">Ajouter des étapes</button>')+
      '</div></div>';
  }).join("");
};

/* ---------- l'atelier ---------- */
var _atId=null, _atTimer=null, _atStart=0;

function atProjet(){ return state.projets.filter(function(p){return p.id==_atId;})[0]; }

function atelierOpen(id){
  _atId=id;
  var p=atProjet(); if(!p){toast("Projet introuvable");return;}
  if(!p.etapes||!p.etapes.length)return atelierAddSteps(id);
  goView("atelier");
  atelierRender();
}
window.atelierOpen=atelierOpen;

function atelierAddSteps(id){
  var p=state.projets.filter(function(x){return x.id==id;})[0]; if(!p)return;
  var g=(typeof GUIDE_PROJETS!=="undefined")?GUIDE_PROJETS:[];
  var ov=document.getElementById("atModal"); if(ov)ov.remove();
  ov=document.createElement("div"); ov.id="atModal";
  ov.style.cssText="position:fixed;inset:0;background:rgba(46,42,40,.45);display:flex;align-items:center;justify-content:center;z-index:210;padding:16px;";
  ov.innerHTML='<div class="card" style="max-width:460px;width:100%;max-height:86vh;overflow:auto;">'+
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:6px;">'+
      '<h3 style="font-size:17px;">Des étapes pour « '+esc(p.name)+' »</h3>'+
      '<button class="x" onclick="document.getElementById(\'atModal\').remove()">&times;</button></div>'+
    '<p class="muted" style="font-size:13.5px;margin:0 0 14px;line-height:1.5;">Choisis un déroulé tout prêt, ou pars d\'une liste vide à remplir toi-même.</p>'+
    '<div style="display:grid;gap:8px;">'+
      g.map(function(x){ return '<button class="btn ghost" style="text-align:left;justify-content:flex-start;" onclick="atelierApply('+id+',\''+x.id+'\')">'+x.emoji+' '+esc(x.nom)+' <span class="muted" style="font-weight:400;">· '+x.etapes.length+' étapes</span></button>'; }).join("")+
      '<button class="btn ghost" onclick="atelierApply('+id+',\'\')">Liste vide</button>'+
    '</div></div>';
  document.body.appendChild(ov);
  ov.addEventListener("click",function(e){ if(e.target===ov)ov.remove(); });
}
window.atelierAddSteps=atelierAddSteps;

function atelierApply(id,guideId){
  var p=state.projets.filter(function(x){return x.id==id;})[0]; if(!p)return;
  var g=guideId&&typeof guideById==="function"?guideById(guideId):null;
  p.etapes=g?g.etapes.map(function(e){return {t:e.t,min:e.min||0,tech:e.tech||[],conseil:e.conseil||"",fait:false,note:"",photo:""};})
            :[{t:"Préparer le tissu (laver, repasser)",min:10,tech:["décatissage"],conseil:"",fait:false,note:"",photo:""},
              {t:"Couper les pièces",min:30,tech:["coupe"],conseil:"",fait:false,note:"",photo:""},
              {t:"Assembler",min:60,tech:[],conseil:"",fait:false,note:"",photo:""},
              {t:"Finitions et ourlets",min:30,tech:["ourlet"],conseil:"",fait:false,note:"",photo:""}];
  if(g&&!p.guide)p.guide=g.id;
  p.tempsPasse=p.tempsPasse||0;
  save();
  var m=document.getElementById("atModal"); if(m)m.remove();
  atelierOpen(id);
}
window.atelierApply=atelierApply;

function atelierRender(){
  var host=$("atelier"); var p=atProjet(); if(!host||!p)return;
  var pr=projetProgress(p)||{faites:0,total:0,pct:0};
  var next=-1;
  (p.etapes||[]).forEach(function(e,i){ if(next<0&&!e.fait)next=i; });
  var reste=(p.etapes||[]).filter(function(e){return !e.fait;}).reduce(function(a,e){return a+(e.min||0);},0);

  host.innerHTML=
    '<div class="vhead"><button class="btn ghost sm" onclick="atelierClose()">&#8592; Mon carnet</button>'+
      '<h2 class="serif" style="margin-top:12px;">'+esc(p.name)+'</h2>'+
      '<p>'+(pr.total?pr.faites+' étape'+(pr.faites>1?"s":"")+' sur '+pr.total:"")+
      (reste?' &middot; il reste environ '+dureeFr(reste*60):"")+'</p></div>'+

    '<div class="card at-top">'+
      '<div class="prg" style="margin:0 0 12px;"><div class="prg-b"><i style="width:'+pr.pct+'%"></i></div></div>'+
      '<div class="at-time">'+
        '<div><div class="at-tv" id="atChrono">'+dureeFr(p.tempsPasse||0)+'</div><div class="muted" style="font-size:12px;">temps passé</div></div>'+
        '<button class="btn'+(_atTimer?"":" ghost")+'" id="atTimerBtn" onclick="atelierTimer()">'+(_atTimer?"&#9632; Pause":"&#9654; Démarrer")+'</button>'+
      '</div>'+
      (p.tissu?'<div class="muted" style="font-size:13px;margin-top:12px;">&#9763; '+esc(p.tissu)+'</div>':'')+
    '</div>'+

    (next>=0?'<div class="card at-next"><div class="at-nl">Prochaine étape</div>'+
      '<div class="at-nt">'+esc(p.etapes[next].t)+'</div>'+
      (p.etapes[next].conseil?'<div class="at-nc">'+esc(p.etapes[next].conseil)+'</div>':'')+
      '<button class="btn" style="margin-top:12px;" onclick="atelierTick('+next+')">C\'est fait</button></div>'
      :'<div class="card at-done"><b>Toutes les étapes sont faites.</b><div class="muted" style="font-size:13.5px;margin-top:6px;">Ajoute une photo du résultat, puis marque le projet terminé.</div>'+
       '<button class="btn" style="margin-top:12px;" onclick="atelierFinish()">Marquer terminé</button></div>')+

    '<div class="at-list">'+(p.etapes||[]).map(function(e,i){
      return '<div class="at-s'+(e.fait?" ok":"")+(i===next?" now":"")+'">'+
        '<button class="at-c" onclick="atelierTick('+i+')" title="'+(e.fait?"Décocher":"Terminé")+'">'+(e.fait?"&#10003;":(i+1))+'</button>'+
        '<div class="at-b">'+
          '<div class="at-t">'+esc(e.t)+'</div>'+
          '<div class="at-m">'+(e.min?e.min+' min':"")+
            (e.tech&&e.tech.length?' &middot; '+e.tech.map(esc).join(", "):"")+'</div>'+
          (e.conseil?'<div class="at-h">'+esc(e.conseil)+'</div>':"")+
          (e.note?'<div class="at-n">'+esc(e.note)+'</div>':"")+
          (e.photo?'<img class="at-img" src="'+esc(e.photo)+'" alt="">':"")+
          '<div class="at-a">'+
            '<button onclick="atelierNote('+i+')">'+(e.note?"Modifier la note":"Note")+'</button>'+
            '<button onclick="atelierPhoto('+i+')">'+(e.photo?"Changer la photo":"Photo")+'</button>'+
            '<button onclick="atelierDel('+i+')">Retirer</button>'+
          '</div>'+
        '</div></div>';
    }).join("")+'</div>'+

    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;">'+
      '<button class="btn ghost sm" onclick="atelierAdd()">+ Ajouter une étape</button>'+
      '<button class="btn ghost sm" onclick="atelierFinish()">Marquer terminé</button>'+
    '</div>';
}
window.atelierRender=atelierRender;

function atelierClose(){
  atelierStop();
  if(typeof renderProjets==="function"){ renderProjets(); renderCarnetStats(); }
  goView("carnet");
}
window.atelierClose=atelierClose;

function atelierTick(i){
  var p=atProjet(); if(!p||!p.etapes[i])return;
  p.etapes[i].fait=!p.etapes[i].fait;
  if(p.etapes[i].fait&&p.stat==="envie")p.stat="cours";
  save(); atelierRender();
  if(typeof renderCarnetStats==="function"){ renderCarnetStats(); renderProjets(); }
  var reste=p.etapes.filter(function(e){return !e.fait;}).length;
  if(!reste)toast("Toutes les étapes sont faites &#127881;");
}
window.atelierTick=atelierTick;

function atelierNote(i){
  var p=atProjet(); if(!p||!p.etapes[i])return;
  var v=prompt("Note pour « "+p.etapes[i].t+" » :",p.etapes[i].note||"");
  if(v===null)return;
  p.etapes[i].note=v.trim(); save(); atelierRender();
}
window.atelierNote=atelierNote;

function atelierPhoto(i){
  var p=atProjet(); if(!p||!p.etapes[i])return;
  var inp=document.createElement("input");
  inp.type="file"; inp.accept="image/*"; inp.style.display="none";
  document.body.appendChild(inp);
  inp.addEventListener("change",function(){
    var f=inp.files&&inp.files[0];
    if(!f){inp.remove();return;}
    var rd=new FileReader();
    rd.onload=function(){
      var img=new Image();
      img.onload=function(){
        var max=900,w=img.width,h=img.height;
        if(w>max||h>max){var r=Math.min(max/w,max/h);w=Math.round(w*r);h=Math.round(h*r);}
        var cv=document.createElement("canvas");cv.width=w;cv.height=h;
        cv.getContext("2d").drawImage(img,0,0,w,h);
        p.etapes[i].photo=cv.toDataURL("image/jpeg",0.74);
        if(!save())toast("Enregistrement impossible");
        atelierRender(); inp.remove();
      };
      img.onerror=function(){toast("Image illisible");inp.remove();};
      img.src=rd.result;
    };
    rd.readAsDataURL(f);
  });
  inp.click();
}
window.atelierPhoto=atelierPhoto;

function atelierAdd(){
  var p=atProjet(); if(!p)return;
  var t=prompt("Nouvelle étape :","");
  if(t===null||!t.trim())return;
  p.etapes.push({t:t.trim(),min:0,tech:[],conseil:"",fait:false,note:"",photo:""});
  save(); atelierRender();
}
window.atelierAdd=atelierAdd;

function atelierDel(i){
  var p=atProjet(); if(!p||!p.etapes[i])return;
  if(!confirm("Retirer « "+p.etapes[i].t+" » ?"))return;
  p.etapes.splice(i,1); save(); atelierRender();
}
window.atelierDel=atelierDel;

function atelierFinish(){
  var p=atProjet(); if(!p)return;
  atelierStop();
  p.stat="fini"; save();
  if(typeof renderProjets==="function"){renderProjets();renderCarnetStats();}
  toast("Projet terminé — bravo");
  goView("carnet");
}
window.atelierFinish=atelierFinish;

/* ---------- chronomètre ---------- */
function atelierTimer(){ if(_atTimer)atelierStop(); else atelierStart(); }
window.atelierTimer=atelierTimer;
function atelierStart(){
  if(_atTimer)return;
  _atStart=Date.now();
  _atTimer=setInterval(function(){
    var p=atProjet(); if(!p)return atelierStop();
    var el=document.getElementById("atChrono");
    if(el)el.textContent=dureeFr((p.tempsPasse||0)+(Date.now()-_atStart)/1000);
  },1000);
  var b=document.getElementById("atTimerBtn");
  if(b){ b.innerHTML="&#9632; Pause"; b.classList.remove("ghost"); }
}
function atelierStop(){
  if(!_atTimer)return;
  clearInterval(_atTimer); _atTimer=null;
  var p=atProjet();
  if(p){ p.tempsPasse=(p.tempsPasse||0)+Math.round((Date.now()-_atStart)/1000); save(); }
  var b=document.getElementById("atTimerBtn");
  if(b){ b.innerHTML="&#9654; Démarrer"; b.classList.add("ghost"); }
  var el=document.getElementById("atChrono");
  if(el&&p)el.textContent=dureeFr(p.tempsPasse||0);
}
window.atelierStop=atelierStop;
window.addEventListener("beforeunload",atelierStop);
document.addEventListener("visibilitychange",function(){ if(document.hidden)atelierStop(); });

/* on quitte la vue atelier : on arrête le chrono */
(function(){
  var _go=window.goView;
  window.goView=function(v){ if(v!=="atelier")atelierStop(); _go(v); };
})();

(function(){ if(typeof renderProjets==="function"&&document.getElementById("projetList"))renderProjets(); })();
