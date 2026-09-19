"use strict";
/* ===== Export DXF (conventions AAMA / ASTM D6673) =====
 * Le format d'échange des patrons pro : lisible par Seamly2D/Valentina, CLO,
 * Optitex, Gerber, les traceurs et les découpeuses laser/couteau.
 *
 * Une pièce = un BLOCK. Calques AAMA utilisés :
 *   1  contour de coupe (avec marges)       14 ligne de couture (sans marges)
 *   7  droit-fil                             6  ligne de miroir (pièce au pli)
 * Chaque bloc porte ses textes d'identification (Piece Name, Quantity, …) sur le
 * calque 1, comme le demande la norme. Unités : millimètres, axe Y vers le haut.
 * Aucune bibliothèque : le DXF R12 ASCII est un simple fichier texte.
 */

var DXF_PAS=2;   /* un point tous les 2 mm le long des courbes */

/* ---------- échantillonnage d'un chemin SVG en polyligne ---------- */
function dxfPoints(d){
  var h=flatHost();
  var p=document.createElementNS("http://www.w3.org/2000/svg","path");
  p.setAttribute("d",d); h.appendChild(p);
  var pts=[];
  try{
    var L=p.getTotalLength(), n=Math.max(8,Math.ceil(L/DXF_PAS));
    for(var i=0;i<=n;i++){ var q=p.getPointAtLength(L*i/n); pts.push([q.x,q.y]); }
  }catch(e){}
  h.removeChild(p);
  /* on retire les doublons consécutifs */
  return pts.filter(function(q,i){ return i===0||Math.abs(q[0]-pts[i-1][0])>0.01||Math.abs(q[1]-pts[i-1][1])>0.01; });
}

/* ---------- lecture d'une pièce avec et sans marges ---------- */
function dxfPiece(design,part,meas,opts,saMm){
  var r=null;
  try{ r=FS.draftSvg(design,{measurements:meas,options:opts||{},only:[part],complete:true,sa:saMm||0}); }catch(e){ return null; }
  if(!r||!r.svg)return null;
  var paths=[], re=/<path([^>]*?)\/?>/g, m;
  while((m=re.exec(r.svg))){
    var a=m[1], d=(a.match(/\sd="([^"]*)"/)||[])[1]||"";
    if(d)paths.push({cls:(a.match(/class="([^"]*)"/)||[])[1]||"", attrs:a, d:d});
  }
  function plusLong(list){ return list.sort(function(x,y){return y.d.length-x.d.length;})[0]; }
  var couture=plusLong(paths.filter(function(p){ return /\bfabric\b/.test(p.cls)&&!/\bsa\b/.test(p.cls); }));
  if(!couture)return null;
  var coupe=plusLong(paths.filter(function(p){ return /\bsa\b/.test(p.cls); }));
  var fil=paths.filter(function(p){ return /grainline/.test(p.attrs); })[0];
  var pli=paths.filter(function(p){ return /cutonfold/.test(p.attrs); })[0];

  var x={part:part, nom:flatNom(part), couture:dxfPoints(couture.d)};
  x.coupe=coupe?dxfPoints(coupe.d):null;
  if(fil){ var f=dxfPoints(fil.d); x.fil=[f[0],f[f.length-1]]; }
  if(pli){ var g=dxfPoints(pli.d); x.pli=[g[0],g[g.length-1]]; }

  /* consigne de coupe → quantité */
  var tx=r.svg.match(/<text[^>]*>[\s\S]*?<\/text>/g)||[];
  for(var i=0;i<tx.length;i++){
    var t=tx[i].replace(/<[^>]+>/g,"").replace(/&#160;/g," ").trim();
    var q=t.match(/^Couper\s+(\d+)/); if(q){ x.qte=parseInt(q[1],10); x.consigne=t; break; }
  }
  if(!x.qte)x.qte=x.pli?1:2;

  /* sans droit-fil explicite : parallèle à la ligne de pli, sinon vertical au centre */
  if(!x.fil){
    var xs=x.couture.map(function(p){return p[0];}), ys=x.couture.map(function(p){return p[1];});
    var cx=(Math.min.apply(null,xs)+Math.max.apply(null,xs))/2;
    var y1=Math.min.apply(null,ys), y2=Math.max.apply(null,ys), hh=y2-y1;
    if(x.pli){ var off=(x.pli[0][0]<cx)?30:-30; x.fil=[[x.pli[0][0]+off,y1+hh*0.2],[x.pli[0][0]+off,y2-hh*0.2]]; }
    else x.fil=[[cx,y1+hh*0.2],[cx,y2-hh*0.2]];
  }
  return x;
}

/* ---------- écriture DXF R12 ---------- */
function DxfW(){ this.l=[]; }
DxfW.prototype.g=function(code,val){ this.l.push(String(code)); this.l.push(String(val)); return this; };
DxfW.prototype.n=function(v){ return (Math.round(v*1000)/1000).toString(); };
DxfW.prototype.poly=function(pts,calque,ferme){
  var self=this;
  this.g(0,"POLYLINE").g(8,calque).g(66,1).g(10,0).g(20,0).g(30,0).g(70,ferme?1:0);
  pts.forEach(function(p){ self.g(0,"VERTEX").g(8,calque).g(10,self.n(p[0])).g(20,self.n(-p[1])).g(30,0); });
  this.g(0,"SEQEND").g(8,calque);
  return this;
};
DxfW.prototype.ligne=function(a,b,calque){
  return this.g(0,"LINE").g(8,calque).g(10,this.n(a[0])).g(20,this.n(-a[1])).g(30,0).g(11,this.n(b[0])).g(21,this.n(-b[1])).g(31,0);
};
DxfW.prototype.texte=function(x,y,h,t,calque){
  /* ASCII pur : les traceurs anciens ne lisent pas l'UTF-8 */
  var s=String(t).normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^\x20-\x7e]/g,"");
  return this.g(0,"TEXT").g(8,calque).g(10,this.n(x)).g(20,this.n(-y)).g(30,0).g(40,h).g(1,s);
};

function dxfNomBloc(s,i){ return (String(s).normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^A-Za-z0-9_-]/g,"_")+"_"+(i+1)).slice(0,31); }

function dxfBuild(o){
  /* o : {design, label, meas, opts, saMm, taille} */
  var parts=flatParts(o.design), pieces=[];
  parts.forEach(function(p){ var x=dxfPiece(o.design,p,o.meas,o.opts,o.saMm); if(x&&x.couture.length>4)pieces.push(x); });
  if(!pieces.length)throw new Error("aucune pièce exportable");

  var w=new DxfW();
  /* en-tête : millimètres */
  w.g(0,"SECTION").g(2,"HEADER")
   .g(9,"$ACADVER").g(1,"AC1009")
   .g(9,"$INSUNITS").g(70,4)
   .g(9,"$MEASUREMENT").g(70,1)
   .g(0,"ENDSEC");

  /* table des calques */
  var calques=[["1",7],["6",3],["7",5],["14",1]];
  w.g(0,"SECTION").g(2,"TABLES").g(0,"TABLE").g(2,"LAYER").g(70,calques.length);
  calques.forEach(function(c){ w.g(0,"LAYER").g(2,c[0]).g(70,0).g(62,c[1]).g(6,"CONTINUOUS"); });
  w.g(0,"ENDTAB").g(0,"ENDSEC");

  /* un bloc par pièce */
  var noms=[];
  w.g(0,"SECTION").g(2,"BLOCKS");
  pieces.forEach(function(p,i){
    var nb=dxfNomBloc(p.nom,i); noms.push(nb);
    var ref=p.coupe||p.couture;
    var xs=ref.map(function(q){return q[0];}), ys=ref.map(function(q){return q[1];});
    var x0=Math.min.apply(null,xs), y0=Math.min.apply(null,ys);
    p._box={x:x0,y:y0,w:Math.max.apply(null,xs)-x0,h:Math.max.apply(null,ys)-y0};
    w.g(0,"BLOCK").g(8,"1").g(2,nb).g(70,0).g(10,0).g(20,0).g(30,0).g(3,nb);
    w.poly(ref,"1",true);                                   /* coupe */
    if(p.coupe)w.poly(p.couture,"14",true);                  /* couture */
    w.ligne(p.fil[0],p.fil[1],"7");                          /* droit-fil */
    if(p.pli)w.ligne(p.pli[0],p.pli[1],"6");                 /* miroir */
    var tx=x0+p._box.w*0.18, ty=y0+p._box.h*0.35, th=Math.max(5,Math.min(12,p._box.w/30));
    w.texte(tx,ty,th,"Piece Name: "+p.nom,"1");
    w.texte(tx,ty+th*1.6,th,"Quantity: "+p.qte+(p.pli?" (on fold)":""),"1");
    w.texte(tx,ty+th*3.2,th,"Size: "+(o.taille||"sur mesure"),"1");
    w.texte(tx,ty+th*4.8,th,"Material: principal","1");
    w.g(0,"ENDBLK").g(8,"1");
  });
  w.g(0,"ENDSEC");

  /* entités : les blocs posés côte à côte, + l'identification du modèle */
  w.g(0,"SECTION").g(2,"ENTITIES");
  var x=0, gap=50;
  pieces.forEach(function(p,i){
    w.g(0,"INSERT").g(8,"1").g(2,noms[i]).g(10,w.n(x-p._box.x)).g(20,w.n(p._box.y)).g(30,0);
    x+=p._box.w+gap;
  });
  w.texte(0,-40,10,"Style Name: "+(o.label||o.design),"1");
  w.texte(0,-25,7,"Sample Size: "+(o.taille||"sur mesure")+"  -  Units: mm  -  Mon Atelier Couture / FreeSewing","1");
  w.g(0,"ENDSEC").g(0,"EOF");
  return {texte:w.l.join("\r\n")+"\r\n", pieces:pieces};
}

/* ---------- bouton de la vue technique ---------- */
function tkDxf(){
  if(!window.FS){ toast("Moteur non chargé"); return; }
  try{
    var saCm=parseFloat((document.getElementById("optSeam")||{}).value);
    if(isNaN(saCm))saCm=1;
    var r=dxfBuild({
      design:TK.slug, label:tkLabel(TK.slug),
      meas:(typeof fsOverrides==="function")?fsOverrides():{},
      opts:(typeof tkEngineOpts==="function")?tkEngineOpts():{},
      saMm:saCm*10
    });
    var nom=tkLabel(TK.slug).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+"-aama.dxf";
    var url=URL.createObjectURL(new Blob([r.texte],{type:"application/dxf"}));
    tkDownload(url,nom);
    toast("DXF exporté : "+r.pieces.length+" pièces, marges "+saCm+" cm");
  }catch(e){
    toast("Export DXF impossible : "+String((e&&e.message)||e).slice(0,60));
  }
}
window.dxfBuild=dxfBuild; window.tkDxf=tkDxf;
