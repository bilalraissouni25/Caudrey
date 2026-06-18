"use strict";
/* ===== Exemples cousus par la communauté FreeSewing (showcase, licence ouverte) ===== */
/* Images: https://cdn.freesewing.eu/showcase/<slug>/main.webp  — hotlink avec attribution */
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
  simone:[],
  hortensia:[],
  holmes:[]
};
function fsExamplesHtml(slug){
  var ex=FSEXAMPLES[slug]; if(!ex||!ex.length)return "";
  var imgs=ex.map(function(s){
    var u="https://cdn.freesewing.eu/showcase/"+s+"/main.webp";
    return '<a href="https://freesewing.eu/showcase/'+s+'/" target="_blank" rel="noopener" style="display:block;border-radius:10px;overflow:hidden;border:1px solid var(--line);background:var(--surface2);"><img src="'+u+'" loading="lazy" style="width:100%;height:150px;object-fit:cover;display:block;" onerror="this.parentNode.style.display=\'none\'"></a>';
  }).join("");
  return '<div class="card" style="margin-bottom:16px;"><div style="font-size:12px;color:var(--muted);font-weight:500;letter-spacing:.3px;text-transform:uppercase;margin-bottom:10px;">Exemples cousus par la communauté</div>'+
    '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;">'+imgs+'</div>'+
    '<div class="muted" style="font-size:12px;margin-top:10px;">Photos hébergées par FreeSewing (showcase, sous licence ouverte). Clique une image pour voir le détail du projet.</div></div>';
}
