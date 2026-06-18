"use strict";
/* ===== Métadonnées FreeSewing extraites des paquets open-source ===== */
var FSINFO={"teagan":{"name":"Teagan T-shirt","description":"Un t-shirt FreeSewing classique.","difficulty":2,"tags":["tops"],"techniques":["curved-seam","hem","flat-sleeve","knit-band"],"designer":"Joost De Cock","req":["biceps","chest","hips","hpsToBust","hpsToWaistBack","neck","shoulderSlope","shoulderToShoulder","shoulderToWrist","waist","waistToArmpit","waistToHips","wrist"],"opt":["highBust"]},
"aaron":{"name":"Aaron débardeur","description":"Un débardeur (A-shirt / tank top).","difficulty":2,"tags":["tops","underwear"],"techniques":["hem","stretch","knit-binding","curved-seam"],"designer":"Joost De Cock","req":["biceps","chest","hips","hpsToBust","hpsToWaistBack","neck","shoulderSlope","shoulderToShoulder","waistToArmpit","waistToHips"],"opt":["highBust"]},
"sven":{"name":"Sven sweat-shirt","description":"Un sweat-shirt simple et confortable.","difficulty":3,"tags":["tops"],"techniques":["curved-seam","flat-sleeve","ribbing"],"designer":"Joost De Cock","req":["biceps","chest","hips","hpsToBust","hpsToWaistBack","neck","shoulderSlope","shoulderToShoulder","shoulderToWrist","waist","waistToArmpit","waistToHips","wrist"],"opt":["highBust"]},
"hugo":{"name":"Hugo hoodie","description":"Un sweat à capuche à manches raglan.","difficulty":3,"tags":["tops"],"techniques":["curved-seam","pocket","ribbing","raglan-sleeve"],"designer":"Joost De Cock","req":["biceps","chest","head","hips","hpsToBust","hpsToWaistBack","neck","shoulderSlope","shoulderToShoulder","shoulderToWrist","waistToArmpit","waistToHips","wrist"],"opt":["highBust"]},
"wahid":{"name":"Wahid gilet","description":"Un gilet sans manche ajusté et classique.","difficulty":4,"tags":["tops"],"techniques":["curved-seam","hem","interfacing","lining","welt-pocket","button"],"designer":"Joost De Cock","req":["biceps","chest","hips","hpsToBust","hpsToWaistBack","neck","shoulderSlope","shoulderToShoulder","waist","waistToArmpit","waistToHips"],"opt":["highBust"]},
"simone":{"name":"Simone chemise","description":"Chemise boutonnée (version poitrine).","difficulty":4,"tags":["tops"],"techniques":["hem","button","interfacing","curved-seam","flat-felled-seam","flat-sleeve"],"designer":"Joost De Cock","req":["biceps","bustSpan","chest","highBust","hips","hpsToBust","hpsToWaistBack","neck","shoulderSlope","shoulderToShoulder","shoulderToWrist","waist","waistToArmpit","waistToHips","wrist"],"opt":[]},
"simon":{"name":"Simon chemise","description":"Chemise boutonnée classique.","difficulty":4,"tags":["tops"],"techniques":["hem","button","interfacing","curved-seam","flat-felled-seam","flat-sleeve"],"designer":"Joost De Cock","req":["biceps","chest","hips","hpsToBust","hpsToWaistBack","neck","shoulderSlope","shoulderToShoulder","shoulderToWrist","waist","waistToArmpit","waistToHips","wrist"],"opt":["highBust"]},
"sandy":{"name":"Sandy jupe cercle","description":"Une jupe cercle évasée.","difficulty":3,"tags":["bottoms","skirts"],"techniques":["curved-seam","button","hem"],"designer":"Erica Alcusa Sáez","req":["hips","waist","waistToFloor","waistToHips"],"opt":[]},
"breanna":{"name":"Breanna bloc robe","description":"Bloc de base corps femme, à personnaliser.","difficulty":3,"tags":["blocks","tops"],"techniques":["block","dart"],"designer":"Joost De Cock","req":["biceps","bustFront","bustSpan","highBust","highBustFront","hpsToBust","hpsToWaistBack","hpsToWaistFront","neck","shoulderSlope","shoulderToShoulder","shoulderToWrist","waist","waistToHips","wrist"],"opt":[]},
"shin":{"name":"Shin short de bain","description":"Un short / short de bain.","difficulty":2,"tags":["bottoms","swimwear"],"techniques":["hem","stretch","curved-seam","elastic"],"designer":"Joost De Cock","req":["hips","upperLeg","waistToHips","waistToUpperLeg"],"opt":[]},
"hortensia":{"name":"Hortensia sac","description":"Un sac à main / banane.","difficulty":3,"tags":["accessories","bags"],"techniques":["curved-seam","precision","lining","zipper"],"designer":["Stoffsuchti","Wouter Van Wageningen"],"req":[],"opt":[]},
"holmes":{"name":"Holmes chapeau","description":"Un chapeau / cagoule type deerstalker.","difficulty":3,"tags":["accessories","hats"],"techniques":["curved-seam","lining"],"designer":"Erica Alcusa Sáez","req":["head"],"opt":[]}};

var MEAS_FR={chest:"tour de poitrine",highBust:"poitrine haute",bustSpan:"écart de poitrine",bustFront:"poitrine (devant)",highBustFront:"poitrine haute (devant)",waist:"tour de taille",hips:"tour de hanches",seat:"tour de bassin",neck:"tour de cou",biceps:"tour de bras",wrist:"tour de poignet",head:"tour de tête",upperLeg:"tour de cuisse",shoulderToShoulder:"largeur d'épaules",shoulderToWrist:"épaule au poignet",hpsToBust:"épaule à la poitrine",hpsToWaistBack:"longueur de dos",hpsToWaistFront:"longueur devant",waistToArmpit:"taille à l'aisselle",waistToHips:"taille aux hanches",waistToFloor:"taille au sol",waistToUpperLeg:"taille à l'entrejambe",shoulderSlope:"pente d'épaule"};
var TECH_FR={"curved-seam":"couture courbe","hem":"ourlet","flat-sleeve":"manche montée à plat","ribbing":"bord-côte","button":"boutonnage","dart":"pince","block":"bloc de base","stretch":"maille extensible","elastic":"élastique","lining":"doublure","zipper":"fermeture éclair","pocket":"poche","welt-pocket":"poche passepoilée","interfacing":"entoilage","flat-felled-seam":"couture rabattue","knit-band":"bande maille","knit-binding":"bordure maille","raglan-sleeve":"manche raglan","precision":"précision"};
function measFr(k){return MEAS_FR[k]||k;}
function techFr(t){return TECH_FR[t]||(t||"").replace(/-/g," ");}
function fsInfoHtml(slug){
  var d=FSINFO[slug]; if(!d)return "";
  function lbl(t){return '<div style="font-size:12px;color:var(--muted);font-weight:500;letter-spacing:.3px;text-transform:uppercase;margin-bottom:5px;">'+t+'</div>';}
  function chip(t){return '<span class="tchip" style="cursor:default;">'+esc(t)+'</span>';}
  var diff=d.difficulty||0,dots="";for(var i=1;i<=5;i++)dots+=(i<=diff?"●":"○");
  var designer=Array.isArray(d.designer)?d.designer.join(", "):d.designer;
  var req=(d.req||[]).map(function(m){return chip(measFr(m));}).join("")||'<span class="muted" style="font-size:13px;">aucune mesure</span>';
  var opt=(d.opt||[]).map(function(m){return chip(measFr(m));}).join("")||'<span class="muted" style="font-size:13px;">aucune</span>';
  var tags=(d.tags||[]).map(chip).join("");
  var tech=(d.techniques||[]).map(function(t){return chip(techFr(t));}).join("");
  return '<div class="card" style="margin-bottom:16px;">'+
    '<div style="display:flex;gap:22px;flex-wrap:wrap;margin-bottom:16px;">'+
      '<div>'+lbl("Difficulté")+'<div style="font-size:16px;letter-spacing:2px;color:var(--accent);">'+dots+' <span class="muted" style="font-size:12px;letter-spacing:0;">'+diff+'/5</span></div></div>'+
      '<div>'+lbl("Créateur")+'<div style="font-size:14px;">'+esc(designer||"FreeSewing")+'</div></div>'+
      '<div style="flex:1;min-width:180px;">'+lbl("Description")+'<div style="font-size:14px;">'+esc(d.description||"")+'</div></div>'+
    '</div>'+
    '<div style="margin-bottom:14px;">'+lbl("Mesures requises")+'<div>'+req+'</div></div>'+
    '<div style="margin-bottom:14px;">'+lbl("Mesures optionnelles")+'<div>'+opt+'</div></div>'+
    '<div style="margin-bottom:14px;">'+lbl("Tags")+'<div>'+tags+'</div></div>'+
    '<div>'+lbl("Techniques")+'<div>'+tech+'</div></div>'+
    '<div style="margin-top:14px;font-size:13px;" class="muted">Documentation complète et exemples cousus par la communauté sur <a href="https://freesewing.org/designs/'+slug+'/" target="_blank" rel="noopener">freesewing.org/designs/'+slug+'</a> (ces photos sont hébergées par FreeSewing).</div>'+
  '</div>';
}
