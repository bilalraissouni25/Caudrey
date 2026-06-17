"use strict";
/* ===== Patron sur mesure FreeSewing (open-source, importé via CDN ESM) ===== */
function fsMeasure(){
  var m=(state.profil&&state.profil.mesures)||{};
  function cm(v,def){return Math.round((v!=null?v:def)*10);} /* cm -> mm */
  return {
    ankle:240,biceps:320,chest:cm(m.poitrine,94),crossSeam:760,crossSeamFront:360,head:560,heel:360,
    highBust:cm(m.poitrine,90),hips:cm(m.hanches,100),hpsToBust:290,hpsToWaistBack:cm(m.dos,43),hpsToWaistFront:460,
    inseam:760,knee:400,neck:380,seat:cm(m.hanches,100),seatBack:510,shoulderToElbow:360,shoulderToShoulder:400,
    shoulderToWrist:580,waist:cm(m.taille,76),waistBack:cm(m.taille,76),waistToFloor:1050,waistToHips:120,
    waistToKnee:cm(m.genou,58),waistToSeat:250,waistToUpperLeg:280,wrist:cm(m.poignet,16.5),upperLeg:580
  };
}
function fsGenerate(){
  var name=$("fsDesign").value, st=$("fsStatus"), out=$("fsOut");
  out.innerHTML=""; st.innerHTML='<span class="spin"></span> Chargement du moteur FreeSewing (open-source)…';
  import("https://esm.sh/@freesewing/"+name).then(function(mod){
    var Cap=name.charAt(0).toUpperCase()+name.slice(1);
    var Design=mod[Cap]||mod["default"]||mod[name];
    if(!Design)throw "modèle introuvable";
    var pattern=new Design({measurements:fsMeasure()});
    pattern.draft();
    var svg=pattern.render();
    if(!svg||svg.indexOf("<svg")<0)throw "rendu vide";
    window._fsSvg=svg;
    out.innerHTML='<div style="padding:10px;overflow:auto;max-height:520px;background:#fff;border-radius:10px;">'+svg+'</div>';
    st.innerHTML='Patron généré à partir de tes mesures. <button class="btn ghost sm" onclick="fsPrint()">Ouvrir / imprimer</button> <button class="btn ghost sm" onclick="fsToCarnet(\''+name+'\')">+ carnet</button>';
  }).catch(function(e){
    st.innerHTML='Génération impossible dans l\'app pour l\'instant ('+esc(String(e).slice(0,80))+'). Tu peux générer ce patron sur le site officiel : <a href="https://freesewing.org/designs/'+name+'/" target="_blank" rel="noopener">freesewing.org/designs/'+name+'</a>';
  });
}
function fsPrint(){ if(!window._fsSvg)return; var w=window.open("","_blank"); if(!w){toast("Autorise les pop-ups pour imprimer");return;} w.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Mon patron</title></head><body style="margin:0;padding:12px;">'+window._fsSvg+'</body></html>'); w.document.close(); setTimeout(function(){try{w.print();}catch(e){}},500); }
function fsToCarnet(name){ if(typeof state==="undefined")return; state.projets.unshift({id:uid(),name:"Patron "+name+" (FreeSewing, sur mesure)",piece:"Patron",diff:"Intermédiaire",stat:"envie",tissu:"",date:""}); save(); if(typeof renderProjets==="function"){renderProjets();renderCarnetStats();} toast("Ajouté au carnet"); }
