"use strict";
/* ===== « Par où commencer » : projets guidés + questionnaire de démarrage =====
 * Le contenu vit ici, en données : on peut l'enrichir sans toucher au code.
 * Chaque projet porte ses étapes de construction, reprises par le mode Atelier.
 */

var GUIDE_PROJETS=[
  {
    id:"chouchou", nom:"Chouchou", emoji:"&#127800;", niveau:1, temps:"30 min", pieces:"1 pièce",
    quoi:["accessoire"], tissu:"Coton, viscose, satin — 15 × 55 cm suffisent (une chute fait l'affaire)",
    metrage:"0,1 m", budget:"1–3 €", mercerie:"20 cm d'élastique plat de 6 mm",
    machine:false, extensible:false,
    pourquoi:"Le premier objet qui marche à tous les coups. Il apprend la couture d'un tube et la fermeture invisible, en une demi-heure.",
    apprend:["couture droite","tube retourné","élastique"],
    pieges:["Ne serre pas trop l'élastique en le mesurant : il doit faire le tour du poignet sans marquer."],
    etapes:[
      {t:"Couper un rectangle de 15 × 55 cm dans le tissu", min:10, tech:["coupe"], conseil:"Utilise une règle et une craie : un rectangle bien droit fait un chouchou bien rond."},
      {t:"Plier en deux dans la longueur, endroit contre endroit, et coudre le long bord à 1 cm", min:8, tech:["couture droite"], conseil:"Laisse une ouverture de 4 cm au milieu : c'est par là qu'on retournera."},
      {t:"Retourner le tube sur l'endroit", min:5, tech:["tube retourné"], conseil:"Aide-toi d'une épingle à nourrice ou d'un crayon."},
      {t:"Passer l'élastique dans le tube avec une épingle à nourrice", min:5, tech:["élastique"], conseil:"Épingle l'autre bout de l'élastique au tissu pour ne pas le perdre dedans."},
      {t:"Coudre les deux bouts de l'élastique l'un sur l'autre", min:3, tech:["élastique"], conseil:"Superpose-les sur 1,5 cm et fais plusieurs allers-retours."},
      {t:"Fermer l'ouverture à la main, au point invisible", min:6, tech:["point invisible"], conseil:"Rentre les bords vers l'intérieur avant de coudre."}
    ]
  },
  {
    id:"bandeau", nom:"Bandeau à nouer", emoji:"&#127746;", niveau:1, temps:"40 min", pieces:"1 pièce",
    quoi:["accessoire"], tissu:"Coton léger, popeline, liberty", metrage:"0,3 m", budget:"2–5 €", mercerie:"Aucune",
    machine:false, extensible:false,
    pourquoi:"Même logique que le chouchou, en plus grand : des coutures droites et un retournement, pour un accessoire que tu mettras vraiment.",
    apprend:["couture droite","angles","tube retourné"],
    pieges:["Dégarnis les angles avant de retourner, sinon ils restent épais et ronds."],
    etapes:[
      {t:"Couper deux bandes de 12 × 90 cm", min:10, tech:["coupe"], conseil:"Ou une seule bande de 24 cm de large pliée en deux."},
      {t:"Superposer endroit contre endroit et coudre tout le tour à 1 cm", min:12, tech:["couture droite"], conseil:"Laisse 8 cm ouverts au milieu d'un grand côté."},
      {t:"Couper les angles en biais, sans toucher la couture", min:4, tech:["angles"], conseil:"À 2 mm du fil."},
      {t:"Retourner sur l'endroit et sortir les angles", min:6, tech:["tube retourné"], conseil:"Pousse doucement avec un crayon émoussé."},
      {t:"Repasser à plat en rentrant les bords de l'ouverture", min:5, tech:["repassage"], conseil:"Le repassage fait 80 % du rendu."},
      {t:"Surpiquer tout le tour à 2 mm du bord", min:8, tech:["surpiqûre"], conseil:"Ça ferme l'ouverture et donne un fini net."}
    ]
  },
  {
    id:"tote", nom:"Tote bag doublé", emoji:"&#128717;", niveau:1, temps:"1 h 30", pieces:"2 pièces",
    quoi:["accessoire"], tissu:"Toile de coton, canvas, jean recyclé", metrage:"0,5 m (+ 0,5 m doublure)",
    budget:"6–12 €", mercerie:"Aucune", machine:true, extensible:false,
    pourquoi:"Le projet qui donne confiance : grand, rapide, utile tous les jours, et il pardonne les coutures imparfaites.",
    apprend:["couture droite","angles","anses","doublure"],
    pieges:["Renforce les anses par un carré cousu en croix : c'est là que tout lâche."],
    etapes:[
      {t:"Couper 2 rectangles de 40 × 45 cm dans la toile, 2 dans la doublure", min:15, tech:["coupe"], conseil:"Vérifie le droit-fil : il doit être parallèle au grand côté."},
      {t:"Couper 2 bandes de 10 × 60 cm pour les anses", min:5, tech:["coupe"]},
      {t:"Plier chaque anse en quatre dans la longueur et surpiquer les deux bords", min:20, tech:["surpiqûre"], conseil:"Repasse les plis avant de coudre, tout devient facile."},
      {t:"Coudre les côtés et le fond des rectangles de toile, endroit contre endroit", min:12, tech:["couture droite"], conseil:"1,5 cm de marge, point d'arrêt au début et à la fin."},
      {t:"Former les coins du fond : aplatir chaque coin en triangle et coudre à 5 cm de la pointe", min:10, tech:["coins boxés"], conseil:"C'est ce qui donne du volume au sac."},
      {t:"Répéter pour la doublure, en laissant 12 cm ouverts dans le fond", min:15, tech:["doublure"]},
      {t:"Épingler les anses sur l'endroit du sac, à 10 cm de chaque côté", min:8, tech:["anses"], conseil:"Anses vers le bas, à l'intérieur du sac."},
      {t:"Glisser le sac dans la doublure endroit contre endroit et coudre tout le tour de l'ouverture", min:12, tech:["doublure"]},
      {t:"Retourner par l'ouverture du fond, fermer, puis surpiquer le haut du sac", min:15, tech:["surpiqûre"], conseil:"La surpiqûre du haut tient tout en place."}
    ]
  },
  {
    id:"taie", nom:"Taie d'oreiller", emoji:"&#128719;", niveau:1, temps:"1 h", pieces:"1 pièce",
    quoi:["maison"], tissu:"Coton, percale, lin lavé", metrage:"0,8 m", budget:"8–15 €", mercerie:"Aucune",
    machine:true, extensible:false,
    pourquoi:"Que des lignes droites, un résultat immédiatement utile, et l'apprentissage du rabat qui sert dans plein de projets.",
    apprend:["couture droite","ourlet","couture anglaise"],
    pieges:["Mesure ton oreiller : 65 × 65 ou 50 × 70, ça change tout."],
    etapes:[
      {t:"Couper un rectangle de 70 × 180 cm (pour un oreiller 65 × 65)", min:12, tech:["coupe"]},
      {t:"Ourler les deux petits côtés : replier 1 cm, puis encore 1 cm, et piquer", min:15, tech:["ourlet"], conseil:"Repasse chaque pli avant de coudre."},
      {t:"Poser à plat envers vers toi et replier 20 cm d'un côté pour former le rabat", min:8, tech:["rabat"]},
      {t:"Rabattre l'autre extrémité par-dessus jusqu'à obtenir 65 cm de large", min:8, tech:["rabat"]},
      {t:"Coudre les deux longs côtés à 1,5 cm", min:12, tech:["couture droite"], conseil:"Surfile ou fais une couture anglaise pour que ça tienne au lavage."},
      {t:"Retourner, repasser, enfiler l'oreiller", min:5, tech:["repassage"]}
    ]
  },
  {
    id:"jupe-elastique", nom:"Jupe à taille élastique", emoji:"&#128087;", niveau:2, temps:"2 h 30", pieces:"2 pièces",
    quoi:["bas","porter"], tissu:"Coton, lin, viscose (fluide mais pas glissant)", metrage:"1,2 m",
    budget:"12–25 €", mercerie:"Élastique plat de 3 à 4 cm, de ton tour de taille moins 3 cm",
    machine:true, extensible:false,
    pourquoi:"Le premier vêtement : pas de fermeture, pas d'ajustement compliqué, et tu le porteras vraiment. L'app calcule le patron à tes mesures.",
    apprend:["couture droite","coulisse élastique","ourlet","fronces"],
    pieges:["Ne saute pas le décatissage : le coton rétrécit au premier lavage et la jupe devient trop courte.",
            "Coupe la coulisse 1 cm plus large que l'élastique, sinon il ne passe pas."],
    etapes:[
      {t:"Décatir le tissu : le laver et le repasser comme le vêtement fini", min:5, tech:["décatissage"], conseil:"À faire la veille. C'est l'étape que tout le monde saute et regrette."},
      {t:"Prendre tes mesures : tour de hanches et longueur taille-genou", min:10, tech:["mesures"], conseil:"Onglet Mes profils : elles serviront à tous les patrons."},
      {t:"Générer le patron dans l'app (Patrons → Créer mon patron) et l'imprimer", min:20, tech:["patron"], conseil:"Vérifie le carré de 5 cm avant de couper quoi que ce soit."},
      {t:"Couper 2 rectangles selon le patron, droit-fil dans la longueur", min:20, tech:["coupe"]},
      {t:"Surfiler les bords verticaux (zigzag ou surjeteuse)", min:12, tech:["surfilage"], conseil:"Sinon le tissu s'effiloche au lavage."},
      {t:"Coudre les deux côtés endroit contre endroit à 1,5 cm", min:15, tech:["couture droite"]},
      {t:"Former la coulisse : replier le haut de 1 cm, puis de 4,5 cm, et piquer au ras du bord", min:20, tech:["coulisse élastique"], conseil:"Laisse 4 cm ouverts pour passer l'élastique."},
      {t:"Passer l'élastique à l'épingle à nourrice, le coudre bout à bout, fermer la coulisse", min:15, tech:["élastique"], conseil:"Essaie la jupe avant de couper l'élastique définitivement."},
      {t:"Essayer, marquer la longueur, couper l'excédent", min:10, tech:["essayage"], conseil:"Fais-toi aider, ou marque devant un miroir avec des épingles."},
      {t:"Ourler le bas : replier 1 cm puis 2 cm, repasser, piquer", min:20, tech:["ourlet"]}
    ]
  },
  {
    id:"housse-coussin", nom:"Housse de coussin", emoji:"&#127895;", niveau:2, temps:"1 h 30", pieces:"1 pièce",
    quoi:["maison"], tissu:"Coton épais, velours, lin", metrage:"0,5 m", budget:"6–12 €",
    mercerie:"Fermeture éclair de 30 cm (facultatif)", machine:true, extensible:false,
    pourquoi:"Idéal pour apprendre la fermeture éclair sur un objet plat, sans risque de rater un vêtement.",
    apprend:["couture droite","fermeture éclair","angles"],
    pieges:["Pose la fermeture avant d'assembler les côtés : c'est beaucoup plus simple."],
    etapes:[
      {t:"Couper 2 carrés à la taille du coussin + 2 cm de chaque côté", min:10, tech:["coupe"]},
      {t:"Surfiler les quatre bords de chaque carré", min:12, tech:["surfilage"]},
      {t:"Poser la fermeture éclair sur un côté, avec le pied spécial", min:30, tech:["fermeture éclair"], conseil:"Bâtis-la à la main d'abord : ça évite les vagues."},
      {t:"Ouvrir la fermeture à moitié (sinon impossible de retourner)", min:2, tech:["fermeture éclair"], conseil:"Erreur classique, tout le monde la fait une fois."},
      {t:"Coudre les trois autres côtés endroit contre endroit", min:15, tech:["couture droite"]},
      {t:"Dégarnir les angles, retourner, repasser", min:10, tech:["angles","repassage"]}
    ]
  },
  {
    id:"top-aaron", nom:"Débardeur Aaron (sur mesure)", emoji:"&#128085;", niveau:2, temps:"3 h", pieces:"2 pièces",
    quoi:["haut","porter"], tissu:"Jersey de coton moyen (pas trop fin pour commencer)", metrage:"1 m",
    budget:"12–20 €", mercerie:"Aiguille jersey 80, fil polyester", machine:true, extensible:true,
    pourquoi:"Le premier vêtement en maille, généré à tes mesures. Peu de pièces, et le jersey pardonne les petites imprécisions.",
    apprend:["jersey","point extensible","bordure maille","ourlet jersey"],
    pieges:["Change d'aiguille : une aiguille universelle saute des points dans le jersey.",
            "Ne tire pas sur le tissu en cousant, laisse la machine l'entraîner."],
    etapes:[
      {t:"Décatir le jersey", min:5, tech:["décatissage"]},
      {t:"Compléter tes mesures dans Mes profils", min:15, tech:["mesures"]},
      {t:"Générer le patron Aaron à tes mesures et l'imprimer avec 1 cm de marges", min:25, tech:["patron"]},
      {t:"Assembler les pages, découper les pièces", min:25, tech:["patron"]},
      {t:"Couper le jersey, droit-fil dans le sens des côtes", min:25, tech:["coupe"], conseil:"Le jersey s'étire : ne le laisse pas pendre hors de la table."},
      {t:"Monter une aiguille jersey et régler le point extensible (ou zigzag étroit)", min:10, tech:["point extensible"]},
      {t:"Coudre les épaules", min:15, tech:["couture droite"]},
      {t:"Poser les bordures d'encolure et d'emmanchures", min:40, tech:["bordure maille"], conseil:"La bordure est plus courte que l'ouverture : étire-la doucement en cousant."},
      {t:"Coudre les côtés d'un seul tenant", min:20, tech:["couture droite"]},
      {t:"Ourler le bas au point extensible", min:15, tech:["ourlet jersey"], conseil:"Une aiguille double donne un fini professionnel si tu en as une."}
    ]
  },
  {
    id:"tshirt-teagan", nom:"T-shirt Teagan (sur mesure)", emoji:"&#128085;", niveau:3, temps:"4 h", pieces:"3 pièces",
    quoi:["haut","porter"], tissu:"Jersey de coton", metrage:"1,4 m", budget:"15–25 €",
    mercerie:"Aiguille jersey 80", machine:true, extensible:true,
    pourquoi:"Le vrai t-shirt à ta taille : la suite logique du débardeur, avec les manches en plus.",
    apprend:["jersey","manche montée à plat","bordure maille","ourlet jersey"],
    pieges:["Repère bien le devant et le dos des manches avant de coudre : les crans sont là pour ça."],
    etapes:[
      {t:"Décatir le jersey", min:5, tech:["décatissage"]},
      {t:"Générer le patron Teagan à tes mesures et l'imprimer", min:30, tech:["patron"]},
      {t:"Assembler et découper les pièces", min:30, tech:["patron"]},
      {t:"Couper le tissu en respectant le droit-fil et les crans", min:30, tech:["coupe"]},
      {t:"Coudre les épaules", min:15, tech:["couture droite"]},
      {t:"Poser la bordure d'encolure", min:30, tech:["bordure maille"]},
      {t:"Monter les manches à plat, avant de fermer les côtés", min:35, tech:["manche montée à plat"], conseil:"Bien plus simple que la manche montée en rond."},
      {t:"Coudre les côtés et le dessous de manche d'un seul tenant", min:25, tech:["couture droite"]},
      {t:"Ourler les manches et le bas", min:25, tech:["ourlet jersey"]}
    ]
  },
  {
    id:"pantalon-waralee", nom:"Pantalon portefeuille Waralee", emoji:"&#128086;", niveau:2, temps:"3 h", pieces:"2 pièces",
    quoi:["bas","porter"], tissu:"Coton léger, lin, viscose", metrage:"2 m", budget:"18–30 €", mercerie:"Aucune",
    machine:true, extensible:false,
    pourquoi:"Un vrai pantalon sans fermeture ni bouton : il se noue. Confortable, très portable, et beaucoup plus simple qu'il n'en a l'air.",
    apprend:["couture droite","entrejambe","ourlet","liens"],
    pieges:["L'entrejambe se coud en dernier, une fois les deux jambes montées."],
    etapes:[
      {t:"Décatir le tissu", min:5, tech:["décatissage"]},
      {t:"Générer le patron Waralee à tes mesures et l'imprimer", min:30, tech:["patron"]},
      {t:"Assembler les pages et découper", min:30, tech:["patron"]},
      {t:"Couper les pièces, droit-fil respecté", min:30, tech:["coupe"]},
      {t:"Surfiler tous les bords", min:20, tech:["surfilage"]},
      {t:"Coudre les côtés extérieurs de chaque jambe", min:20, tech:["couture droite"]},
      {t:"Coudre l'entrejambe", min:25, tech:["entrejambe"]},
      {t:"Former et coudre les liens de taille", min:25, tech:["liens"]},
      {t:"Ourler le bas des jambes", min:20, tech:["ourlet"]},
      {t:"Essayer et ajuster la longueur", min:15, tech:["essayage"]}
    ]
  },
  {
    id:"jupe-sandy", nom:"Jupe cercle Sandy", emoji:"&#128087;", niveau:3, temps:"4 h", pieces:"2 pièces",
    quoi:["bas","porter"], tissu:"Lainage léger, gabardine, crêpe épais", metrage:"2,5 m",
    budget:"25–45 €", mercerie:"Fermeture invisible 20 cm", machine:true, extensible:false,
    pourquoi:"La jupe qui tourne. Peu de coutures, mais elle demande de la patience à l'ourlet et introduit la fermeture invisible.",
    apprend:["jupe cercle","fermeture invisible","ourlet courbe","ceinture"],
    pieges:["Laisse la jupe suspendue 24 h avant l'ourlet : le biais s'allonge tout seul.",
            "Prévois large en métrage, une jupe cercle mange du tissu."],
    etapes:[
      {t:"Décatir le tissu", min:5, tech:["décatissage"]},
      {t:"Générer le patron Sandy à tes mesures", min:25, tech:["patron"]},
      {t:"Imprimer en A0 si possible : une jupe cercle fait beaucoup de pages A4", min:30, tech:["patron"], conseil:"L'app propose le format A0 pour la reprographie."},
      {t:"Couper les pièces", min:35, tech:["coupe"]},
      {t:"Coudre un côté, poser la fermeture invisible sur l'autre", min:45, tech:["fermeture invisible"], conseil:"Pied spécial fermeture invisible, et va lentement."},
      {t:"Monter la ceinture", min:30, tech:["ceinture"]},
      {t:"Suspendre la jupe une nuit", min:5, tech:["ourlet courbe"], conseil:"Le tissu coupé en biais se détend : sans cette pause, l'ourlet ondule."},
      {t:"Égaliser le bas puis faire un ourlet étroit", min:50, tech:["ourlet courbe"], conseil:"Ourlet de 1 cm maximum sur une courbe."}
    ]
  },
  {
    id:"peluche", nom:"Peluche pieuvre (Octoplushy)", emoji:"&#129425;", niveau:1, temps:"2 h", pieces:"plusieurs",
    quoi:["cadeau"], tissu:"Polaire, minky, molleton", metrage:"0,5 m", budget:"8–15 €",
    mercerie:"Rembourrage, fil à broder pour les yeux", machine:true, extensible:false,
    pourquoi:"Un projet court et gratifiant, parfait en cadeau, et la polaire ne s'effiloche pas — donc pas de surfilage.",
    apprend:["couture courbe","rembourrage","point invisible"],
    pieges:["Couds lentement dans les courbes, en levant le pied pour pivoter."],
    etapes:[
      {t:"Générer le patron Octoplushy et l'imprimer", min:20, tech:["patron"]},
      {t:"Couper les pièces dans la polaire", min:25, tech:["coupe"]},
      {t:"Assembler les tentacules deux par deux et les retourner", min:35, tech:["couture courbe","tube retourné"]},
      {t:"Rembourrer légèrement les tentacules", min:15, tech:["rembourrage"]},
      {t:"Monter le corps en prenant les tentacules dans la couture", min:25, tech:["couture courbe"]},
      {t:"Retourner, rembourrer, fermer au point invisible", min:20, tech:["rembourrage","point invisible"]},
      {t:"Broder les yeux et la bouche", min:15, tech:["broderie"]}
    ]
  },
  {
    id:"tablier", nom:"Tablier Albert", emoji:"&#129367;", niveau:1, temps:"1 h 30", pieces:"1 pièce",
    quoi:["maison","cadeau"], tissu:"Toile de coton, lin épais", metrage:"1 m", budget:"10–18 €",
    mercerie:"3 m de sangle ou biais pour les liens", machine:true, extensible:false,
    pourquoi:"Grand, droit, utile, et il fait un cadeau qui plaît toujours. Les courbes des emmanchures sont la seule difficulté.",
    apprend:["ourlet","biais","courbes"],
    pieges:["Pose le biais sur les courbes en le détendant, jamais en tirant."],
    etapes:[
      {t:"Générer le patron Albert et l'imprimer", min:20, tech:["patron"]},
      {t:"Couper la pièce principale", min:20, tech:["coupe"]},
      {t:"Ourler les côtés droits et le bas", min:25, tech:["ourlet"]},
      {t:"Poser le biais sur les courbes des emmanchures", min:25, tech:["biais","courbes"]},
      {t:"Coudre les liens de cou et de taille", min:20, tech:["liens"], conseil:"Renforce leur attache par un carré cousu en croix."},
      {t:"Repasser l'ensemble", min:5, tech:["repassage"]}
    ]
  }
];

/* ---------- questionnaire ---------- */
var GUIDE_Q=[
  {k:"machine", q:"Tu as une machine à coudre ?", o:[
    {v:"oui", l:"Oui", d:"une machine familiale suffit"},
    {v:"non", l:"Pas encore", d:"on reste sur du cousu main"}]},
  {k:"niveau", q:"Où en es-tu ?", o:[
    {v:"1", l:"Tout début", d:"je n'ai jamais cousu, ou presque"},
    {v:"2", l:"Quelques essais", d:"des coutures droites, un ourlet"},
    {v:"3", l:"À l'aise", d:"j'ai déjà fini un vêtement"}]},
  {k:"envie", q:"Tu as envie de coudre quoi en premier ?", o:[
    {v:"porter", l:"Un vêtement", d:"quelque chose à porter"},
    {v:"accessoire", l:"Un accessoire", d:"court et gratifiant"},
    {v:"maison", l:"Pour la maison", d:"coussin, taie, tablier"},
    {v:"cadeau", l:"Un cadeau", d:"pour offrir"}]},
  {k:"temps", q:"Combien de temps d'un coup ?", o:[
    {v:"court", l:"Une soirée", d:"1 à 2 heures"},
    {v:"moyen", l:"Un après-midi", d:"3 à 4 heures"},
    {v:"long", l:"Un week-end", d:"je peux y passer du temps"}]},
  {k:"extensible", q:"Le tissu extensible (jersey), ça te tente ?", o:[
    {v:"non", l:"On évite", d:"tissus stables pour commencer"},
    {v:"oui", l:"Pourquoi pas", d:"t-shirts et débardeurs possibles"}]}
];
var guideRep={};

function guideRender(){
  var host=$("demarrerQ"); if(!host)return;
  host.innerHTML=GUIDE_Q.map(function(q,i){
    return '<div class="card gq"><div class="gq-t"><span class="gq-n">'+(i+1)+'</span>'+esc(q.q)+'</div>'+
      '<div class="gq-o">'+q.o.map(function(o){
        var on=guideRep[q.k]===o.v?" on":"";
        return '<button class="gq-b'+on+'" onclick="guideSet(\''+q.k+'\',\''+o.v+'\')">'+
          '<b>'+esc(o.l)+'</b><small>'+esc(o.d)+'</small></button>';
      }).join("")+'</div></div>';
  }).join("");
  guideScore();
}
function guideSet(k,v){ guideRep[k]=v; guideRender(); }
window.guideSet=guideSet;

function guideScore(){
  var out=$("demarrerOut"); if(!out)return;
  var rep=guideRep, nb=Object.keys(rep).length;
  if(nb<GUIDE_Q.length){
    out.innerHTML='<div class="empty">Réponds aux '+GUIDE_Q.length+' questions — il en reste '+(GUIDE_Q.length-nb)+'.</div>';
    return;
  }
  var niv=parseInt(rep.niveau,10)||1;
  var notes=GUIDE_PROJETS.map(function(p){
    var s=0;
    if(p.niveau<=niv)s+=40; else if(p.niveau===niv+1)s+=12; else s-=30;
    if(p.quoi.indexOf(rep.envie)>=0)s+=35;
    if(rep.machine==="non"&&p.machine)s-=60;
    if(rep.extensible==="non"&&p.extensible)s-=45;
    var h=parseFloat((p.temps.match(/(\d+)\s*h/)||[0,0])[1])||0.7;
    if(rep.temps==="court"&&h<=1.6)s+=20; else if(rep.temps==="court"&&h>3)s-=25;
    if(rep.temps==="moyen"&&h>=1.4&&h<=3.2)s+=20;
    if(rep.temps==="long"&&h>=3)s+=20;
    s+=(3-p.niveau)*4;
    return {p:p,s:s};
  }).sort(function(a,b){return b.s-a.s;}).slice(0,3);

  out.innerHTML='<div class="gres-h">Trois projets pour toi</div>'+
    '<div class="gres">'+notes.map(function(n,i){return guideCard(n.p,i===0);}).join("")+'</div>';
}
function guideCard(p,best){
  var etoiles=""; for(var i=1;i<=3;i++)etoiles+=(i<=p.niveau?"&#9679;":"&#9675;");
  return '<div class="gcard'+(best?" best":"")+'">'+
    (best?'<div class="gbadge">Le meilleur pour commencer</div>':'')+
    '<div class="gc-h"><span class="gc-e">'+p.emoji+'</span><div><b>'+esc(p.nom)+'</b>'+
      '<div class="muted" style="font-size:12.5px;">'+etoiles+' &middot; '+esc(p.temps)+' &middot; '+esc(p.metrage)+' de tissu</div></div></div>'+
    '<p class="gc-p">'+esc(p.pourquoi)+'</p>'+
    '<div class="gc-l"><b>Tissu</b> '+esc(p.tissu)+'</div>'+
    '<div class="gc-l"><b>Budget</b> '+esc(p.budget)+'</div>'+
    (p.mercerie&&p.mercerie!=="Aucune"?'<div class="gc-l"><b>Mercerie</b> '+esc(p.mercerie)+'</div>':'')+
    '<div class="gc-l"><b>Tu apprends</b> '+p.apprend.map(esc).join(", ")+'</div>'+
    (p.pieges&&p.pieges.length?'<div class="gc-w"><b>À ne pas rater</b><br>'+p.pieges.map(esc).join('<br>')+'</div>':'')+
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">'+
      '<button class="btn sm" onclick="guideStart(\''+p.id+'\')">Démarrer ce projet</button>'+
      '<button class="btn ghost sm" onclick="guideDetail(\''+p.id+'\')">Voir les '+p.etapes.length+' étapes</button>'+
    '</div></div>';
}
function guideById(id){ return GUIDE_PROJETS.filter(function(p){return p.id===id;})[0]; }
window.guideById=guideById;

function guideDetail(id){
  var p=guideById(id); if(!p)return;
  var total=p.etapes.reduce(function(a,e){return a+(e.min||0);},0);
  var ov=document.getElementById("guideModal"); if(ov)ov.remove();
  ov=document.createElement("div"); ov.id="guideModal";
  ov.style.cssText="position:fixed;inset:0;background:rgba(46,42,40,.45);display:flex;align-items:center;justify-content:center;z-index:210;padding:16px;";
  ov.innerHTML='<div class="card" style="max-width:520px;width:100%;max-height:88vh;overflow:auto;">'+
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">'+
      '<h3 style="font-size:17px;">'+p.emoji+' '+esc(p.nom)+'</h3>'+
      '<button class="x" onclick="document.getElementById(\'guideModal\').remove()">&times;</button></div>'+
    '<div class="muted" style="font-size:13px;margin:4px 0 14px;">'+p.etapes.length+' étapes &middot; environ '+Math.round(total/60*10)/10+' h de travail</div>'+
    '<ol class="gsteps">'+p.etapes.map(function(e){
      return '<li><b>'+esc(e.t)+'</b><span class="muted"> · '+e.min+' min</span>'+
        (e.conseil?'<div class="muted" style="font-size:12.5px;margin-top:2px;">'+esc(e.conseil)+'</div>':'')+'</li>';
    }).join("")+'</ol>'+
    '<button class="btn" style="margin-top:14px;width:100%;" onclick="guideStart(\''+p.id+'\')">Démarrer ce projet</button></div>';
  document.body.appendChild(ov);
  ov.addEventListener("click",function(e){ if(e.target===ov)ov.remove(); });
}
window.guideDetail=guideDetail;

/* ---------- création du projet dans le carnet, avec ses étapes ---------- */
function guideStart(id){
  var p=guideById(id); if(!p)return;
  var m=document.getElementById("guideModal"); if(m)m.remove();
  var projet={
    id:uid(), name:p.nom, piece:p.quoi[0]||"", diff:p.niveau===1?"Facile":(p.niveau===2?"Intermédiaire":"Avancé"),
    stat:"cours", tissu:p.tissu, date:"", guide:p.id, tempsPasse:0,
    etapes:p.etapes.map(function(e){ return {t:e.t, min:e.min||0, tech:e.tech||[], conseil:e.conseil||"", fait:false, note:"", photo:""}; })
  };
  state.projets.unshift(projet);
  if(!save()){ state.projets.shift(); toast("Enregistrement impossible"); return; }
  if(typeof renderProjets==="function"){ renderProjets(); renderCarnetStats(); }
  toast("« "+p.nom+" » ajouté à ton carnet");
  if(typeof atelierOpen==="function")atelierOpen(projet.id);
  else goView("carnet");
}
window.guideStart=guideStart;

function guideReset(){ guideRep={}; guideRender(); }
window.guideReset=guideReset;

(function(){ if(document.getElementById("demarrerQ"))guideRender(); })();
