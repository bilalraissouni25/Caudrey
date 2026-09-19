"use strict";
/* ===== Imaginer : concrétiser une idée sans savoir dessiner =====
 * Trois portes d'entrée, selon ce qu'elle a en tête :
 *   1. « Je la décris »   : une phrase → le modèle le plus proche, réglé et coloré,
 *                            dessiné à ses mesures (aucune clé IA nécessaire).
 *                            Avec une clé : l'IA dessine aussi un croquis de mode.
 *   2. « Je l'ai en photo » : photo → croquis au crayon ou contours, prêt à décalquer
 *                            et à annoter (100 % dans le navigateur).
 *   3. « Je la compose »   : le dessin technique juste devient le fond du Composer,
 *                            elle y pose volants, poches, nœuds… depuis la bibliothèque.
 */

/* ======================================================================
 * 1. Lire une description en français
 * ====================================================================== */
var ID_MODELES=[
  /* [expression, slug] — de la plus précise à la plus générale */
  [/chemise|blouse boutonn/,"simone"],[/t-?shirt|tee-?shirt|\btee\b/,"teagan"],[/d[ée]bardeur|caraco/,"aaron"],
  [/brassi[èe]re|crop.?top sport/,"sabrina"],[/capuche|hoodie/,"hugo"],[/zipp|zip/,"huey"],[/sweat|pull/,"sven"],
  [/drap[ée]/,"diana"],[/z[ée]ro.?d[ée]chet|kimono/,"tamiko"],[/top|haut\b/,"tamiko"],
  [/jupe (cercle|[ée]vas[ée]e|patineuse|virevoltante)|jupe.*cercle/,"sandy"],[/jupe crayon|jupe droite|jupe ajust/,"penelope"],
  [/jupe.*fendu|jupe.*fente/,"sunny"],[/jupe/,"sandy"],
  [/robe.*(bretelle|nuisette|slip)|nuisette/,"sophie"],[/robe/,"sasha"],
  [/salopette/,"opal"],[/legging/,"lumira"],[/short bouffant|bloomer/,"percy"],[/short trap[èe]ze/,"ashley"],[/short/,"shin"],
  [/portefeuille|wrap/,"waralee"],[/chino/,"charlie"],[/pantalon large|palazzo|wide/,"paco"],[/pantalon|jean/,"paco"],
  [/veste en jean|veste jean/,"devon"],[/teddy|bomber|blouson/,"jett"],[/tailleur|blazer|costume/,"jaeger"],
  [/manteau/,"carlita"],[/gilet/,"wahid"],[/corset|bustier/,"cathrin"],[/cape/,"lunetius"],
  [/sac banane|banane/,"hortensia"],[/tablier/,"albert"],[/casquette/,"florent"],[/n[œo]eud papillon/,"benjamin"]
];
var ID_COULEURS=[
  [/vert sauge|sauge/,"vert sauge","#9caf88"],[/kaki/,"kaki","#6b6b3f"],[/vert/,"vert","#4f7a55"],[/bleu marine|marine/,"bleu marine","#243a5e"],
  [/bleu ciel/,"bleu ciel","#9cc3e4"],[/bleu/,"bleu","#3f6ea8"],[/rose poudr/,"rose poudré","#e5c1c5"],[/rose/,"rose","#e79ab0"],
  [/fuchsia/,"fuchsia","#c2185b"],[/bordeaux/,"bordeaux","#6d1f2c"],[/rouge/,"rouge","#b3262e"],[/terracotta|terre cuite/,"terracotta","#c5653f"],
  [/rouille/,"rouille","#a34d25"],[/orange/,"orange","#e07b39"],[/moutarde/,"moutarde","#c9a227"],[/jaune/,"jaune","#e8c547"],
  [/beige|sable/,"beige","#d9c7a7"],[/camel/,"camel","#b3874f"],[/chocolat/,"chocolat","#4b2e20"],[/marron|brun/,"marron","#6b4a33"],
  [/noir/,"noir","#1d1d1f"],[/blanc cass|[ée]cru|ivoire/,"écru","#efe6d2"],[/blanc/,"blanc","#fafafa"],[/gris/,"gris","#8d8d8d"],
  [/lilas|lavande/,"lilas","#b9a3d0"],[/violet|prune/,"violet","#6a4a8c"]
];
var ID_MATIERES=[["lin","lin"],["jersey","jersey"],["maille","jersey"],["molleton","molleton"],["sweat","molleton"],["jean","denim"],["denim","denim"],
  ["viscose","viscose"],["satin","viscose"],["soie","viscose"],["coton","popeline"],["popeline","popeline"],["laine","laine"],["velours","autre"]];

function idNorm(s){ return String(s||"").toLowerCase(); }
function idLire(txt){
  var t=idNorm(txt), r={texte:txt, comme:{}, couleur:null, matiere:null, slugs:[]};
  ID_MODELES.forEach(function(m){ if(m[0].test(t)&&r.slugs.indexOf(m[1])<0)r.slugs.push(m[1]); });
  if(/ample|oversize|large|loose|flou|fluide|vague/.test(t))r.comme.ampleur="ample";
  if(/ajust[ée]|moulant|pr[èe]s du corps|slim|cintr[ée]/.test(t))r.comme.ampleur="ajuste";
  /* la longueur du vêtement, sans confondre avec celle des manches */
  var t2=t.replace(/manches? (longues?|courtes?|bouffantes?|ballon)|sans manches?/g,"");
  if(/\blongu?e?s?\b|maxi|midi|cheville/.test(t2))r.comme.longueur="long";
  if(/\bcourte?s?\b|crop|mini/.test(t2))r.comme.longueur="court";
  if(/manches? longues?|manches? bouffantes?|manches? ballon/.test(t))r.comme.manches="longues";
  if(/manches? courtes?|sans manches?|mancherons?/.test(t))r.comme.manches="courtes";
  for(var i=0;i<ID_COULEURS.length;i++){ if(ID_COULEURS[i][0].test(t)){ r.couleur={nom:ID_COULEURS[i][1],hex:ID_COULEURS[i][2]}; break; } }
  for(var j=0;j<ID_MATIERES.length;j++){ if(new RegExp("\\b"+ID_MATIERES[j][0]).test(t)){ r.matiere=ID_MATIERES[j][1]; break; } }
  /* rien de reconnu : on s'appuie sur le type, sinon un t-shirt */
  if(!r.slugs.length&&typeof isTypeDe==="function"){
    var ty=isTypeDe(t); var f=(typeof FSALL!=="undefined")?FSALL.filter(function(d){ return d.type===ty&&!/bloc/i.test(d.name); })[0]:null;
    if(f)r.slugs.push(f.slug);
  }
  var dispo=(window.FS&&FS.designs)||[];
  r.slugs=r.slugs.filter(function(s){ return dispo.indexOf(s)>=0; });
  /* deux voisins du même type en plus, pour choisir */
  if(r.slugs.length&&typeof FSALL!=="undefined"){
    var f0=FSALL.filter(function(d){ return d.slug===r.slugs[0]; })[0];
    FSALL.filter(function(d){ return f0&&d.type===f0.type&&!/bloc/i.test(d.name)&&dispo.indexOf(d.slug)>=0&&r.slugs.indexOf(d.slug)<0; })
      .sort(function(a,b){ return (a.d||0)-(b.d||0); }).slice(0,Math.max(0,3-r.slugs.length))
      .forEach(function(d){ r.slugs.push(d.slug); });
  }
  r.slugs=r.slugs.slice(0,3);
  return r;
}

/* les options du modèle, poussées dans le sens de la description (même règle que « comme sur la photo ») */
function idVals(slug,comme){
  var vals={};
  if(typeof IS_AXES==="undefined")return vals;
  var defs=flatOptions(slug);
  Object.keys(IS_AXES).forEach(function(axe){
    var v=(comme||{})[axe]; if(!v||v==="standard")return;
    var A=IS_AXES[axe];
    defs.forEach(function(o){
      if(!A.re.test(o.k)||(o.type!=="pct"&&o.type!=="deg"))return;
      var nv=o.def;
      if(v===A.haut)nv=o.def+(o.max-o.def)*0.6; else if(v===A.bas)nv=o.def-(o.def-o.min)*0.6;
      vals[o.k]=Math.round(nv*2)/2;
    });
  });
  return vals;
}
function idEngine(slug,vals){
  var o={}; flatOptions(slug).forEach(function(d){ if(vals[d.k]!=null)o[d.k]=(d.type==="pct")?vals[d.k]/100:vals[d.k]; }); return o;
}
function idDessin(slug,comme,couleur){
  var meas=(typeof fsOverrides==="function")?fsOverrides():{};
  var vals=idVals(slug,comme), b=null;
  try{ b=flatBuild(slug,meas,idEngine(slug,vals)); }catch(e){}
  if(!b)return '<div class="muted" style="padding:30px;font-size:12px;">non dessinable</div>';
  var sv=TK.tissu; TK.tissu=couleur?{mode:"couleur",couleur:couleur.hex}:null;
  var s=flatSvg(b,flatAssemblable(b)?"assemble":"pieces");
  TK.tissu=sv;
  return s;
}

/* ======================================================================
 * L'écran « Imaginer »
 * ====================================================================== */
var ID={res:null};
var ID_EXEMPLES=["Une robe longue et fluide, manches longues, vert sauge","Un t-shirt oversize crop en jersey noir",
  "Une jupe cercle midi terracotta","Un sweat à capuche ample beige","Un pantalon large en lin écru","Une chemise ajustée bleu ciel"];
function idRender(){
  var box=document.getElementById("studioIdee"); if(!box)return;
  box.innerHTML=
  '<div class="id-hero card">'+
    '<h3 class="serif">Ton idée, dessinée — sans savoir dessiner</h3>'+
    '<p class="muted">Choisis comment tu l\'as en tête. Tout finit au même endroit : un dessin juste, à tes mesures, qui devient un vrai patron.</p>'+
    '<div class="id-portes">'+
      '<button class="id-p on" data-p="decrire" onclick="idPorte(\'decrire\')"><b>Je la décris</b><span>quelques mots suffisent</span></button>'+
      '<button class="id-p" data-p="photo" onclick="idPorte(\'photo\')"><b>Je l\'ai en photo</b><span>photo → croquis</span></button>'+
      '<button class="id-p" data-p="composer" onclick="idPorte(\'composer\')"><b>Je la compose</b><span>ajoute des détails</span></button>'+
    '</div></div>'+
  '<div id="idCorps"></div>';
  idPorte(ID.porte||"decrire");
}
function idPorte(p){
  ID.porte=p;
  document.querySelectorAll(".id-p").forEach(function(b){ b.classList.toggle("on",b.dataset.p===p); });
  var c=document.getElementById("idCorps"); if(!c)return;
  if(p==="decrire"){
    c.innerHTML='<div class="card">'+
      '<label class="fld">Décris le vêtement que tu imagines</label>'+
      '<textarea id="idTexte" rows="2" placeholder="ex. une robe longue et fluide, manches longues, vert sauge">'+esc(ID.texte||"")+'</textarea>'+
      '<div class="id-ex">'+ID_EXEMPLES.map(function(e){ return '<button onclick="document.getElementById(\'idTexte\').value=this.textContent;idDecrire()">'+esc(e)+'</button>'; }).join("")+'</div>'+
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">'+
        '<button class="btn" onclick="idDecrire()">Dessiner mon idée</button>'+
        '<button class="btn ghost" onclick="idCroquisIA()" title="Nécessite une clé OpenAI ou Gemini (Assistant IA)">Croquis de mode par l\'IA</button>'+
      '</div></div><div id="idRes"></div>';
    if(ID.res)idResultats();
  } else if(p==="photo"){
    var L=(state.inspirations||[]).filter(function(x){ return x.img; }).slice(0,18);
    c.innerHTML='<div class="card">'+
      '<p class="muted" style="margin:0 0 10px;font-size:13.5px;line-height:1.55;">Une photo de vêtement devient un croquis au crayon ou un dessin au trait. Tu peux ensuite <b>le décalquer</b> dans « Dessiner », gommer ce qui ne te plaît pas et ajouter tes idées par-dessus.</p>'+
      '<label class="btn">Choisir une photo<input type="file" accept="image/*" hidden onchange="idPhotoFichier(this)"></label>'+
      (L.length?'<div class="tq-sec">Ou une de tes inspirations</div><div class="is-grid">'+L.map(function(x){
        return '<button class="is-it" onclick="idPhotoInspi(\''+x.id+'\')"><span style="background-image:url(\''+esc(x.img)+'\')"></span><em>'+esc((x.title||"").slice(0,30))+'</em></button>';
      }).join("")+'</div>':'')+
    '</div><div id="idRes"></div>';
    if(ID.photo)idCroquis();
  } else {
    c.innerHTML='<div class="card">'+
      '<p class="muted" style="margin:0 0 10px;font-size:13.5px;line-height:1.55;">Le dessin technique de ton modèle (aux bonnes proportions, dans ton tissu) devient le fond du <b>Composer</b>. Tu y ajoutes volants, poches, nœuds, cols, boutons depuis la bibliothèque — en glissant, sans dessiner.</p>'+
      '<div style="display:flex;gap:8px;flex-wrap:wrap;">'+
        '<button class="btn" onclick="idVersComposer()">Composer sur « '+esc(typeof tkLabel==="function"?tkLabel(TK.slug):TK.slug)+' »</button>'+
        '<button class="btn ghost" onclick="pcGalerie()">Changer de modèle</button></div>'+
      '<div class="muted" style="font-size:12px;margin-top:8px;">Astuce : décris d\'abord ton idée pour partir du bon modèle.</div>'+
    '</div>';
  }
}

/* ---------- 1. décrire ---------- */
function idDecrire(){
  var t=(document.getElementById("idTexte")||{}).value||"";
  if(!t.trim()){ toast("Écris quelques mots sur ton idée"); return; }
  ID.texte=t; ID.res=idLire(t);
  if(!ID.res.slugs.length){ document.getElementById("idRes").innerHTML='<div class="card muted" style="margin-top:12px;">Je n\'ai pas reconnu de vêtement. Essaie avec « robe », « jupe », « t-shirt », « pantalon », « sweat »…</div>'; return; }
  idResultats();
}
function idResultats(){
  var r=ID.res, box=document.getElementById("idRes"); if(!box||!r)return;
  var lu=[];
  if(r.comme.ampleur)lu.push(r.comme.ampleur==="ample"?"ample":"ajusté");
  if(r.comme.longueur)lu.push(r.comme.longueur==="long"?"plus long":"plus court");
  if(r.comme.manches)lu.push("manches "+r.comme.manches);
  if(r.couleur)lu.push(r.couleur.nom);
  if(r.matiere)lu.push(typeof pcTypeNom==="function"?pcTypeNom(r.matiere).toLowerCase():r.matiere);
  box.innerHTML='<div class="id-lu">J\'ai compris : '+(lu.length?lu.map(function(x){return '<span>'+esc(x)+'</span>';}).join(""):'<em>le type de vêtement seulement</em>')+'</div>'+
    '<div class="id-res">'+r.slugs.map(function(s,i){
      var d=(typeof FSALL!=="undefined")?FSALL.filter(function(f){return f.slug===s;})[0]:null;
      return '<div class="id-c'+(i===0?" best":"")+'"><div class="id-dess" data-s="'+s+'"><span class="spin"></span></div>'+
        '<b>'+esc(d?d.name:s)+'</b><small>'+esc(d?d.level+" · "+d.desc:"")+'</small>'+
        '<button class="btn sm" onclick="idChoisir(\''+s+'\')">'+(i===0?"C'est ça — continuer":"Plutôt celui-ci")+'</button></div>';
    }).join("")+'</div>';
  var cases=[].slice.call(box.querySelectorAll(".id-dess"));
  (function suite(i){
    if(i>=cases.length)return;
    cases[i].innerHTML=idDessin(cases[i].dataset.s,r.comme,r.couleur);
    setTimeout(function(){ suite(i+1); },20);
  })(0);
}
function idChoisir(slug){
  var r=ID.res||{comme:{}};
  var b=document.querySelector('#studioMode button[data-s="tech"]'); if(b)b.click();
  setTimeout(function(){
    var sel=document.getElementById("tkDesign");
    if(sel){ sel.value=slug; sel.dispatchEvent(new Event("change")); }
    TK.comme=JSON.parse(JSON.stringify(r.comme||{}));
    if(typeof isAppliquerComme==="function")isAppliquerComme();
    if(r.couleur){
      var t={id:"idee-"+Date.now(), mode:"couleur", couleur:r.couleur.hex, nom:"Uni "+r.couleur.nom, type:r.matiere||"autre", laize:140};
      TK.tissu=t; if(typeof tkDraw==="function")tkDraw();
    }
    toast("Ton idée est prête : règle les détails, puis choisis ton tissu");
  },350);
}

/* ---------- croquis par l'IA (facultatif) ---------- */
function idCroquisIA(){
  var t=((document.getElementById("idTexte")||{}).value||"").trim();
  if(!t){ toast("Décris d'abord ton idée"); return; }
  var a=state.ai||{};
  var box=document.getElementById("idRes");
  if(!a.key||(a.provider!=="openai"&&a.provider!=="gemini")){
    box.innerHTML='<div class="card muted" style="margin-top:12px;font-size:13.5px;line-height:1.55;">Le croquis par l\'IA demande une clé <b>OpenAI</b> ou <b>Google Gemini</b> (onglet Assistant IA). Sans clé, « Dessiner mon idée » fonctionne déjà : il dessine le vrai modèle à tes mesures.</div>';
    return;
  }
  var prompt="Croquis de mode professionnel (dessin technique à plat, « flat sketch ») d'un vêtement : "+t+
    ". Vue de face et vue de dos côte à côte, traits noirs nets sur fond blanc, sans personnage, sans texte, proportions réalistes, coutures et surpiqûres visibles.";
  box.innerHTML='<div class="card muted" style="margin-top:12px;"><span class="spin"></span> L\'IA dessine ton croquis…</div>';
  var pr;
  if(a.provider==="gemini"){
    var models=["gemini-3.1-flash-image","gemini-2.5-flash-image"];
    pr=(function essai(i){
      if(i>=models.length)return Promise.reject("aucun modèle image disponible");
      return fetch("https://generativelanguage.googleapis.com/v1beta/models/"+models[i]+":generateContent?key="+encodeURIComponent(a.key),{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseModalities:["TEXT","IMAGE"]}})})
        .then(function(r){ return r.json(); }).then(function(d){
          if(d.error){ if(i<models.length-1)return essai(i+1); throw d.error.message; }
          var parts=(d.candidates&&d.candidates[0]&&d.candidates[0].content&&d.candidates[0].content.parts)||[];
          for(var k=0;k<parts.length;k++){ var p=parts[k].inlineData||parts[k].inline_data; if(p&&p.data)return "data:"+(p.mimeType||p.mime_type||"image/png")+";base64,"+p.data; }
          throw "pas d'image renvoyée";
        });
    })(0);
  } else {
    pr=fetch("https://api.openai.com/v1/images/generations",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+a.key},
      body:JSON.stringify({model:"gpt-image-1",prompt:prompt,size:"1536x1024",n:1})})
      .then(function(r){ return r.json(); }).then(function(d){ if(d.error)throw d.error.message; var b=d.data[0].b64_json; return b?"data:image/png;base64,"+b:d.data[0].url; });
  }
  pr.then(function(url){
    ID.croquisIA=url;
    box.innerHTML='<div class="card" style="margin-top:12px;"><img src="'+esc(url)+'" class="id-ia" alt="Croquis">'+
      '<p class="muted" style="font-size:12.5px;line-height:1.5;margin:8px 0;">Un croquis d\'ambiance : les proportions sont celles de l\'IA, pas les tiennes. Pour un dessin juste, clique « Dessiner mon idée ».</p>'+
      '<div style="display:flex;gap:8px;flex-wrap:wrap;"><button class="btn sm" onclick="idGarderIA()">Garder dans mes inspirations</button>'+
      '<button class="btn ghost sm" onclick="idDecrire()">Dessiner mon idée à mes mesures</button></div></div>';
  }).catch(function(e){
    box.innerHTML='<div class="card muted" style="margin-top:12px;">Croquis impossible ('+esc(String(e).slice(0,120))+').</div>';
  });
}
function idGarderIA(){
  if(!ID.croquisIA)return;
  fetch(ID.croquisIA).then(function(r){ return r.blob(); }).then(function(b){
    return importImageBlob(b,{title:"Idée — "+(ID.texte||"").slice(0,60),note:ID.texte||"",platform:"Idée"});
  }).then(function(){ toast("Croquis ajouté à tes inspirations"); }).catch(function(){ toast("Enregistrement impossible"); });
}

/* ======================================================================
 * 2. Photo → croquis, entièrement dans le navigateur
 * ====================================================================== */
function idPhotoFichier(inp){
  var f=inp.files&&inp.files[0]; if(!f)return;
  var rd=new FileReader(); rd.onload=function(){ ID.photo={src:rd.result,titre:"Ma photo"}; ID.style=ID.style||"crayon"; idCroquis(); }; rd.readAsDataURL(f);
}
function idPhotoInspi(id){
  var x=(state.inspirations||[]).filter(function(i){ return String(i.id)===String(id); })[0]; if(!x)return;
  ID.photo={src:x.img,titre:x.title||"Inspiration",id:x.id}; ID.style=ID.style||"crayon"; idCroquis();
}
/* flou « boîte » séparable, trois passes ≈ flou gaussien, sans dépendre de ctx.filter (iOS ancien) */
function idFlou(src,w,h,r){
  var a=new Float32Array(src), b=new Float32Array(w*h);
  for(var pass=0;pass<3;pass++){
    for(var y=0;y<h;y++){ var acc=0,o=y*w;
      for(var x=-r;x<=r;x++)acc+=a[o+Math.min(w-1,Math.max(0,x))];
      for(x=0;x<w;x++){ b[o+x]=acc/(2*r+1); acc+=a[o+Math.min(w-1,x+r+1)]-a[o+Math.max(0,x-r)]; } }
    for(var x2=0;x2<w;x2++){ var acc2=0;
      for(var y2=-r;y2<=r;y2++)acc2+=b[Math.min(h-1,Math.max(0,y2))*w+x2];
      for(y2=0;y2<h;y2++){ a[y2*w+x2]=acc2/(2*r+1); acc2+=b[Math.min(h-1,y2+r+1)*w+x2]-b[Math.max(0,y2-r)*w+x2]; } }
  }
  return a;
}
function idTraiter(img,style,force){
  var max=900, s=Math.min(1,max/Math.max(img.naturalWidth||img.width,img.naturalHeight||img.height));
  var w=Math.round((img.naturalWidth||img.width)*s), h=Math.round((img.naturalHeight||img.height)*s);
  var cv=document.createElement("canvas"); cv.width=w; cv.height=h;
  var cx=cv.getContext("2d"); cx.drawImage(img,0,0,w,h);
  var d=cx.getImageData(0,0,w,h), px=d.data, n=w*h, g=new Float32Array(n);
  for(var i=0;i<n;i++)g[i]=0.299*px[i*4]+0.587*px[i*4+1]+0.114*px[i*4+2];
  var out=new Uint8ClampedArray(n);
  if(style==="trait"){
    /* contours : gradient de Sobel sur l'image adoucie, seuil adaptatif, traits noirs sur blanc */
    var sm=idFlou(g,w,h,1), mag=new Float32Array(n), m=0;
    for(var y=1;y<h-1;y++)for(var x=1;x<w-1;x++){
      var k=y*w+x;
      var gx=-sm[k-w-1]-2*sm[k-1]-sm[k+w-1]+sm[k-w+1]+2*sm[k+1]+sm[k+w+1];
      var gy=-sm[k-w-1]-2*sm[k-w]-sm[k-w+1]+sm[k+w-1]+2*sm[k+w]+sm[k+w+1];
      mag[k]=Math.sqrt(gx*gx+gy*gy); if(mag[k]>m)m=mag[k];
    }
    var seuil=m*(0.34-0.26*force);
    for(i=0;i<n;i++)out[i]=mag[i]>seuil?Math.max(0,255-Math.min(255,(mag[i]-seuil)/(m-seuil+1)*900)):255;
  } else {
    /* crayon : « densité couleur » de l'image sur son négatif flouté (la méthode classique des croquis) */
    var inv=new Float32Array(n); for(i=0;i<n;i++)inv[i]=255-g[i];
    var bl=idFlou(inv,w,h,Math.max(2,Math.round(w/(90-60*force))));
    for(i=0;i<n;i++){ var v=bl[i]>=255?255:Math.min(255,g[i]*255/(255-bl[i])); out[i]=v; }
    /* on renforce les gris pour un trait lisible */
    for(i=0;i<n;i++)out[i]=out[i]>245?255:Math.max(0,out[i]-(255-out[i])*(0.4+force));
  }
  for(i=0;i<n;i++){ px[i*4]=px[i*4+1]=px[i*4+2]=out[i]; px[i*4+3]=255; }
  cx.putImageData(d,0,0);
  return cv.toDataURL("image/jpeg",0.88);
}
function idCroquis(){
  var box=document.getElementById("idRes"); if(!box||!ID.photo)return;
  var f=ID.force==null?0.5:ID.force;
  box.innerHTML='<div class="card id-cq"><div class="id-cq-v"><img src="'+esc(ID.photo.src)+'" alt=""><div id="idOut" class="id-out"><span class="spin"></span></div></div>'+
    '<div class="id-cq-r">'+
      '<div class="seg" style="margin:0 0 10px;"><button class="'+(ID.style==="crayon"?"on":"")+'" onclick="ID.style=\'crayon\';idCroquis()">Crayon</button>'+
      '<button class="'+(ID.style==="trait"?"on":"")+'" onclick="ID.style=\'trait\';idCroquis()">Traits</button></div>'+
      '<label class="fld">Intensité</label><input type="range" min="0" max="1" step="0.05" value="'+f+'" onchange="ID.force=parseFloat(this.value);idCroquis()">'+
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">'+
        '<button class="btn sm" onclick="idCroquisGarder(true)">Décalquer et annoter</button>'+
        '<button class="btn ghost sm" onclick="idCroquisGarder(false)">Garder dans mes inspirations</button></div>'+
      '<div class="muted" style="font-size:12px;line-height:1.5;margin-top:8px;">Marche mieux avec un vêtement sur fond uni. Tout se fait sur ton téléphone : la photo ne part nulle part.</div>'+
    '</div></div>';
  var img=new Image();
  img.onload=function(){
    setTimeout(function(){
      try{ ID.croquis=idTraiter(img,ID.style,f); var o=document.getElementById("idOut"); if(o)o.innerHTML='<img src="'+ID.croquis+'" alt="Croquis">'; }
      catch(e){ var o2=document.getElementById("idOut"); if(o2)o2.innerHTML='<div class="muted" style="padding:20px;">Photo illisible ('+esc(String(e.message||e).slice(0,60))+')</div>'; }
    },20);
  };
  img.src=ID.photo.src;
}
function idCroquisGarder(decalquer){
  if(!ID.croquis)return;
  fetch(ID.croquis).then(function(r){ return r.blob(); }).then(function(b){
    return importImageBlob(b,{title:"Croquis — "+(ID.photo.titre||"").slice(0,50),platform:"Croquis"});
  }).then(function(obj){
    toast("Croquis ajouté à tes inspirations");
    if(!decalquer)return;
    /* « Dessiner » propose les inspirations comme calque de fond */
    var b=document.querySelector('#studioMode button[data-s="draw"]'); if(b)b.click();
    setTimeout(function(){
      if(typeof refreshRefSelect==="function")refreshRefSelect();
      var sel=document.getElementById("refSelect");
      if(sel){
        var opt=[].slice.call(sel.options).filter(function(o){ return String(o.value)===String(obj.id); })[0];
        if(opt){ sel.value=opt.value; sel.dispatchEvent(new Event("change")); if(typeof loadRef==="function")loadRef(); }
      }
      toast("Décalque par-dessus, gomme, ajoute tes idées");
    },300);
  }).catch(function(){ toast("Enregistrement impossible"); });
}

/* ======================================================================
 * 3. Le dessin technique comme fond du Composer
 * ====================================================================== */
function idVersComposer(){
  if(!window.fabric||typeof fc==="undefined"){ toast("Le Composer n'est pas encore chargé — réessaie en ligne"); }
  var slug=TK.slug;
  var meas=(typeof fsOverrides==="function")?fsOverrides():{};
  var b=TK.board&&TK.board.design===slug?TK.board:flatBuild(slug,meas,(typeof tkEngineOpts==="function")?tkEngineOpts():{});
  if(!b){ toast("Dessin impossible pour ce modèle"); return; }
  var svg=flatSvg(b,flatAssemblable(b)?"assemble":"pieces").replace(/<text[\s\S]*?<\/text>/g,"");
  /* pas de vector-effect dans fabric : on fixe l'épaisseur des traits en unités du dessin */
  var m=svg.match(/viewBox="[-\d.]+ [-\d.]+ ([\d.]+)/); var vw=m?parseFloat(m[1]):1000;
  svg=svg.replace(/stroke-width="([\d.]+)" (stroke-linejoin="round" stroke-linecap="round" )?vector-effect="non-scaling-stroke"/g,function(x,w){ return 'stroke-width="'+(parseFloat(w)*vw/480).toFixed(2)+'"'; });
  var bt=document.querySelector('#studioMode button[data-s="composer"]'); if(bt)bt.click();
  setTimeout(function(){
    if(!window.fabric||typeof fc==="undefined"||!fc){ return; }
    fabric.loadSVGFromString(svg,function(objs,opts){
      var o=fabric.util.groupSVGElements(objs,opts);
      var W=fc.getWidth()/(fc.getZoom?fc.getZoom():1), H=fc.getHeight()/(fc.getZoom?fc.getZoom():1);
      o.set({originX:"center",originY:"center",left:W/2,top:H/2,selectable:false,evented:false,name:"Dessin technique — "+(typeof tkLabel==="function"?tkLabel(slug):slug),
        lockMovementX:true,lockMovementY:true,lockScalingX:true,lockScalingY:true,lockRotation:true,hasControls:false,locked:true});
      o.scaleToWidth(W*0.92); if(o.getScaledHeight()>H*0.9)o.scaleToHeight(H*0.9);
      fc.add(o); fc.sendToBack(o); fc.requestRenderAll();
      toast("Ajoute tes détails depuis la bibliothèque, à gauche");
    });
  },400);
}

/* ---------- branchement de l'onglet ---------- */
document.addEventListener("DOMContentLoaded",function(){
  var el0=document.getElementById("studioIdee");
  if(el0&&el0.style.display!=="none")setTimeout(idRender,50);
  document.querySelectorAll("#studioMode button").forEach(function(b){
    b.addEventListener("click",function(){
      var el=document.getElementById("studioIdee"); if(!el)return;
      if(b.dataset.s==="idee"){ el.style.display="block"; idRender(); }
      else el.style.display="none";
    });
  });
});
window.idPorte=idPorte; window.idDecrire=idDecrire; window.idChoisir=idChoisir; window.idCroquisIA=idCroquisIA;
window.idGarderIA=idGarderIA; window.idPhotoFichier=idPhotoFichier; window.idPhotoInspi=idPhotoInspi;
window.idCroquis=idCroquis; window.idCroquisGarder=idCroquisGarder; window.idVersComposer=idVersComposer;
window.idLire=idLire; window.idTraiter=idTraiter; window.ID=ID;

/* Régression corrigée : depuis le passage des images en IndexedDB (URL blob:),
   la liste des calques de fond de « Dessiner » ne gardait que les images data: —
   aucune inspiration n'était plus décalquable. */
window.refreshRefSelect=function(){
  var sel=document.getElementById("refSelect"); if(!sel)return;
  var cur=sel.value;
  var opts='<option value="">Vierge</option><option value="__flat__">Mon croquis paramétrique (guide)</option>';
  (state.inspirations||[]).filter(function(x){ return x.img&&/^(data:|blob:)/.test(x.img); }).forEach(function(x){
    opts+='<option value="'+x.id+'">Réf : '+esc((x.title||"image").slice(0,24))+'</option>';
  });
  sel.innerHTML=opts;
  if([].slice.call(sel.options).some(function(o){ return o.value===cur; }))sel.value=cur;
};

/* ======================================================================
 * Le croquis de l'idée : le gabarit paramétrique, piloté par la phrase
 * (le vieux « Gabarit paramétrique » sait dessiner robes, jupes, tops et pantalons
 *  avec encolures, manches, volants, imprimés… il suffit de lui parler)
 * ====================================================================== */
function idDesign(r){
  var t=idNorm(r.texte||""), d={};
  var ty=/robe|combinaison/.test(t)?"robe":(/jupe/.test(t)?"jupe":(/pantalon|jean|short|legging|salopette/.test(t)?"pantalon":(/t-?shirt|top|chemise|blouse|sweat|pull|d[ée]bardeur|haut\b|crop|brassi/.test(t)?"top":null)));
  if(!ty){ var f=(typeof FSALL!=="undefined"&&r.slugs[0])?FSALL.filter(function(x){return x.slug===r.slugs[0];})[0]:null; ty=f&&/robe|jupe|pantalon|top/.test(f.type)?f.type:"robe"; }
  d.type=ty;
  d.sil=/[ée]vas[ée]e|trap[èe]ze|patineuse|cercle|virevolt/.test(t)?"evasee":(r.comme.ampleur==="ajuste"||/crayon|moulant/.test(t)?"ajustee":(r.comme.ampleur==="ample"?"ample":"droite"));
  var t2=t.replace(/manches? (longues?|courtes?|bouffantes?|ballon)|sans manches?/g,"");
  d.len=/mini|crop/.test(t2)?"mini":(/midi|mollet/.test(t2)?"midi":(/maxi|cheville|\blongu?e?s?\b/.test(t2)?"long":(/genou/.test(t2)?"genou":(r.comme.longueur==="court"?"mini":"genou"))));
  d.neck=/col v|encolure v|d[ée]collet[ée] v|\bv\b/.test(t)?"v":(/bateau/.test(t)?"bateau":(/carr[ée]/.test(t)?"carre":"ras"));
  d.sleeve=/sans manche|bretelle|nuisette|d[ée]bardeur/.test(t)?"sans":(/ballon|bouffant/.test(t)?"ballon":(/bishop|poignet froncé/.test(t)?"bishop":(/volant[ée]e?s? .*manche|manches? volant|papillon|flutter/.test(t)?"flutter":(r.comme.manches==="longues"?"longue":"courte"))));
  d.hem=/volant|froufrou|ruffle/.test(t.replace(/manches? volant\w*/g,""))?"volante":(/pliss/.test(t)?"plisse":(/asym[ée]tri/.test(t)?"asymetrique":(/portefeuille|cache-?c[œo]eur|wrap/.test(t)?"portefeuille":"simple")));
  d.waist=/n[œo]eud/.test(t)?"noeud":(/ceinture|ceintur/.test(t)?"ceinture":"aucun");
  d.poches=/poche/.test(t); d.boutons=/bouton/.test(t); d.fente=/fente|fendu/.test(t);
  d.print=/pois/.test(t)?"pois":(/ray[ée]|rayure|marini[èe]re/.test(t)?"rayures":(/fleur|fleuri|liberty|floral/.test(t)?"fleuri":"uni"));
  d.color=r.couleur?r.couleur.hex:"#9c5d7c";
  return d;
}
function idCroquisSvg(params,vue){
  if(typeof drawDesign!=="function"||typeof design==="undefined")return "";
  var sv=JSON.parse(JSON.stringify(design));
  Object.keys(params).forEach(function(k){ design[k]=params[k]; });
  design.view=vue||"devant";
  var out="";
  try{
    drawDesign();
    var el=document.getElementById("designSvg");
    out='<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+(el.getAttribute("viewBox")||"0 0 300 470")+'">'+el.innerHTML+'</svg>';
  }catch(e){}
  Object.keys(sv).forEach(function(k){ design[k]=sv[k]; });
  try{ drawDesign(); }catch(e){}
  /* chaque croquis a ses propres motifs : on rend leurs identifiants uniques */
  var uid2="c"+Math.random().toString(36).slice(2,7);
  return out.replace(/id="([^"]+)"/g,'id="'+uid2+'$1"').replace(/url\(#([^)]+)\)/g,'url(#'+uid2+'$1)');
}
function idCroquisBloc(r){
  var p=idDesign(r); ID.design=p;
  var mots={robe:"Robe",jupe:"Jupe",top:"Haut",pantalon:"Pantalon"}[p.type];
  var det=[];
  var fem=(p.type==="robe"||p.type==="jupe");
  var SIL=fem?{evasee:"évasée",ajustee:"ajustée",ample:"ample",droite:"droite"}:{evasee:"évasé",ajustee:"ajusté",ample:"ample",droite:"droit"},
      LEN=fem?{mini:"courte",genou:"au genou",midi:"midi",long:"longue"}:{mini:"court",genou:"mi-long",midi:"midi",long:"long"},
      NECK={ras:"",v:"col V",bateau:"encolure bateau",carre:"encolure carrée"}, SL={sans:"sans manches",courte:"manches courtes",longue:"manches longues",ballon:"manches ballon",bishop:"manches bishop",flutter:"manches volantées"},
      HEM={simple:"",volante:"bas volanté",plisse:"plissée",asymetrique:"bas asymétrique",portefeuille:"portefeuille"};
  det.push(SIL[p.sil]); if(p.type!=="pantalon")det.push(LEN[p.len]); if(p.type!=="jupe"&&p.type!=="pantalon"){ if(NECK[p.neck])det.push(NECK[p.neck]); det.push(SL[p.sleeve]); }
  if(HEM[p.hem])det.push(p.hem==="plisse"&&!fem?"plissé":HEM[p.hem]); if(p.waist!=="aucun")det.push(p.waist==="noeud"?"nœud à la taille":"ceinture");
  if(p.poches)det.push("poches"); if(p.boutons)det.push("boutons"); if(p.fente)det.push("fente"); if(p.print!=="uni")det.push(p.print==="pois"?"à pois":(p.print==="rayures"?(fem?"rayée":"rayé"):(fem?"fleurie":"fleuri")));
  return '<div class="card id-cro"><div class="id-cro-v"><div>'+idCroquisSvg(p,"devant")+'<span>devant</span></div><div>'+idCroquisSvg(p,"dos")+'<span>dos</span></div></div>'+
    '<div class="id-cro-t"><div class="tq-cat">Ton croquis</div><h4>'+esc(mots+" "+det.filter(Boolean).join(", "))+'</h4>'+
    '<p class="muted" style="font-size:12.5px;line-height:1.5;margin:6px 0 10px;">Un croquis pour voir l\'allure. Change un détail en quelques clics, puis choisis plus bas le patron qui s\'en approche : lui sera à tes mesures.</p>'+
    '<div style="display:flex;gap:8px;flex-wrap:wrap;"><button class="btn sm" onclick="idModifier()">Modifier le croquis</button>'+
    '<button class="btn ghost sm" onclick="idGarderCroquisParam()">Garder dans mes inspirations</button></div></div></div>'+
    '<div class="tq-sec" style="margin:16px 0 8px;">Les patrons qui s\'en approchent, dessinés à tes mesures</div>';
}
function idModifier(){
  var p=ID.design; if(!p)return;
  Object.keys(p).forEach(function(k){ design[k]=p[k]; });
  var bt=document.querySelector('#studioMode button[data-s="compose"]'); if(bt)bt.click();
  function seg(id,attr,val){ document.querySelectorAll("#"+id+" button").forEach(function(b){ b.classList.toggle("on",b.dataset[attr]===val); }); }
  seg("dType","t",p.type); seg("dPrint","p",p.print); seg("dViewSeg","w","devant");
  [["dSil","sil"],["dLen","len"],["dNeck","neck"],["dSleeve","sleeve"],["dHem","hem"],["dWaist","waist"]].forEach(function(x){ var e=document.getElementById(x[0]); if(e)e.value=p[x[1]]; });
  [["dPoches","poches"],["dBoutons","boutons"],["dFente","fente"]].forEach(function(x){ var e=document.getElementById(x[0]); if(e)e.checked=!!p[x[1]]; });
  var c=document.getElementById("dColor"); if(c)c.value=p.color;
  design.view="devant";
  /* le gabarit masque encolure/manches selon le type : on lui laisse faire son rendu habituel */
  var tb=document.querySelector('#dType button[data-t="'+p.type+'"]'); if(tb)tb.click();
  if(typeof readDesign==="function")readDesign(); else drawDesign();
  toast("Change ce que tu veux : tout se redessine");
}
function idGarderCroquisParam(){
  var p=ID.design; if(!p)return;
  var svg=idCroquisSvg(p,"devant");
  var img=new Image();
  img.onload=function(){
    var cv=document.createElement("canvas"); cv.width=600; cv.height=940;
    var cx=cv.getContext("2d"); cx.fillStyle="#fff"; cx.fillRect(0,0,600,940); cx.drawImage(img,0,0,600,940);
    cv.toBlob(function(b){
      importImageBlob(b,{title:"Idée — "+(ID.texte||"").slice(0,60),note:ID.texte||"",platform:"Idée"})
        .then(function(){ toast("Croquis ajouté à tes inspirations"); });
    },"image/jpeg",0.9);
  };
  img.src="data:image/svg+xml;base64,"+btoa(unescape(encodeURIComponent(svg.replace("<svg ",'<svg width="300" height="470" '))));
}
/* le résultat de « Je la décris » commence par le croquis */
(function(){
  var base=idResultats;
  idResultats=function(){
    base();
    var box=document.getElementById("idRes"); if(!box||!ID.res)return;
    var lu=box.querySelector(".id-lu");
    if(lu){
      lu.insertAdjacentHTML("afterend",idCroquisBloc(ID.res));
      /* le croquis dit déjà ce qui a été compris ; on ne garde que la matière et la couleur */
      var r=ID.res, garde=[];
      if(r.couleur)garde.push(r.couleur.nom);
      if(r.matiere)garde.push(typeof pcTypeNom==="function"?pcTypeNom(r.matiere).toLowerCase():r.matiere);
      lu.innerHTML=garde.length?'Tissu : '+garde.map(function(x){ return '<span>'+esc(x)+'</span>'; }).join(""):'';
      if(!garde.length)lu.style.display="none";
    }
  };
})();
window.idModifier=idModifier; window.idGarderCroquisParam=idGarderCroquisParam; window.idDesign=idDesign;
