"use strict";
/* ===== Mes profils : plusieurs jeux de mesures (compat via miroir state.profil.mesures) ===== */
(function(){
  if(typeof state==="undefined")return;
  if(!Array.isArray(state.profils)){
    var m=(state.profil&&state.profil.mesures)||{};
    state.profils=[{id:uid(),name:"Moi",mesures:m}];
    state.profilActif=state.profils[0].id;
    if(!state.profil)state.profil={};
    state.profil.mesures=state.profils[0].mesures;
    if(!state.profil.styles)state.profil.styles=["bohème","naturel"];
    save();
  }
})();
var MESFIELDS=[["mTaille","taille"],["mPoitrine","poitrine"],["mHanches","hanches"],["mGenou","genou"],["mDos","dos"],["mPoignet","poignet"]];
function profilesAll(){return state.profils||[];}
function activeProfile(){var a=profilesAll().filter(function(p){return p.id==state.profilActif;})[0];return a||profilesAll()[0]||{mesures:{}};}
function activeMes(){return (activeProfile()||{}).mesures||{};}
function syncMirror(){if(state.profil)state.profil.mesures=activeMes();}
function setActiveProfile(id){state.profilActif=id;syncMirror();save();fillProfil();if(typeof renderPatronControls==="function")renderPatronControls();renderProfilesBar();}
function addProfile(){var n=prompt("Nom du nouveau profil (ex. Moi, Maman, Léa) :","");if(n===null)return;n=(n||"").trim()||("Profil "+(profilesAll().length+1));var pr={id:uid(),name:n,mesures:{}};state.profils.push(pr);state.profilActif=pr.id;syncMirror();save();renderProfilesBar();fillProfil();if(typeof renderPatronControls==="function")renderPatronControls();if(typeof toast==="function")toast("Profil créé : "+n);}
function renameProfile(){var a=activeProfile();if(!a)return;var n=prompt("Renommer ce profil :",a.name||"");if(n===null)return;a.name=(n||"").trim()||a.name;save();renderProfilesBar();}
function deleteProfile(){if(profilesAll().length<=1){if(typeof toast==="function")toast("Il faut au moins un profil");return;}var a=activeProfile();if(!confirm("Supprimer le profil « "+(a.name||"")+" » ?"))return;state.profils=state.profils.filter(function(p){return p.id!=a.id;});state.profilActif=state.profils[0].id;syncMirror();save();renderProfilesBar();fillProfil();if(typeof renderPatronControls==="function")renderPatronControls();}
function profilesOptions(){return profilesAll().map(function(p){return '<option value="'+p.id+'"'+(p.id==state.profilActif?" selected":"")+'>'+esc(p.name||"Profil")+'</option>';}).join("");}
function renderProfilesBar(){
  var host=document.getElementById("profilesBar"); if(!host)return;
  host.innerHTML='<div class="card" style="margin-bottom:16px;"><h3 style="font-size:16px;margin-bottom:12px;">Mes profils de mesures</h3>'+
    '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;">'+
    '<div style="min-width:200px;"><label class="fld">Profil actif</label><select id="profilSelect">'+profilesOptions()+'</select></div>'+
    '<div style="display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap;"><button class="btn ghost sm" onclick="addProfile()">+ Nouveau</button><button class="btn ghost sm" onclick="renameProfile()">Renommer</button><button class="btn ghost sm" onclick="deleteProfile()">Supprimer</button></div>'+
    '</div><p class="muted" style="font-size:13px;margin:12px 0 0;">Les mesures ci-dessous appartiennent au profil actif. Crée un profil par personne (toi, un proche, un enfant) ; tu choisiras lequel utiliser au moment de générer un patron.</p></div>';
  var sel=document.getElementById("profilSelect"); if(sel)sel.addEventListener("change",function(){setActiveProfile(this.value);});
}
function fillProfil(){
  var m=activeMes();
  MESFIELDS.forEach(function(pr){var e=document.getElementById(pr[0]);if(e)e.value=(m[pr[1]]!=null?m[pr[1]]:"");});
  if(typeof renderStyleChips==="function")renderStyleChips();
  renderProfilesBar();
}
function saveProfil(){
  var a=activeProfile(); if(!a)return; var m={};
  MESFIELDS.forEach(function(pr){var e=document.getElementById(pr[0]);if(e&&e.value!=="")m[pr[1]]=parseFloat(e.value);});
  a.mesures=m; syncMirror(); save();
  if(typeof renderPatronControls==="function")renderPatronControls();
  if(typeof toast==="function")toast("Mesures enregistrées pour « "+(a.name||"")+" »");
}
/* sélecteur de profil sur la page patron */
function patpProfileSelectHtml(){
  return '<div style="margin-bottom:12px;"><label class="fld">Profil utilisé pour ce patron</label><select onchange="patpSetProfile(this.value)" style="max-width:260px;">'+profilesOptions()+'</select></div>';
}
function patpSetProfile(id){ setActiveProfile(id); if(window._patpSlug&&typeof patGenerate==="function")patGenerate(window._patpSlug); }
(function(){ syncMirror(); if(document.getElementById("profilesBar")){renderProfilesBar();fillProfil();} })();
