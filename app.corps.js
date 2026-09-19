"use strict";
/* ===== La silhouette, construite sur ses mesures =====
 * Une même unité que les patrons : 1 unité SVG = 1 mm. Le corps se superpose donc
 * au dessin technique sans mise à l'échelle, et on voit vraiment où tombe le vêtement.
 * Tout est déduit des mesures du profil ; ce qui manque est estimé à partir du reste,
 * jamais inventé au hasard.
 */

/* largeur de face ≈ circonférence / 5.8 pour une demi-largeur (section elliptique) */
function corpsDemi(circ){ return circ/5.8; }

function corpsMesures(){
  var m={};
  try{ if(typeof mesMesurees==="function")m=mesMesurees(); }catch(e){}
  var base={};
  try{ if(window.FS&&FS.base&&typeof mesBase==="function"){ var b=mesBase(); base=FS.base(b.size,b.who)||{}; } }catch(e){}
  function v(k,d){ var x=(m[k]!=null&&!isNaN(m[k]))?m[k]:base[k]; return (x!=null&&!isNaN(x))?x:d; }

  var chest=v("chest",900), waist=v("waist",750), hips=v("hips",v("seat",980));
  var o={
    chest:chest, waist:waist, hips:hips,
    neck:v("neck",360),
    epaules:v("shoulderToShoulder", corpsDemi(chest)*2*1.04),
    yWaist:v("hpsToWaistBack",410),
    waistToHips:v("waistToHips",200),
    waistToKnee:v("waistToKnee",600),
    waistToFloor:v("waistToFloor",1060),
    biceps:v("biceps",300), wrist:v("wrist",160),
    bras:v("shoulderToWrist",520)
  };
  o.yHip=o.yWaist+o.waistToHips;
  o.yKnee=o.yWaist+o.waistToKnee;
  o.yFloor=o.yWaist+o.waistToFloor;
  o.yBust=o.yWaist*0.52;
  o.reelles=Object.keys(m).filter(function(k){ return m[k]!=null&&!isNaN(m[k]); }).length;
  return o;
}

/* le contour du buste et des jambes, moitié droite (x ≥ 0, y = 0 au creux du cou) */
function corpsDemiPath(M){
  var nc=corpsDemi(M.neck)*0.9,
      ep=M.epaules/2,
      po=corpsDemi(M.chest),
      ta=corpsDemi(M.waist),
      ha=corpsDemi(M.hips),
      yEp=M.yWaist*0.10,
      yEnt=M.yBust,
      yEnf=M.yHip+(M.yFloor-M.yHip)*0.16,
      genou=ha*0.52, cheville=ha*0.33,
      yG=M.yKnee, yS=M.yFloor;

  var d="M0 0"
    + " L"+nc.toFixed(1)+" 0"                                            /* base du cou */
    + " L"+ep.toFixed(1)+" "+yEp.toFixed(1)                              /* ligne d'épaule */
    + " Q"+(ep*1.02).toFixed(1)+" "+((yEp+yEnt)/2).toFixed(1)+" "+po.toFixed(1)+" "+yEnt.toFixed(1)
    + " Q"+(po*0.99).toFixed(1)+" "+(yEnt+(M.yWaist-yEnt)*0.55).toFixed(1)+" "+ta.toFixed(1)+" "+M.yWaist.toFixed(1)
    + " Q"+(ha*1.0).toFixed(1)+" "+(M.yWaist+(M.yHip-M.yWaist)*0.62).toFixed(1)+" "+ha.toFixed(1)+" "+M.yHip.toFixed(1)
    + " Q"+(ha*0.99).toFixed(1)+" "+(M.yHip+(yEnf-M.yHip)*0.7).toFixed(1)+" "+(ha*0.93).toFixed(1)+" "+yEnf.toFixed(1)
    + " Q"+(ha*0.72).toFixed(1)+" "+((yEnf+yG)/2).toFixed(1)+" "+genou.toFixed(1)+" "+yG.toFixed(1)
    + " Q"+(genou*0.82).toFixed(1)+" "+(yG+(yS-yG)*0.55).toFixed(1)+" "+cheville.toFixed(1)+" "+yS.toFixed(1)
    + " L"+(cheville*0.42).toFixed(1)+" "+yS.toFixed(1)                  /* intérieur de cheville */
    + " Q"+(genou*0.36).toFixed(1)+" "+(yG+(yS-yG)*0.5).toFixed(1)+" "+(genou*0.30).toFixed(1)+" "+yG.toFixed(1)
    + " Q"+(ha*0.20).toFixed(1)+" "+((yG+yEnf)/2).toFixed(1)+" 0 "+yEnf.toFixed(1);  /* entrejambe */
  return d;
}

/* le bras, dessiné à part : une silhouette de face n'a pas le bras collé au corps */
function corpsBras(M){
  var ep=M.epaules/2, yEp=M.yWaist*0.10;
  var b=corpsDemi(M.biceps)*0.9, p=corpsDemi(M.wrist)*1.1;
  var yP=yEp+M.bras;
  var x0=ep*0.96, x1=x0+b*0.9;
  return "M"+x0.toFixed(1)+" "+yEp.toFixed(1)
    + " Q"+x1.toFixed(1)+" "+(yEp+M.bras*0.30).toFixed(1)+" "+(x1*0.99).toFixed(1)+" "+(yEp+M.bras*0.55).toFixed(1)
    + " Q"+(x1*0.98).toFixed(1)+" "+(yP-M.bras*0.10).toFixed(1)+" "+(x1-p*0.2).toFixed(1)+" "+yP.toFixed(1)
    + " L"+(x1-p*1.2).toFixed(1)+" "+yP.toFixed(1)
    + " Q"+(x0*0.99).toFixed(1)+" "+(yEp+M.bras*0.55).toFixed(1)+" "+(x0*0.92).toFixed(1)+" "+(yEp+M.bras*0.12).toFixed(1)+" Z";
}

/* la silhouette complète, en millimètres, centrée sur x = 0 */
function corpsSvgParts(opt){
  opt=opt||{};
  var M=opt.mesures||corpsMesures();
  var trait=opt.trait||"#b9afa8", ep=opt.ep||6;
  var d=corpsDemiPath(M), bras=corpsBras(M);
  var st='fill="'+(opt.fill||"none")+'" stroke="'+trait+'" stroke-width="'+ep+'" stroke-linejoin="round" stroke-linecap="round"';
  var g='<g>'
    + '<path d="'+d+'" '+st+'/>'
    + '<g transform="scale(-1,1)"><path d="'+d+'" '+st+'/></g>';
  if(opt.bras!==false)
    g+='<path d="'+bras+'" '+st+'/><g transform="scale(-1,1)"><path d="'+bras+'" '+st+'/></g>';

  /* cou et tête */
  var nc=corpsDemi(M.neck)*0.9, tete=M.yFloor/6.6, cou=tete*0.38;
  g+='<path d="M'+(nc*0.78).toFixed(1)+' '+(-cou).toFixed(1)+' L'+nc.toFixed(1)+' 0 M'+(-nc*0.78).toFixed(1)+' '+(-cou).toFixed(1)+' L'+(-nc).toFixed(1)+' 0" '+st+'/>';
  g+='<ellipse cx="0" cy="'+(-(cou+tete/2)).toFixed(1)+'" rx="'+(tete*0.38).toFixed(1)+'" ry="'+(tete/2).toFixed(1)+'" '+st+'/>';

  if(opt.reperes!==false){
    var rep='stroke="'+trait+'" stroke-width="'+(ep*0.55)+'" stroke-dasharray="14 10" fill="none" opacity=".8"';
    var demi=Math.max(corpsDemi(M.chest),corpsDemi(M.hips))*1.15;
    [[M.yBust,"poitrine"],[M.yWaist,"taille"],[M.yHip,"hanches"]].forEach(function(l){
      g+='<line x1="'+(-demi).toFixed(1)+'" y1="'+l[0].toFixed(1)+'" x2="'+demi.toFixed(1)+'" y2="'+l[0].toFixed(1)+'" '+rep+'/>';
    });
  }
  g+='</g>';

  var demiMax=Math.max(M.epaules/2, corpsDemi(M.hips), corpsDemi(M.chest))+corpsDemi(M.biceps)*2;
  return {g:g, box:{x:-demiMax, y:-(cou+tete)-10, w:demiMax*2, h:M.yFloor+(cou+tete)+20}, M:M};
}

function corpsSvg(opt){
  var r=corpsSvgParts(opt);
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+r.box.x.toFixed(1)+' '+r.box.y.toFixed(1)+' '+
    r.box.w.toFixed(1)+' '+r.box.h.toFixed(1)+'" width="100%">'+r.g+'</svg>';
}
window.corpsMesures=corpsMesures; window.corpsSvg=corpsSvg; window.corpsSvgParts=corpsSvgParts;

/* ---------- superposition dans la vue technique ---------- */
/* On pose le corps derrière le vêtement : le creux du cou du corps sur le haut de
   la pièce devant, l'axe du corps sur la ligne de pli. */
function corpsSousVetement(board){
  if(!board)return null;
  var p=board.pieces.filter(function(x){ return x.role==="devant"||x.role==="dos"; })[0];
  if(!p){
    p=board.pieces.filter(function(x){ return x.role==="jupe"||x.role==="jambe"; })[0];
    if(!p)return null;
  }
  var r=corpsSvgParts({});
  var s=flatSpan(p);
  var axe=(p.fold&&p.fold.axe==="v")?p.fold.v:(s.x+s.w/2);
  var y0;
  if(p.role==="devant"||p.role==="dos")y0=s.y;                      /* encolure */
  else y0=s.y-r.M.yWaist;                                            /* bas : la taille du patron */
  return {g:'<g transform="translate('+axe.toFixed(1)+','+y0.toFixed(1)+')" opacity="0.75">'+r.g+'</g>',
          box:{x:r.box.x+axe, y:r.box.y+y0, w:r.box.w, h:r.box.h}};
}
