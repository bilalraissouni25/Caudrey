"use strict";
/* ===== iPhone : le Studio pensé pour le téléphone =====
 * - le menu se replie dans une barre du haut (avant : 15 boutons à faire défiler à chaque écran)
 * - Dessin technique : le dessin d'abord, collé en haut de l'écran pendant qu'elle bouge
 *   les curseurs, pour voir le vêtement changer sous son doigt
 * - les onglets du Studio défilent sur une ligne
 */
var MOB_MQ=window.matchMedia?window.matchMedia("(max-width:760px)"):{matches:false,addListener:function(){}};

function mobMenu(ouvrir){
  var nav=document.querySelector(".nav"); if(!nav)return;
  var o=(typeof ouvrir==="boolean")?ouvrir:!nav.classList.contains("ouvert");
  nav.classList.toggle("ouvert",o);
  var b=document.getElementById("mobMenuBtn"); if(b)b.setAttribute("aria-expanded",o?"true":"false");
}

function mobTitre(){
  var t=document.getElementById("mobVue"), a=document.querySelector(".navbtn.active");
  if(t)t.textContent=a?a.textContent.replace(/^\s*[\d☀-➿☼✿✎☌☉↻]+\s*/,"").trim():"";
}

function mobInitNav(){
  var brand=document.querySelector(".nav .brand"); if(!brand||document.getElementById("mobMenuBtn"))return;
  brand.insertAdjacentHTML("beforeend",'<span id="mobVue" class="mob-vue"></span><button id="mobMenuBtn" class="mob-menu" aria-expanded="false" aria-label="Menu" onclick="mobMenu()"><span></span><span></span><span></span></button>');
  document.querySelectorAll(".navbtn").forEach(function(b){ b.addEventListener("click",function(){ mobMenu(false); setTimeout(mobTitre,0); }); });
  document.querySelectorAll("#stepper .s").forEach(function(s){ s.addEventListener("click",function(){ setTimeout(mobTitre,0); }); });
  mobTitre();
}

/* l'onglet actif du Studio reste visible dans la barre qui défile */
function mobOngletVisible(){
  if(!MOB_MQ.matches)return;
  var sm=document.getElementById("studioMode"), on=sm&&sm.querySelector("button.on");
  if(!on)return;
  var l=on.offsetLeft-sm.offsetLeft, r=l+on.offsetWidth;
  if(l<sm.scrollLeft||r>sm.scrollLeft+sm.clientWidth)sm.scrollLeft=Math.max(0,l-24);
}

/* Dessin technique : sur téléphone, les réglages passent sous le dessin (qui reste visible) */
function mobPlacerOptions(){
  var grid=document.querySelector("#studioTech .tk-grid"); if(!grid)return;
  var opts=document.getElementById("tkOptsCard")||grid.querySelector(".st-panel #tkOpts")&&grid.querySelector("#tkOpts").closest(".st-panel");
  if(!opts)return; opts.id="tkOptsCard";
  var col=document.getElementById("tkPair")&&document.getElementById("tkPair").parentNode;
  if(!col)return;
  if(MOB_MQ.matches){
    if(opts.parentNode!==col){ col.insertBefore(opts,document.getElementById("tkPair").nextSibling); }
    col.classList.add("mob-col");
    if(!opts.dataset.mob){
      opts.dataset.mob="1";
      var ph=opts.querySelector(".st-ph");
      if(ph){ ph.classList.add("mob-ph"); ph.addEventListener("click",function(){ if(MOB_MQ.matches)opts.classList.toggle("mob-ouvert"); }); }
    }
  }else{
    if(opts.parentNode!==grid){ grid.insertBefore(opts,grid.firstChild); }
    col.classList.remove("mob-col"); opts.classList.remove("mob-ouvert");
  }
}

(function(){
  function init(){
    mobInitNav(); mobPlacerOptions();
    var sm=document.getElementById("studioMode");
    if(sm)new MutationObserver(mobOngletVisible).observe(sm,{subtree:true,attributes:true,attributeFilter:["class"]});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init); else init();
  if(MOB_MQ.addEventListener)MOB_MQ.addEventListener("change",mobPlacerOptions); else MOB_MQ.addListener(mobPlacerOptions);
  var gv=window.goView;
  if(typeof gv==="function")window.goView=function(v){ var r=gv.apply(this,arguments); mobMenu(false); mobTitre(); return r; };
  /* ouvrir les réglages quand elle arrive d'« Imaginer → Modifier » sur téléphone */
  var tkShow0=window.tkShow;
  if(typeof tkShow0==="function")window.tkShow=function(){ var r=tkShow0.apply(this,arguments); mobPlacerOptions(); return r; };
})();
window.mobMenu=mobMenu; window.mobPlacerOptions=mobPlacerOptions;
