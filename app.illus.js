"use strict";
/* ===== Touche personnelle : mascottes (illustrations de l'utilisatrice) par section ===== */
(function(){
  var base="Illustrations/image-removebg-preview";
  function p(n){return base+"%28"+n+"%29.png";}
  /* une illustration cohérente par étape */
  var ILLUS={
    inspirations:p(25),   /* moodboard sur chevalet */
    assistant:p(15),      /* café + carnet de croquis */
    studio:p(24),         /* dessin sur tablette graphique */
    patrons:p(20),        /* examen d'un patron à la loupe */
    tissu:p(11),          /* assise sur une pile de tissus */
    carnet:p(9),          /* machine à coudre */
    capsule:p(26),        /* rêverie de robes */
    profil:p(17),         /* tableau de mesures sur ordi */
    donnees:p(8)          /* téléphone avec l'app */
  };
  function inject(){
    var st=document.createElement("style");
    st.textContent='.vhead{position:relative;min-height:70px;padding-right:160px;}'+
      '.mascotte{position:absolute;right:4px;top:-22px;height:138px;width:auto;pointer-events:none;filter:drop-shadow(0 6px 12px rgba(46,42,40,.14));}'+
      '.empty-illus{height:150px;width:auto;display:block;margin:0 auto 12px;opacity:.95;}'+
      '@media(max-width:820px){.vhead{padding-right:0;} .mascotte{display:none;}}';
    document.head.appendChild(st);
    Object.keys(ILLUS).forEach(function(v){
      var sec=document.getElementById(v); if(!sec)return;
      var vh=sec.querySelector(".vhead"); if(!vh||vh.querySelector(".mascotte"))return;
      var img=document.createElement("img");
      img.className="mascotte"; img.src=ILLUS[v]; img.alt=""; img.loading="lazy";
      img.onerror=function(){img.style.display="none";};
      vh.appendChild(img);
    });
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",inject); else inject();
})();
