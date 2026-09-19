"use strict";
/* ===== Ma machine : conseils réglés pour SA machine =====
 * Elle coud sur une Brother FS40s. Les conseils génériques (« cherche le levier des
 * griffes », « débraye le volant ») deviennent des gestes précis sur sa machine.
 *
 * Sources (vérifiées le 19/09/2026) :
 *  - Brother, FAQ FS40s « Comment enfiler une machine » : aiguille relevée par le bouton de
 *    position d'aiguille, enfile-aiguille pour aiguilles 75/11 à 100/16 seulement, pas pour
 *    l'aiguille double ; tirer 10 cm des deux fils vers l'arrière.
 *  - Brother, FAQ FS40s « Comment régler la tension du fil » : sens inverse des aiguilles
 *    d'une montre = moins tendu (fil de canette visible dessus), sens des aiguilles = plus tendu.
 *  - Notice FS-40 (FR) : axe du bobineur vers la droite pour bobiner ; aiguille double
 *    réf. 131096-121, pied J, largeur 5,0 mm maximum ; jersey : aiguille pointe boule 75/11–90/14 ;
 *    denim : 100/16 ; tissus fins : 65/9–75/11.
 *  - Tests Couture Enfant : 40 points dont 5 boutonnières, largeur 7 mm, longueur 5 mm,
 *    750 points/min, canette horizontale transparente, griffes abaissables (sélecteur à
 *    l'arrière), bouton marche/arrêt et curseur de vitesse, écran qui affiche le pied conseillé,
 *    7 pieds fournis ; limite sur 4 épaisseurs de tissu épais ou plus.
 */
var MACHINES={
  fs40s:{
    nom:"Brother FS40s",
    fiche:[
      "40 points, dont 5 boutonnières automatiques ; largeur jusqu'à 7 mm, longueur jusqu'à 5 mm.",
      "L'écran affiche le numéro du point et la lettre du pied à monter : fie-toi à lui.",
      "Bouton marche/arrêt + curseur de vitesse : pour débuter, curseur réglé sur lent, avec ou sans pédale.",
      "Bouton de position d'aiguille : aiguille haute pour enfiler, aiguille basse pour pivoter dans un angle.",
      "Enfile-aiguille automatique : seulement avec des aiguilles 75 à 100, jamais avec l'aiguille double.",
      "Canette transparente posée à plat sur le dessus : tu vois quand elle se vide.",
      "Griffes abaissables avec le sélecteur à l'arrière de la machine (pour coudre un bouton ou broder en piqué libre).",
      "Pieds fournis : zigzag J (celui de tous les jours), boutonnière, fermeture I, point invisible R, bouton M, monogramme N.",
      "Limite connue : au-delà de 4 épaisseurs de tissu épais (ourlet de jean), elle peine — tourne le volant à la main sur les surépaisseurs."
    ],
    /* ce qu'on remplace dans le dépannage générique : [symptôme, n° de cause, nouveau texte] */
    dep:{
      "nid":[
        [0,"Relève le pied presseur, appuie une ou deux fois sur le bouton de position d'aiguille pour la mettre en haut, puis réenfile : bobine → guide-fil (le ressort doit bloquer le fil) → releveur de fil de droite à gauche → guide de la barre d'aiguille → enfile-aiguille."],
        [1,"Tiens le fil du dessus, appuie deux fois sur le bouton de position d'aiguille pour remonter le fil de canette, puis tire les deux fils sur 10 cm vers l'arrière, sous le pied."],
        [2,"Canette transparente à plat : pose-la pour que le fil se déroule comme sur le dessin du couvercle, glisse le fil dans la fente et tire-le jusqu'au coupe-fil."],
        [3,"Molette de tension dans le sens des aiguilles d'une montre pour tendre davantage. Teste sur une chute pliée en deux."]
      ],
      "sautes":[[0,"Sur jersey : aiguille à pointe boule 75/11 à 90/14 (notice FS40). L'enfile-aiguille fonctionne avec ces tailles."]],
      "aiguille":[
        [2,"Jean ou toile épaisse : aiguille 100/16. La FS40s peine au-delà de 4 épaisseurs : sur les coutures croisées d'un ourlet de jean, tourne le volant à la main."],
        [3,"Avec l'aiguille double, la largeur ne doit pas dépasser 5,0 mm, sinon l'aiguille tape le pied et casse (notice FS40)."]
      ],
      "avance":[[0,"Sur la FS40s, le sélecteur des griffes est à l'arrière de la machine : pousse-le du côté des griffes relevées, puis fais un tour de volant pour qu'elles remontent."]],
      "tension":[[0,"Fil de canette visible sur l'endroit : tourne la molette de tension dans le sens inverse des aiguilles d'une montre (fil du dessus moins tendu). Fil du dessus visible sur l'envers : dans le sens des aiguilles d'une montre. Vérifie d'abord l'enfilage et l'aiguille (conseil Brother)."]],
      "bloque":[
        [0,"La FS40s n'a pas de volant à débrayer : si l'aiguille ne bouge pas, c'est presque toujours l'axe du bobineur resté à droite après une canette. Repousse-le à gauche.","L'axe du bobineur est resté à droite"],
        [1,"Avec le bouton marche/arrêt, le pied presseur doit être baissé : la machine refuse de démarrer pied relevé et l'écran l'indique.","Le pied presseur est relevé"]
      ],
      "canette":[[1,"Tiens le fil du dessus et appuie deux fois sur le bouton de position d'aiguille : l'aiguille descend, remonte, et ramène une boucle de fil de canette. Tire-la vers l'arrière."]]
    },
    /* réglages conseillés par technique (id des fiches Techniques) */
    tech:{
      "couture-droite":"Point droit, longueur 2,5, pied J, aiguille universelle 80. Curseur de vitesse au milieu pour commencer. Le bouton marche arrière fait les points d'arrêt.",
      "surfilage":"Point surfilage (ou zigzag largeur 5, longueur 1,5 à 2), pied J : l'aiguille tombe juste à droite du bord.",
      "point-extensible":"Aiguille jersey à pointe boule 75 à 90. Point extensible ou zigzag étroit (largeur 1, longueur 2,5), pied J, vitesse lente.",
      "ourlet-jersey":"Aiguille double (réf. Brother 131096-121) : enfile les deux fils à la main, l'enfile-aiguille ne marche pas avec. Pied J, point droit centré, largeur jamais au-delà de 5 mm.",
      "ourlet":"Point droit, pied J. Pour un ourlet invisible à la machine : point invisible avec le pied R fourni.",
      "surpiqure":"Point droit allongé à 3 ou 3,5 (maximum 5), pied J, vitesse lente, sans marche arrière.",
      "angles":"Arrivée au coin, appuie sur le bouton de position d'aiguille pour la laisser piquée, lève le pied, pivote, baisse le pied.",
      "couture-courbe":"Curseur de vitesse vers le lent : tu gardes les deux mains pour tourner le tissu.",
      "fermeture":"Pied I (fermeture), clipsé à gauche ou à droite de la tige selon le côté cousu, point droit.",
      "fermeture-invisible":"Le pied pour fermeture invisible n'est pas fourni avec la FS40s : prends un pied à clipser compatible Brother (quelques euros).",
      "elastique":"Pour joindre les bouts de l'élastique : zigzag largeur 5, en aller-retour, pied J.",
      "bordure-maille":"Aiguille jersey, point extensible ou zigzag étroit, pied J, vitesse lente.",
      "manche-a-plat":"Pied J ; sur jersey, point extensible et aiguille jersey.",
      "biais":"Pied J, point droit ; aiguille position gauche si tu veux coudre au ras du bord du biais.",
      "tube":"Point droit longueur 2, pied J.",
      "coins-boxes":"Point droit, pied J, points d'arrêt au début et à la fin.",
      "entrejambe":"Point droit, pied J ; sur jean, aiguille 100/16 et volant à la main aux croisements.",
      "doublure":"Point droit, pied J ; doublure glissante : aiguille 70 ou 75 et vitesse lente."
    }
  }
};
function maMachine(){
  if(typeof state==="undefined")return null;
  if(!state.machine)state.machine={modele:"fs40s"};   /* elle coud sur une FS40s */
  return MACHINES[state.machine.modele]||null;
}
function machineChoisir(v){ state.machine={modele:v}; save(); machineBandeau(); if(typeof depRender==="function")depRender(); }

/* ---------- dépannage : les causes génériques deviennent des gestes sur sa machine ---------- */
(function(){
  if(typeof DEP==="undefined")return;
  var orig=JSON.parse(JSON.stringify(DEP));
  var base=window.depRender;
  window.depRender=function(){
    var m=maMachine();
    /* on repart toujours des textes génériques, puis on applique la machine */
    orig.forEach(function(d,i){ DEP[i].causes=JSON.parse(JSON.stringify(d.causes)); });
    if(m&&m.dep){
      DEP.forEach(function(d){
        (m.dep[d.id]||[]).forEach(function(r){ if(d.causes[r[0]]){ d.causes[r[0]].f=r[1]; if(r[2])d.causes[r[0]].c=r[2]; d.causes[r[0]].machine=true; } });
      });
    }
    var r=base.apply(this,arguments);
    machineBandeau();
    var p=document.querySelector("#depBox .dp-etape p");
    var d=DEP.filter(function(x){return x.id===DP.sym;})[0];
    if(p&&d&&d.causes[DP.i]&&d.causes[DP.i].machine)p.insertAdjacentHTML("beforebegin",'<div class="mc-tag">Sur ta '+esc(m.nom)+'</div>');
    return r;
  };
})();

/* un bandeau « Ma machine » en tête du dépannage, avec sa fiche */
function machineBandeau(){
  var box=document.getElementById("depBox"); if(!box)return;
  var old=document.getElementById("mcBand"); if(old)old.remove();
  var m=maMachine();
  var el=document.createElement("div"); el.id="mcBand"; el.className="card mc-band";
  el.innerHTML='<div class="mc-h"><div><div class="tq-cat">Ma machine</div><b>'+(m?esc(m.nom):"Autre machine")+'</b></div>'+
    '<select onchange="machineChoisir(this.value)"><option value="fs40s"'+(m?" selected":"")+'>Brother FS40s</option><option value="autre"'+(m?"":" selected")+'>Autre machine</option></select></div>'+
    (m?'<details><summary>Ce qu\'il faut savoir sur elle</summary><ul>'+m.fiche.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join("")+'</ul></details>':'');
  box.insertBefore(el,box.firstChild);
}

/* ---------- fiches Techniques : un encadré « Sur ta FS40s » ---------- */
(function(){
  var base=window.techOpen;
  if(typeof base!=="function")return;
  window.techOpen=function(nom){
    var r=base.apply(this,arguments);
    try{
      var m=maMachine(); if(!m)return r;
      var t=(typeof nom==="object")?nom:(techFind(nom)||TECHS.filter(function(x){return x.id===nom;})[0]);
      if(!t||!m.tech[t.id])return r;
      var ft=document.querySelector("#tqModal .tq-ft");
      if(ft)ft.insertAdjacentHTML("beforebegin",'<div class="mc-box"><b>Sur ta '+esc(m.nom)+'</b> '+esc(m.tech[t.id])+'</div>');
    }catch(e){}
    return r;
  };
})();

/* ---------- étapes de couture : le réglage machine à côté de chaque étape ---------- */
(function(){
  var base=window.pcEtapes;
  if(typeof base!=="function")return;
  window.pcEtapes=function(board){
    var E=base.apply(this,arguments), m=maMachine();
    if(!m)return E;
    E.forEach(function(e){
      var id=null;
      (e.tech||[]).some(function(n){ var t=techFind(n); if(t&&m.tech[t.id]){ id=t.id; return true; } return false; });
      if(id)e.conseil=(e.conseil?e.conseil+" ":"")+"Machine : "+m.tech[id];
    });
    return E;
  };
})();
window.maMachine=maMachine; window.machineChoisir=machineChoisir; window.MACHINES=MACHINES;
