"use strict";
/* ===== Fiche atelier (tech pack) PDF =====
 * Le document qu'on pose à côté de la machine, ou qu'on envoie à quelqu'un :
 * dessin technique devant/dos, nomenclature des pièces avec le nombre à couper,
 * mesures du vêtement fini, réglages utilisés, plan de coupe et métrage.
 * Dépend de app.flat.js (planche de pièces) et app.print.js (jsPDF + svg2pdf).
 */

var _tpH1=120, _tpH2=120;
var TP_MARGE=16;          /* marge de page, mm */
var TP_ACC=[176,58,91];   /* accent de la marque */

/* ---------- utilitaires de page ---------- */
function tpDoc(){
  var J=window.jspdf.jsPDF;
  return new J({unit:"mm", format:"a4", orientation:"portrait", compress:true});
}
function tpEntete(pdf,titre,sur){
  var W=pdf.internal.pageSize.getWidth();
  pdf.setFont("helvetica","bold"); pdf.setFontSize(9); pdf.setTextColor(TP_ACC[0],TP_ACC[1],TP_ACC[2]);
  pdf.text("ATELIER HERRGOTT", TP_MARGE, 12);
  pdf.setFont("helvetica","normal"); pdf.setTextColor(120);
  pdf.text(sur||"Fiche atelier", W-TP_MARGE, 12, {align:"right"});
  pdf.setDrawColor(TP_ACC[0],TP_ACC[1],TP_ACC[2]); pdf.setLineWidth(.4);
  pdf.line(TP_MARGE,14.5,W-TP_MARGE,14.5);
  if(titre){
    pdf.setFont("helvetica","bold"); pdf.setFontSize(15); pdf.setTextColor(30);
    pdf.text(titre, TP_MARGE, 24);
  }
  pdf.setTextColor(30);
}
function tpPied(pdf,n,total){
  var W=pdf.internal.pageSize.getWidth(), H=pdf.internal.pageSize.getHeight();
  pdf.setFont("helvetica","normal"); pdf.setFontSize(7.5); pdf.setTextColor(150);
  pdf.text("Mon Atelier Couture — patron FreeSewing (MIT), fiche générée le "+tpDate(), TP_MARGE, H-8);
  pdf.text(n+" / "+total, W-TP_MARGE, H-8, {align:"right"});
  pdf.setTextColor(30);
}
function tpDate(){
  var d=new Date(), M=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
  return d.getDate()+" "+M[d.getMonth()]+" "+d.getFullYear();
}
/* petit tableau à deux colonnes */
function tpTable(pdf,x,y,w,lignes,opt){
  opt=opt||{};
  var lh=opt.lh||6.4, c2=opt.c2||(w*0.52);
  lignes.forEach(function(l,i){
    if(i%2===0){ pdf.setFillColor(248,246,245); pdf.rect(x,y-4.3,w,lh,"F"); }
    pdf.setFont("helvetica","normal"); pdf.setFontSize(9); pdf.setTextColor(90);
    pdf.text(String(l[0]), x+2, y);
    pdf.setFont("helvetica", l[2]?"bold":"normal"); pdf.setTextColor(30);
    pdf.text(String(l[1]), x+c2, y);
    y+=lh;
  });
  return y;
}

/* proportions d'un SVG : hauteur pour une largeur donnée, plafonnée */
function tpHauteur(svgString,w,maxH){
  var m=svgString.match(/viewBox="([-\d.]+) ([-\d.]+) ([\d.]+) ([\d.]+)"/);
  if(!m)return maxH;
  var r=parseFloat(m[4])/parseFloat(m[3]);
  return Math.max(40, Math.min(maxH, w*r));
}

/* ---------- dessin d'un SVG dans la page ---------- */
function tpSvg(pdf,svgString,x,y,w,h){
  var el=prSvgEl(svgString);
  var host=prHost(); host.appendChild(el);
  /* on force une taille physique pour que svg2pdf respecte le viewBox */
  el.setAttribute("width",w+"mm"); el.setAttribute("height",h+"mm");
  var f=prS2P();
  return Promise.resolve(f(el,pdf,{x:x,y:y,width:w,height:h})).then(function(){
    host.removeChild(el);
  }).catch(function(e){ try{host.removeChild(el);}catch(_){ } throw e; });
}

/* ---------- plan de coupe : rangement simple par étagères ---------- */
function tpPlanCoupe(board, laizeCm){
  var laize=(laizeCm||140)*10;          /* mm */
  var util=laize/2;                     /* tissu plié en deux dans le sens de la longueur */
  var rects=[];
  board.pieces.forEach(function(p){
    var n=Math.max(1, p.fold?1:(p.nb||2));
    var w=p.bbox.w+10, h=p.bbox.h+10;   /* 5 mm de marge autour */
    for(var i=0;i<n;i++)rects.push({w:w,h:h,nom:p.nom});
  });
  rects.sort(function(a,b){ return b.h-a.h; });
  var x=0,y=0,ligneH=0,pose=[];
  rects.forEach(function(r){
    var w=r.w, h=r.h;
    if(w>util){ /* trop large pour le pli : on utilise toute la laize */
      if(x>0){ x=0; y+=ligneH; ligneH=0; }
      pose.push({x:0,y:y,w:Math.min(w,laize),h:h,nom:r.nom});
      y+=h; return;
    }
    if(x+w>util){ x=0; y+=ligneH; ligneH=0; }
    pose.push({x:x,y:y,w:w,h:h,nom:r.nom});
    x+=w; ligneH=Math.max(ligneH,h);
  });
  var L=y+ligneH;
  return {laize:laize, util:util, longueur:L, pose:pose, metres:Math.ceil(L/100)/10};
}
function tpDessinePlan(pdf,plan,x,y,w){
  /* le tissu est dessiné couché : largeur du dessin = longueur de tissu */
  var ech=w/Math.max(plan.longueur,1);
  var h=plan.util*ech;
  pdf.setDrawColor(200); pdf.setFillColor(252,250,249); pdf.setLineWidth(.3);
  pdf.rect(x,y,w,h,"FD");
  plan.pose.forEach(function(r){
    var rw=Math.min(r.h,plan.longueur)*ech, rh=Math.min(r.w,plan.util)*ech;
    pdf.setDrawColor(TP_ACC[0],TP_ACC[1],TP_ACC[2]); pdf.setLineWidth(.2);
    pdf.rect(x+r.y*ech, y+r.x*ech, rw, rh);
    if(rw>16&&rh>7){
      pdf.setFont("helvetica","normal"); pdf.setFontSize(7.5); pdf.setTextColor(130);
      pdf.text(r.nom, x+r.y*ech+2, y+r.x*ech+5);
      pdf.setTextColor(30);
    }
  });
  pdf.setDrawColor(120); pdf.setLineWidth(.2); pdf.setLineDashPattern([1,1],0);
  pdf.line(x,y+h,x+w,y+h); pdf.setLineDashPattern([],0);
  pdf.setFont("helvetica","normal"); pdf.setFontSize(7.5); pdf.setTextColor(120);
  pdf.text("pliure du tissu", x+1, y+h-1.5);
  pdf.text("laize utile "+Math.round(plan.util/10)+" cm (tissu plié en deux)", x+w, y-1.5, {align:"right"});
  pdf.text(plan.metres.toFixed(1)+" m", x+w/2, y+h+5, {align:"center"});
  pdf.setTextColor(30);
  return y+h+9;
}

/* ---------- le document ---------- */
function tpBuild(o){
  /* o : {board, slug, label, cotes, reglages, laize, notes, onProgress} */
  var board=o.board, total=3, pdf=null;
  var W, CW;
  return prReady().then(function(){
    pdf=tpDoc();
    W=pdf.internal.pageSize.getWidth(); CW=W-TP_MARGE*2;

    /* ---- page 1 : le vêtement ---- */
    tpEntete(pdf, o.label||o.slug, "Fiche atelier");
    pdf.setFont("helvetica","normal"); pdf.setFontSize(9.5); pdf.setTextColor(110);
    var desc=(o.desc||"").slice(0,150);
    if(desc)pdf.text(pdf.splitTextToSize(desc,CW), TP_MARGE, 31);
    var svg=flatSvg(board, flatAssemblable(board)?"assemble":"pieces");
    _tpH1=tpHauteur(svg, CW, 122);
    return tpSvg(pdf, svg, TP_MARGE, 38, CW, _tpH1);
  }).then(function(){
    var y=Math.max(120, 38+_tpH1+16);
    pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.text("Mesures du vêtement fini", TP_MARGE, y);
    var y0Reg=y; y+=7;
    y=tpTable(pdf, TP_MARGE, y, CW*0.58, (o.cotes||[]).map(function(c){ return [c.l, String(c.v)]; }));
    var yr=y0Reg+7;
    pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.text("Réglages", TP_MARGE+CW*0.62, y0Reg);
    var reg=o.reglages&&o.reglages.length?o.reglages:[["Options","d'origine"]];
    tpTable(pdf, TP_MARGE+CW*0.62, yr, CW*0.38, reg, {c2:CW*0.24});
    /* place laissée libre pour écrire à la main, à côté de la machine */
    var yn=Math.max(y+14, 200);
    pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.setTextColor(30);
    pdf.text("Mes notes", TP_MARGE, yn);
    pdf.setDrawColor(226,222,220); pdf.setLineWidth(.2);
    for(var li=0; li<8; li++)pdf.line(TP_MARGE, yn+7+li*8, TP_MARGE+CW, yn+7+li*8);
    pdf.setFont("helvetica","normal"); pdf.setFontSize(8.5); pdf.setTextColor(120);
    pdf.text(pdf.splitTextToSize("Mesures prises sur les pièces du patron, sans marges de couture. Le dessin est à l'échelle du vêtement, pas une illustration.", CW), TP_MARGE, 276);
    pdf.setTextColor(30);
    tpPied(pdf,1,total);

    /* ---- page 2 : les pièces ---- */
    pdf.addPage();
    tpEntete(pdf, "Les pièces", (o.label||o.slug));
    var sp=flatSvgPieces(board);
    _tpH2=tpHauteur(sp, CW, 128);
    return tpSvg(pdf, sp, TP_MARGE, 30, CW, _tpH2);
  }).then(function(){
    var y=Math.max(150, 30+_tpH2+14);
    pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.text("Nomenclature", TP_MARGE, y); y+=8;
    /* en-tête du tableau */
    pdf.setFont("helvetica","bold"); pdf.setFontSize(8.5); pdf.setTextColor(120);
    pdf.text("Pièce", TP_MARGE+2, y); pdf.text("À couper", TP_MARGE+CW*0.34, y);
    pdf.text("Largeur", TP_MARGE+CW*0.72, y); pdf.text("Hauteur", TP_MARGE+CW*0.86, y);
    pdf.setDrawColor(220); pdf.setLineWidth(.2); pdf.line(TP_MARGE,y+2,TP_MARGE+CW,y+2);
    y+=7; pdf.setTextColor(30);
    board.pieces.forEach(function(p,i){
      if(y>268){ tpPied(pdf,2,total); pdf.addPage(); tpEntete(pdf,"Nomenclature (suite)",(o.label||o.slug)); y=30; }
      if(i%2===0){ pdf.setFillColor(248,246,245); pdf.rect(TP_MARGE,y-4.2,CW,6.2,"F"); }
      pdf.setFont("helvetica","bold"); pdf.setFontSize(9); pdf.text(p.nom, TP_MARGE+2, y);
      pdf.setFont("helvetica","normal"); pdf.setTextColor(80);
      var c=p.coupe||(p.fold?"Couper 1 au pli":"Couper 2 en miroir");
      pdf.text(pdf.splitTextToSize(c, CW*0.36)[0], TP_MARGE+CW*0.34, y);
      pdf.text(Math.round(p.bbox.w/10)+" cm", TP_MARGE+CW*0.72, y);
      pdf.text(Math.round(p.bbox.h/10)+" cm", TP_MARGE+CW*0.86, y);
      pdf.setTextColor(30);
      y+=6.4;
    });
    tpPied(pdf,2,total);

    /* ---- page 3 : coupe & notes ---- */
    pdf.addPage();
    tpEntete(pdf, "Coupe & fournitures", (o.label||o.slug));
    var plan=tpPlanCoupe(board, o.laize);
    pdf.setFont("helvetica","normal"); pdf.setFontSize(9.5); pdf.setTextColor(90);
    pdf.text(pdf.splitTextToSize("Estimation pour un tissu de "+(o.laize||140)+" cm de laize, plié en deux, sans raccord de motif. Prévois 10 à 15 % de plus pour un tissu à sens ou à carreaux.", CW), TP_MARGE, 32);
    pdf.setTextColor(30);
    var y2=tpDessinePlan(pdf, plan, TP_MARGE, 46, CW);

    y2+=6;
    pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.text("À prévoir", TP_MARGE, y2); y2+=7;
    y2=tpTable(pdf, TP_MARGE, y2, CW, [
      ["Tissu principal", plan.metres.toFixed(1)+" m en "+(o.laize||140)+" cm", true],
      ["Marges de couture", (o.saCm!=null?o.saCm:1)+" cm (comprises dans le patron imprimé)"],
      ["Fil", "assorti au tissu"],
      ["Aiguille", (board.type==="top"?"jersey / stretch si tissu en maille":"universelle 80")]
    ]);

    y2+=8;
    pdf.setFont("helvetica","bold"); pdf.setFontSize(11); pdf.text("Notes de construction", TP_MARGE, y2); y2+=7;
    var notes=o.notes||[
      "Repasser le tissu avant de couper.",
      "Placer le droit-fil parallèle à la lisière ; les pièces « au pli » contre la pliure.",
      "Surfiler les bords avant assemblage si le tissu s'effiloche.",
      "Assembler les épaules, puis monter les manches à plat, puis fermer les côtés d'un seul tenant.",
      "Essayer avant de faire les ourlets."
    ];
    pdf.setFont("helvetica","normal"); pdf.setFontSize(9.5);
    notes.forEach(function(n){
      var l=pdf.splitTextToSize("— "+n, CW);
      pdf.text(l, TP_MARGE, y2); y2+=l.length*5+1.5;
    });
    tpPied(pdf,3,total);
    return pdf;
  });
}

/* ---------- branchement sur la vue technique ---------- */
function tkFiche(){
  if(!TK.board){ toast("Dessine d'abord le vêtement"); return; }
  var btn=document.getElementById("tkFicheBtn");
  if(btn){ btn.disabled=true; btn.textContent="Préparation…"; }
  var reglages=[];
  var defs=(typeof flatOptions==="function")?flatOptions(TK.slug):[];
  defs.forEach(function(d){
    if(TK.vals[d.k]==null)return;
    var v=TK.vals[d.k];
    reglages.push([flatOptFr(d.k), d.type==="pct"?(Math.round(v)+" %"):(d.type==="deg"?Math.round(v)+"°":String(v))]);
  });
  var fs=(typeof FSALL!=="undefined")?FSALL.filter(function(d){return d.slug===TK.slug;})[0]:null;
  tpBuild({
    board:TK.board, slug:TK.slug, label:tkLabel(TK.slug),
    desc:fs?fs.desc:"", cotes:flatCotes(TK.board), reglages:reglages,
    laize:parseFloat((document.getElementById("optFw")||{}).value)||140
  }).then(function(pdf){
    pdf.save(tkLabel(TK.slug).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+"-fiche-atelier.pdf");
    if(btn){ btn.disabled=false; btn.textContent="Fiche atelier (PDF)"; }
    toast("Fiche atelier créée");
  }).catch(function(e){
    if(btn){ btn.disabled=false; btn.textContent="Fiche atelier (PDF)"; }
    toast("Fiche impossible : "+String((e&&e.message)||e).slice(0,60));
  });
}
window.tkFiche=tkFiche; window.tpBuild=tpBuild; window.tpPlanCoupe=tpPlanCoupe;
