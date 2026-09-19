"use strict";
/* ===== Vue « Portée » : le vêtement sur sa silhouette, dans son tissu =====
 * Même source que le dessin technique (les vraies pièces du patron, à ses mesures),
 * mais posé sur une silhouette pleine, manches tombantes, avec un modelé léger :
 * elle voit l'allure et la longueur sur SON corps, dans SON tissu.
 */
var PO_TEINTS=[
  {id:"mannequin",nom:"Mannequin",fill:"#ece5da",trait:"#c9bdad"},
  {id:"clair",nom:"Clair",fill:"#f3d9c6",trait:"#d4b39c"},
  {id:"mate",nom:"Mat",fill:"#d3a27f",trait:"#b0805e"},
  {id:"fonce",nom:"Foncé",fill:"#8d5b3e",trait:"#6e432b"}
];
function poTeint(){
  var id=(typeof state!=="undefined"&&state.portee&&state.portee.teint)||"mannequin";
  return PO_TEINTS.filter(function(t){ return t.id===id; })[0]||PO_TEINTS[0];
}
function poDefs(){
  /* modelé : le flanc s'assombrit, le milieu prend un peu de lumière */
  function lin(id,x1,x2,stops){
    return '<linearGradient id="'+id+'" x1="'+x1+'" y1="0" x2="'+x2+'" y2="0">'+stops.map(function(s){
      return '<stop offset="'+s[0]+'" stop-color="'+s[1]+'" stop-opacity="'+s[2]+'"/>'; }).join("")+'</linearGradient>';
  }
  var flanc=[[0,"#000",.20],[.22,"#000",.07],[.45,"#000",0],[.8,"#fff",.10],[1,"#fff",.04]];
  return lin("poL",0,1,flanc)+lin("poR",1,0,flanc)+
    lin("poC",0,1,[[0,"#000",.18],[.25,"#000",.04],[.5,"#fff",.10],[.75,"#000",.04],[1,"#000",.17]])+
    '<radialGradient id="poSol" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".16"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>';
}

/* la vue portée suppose un vêtement symétrique (devant ou dos coupé au pli) :
   un devant cache-cœur ou asymétrique se lirait faux sur la silhouette */
function poPossible(board){
  if(!board||!flatAssemblable(board))return false;
  var p=board.pieces.filter(function(x){ return x.role==="devant"; })[0]||board.pieces.filter(function(x){ return x.role==="dos"; })[0];
  return !!(p&&p.fold&&p.fold.axe==="v");
}
(function(){
  var base=window.flatSvg;
  if(typeof base!=="function")return;
  window.flatSvg=function(board,mode){
    if(mode!=="portee")return base.apply(this,arguments);
    if(!poPossible(board))return base.call(this,board,flatAssemblable(board)?"assemble":"pieces");
    var t=poTeint();
    var sv={c:window.FLAT_CORPS,p:window.FLAT_PORTEE,a:window.FLAT_ANG,o:window.FLAT_CORPS_OPT};
    window.FLAT_CORPS=true; window.FLAT_PORTEE=true; window.FLAT_ANG=7;
    window.FLAT_CORPS_OPT={fill:t.fill,trait:t.trait,ep:3,reperes:false};
    var s;
    try{ s=base.call(this,board,"assemble"); }
    finally{ window.FLAT_CORPS=sv.c; window.FLAT_PORTEE=sv.p; window.FLAT_ANG=sv.a; window.FLAT_CORPS_OPT=sv.o; }
    s=s.replace(/(<svg[^>]*>)/,'$1<defs>'+poDefs()+'</defs>');
    return s.replace('<svg ','<svg class="po-svg" ');
  };
})();

/* un bouton « Portée » à côté de « Vêtement » et « Planche de pièces » */
function poInit(){
  var seg=document.getElementById("tkMode");
  if(!seg||seg.querySelector('[data-m="portee"]'))return;
  var b=document.createElement("button"); b.dataset.m="portee"; b.textContent="Portée";
  b.title="Le vêtement sur ta silhouette, dans ton tissu";
  seg.insertBefore(b,seg.children[1]||null);
  b.addEventListener("click",function(){
    seg.querySelectorAll("button").forEach(function(n){ n.classList.remove("on"); });
    b.classList.add("on"); TK.mode="portee"; tkDraw();
  });
  /* le teint de la silhouette */
  var sel=document.createElement("div"); sel.id="poTeints"; sel.className="po-teints";
  sel.innerHTML='<span class="muted">Silhouette</span>'+PO_TEINTS.map(function(t){
    return '<button type="button" data-t="'+t.id+'" title="'+esc(t.nom)+'" style="background:'+t.fill+';border-color:'+t.trait+'"></button>'; }).join("");
  seg.parentNode.appendChild(sel);
  sel.addEventListener("click",function(e){
    var x=e.target.closest("button[data-t]"); if(!x)return;
    state.portee={teint:x.dataset.t}; save(); poMaj(); tkDraw();
  });
  poMaj();
}
function poNote(){
  if(typeof TK==="undefined"||TK.mode!=="portee"||!TK.board||poPossible(TK.board))return;
  var n=document.getElementById("tkNote");
  if(n&&n.textContent.indexOf("Portée")<0)n.textContent="Portée : pour les hauts et robes symétriques. Ce modèle s'affiche en dessin technique. "+n.textContent;
}
function poMaj(){
  var sel=document.getElementById("poTeints"); if(!sel)return;
  sel.hidden=(typeof TK==="undefined"||TK.mode!=="portee");
  var id=poTeint().id;
  sel.querySelectorAll("button").forEach(function(b){ b.classList.toggle("on",b.dataset.t===id); });
}
(function(){
  var d=window.tkDraw;
  if(typeof d==="function")window.tkDraw=function(){ poMaj(); var r=d.apply(this,arguments); setTimeout(poNote,700); return r; };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",poInit); else poInit();
})();
window.poTeint=poTeint; window.poPossible=poPossible; window.PO_TEINTS=PO_TEINTS;
