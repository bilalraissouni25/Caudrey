"use strict";
/* ===== Accueil « Aujourd'hui » =====
 * L'app s'ouvrait sur le carnet, donc sur une liste. Elle s'ouvre maintenant sur
 * une seule question : qu'est-ce que je fais maintenant ?
 */

function acSalut(){
  var h=new Date().getHours();
  if(h<6)return "Bonne nuit";
  if(h<12)return "Bonjour";
  if(h<18)return "Bon après-midi";
  return "Bonsoir";
}
function acMesuresFaites(){
  if(typeof MES_LISTE==="undefined"||typeof mesGet!=="function")return null;
  var m=mesGet(), ob=MES_LISTE.filter(function(x){return !x.option;});
  var n=ob.filter(function(x){return m[x.k]!=null&&m[x.k]!==""&&!isNaN(m[x.k]);}).length;
  return {faites:n,total:ob.length};
}
function acEnCours(){
  var l=state.projets.filter(function(p){return p.stat==="cours";});
  l.sort(function(a,b){
    var pa=(a.etapes||[]).filter(function(e){return e.fait;}).length;
    var pb=(b.etapes||[]).filter(function(e){return e.fait;}).length;
    return pb-pa;
  });
  return l[0]||null;
}

function acRender(){
  var host=$("accueil"); if(!host)return;
  var p=acEnCours(), mes=acMesuresFaites();
  var envies=state.projets.filter(function(x){return x.stat==="envie";}).length;
  var finis=state.projets.filter(function(x){return x.stat==="fini";}).length;
  var insp=(state.inspirations||[]).length;

  var bloc="";
  if(p){
    var e=p.etapes||[], next=-1;
    e.forEach(function(x,i){ if(next<0&&!x.fait)next=i; });
    var faites=e.filter(function(x){return x.fait;}).length;
    var pct=e.length?Math.round(faites/e.length*100):0;
    bloc='<div class="card ac-now">'+
      '<div class="ac-lbl">En cours</div>'+
      '<div class="ac-titre">'+esc(p.name)+'</div>'+
      (e.length?'<div class="prg" style="margin-top:10px;"><div class="prg-b"><i style="width:'+pct+'%"></i></div>'+
        '<div class="prg-t">'+faites+' / '+e.length+' étapes'+(p.tempsPasse&&typeof dureeFr==="function"?' &middot; '+dureeFr(p.tempsPasse):"")+'</div></div>':'')+
      (next>=0?'<div class="ac-etape"><span class="ac-el">Prochaine étape</span>'+esc(e[next].t)+'</div>':'')+
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;">'+
        (e.length?'<button class="btn" onclick="atelierOpen('+p.id+')">Continuer</button>':
                  '<button class="btn" onclick="atelierAddSteps('+p.id+')">Découper en étapes</button>')+
        '<button class="btn ghost" onclick="goView(\'carnet\')">Mon carnet</button>'+
      '</div></div>';
  } else {
    bloc='<div class="card ac-now ac-empty">'+
      '<div class="ac-lbl">Rien en cours</div>'+
      '<div class="ac-titre">'+(envies?"Et si on lançait une de tes envies ?":"Prête à coudre quelque chose ?")+'</div>'+
      '<p class="muted" style="font-size:13.5px;line-height:1.55;margin:10px 0 0;">'+
        (envies?"Tu as "+envies+" projet"+(envies>1?"s":"")+" en attente dans le carnet.":
                "Cinq questions et l'app propose trois projets taillés pour toi, avec le tissu et le budget.")+'</p>'+
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;">'+
        '<button class="btn" onclick="goView(\''+(envies?"carnet":"demarrer")+'\')">'+(envies?"Voir mes envies":"Trouver un projet")+'</button>'+
        (envies?'<button class="btn ghost" onclick="goView(\'demarrer\')">Autre idée</button>':"")+
      '</div></div>';
  }

  var pistes=[];
  if(mes&&mes.faites<mes.total)
    pistes.push({t:"Compléter les mesures",d:mes.faites+" sur "+mes.total+" — les patrons seront justes",v:"profil",e:"&#128207;"});
  if(!insp)
    pistes.push({t:"Épingler une inspiration",d:"un lien, une capture, une photo",v:"inspirations",e:"&#10047;"});
  if(insp&&!state.designs)
    pistes.push({t:"Dessiner une idée",d:"le studio, sans savoir dessiner",v:"studio",e:"&#9998;"});
  pistes.push({t:"Générer un patron sur mesure",d:"68 modèles, imprimables en A4",v:"patrons",e:"&#9986;"});
  if(insp)
    pistes.push({t:"Revoir mes inspirations",d:insp+" épinglée"+(insp>1?"s":""),v:"inspirations",e:"&#128247;"});

  var vign=(state.inspirations||[]).filter(function(x){return x.img;}).slice(0,6);

  host.innerHTML=
    '<div class="vhead"><h2 class="serif">'+acSalut()+'</h2><p>'+
      (finis?finis+" pièce"+(finis>1?"s":"")+" terminée"+(finis>1?"s":"")+" jusqu'ici.":"Ton atelier, en une page.")+'</p></div>'+
    bloc+
    '<div class="ac-kpis">'+
      '<div class="ac-k"><b>'+(state.projets.filter(function(x){return x.stat==="cours";}).length)+'</b><span>en cours</span></div>'+
      '<div class="ac-k"><b>'+envies+'</b><span>envies</span></div>'+
      '<div class="ac-k"><b>'+finis+'</b><span>terminés</span></div>'+
      '<div class="ac-k"><b>'+insp+'</b><span>inspirations</span></div>'+
    '</div>'+
    '<div class="ac-pistes">'+pistes.slice(0,4).map(function(x){
      return '<button class="ac-p" onclick="goView(\''+x.v+'\')"><span>'+x.e+'</span><b>'+esc(x.t)+'</b><small>'+esc(x.d)+'</small></button>';
    }).join("")+'</div>'+
    (vign.length?'<div class="ac-sec">Tes dernières inspirations</div>'+
      '<div class="ac-vign">'+vign.map(function(x){
        return '<div class="ac-v" onclick="goView(\'inspirations\')" style="background-image:url(\''+(x.img.indexOf("data:")===0||x.img.indexOf("blob:")===0?x.img:esc(x.img))+'\')"></div>';
      }).join("")+'</div>':"");
}
window.acRender=acRender;

/* on rafraîchit l'accueil à chaque fois qu'on y revient */
(function(){
  var _go=window.goView;
  window.goView=function(v){ if(v==="accueil")acRender(); _go(v); };
})();

/* l'app démarre sur l'accueil, sauf si un partage ou un lien vise autre chose */
(function(){
  var qs=new URLSearchParams(location.search);
  if(qs.get("shared")||qs.get("paste")||qs.get("url")||qs.get("text"))return;
  acRender();
  goView("accueil");
})();
