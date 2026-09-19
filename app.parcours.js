"use strict";
/* ===== Le parcours complet, dans le Studio =====
 * Ce que fait une couturière entre « j'aime ce vêtement » et « je le porte » :
 *   1. Inspiration   → une photo, une envie                     (app.inspistudio.js)
 *   2. Modèle        → le patron le plus proche, réglé          (app.flat.js)
 *   3. Tissu         → le voir sur le dessin avant d'acheter    (ici)
 *   4. Achats        → la liste pour la mercerie                 (ici)
 *   5. Patron        → imprimer, assembler, couper              (app.print.js, app.techpack.js)
 *   6. Coudre        → les étapes, dans le mode Atelier          (ici)
 *   +  Essayage      → « ça tire là » → la bonne option bouge    (ici)
 * La barre de parcours en haut du dessin technique dit où elle en est et quoi faire ensuite.
 */

/* ======================================================================
 * 1. Les tissus : sa petite réserve, et le tissu sur le dessin
 * ====================================================================== */
function pcTissus(){ if(!state.tissus)state.tissus=[]; return state.tissus; }
var PC_TYPES_TISSU=[
  ["jersey","Jersey / maille"],["molleton","Molleton / sweat"],["popeline","Popeline / coton"],
  ["lin","Lin"],["viscose","Viscose / fluide"],["denim","Denim / toile"],["laine","Lainage"],["autre","Autre"]
];

/* le motif SVG qui habille les pièces, à l'échelle réelle (1 unité = 1 mm) */
function pcFabricDefs(t,id){
  if(!t||t.mode==="couleur")return "";
  var w=Math.max(20,(t.echelleCm||15)*10);
  var h=w*(t.ratio||1);
  return '<pattern id="'+(id||"pcFab")+'" patternUnits="userSpaceOnUse" width="'+w.toFixed(1)+'" height="'+h.toFixed(1)+'">'+
    '<image href="'+esc(t.img)+'" x="0" y="0" width="'+w.toFixed(1)+'" height="'+h.toFixed(1)+'" preserveAspectRatio="xMidYMid slice"/></pattern>';
}
function pcFill(t,id){ return !t?null:(t.mode==="couleur"?t.couleur:"url(#"+(id||"pcFab")+")"); }
/* On habille un SVG de dessin technique : les pièces du vêtement (trait #111) prennent le tissu ;
   celles dont le rôle est dans la liste du contraste (manches, col, poignets…) prennent le second.
   Le trait blanc qui efface le bord de pli prend le tissu lui aussi, sinon il laisserait une bande blanche. */
function pcHabiller(svg,t,contraste){
  if(!t||!svg)return svg;
  var f=pcFill(t,"pcFab");
  var c2=contraste&&contraste.tissu&&contraste.roles&&contraste.roles.length?contraste:null;
  var f2=c2?pcFill(c2.tissu,"pcFab2"):null;
  var out=svg.replace(/<path( data-role="([^"]*)")? d="([^"]*)" fill="(?:none|#fff)" stroke="#111"/g,function(m,a,role,d){
    var ff=(c2&&c2.roles.indexOf(role)>=0)?f2:f;
    return '<path'+(a||"")+' d="'+d+'" fill="'+ff+'" stroke="#111"';
  });
  out=out.replace(/stroke="#fff" stroke-width="([\d.]+)" vector-effect/g,function(m,w){ return 'stroke="'+f+'" stroke-width="'+w+'" vector-effect'; });
  var defs=pcFabricDefs(t,"pcFab")+(c2?pcFabricDefs(c2.tissu,"pcFab2"):"");
  return defs?out.replace(/(<svg[^>]*>)/,'$1<defs>'+defs+'</defs>'):out;
}
/* flatSvg reste le seul point d'entrée : l'écran, la comparaison, le PDF suivent tous */
(function(){
  var base=window.flatSvg;
  if(typeof base!=="function")return;
  window.flatSvg=function(board,mode){
    var s=base.apply(this,arguments);
    return (typeof TK!=="undefined"&&TK.tissu)?pcHabiller(s,TK.tissu,TK.contraste):s;
  };
})();

function pcTissuPick(){
  var L=pcTissus();
  var insp=(state.inspirations||[]).filter(function(x){ return x.img; }).slice(0,12);
  var old=document.getElementById("pcModal"); if(old)old.remove();
  var ov=document.createElement("div"); ov.id="pcModal"; ov.className="tq-ov";
  var cur=TK.tissu||{};
  ov.innerHTML='<div class="card tq-box" style="max-width:720px;">'+
    '<div class="tq-hd"><div><div class="tq-cat">Étape 3 · Tissu</div><h3>Voir le vêtement dans ton tissu</h3></div>'+
      '<button class="x" onclick="document.getElementById(\'pcModal\').remove()">&times;</button></div>'+
    '<p class="tq-why">Photographie un tissu au magasin (bien à plat, sans ombre) : il s\'affiche sur le dessin, <b>à la bonne échelle</b>. Tu vois si le motif est trop gros avant d\'acheter.</p>'+

    '<div class="tq-sec">Un nouveau tissu</div>'+
    '<div class="pc-new">'+
      '<label class="btn">Photo du tissu<input type="file" accept="image/*" hidden onchange="pcTissuFichier(this)"></label>'+
      '<span class="muted" style="font-size:13px;">ou une couleur unie</span>'+
      '<input type="color" id="pcCouleur" value="'+esc(cur.mode==="couleur"?cur.couleur:"#c9a9b4")+'" onchange="pcTissuCouleur(this.value)" style="width:52px;height:38px;padding:3px;">'+
    '</div>'+

    (L.length?'<div class="tq-sec">Ma réserve</div><div class="pc-grid">'+L.map(function(t){
      return '<button class="pc-sw'+(cur.id===t.id?" on":"")+'" onclick="pcTissuChoisir(\''+t.id+'\')" title="'+esc(t.nom)+'">'+
        '<span style="'+(t.mode==="couleur"?'background:'+esc(t.couleur):'background-image:url(\''+esc(t.img)+'\')')+'"></span>'+
        '<em>'+esc(t.nom)+'</em><small>'+esc(pcTypeNom(t.type))+(t.metres?' · '+t.metres+' m':'')+'</small></button>';
    }).join("")+'</div>':'')+

    (insp.length?'<div class="tq-sec">Prendre l\'imprimé d\'une inspiration</div><div class="pc-grid">'+insp.map(function(x){
      return '<button class="pc-sw" onclick="pcTissuDepuisInspi(\''+x.id+'\')"><span style="background-image:url(\''+esc(x.img)+'\')"></span><em>'+esc((x.title||"").slice(0,24))+'</em></button>';
    }).join("")+'</div>':'')+

    '<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;">'+
      (L.length>=2?'<button class="btn ghost sm" onclick="pcComparerTissus()">Comparer des tissus</button>':'')+
      (TK.tissu?'<button class="btn ghost sm" onclick="pcContraste()">Ajouter un tissu de contraste</button>':'')+
      (TK.tissu?'<button class="btn ghost sm" onclick="pcTissuRetirer()">Revenir au dessin sans tissu</button>':'')+
    '</div>'+
  '</div>';
  document.body.appendChild(ov);
  ov.addEventListener("click",function(e){ if(e.target===ov)ov.remove(); });
}
function pcTypeNom(k){ var x=PC_TYPES_TISSU.filter(function(t){return t[0]===k;})[0]; return x?x[1]:"Tissu"; }
function pcFermer(){ var m=document.getElementById("pcModal"); if(m)m.remove(); }

/* la photo du tissu : on demande seulement ce qu'elle couvre en largeur, c'est ce qui fait l'échelle */
function pcTissuFichier(inp){
  var f=inp.files&&inp.files[0]; if(!f)return;
  var rd=new FileReader();
  rd.onload=function(){
    var img=new Image();
    img.onload=function(){
      var max=700, r=Math.min(1,max/Math.max(img.width,img.height));
      var cv=document.createElement("canvas"); cv.width=Math.round(img.width*r); cv.height=Math.round(img.height*r);
      cv.getContext("2d").drawImage(img,0,0,cv.width,cv.height);
      pcTissuFiche({mode:"image", img:cv.toDataURL("image/jpeg",0.8), ratio:cv.height/cv.width});
    };
    img.src=rd.result;
  };
  rd.readAsDataURL(f);
}
function pcTissuCouleur(c){ pcTissuFiche({mode:"couleur", couleur:c}); }
function pcTissuDepuisInspi(id){
  var x=(state.inspirations||[]).filter(function(i){ return String(i.id)===String(id); })[0]; if(!x)return;
  (typeof isBlobToData==="function"?isBlobToData(x.img,700):Promise.resolve(x.img)).then(function(d){
    var im=new Image(); im.onload=function(){ pcTissuFiche({mode:"image", img:d, ratio:im.height/im.width, nom:"Imprimé — "+(x.title||"").slice(0,20)}); }; im.src=d;
  });
}
/* dernière question avant d'ajouter à la réserve */
function pcTissuFiche(t){
  var box=document.querySelector("#pcModal .tq-box"); if(!box)return;
  window._pcNouveau=t;
  box.innerHTML='<div class="tq-hd"><div><div class="tq-cat">Étape 3 · Tissu</div><h3>Ce tissu</h3></div>'+
      '<button class="x" onclick="pcFermer()">&times;</button></div>'+
    '<div class="pc-fiche">'+
      '<span class="pc-apercu" style="'+(t.mode==="couleur"?'background:'+esc(t.couleur):'background-image:url(\''+esc(t.img)+'\')')+'"></span>'+
      '<div style="flex:1;min-width:220px;">'+
        '<label class="fld">Nom</label><input id="pcNom" type="text" value="'+esc(t.nom||"")+'" placeholder="Lin rose, Liberty fleuri…">'+
        '<label class="fld" style="margin-top:8px;">Matière</label><select id="pcType">'+PC_TYPES_TISSU.map(function(x){return '<option value="'+x[0]+'">'+x[1]+'</option>';}).join("")+'</select>'+
        (t.mode==="image"?'<label class="fld" style="margin-top:8px;">Largeur de tissu visible sur la photo : <b id="pcEchV">15</b> cm</label>'+
          '<input id="pcEch" type="range" min="3" max="60" value="15" oninput="document.getElementById(\'pcEchV\').textContent=this.value">'+
          '<div class="muted" style="font-size:12px;line-height:1.4;">Pose une carte bancaire sur le tissu avant la photo : elle fait 8,5 cm de large, ça aide à estimer.</div>':'')+
        '<div class="row" style="margin-top:8px;"><div><label class="fld">Laize (cm)</label><input id="pcLaize" type="number" value="140" step="5"></div>'+
          '<div><label class="fld">J\'en ai (m)</label><input id="pcMetres" type="number" step="0.1" placeholder="à acheter"></div></div>'+
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;"><button class="btn" onclick="pcTissuValider()">Voir sur le dessin</button></div>'+
      '</div></div>';
}
function pcTissuValider(){
  var t=window._pcNouveau; if(!t)return;
  t.id=String(uid());
  t.nom=(document.getElementById("pcNom").value||"").trim()||(t.mode==="couleur"?"Uni "+t.couleur:"Mon tissu");
  t.type=document.getElementById("pcType").value;
  var e=document.getElementById("pcEch"); if(e)t.echelleCm=parseFloat(e.value)||15;
  t.laize=parseFloat(document.getElementById("pcLaize").value)||140;
  var m=parseFloat(document.getElementById("pcMetres").value); if(!isNaN(m))t.metres=m;
  pcTissus().unshift(t); save();
  pcFermer(); pcTissuAppliquer(t);
}
function pcTissuChoisir(id){ var t=pcTissus().filter(function(x){ return String(x.id)===String(id); })[0]; pcFermer(); if(t)pcTissuAppliquer(t); }
function pcTissuAppliquer(t){
  TK.tissu=t; tkDraw(); pcBarre(); pcAvertirTissu();
  toast("« "+t.nom+" » sur le dessin");
}
function pcTissuRetirer(){ TK.tissu=null; pcFermer(); tkDraw(); pcBarre(); }

/* le tissu choisi convient-il au modèle ? (une maille pour un t-shirt, pas un lin) */
var PC_MAILLE=["bibi","teagan","aaron","sven","hugo","huey","sabrina","shelly","hannah","tristan","yuri","diana","bee","lumira","lunetius","hi","octoplushy"];
var PC_MAILLE_OK={"jersey":1,"molleton":1};
function pcModeleMaille(slug){ return PC_MAILLE.indexOf(slug)>=0; }
function pcAvertirTissu(){
  var t=TK.tissu; if(!t||!t.type||t.type==="autre")return;
  var maille=pcModeleMaille(TK.slug), estMaille=!!PC_MAILLE_OK[t.type];
  if(maille&&!estMaille)toast("Attention : ce modèle est prévu pour une maille (jersey) — en "+pcTypeNom(t.type).toLowerCase()+", il ne s'enfilera pas.");
  else if(!maille&&estMaille)toast("Ce modèle est prévu pour un tissu chaîne et trame : en maille, il sera plus ample et moins net.");
}

/* ======================================================================
 * 2. La liste de courses
 * ====================================================================== */
function pcMercerie(board){
  var noms=board.pieces.map(function(p){ return p.part.toLowerCase(); }).join(" ");
  var type=board.type, L=[];
  var maille=pcModeleMaille(board.design);
  L.push(["Fil","polyester assorti, 1 bobine de 200 m"+(maille?" (2 si aiguille double)":"")]);
  L.push(["Aiguille machine",maille?"jersey / stretch 75 ou 80":(TK.tissu&&TK.tissu.type==="denim"?"jeans 90 ou 100":"universelle 80")]);
  if(/rib|cuff|band|binding|neckband/.test(noms)&&maille)L.push(["Bord-côte","pour poignets, bas ou encolure (≈ 0,3 m)"]);
  if(/collar|col|placket|facing|yoke/.test(noms)&&!maille)L.push(["Entoilage thermocollant","pour col, parementures, pattes (≈ 0,5 m)"]);
  if(/button|placket/.test(noms))L.push(["Boutons","compte-les sur la patte de boutonnage (souvent 6 à 9)"]);
  if(/fly|zip/.test(noms))L.push(["Fermeture à glissière","la longueur de l'ouverture + 2 cm"]);
  if(/waistband|elastic/.test(noms)&&(type==="pantalon"||type==="jupe"))L.push(["Élastique ou fermeture","selon la version choisie : élastique 3 cm = tour de taille − 8 %"]);
  if(/hood/.test(noms))L.push(["Cordon (option)","pour la capuche, 1,5 m + 2 œillets"]);
  if(maille)L.push(["Thermocollant pour ourlet (conseillé)","bande de 1,5 cm : ourlets du jersey sans vagues"]);
  return L;
}
function pcTissuConseil(board){
  var d=board.design, t=board.type;
  if(pcModeleMaille(d))return /sven|hugo|huey/.test(d)?"Molleton ou sweat, 250 à 350 g/m²":"Jersey avec un peu d'élasthanne, 150 à 200 g/m²";
  if(t==="pantalon")return "Toile, sergé, denim léger ou lin épais";
  if(t==="jupe")return d==="sandy"?"Tissu fluide qui tombe bien : viscose, crêpe, lin lavé":"Coton, lin, sergé ou lainage léger";
  if(t==="robe")return "Coton, lin, viscose — plus fluide pour une robe évasée";
  if(t==="manteau")return "Lainage, drap de laine, toile épaisse (+ doublure)";
  if(t==="top")return "Popeline, lin, voile de coton, double gaze";
  return "Voir la fiche du modèle";
}
function pcCourses(){
  if(!TK.board){ toast("Dessine d'abord le vêtement"); return; }
  var b0=TK.board, lbl=tkLabel(TK.slug);
  /* avec un tissu de contraste, chaque tissu a son propre métrage */
  var C=TK.contraste&&TK.contraste.tissu&&TK.contraste.roles&&TK.contraste.roles.length?TK.contraste:null;
  var b=C?{design:b0.design,type:b0.type,pieces:b0.pieces.filter(function(x){ return C.roles.indexOf(x.role)<0; })}:b0;
  var bC=C?{design:b0.design,type:b0.type,pieces:b0.pieces.filter(function(x){ return C.roles.indexOf(x.role)>=0; })}:null;
  var laizes=[110,140,150].map(function(l){ var p=tpPlanCoupe(b,l); return [l, p.metres]; });
  var metC=(bC&&bC.pieces.length)?tpPlanCoupe(bC,C.tissu.laize||140).metres:null;
  var motif=TK.tissu&&TK.tissu.mode==="image";
  var merc=pcMercerie(b);
  var t=TK.tissu;
  var dispo=t&&t.metres?t.metres:null, besoin=null;
  if(t){ besoin=tpPlanCoupe(b,t.laize||140).metres; if(motif)besoin=Math.ceil(besoin*1.12*10)/10; }
  var old=document.getElementById("pcModal"); if(old)old.remove();
  var ov=document.createElement("div"); ov.id="pcModal"; ov.className="tq-ov";
  ov.innerHTML='<div class="card tq-box" style="max-width:520px;">'+
    '<div class="tq-hd"><div><div class="tq-cat">Étape 4 · Achats</div><h3>Ma liste pour la mercerie</h3></div>'+
      '<button class="x" onclick="pcFermer()">&times;</button></div>'+
    '<p class="tq-why"><b>'+esc(lbl)+'</b>, à tes mesures'+(Object.keys(TK.vals||{}).length?', avec tes réglages':'')+'.</p>'+
    '<div class="tq-sec">Tissu</div>'+
    '<div class="pc-line"><span>Conseillé</span><b>'+esc(pcTissuConseil(b))+'</b></div>'+
    laizes.map(function(l){ return '<div class="pc-line"><span>en '+l[0]+' cm de large</span><b>'+(motif?(Math.ceil(l[1]*1.12*10)/10):l[1]).toFixed(1)+' m</b></div>'; }).join("")+
    (motif?'<div class="muted" style="font-size:12px;margin:4px 0 0;">+12 % pour raccorder le motif.</div>':'')+
    (t&&dispo!=null?'<div class="pc-bilan '+(dispo>=besoin?"ok":"ko")+'">'+esc(t.nom)+' : tu en as '+dispo+' m, il en faut '+besoin.toFixed(1)+' m — '+(dispo>=besoin?"c'est bon":"il manque "+(besoin-dispo).toFixed(1)+" m")+'.</div>':'')+
    (metC!=null?'<div class="tq-sec">Tissu de contraste — '+esc(C.tissu.nom)+'</div><div class="pc-line"><span>'+esc(C.roles.map(pcRoleNom).join(", "))+' · en '+(C.tissu.laize||140)+' cm</span><b>'+metC.toFixed(1)+' m</b></div>':'')+
    '<div class="tq-sec">Mercerie</div>'+
    merc.map(function(m){ return '<div class="pc-line"><span>'+esc(m[0])+'</span><b>'+esc(m[1])+'</b></div>'; }).join("")+
    '<div class="muted" style="font-size:12px;line-height:1.5;margin-top:10px;">Métrage calculé en plaçant réellement les pièces sur le tissu plié (sans marges : ajoute 10 cm si tu les ajoutes à la craie). Achète toujours 10 à 20 cm de plus : le tissu rétrécit au premier lavage.</div>'+
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;">'+
      '<button class="btn" onclick="pcCoursesPartager()">Envoyer sur mon téléphone</button>'+
      '<a class="btn ghost" href="https://freesewing.eu/docs/designs/'+esc(TK.slug)+'/" target="_blank" rel="noopener">Fiche du modèle (anglais)</a>'+
    '</div></div>';
  document.body.appendChild(ov);
  ov.addEventListener("click",function(e){ if(e.target===ov)ov.remove(); });
  window._pcListe="Mon Atelier — "+lbl+"\n\nTISSU : "+pcTissuConseil(b)+"\n"+
    laizes.map(function(l){ return "- en "+l[0]+" cm : "+(motif?(Math.ceil(l[1]*1.12*10)/10):l[1]).toFixed(1)+" m"; }).join("\n")+
    (metC!=null?"\nCONTRASTE ("+C.tissu.nom+", "+C.roles.map(pcRoleNom).join(", ")+") : "+metC.toFixed(1)+" m":"")+
    "\n(+10 à 20 cm pour le rétrécissement)\n\nMERCERIE :\n"+merc.map(function(m){ return "- "+m[0]+" : "+m[1]; }).join("\n");
  TK.courses=true; pcBarre();
}
function pcCoursesPartager(){
  var txt=window._pcListe||"";
  if(navigator.share){ navigator.share({title:"Ma liste mercerie",text:txt}).catch(function(){}); return; }
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(function(){ toast("Liste copiée — colle-la dans Notes"); });
  else prompt("Copie ta liste :",txt);
}

/* ======================================================================
 * 3. Coudre ce modèle : un projet avec ses étapes, dans le mode Atelier
 * ====================================================================== */
function pcEtapes(board){
  var noms=board.pieces.map(function(p){ return p.part.toLowerCase(); }).join(" ");
  var maille=pcModeleMaille(board.design), type=board.type;
  var E=[];
  function e(t,min,tech,conseil){ E.push({t:t,min:min,tech:tech||[],conseil:conseil||""}); }
  e("Imprimer le patron, vérifier le carré de 5 cm, assembler les pages",30,["patron"],"Le PDF du patron est dans Patrons → Créer le patron → Imprimer.");
  e("Laver et repasser le tissu",15,["décatissage","repassage"],"");
  e("Couper les pièces en suivant le plan de coupe",40,["coupe"],"Le plan est en page 3 de la fiche atelier.");
  if(/collar|facing|placket|yoke/.test(noms)&&!maille)e("Entoiler col, parementures et pattes",15,["repassage"],"Thermocollant côté envers, fer sans vapeur puis avec.");
  if(/pocket/.test(noms))e("Préparer et poser les poches",30,["surpiqûre","angles"],"Toujours avant d'assembler les côtés : tout est encore à plat.");
  if(/dart/.test(noms)||type==="robe"||type==="jupe")e("Coudre les pinces s'il y en a",15,["couture droite","repassage"],"De la base vers la pointe, sans arrêt à la pointe : noue les fils.");
  if(type==="top"||type==="robe"||type==="manteau"){
    e("Assembler les épaules",10,[maille?"point extensible":"couture droite","surfilage"],"");
    if(/collar/.test(noms))e("Monter le col",45,["couture courbe","angles"],"");
    else if(maille)e("Poser la bande d'encolure",25,["bordure maille"],"");
    else e("Finir l'encolure (parementure ou biais)",30,["couture courbe","biais"],"");
    if(/hood/.test(noms))e("Assembler et monter la capuche",40,["couture courbe"],"");
    if(/sleeve/.test(noms))e("Monter les manches à plat",30,["manche montée à plat"],"");
    e("Fermer les côtés et le dessous de manche d'une seule couture",20,[maille?"point extensible":"couture droite","surfilage"],"");
    e("Essayer, ajuster si besoin",15,["essayage"],"Dans le Studio : « Retouches après essayage » te dit quel réglage changer.");
    if(/cuff/.test(noms))e("Poser les poignets",25,[maille?"bordure maille":"angles"],"");
    if(/button|placket/.test(noms))e("Boutonnières et boutons",40,[],"Fais une boutonnière d'essai sur une chute, avec l'entoilage.");
    e("Ourlets du bas"+(/sleeve/.test(noms)&&!/cuff/.test(noms)?" et des manches":""),25,[maille?"ourlet jersey":"ourlet"],"");
  } else if(type==="jupe"){
    e("Assembler les côtés",15,["couture droite","surfilage"],"");
    if(/zip/.test(noms))e("Poser la fermeture",40,["fermeture invisible"],"");
    e("Poser la ceinture",35,["ceinture","élastique"],"");
    e("Essayer, ajuster si besoin",15,["essayage"],"");
    e("Ourlet",30,[board.design==="sandy"?"ourlet courbe":"ourlet"],board.design==="sandy"?"Laisse pendre la jupe 24 h avant l'ourlet.":"");
  } else if(type==="pantalon"){
    if(/fly|zip/.test(noms))e("Monter la braguette",60,["fermeture éclair"],"");
    e("Coudre les côtés, puis les entrejambes",25,["couture droite","surfilage"],"");
    e("Coudre la fourche d'un seul trait",20,["entrejambe"],"");
    e("Poser la ceinture",35,["ceinture","élastique"],"");
    e("Essayer, ajuster si besoin",15,["essayage"],"");
    e("Ourlets des jambes",25,["ourlet"],"");
  } else {
    e("Assembler les pièces",40,["couture droite"],"");
    e("Finitions",30,["surpiqûre"],"");
  }
  e("Dernier coup de fer, photo du résultat",10,["repassage"],"Ajoute la photo à cette étape : elle ira dans ton carnet.");
  return E;
}
function pcCoudre(){
  if(!TK.board){ toast("Dessine d'abord le vêtement"); return; }
  var lbl=tkLabel(TK.slug);
  var fs=(typeof FSALL!=="undefined")?FSALL.filter(function(d){return d.slug===TK.slug;})[0]:null;
  var E=pcEtapes(TK.board);
  var p={
    id:uid(), name:lbl+(TK.tissu?" en "+TK.tissu.nom:""), piece:(fs&&fs.type)||"", diff:(fs&&fs.level)||"Intermédiaire",
    stat:"cours", tissu:TK.tissu?TK.tissu.nom:pcTissuConseil(TK.board), date:"", tempsPasse:0,
    modele:{slug:TK.slug, vals:JSON.parse(JSON.stringify(TK.vals||{})), ref:TK.ref||null, tissu:TK.tissu?TK.tissu.id:null,
            contraste:TK.contraste?{tissu:TK.contraste.tissu.nom, roles:TK.contraste.roles}:null},
    etapes:E.map(function(e){ return {t:e.t,min:e.min,tech:e.tech,conseil:e.conseil,fait:false,note:"",photo:""}; })
  };
  /* le premier conseil renvoie aux instructions officielles du modèle */
  p.etapes[0].conseil+=" Instructions détaillées du modèle (anglais) : freesewing.eu/docs/designs/"+TK.slug+"/instructions/";
  var insp=TK.ref&&typeof isInspi==="function"?isInspi(TK.ref):null;
  if(insp&&insp.img)p.img=insp.img;
  state.projets.unshift(p);
  if(!save()){ state.projets.shift(); toast("Enregistrement impossible"); return; }
  window._tkOpts={slug:TK.slug, opts:tkEngineOpts()};
  if(typeof renderProjets==="function"){ renderProjets(); if(typeof renderCarnetStats==="function")renderCarnetStats(); }
  TK.projet=p.id; pcBarre();
  toast("Projet créé : "+E.length+" étapes");
  if(typeof atelierOpen==="function")atelierOpen(p.id);
}

/* ======================================================================
 * 4. Retouches après essayage : un symptôme → les options qui le corrigent
 * ====================================================================== */
var PC_RETOUCHES=[
  {id:"poitrine-serre", t:"Serré à la poitrine", zone:"Haut du corps", opts:[/^(chest|bust|fullBust|extraBust)Ease$/], pas:+6},
  {id:"trop-ample", t:"Trop large, ça flotte", zone:"Partout", opts:[/^(chest|bust|waist|hips|seat)Ease$/], pas:-6},
  {id:"taille-serre", t:"Serré à la taille", zone:"Taille", opts:[/^waistEase$/,/^extraWaistEase$/], pas:+6},
  {id:"hanches-serre", t:"Tire aux hanches ou aux fesses", zone:"Bas du corps", opts:[/^(hips|seat|extraSeat)Ease$/], pas:+6},
  {id:"bras-serre", t:"Manches serrées au bras", zone:"Manches", opts:[/^bicepsEase$/], pas:+8},
  {id:"trop-court", t:"Trop court", zone:"Longueur", opts:[/^(lengthBonus|length|bodyLength|torsoLength|lengthBelowWaist|legLength)$/], pas:+6},
  {id:"trop-long", t:"Trop long", zone:"Longueur", opts:[/^(lengthBonus|length|bodyLength|torsoLength|lengthBelowWaist|legLength)$/], pas:-6},
  {id:"manches-courtes", t:"Manches trop courtes", zone:"Manches", opts:[/^(sleeveLengthBonus|sleeveLength)$/], pas:+6},
  {id:"manches-longues", t:"Manches trop longues", zone:"Manches", opts:[/^(sleeveLengthBonus|sleeveLength)$/], pas:-6},
  {id:"emmanchure-serre", t:"L'emmanchure serre sous le bras", zone:"Manches", opts:[/^(armholeDepth|armholeDepthFactor|armholeDrop)$/], pas:+6},
  {id:"encolure-baille", t:"L'encolure bâille ou est trop large", zone:"Encolure", opts:[/^(necklineWidth|collarEase|neckWidth)$/], pas:-5},
  {id:"encolure-serre", t:"L'encolure serre", zone:"Encolure", opts:[/^(necklineWidth|collarEase|neckWidth)$/], pas:+5},
  {id:"epaules-tombent", t:"Les coutures d'épaule tombent sur le bras", zone:"Épaules", opts:[/^(shoulderEase|shoulderToShoulderEase|acrossBackFactor)$/], pas:-5},
  {id:"epaules-serrent", t:"Ça tire entre les omoplates", zone:"Épaules", opts:[/^(shoulderEase|shoulderToShoulderEase|acrossBackFactor)$/], pas:+5}
];
function pcRetouches(){
  if(!TK.board){ toast("Dessine d'abord le vêtement"); return; }
  var defs=flatOptions(TK.slug);
  function applicable(r){ return defs.some(function(o){ return r.opts.some(function(re){ return re.test(o.k); })&&(o.type==="pct"||o.type==="deg"); }); }
  var L=PC_RETOUCHES.filter(applicable);
  var old=document.getElementById("pcModal"); if(old)old.remove();
  var ov=document.createElement("div"); ov.id="pcModal"; ov.className="tq-ov";
  ov.innerHTML='<div class="card tq-box" style="max-width:560px;">'+
    '<div class="tq-hd"><div><div class="tq-cat">Essayage</div><h3>Qu\'est-ce qui ne va pas ?</h3></div>'+
      '<button class="x" onclick="pcFermer()">&times;</button></div>'+
    '<p class="tq-why">Choisis ce que tu ressens en portant la toile ou le vêtement. L\'app bouge le bon réglage du patron et garde la trace de l\'essayage dans une nouvelle version.</p>'+
    (L.length?'<div class="pc-ret">'+L.map(function(r){
      return '<button onclick="pcRetoucher(\''+r.id+'\')"><b>'+esc(r.t)+'</b><span>'+esc(r.zone)+'</span></button>';
    }).join("")+'</div>':'<p class="muted">Ce modèle n\'a pas de réglage d\'aisance ou de longueur : les retouches se font directement sur le patron papier.</p>')+
    '<div class="muted" style="font-size:12px;line-height:1.5;margin-top:10px;">Une retouche à la fois, puis réessaie : deux corrections en même temps se masquent l\'une l\'autre. Si le problème est dans tes mesures (et pas dans l\'aisance), corrige plutôt Mes profils.</div>'+
  '</div>';
  document.body.appendChild(ov);
  ov.addEventListener("click",function(e){ if(e.target===ov)ov.remove(); });
}
function pcRetoucher(id){
  var r=PC_RETOUCHES.filter(function(x){return x.id===id;})[0]; if(!r)return;
  var defs=flatOptions(TK.slug), faits=[];
  defs.forEach(function(o){
    if(!r.opts.some(function(re){ return re.test(o.k); })||(o.type!=="pct"&&o.type!=="deg"))return;
    var avant=(TK.vals[o.k]!=null)?TK.vals[o.k]:o.def;
    var apres=Math.max(o.min,Math.min(o.max,avant+r.pas));
    if(apres===avant)return;
    TK.vals[o.k]=Math.round(apres*2)/2;
    faits.push(flatOptFr(o.k)+" : "+Math.round(avant)+" → "+Math.round(apres)+(o.type==="deg"?"°":" %"));
  });
  pcFermer();
  if(!faits.length){ toast("Ce réglage est déjà au maximum : il faudra retoucher le patron à la main"); return; }
  tkOptsRender(); tkDraw();
  /* on garde la trace : une version par essayage */
  if(!state.variantes)state.variantes=[];
  state.variantes.unshift({id:uid(), slug:TK.slug, nom:"Après essayage — "+r.t.toLowerCase(), vals:JSON.parse(JSON.stringify(TK.vals)),
    date:new Date().toISOString().slice(0,10), ref:TK.ref||null, retouche:faits});
  save(); if(typeof tkVersRender==="function")tkVersRender();
  window._tkOpts={slug:TK.slug, opts:tkEngineOpts()};
  toast(faits.join(" · "));
}

/* ======================================================================
 * 5. La barre de parcours
 * ====================================================================== */
function pcEtat(){
  var projetExiste=(state.projets||[]).some(function(p){ return p.modele&&p.modele.slug===TK.slug; });
  return [
    {k:"inspi", t:"Inspiration", ok:!!TK.ref, act:"isRefPick()"},
    {k:"modele", t:"Modèle", ok:!!TK.board, act:"pcGalerie()"},
    {k:"tissu", t:"Tissu", ok:!!TK.tissu, act:"pcTissuPick()"},
    {k:"achats", t:"Achats", ok:!!TK.courses, act:"pcCourses()"},
    {k:"patron", t:"Patron", ok:!!(window._tkOpts&&window._tkOpts.slug===TK.slug), act:"tkToPatron()"},
    {k:"coudre", t:"Coudre", ok:projetExiste||!!TK.projet, act:"pcCoudre()"}
  ];
}
function pcBarre(){
  var box=document.getElementById("pcBar"); if(!box||typeof TK==="undefined")return;
  var E=pcEtat(), prochaine=E.filter(function(e){ return !e.ok; })[0];
  box.innerHTML=E.map(function(e,i){
    return '<button class="pc-st'+(e.ok?" ok":"")+(prochaine&&prochaine.k===e.k?" now":"")+'" onclick="'+e.act+'">'+
      '<i>'+(e.ok?"&#10003;":(i+1))+'</i>'+e.t+'</button>';
  }).join('<span class="pc-sep"></span>');
}
(function(){
  var base=window.tkDraw;
  if(typeof base==="function")window.tkDraw=function(){ var r=base.apply(this,arguments); setTimeout(pcBarre,60); return r; };
})();

/* une version enregistrée garde son tissu */
(function(){
  var sv=window.tkSaveVersion;
  if(typeof sv==="function")window.tkSaveVersion=function(){
    var n=(state.variantes||[]).length; sv.apply(this,arguments);
    if((state.variantes||[]).length>n&&TK.tissu){ state.variantes[0].tissu=TK.tissu.id; save(); }
  };
  var ld=window.tkLoadVersion;
  if(typeof ld==="function")window.tkLoadVersion=function(id){
    ld.apply(this,arguments);
    var v=(state.variantes||[]).filter(function(x){ return String(x.id)===String(id); })[0];
    if(v&&v.tissu){ var t=pcTissus().filter(function(x){ return String(x.id)===String(v.tissu); })[0]; if(t){ TK.tissu=t; tkDraw(); } }
  };
})();

document.addEventListener("DOMContentLoaded",function(){ setTimeout(pcBarre,500); });
window.pcTissuPick=pcTissuPick; window.pcTissuFichier=pcTissuFichier; window.pcTissuCouleur=pcTissuCouleur;
window.pcTissuDepuisInspi=pcTissuDepuisInspi; window.pcTissuValider=pcTissuValider; window.pcTissuChoisir=pcTissuChoisir;
window.pcTissuRetirer=pcTissuRetirer; window.pcFermer=pcFermer; window.pcCourses=pcCourses; window.pcCoursesPartager=pcCoursesPartager;
window.pcCoudre=pcCoudre; window.pcRetouches=pcRetouches; window.pcRetoucher=pcRetoucher; window.pcBarre=pcBarre;
window.pcHabiller=pcHabiller; window.pcEtapes=pcEtapes;

/* ======================================================================
 * 6. Imaginer : la galerie des modèles, dessinés à ses mesures
 *    (pour celle qui part d'une idée, pas d'une photo)
 * ====================================================================== */
var _pcMini={};
function pcMini(slug){
  var cle=slug+"|"+((TK&&TK.tissu&&TK.tissu.id)||"");   /* la galerie s'habille du tissu choisi */
  if(_pcMini[cle])return _pcMini[cle];
  var meas=(typeof fsOverrides==="function")?fsOverrides():{};
  var b=null; try{ b=flatBuild(slug,meas,{}); }catch(e){}
  var s=b?flatSvg(b,flatAssemblable(b)?"assemble":"pieces"):"";
  /* une vignette : pas de titres, traits un peu plus fins */
  s=s.replace(/<text[\s\S]*?<\/text>/g,"");
  _pcMini[cle]=s||'<div class="muted" style="font-size:11px;padding:20px;">non dessinable</div>';
  return _pcMini[cle];
}
var PC_GAL_TYPES=[["top","Hauts"],["robe","Robes"],["jupe","Jupes"],["pantalon","Bas"],["manteau","Vestes"],["accessoire","Accessoires"]];
function pcGalerie(type){
  type=type||(function(){ var f=(typeof FSALL!=="undefined")?FSALL.filter(function(d){return d.slug===TK.slug;})[0]:null; return f?f.type:"top"; })();
  if(type==="enfant")type="top";
  var dispo={}; (window.FS&&FS.designs||[]).forEach(function(d){ dispo[d]=1; });
  var blocs=!!window._pcBlocs;
  var L=(typeof FSALL!=="undefined"?FSALL:[]).filter(function(d){ return d.type===type&&dispo[d.slug]&&(blocs||!/bloc/i.test(d.name)); })
    .sort(function(a,b){ return (a.d||0)-(b.d||0); });
  var old=document.getElementById("pcModal"); if(old)old.remove();
  var ov=document.createElement("div"); ov.id="pcModal"; ov.className="tq-ov";
  ov.innerHTML='<div class="card tq-box" style="max-width:900px;">'+
    '<div class="tq-hd"><div><div class="tq-cat">Étape 2 · Modèle</div><h3>Qu\'est-ce que tu veux coudre ?</h3></div>'+
      '<button class="x" onclick="pcFermer()">&times;</button></div>'+
    '<div class="seg" style="margin:10px 0 12px;">'+PC_GAL_TYPES.map(function(t){
      return '<button class="'+(t[0]===type?"on":"")+'" onclick="pcGalerie(\''+t[0]+'\')">'+t[1]+'</button>'; }).join("")+'</div>'+
    '<div class="muted" style="font-size:12.5px;margin-bottom:10px;">Chaque modèle est dessiné à tes mesures, du plus simple au plus technique. '+
      '<span class="pc-tag m">maille</span> se coud dans un jersey, <span class="pc-tag">chaîne et trame</span> dans un tissu qui ne s\'étire pas. '+
      '<label style="white-space:nowrap;"><input type="checkbox" '+(blocs?"checked":"")+' onchange="window._pcBlocs=this.checked;pcGalerie(\''+type+'\')"> blocs de base (pour transformer soi-même)</label></div>'+
    '<div class="pc-gal" id="pcGal">'+L.map(function(d){
      return '<button class="pc-gm'+(d.slug===TK.slug?" on":"")+'" onclick="pcGalChoisir(\''+d.slug+'\')">'+
        '<span class="pc-gi" data-slug="'+d.slug+'"><span class="spin"></span></span>'+
        '<b>'+esc(d.name)+'</b>'+
        '<small>'+esc(d.level)+' · <span class="pc-tag'+(pcModeleMaille(d.slug)?" m":"")+'">'+(pcModeleMaille(d.slug)?"maille":"chaîne et trame")+'</span></small>'+
        '<em>'+esc(d.desc)+'</em></button>';
    }).join("")+'</div></div>';
  document.body.appendChild(ov);
  ov.addEventListener("click",function(e){ if(e.target===ov)ov.remove(); });
  /* on dessine les vignettes une par une, sans bloquer l'écran */
  var cases=[].slice.call(ov.querySelectorAll(".pc-gi"));
  (function suite(i){
    if(i>=cases.length||!document.body.contains(ov))return;
    cases[i].innerHTML=pcMini(cases[i].dataset.slug);
    setTimeout(function(){ suite(i+1); },15);
  })(0);
}
function pcGalChoisir(slug){
  pcFermer();
  var sel=document.getElementById("tkDesign");
  if(sel){ sel.value=slug; sel.dispatchEvent(new Event("change")); }
}
window.pcGalerie=pcGalerie; window.pcGalChoisir=pcGalChoisir;


/* ======================================================================
 * 7. Tissu de contraste : manches, col, poignets, poches… dans un autre tissu
 * ====================================================================== */
var PC_ROLES={manche:"Manches",col:"Col",poignet:"Poignets",ceinture:"Ceinture",poche:"Poches",capuche:"Capuche",bande:"Bandes et bords-côtes",parement:"Parementures",dos:"Dos",jupe:"Jupe"};
function pcRoleNom(r){ return PC_ROLES[r]||r; }
function pcContraste(){
  if(!TK.board){ toast("Dessine d'abord le vêtement"); return; }
  if(!TK.tissu){ toast("Choisis d'abord le tissu principal"); pcTissuPick(); return; }
  var roles=[]; TK.board.pieces.forEach(function(p){ if(p.role!=="devant"&&PC_ROLES[p.role]&&roles.indexOf(p.role)<0)roles.push(p.role); });
  var L=pcTissus().filter(function(t){ return !TK.tissu||t.id!==TK.tissu.id; });
  var C=TK.contraste||{roles:[]};
  var old=document.getElementById("pcModal"); if(old)old.remove();
  var ov=document.createElement("div"); ov.id="pcModal"; ov.className="tq-ov";
  ov.innerHTML='<div class="card tq-box" style="max-width:620px;">'+
    '<div class="tq-hd"><div><div class="tq-cat">Étape 3 · Tissu</div><h3>Un second tissu, pour le contraste</h3></div>'+
      '<button class="x" onclick="pcFermer()">&times;</button></div>'+
    '<p class="tq-why">Des manches unies avec un corps imprimé, un col blanc, des poches colorées : c\'est ce qui rend un vêtement unique — et une façon d\'utiliser les petits restes.</p>'+
    (roles.length?'<div class="tq-sec">Quelles pièces ?</div><div class="pc-roles">'+roles.map(function(r){
      return '<label><input type="checkbox" value="'+r+'"'+(C.roles.indexOf(r)>=0?" checked":"")+'> '+esc(pcRoleNom(r))+'</label>'; }).join("")+'</div>'
      :'<p class="muted">Ce modèle n\'a pas de pièce séparable (col, manches, poches…).</p>')+
    '<div class="tq-sec">Dans quel tissu ?</div>'+
    '<div class="pc-new"><span class="muted" style="font-size:13px;">une couleur unie</span>'+
      '<input type="color" id="pcC2" value="'+esc(C.tissu&&C.tissu.mode==="couleur"?C.tissu.couleur:"#f4efe6")+'" style="width:52px;height:38px;padding:3px;">'+
      '<button class="btn sm" onclick="pcContrasteValider(\'couleur\')">Appliquer cette couleur</button></div>'+
    (L.length?'<div class="pc-grid" style="margin-top:10px;">'+L.map(function(t){
      return '<button class="pc-sw'+(C.tissu&&C.tissu.id===t.id?" on":"")+'" onclick="pcContrasteValider(\''+t.id+'\')"><span style="'+(t.mode==="couleur"?'background:'+esc(t.couleur):'background-image:url(\''+esc(t.img)+'\')')+'"></span><em>'+esc(t.nom)+'</em></button>';
    }).join("")+'</div>':'')+
    (TK.contraste?'<div style="margin-top:14px;"><button class="btn ghost sm" onclick="TK.contraste=null;pcFermer();tkDraw();">Retirer le contraste</button></div>':'')+
  '</div>';
  document.body.appendChild(ov);
  ov.addEventListener("click",function(e){ if(e.target===ov)ov.remove(); });
}
function pcContrasteValider(src){
  var roles=[].slice.call(document.querySelectorAll("#pcModal .pc-roles input:checked")).map(function(i){ return i.value; });
  if(!roles.length){ toast("Coche au moins une pièce"); return; }
  var t;
  if(src==="couleur"){ var c=document.getElementById("pcC2").value; t={id:"c-"+c, mode:"couleur", couleur:c, nom:"Uni "+c, laize:140}; }
  else t=pcTissus().filter(function(x){ return String(x.id)===String(src); })[0];
  if(!t)return;
  TK.contraste={tissu:t, roles:roles};
  pcFermer(); tkDraw();
  /* dans la vue « vêtement », seules les manches sont dessinées : on montre les pièces si besoin */
  if(roles.some(function(r){ return r!=="manche"&&r!=="dos"; })&&TK.mode==="assemble")toast("Astuce : « Planche de pièces » montre aussi col, poches et poignets en contraste");
  else toast("Contraste appliqué");
}

/* ======================================================================
 * 8. Comparer des tissus : le même vêtement, dans 2 ou 3 tissus
 * ====================================================================== */
function pcComparerTissus(){
  var L=pcTissus();
  if(L.length<2){ toast("Ajoute au moins deux tissus à ta réserve"); return; }
  var old=document.getElementById("pcModal"); if(old)old.remove();
  var ov=document.createElement("div"); ov.id="pcModal"; ov.className="tq-ov";
  ov.innerHTML='<div class="card tq-box" style="max-width:640px;">'+
    '<div class="tq-hd"><div><div class="tq-cat">Étape 3 · Tissu</div><h3>Lequel choisir ?</h3></div><button class="x" onclick="pcFermer()">&times;</button></div>'+
    '<p class="tq-why">Coche 2 ou 3 tissus : le vêtement s\'affiche dans chacun, côte à côte, à la même échelle.</p>'+
    '<div class="pc-grid">'+L.map(function(t){
      return '<label class="pc-sw pc-ck"><input type="checkbox" value="'+t.id+'"><span style="'+(t.mode==="couleur"?'background:'+esc(t.couleur):'background-image:url(\''+esc(t.img)+'\')')+'"></span><em>'+esc(t.nom)+'</em></label>';
    }).join("")+'</div>'+
    '<div style="margin-top:12px;"><button class="btn" onclick="pcComparerGo()">Comparer</button></div></div>';
  document.body.appendChild(ov);
  ov.addEventListener("click",function(e){ if(e.target===ov)ov.remove(); });
}
function pcComparerGo(){
  var ids=[].slice.call(document.querySelectorAll("#pcModal .pc-ck input:checked")).map(function(i){ return i.value; }).slice(0,3);
  if(ids.length<2){ toast("Coche au moins deux tissus"); return; }
  pcFermer();
  var wrap=document.getElementById("tkWrap"); if(!wrap||!TK.board)return;
  var sv=TK.tissu, b=TK.board, mode=flatAssemblable(b)?TK.mode:"pieces";
  var html='<div class="tk-cmp">'+ids.map(function(id){
    var t=pcTissus().filter(function(x){ return String(x.id)===String(id); })[0]; if(!t)return "";
    TK.tissu=t;
    /* chaque dessin a ses propres identifiants de motif */
    var s=flatSvg(b,mode).replace(/pcFab2/g,"pcFabB"+id).replace(/pcFab(?!B)/g,"pcFab"+id);
    return '<div class="col"><h4>'+esc(t.nom)+'</h4>'+s+'<button class="btn sm" style="margin-top:8px;" onclick="pcTissuChoisir(\''+t.id+'\')">Choisir celui-ci</button></div>';
  }).join("")+'</div>';
  TK.tissu=sv;
  wrap.innerHTML=html;
  var note=document.getElementById("tkNote"); if(note)note.textContent="Comparaison de tissus. « Redessiner » revient à la vue normale.";
}
window.pcContraste=pcContraste; window.pcContrasteValider=pcContrasteValider;
window.pcComparerTissus=pcComparerTissus; window.pcComparerGo=pcComparerGo; window.pcRoleNom=pcRoleNom;
