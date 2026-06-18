"use strict";
/* ===== Touche personnelle : illustrations placées avec soin (en-tête + pied + états vides) ===== */
(function(){
  function paths(n){var f="image-removebg-preview%28"+n+"%29.png";return [f,"Illustrations/"+f,"illustrations/"+f];}
  function setSrc(img,list,i){ if(i>=list.length){img.style.display="none";return;} img.onerror=function(){setSrc(img,list,i+1);}; img.src=list[i]; }
  function mkImg(n,cls){var img=document.createElement("img");img.className=cls;img.alt="";img.loading="lazy";setSrc(img,paths(n),0);return img;}

  /* en-tête (haut-droite) */
  var HERO={inspirations:25,assistant:15,studio:24,patrons:20,tissu:11,carnet:9,capsule:27,profil:17,donnees:8};
  /* pied de page (centré, avec signature) */
  var FOOT={
    inspirations:[21,"Épingle tout ce qui t'inspire"],
    assistant:[13,"Laisse parler tes idées"],
    studio:[23,"Donne vie à tes créations"],
    patrons:[22,"Du patron à la pièce cousue"],
    tissu:[18,"À chaque projet, la bonne matière"],
    carnet:[26,"Tout ce que tu rêves de coudre"],
    capsule:[10,"Une garde-robe qui te ressemble"],
    profil:[14,"Tes mesures, tes patrons"],
    donnees:[12,"Ton atelier, partout avec toi"]
  };
  /* états vides : illustration contextuelle selon le conteneur */
  var EMPTYMAP={projetList:26,inspoList:16,capsuleList:27,fabricList:12,patList:10};

  function injectStyle(){
    var st=document.createElement("style"); st.id="illus-style";
    st.textContent=
      '.vhead{position:relative;min-height:80px;padding-right:176px;}'+
      '.mascotte{position:absolute;right:0;top:-26px;height:152px;width:auto;pointer-events:none;filter:drop-shadow(0 7px 13px rgba(46,42,40,.16));}'+
      '.illus-foot{display:flex;flex-direction:column;align-items:center;gap:8px;margin:52px 0 6px;opacity:.94;}'+
      '.illus-foot img{height:124px;width:auto;filter:drop-shadow(0 6px 11px rgba(46,42,40,.13));}'+
      '.illus-foot-t{font-family:Georgia,"Times New Roman",serif;font-size:15px;color:var(--muted);font-style:italic;text-align:center;}'+
      '.empty-illus{height:150px;width:auto;display:block;margin:4px auto 14px;opacity:.96;}'+
      '@media(max-width:860px){.vhead{padding-right:0;} .mascotte{position:static;display:block;height:120px;margin:8px 0 0;}}'+
      '@media(max-width:480px){.mascotte{display:none;} .illus-foot img{height:104px;}}';
    document.head.appendChild(st);
  }
  function addHeroes(){
    Object.keys(HERO).forEach(function(v){
      var sec=document.getElementById(v); if(!sec)return;
      var vh=sec.querySelector(".vhead"); if(!vh||vh.querySelector(".mascotte"))return;
      vh.appendChild(mkImg(HERO[v],"mascotte"));
    });
  }
  function addFooters(){
    Object.keys(FOOT).forEach(function(v){
      var sec=document.getElementById(v); if(!sec||sec.querySelector(".illus-foot"))return;
      var d=document.createElement("div"); d.className="illus-foot";
      d.appendChild(mkImg(FOOT[v][0],"illus-foot-img"));
      var t=document.createElement("div"); t.className="illus-foot-t"; t.textContent=FOOT[v][1];
      d.appendChild(t); sec.appendChild(d);
    });
  }
  function decorateEmpty(el){
    if(!el||el.querySelector(".empty-illus"))return;
    var pid=el.parentNode&&el.parentNode.id; var n=EMPTYMAP[pid]; if(!n)return;
    el.insertBefore(mkImg(n,"empty-illus"),el.firstChild);
  }
  function scanEmpties(root){
    var list=(root&&root.querySelectorAll)?root.querySelectorAll(".empty"):[];
    Array.prototype.forEach.call(list,decorateEmpty);
  }
  function watchEmpties(){
    try{
      var obs=new MutationObserver(function(muts){
        muts.forEach(function(m){
          Array.prototype.forEach.call(m.addedNodes||[],function(nd){
            if(nd.nodeType!==1)return;
            if(nd.classList&&nd.classList.contains("empty"))decorateEmpty(nd);
            scanEmpties(nd);
          });
        });
      });
      obs.observe(document.body,{childList:true,subtree:true});
    }catch(e){}
  }
  function init(){ injectStyle(); addHeroes(); addFooters(); scanEmpties(document); watchEmpties(); }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init); else init();
})();
