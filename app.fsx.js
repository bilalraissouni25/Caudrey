"use strict";
/* ===== Exemples cousus (FreeSewing showcase, licence ouverte) + utilitaires ===== */
/* Images: https://cdn.freesewing.eu/showcase/<slug>/main.webp */
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
function fsExamplesHtml(slug){
  var ex=FSEXAMPLES[slug]; if(!ex||!ex.length)return "";
  var slides=ex.map(function(s){
    var u="https://cdn.freesewing.eu/showcase/"+s+"/main.webp";
    return '<a href="https://freesewing.eu/showcase/'+s+'/" target="_blank" rel="noopener" style="flex:0 0 auto;width:240px;scroll-snap-align:start;border-radius:12px;overflow:hidden;border:1px solid var(--line);background:var(--surface2);text-decoration:none;">'+
      '<img src="'+u+'" loading="lazy" referrerpolicy="no-referrer" style="width:240px;height:210px;object-fit:cover;display:block;" onerror="var a=this.parentNode;if(a)a.style.display=&#39;none&#39;"></a>';
  }).join("");
  return '<div class="card" style="margin-bottom:16px;">'+
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">'+
      '<div style="font-size:12px;color:var(--muted);font-weight:500;letter-spacing:.3px;text-transform:uppercase;">Exemples cousus par la communaute</div>'+
      '<div style="display:flex;gap:6px;"><button class="btn ghost sm" onclick="fsCarousel(this,-1)">&#8249;</button><button class="btn ghost sm" onclick="fsCarousel(this,1)">&#8250;</button></div>'+
    '</div>'+
    '<div data-fscar style="display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;scroll-behavior:smooth;padding-bottom:6px;">'+slides+'</div>'+
    '<div class="muted" style="font-size:12px;margin-top:8px;">Photos FreeSewing (showcase, licence ouverte) - clique une image pour voir le projet.</div></div>';
}
function fsCarousel(btn,dir){
  var card=btn.closest(".card"); var sc=card?card.querySelector("[data-fscar]"):null;
  if(sc)sc.scrollBy({left:dir*260,behavior:"smooth"});
}
function styleFsSvg(svg){
  if(!svg||svg.indexOf("<svg")<0)return svg;
  var css='<style>path{fill:none;stroke:#2e2a28;stroke-width:1.1;vector-effect:non-scaling-stroke}'+
    'text{fill:#2e2a28;stroke:none;font-family:Helvetica,Arial,sans-serif;font-size:10px}'+
    '.fabric,.lining,.canvas,.interfacing,.various,.mark,.contrast{fill:none}'+
    'circle{fill:#9c5d7c;stroke:none}rect{fill:none}</style>';
  return svg.replace(/(<svg[^>]*>)/, "$1"+css);
}
