"use strict";
/* ===== Catalogue FreeSewing complet (bundle v4) — libellés FR, types, niveaux =====
 * Étend FSCATALOG / FSMETA / FSINFO et remplit le sélecteur de génération.
 */
var FSALL=[
  /* hauts */
  {slug:"teagan",name:"Teagan — t-shirt",type:"top",level:"Débutant",desc:"T-shirt ajusté, parfait pour débuter le jersey.",d:2},
  {slug:"aaron",name:"Aaron — débardeur",type:"top",level:"Débutant",desc:"Débardeur simple, idéal premier vêtement en maille.",d:2},
  {slug:"tamiko",name:"Tamiko — top zéro-déchet",type:"top",level:"Débutant",desc:"Top conçu sans chute de tissu, coupe droite.",d:2},
  {slug:"diana",name:"Diana — top drapé",type:"top",level:"Intermédiaire",desc:"Top à drapé souple, en tissu fluide.",d:3},
  {slug:"sven",name:"Sven — sweat-shirt",type:"top",level:"Intermédiaire",desc:"Sweat-shirt classique en molleton.",d:3},
  {slug:"hugo",name:"Hugo — sweat à capuche",type:"top",level:"Intermédiaire",desc:"Hoodie raglan avec poche kangourou.",d:3},
  {slug:"huey",name:"Huey — sweat zippé",type:"top",level:"Intermédiaire",desc:"Sweat à capuche zippé.",d:3},
  {slug:"hannah",name:"Hannah — haut ajusté",type:"top",level:"Intermédiaire",desc:"Haut près du corps en maille.",d:3},
  {slug:"sabrina",name:"Sabrina — brassière",type:"top",level:"Intermédiaire",desc:"Brassière de sport en maille extensible.",d:3},
  {slug:"shelly",name:"Shelly — haut de bain",type:"top",level:"Intermédiaire",desc:"Haut manches longues pour la nage.",d:3},
  {slug:"tristan",name:"Tristan — haut",type:"top",level:"Intermédiaire",desc:"Haut ajusté à découpes.",d:3},
  {slug:"yuri",name:"Yuri — haut",type:"top",level:"Intermédiaire",desc:"Haut d'inspiration japonaise.",d:3},
  {slug:"tina",name:"Tina — haut",type:"top",level:"Intermédiaire",desc:"Haut féminin ajusté.",d:3},
  {slug:"toni",name:"Toni — haut",type:"top",level:"Avancé",desc:"Haut structuré à empiècements.",d:4},
  {slug:"simone",name:"Simone — chemise femme",type:"top",level:"Avancé",desc:"Chemise classique : col, poignets, pli dos.",d:4},
  {slug:"simon",name:"Simon — chemise",type:"top",level:"Avancé",desc:"Chemise à coupe nette, col et empiècement.",d:4},
  {slug:"wahid",name:"Wahid — gilet",type:"manteau",level:"Intermédiaire",desc:"Gilet sans manche structuré.",d:4},
  /* bas */
  {slug:"sandy",name:"Sandy — jupe cercle",type:"jupe",level:"Débutant",desc:"Jupe cercle évasée, très peu de coutures.",d:2},
  {slug:"sarah",name:"Sarah — bloc jupe",type:"jupe",level:"Intermédiaire",desc:"Bloc de base jupe droite, à personnaliser.",d:3},
  {slug:"penelope",name:"Penelope — jupe crayon",type:"jupe",level:"Intermédiaire",desc:"Jupe crayon ajustée, avec pinces.",d:3},
  {slug:"sunny",name:"Sunny — jupe fendue",type:"jupe",level:"Intermédiaire",desc:"Jupe à fentes latérales.",d:3},
  {slug:"shin",name:"Shin — short",type:"pantalon",level:"Débutant",desc:"Short confortable à taille élastique.",d:2},
  {slug:"shale",name:"Shale — short",type:"pantalon",level:"Intermédiaire",desc:"Short de sport doublé.",d:3},
  {slug:"ashley",name:"Ashley — short trapèze",type:"pantalon",level:"Intermédiaire",desc:"Short évasé taille haute.",d:3},
  {slug:"percy",name:"Percy — short bouffant",type:"pantalon",level:"Intermédiaire",desc:"Short ample d'inspiration historique.",d:3},
  {slug:"waralee",name:"Waralee — pantalon portefeuille",type:"pantalon",level:"Débutant",desc:"Pantalon large qui se noue à la taille.",d:2},
  {slug:"lumina",name:"Lumina — legging",type:"pantalon",level:"Intermédiaire",desc:"Legging en maille extensible.",d:3},
  {slug:"lumira",name:"Lumira — legging long",type:"pantalon",level:"Intermédiaire",desc:"Variante longue du legging Lumina.",d:3},
  {slug:"paco",name:"Paco — pantalon large",type:"pantalon",level:"Intermédiaire",desc:"Pantalon ample à taille élastique.",d:3},
  {slug:"titan",name:"Titan — bloc pantalon",type:"pantalon",level:"Avancé",desc:"Bloc de base pantalon, à personnaliser.",d:4},
  {slug:"charlie",name:"Charlie — chino",type:"pantalon",level:"Avancé",desc:"Pantalon chino avec poches et braguette.",d:5},
  {slug:"crux",name:"Crux — pantalon d'escalade",type:"pantalon",level:"Avancé",desc:"Pantalon technique, grande liberté de mouvement.",d:4},
  {slug:"cornelius",name:"Cornelius — culotte de vélo",type:"pantalon",level:"Avancé",desc:"Culotte courte d'inspiration cycliste.",d:4},
  {slug:"opal",name:"Opal — salopette",type:"pantalon",level:"Avancé",desc:"Salopette à bretelles et bavette.",d:4},
  /* robes & blocs */
  {slug:"sophie",name:"Sophie — robe nuisette",type:"robe",level:"Intermédiaire",desc:"Robe fluide à bretelles, coupe en biais.",d:3},
  {slug:"sasha",name:"Sasha — robe patineuse",type:"robe",level:"Intermédiaire",desc:"Robe ajustée en haut, évasée en bas.",d:3},
  {slug:"breanna",name:"Breanna — bloc robe",type:"robe",level:"Avancé",desc:"Bloc de base corps femme, à personnaliser.",d:3},
  {slug:"bella",name:"Bella — bloc femme",type:"robe",level:"Avancé",desc:"Bloc de base ajusté (poitrine, pinces).",d:4},
  {slug:"bibi",name:"Bibi — bloc maille",type:"robe",level:"Intermédiaire",desc:"Bloc de base pour tissus extensibles.",d:3},
  {slug:"noble",name:"Noble — bloc à pinces",type:"robe",level:"Avancé",desc:"Bloc corps avec pinces, base de patronnage.",d:4},
  {slug:"brian",name:"Brian — bloc",type:"robe",level:"Avancé",desc:"Bloc de base masculin, socle de nombreux modèles.",d:4},
  {slug:"bent",name:"Bent — bloc manche courbe",type:"robe",level:"Avancé",desc:"Bloc avec manche préformée.",d:4},
  {slug:"jane",name:"Jane — chemise 1790",type:"robe",level:"Intermédiaire",desc:"Chemise historique, coupe rectangulaire.",d:2},
  /* vestes & manteaux */
  {slug:"devon",name:"Devon — veste en jean",type:"manteau",level:"Avancé",desc:"Veste en denim, surpiqûres et poches.",d:5},
  {slug:"jett",name:"Jett — blouson teddy",type:"manteau",level:"Avancé",desc:"Blouson bomber / teddy à bords-côtes.",d:4},
  {slug:"jaeger",name:"Jaeger — veste de costume",type:"manteau",level:"Avancé",desc:"Veste tailleur doublée.",d:5},
  {slug:"carlton",name:"Carlton — manteau",type:"manteau",level:"Avancé",desc:"Manteau long à pèlerine.",d:5},
  {slug:"carlita",name:"Carlita — manteau femme",type:"manteau",level:"Avancé",desc:"Version féminine du manteau Carlton.",d:5},
  {slug:"cathrin",name:"Cathrin — corset",type:"manteau",level:"Avancé",desc:"Corset baleiné historique.",d:5},
  {slug:"lunetius",name:"Lunetius — cape romaine",type:"manteau",level:"Débutant",desc:"Grande cape semi-circulaire.",d:1},
  {slug:"tiberius",name:"Tiberius — tunique romaine",type:"manteau",level:"Débutant",desc:"Tunique antique, coutures droites.",d:2},
  {slug:"walburga",name:"Walburga — tabard",type:"manteau",level:"Débutant",desc:"Tabard médiéval à enfiler.",d:2},
  /* accessoires */
  {slug:"hortensia",name:"Hortensia — sac banane",type:"accessoire",level:"Débutant",desc:"Petit sac banane, rapide à coudre.",d:3},
  {slug:"albert",name:"Albert — tablier",type:"accessoire",level:"Débutant",desc:"Tablier de cuisine à bavette.",d:1},
  {slug:"florence",name:"Florence — masque",type:"accessoire",level:"Débutant",desc:"Masque en tissu ajusté au visage.",d:1},
  {slug:"florent",name:"Florent — casquette plate",type:"accessoire",level:"Intermédiaire",desc:"Casquette gavroche doublée.",d:3},
  {slug:"holmes",name:"Holmes — cagoule",type:"accessoire",level:"Intermédiaire",desc:"Chapeau / cagoule type deerstalker.",d:3},
  {slug:"benjamin",name:"Benjamin — nœud papillon",type:"accessoire",level:"Débutant",desc:"Nœud papillon réglable.",d:2},
  {slug:"trayvon",name:"Trayvon — cravate",type:"accessoire",level:"Intermédiaire",desc:"Cravate doublée, coupe en biais.",d:3},
  {slug:"bob",name:"Bob — bavoir",type:"enfant",level:"Débutant",desc:"Bavoir bébé, deux épaisseurs.",d:1},
  {slug:"gozer",name:"Gozer — costume fantôme",type:"enfant",level:"Débutant",desc:"Déguisement de fantôme.",d:1},
  /* sous-vêtements & maillots */
  {slug:"uma",name:"Uma — culotte",type:"accessoire",level:"Intermédiaire",desc:"Culotte en maille extensible.",d:3},
  {slug:"umbra",name:"Umbra — culotte doublée",type:"accessoire",level:"Intermédiaire",desc:"Culotte avec doublure intégrée.",d:3},
  {slug:"bruce",name:"Bruce — boxer",type:"accessoire",level:"Intermédiaire",desc:"Boxer long en maille.",d:3},
  /* peluches */
  {slug:"octoplushy",name:"Octoplushy — pieuvre",type:"enfant",level:"Débutant",desc:"Peluche pieuvre, projet court et gratifiant.",d:2},
  {slug:"hi",name:"Hi — requin",type:"enfant",level:"Débutant",desc:"Peluche requin.",d:2},
  {slug:"polly",name:"Polly — poney",type:"enfant",level:"Intermédiaire",desc:"Peluche poney.",d:3},
  {slug:"skully",name:"Skully — tête de mort",type:"enfant",level:"Débutant",desc:"Peluche crâne, décorative.",d:2}
];

(function(){
  if(typeof FSCATALOG==="undefined")return;
  var have={}; FSCATALOG.forEach(function(d){have[d.slug]=true;});
  var available=(window.FS&&window.FS.designs)?window.FS.designs:null;
  FSALL.forEach(function(d){
    if(available&&available.indexOf(d.slug)<0)return;   /* absent du bundle : on ignore */
    if(!have[d.slug]){ FSCATALOG.push(d); }
    if(typeof FSMETA!=="undefined")FSMETA[d.slug]=FSMETA[d.slug]||d;
  });

  /* fiches d'info : compléter depuis le bundle pour les modèles sans métadonnées figées */
  if(typeof FSINFO!=="undefined"&&window.FS&&typeof window.FS.info==="function"){
    FSCATALOG.forEach(function(d){
      if(FSINFO[d.slug])return;
      var i=null; try{ i=window.FS.info(d.slug); }catch(e){}
      if(!i)return;
      FSINFO[d.slug]={name:d.name,description:d.desc,difficulty:d.d||3,tags:[],techniques:[],
        designer:"FreeSewing",req:i.measurements||[],opt:i.optionalMeasurements||[]};
    });
  }

  /* sélecteur de génération : tous les modèles, groupés par type */
  var sel=document.getElementById("fsDesign");
  if(sel){
    var TYPES=[["top","Hauts"],["robe","Robes & blocs"],["jupe","Jupes"],["pantalon","Bas"],
               ["manteau","Vestes & manteaux"],["accessoire","Accessoires"],["enfant","Enfant & peluches"]];
    var html="";
    TYPES.forEach(function(t){
      var list=FSCATALOG.filter(function(d){return d.type===t[0];})
        .sort(function(a,b){return a.name.localeCompare(b.name,"fr");});
      if(!list.length)return;
      html+='<optgroup label="'+t[1]+'">'+list.map(function(d){
        return '<option value="'+d.slug+'">'+esc(d.name)+' · '+esc(d.level)+'</option>';
      }).join("")+'</optgroup>';
    });
    if(html){ sel.innerHTML=html; sel.value="teagan"; }
  }

  /* libellés utilisés par app.freesewing.js */
  if(typeof FS_LABEL!=="undefined"){ FSCATALOG.forEach(function(d){ FS_LABEL[d.slug]=d.name; }); }

  if(typeof renderPatList==="function"&&document.getElementById("patList"))renderPatList();
})();

/* ===== Vignettes : cache en mémoire (plus dans localStorage) et rendu à la demande =====
 * Avec 68 modèles, mettre les vignettes en base64 dans localStorage saturait le quota
 * et faisait échouer toutes les sauvegardes. On garde le cache le temps de la session
 * et on ne dessine que les cartes visibles à l'écran.
 */
window._fsThumbs = window._fsThumbs || {};

/* vignette : traits épais (le patron fait ~1 m de large réduit à 320 px) et rien de superflu */
function fsThumbCss(){
  return '<style type="text/css">'+
    'path{fill:none;stroke:#2e2a28;stroke-width:3.5;stroke-linejoin:round}'+
    '.fabric,.lining,.canvas,.interfacing,.various,.contrast{fill:none;stroke:#2e2a28;stroke-width:3.5}'+
    '.sa{stroke:#9c5d7c;stroke-width:2;stroke-dasharray:10 7}'+
    '.help,.hint,.mark,.note{display:none}text,tspan{display:none}circle{display:none}'+
    '</style>';
}
function fsThumb(slug,cb){
  try{
    var svg=window.FS.draft(slug, typeof fsOverrides==="function"?fsOverrides():{});
    if(!svg||svg.indexOf("<svg")<0)return cb(null);
    svg=svg.replace(/(<svg[^>]*>)/, "$1"+fsThumbCss());
    rasterizeSvg(svg,320,240,cb);
  }catch(e){ cb(null); }
}
window.fsThumb=fsThumb;
(function purgeOldThumbs(){
  try{
    if(!state.patImg)return;
    var n=0;
    Object.keys(state.patImg).forEach(function(k){ if(k.indexOf("fs:")===0){ delete state.patImg[k]; n++; } });
    if(n)save();
  }catch(e){}
})();

function lazyFsThumbs(){
  if(!window.FS)return;
  /* attention : style="background:#xxx" met backgroundImage à "initial" (chaîne non vide),
     on teste donc la présence réelle d'une url() */
  var nodes=[].slice.call(document.querySelectorAll('#patList .top[data-fs]'))
    .filter(function(n){ return !/url\(/.test(n.style.backgroundImage||"") && !n.dataset.thumbDone; });
  if(!nodes.length)return;
  var queue=[], busy=false;
  function run(){
    if(busy||!queue.length)return;
    busy=true;
    var n=queue.shift(), slug=n.getAttribute("data-fs");
    n.dataset.thumbDone="1";
    if(window._fsThumbs[slug]){ setThumb(n,window._fsThumbs[slug]); busy=false; return run(); }
    fsThumb(slug,function(data){
      if(data){ window._fsThumbs[slug]=data; setThumb(n,data); }
      busy=false; setTimeout(run,40);
    });
  }
  if(!("IntersectionObserver" in window)){ queue=nodes.slice(0,12); return run(); }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting)return;
      io.unobserve(e.target);
      queue.push(e.target); run();
    });
  },{rootMargin:"250px"});
  nodes.forEach(function(n){ io.observe(n); });
}
window.lazyFsThumbs=lazyFsThumbs;
