"use strict";
/* ===== Générateur de motifs seamless (p5.js) ===== */
var _mp=null, motifTile=null;
function motifReady(){ if(_mp)return true; if(!window.p5)return false; _mp=new p5(function(p){p.setup=function(){p.noCanvas();};}); return true; }
function motifToggle(){ var el=$("motifPanel"); if(!el)return; var show=(el.style.display==="none"||!el.style.display); el.style.display=show?"block":"none"; if(show){ if($("motifC2")&&state.palette&&state.palette[0])$("motifC2").value=state.palette[0]; motifGen(); } }
(function(){ var ds=$("motifDensity"); if(ds)ds.addEventListener("input",function(){$("motifDOut").textContent=this.value;motifGen();}); ["motifStyle","motifC1","motifC2"].forEach(function(id){var e=$(id);if(e)e.addEventListener("input",motifGen);}); })();
function motifGen(){
  if(!motifReady()){toast("Moteur de motifs en cours de chargement…");return;}
  var size=80, g=_mp.createGraphics(size,size);
  var c1=$("motifC1").value, c2=$("motifC2").value, d=parseFloat($("motifDensity").value)||5, style=$("motifStyle").value;
  g.background(c1); g.noStroke();
  drawMotif(g,style,c1,c2,d,size);
  if(motifTile&&motifTile.remove)motifTile.remove();
  motifTile=g;
  var pv=$("motifPreview"); if(pv){var x=pv.getContext("2d"); x.clearRect(0,0,120,120); try{var pat=x.createPattern(g.canvas||g.elt,"repeat"); x.fillStyle=pat; x.fillRect(0,0,120,120);}catch(e){}}
}
function drawMotif(g,style,c1,c2,d,s){
  g.push(); g.fill(c2);
  if(style==="pois"){var step=s/d;for(var y=step/2;y<s+step;y+=step)for(var x=step/2;x<s+step;x+=step){g.circle(x,y,step*0.42);}}
  else if(style==="rayures"){var w=s/d;for(var i=0;i<d;i+=2)g.rect(i*w,0,w,s);}
  else if(style==="chevrons"){g.noFill();g.stroke(c2);g.strokeWeight(Math.max(2,s/d*0.4));var step=s/d;for(var o=-s;o<s*2;o+=step*2){g.line(o,s,o+step,0);g.line(o+step,0,o+step*2,s);}}
  else if(style==="fleuri"){var step=s/Math.max(2,d-2);for(var y=step/2;y<s+step;y+=step)for(var x=step/2;x<s+step;x+=step){for(var k=0;k<5;k++){var a=k/5*6.283;g.circle(x+Math.cos(a)*step*0.18,y+Math.sin(a)*step*0.18,step*0.2);}g.fill("#ffd86b");g.circle(x,y,step*0.16);g.fill(c2);}}
  else if(style==="geo"){var step=s/d;for(var y=0;y<s;y+=step)for(var x=0;x<s;x+=step){g.triangle(x,y+step,x+step/2,y,x+step,y+step);}}
  else if(style==="organique"){var sc=Math.max(2,d);for(var y=0;y<s;y+=2)for(var x=0;x<s;x+=2){var n=_mp.noise(x/sc/4,y/sc/4);if(n>0.55)g.rect(x,y,2,2);}}
  else {for(var i=0;i<d*8;i++){g.fill(i%2?c2:"#ffd86b");g.circle(_mp.random(s),_mp.random(s),s*0.06);}}
  g.pop();
}
function motifSource(){ if(!motifTile)motifGen(); return motifTile?(motifTile.canvas||motifTile.elt):null; }
function motifPattern(){ var src=motifSource(); if(!src||!window.fabric)return null; return new fabric.Pattern({source:src,repeat:"repeat"}); }
function motifApplySel(){ if(typeof fc==="undefined"||!fc){toast("Ouvre le composeur");return;} var a=fc.getActiveObject(); if(!a){toast("Sélectionne un élément d'abord");return;} var pat=motifPattern(); if(!pat)return; (a._objects?a._objects:[a]).forEach(function(sub){if(sub.fill!=null&&sub.fill!=="none")sub.set("fill",pat);}); fc.requestRenderAll(); toast("Motif appliqué à la sélection"); }
function motifAddBg(){ if(typeof fc==="undefined"||!fc)return; var pat=motifPattern(); if(!pat)return; var r=new fabric.Rect({left:0,top:0,width:fc.width,height:fc.height,fill:pat}); fc.add(r); fc.sendToBack(r); fc.requestRenderAll(); toast("Fond motif ajouté"); }
