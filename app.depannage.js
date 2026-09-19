"use strict";
/* ===== Dépannage machine =====
 * Le moment où une débutante abandonne : la machine fait un nid de fils, l'aiguille casse,
 * le tissu n'avance plus. Ici, un symptôme → les causes dans l'ordre où elles arrivent le
 * plus souvent → une vérification à la fois, avec « C'est réglé » / « Toujours pas ».
 * Onglet « Dépannage » de la page Techniques.
 */
var DEP=[
 {id:"nid", t:"Un nid de fils sous le tissu", s:"des boucles emmêlées dessous, la machine bloque", causes:[
   {c:"Le fil du dessus n'est pas bien engagé dans la tension", f:"C'est la cause n°1. Relève le pied presseur (ça ouvre les disques de tension), mets l'aiguille en position haute avec le volant, et réenfile tout le fil du dessus en suivant les numéros, releveur de fil compris."},
   {c:"Tu démarres sans tenir les fils", f:"Pour les 2 ou 3 premiers points, tiens les deux fils (dessus et canette) vers l'arrière de la machine, puis lâche."},
   {c:"La canette est posée à l'envers", f:"Retire-la et regarde le schéma sur la machine ou dans le manuel : le sens de déroulement du fil compte (souvent en « P » sur les canettes à plat)."},
   {c:"La tension du dessus est trop faible", f:"Remets la molette de tension sur la valeur standard (souvent 4), puis teste sur une chute pliée en deux."}]},
 {id:"casse-haut", t:"Le fil du dessus casse", s:"au bout de quelques points ou en pleine couture", causes:[
   {c:"L'enfilage a sauté une étape", f:"Pied presseur relevé, réenfile tout le fil du dessus depuis la bobine. Vérifie qu'il passe bien dans le releveur de fil (le crochet qui monte et descend)."},
   {c:"Le fil accroche sur la bobine", f:"Beaucoup de bobines ont une petite encoche où le fil se coince : tourne-la pour que l'encoche soit du côté opposé à la sortie du fil, ou ajoute le disque de maintien."},
   {c:"L'aiguille est abîmée ou trop fine pour le fil", f:"Change d'aiguille (une aiguille dure 6 à 8 h de couture). Fil épais ou à surpiquer : aiguille 90 ou 100."},
   {c:"La tension du dessus est trop forte", f:"Baisse d'un cran et teste sur une chute."},
   {c:"Le fil est vieux ou de mauvaise qualité", f:"Un fil qui peluche ou casse à la main casse aussi dans la machine : prends un polyester de marque."}]},
 {id:"sautes", t:"Des points sautés", s:"la couture a des trous, des points manquent", causes:[
   {c:"L'aiguille ne convient pas au tissu", f:"Sur jersey ou tissu extensible : aiguille jersey ou stretch (pointe arrondie). Sur jean : aiguille jeans."},
   {c:"L'aiguille est émoussée, tordue ou mal mise", f:"Mets une aiguille neuve, enfoncée jusqu'en butée, le côté plat du talon vers l'arrière (sur la plupart des machines domestiques), et serre la vis."},
   {c:"Le tissu remonte avec l'aiguille", f:"Tissu très souple : augmente la pression du pied s'il y a une molette, ou couds sur une feuille de papier de soie que tu déchireras après."},
   {c:"Le fil du dessus est mal enfilé", f:"Réenfile pied presseur relevé."}]},
 {id:"aiguille", t:"L'aiguille casse", s:"un claquement, l'aiguille est brisée", causes:[
   {c:"Tu as cousu sur une épingle", f:"Retire les épingles avant qu'elles arrivent sous le pied. Et vérifie qu'aucun morceau d'aiguille n'est resté dans la plaque."},
   {c:"Tu tires ou pousses le tissu", f:"La machine avance le tissu toute seule : guide-le seulement. Tirer tord l'aiguille, qui tape la plaque et casse."},
   {c:"L'aiguille est trop fine pour l'épaisseur", f:"Jean, toile, plusieurs épaisseurs : aiguille 90 à 100, et passe les grosses surépaisseurs en tournant le volant à la main."},
   {c:"Le pied ne convient pas au point", f:"Un zigzag large avec un pied pour point droit (trou rond) : l'aiguille tape le pied. Mets le pied universel."},
   {c:"L'aiguille était mal serrée", f:"Enfonce la nouvelle aiguille jusqu'en haut et serre bien la vis."}]},
 {id:"avance", t:"Le tissu n'avance pas", s:"les points se font au même endroit", causes:[
   {c:"Les griffes sont baissées", f:"Cherche un levier ou un bouton « griffes » (souvent derrière ou sous le bras libre) : il sert au quilting libre. Remonte-les."},
   {c:"La longueur de point est à 0", f:"Mets la longueur sur 2,5."},
   {c:"Le pied presseur n'est pas baissé", f:"Baisse le levier du pied avant de coudre (et c'est lui aussi qui serre la tension)."},
   {c:"Des peluches bloquent les griffes", f:"Débranche la machine, retire la plaque à aiguille, nettoie au pinceau entre les griffes. Pas de soufflette : elle enfonce la poussière."},
   {c:"Le départ est trop épais", f:"Sur une couture épaisse, place une cale (un morceau de tissu plié) sous l'arrière du pied pour qu'il soit à plat."}]},
 {id:"fronce", t:"La couture fronce ou gondole", s:"le tissu se plisse le long de la couture", causes:[
   {c:"La tension du dessus est trop forte", f:"Baisse d'un cran et teste sur une chute."},
   {c:"Le point est trop long pour un tissu fin", f:"Tissu fin : longueur 2 à 2,2. Et aiguille fine (70 ou 75)."},
   {c:"Le jersey a été étiré en cousant", f:"Ne tire pas le tissu, baisse un peu la pression du pied, utilise un point extensible. Un coup de vapeur rattrape souvent les petites ondulations.", tq:"point-extensible"},
   {c:"Le tissu est très fin et glissant", f:"Couds sur une bande de papier de soie, retire-la ensuite."}]},
 {id:"tension", t:"Le fil de canette se voit dessus", s:"les points ne sont pas équilibrés", causes:[
   {c:"La tension du dessus est trop forte", f:"Si c'est le fil de canette qui remonte sur le dessus, le fil du dessus tire trop : baisse la tension du dessus. Si à l'inverse le fil du dessus se voit dessous, monte-la."},
   {c:"La canette n'est pas passée dans son ressort", f:"Réinsère la canette et fais passer le fil dans la fente de tension du boîtier (tu dois sentir une légère résistance)."},
   {c:"Deux fils très différents dessus et dessous", f:"Utilise le même fil (ou du même poids) pour la bobine et la canette."}]},
 {id:"bruit", t:"La machine fait du bruit ou force", s:"elle tape, grince ou peine", causes:[
   {c:"Peluches sous la plaque et dans le crochet", f:"Débranche, retire la plaque et la canette, nettoie au pinceau. À faire après chaque projet."},
   {c:"Un bout de fil est coincé dans le crochet", f:"Retire la canette, tourne doucement le volant vers toi et retire le fil coincé avec une pince."},
   {c:"L'aiguille est tordue", f:"Change-la : une aiguille tordue tape la plaque à chaque point."},
   {c:"La machine demande de l'huile", f:"Seulement si le manuel l'indique, et avec de l'huile pour machine à coudre, une goutte aux points prévus."}]},
 {id:"bloque", t:"L'aiguille ne bouge pas", s:"le moteur tourne ou rien ne se passe", causes:[
   {c:"Le volant est débrayé (mode bobinage)", f:"Sur beaucoup de machines, on tire ou on tourne le centre du volant pour bobiner : remets-le en position couture."},
   {c:"Le bobineur est encore enclenché", f:"Repousse l'axe du bobineur vers la gauche."},
   {c:"La pédale ou le cordon est mal branché", f:"Vérifie les deux prises et l'interrupteur."},
   {c:"Le levier de boutonnière est baissé", f:"Remonte-le si tu ne fais pas de boutonnière."}]},
 {id:"canette", t:"Le fil de canette ne remonte pas", s:"impossible de faire sortir le fil du dessous", causes:[
   {c:"La canette est vide ou mal posée", f:"Vérifie qu'il reste du fil et qu'elle tourne dans le bon sens."},
   {c:"Le fil du dessus n'est pas enfilé dans l'aiguille", f:"Tiens le fil du dessus, tourne le volant vers toi d'un tour complet : l'aiguille va chercher le fil de canette et le remonte en boucle."},
   {c:"L'aiguille est montée à l'envers", f:"Côté plat du talon vers l'arrière (sur la plupart des machines), enfoncée jusqu'en haut."}]}
];

var DP={sym:null, i:0};
function depRender(){
  var box=document.getElementById("depBox"); if(!box)return;
  if(!DP.sym){
    box.innerHTML='<p class="muted" style="font-size:13.5px;margin:0 0 12px;">Qu\'est-ce qui se passe ? On regarde les causes une par une, de la plus fréquente à la plus rare.</p>'+
      '<div class="dp-grid">'+DEP.map(function(d){
        return '<button class="dp-sym" onclick="depChoisir(\''+d.id+'\')"><b>'+esc(d.t)+'</b><span>'+esc(d.s)+'</span></button>';
      }).join("")+'</div>'+
      '<div class="tq-tip" style="margin-top:14px;"><b>Le réflexe qui règle la moitié des problèmes</b> Réenfiler entièrement, pied presseur relevé, et changer l\'aiguille. Ça prend deux minutes.</div>';
    return;
  }
  var d=DEP.filter(function(x){return x.id===DP.sym;})[0];
  var c=d.causes[DP.i];
  if(!c){
    box.innerHTML='<div class="card dp-fin"><h3>On a tout vérifié</h3><p class="muted" style="font-size:13.5px;line-height:1.55;">Si le problème persiste après toutes ces vérifications, la machine a sans doute besoin d\'un réglage en atelier (synchronisation du crochet, tension de canette). Note ce qui se passe exactement et quand : le réparateur ira plus vite.</p>'+
      '<button class="btn ghost" onclick="depRetour()">Autre problème</button></div>';
    return;
  }
  box.innerHTML='<button class="btn ghost sm" onclick="depRetour()">‹ Tous les problèmes</button>'+
    '<div class="card dp-etape">'+
      '<div class="tq-cat">'+esc(d.t)+' · piste '+(DP.i+1)+' sur '+d.causes.length+'</div>'+
      '<div class="dp-prog">'+d.causes.map(function(_,k){ return '<i class="'+(k<DP.i?"ok":(k===DP.i?"now":""))+'"></i>'; }).join("")+'</div>'+
      '<h3>'+esc(c.c)+'</h3><p>'+esc(c.f)+'</p>'+
      (c.tq?'<p><a href="#" class="tq-lk" onclick="techOpen(\''+c.tq+'\');return false;">Voir la fiche technique</a></p>':'')+
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">'+
        '<button class="btn" onclick="depRegle()">C\'est réglé</button>'+
        '<button class="btn ghost" onclick="DP.i++;depRender()">Toujours pas</button></div>'+
    '</div>';
}
function depChoisir(id){ DP.sym=id; DP.i=0; depRender(); }
function depRetour(){ DP.sym=null; DP.i=0; depRender(); }
function depRegle(){
  var d=DEP.filter(function(x){return x.id===DP.sym;})[0], c=d.causes[DP.i];
  if(typeof state!=="undefined"){
    if(!state.depannages)state.depannages=[];
    state.depannages.unshift({date:new Date().toISOString().slice(0,10), probleme:d.t, cause:c.c});
    state.depannages=state.depannages.slice(0,30); save();
  }
  toast("Bien joué ! C'était : "+c.c.toLowerCase());
  depRetour();
}

/* un onglet dans la page Techniques */
document.addEventListener("DOMContentLoaded",function(){
  var sec=document.getElementById("techniques"); if(!sec||document.getElementById("depBox"))return;
  var head=sec.querySelector(".vhead");
  var sw=document.createElement("div"); sw.className="seg"; sw.id="tqMode"; sw.style.margin="0 0 14px";
  sw.innerHTML='<button class="on" data-m="tech">Techniques</button><button data-m="dep">Ma machine fait des siennes</button>';
  head.parentNode.insertBefore(sw,head.nextSibling);
  var dep=document.createElement("div"); dep.id="depBox"; dep.hidden=true;
  sec.appendChild(dep);
  var autres=[].slice.call(sec.children).filter(function(n){ return n!==head&&n!==sw&&n!==dep; });
  sw.querySelectorAll("button").forEach(function(b){
    b.addEventListener("click",function(){
      sw.querySelectorAll("button").forEach(function(n){ n.classList.toggle("on",n===b); });
      var d=b.dataset.m==="dep";
      dep.hidden=!d; autres.forEach(function(n){ n.style.display=d?"none":""; });
      if(d)depRender();
    });
  });
});
window.depChoisir=depChoisir; window.depRetour=depRetour; window.depRegle=depRegle; window.depRender=depRender; window.DP=DP;

/* depuis le mode Atelier : un accès direct, là où le problème arrive */
function depOuvrir(){
  goView("techniques");
  var b=document.querySelector('#tqMode button[data-m="dep"]'); if(b)b.click();
}
(function(){
  var base=window.atelierRender;
  if(typeof base!=="function")return;
  window.atelierRender=function(){
    var r=base.apply(this,arguments);
    try{
      var v=document.getElementById("atelier");
      if(v&&!v.querySelector(".dp-lien")){
        var a=document.createElement("div"); a.className="dp-lien";
        a.innerHTML='La machine fait des siennes ? <a href="#" onclick="depOuvrir();return false;">Dépannage pas à pas</a>';
        v.appendChild(a);
      }
    }catch(e){}
    return r;
  };
})();
window.depOuvrir=depOuvrir;
