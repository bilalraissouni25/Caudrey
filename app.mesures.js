"use strict";
/* ===== Assistant mesures : où poser le mètre, dans quel ordre, avec vérifications =====
 * Les mesures sont enregistrées sous les noms FreeSewing (en cm) dans le profil actif,
 * avec un miroir vers les 6 anciens champs français pour ne rien casser.
 */

var MES_MIROIR={waist:"taille",chest:"poitrine",hips:"hanches",waistToKnee:"genou",hpsToWaistBack:"dos",wrist:"poignet"};

var MES_LISTE=[
  /* --- le tronc, la base de tout --- */
  {k:"chest", fr:"Tour de poitrine", g:"Le buste", min:60, max:160, marque:"poitrine",
   aide:"À l'endroit le plus fort de la poitrine, mètre bien horizontal, sans serrer. Respire normalement.",
   pourquoi:"C'est la mesure reine des hauts et des robes."},
  {k:"highBust", fr:"Poitrine haute", g:"Le buste", min:60, max:150, marque:"poitrinehaute", option:true,
   aide:"Juste au-dessus de la poitrine, sous les aisselles, mètre horizontal.",
   pourquoi:"L'écart avec le tour de poitrine dit s'il faut élargir le devant. Très utile si la poitrine est généreuse."},
  {k:"waist", fr:"Tour de taille", g:"Le buste", min:50, max:150, marque:"taille",
   aide:"À l'endroit le plus creux, en général juste au-dessus du nombril. Penche-toi de côté : le pli qui se forme, c'est là.",
   pourquoi:"Sert aux jupes, pantalons et à toutes les pièces cintrées."},
  {k:"hips", fr:"Tour de hanches", g:"Le buste", min:60, max:170, marque:"hanches",
   aide:"À l'endroit le plus fort des fesses, mètre horizontal, pieds joints.",
   pourquoi:"Détermine si la jupe ou le pantalon passe."},
  {k:"neck", fr:"Tour de cou", g:"Le buste", min:25, max:55, marque:"cou",
   aide:"À la base du cou, là où se poserait un col de chemise, en gardant un doigt d'aisance.",
   pourquoi:"FreeSewing s'en sert pour estimer les mesures que tu n'as pas données."},

  /* --- les longueurs du haut --- */
  {k:"hpsToWaistBack", fr:"Longueur de dos", g:"Les longueurs du haut", min:25, max:60, marque:"dos",
   aide:"De l'os saillant à la base de la nuque jusqu'à la ligne de taille, dans le dos.",
   pourquoi:"Place la taille du vêtement au bon endroit. Mal mesurée, tout le haut tombe mal."},
  {k:"hpsToBust", fr:"Épaule à la poitrine", g:"Les longueurs du haut", min:15, max:45, marque:"epaulepoitrine",
   aide:"Du haut de l'épaule (côté cou) jusqu'à la pointe de la poitrine.",
   pourquoi:"Positionne les pinces et l'ampleur à la bonne hauteur."},
  {k:"waistToArmpit", fr:"Taille à l'aisselle", g:"Les longueurs du haut", min:10, max:40, marque:"aisselle",
   aide:"De la ligne de taille jusqu'au creux de l'aisselle, sur le côté.",
   pourquoi:"Donne la profondeur d'emmanchure."},
  {k:"shoulderToShoulder", fr:"Largeur d'épaules", g:"Les longueurs du haut", min:25, max:60, marque:"epaules",
   aide:"D'un bout d'épaule à l'autre, en passant par le dos.",
   pourquoi:"Si c'est trop large, les coutures d'épaule tombent sur le bras."},
  {k:"shoulderSlope", fr:"Pente d'épaule", g:"Les longueurs du haut", min:5, max:30, unite:"°", defaut:13, marque:"pente", option:true,
   aide:"Difficile à mesurer seule : laisse 13° si tu ne sais pas. Baisse à 10° pour des épaules droites, monte à 17° pour des épaules tombantes.",
   pourquoi:"Évite les plis en diagonale sous l'encolure."},

  /* --- les bras --- */
  {k:"biceps", fr:"Tour de bras", g:"Les bras", min:18, max:60, marque:"bras",
   aide:"À l'endroit le plus fort du haut du bras, bras détendu le long du corps.",
   pourquoi:"C'est ce qui rend une manche confortable ou serrée."},
  {k:"shoulderToWrist", fr:"Épaule au poignet", g:"Les bras", min:35, max:80, marque:"brasLong",
   aide:"Du bout de l'épaule au poignet, bras légèrement plié.",
   pourquoi:"Longueur des manches longues."},
  {k:"wrist", fr:"Tour de poignet", g:"Les bras", min:12, max:30, marque:"poignet",
   aide:"Autour de l'os du poignet, sans serrer.",
   pourquoi:"Poignets et bas de manche."},

  /* --- le bas --- */
  {k:"waistToHips", fr:"Taille aux hanches", g:"Le bas", min:8, max:35, marque:"taillehanches",
   aide:"Verticalement, de la ligne de taille au point le plus fort des hanches.",
   pourquoi:"Place la ligne de hanches sur les jupes et pantalons."},
  {k:"waistToKnee", fr:"Taille au genou", g:"Le bas", min:40, max:90, marque:"genou",
   aide:"De la taille au milieu du genou, debout, sur le côté.",
   pourquoi:"Longueur des jupes au genou."},
  {k:"waistToFloor", fr:"Taille au sol", g:"Le bas", min:80, max:140, marque:"sol",
   aide:"De la taille jusqu'au sol, pieds nus, sur le côté.",
   pourquoi:"Longueur des jupes longues et des pantalons."},
  {k:"waistToUpperLeg", fr:"Taille à l'entrejambe", g:"Le bas", min:18, max:50, marque:"entrejambe",
   aide:"De la taille jusqu'au niveau de l'entrejambe, assise sur une chaise dure c'est plus simple.",
   pourquoi:"Hauteur de fourche des pantalons et shorts."},
  {k:"upperLeg", fr:"Tour de cuisse", g:"Le bas", min:30, max:90, marque:"cuisse",
   aide:"À l'endroit le plus fort de la cuisse.",
   pourquoi:"Confort des shorts et pantalons ajustés."},
  {k:"head", fr:"Tour de tête", g:"Le bas", min:45, max:70, marque:"tete", option:true,
   aide:"Au-dessus des oreilles, en passant par le front.",
   pourquoi:"Chapeaux, capuches et cagoules."},

  /* --- ce qui débloque les pantalons et les pièces ajustées --- */
  {k:"waistToSeat", fr:"Taille au bassin", g:"Pour aller plus loin", min:12, max:40, marque:"bassin", option:true,
   aide:"Verticalement, de la taille jusqu'à l'endroit le plus fort des fesses.",
   pourquoi:"La mesure qui débloque le plus de modèles : presque tous les pantalons."},
  {k:"seat", fr:"Tour de bassin", g:"Pour aller plus loin", min:60, max:170, marque:"bassin2", option:true,
   aide:"À l'endroit le plus fort des fesses. Souvent identique au tour de hanches — dans le doute, remets la même valeur.",
   pourquoi:"Pantalons et jupes ajustées."},
  {k:"seatBack", fr:"Bassin, moitié dos", g:"Pour aller plus loin", min:25, max:90, marque:"bassin2", option:true,
   aide:"La moitié arrière du tour de bassin : d'une couture de côté à l'autre, en passant par les fesses.",
   pourquoi:"Équilibre devant/dos des pantalons."},
  {k:"waistBack", fr:"Taille, moitié dos", g:"Pour aller plus loin", min:20, max:80, marque:"taille", option:true,
   aide:"La moitié arrière du tour de taille, d'un côté à l'autre en passant par le dos.",
   pourquoi:"Répartit correctement les pinces entre devant et dos."},
  {k:"crossSeam", fr:"Fourche complète", g:"Pour aller plus loin", min:50, max:110, marque:"fourche", option:true,
   aide:"De la taille devant, entre les jambes, jusqu'à la taille dans le dos.",
   pourquoi:"Le confort de tous les pantalons se joue là."},
  {k:"crossSeamFront", fr:"Fourche devant", g:"Pour aller plus loin", min:20, max:55, marque:"fourche", option:true,
   aide:"La partie avant de la fourche : de la taille devant jusqu'à l'entrejambe.",
   pourquoi:"Évite les plis disgracieux à l'avant."},
  {k:"inseam", fr:"Entrejambe au sol", g:"Pour aller plus loin", min:50, max:100, marque:"inseam", option:true,
   aide:"De l'entrejambe jusqu'au sol, à l'intérieur de la jambe, pieds nus.",
   pourquoi:"Longueur des pantalons."},
  {k:"knee", fr:"Tour de genou", g:"Pour aller plus loin", min:25, max:60, marque:"genoutour", option:true,
   aide:"Autour du genou, jambe tendue.",
   pourquoi:"Pantalons ajustés et leggings."},
  {k:"hpsToWaistFront", fr:"Longueur devant", g:"Pour aller plus loin", min:25, max:65, marque:"devant", option:true,
   aide:"Du haut de l'épaule (côté cou), en passant sur la poitrine, jusqu'à la taille devant.",
   pourquoi:"Avec la longueur de dos, c'est ce qui fait tomber un haut droit."},
  {k:"bustSpan", fr:"Écart de poitrine", g:"Pour aller plus loin", min:10, max:35, marque:"ecart", option:true,
   aide:"D'une pointe de poitrine à l'autre.",
   pourquoi:"Place les pinces au bon endroit."},
  {k:"underbust", fr:"Tour sous-poitrine", g:"Pour aller plus loin", min:55, max:140, marque:"sousp", option:true,
   aide:"Juste sous la poitrine, mètre horizontal.",
   pourquoi:"Corsages et pièces ajustées sous la poitrine."},
  {k:"shoulderToElbow", fr:"Épaule au coude", g:"Pour aller plus loin", min:25, max:50, marque:"coude", option:true,
   aide:"Du bout de l'épaule au coude, bras légèrement plié.",
   pourquoi:"Manches trois-quarts et manches à coutures."}
];

/* ---------- illustration : silhouette avec la mesure en évidence ---------- */
function mesSvg(marque){
  var s="#c9bfb5", a="#9c5d7c";
  function L(d,w){ return '<path d="'+d+'" fill="none" stroke="'+a+'" stroke-width="'+(w||3)+'" stroke-linecap="round"/>'; }
  function E(cx,cy,rx,ry){ return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="none" stroke="'+a+'" stroke-width="3" stroke-dasharray="4 3"/>'; }
  var corps=
    '<circle cx="60" cy="22" r="13" fill="none" stroke="'+s+'" stroke-width="2.5"/>'+
    '<path d="M52 36 L52 44 M68 36 L68 44" stroke="'+s+'" stroke-width="2.5" fill="none"/>'+
    '<path d="M52 44 Q60 41 68 44 L86 50 Q90 52 88 57 L82 72 Q79 96 76 112 Q75 124 79 134 L77 152 Q70 162 60 160 Q50 162 43 152 L41 134 Q45 124 44 112 Q41 96 38 72 L32 57 Q30 52 34 50 Z" fill="none" stroke="'+s+'" stroke-width="2.5"/>'+
    '<path d="M34 52 Q22 80 21 108 Q19 130 18 150 M86 52 Q98 80 99 108 Q101 130 102 150" fill="none" stroke="'+s+'" stroke-width="2.5"/>'+
    '<path d="M43 152 Q42 190 45 228 Q47 252 46 272 L57 272 Q57 240 59 214 Q60 196 60 180 Q60 196 61 214 Q63 240 63 272 L74 272 Q73 252 75 228 Q78 190 77 152" fill="none" stroke="'+s+'" stroke-width="2.5"/>';
  var M={
    cou:E(60,42,10,4),
    poitrine:E(60,62,26,6),
    poitrinehaute:E(60,54,24,5),
    taille:E(60,86,22,6),
    hanches:E(60,112,26,7),
    dos:L("M60 38 L60 86",3)+'<path d="M56 38 L64 38 M56 86 L64 86" stroke="'+a+'" stroke-width="3"/>',
    epaulepoitrine:L("M50 45 L60 62",3)+'<circle cx="60" cy="62" r="3" fill="'+a+'"/>',
    aisselle:L("M84 68 L84 86",3)+'<path d="M80 68 L88 68 M80 86 L88 86" stroke="'+a+'" stroke-width="3"/>',
    epaules:L("M36 50 L84 50",3)+'<path d="M36 46 L36 54 M84 46 L84 54" stroke="'+a+'" stroke-width="3"/>',
    pente:L("M60 44 L86 52",3)+'<path d="M60 44 L86 44" stroke="'+a+'" stroke-width="1.5" stroke-dasharray="3 3"/>',
    bras:E(94,78,8,4),
    brasLong:L("M86 50 Q98 80 100 132",3)+'<circle cx="86" cy="50" r="3" fill="'+a+'"/><circle cx="100" cy="132" r="3" fill="'+a+'"/>',
    poignet:E(101,136,7,3.5),
    taillehanches:L("M28 86 L28 112",3)+'<path d="M24 86 L32 86 M24 112 L32 112" stroke="'+a+'" stroke-width="3"/>',
    genou:L("M26 86 L26 214",3)+'<path d="M22 86 L30 86 M22 214 L30 214" stroke="'+a+'" stroke-width="3"/>',
    sol:L("M22 86 L22 272",3)+'<path d="M18 86 L26 86 M18 272 L26 272" stroke="'+a+'" stroke-width="3"/>',
    entrejambe:L("M30 86 L30 152",3)+'<path d="M26 86 L34 86 M26 152 L34 152" stroke="'+a+'" stroke-width="3"/>',
    cuisse:E(50,172,11,4),
    tete:E(60,20,14,5),
    bassin:L("M32 86 L32 116",3)+'<path d="M28 86 L36 86 M28 116 L36 116" stroke="'+a+'" stroke-width="3"/>',
    bassin2:E(60,116,27,7),
    fourche:L("M60 86 Q42 150 60 152 Q78 150 60 86",3),
    inseam:L("M52 152 L50 272",3)+'<path d="M48 152 L56 152 M46 272 L54 272" stroke="'+a+'" stroke-width="3"/>',
    genoutour:E(51,214,10,4),
    devant:L("M50 45 Q58 66 60 86",3)+'<circle cx="50" cy="45" r="3" fill="'+a+'"/><circle cx="60" cy="86" r="3" fill="'+a+'"/>',
    ecart:L("M50 62 L70 62",3)+'<circle cx="50" cy="62" r="3" fill="'+a+'"/><circle cx="70" cy="62" r="3" fill="'+a+'"/>',
    sousp:E(60,72,23,5),
    coude:L("M86 50 Q94 68 96 88",3)+'<circle cx="86" cy="50" r="3" fill="'+a+'"/><circle cx="96" cy="88" r="3" fill="'+a+'"/>'
  };
  return '<svg viewBox="0 0 120 285" width="100%" style="max-width:110px;">'+corps+(M[marque]||"")+'</svg>';
}

/* ---------- lecture / écriture ---------- */
function mesGet(){ return (typeof activeMes==="function")?activeMes():((state.profil&&state.profil.mesures)||{}); }
function mesSet(k,v){
  var m=mesGet();
  if(v===""||v==null||isNaN(v))delete m[k]; else m[k]=v;
  if(MES_MIROIR[k]){ if(v===""||v==null||isNaN(v))delete m[MES_MIROIR[k]]; else m[MES_MIROIR[k]]=v; }
  if(typeof syncMirror==="function")syncMirror();
  save();
}

/* --- morphologie de référence : sert uniquement à combler les mesures non saisies --- */
function mesBase(){
  var p=(typeof activeProfile==="function")?activeProfile():null;
  var b=(p&&p.base)||(state.profil&&state.profil.base)||{};
  return {who:(b.who==="m")?"m":"f", size:b.size||38};
}
function mesSetBase(k,v){
  var p=(typeof activeProfile==="function")?activeProfile():null;
  if(!p)return;
  p.base=p.base||{who:"f",size:38};
  p.base[k]=(k==="size")?parseInt(v,10):v;
  if(state.profil)state.profil.base=p.base;
  save(); mesRender();
  if(typeof renderPatronControls==="function")renderPatronControls();
}
window.mesSetBase=mesSetBase;

/* mesures réellement saisies (mm) — c'est elles qui comptent pour le décompte des modèles */
function mesMesurees(){
  var m=mesGet(), o={};
  MES_LISTE.forEach(function(x){
    var v=m[x.k];
    if(v==null||v===""||isNaN(v))return;
    o[x.k]=(x.unite==="°")?v:Math.round(v*10);
  });
  /* compat : anciens champs français si la mesure FreeSewing manque */
  var leg={taille:"waist",poitrine:"chest",hanches:"hips",genou:"waistToKnee",dos:"hpsToWaistBack",poignet:"wrist"};
  Object.keys(leg).forEach(function(fr){ if(o[leg[fr]]==null&&m[fr])o[leg[fr]]=Math.round(m[fr]*10); });
  if(o.hips!=null&&o.seat==null)o.seat=o.hips;
  return o;
}
window.mesMesurees=mesMesurees;

/* ce qui part au moteur : la morphologie de référence, recouverte par les vraies mesures */
function fsOverrides(){
  var base={};
  try{ if(window.FS&&typeof FS.base==="function"){ var b=mesBase(); base=FS.base(b.size,b.who); } }catch(e){}
  return Object.assign(base, mesMesurees());
}
window.fsOverrides=fsOverrides;
window.fsMeasure=fsOverrides;

/* ---------- contrôles de cohérence ---------- */
function mesAlertes(){
  var m=mesGet(), out=[];
  function v(k){ var x=m[k]; return (x==null||x===""||isNaN(x))?null:x; }
  MES_LISTE.forEach(function(x){
    var val=v(x.k); if(val==null)return;
    if(val<x.min||val>x.max)out.push({k:x.k,t:x.fr+" : "+val+" "+(x.unite||"cm")+" sort de l'ordinaire ("+x.min+" à "+x.max+"). Vérifie l'unité et le placement du mètre."});
  });
  if(v("chest")&&v("highBust")&&v("highBust")>v("chest"))
    out.push({k:"highBust",t:"La poitrine haute dépasse le tour de poitrine : les deux ont dû être inversées."});
  if(v("waistToFloor")&&v("waistToKnee")&&v("waistToKnee")>=v("waistToFloor"))
    out.push({k:"waistToKnee",t:"Taille au genou plus grande que taille au sol : l'une des deux est fausse."});
  if(v("waistToHips")&&v("waistToKnee")&&v("waistToHips")>=v("waistToKnee"))
    out.push({k:"waistToHips",t:"Taille aux hanches plus grande que taille au genou : à revoir."});
  if(v("wrist")&&v("biceps")&&v("wrist")>=v("biceps"))
    out.push({k:"wrist",t:"Poignet plus large que le bras : les deux ont dû être inversées."});
  if(v("waist")&&v("chest")&&v("waist")>v("chest")+25)
    out.push({k:"waist",t:"Écart inhabituel entre taille et poitrine — vérifie les deux."});
  return out;
}

/* ---------- taille du commerce (indicatif, FR) ---------- */
var TAILLES_FR=[[80,62,86,34],[84,66,90,36],[88,70,94,38],[92,74,98,40],[96,78,102,42],[100,82,106,44],[104,86,110,46],[110,92,116,48]];
function mesTailleFr(){
  var m=mesGet();
  if(!m.chest||!m.waist||!m.hips)return null;
  var best=null,bd=1e9;
  TAILLES_FR.forEach(function(t){
    var d=Math.abs(t[0]-m.chest)*1.2+Math.abs(t[1]-m.waist)+Math.abs(t[2]-m.hips);
    if(d<bd){bd=d;best=t;}
  });
  return best?{taille:best[3],ecart:Math.round(bd)}:null;
}

/* ---------- combien de modèles sont réellement générables ---------- */
function mesModelesOk(){
  if(!window.FS||typeof FS.info!=="function")return null;
  /* on compte sur les mesures réellement prises, pas sur la base de référence */
  var m=mesMesurees(), ok=0, tot=0, manquantes={};
  FS.designs.forEach(function(d){
    var i=null; try{ i=FS.info(d); }catch(e){}
    if(!i)return;
    tot++;
    var req=i.measurements||[], absentes=req.filter(function(r){ return m[r]==null||m[r]===""||isNaN(m[r]); });
    if(!absentes.length)ok++;
    else absentes.forEach(function(r){ manquantes[r]=(manquantes[r]||0)+1; });
  });
  var top=Object.keys(manquantes).sort(function(a,b){return manquantes[b]-manquantes[a];}).slice(0,3);
  return {ok:ok, total:tot, bloquantes:top.map(function(k){
    var x=MES_LISTE.filter(function(y){return y.k===k;})[0];
    var fr=x?x.fr:((typeof measFr==="function")?measFr(k):k);
    return {k:k, fr:fr, n:manquantes[k]};
  })};
}

/* ---------- rendu ---------- */
function mesRender(){
  var host=$("mesuresList"); if(!host)return;
  var m=mesGet(), alertes=mesAlertes(), parK={};
  alertes.forEach(function(a){ parK[a.k]=a.t; });

  var groupes=[];
  MES_LISTE.forEach(function(x){ if(groupes.indexOf(x.g)<0)groupes.push(x.g); });

  host.innerHTML=groupes.map(function(g){
    var items=MES_LISTE.filter(function(x){return x.g===g;});
    return '<div class="ms-g"><div class="ms-gt">'+esc(g)+'</div>'+items.map(function(x){
      var val=m[x.k];
      var rempli=(val!=null&&val!==""&&!isNaN(val));
      return '<div class="ms-c'+(rempli?" ok":"")+(parK[x.k]?" warn":"")+'">'+
        '<div class="ms-i">'+mesSvg(x.marque)+'</div>'+
        '<div class="ms-b">'+
          '<div class="ms-t">'+esc(x.fr)+(x.option?' <span class="ms-opt">facultatif</span>':'')+'</div>'+
          '<div class="ms-a">'+esc(x.aide)+'</div>'+
          '<div class="ms-p">'+esc(x.pourquoi)+'</div>'+
          '<div class="ms-in">'+
            '<input type="number" inputmode="decimal" step="0.5" id="ms_'+x.k+'" value="'+(rempli?val:"")+'" '+
              'placeholder="'+(x.defaut!=null?x.defaut:"—")+'" onchange="mesChange(\''+x.k+'\',this.value)">'+
            '<span class="ms-u">'+(x.unite||"cm")+'</span>'+
          '</div>'+
          (parK[x.k]?'<div class="ms-w">'+esc(parK[x.k])+'</div>':'')+
        '</div></div>';
    }).join("")+'</div>';
  }).join("");

  mesResume();
}
function mesChange(k,v){
  var x=MES_LISTE.filter(function(y){return y.k===k;})[0];
  var n=parseFloat(String(v).replace(",","."));
  mesSet(k,isNaN(n)?"":n);
  mesRender();
  if(typeof renderPatronControls==="function")renderPatronControls();
}
window.mesChange=mesChange;

function mesResume(){
  var host=$("mesuresResume"); if(!host)return;
  var m=mesGet();
  var oblig=MES_LISTE.filter(function(x){return !x.option;});
  var faits=oblig.filter(function(x){ return m[x.k]!=null&&m[x.k]!==""&&!isNaN(m[x.k]); }).length;
  var pct=Math.round(faits/oblig.length*100);
  var mod=mesModelesOk();
  var tf=mesTailleFr();
  var al=mesAlertes();

  var b=mesBase();
  var tailles=(b.who==="m")?[32,34,36,38,40,42,44,46,48,50]:[28,30,32,34,36,38,40,42,44,46];
  if(tailles.indexOf(b.size)<0)b.size=tailles[Math.floor(tailles.length/2)];

  host.innerHTML='<div class="card" style="margin-bottom:14px;">'+
    '<div style="font-size:14px;font-weight:600;margin-bottom:4px;">Morphologie de référence</div>'+
    '<p class="muted" style="font-size:12.5px;line-height:1.5;margin:0 0 10px;">Elle ne sert qu\'à combler les mesures que tu n\'as pas prises. Dès qu\'une mesure est saisie, c\'est la tienne qui gagne.</p>'+
    '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;">'+
      '<div class="seg" style="margin:0;">'+
        '<button class="'+(b.who==="f"?"on":"")+'" onclick="mesSetBase(\'who\',\'f\')">Femme</button>'+
        '<button class="'+(b.who==="m"?"on":"")+'" onclick="mesSetBase(\'who\',\'m\')">Homme</button>'+
      '</div>'+
      '<div><label class="fld">Taille de référence</label><select onchange="mesSetBase(\'size\',this.value)" style="width:auto;">'+
        tailles.map(function(t){return '<option value="'+t+'"'+(t===b.size?" selected":"")+'>'+t+'</option>';}).join("")+
      '</select></div>'+
    '</div></div>'+
  '<div class="card">'+
    '<div class="prg" style="margin:0 0 10px;"><div class="prg-b"><i style="width:'+pct+'%"></i></div>'+
      '<div class="prg-t">'+faits+' mesures sur '+oblig.length+'</div></div>'+
    (mod?'<div class="ms-kpi"><b>'+mod.ok+'</b> modèle'+(mod.ok>1?"s":"")+' sur '+mod.total+' générable'+(mod.ok>1?"s":"")+' avec ces mesures</div>':'')+
    (mod&&mod.bloquantes.length&&mod.ok<mod.total?'<div class="muted" style="font-size:13px;margin-top:8px;line-height:1.55;">Les plus utiles à ajouter : '+
      mod.bloquantes.map(function(b){return '<b>'+esc(b.fr)+'</b>';}).join(", ")+'.</div>':'')+
    (tf?'<div class="muted" style="font-size:13px;margin-top:10px;">Dans le commerce, elle est proche du <b>'+tf.taille+'</b> — utile pour acheter un patron papier.</div>':'')+
    (al.length?'<div class="ms-al">'+al.length+' point'+(al.length>1?"s":"")+' à vérifier, signalé'+(al.length>1?"s":"")+' plus bas.</div>':
      (faits===oblig.length?'<div class="ms-ok">Tout est cohérent. Les patrons seront à sa taille.</div>':''))+
  '</div>';
}
window.mesRender=mesRender;

/* reprise des 6 anciennes mesures françaises au premier passage */
(function(){
  var m=mesGet(), bouge=false;
  Object.keys(MES_MIROIR).forEach(function(fs){
    var fr=MES_MIROIR[fs];
    if((m[fs]==null||m[fs]==="")&&m[fr]!=null&&m[fr]!==""){ m[fs]=m[fr]; bouge=true; }
  });
  if(bouge&&typeof save==="function")save();
})();

/* l'ancien formulaire à 6 champs n'existe plus : saveProfil ne doit plus écraser les mesures */
window.saveProfil=function(){
  if(typeof syncMirror==="function")syncMirror();
  save();
  if(typeof renderPatronControls==="function")renderPatronControls();
  if(typeof toast==="function")toast("Mesures enregistrées");
};
var _fillProfil=window.fillProfil;
window.fillProfil=function(){
  if(typeof _fillProfil==="function")_fillProfil();
  mesRender();
};

(function(){ if(document.getElementById("mesuresList"))mesRender(); })();
