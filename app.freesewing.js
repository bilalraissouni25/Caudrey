"use strict";
/* ===== Patron sur mesure FreeSewing (open-source) =====
   L'exécution du moteur dans le navigateur sans étape de build est trop fragile ;
   on ouvre donc le générateur officiel FreeSewing, qui produit un vrai patron PDF
   sur mesure gratuitement. Intégration in-app prévue plus tard (build dédié). */
var FS_LABEL={aaron:"Aaron — débardeur",teagan:"Teagan — t-shirt",sven:"Sven — sweat",hugo:"Hugo — sweat à capuche",holmes:"Holmes — cagoule"};
function fsGenerate(){
  var name=$("fsDesign").value, st=$("fsStatus"), out=$("fsOut");
  var url="https://freesewing.org/designs/"+name+"/";
  out.innerHTML="";
  st.innerHTML='Ouverture du générateur FreeSewing pour « '+esc(FS_LABEL[name]||name)+' »… '+
    '<a href="'+url+'" target="_blank" rel="noopener">ouvrir manuellement</a> &middot; '+
    '<button class="btn ghost sm" onclick="fsToCarnet(\''+name+'\')">+ carnet</button>';
  out.innerHTML='<div class="muted" style="font-size:13px;line-height:1.6;">Sur la page FreeSewing : entre tes mesures (ou utilise une taille type), ajuste les options, puis télécharge le <b>patron PDF sur mesure</b> — gratuit et open-source. Tes mesures du profil : '+fsMeasureText()+'.</div>';
  try{window.open(url,"_blank","noopener");}catch(e){}
}
function fsMeasureText(){
  var m=(state.profil&&state.profil.mesures)||{};
  var p=[];
  if(m.poitrine)p.push("poitrine "+m.poitrine);
  if(m.taille)p.push("taille "+m.taille);
  if(m.hanches)p.push("hanches "+m.hanches);
  return p.length?p.join(", ")+" cm":"à renseigner dans l'onglet Profil";
}
function fsToCarnet(name){
  if(typeof state==="undefined")return;
  state.projets.unshift({id:uid(),name:"Patron "+(FS_LABEL[name]||name)+" (FreeSewing)",piece:"Patron sur mesure",diff:"Intermédiaire",stat:"envie",tissu:"",date:""});
  save();
  if(typeof renderProjets==="function"){renderProjets();renderCarnetStats();}
  toast("Ajouté au carnet");
}
