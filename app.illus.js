"use strict";
/* ===== Touche personnelle : mascottes (illustrations de l'utilisatrice) par section ===== */
(function(){
  var ILLUS={inspirations:25,assistant:15,studio:24,patrons:20,tissu:11,carnet:9,capsule:26,profil:17,donnees:8};
  function paths(n){var f="image-removebg-preview%28"+n+"%29.png";return [f,"Illustrations/"+f,"illustrations/"+f];}
  function setSrc(img,list,i){ if(i>=list.length){img.style.display="none";return;} img.onerror=function(){setSrc(img,list,i+1);}; img.src=list[i]; }
  function inject(){
    var st=document.createElement("style"); st.id="mascotte-style";
    st.textContent='.vhead{position:relative;min-height:72px;padding-right:168px;}'+
      '.mascotte{position:absolute;right:4px;top:-22px;height:142px;width:auto;pointer-events:none;filter:drop-shadow(0 6px 12px rgba(46,42,40,.16));}'+
      '@media(max-width:860px){.vhead{padding-right:0;} .mascotte{position:static;display:block;height:120px;margin:8px 0 0;}}'+
      '@media(max-width:480px){.mascotte{display:none;}}';
    document.head.appendChild(st);
    Object.keys(ILLUS).forEach(function(v){
      var sec=document.getElementById(v); if(!sec)return;
      var vh=sec.querySelector(".vhead"); if(!vh||vh.querySelector(".mascotte"))return;
      var img=document.createElement("img"); img.className="mascotte"; img.alt=""; img.loading="lazy";
      vh.appendChild(img); setSrc(img,paths(ILLUS[v]),0);
    });
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",inject); else inject();
})();
