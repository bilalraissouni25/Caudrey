"use strict";
/* ===== Visuels générés dans l'app (cartes patrons, swatches matières, mannequin) ===== */
function garmentFlat(type){
  var f='rgba(255,255,255,0.94)', s='rgba(70,55,62,0.35)';
  var P={
    robe:'<path d="M44 14 L76 14 L84 40 L98 112 L22 112 L36 40 Z" fill="'+f+'" stroke="'+s+'" stroke-width="2"/>',
    jupe:'<path d="M40 28 L80 28 L96 110 L24 110 Z" fill="'+f+'" stroke="'+s+'" stroke-width="2"/><rect x="40" y="22" width="40" height="8" rx="2" fill="'+f+'" stroke="'+s+'" stroke-width="2"/>',
    top:'<path d="M42 22 L78 22 L92 36 L84 52 L82 100 L38 100 L36 52 L28 36 Z" fill="'+f+'" stroke="'+s+'" stroke-width="2"/>',
    pantalon:'<path d="M40 18 L80 18 L78 110 L64 110 L60 56 L54 110 L40 110 Z" fill="'+f+'" stroke="'+s+'" stroke-width="2"/>',
    manteau:'<path d="M42 16 L78 16 L90 40 L86 110 L34 110 L30 40 Z" fill="'+f+'" stroke="'+s+'" stroke-width="2"/><line x1="60" y1="20" x2="60" y2="106" stroke="'+s+'" stroke-width="2"/>',
    accessoire:'<path d="M38 40 L82 40 L88 104 L32 104 Z" fill="'+f+'" stroke="'+s+'" stroke-width="2"/><path d="M48 40 Q48 24 60 24 Q72 24 72 40" fill="none" stroke="'+s+'" stroke-width="3"/>',
    enfant:'<path d="M46 22 L74 22 L80 40 L88 96 L32 96 L40 40 Z" fill="'+f+'" stroke="'+s+'" stroke-width="2"/>'
  };
  var shape=P[type]||'<path d="M30 36 L60 18 L90 36" fill="none" stroke="'+f+'" stroke-width="4"/><circle cx="60" cy="14" r="5" fill="none" stroke="'+f+'" stroke-width="3"/>';
  return '<svg width="100%" height="120" viewBox="0 0 120 124" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">'+shape+'</svg>';
}
function fabricSwatch(f){
  var baseByU={robe:"#e7d8c2",structure:"#d2c4b0",maille:"#ddd2c2",bas:"#bcab94",manteau:"#aaa1b1",accessoire:"#ccba98"};
  var base="#dcd0bf"; (f.u||[]).some(function(u){ if(baseByU[u]){base=baseByU[u];return true;} return false; });
  var tex="";
  if(f.d==="Structuré"){tex='<g stroke="rgba(70,55,62,0.22)" stroke-width="2">';for(var i=-40;i<160;i+=9)tex+='<line x1="'+i+'" y1="0" x2="'+(i+40)+'" y2="70"/>';tex+='</g>';}
  else if(f.d==="Fluide"){tex='<rect width="160" height="70" fill="url(#sh)"/>';}
  else {tex='<g stroke="rgba(70,55,62,0.12)" stroke-width="1.5">';for(var j=0;j<70;j+=7)tex+='<line x1="0" y1="'+j+'" x2="160" y2="'+j+'"/>';tex+='</g>';}
  if(f.s==="Oui"){tex+='<g stroke="rgba(255,255,255,0.4)" stroke-width="1.5">';for(var k=4;k<160;k+=10)tex+='<path d="M'+k+' 0 q4 8 0 16 q-4 8 0 16 q4 8 0 16 q-4 8 0 22" fill="none"/>';tex+='</g>';}
  return '<div style="border-radius:8px 8px 0 0;overflow:hidden;margin:-14px -14px 12px;"><svg width="100%" height="70" viewBox="0 0 160 70" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="rgba(255,255,255,0.55)"/><stop offset="0.5" stop-color="rgba(255,255,255,0)"/><stop offset="1" stop-color="rgba(70,55,62,0.18)"/></linearGradient></defs><rect width="160" height="70" fill="'+base+'"/>'+tex+'</svg></div>';
}
function mannequinSVG(){
  var s='#9a8f86';
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 320">'+
    '<circle cx="60" cy="26" r="16" fill="none" stroke="'+s+'" stroke-width="3"/>'+
    '<line x1="60" y1="42" x2="60" y2="58" stroke="'+s+'" stroke-width="3"/>'+
    '<path d="M40 58 Q60 50 80 58 L86 150 L70 158 L70 300 L50 300 L50 158 L34 150 Z" fill="none" stroke="'+s+'" stroke-width="3"/>'+
    '<path d="M40 60 L18 140" fill="none" stroke="'+s+'" stroke-width="3"/>'+
    '<path d="M80 60 L102 140" fill="none" stroke="'+s+'" stroke-width="3"/>'+
    '</svg>';
}
