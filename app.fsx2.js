"use strict";
/* ===== Exemples FreeSewing (showcase) : cartes photo défilantes + carrousel + doc + style ===== */
var FSEXAMPLES={
  teagan:["two-tone-teagan","teagans-for-swimming","teagan-karen","teagan-by-karen","teagan-by-daryl","stripey-teagan"],
  aaron:["yoga-set-by-paul","tight-aaron","formal-aaron","floral-aaron","aaron-dress-by-ts","aaron-by-joost"],
  sven:["sven-nr3","sven-nr2","sven-nr1","ricos-sven","grey-sven","french-terry-sven"],
  hugo:["nani-hugo","husband-hugo","hugo-with-cats","hugo-saul","hugo-by-lainey","black-hugo"],
  wahid:["woolen-wahid","wahid-kaena","wahid-jeroen","wahid-in-dark-green","green-wahid","floral-wahid"],
  simon:["yellow-button-simon","wonder-woman-simon","speckles-simon","simon-white-stripe","simon-shirt-by-solstice","blue-simon"],
  sandy:["sandy-by-sunshine","sandy-by-karin","sandy-by-jv","sandy-by-anneke","sandy-by-adam","a-wearable-sandy-muslin"],
  breanna:["magicantace-breanna-sandy","breanna-dress-by-andrea-cretu"],
  shin:["more-shin-swim-shorts","mini-shin-swim-trunks","meine-erste-badehose","just-peachy-shin-bee","comixminx-shins"],
  simone:[],hortensia:[],holmes:[]
};
var FSNOTES={
  teagan:"Le t-shirt fétiche de Joost : moins classique qu'un t-shirt en T, un peu plus ajusté, manches plus étroites et encolure légèrement bateau.",
  sven:"Conçu parce que Joost a toujours froid : un sweat tout simple, variation légère du bloc Brian.",
  hugo:"Premier essai de manches raglan : un sweat à capuche avec poche kangourou optionnelle.",
  wahid:"Joost aime les gilets : chauds, élégants, et ils évitent de repasser autant de chemises.",
  sandy:"Première création d'Erica : une jupe cercle automatisée, avec ceinture courbe optionnelle.",
  simon:"L'un des designs les plus connus de FreeSewing : une chemise paramétrique avec énormément d'options, souvent utilisée comme bloc de base.",
  shin:"Joost avait besoin d'un short de bain, alors il a dessiné Shin."
};
function fsImgUrl(s){return "https://cdn.freesewing.eu/showcase/"+s+"/main.webp";}

/* ----- Carte bibliothèque : photo réelle qui défile ----- */
function fsCardTop(slug){
  var imgs=FSEXAMPLES[slug]; if(!imgs||!imgs.length)return null;
  return '<div class="top" data-fs="'+slug+'" data-fsimgs="'+imgs.join(",")+'" style="background:#e9e1d6;background-image:url(\''+fsImgUrl(imgs[0])+'\');background-size:cover;background-position:center;"></div>';
}
function startCardRotators(){
  if(window._fsRot)window._fsRot.forEach(function(iv){clearInterval(iv);}); window._fsRot=[];
  var nodes=document.querySelectorAll('#patList [data-fsimgs]');
  Array.prototype.forEach.call(nodes,function(n){
    n.innerHTML="";
    var slugs=(n.getAttribute("data-fsimgs")||"").split(",").filter(Boolean);
    if(slugs.length<2)return;
    var i=0;
    var iv=setInterval(function(){
      if(!document.body.contains(n)){clearInterval(iv);return;}
      i=(i+1)%slugs.length; n.style.backgroundImage="url('"+fsImgUrl(slugs[i])+"')";
    },2800);
    window._fsRot.push(iv);
  });
}

/* ----- Carrousel page patron (défilement auto) ----- */
function fsExamplesHtml(slug){
  var ex=FSEXAMPLES[slug]; if(!ex||!ex.length)return "";
  var slides=ex.map(function(s){
    return '<a href="https://freesewing.eu/showcase/'+s+'/" target="_blank" rel="noopener" style="flex:0 0 auto;width:240px;scroll-snap-align:start;border-radius:12px;overflow:hidden;border:1px solid var(--line);background:var(--surface2);text-decoration:none;">'+
      '<img src="'+fsImgUrl(s)+'" loading="lazy" referrerpolicy="no-referrer" style="width:240px;height:210px;object-fit:cover;display:block;" onerror="var a=this.parentNode;if(a)a.style.display=&#39;none&#39;"></a>';
  }).join("");
  return '<div class="card" style="margin-bottom:16px;">'+
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">'+
      '<div style="font-size:12px;color:var(--muted);font-weight:500;letter-spacing:.3px;text-transform:uppercase;">Exemples cousus par la communaute</div>'+
      '<div style="display:flex;gap:6px;"><button class="btn ghost sm" onclick="fsCarousel(this,-1)">&#8249;</button><button class="btn ghost sm" onclick="fsCarousel(this,1)">&#8250;</button></div>'+
    '</div>'+
    '<div data-fscar style="display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;scroll-behavior:smooth;padding-bottom:6px;">'+slides+'</div>'+
    '<div class="muted" style="font-size:12px;margin-top:8px;">Photos FreeSewing (showcase, licence ouverte) - clique une image pour voir le projet.</div></div>';
}
function fsCarousel(btn,dir){ var card=btn.closest(".card"); var sc=card?card.querySelector("[data-fscar]"):null; if(sc)sc.scrollBy({left:dir*260,behavior:"smooth"}); }
function fsStartAutoCarousel(){
  if(window._fsCarIv)clearInterval(window._fsCarIv);
  var el=document.querySelector('#patternpage [data-fscar]'); if(!el)return;
  window._fsCarIv=setInterval(function(){
    if(!document.body.contains(el)){clearInterval(window._fsCarIv);return;}
    var max=el.scrollWidth-el.clientWidth;
    if(el.scrollLeft>=max-4)el.scrollTo({left:0,behavior:"smooth"}); else el.scrollBy({left:260,behavior:"smooth"});
  },3500);
  el.addEventListener("mouseenter",function(){clearInterval(window._fsCarIv);});
}

/* ----- Documentation + précision du patron ----- */
function fsDocHtml(slug){
  function lbl(t){return '<div style="font-size:12px;color:var(--muted);font-weight:500;letter-spacing:.3px;text-transform:uppercase;margin-bottom:6px;">'+t+'</div>';}
  var b="https://freesewing.eu/docs/designs/"+slug;
  var notes=FSNOTES[slug]?('<div style="margin-bottom:16px;">'+lbl("Notes du créateur")+'<div style="font-size:14px;line-height:1.6;">'+esc(FSNOTES[slug])+'</div></div>'):"";
  var docs='<div style="margin-bottom:16px;">'+lbl("Documentation complète (FreeSewing)")+
    '<div style="display:flex;flex-wrap:wrap;gap:8px;">'+
    '<a class="btn ghost sm" href="'+b+'/#needs" target="_blank" rel="noopener">Ce qu\'il te faut</a>'+
    '<a class="btn ghost sm" href="'+b+'/#fabric" target="_blank" rel="noopener">Choix du tissu</a>'+
    '<a class="btn ghost sm" href="'+b+'/#cutting" target="_blank" rel="noopener">Découpe</a>'+
    '<a class="btn ghost sm" href="'+b+'/instructions/" target="_blank" rel="noopener">Instructions de couture</a>'+
    '<a class="btn ghost sm" href="'+b+'/options/" target="_blank" rel="noopener">Options du patron</a>'+
    '</div></div>';
  var prec='<div>'+lbl("Précision du patron & impression")+
    '<ul style="font-size:13.5px;line-height:1.7;margin:0;padding-left:18px;color:var(--ink);">'+
    '<li>Patron tracé à l\'échelle réelle à partir de tes mesures (profil) + base taille 38.</li>'+
    '<li>À l\'impression : règle sur <b>100 %</b> (désactive « ajuster à la page ») et vérifie l\'échelle.</li>'+
    '<li>Les <b>marges de couture ne sont pas incluses</b> par défaut : ajoute ~1 cm au moment de couper.</li>'+
    '<li>Plus tes mesures sont précises, plus le tombé sera juste.</li>'+
    '</ul></div>';
  return '<div class="card" style="margin-bottom:16px;">'+notes+docs+prec+'</div>';
}

/* ----- Style du SVG (sinon pièces noires) ----- */
function styleFsSvg(svg){
  if(!svg||svg.indexOf("<svg")<0)return svg;
  var css='<style>path{fill:none;stroke:#2e2a28;stroke-width:1.1;vector-effect:non-scaling-stroke}'+
    'text{fill:#2e2a28;stroke:none;font-family:Helvetica,Arial,sans-serif;font-size:10px}'+
    '.fabric,.lining,.canvas,.interfacing,.various,.mark,.contrast{fill:none}'+
    'circle{fill:#9c5d7c;stroke:none}rect{fill:none}</style>';
  return svg.replace(/(<svg[^>]*>)/, "$1"+css);
}
