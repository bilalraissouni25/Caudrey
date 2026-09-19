"use strict";
/* ===== Bibliothèque de techniques =====
 * Une fiche par geste de couture : pourquoi, matériel, étapes, schéma, erreurs
 * fréquentes. Les étapes des projets guidés citent ces techniques par leur nom
 * (e.tech) : dans le mode Atelier, chaque nom devient un lien qui ouvre la fiche
 * par-dessus, sans quitter le projet en cours.
 * Enrichir = ajouter une entrée à TECHS. Les alias font le lien avec les noms
 * utilisés dans GUIDE_PROJETS.
 */

/* ---------- schémas ---------- */
var TS={
  tis:"#f3e7ea", tis2:"#e6d3d9", env:"#fbf6f7", tr:"#6d5f58", pt:"#b03a5b", fl:"#8f8279"
};
function tsSvg(inner,vb){ return '<svg viewBox="'+(vb||"0 0 260 150")+'" xmlns="http://www.w3.org/2000/svg" class="tq-sch">'+inner+'</svg>'; }
function tsFleche(x1,y1,x2,y2){
  var a=Math.atan2(y2-y1,x2-x1), l=7;
  return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+TS.fl+'" stroke-width="1.4"/>'+
    '<path d="M'+x2+' '+y2+' L'+(x2-l*Math.cos(a-0.45)).toFixed(1)+' '+(y2-l*Math.sin(a-0.45)).toFixed(1)+' L'+(x2-l*Math.cos(a+0.45)).toFixed(1)+' '+(y2-l*Math.sin(a+0.45)).toFixed(1)+' Z" fill="'+TS.fl+'"/>';
}
function tsTxt(x,y,t,anc){ return '<text x="'+x+'" y="'+y+'" font-size="10" fill="'+TS.fl+'" font-family="Helvetica,Arial,sans-serif"'+(anc?' text-anchor="'+anc+'"':'')+'>'+t+'</text>'; }
function tsPoints(x1,y1,x2,y2){ return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+TS.pt+'" stroke-width="2" stroke-dasharray="6 3"/>'; }

var TSCH={
  droitfil:function(){
    return tsSvg('<rect x="20" y="20" width="220" height="110" fill="'+TS.tis+'" stroke="'+TS.tr+'"/>'+
      '<rect x="20" y="20" width="220" height="7" fill="'+TS.tis2+'"/>'+tsTxt(130,16,"lisière","middle")+
      '<path d="M60 45 L110 40 L120 110 L55 115 Z" fill="#fff" stroke="'+TS.tr+'" stroke-width="1.5"/>'+
      tsFleche(88,100,88,52)+tsFleche(88,52,88,100)+tsTxt(96,80,"droit-fil")+
      '<line x1="160" y1="40" x2="160" y2="120" stroke="'+TS.fl+'" stroke-dasharray="3 3"/>'+
      tsTxt(166,70,"même distance")+tsTxt(166,82,"de la lisière")+tsTxt(166,94,"en haut et en bas"));
  },
  couture:function(){
    return tsSvg('<rect x="20" y="30" width="220" height="90" fill="'+TS.tis+'" stroke="'+TS.tr+'"/>'+
      '<rect x="24" y="36" width="220" height="90" fill="'+TS.env+'" stroke="'+TS.tr+'" opacity=".85"/>'+
      tsPoints(40,105,225,105)+
      '<path d="M40 105 l6 0 m-10 0 l6 0" stroke="'+TS.pt+'" stroke-width="3"/>'+
      '<path d="M219 105 l6 0" stroke="'+TS.pt+'" stroke-width="3"/>'+
      tsFleche(250,105,250,126)+tsFleche(250,126,250,105)+tsTxt(253,118,"marge")+
      tsTxt(40,60,"endroit contre endroit")+tsTxt(40,98,"points arrière")+tsTxt(225,98,"points arrière","end"));
  },
  surfil:function(){
    var z=""; for(var x=30;x<230;x+=8)z+=(x===30?"M":"L")+x+" "+(x%16===14?96:112)+" ";
    return tsSvg('<rect x="20" y="30" width="220" height="86" fill="'+TS.tis+'" stroke="'+TS.tr+'"/>'+
      '<path d="'+z+'" fill="none" stroke="'+TS.pt+'" stroke-width="1.8"/>'+
      tsTxt(30,55,"zigzag : l'aiguille tombe dans le tissu,")+tsTxt(30,68,"puis juste à côté du bord")+
      tsFleche(245,118,245,108)+tsTxt(200,135,"bord à vif"));
  },
  ourlet:function(){
    /* coupe de profil : le bord à vif (3e couche) est enfermé entre les deux autres */
    return tsSvg('<path d="M20 120 L205 120 Q222 120 222 105 Q222 90 205 90 L150 90 Q140 90 140 97.5 Q140 105 150 105 L200 105" fill="none" stroke="'+TS.tr+'" stroke-width="4" stroke-linejoin="round"/>'+
      '<circle cx="200" cy="105" r="3" fill="'+TS.pt+'"/>'+
      tsPoints(158,80,158,130)+
      tsTxt(22,112,"envers du vêtement")+tsTxt(22,140,"coupe de profil")+
      tsTxt(150,78,"piqûre au ras du 1er pli","middle")+
      tsTxt(230,108,"bord à vif")+tsTxt(230,120,"enfermé")+
      tsTxt(200,145,"hauteur : 2 cm","middle"));
  },
  cranter:function(){
    var c="";
    for(var i=0;i<7;i++){ var t=0.1+i*0.13, x=40+t*180, y=40+Math.sin(t*Math.PI)*60; c+='<path d="M'+(x-5).toFixed(1)+' '+(y-12).toFixed(1)+' L'+x.toFixed(1)+' '+(y-2).toFixed(1)+' L'+(x+5).toFixed(1)+' '+(y-12).toFixed(1)+'" fill="#fff" stroke="'+TS.tr+'"/>'; }
    return tsSvg('<path d="M30 30 Q130 170 230 30 L230 20 L30 20 Z" fill="'+TS.tis+'" stroke="'+TS.tr+'"/>'+
      '<path d="M40 40 Q130 160 220 40" fill="none" stroke="'+TS.pt+'" stroke-width="2" stroke-dasharray="6 3"/>'+c+
      tsTxt(130,135,"crans : jusqu'à 2 mm de la couture, jamais dedans","middle"));
  },
  angle:function(){
    return tsSvg('<path d="M30 30 L200 30 L200 130" fill="'+TS.tis+'" stroke="'+TS.tr+'"/>'+
      '<rect x="30" y="30" width="170" height="100" fill="'+TS.tis+'" stroke="'+TS.tr+'"/>'+
      '<path d="M30 45 L185 45 L185 130" fill="none" stroke="'+TS.pt+'" stroke-width="2" stroke-dasharray="6 3"/>'+
      '<circle cx="185" cy="45" r="4" fill="'+TS.pt+'"/>'+
      '<path d="M190 30 L200 30 L200 40 Z" fill="#fff" stroke="'+TS.tr+'" stroke-dasharray="2 2"/>'+
      tsTxt(60,70,"aiguille piquée dans le tissu,")+tsTxt(60,83,"pied levé, on pivote")+tsTxt(205,25,"dégarnir le coin"));
  },
  surpiq:function(){
    return tsSvg('<rect x="20" y="40" width="220" height="70" fill="'+TS.tis+'" stroke="'+TS.tr+'"/>'+
      '<line x1="20" y1="40" x2="240" y2="40" stroke="'+TS.tr+'" stroke-width="3"/>'+
      '<line x1="30" y1="50" x2="230" y2="50" stroke="'+TS.pt+'" stroke-width="2" stroke-dasharray="9 4"/>'+
      tsTxt(30,78,"endroit, bord repassé")+tsTxt(30,92,"point plus long (3 à 3,5 mm), à 3–5 mm du bord"));
  },
  tube:function(){
    return tsSvg('<rect x="20" y="50" width="200" height="40" rx="3" fill="'+TS.tis+'" stroke="'+TS.tr+'"/>'+
      tsPoints(20,80,220,80)+
      '<path d="M220 55 Q245 70 220 85" fill="none" stroke="'+TS.tr+'"/>'+
      '<line x1="30" y1="70" x2="215" y2="70" stroke="'+TS.fl+'" stroke-width="3"/>'+'<circle cx="215" cy="70" r="4" fill="'+TS.fl+'"/>'+
      tsTxt(20,40,"plié endroit contre endroit, cousu sur la longueur")+tsTxt(20,112,"épingle à nourrice fixée au bout, glissée dans le tube")+tsTxt(20,125,"puis on tire : le tube se retourne"));
  },
  elastique:function(){
    return tsSvg('<rect x="20" y="30" width="220" height="90" fill="'+TS.tis+'" stroke="'+TS.tr+'"/>'+
      '<rect x="20" y="30" width="220" height="30" fill="'+TS.tis2+'" stroke="'+TS.tr+'"/>'+
      tsPoints(20,60,240,60)+
      '<rect x="40" y="40" width="150" height="10" fill="#fff" stroke="'+TS.fl+'"/>'+
      '<path d="M190 45 l18 0" stroke="'+TS.fl+'" stroke-width="2"/><circle cx="210" cy="45" r="3" fill="'+TS.fl+'"/>'+
      '<path d="M215 30 L215 60" stroke="#fff" stroke-width="4"/>'+tsTxt(212,25,"ouverture de 4 cm","middle")+
      tsTxt(30,90,"canal = largeur de l'élastique + 5 mm")+tsTxt(30,104,"élastique = tour de taille − 8 à 10 %"));
  },
  boxes:function(){
    return tsSvg('<path d="M40 20 L140 20 L140 120 L40 120 Z" fill="'+TS.tis+'" stroke="'+TS.tr+'"/>'+
      '<path d="M140 20 L240 120" stroke="'+TS.tr+'" stroke-dasharray="3 3"/>'+
      '<path d="M170 60 L200 60 L185 75 Z" fill="none"/>'+
      '<path d="M160 85 L230 85" stroke="'+TS.pt+'" stroke-width="2" stroke-dasharray="6 3"/>'+
      '<path d="M195 50 L230 85 L160 85 Z" fill="'+TS.tis2+'" stroke="'+TS.tr+'"/>'+
      '<line x1="195" y1="50" x2="195" y2="85" stroke="'+TS.fl+'" stroke-dasharray="2 2"/>'+
      tsTxt(160,103,"couture de côté alignée")+tsTxt(160,116,"sur la couture du fond")+tsTxt(45,70,"sac à l'envers"));
  },
  bordure:function(){
    return tsSvg('<path d="M60 40 Q130 120 200 40" fill="none" stroke="'+TS.tr+'" stroke-width="3"/>'+
      '<path d="M70 35 Q130 100 190 35" fill="none" stroke="'+TS.pt+'" stroke-width="7" opacity=".45"/>'+
      tsTxt(130,130,"bande = 85 à 90 % du tour d'encolure","middle")+tsTxt(130,143,"on l'étire légèrement en cousant, pas le t-shirt","middle"));
  },
  biais:function(){
    return tsSvg('<rect x="20" y="20" width="220" height="110" fill="'+TS.tis+'" stroke="'+TS.tr+'"/>'+
      '<path d="M40 130 L150 20 L175 20 L65 130 Z" fill="#fff" stroke="'+TS.pt+'" stroke-width="1.5"/>'+
      tsTxt(180,60,"45° par rapport")+tsTxt(180,73,"à la lisière :")+tsTxt(180,86,"le biais s'étire")+tsTxt(180,99,"et épouse les courbes"));
  },
  manche:function(){
    return tsSvg('<path d="M30 30 L110 20 L110 130 L30 130 Z" fill="'+TS.tis+'" stroke="'+TS.tr+'"/>'+
      '<path d="M110 20 Q125 60 110 95" fill="none" stroke="'+TS.tr+'"/>'+
      '<path d="M110 20 Q170 5 230 60 L230 120 L125 110 Q125 60 110 20" fill="'+TS.tis2+'" stroke="'+TS.tr+'"/>'+
      tsPoints(112,24,118,98)+
      tsTxt(35,145,"1. manche cousue à plat dans l'emmanchure")+tsTxt(140,145,"2. puis côté + manche d'un trait"));
  },
  invisible:function(){
    var s="";
    for(var i=0;i<6;i++){ var x=40+i*32; s+='<path d="M'+x+' 60 L'+(x+14)+' 60" stroke="'+TS.pt+'" stroke-width="1.6"/><path d="M'+(x+14)+' 60 L'+(x+16)+' 90 L'+(x+30)+' 90 L'+(x+32)+' 60" fill="none" stroke="'+TS.pt+'" stroke-width="1.2" stroke-dasharray="2 2"/>'; }
    return tsSvg('<rect x="20" y="30" width="220" height="30" fill="'+TS.tis+'" stroke="'+TS.tr+'"/>'+
      '<rect x="20" y="90" width="220" height="30" fill="'+TS.tis2+'" stroke="'+TS.tr+'"/>'+s+
      tsTxt(22,140,"le fil voyage à l'intérieur des plis (pointillé) : invisible à l'endroit"));
  },
  zip:function(){
    var d=""; for(var y=30;y<125;y+=6)d+='<line x1="126" y1="'+y+'" x2="134" y2="'+y+'" stroke="'+TS.tr+'" stroke-width="2"/>';
    return tsSvg('<rect x="40" y="20" width="85" height="110" fill="'+TS.tis+'" stroke="'+TS.tr+'"/>'+
      '<rect x="135" y="20" width="85" height="110" fill="'+TS.tis+'" stroke="'+TS.tr+'"/>'+d+
      '<rect x="124" y="22" width="12" height="8" fill="'+TS.fl+'"/>'+
      tsPoints(118,25,118,128)+tsPoints(142,25,142,128)+
      tsTxt(20,145,"pied à fermeture : l'aiguille passe au ras des dents"));
  }
};

/* ---------- les fiches ---------- */
var TECHS=[
 {id:"decatissage",titre:"Décatir le tissu",cat:"Préparer",niveau:1,min:5,
  alias:["décatissage","laver le tissu"],
  pourquoi:"Un tissu neuf rétrécit au premier lavage — parfois de 5 à 10 % pour le coton ou le lin. Si tu coupes avant, c'est ton vêtement qui rétrécira.",
  materiel:["Ton tissu","La machine à laver"],
  etapes:["Lave le tissu comme tu laveras le vêtement fini (même température, même programme).","Fais un point de surfil ou un zigzag sur les bords coupés avant le lavage : ils s'effilochent moins.","Sèche-le comme tu le sécheras plus tard (sèche-linge seulement si le vêtement ira au sèche-linge).","Repasse-le à plat avant de couper."],
  erreurs:["Laver à 30 °C un coton que tu laveras ensuite à 60 °C : il rétrécira encore.","Oublier la doublure et l'entoilage : ils rétrécissent aussi."],
  astuce:"Mets un morceau de 10 × 10 cm de côté avant de laver, mesure-le après : tu sauras exactement de combien ton tissu a rétréci."},

 {id:"repassage",titre:"Repasser en cousant",cat:"Préparer",niveau:1,min:2,
  alias:["repassage","presser"],
  pourquoi:"C'est la différence entre un vêtement qui a l'air fait main et un vêtement qui a l'air acheté. On repasse chaque couture avant de la croiser avec une autre.",
  materiel:["Fer à vapeur","Une pattemouille (un torchon fin en coton)"],
  etapes:["Repasse d'abord la couture à plat, telle qu'elle a été cousue : les points se « posent » dans le tissu.","Ouvre les marges avec la pointe du fer (couture ouverte) ou couche-les du même côté (couture couchée), selon ce qu'indique le patron.","Presse, ne frotte pas : pose le fer, soulève, déplace.","Pour les tissus délicats ou foncés, passe par la pattemouille pour éviter les traces brillantes."],
  erreurs:["Croiser deux coutures sans avoir repassé la première : l'épaisseur se voit.","Repasser le jersey en faisant glisser le fer : il se déforme."],
  astuce:"Garde le fer allumé à côté de la machine pendant tout le projet. Si tu dois te lever pour repasser, tu finiras par sauter l'étape."},

 {id:"patron",titre:"Préparer son patron",cat:"Préparer",niveau:1,min:20,
  alias:["patron"],schema:"droitfil",
  pourquoi:"Un patron mal reporté donne des pièces qui ne se rejoignent pas. Les repères (crans, points, droit-fil) sont aussi importants que le contour.",
  materiel:["Le patron imprimé ou papier","Papier de soie ou papier kraft pour décalquer","Crayon, règle, scotch"],
  etapes:["Vérifie le carré témoin : 5 cm pile. Sinon l'impression a été mise à l'échelle.","Assemble les pages en suivant les codes (A1, B1…) et les repères de collage.","Décalque ta taille (ou le patron sur mesure de l'app, qui n'en a qu'une) plutôt que de découper l'original.","Reporte tous les repères : crans, pinces, droit-fil, « au pli », nom de la pièce et nombre à couper."],
  erreurs:["Imprimer en « ajuster à la page » : le patron est réduit de quelques %.","Oublier les crans : ce sont eux qui disent quelle couture va avec quelle couture."],
  astuce:"Écris sur chaque pièce le nom du projet et la date : dans six mois, tu retrouveras tes pièces sans chercher."},

 {id:"coupe",titre:"Couper le tissu",cat:"Préparer",niveau:1,min:30,
  alias:["coupe","couper"],schema:"droitfil",
  pourquoi:"Une pièce coupée de travers ne tombera jamais droit, quelle que soit la qualité de la couture. Le droit-fil, c'est la règle numéro un.",
  materiel:["Ciseaux de couture (réservés au tissu)","Épingles ou poids","Craie ou feutre effaçable","Mètre ruban"],
  etapes:["Plie le tissu en deux, endroit contre endroit, lisière contre lisière.","Pose les pièces : la flèche de droit-fil doit être à la même distance de la lisière aux deux bouts — mesure-le.","Les pièces « au pli » se posent bord contre la pliure, sans marge de ce côté.","Épingle (ou pose des poids), puis coupe à grands coups de ciseaux, la main posée à plat sur le tissu.","Marque les crans par une petite entaille de 3 mm, et les repères à la craie."],
  erreurs:["Tenir le tissu en l'air en coupant : il bouge.","Placer une pièce « à l'œil » sans mesurer le droit-fil.","Couper les crans vers l'extérieur en triangle : c'est plus long et moins précis qu'une petite entaille."],
  astuce:"Pose toutes les pièces avant de couper la première : si ça ne rentre pas, tu le sais avant d'avoir abîmé le tissu."},

 {id:"mesures",titre:"Prendre ses mesures",cat:"Préparer",niveau:1,min:15,
  alias:["mesures","prendre ses mesures"],
  pourquoi:"Le patron sur mesure de l'app est aussi juste que tes mesures. Deux centimètres d'erreur sur la poitrine, c'est un vêtement trop serré.",
  materiel:["Mètre ruban souple","Une ficelle nouée à la taille","Quelqu'un pour t'aider, idéalement"],
  etapes:["En sous-vêtements ou vêtements fins, debout, détendue, pieds joints.","Noue une ficelle à la taille naturelle (le creux) : c'est le repère de toutes les mesures verticales.","Le mètre est à plat, horizontal, ni serré ni lâche : tu dois pouvoir glisser un doigt dessous.","Prends chaque mesure deux fois. Si l'écart dépasse 1 cm, recommence.","Remplis tes mesures dans Mes profils : l'app vérifie celles qui semblent incohérentes."],
  erreurs:["Rentrer le ventre ou gonfler la poitrine.","Mesurer par-dessus un pull.","Confondre tour de hanches (le plus large du bassin) et tour de taille."],
  astuce:"Refais tes mesures tous les six mois, ou avant un projet ajusté : elles bougent plus qu'on ne croit.",
  lien:{label:"Ouvrir Mes profils",vue:"profil"}},

 {id:"couture-droite",titre:"La couture droite",cat:"Coudre",niveau:1,min:10,
  alias:["couture droite","point droit","assembler"],schema:"couture",
  pourquoi:"90 % d'un vêtement, ce sont des coutures droites. Une marge régulière et des extrémités arrêtées, et le reste suit.",
  materiel:["Machine à coudre, point droit longueur 2,5","Épingles"],
  etapes:["Épingle les deux pièces endroit contre endroit, épingles perpendiculaires au bord, têtes vers toi.","Aligne le bord du tissu sur le repère de la plaque à aiguille qui correspond à ta marge (1,5 cm en général).","Couds 3 ou 4 points, puis 3 ou 4 points en marche arrière, puis repars : c'est l'arrêt.","Regarde le bord du tissu sur le repère, pas l'aiguille. Laisse la machine entraîner le tissu, guide-le seulement.","Retire les épingles au fur et à mesure, avant qu'elles arrivent sous le pied.","Finis par un arrêt, coupe les fils."],
  erreurs:["Tirer le tissu : la couture ondule et les points se resserrent.","Coudre sur les épingles : l'aiguille casse.","Oublier l'arrêt : la couture se défait au premier essayage."],
  astuce:"Entraîne-toi sur une feuille de papier sans fil, en suivant des lignes tracées au crayon : c'est le meilleur exercice de guidage qui soit."},

 {id:"surfilage",titre:"Surfiler les bords",cat:"Finitions",niveau:1,min:10,
  alias:["surfilage","zigzag","surjet"],schema:"surfil",
  pourquoi:"Un bord coupé s'effiloche à chaque lavage. Surfiler, c'est ce qui fait qu'un vêtement dure des années au lieu de quelques mois.",
  materiel:["Point zigzag (largeur 4, longueur 2) ou surjeteuse","Ou : ciseaux cranteurs pour les tissus qui s'effilochent peu"],
  etapes:["Règle le zigzag : largeur 4 à 5, longueur 1,5 à 2.","Couds le long du bord : l'aiguille tombe dans le tissu à gauche, et juste à côté du bord à droite.","Tu peux surfiler chaque marge séparément (couture ouverte) ou les deux ensemble (couture couchée).","Repasse."],
  erreurs:["Zigzag trop serré : le bord gondole comme une fronce.","Surfiler après avoir croisé les coutures : les angles deviennent inaccessibles."],
  astuce:"Beaucoup de machines ont un point « overlock » ou « surjet » (souvent illustré par un zigzag avec une ligne droite) : plus solide que le zigzag simple."},

 {id:"ourlet",titre:"L'ourlet double",cat:"Finitions",niveau:1,min:20,
  alias:["ourlet","rabat","rempli"],schema:"ourlet",
  pourquoi:"Le bord du vêtement est ce qu'on voit le plus. Un ourlet double enferme le bord à vif : propre, solide, sans surfilage.",
  materiel:["Fer à repasser","Épingles","Un carton découpé à la hauteur de l'ourlet (optionnel)"],
  etapes:["Sur l'envers, replie le bord de 1 cm et repasse.","Replie une deuxième fois de la hauteur d'ourlet voulue (2 cm par exemple), repasse, épingle.","Couds sur l'envers, au ras du premier pli, en tournant le vêtement au fur et à mesure.","Repasse l'ourlet fini."],
  erreurs:["Ne pas repasser les deux plis avant de coudre : l'ourlet vrille.","Faire un ourlet large sur une courbe : le tissu fait des plis (voir « ourlet sur courbe »)."],
  astuce:"Découpe un carton de la hauteur exacte de l'ourlet et plie le tissu dessus en repassant : tous les centimètres seront identiques."},

 {id:"ourlet-courbe",titre:"L'ourlet sur une courbe",cat:"Finitions",niveau:2,min:30,
  alias:["ourlet courbe","ourlet étroit"],schema:"ourlet",
  pourquoi:"Sur une courbe (bas de chemise, jupe évasée), le bord replié est plus long que l'endroit où il se pose. Il faut un ourlet étroit pour que ça ne godaille pas.",
  materiel:["Fer","Machine au point droit"],
  etapes:["Couds une ligne droite à 6 mm du bord, sur tout le tour : c'est ton guide de pliage.","Replie le long de cette ligne et repasse — la couture aide le tissu à se courber.","Replie encore une fois de 6 mm, repasse, couds au ras du pli.","Plus la courbe est forte, plus l'ourlet doit être étroit."],
  erreurs:["Un ourlet de 3 cm sur une jupe cercle : impossible de l'aplatir.","Étirer le biais de la courbe en repassant."],
  astuce:"Sur une jupe évasée, laisse-la pendre 24 h sur un cintre avant de faire l'ourlet : le biais s'allonge, et tu recoupes droit ensuite."},

 {id:"couture-courbe",titre:"Coudre et cranter une courbe",cat:"Coudre",niveau:2,min:15,
  alias:["couture courbe","courbes","cranter","encolure"],schema:"cranter",
  pourquoi:"Une courbe cousue puis retournée (encolure, emmanchure) tire tant qu'on n'a pas libéré la marge. Les crans lui permettent de s'étaler.",
  materiel:["Machine","Petits ciseaux pointus"],
  etapes:["Couds lentement, en t'arrêtant aiguille piquée pour tourner le tissu petit à petit.","Dégarnis la marge à 5–7 mm pour réduire l'épaisseur.","Courbe concave (creuse, comme une encolure) : fais de petites entailles droites dans la marge.","Courbe convexe (bombée, comme un bas arrondi) : découpe de petits triangles.","Arrête chaque cran à 2 mm de la couture, jamais dedans. Retourne, repasse."],
  erreurs:["Coudre la courbe d'une traite, vite : elle devient une ligne brisée.","Cranter jusque dans la couture : un trou apparaît à l'endroit."],
  astuce:"Plus la courbe est serrée, plus les crans sont rapprochés : tous les 1 cm sur une encolure, tous les 3 cm sur une courbe douce."},

 {id:"angles",titre:"Les angles nets",cat:"Coudre",niveau:1,min:10,
  alias:["angles","coins","pivoter"],schema:"angle",
  pourquoi:"Un coin de coussin ou de col bien pointu, c'est deux gestes : pivoter au bon endroit, et retirer l'épaisseur avant de retourner.",
  materiel:["Machine","Ciseaux","Un outil à pointe mousse (baguette, crayon sans mine) pour sortir le coin"],
  etapes:["Arrive au coin, marque la marge à la craie si besoin, et arrête-toi à exactement une marge du bord perpendiculaire.","Aiguille piquée dans le tissu, lève le pied, fais pivoter le tissu, baisse le pied, repars.","Coupe le coin en biais à 2–3 mm de la couture.","Retourne, pousse le coin de l'intérieur avec l'outil — doucement, sans percer.","Repasse."],
  erreurs:["Pivoter aiguille levée : le tissu se décale et l'angle s'arrondit.","Ne pas dégarnir : le coin reste rond, rempli de tissu."],
  astuce:"Pour un angle encore plus net, fais un ou deux petits points en travers de la pointe au lieu de pivoter d'un coup."},

 {id:"coins-boxes",titre:"Les coins boxés (fond de sac)",cat:"Coudre",niveau:1,min:15,
  alias:["coins boxés","fond plat"],schema:"boxes",
  pourquoi:"C'est ce qui transforme un sac plat en sac qui tient debout. Un triangle cousu à chaque coin du fond donne la profondeur.",
  materiel:["Règle","Craie","Machine"],
  etapes:["Sac cousu, à l'envers. Pince un coin du fond et aplatis-le en triangle : la couture de côté se pose exactement sur la couture du fond.","Trace une ligne perpendiculaire à la couture, à la distance voulue de la pointe (5 cm de ligne = 10 cm de profondeur de sac).","Couds sur la ligne avec un arrêt à chaque bout.","Coupe le triangle à 1 cm de la couture, surfile, fais pareil de l'autre côté."],
  erreurs:["Coutures non superposées : le sac penche.","Des deux côtés, pas la même distance : un sac bancal."],
  astuce:"Plante une épingle droit à travers les deux coutures pour vérifier qu'elles sont bien l'une sur l'autre avant de coudre."},

 {id:"surpiqure",titre:"La surpiqûre",cat:"Finitions",niveau:1,min:10,
  alias:["surpiqûre","surpiquer"],schema:"surpiq",
  pourquoi:"Une couture visible, à l'endroit, qui maintient un bord à plat et dessine le vêtement. Sur un jean, c'est elle qui fait le style.",
  materiel:["Point droit allongé (3 à 3,5 mm)","Fil assorti ou fil contrasté (fil à surpiquer pour le denim)"],
  etapes:["Repasse d'abord le bord ou la couture à surpiquer.","Allonge le point : 3 à 3,5 mm.","Couds à l'endroit, à distance fixe du bord (3 à 5 mm) en suivant un repère du pied presseur.","Ne fais pas d'arrêt en marche arrière (il se verrait) : laisse des fils longs, passe-les à l'envers et noue-les."],
  erreurs:["Point trop court : la surpiqûre ne se voit pas et fronce.","Changer de repère en cours de route : la ligne ondule."],
  astuce:"Regarde le bord du pied presseur contre le bord du tissu, pas l'aiguille : ton œil suivra une ligne, pas un point."},

 {id:"tube",titre:"Le tube retourné (bretelles, liens, anses)",cat:"Coudre",niveau:1,min:20,
  alias:["tube retourné","liens","anses","bretelles"],schema:"tube",
  pourquoi:"Bretelles, liens de tablier, anses de sac : tout part d'une bande pliée, cousue, retournée.",
  materiel:["Épingle à nourrice ou retourne-biais","Machine","Fer"],
  etapes:["Plie la bande en deux dans la longueur, endroit contre endroit, épingle.","Couds sur la longueur, marge de 6 à 8 mm. Laisse les deux bouts ouverts.","Accroche une épingle à nourrice à une extrémité, glisse-la dans le tube et fais-la avancer en fronçant le tissu dessus.","Tire : le tube se retourne. Roule la couture pour la placer sur le côté, repasse."],
  erreurs:["Tube trop étroit (moins de 2 cm fini) : presque impossible à retourner à la main.","Marge trop large : elle bloque à l'intérieur — dégarnis-la avant de retourner."],
  astuce:"Pour les anses de sac, pas besoin de retourner : plie les deux bords vers le milieu, replie en deux, surpiquer des deux côtés. Plus rapide, plus solide."},

 {id:"elastique",titre:"La coulisse élastique",cat:"Coudre",niveau:1,min:25,
  alias:["élastique","coulisse élastique","ceinture","taille élastique"],schema:"elastique",
  pourquoi:"La taille la plus simple qui soit : pas de fermeture, pas d'essayage au millimètre. Le premier vêtement de beaucoup de couturières.",
  materiel:["Élastique plat (2 à 3 cm)","Épingle à nourrice","Machine"],
  etapes:["Coupe l'élastique : ton tour de taille moins 8 à 10 %. Essaie-le autour de toi avant de couper.","Replie le haut de 1 cm, repasse ; replie de la largeur de l'élastique + 5 mm, repasse.","Couds au ras du pli en laissant une ouverture de 4 cm.","Épingle à nourrice au bout de l'élastique, fais-la voyager dans le canal. Épingle l'autre bout au tissu pour qu'il ne s'échappe pas.","Superpose les deux bouts de l'élastique sur 2 cm, couds-les en zigzag, en carré.","Ferme l'ouverture, répartis les fronces."],
  erreurs:["Élastique trop serré : il marque la peau et tire la couture.","Laisser le bout libre s'échapper dans le canal : il faut tout recommencer."],
  astuce:"Couds une ligne verticale à travers le canal et l'élastique au niveau des coutures de côté : l'élastique ne vrillera plus au lavage."},

 {id:"point-extensible",titre:"Coudre la maille (jersey)",cat:"Coudre",niveau:2,min:15,
  alias:["point extensible","jersey","maille"],schema:"surfil",
  pourquoi:"Le jersey s'étire ; une couture au point droit, non. Au premier enfilage, elle craque. Il faut un point qui s'étire avec le tissu.",
  materiel:["Aiguille jersey ou stretch (pointe arrondie)","Point extensible (éclair), ou zigzag étroit (largeur 1, longueur 2,5)","Idéalement un pied à double entraînement"],
  etapes:["Change l'aiguille : une aiguille universelle coupe les mailles et fait des trous.","Choisis le point éclair (ou le zigzag étroit).","Épingle souvent, ou mieux, utilise des pinces : le jersey glisse.","Couds sans tirer ni retenir : le tissu doit avancer à plat. Si ça ondule, baisse un peu la pression du pied.","Pas besoin de surfiler : le jersey ne s'effiloche pas."],
  erreurs:["Étirer le tissu en cousant : la couture gondole pour toujours.","Garder l'aiguille universelle : points sautés et petits trous."],
  astuce:"Fais toujours un essai sur une chute, tissu en deux épaisseurs : étire-le fort. Si les points cassent, allonge-les ou élargis le zigzag."},

 {id:"ourlet-jersey",titre:"L'ourlet du jersey",cat:"Finitions",niveau:2,min:20,
  alias:["ourlet jersey","aiguille double"],
  pourquoi:"L'ourlet du t-shirt doit s'étirer avec lui. L'aiguille double fait deux lignes parallèles à l'endroit et un zigzag à l'envers : c'est la finition des t-shirts du commerce.",
  materiel:["Aiguille double stretch (4 mm)","Deux bobines de fil","Fer"],
  etapes:["Replie l'ourlet une seule fois (2 à 2,5 cm) : le jersey ne s'effiloche pas. Repasse sans étirer.","Installe l'aiguille double et les deux fils (deux porte-bobines).","Couds à l'endroit, à 1,5 cm du bord, point droit longueur 3.","Tire les fils à l'envers, noue-les."],
  erreurs:["Coudre à l'envers : les deux lignes tombent n'importe où à l'endroit.","Point trop court : le tissu forme un bourrelet entre les deux aiguilles."],
  astuce:"Une bande de thermocollant pour ourlet (type Vlieseline) posée dans le pli empêche le bourrelet et rend la couture beaucoup plus facile."},

 {id:"bordure-maille",titre:"La bande d'encolure en maille",cat:"Finitions",niveau:2,min:25,
  alias:["bordure maille","bande d'encolure","col t-shirt"],schema:"bordure",
  pourquoi:"L'encolure du t-shirt : une bande de jersey pliée, légèrement plus courte que l'encolure, qui la resserre pour qu'elle plaque au corps.",
  materiel:["Bande de jersey (ou de côte) coupée dans le sens de l'étirement","Épingles ou pinces","Point extensible"],
  etapes:["Mesure l'encolure sur la couture (pas le bord). Coupe la bande à 85–90 % de cette longueur, sur une hauteur de 2 fois la bande finie + 2 marges.","Ferme la bande en anneau, plie-la en deux dans la longueur, envers contre envers.","Divise la bande et l'encolure en quatre avec des épingles, fais-les coïncider.","Couds en étirant la bande — et seulement la bande — pour qu'elle couvre l'encolure entre deux repères.","Repasse à la vapeur : la légère ondulation disparaît. Surpiquer la marge vers le corps si tu veux."],
  erreurs:["Bande aussi longue que l'encolure : elle bâille.","Étirer aussi le t-shirt : l'encolure se déforme."],
  astuce:"Pour un jersey très extensible, descends à 80 % ; pour un jersey épais ou peu élastique, remonte à 92 %."},

 {id:"manche-a-plat",titre:"Monter une manche à plat",cat:"Coudre",niveau:2,min:30,
  alias:["manche montée à plat","manche à plat","monter la manche"],schema:"manche",
  pourquoi:"La méthode des t-shirts et chemises casual : la manche est cousue avant de fermer les côtés, tout à plat. Beaucoup plus simple que de monter une manche « en rond ».",
  materiel:["Machine","Épingles"],
  etapes:["Couds les épaules d'abord.","Repère le milieu de la tête de manche (un cran) et pose-le sur la couture d'épaule, endroit contre endroit.","Épingle du milieu vers les bords : la tête de manche est légèrement plus longue que l'emmanchure, répartis cette aisance.","Couds côté manche en dessous : les griffes de la machine résorbent l'aisance.","Ferme ensuite côté du corps et dessous de manche d'une seule couture, en commençant par le bas du vêtement."],
  erreurs:["Coudre la manche à l'envers (tête de manche gauche/droite inversées) : vérifie le cran double, qui va vers le dos.","Tirer pour que tout coïncide : des plis apparaissent."],
  astuce:"Fais coïncider les coutures d'emmanchure pile l'une sur l'autre au dessous de bras, et épingle là en premier."},

 {id:"fermeture",titre:"Poser une fermeture à glissière",cat:"Fermer",niveau:2,min:40,
  alias:["fermeture éclair","fermeture à glissière","zip"],schema:"zip",
  pourquoi:"Elle fait peur, mais c'est une question d'outil : avec le pied spécial, l'aiguille passe au ras des dents et c'est une couture comme une autre.",
  materiel:["Pied presseur pour fermeture à glissière","Fermeture de la bonne longueur","Colle textile en bâton ou épingles"],
  etapes:["Couds la couture sous la fermeture, puis bâtis (point le plus long) l'emplacement de la fermeture. Ouvre et repasse les marges.","Pose la fermeture face contre les marges ouvertes, dents exactement sur la couture bâtie. Épingle ou colle.","Avec le pied à fermeture, couds d'un côté, en travers en bas, puis de l'autre côté, depuis l'endroit.","Arrivée au curseur, aiguille piquée, lève le pied et fais glisser le curseur derrière.","Découds le bâti : la fermeture apparaît."],
  erreurs:["Utiliser le pied normal : impossible de coudre près des dents.","Coudre par-dessus le curseur : l'aiguille casse."],
  astuce:"Achète une fermeture plus longue que nécessaire : on coud avec le curseur hors du passage, et on coupe l'excédent en haut à la fin."},

 {id:"fermeture-invisible",titre:"La fermeture invisible",cat:"Fermer",niveau:3,min:45,
  alias:["fermeture invisible"],schema:"zip",
  pourquoi:"Celle des robes et jupes : une fois posée, on ne voit qu'une couture. Elle se pose avant de fermer la couture, pas après.",
  materiel:["Pied pour fermeture invisible (quelques euros, indispensable)","Fermeture invisible plus longue que l'ouverture","Fer à repasser tiède"],
  etapes:["Repasse les dents de la fermeture à plat, au fer tiède, pour dérouler les spirales.","Épingle la fermeture ouverte sur l'endroit d'une pièce, dents vers l'intérieur, sur la ligne de couture.","Avec le pied invisible, dent dans la rainure, couds de haut en bas jusqu'au curseur.","Fais de même avec l'autre côté, en vérifiant que les hauts sont alignés.","Ferme la fermeture, puis couds la couture en dessous avec le pied à fermeture classique, en commençant 5 mm au-dessus du bas de la couture précédente."],
  erreurs:["Fermer la couture d'abord, comme pour une fermeture classique.","Ne pas repasser les dents : la couture passe à 3 mm et la fermeture se voit."],
  astuce:"Trace à la craie des repères horizontaux sur les deux côtés avant de coudre (taille, poitrine) : ils doivent se retrouver face à face une fois fermée."},

 {id:"point-invisible",titre:"Le point invisible à la main",cat:"Finitions",niveau:1,min:15,
  alias:["point invisible","point glissé","fermer une ouverture"],schema:"invisible",
  pourquoi:"Pour refermer l'ouverture d'un coussin ou d'une doublure sans qu'on voie la couture. Cinq minutes de fil à la main, résultat parfait.",
  materiel:["Aiguille à main fine","Fil assorti"],
  etapes:["Replie et repasse les deux bords de l'ouverture à la marge de couture, face à face.","Pique dans le pli d'un côté, fais glisser l'aiguille 5 mm dans le pli, ressors.","Traverse tout droit vers le pli d'en face, repique dedans, glisse 5 mm, ressors.","Tous les 3 ou 4 points, tire doucement le fil : les deux bords se ferment et le fil disparaît.","Fais un nœud, repique dans la couture et ressors plus loin, coupe au ras."],
  erreurs:["Points en diagonale : ils se voient.","Tirer trop fort : la couture fronce."],
  astuce:"Utilise un fil de la couleur du tissu, jamais du blanc « par défaut » : même invisible, il se voit à la lumière."},

 {id:"biais",titre:"Poser un biais",cat:"Finitions",niveau:2,min:30,
  alias:["biais","border au biais"],schema:"biais",
  pourquoi:"Une bande coupée à 45° s'étire et suit les courbes : idéal pour border une encolure, une emmanchure sans manche, un bord de tablier.",
  materiel:["Biais tout prêt ou bande coupée à 45°","Fer","Machine"],
  etapes:["Ouvre un rempli du biais, pose-le endroit contre endroit sur le bord du vêtement.","Couds dans le pli ouvert, sans étirer le biais sur les droites, en l'étirant très légèrement dans les courbes creuses.","Rabats le biais sur la couture, puis vers l'envers, en enveloppant la marge. Repasse.","Surpiqûre depuis l'endroit, au ras du bord du biais, ou finis au point invisible."],
  erreurs:["Étirer le biais sur une courbe bombée : ça fronce.","Couper la bande dans le droit-fil : elle ne tournera pas."],
  astuce:"Un appareil à biais (une petite pièce de métal à 5 €) plie la bande tout seul pendant que tu repasses."},

 {id:"doublure",titre:"Doubler une pièce",cat:"Coudre",niveau:2,min:30,
  alias:["doublure","doubler"],
  pourquoi:"Une doublure cache toutes les coutures, rend un sac ou une veste plus nets, et se pose selon un principe unique : endroit contre endroit, on coud, on retourne.",
  materiel:["Tissu de doublure","Machine","Fer"],
  etapes:["Assemble séparément le vêtement et sa doublure.","Pose-les endroit contre endroit, couds les bords qui doivent être nets (encolure, haut du sac…).","Laisse une ouverture de 10 à 15 cm (souvent dans une couture de côté de la doublure).","Dégarnis, crante les courbes, retourne par l'ouverture, repasse.","Ferme l'ouverture au point invisible ou en surpiqûre."],
  erreurs:["Oublier de laisser l'ouverture : impossible de retourner.","Doublure aussi grande que le vêtement : elle dépasse. Elle doit être très légèrement plus petite."],
  astuce:"Repasse la doublure en la faisant « rouler » de 1 à 2 mm vers l'intérieur : elle ne se verra jamais depuis l'endroit."},

 {id:"essayage",titre:"Essayer et ajuster",cat:"Ajuster",niveau:2,min:20,
  alias:["essayage","ajuster","toile"],
  pourquoi:"Même sur mesure, un vêtement s'essaie avant les finitions. C'est le moment où l'on peut encore tout changer sans découdre de surpiqûre.",
  materiel:["Épingles","Craie","Un miroir en pied"],
  etapes:["Essaie après avoir assemblé les coutures principales, avant les ourlets et les finitions.","Regarde d'abord les grandes lignes : les coutures de côté tombent-elles verticalement ? L'épaule est-elle à sa place ?","Pince le tissu en trop avec des épingles, marque à la craie, ou note ce qui tire.","Retouche dans l'app : ajuste l'aisance ou la longueur dans le dessin technique, et la prochaine version sera juste."],
  erreurs:["Essayer seulement à la fin, quand tout est surpiqué.","Corriger d'un seul côté : le vêtement devient asymétrique."],
  astuce:"Pour un vêtement important, couds d'abord une « toile » dans un tissu bon marché de même tenue. Elle sert de brouillon."},

 {id:"rembourrage",titre:"Rembourrer",cat:"Coudre",niveau:1,min:15,
  alias:["rembourrage","rembourrer"],
  pourquoi:"Coussins, peluches, pelotes : un rembourrage régulier fait toute la différence entre un objet ferme et un objet bosselé.",
  materiel:["Ouate de rembourrage","Un manche de cuillère en bois"],
  etapes:["Retourne la pièce et sors bien tous les coins.","Remplis d'abord les extrémités et les coins, par petites poignées, avec le manche.","Continue par petites touffes, en tassant au fur et à mesure.","Palpe : pas de creux, pas de boule. Ferme au point invisible."],
  erreurs:["Enfourner de grosses boules : elles forment des bosses.","Remplir le centre d'abord : les coins restent vides."],
  astuce:"Effiloche chaque poignée entre tes doigts avant de l'enfoncer : c'est le secret d'un rembourrage lisse."},

 {id:"entrejambe",titre:"L'entrejambe et la fourche",cat:"Coudre",niveau:2,min:25,
  alias:["entrejambe","fourche"],
  pourquoi:"Un pantalon s'assemble dans un ordre précis : si on se trompe, les jambes se croisent. Et la fourche, courbe très sollicitée, se renforce.",
  materiel:["Machine","Épingles"],
  etapes:["Couds l'entrejambe de chaque jambe séparément (du bas de jambe à la fourche).","Retourne une jambe sur l'endroit, glisse-la dans l'autre qui reste sur l'envers : les deux sont endroit contre endroit.","Couds la fourche d'une traite, du milieu devant au milieu dos, en faisant coïncider les coutures d'entrejambe.","Recouds une deuxième fois dans la partie la plus courbe, puis crante et surfile."],
  erreurs:["Coudre la fourche avant l'entrejambe sur un pantalon simple : les jambes ne s'assemblent plus.","Oublier de renforcer la fourche : elle craque en s'asseyant."],
  astuce:"Épingle d'abord le point de croisement des coutures d'entrejambe, pile l'une sur l'autre : c'est le point le plus visible du pantalon."},

 {id:"broderie",titre:"Broder à la main : le point arrière",cat:"Décorer",niveau:1,min:20,
  alias:["broderie","broder","point arrière"],
  pourquoi:"Un prénom, un motif, une initiale : le point arrière suffit pour tracer n'importe quelle ligne, et c'est le point de base de toute broderie.",
  materiel:["Fil mouliné (2 ou 3 brins)","Aiguille à broder","Tambour à broder","Feutre effaçable"],
  etapes:["Dessine ton motif au feutre effaçable, tends le tissu dans le tambour.","Sors l'aiguille par l'envers, un point en avant de la ligne.","Repique un point en arrière, au début de la ligne ; ressors un point plus loin devant.","Repique dans le trou du point précédent : les points se touchent et forment une ligne continue.","Arrête le fil à l'envers en le glissant sous les points."],
  erreurs:["Points irréguliers : garde une longueur fixe (2–3 mm).","Tissu non tendu : il fronce autour de la broderie."],
  astuce:"Les courbes serrées se brodent avec des points plus courts : la ligne reste fluide."}
];

/* ---------- résolution des noms utilisés dans les projets ---------- */
function techNorm(s){ return String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").trim(); }
var _techIdx=null;
function techIndex(){
  if(_techIdx)return _techIdx;
  _techIdx={};
  TECHS.forEach(function(t){
    _techIdx[techNorm(t.id)]=t; _techIdx[techNorm(t.titre)]=t;
    (t.alias||[]).forEach(function(a){ _techIdx[techNorm(a)]=t; });
  });
  return _techIdx;
}
function techFind(nom){ return techIndex()[techNorm(nom)]||null; }

/* ---------- ce qu'elle a déjà appris ---------- */
function techAcquises(){ if(typeof state==="undefined")return {}; if(!state.techniques)state.techniques={}; return state.techniques; }
function techToggle(id){
  var a=techAcquises();
  if(a[id])delete a[id]; else a[id]=new Date().toISOString().slice(0,10);
  save();
  var b=document.getElementById("tqAcq"); if(b)techAcqBtn(b,id);
  techRender();
}
function techAcqBtn(b,id){
  var ok=!!techAcquises()[id];
  b.className="btn "+(ok?"":"ghost ")+"sm";
  b.innerHTML=ok?"&#10003; Je sais le faire":"Je sais le faire";
}

/* ---------- la fiche, par-dessus n'importe quelle page ---------- */
function techOpen(nom){
  var t=(typeof nom==="object")?nom:(techFind(nom)||TECHS.filter(function(x){return x.id===nom;})[0]);
  if(!t){ toast("Pas encore de fiche pour « "+nom+" »"); return; }
  techClose();
  var niv=["","Débutante","Intermédiaire","Avancée"][t.niveau]||"";
  var ov=document.createElement("div"); ov.id="tqModal"; ov.className="tq-ov";
  ov.innerHTML='<div class="card tq-box" role="dialog" aria-label="'+esc(t.titre)+'">'+
    '<div class="tq-hd"><div><div class="tq-cat">'+esc(t.cat)+' · '+niv+' · '+t.min+' min</div><h3>'+esc(t.titre)+'</h3></div>'+
      '<button class="x" onclick="techClose()" aria-label="Fermer">&times;</button></div>'+
    '<p class="tq-why">'+esc(t.pourquoi)+'</p>'+
    (t.schema&&TSCH[t.schema]?'<div class="tq-schw">'+TSCH[t.schema]()+'</div>':'')+
    (t.materiel&&t.materiel.length?'<div class="tq-sec">Il te faut</div><ul class="tq-mat">'+t.materiel.map(function(m){return '<li>'+esc(m)+'</li>';}).join("")+'</ul>':'')+
    '<div class="tq-sec">Étapes</div><ol class="tq-et">'+t.etapes.map(function(e){return '<li>'+esc(e)+'</li>';}).join("")+'</ol>'+
    (t.erreurs&&t.erreurs.length?'<div class="tq-sec">Les erreurs qu\'on fait toutes</div><ul class="tq-err">'+t.erreurs.map(function(e){return '<li>'+esc(e)+'</li>';}).join("")+'</ul>':'')+
    (t.astuce?'<div class="tq-tip"><b>Astuce</b> '+esc(t.astuce)+'</div>':'')+
    '<div class="tq-ft">'+
      '<button id="tqAcq" onclick="techToggle(\''+t.id+'\')"></button>'+
      (t.lien?'<button class="btn ghost sm" onclick="techClose();goView(\''+t.lien.vue+'\')">'+esc(t.lien.label)+'</button>':'')+
      '<button class="btn ghost sm" onclick="techChercherVideo(\''+t.id+'\')">Voir en vidéo</button>'+
    '</div></div>';
  document.body.appendChild(ov);
  techAcqBtn(document.getElementById("tqAcq"),t.id);
  ov.addEventListener("click",function(e){ if(e.target===ov)techClose(); });
  document.addEventListener("keydown",techEsc);
}
function techEsc(e){ if(e.key==="Escape")techClose(); }
function techClose(){
  var m=document.getElementById("tqModal"); if(m)m.parentNode.removeChild(m);
  document.removeEventListener("keydown",techEsc);
}
/* une vidéo montre le geste mieux qu'un texte : on ouvre une recherche ciblée en français */
function techChercherVideo(id){
  var t=TECHS.filter(function(x){return x.id===id;})[0]; if(!t)return;
  window.open("https://www.youtube.com/results?search_query="+encodeURIComponent("couture tuto "+t.titre.toLowerCase()),"_blank","noopener");
}

/* ---------- la page Techniques ---------- */
var TQ={cat:"Toutes", q:""};
function techRender(){
  var box=document.getElementById("tqGrid"); if(!box)return;
  var acq=techAcquises();
  var cats=["Toutes"]; TECHS.forEach(function(t){ if(cats.indexOf(t.cat)<0)cats.push(t.cat); });
  var seg=document.getElementById("tqCats");
  if(seg&&!seg.children.length){
    seg.innerHTML=cats.map(function(c){ return '<button data-c="'+esc(c)+'"'+(c===TQ.cat?' class="on"':'')+'>'+esc(c)+'</button>'; }).join("");
    seg.querySelectorAll("button").forEach(function(b){ b.addEventListener("click",function(){
      TQ.cat=b.dataset.c; seg.querySelectorAll("button").forEach(function(n){n.classList.toggle("on",n===b);}); techRender(); }); });
  }
  var q=techNorm(TQ.q);
  var L=TECHS.filter(function(t){
    if(TQ.cat!=="Toutes"&&t.cat!==TQ.cat)return false;
    if(!q)return true;
    return techNorm(t.titre+" "+(t.alias||[]).join(" ")+" "+t.pourquoi).indexOf(q)>=0;
  });
  var n=Object.keys(acq).length;
  var pr=document.getElementById("tqProg");
  if(pr)pr.innerHTML='<b>'+n+'</b> / '+TECHS.length+' techniques acquises<div class="prg-b" style="margin-top:6px;"><i style="width:'+Math.round(n*100/TECHS.length)+'%"></i></div>';
  box.innerHTML=L.length?L.map(function(t){
    var ok=!!acq[t.id];
    return '<button class="tq-card'+(ok?" ok":"")+'" onclick="techOpen(\''+t.id+'\')">'+
      (t.schema&&TSCH[t.schema]?'<span class="tq-th">'+TSCH[t.schema]()+'</span>':'<span class="tq-th tq-th0">'+esc(t.titre.charAt(0))+'</span>')+
      '<span class="tq-b"><span class="tq-t">'+esc(t.titre)+'</span>'+
      '<span class="tq-m">'+esc(t.cat)+' · '+("●●●".slice(0,t.niveau))+'<span style="opacity:.3">'+("●●●".slice(t.niveau))+'</span> · '+t.min+' min'+(ok?' · <span class="tq-okk">&#10003; acquise</span>':'')+'</span></span></button>';
  }).join(""):'<p class="muted">Aucune technique ne correspond.</p>';
}

/* ---------- les noms de techniques du mode Atelier deviennent des liens ---------- */
function techLiens(){
  document.querySelectorAll("#atelier .at-m").forEach(function(m){
    if(m.dataset.tq)return; m.dataset.tq="1";
    /* innerHTML rend « &middot; » sous forme du caractère lui-même */
    var h=m.innerHTML, i=h.indexOf("\u00b7");
    if(i<0)return;
    var avant=h.slice(0,i+1), noms=h.slice(i+1).split(",").map(function(s){return s.trim();}).filter(Boolean);
    m.innerHTML=avant+" "+noms.map(function(n){
      var brut=n.replace(/&amp;/g,"&").replace(/&#39;/g,"'").replace(/&quot;/g,'"');
      var t=techFind(brut);
      return t?'<a href="#" class="tq-lk" onclick="techOpen(\''+t.id+'\');return false;">'+n+'</a>':n;
    }).join(", ");
  });
}
(function(){
  /* on se branche après chaque rendu de l'atelier, sans toucher à app.atelier.js */
  var base=window.atelierRender;
  if(typeof base==="function"){
    window.atelierRender=function(){ var r=base.apply(this,arguments); try{techLiens();}catch(e){} return r; };
  }
  document.addEventListener("DOMContentLoaded",function(){
    var s=document.getElementById("tqSearch");
    if(s)s.addEventListener("input",function(){ TQ.q=s.value; techRender(); });
    document.querySelectorAll('.navbtn[data-v="techniques"]').forEach(function(b){ b.addEventListener("click",techRender); });
    techRender();
  });
})();
window.techOpen=techOpen; window.techClose=techClose; window.techToggle=techToggle;
window.techFind=techFind; window.techRender=techRender; window.techChercherVideo=techChercherVideo;
