"use strict";
/* ===== Patron sur mesure FreeSewing — généré DANS l'app (bundle app.fs.bundle.js) ===== */
var FS_LABEL={teagan:"Teagan — t-shirt",aaron:"Aaron — débardeur"};
function fsMeasure(){
  /* surcharges en mm depuis le profil (cm -> mm) ; le reste vient d'une base taille 38 */
  var m=(state.profil&&state.profil.mesures)||{}, o={};
  if(m.poitrine)o.chest=Math.round(m.poitrine*10);
  if(m.taille)o.waist=Math.round(m.taille*10);
  if(m.hanches){o.hips=Math.round(m.hanches*10);o.seat=Math.round(m.hanches*10);}
  if(m.dos)o.hpsToWaistBack=Math.round(m.dos*10);
  if(m.genou)o.waistToKnee=Math.round(m.genou*10);
  if(m.poignet)o.wrist=Math.round(m.poignet*10);
  return o;
}
function fsGenerate(){
  var name=$("fsDesign").value, st=$("fsStatus"), out=$("fsOut");
  out.innerHTML="";
  if(!window.FS||typeof window.FS.draft!=="function"){ st.innerHTML="Moteur FreeSewing non chargé. Recharge la page (en ligne) puis réessaie."; return; }
  st.innerHTML='<span class="spin"></span> Génération de ton patron sur mesure…';
  setTimeout(function(){
    try{
      var svg=window.FS.draft(name, fsMeasure());
      if(!svg||svg.indexOf("<svg")<0)throw new Error("rendu vide");
      window._fsSvg=svg;
      out.innerHTML='<div style="padding:10px;overflow:auto;max-height:560px;background:#fff;border-radius:10px;border:1px solid var(--line);">'+svg+'</div>';
      st.innerHTML='Patron « '+esc(FS_LABEL[name]||name)+' » généré à partir de tes mesures. <button class="btn ghost sm" onclick="fsPrint()">Imprimer</button> <button class="btn ghost sm" onclick="fsToCarnet(\''+name+'\')">+ carnet</button>';
    }catch(e){
      st.innerHTML='Erreur de génération : '+esc(String((e&&e.message)||e).slice(0,120));
    }
  },40);
}
function fsPrint(){
  if(!window._fsSvg)return;
  var w=window.open("","_blank");
  if(!w){toast("Autorise les pop-ups pour imprimer");return;}
  w.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Mon patron FreeSewing</title><style>@page{margin:8mm}body{margin:0}</style></head><body>'+window._fsSvg+'</body></html>');
  w.document.close();
  setTimeout(function(){try{w.print();}catch(e){}},500);
}
function fsToCarnet(name){
  if(typeof state==="undefined")return;
  state.projets.unshift({id:uid(),name:"Patron "+(FS_LABEL[name]||name)+" (FreeSewing, sur mesure)",piece:"Patron sur mesure",diff:"Intermédiaire",stat:"envie",tissu:"",date:""});
  save();
  if(typeof renderProjets==="function"){renderProjets();renderCarnetStats();}
  toast("Ajouté au carnet");
}
