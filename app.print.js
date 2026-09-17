"use strict";
/* ===== Patron imprimable : pavage A4/A0, carré témoin 5 cm, marges de couture =====
 * Dépend de vendor/jspdf.umd.min.js + vendor/svg2pdf.umd.min.js
 * Surcharge fsPrint() et patPrint().
 */

/* ---------- réglages de page (mm) ---------- */
var PRINT_FORMATS = {
  a4p:   {label:"A4 portrait",  w:210,  h:297,  fmt:"a4", orient:"portrait"},
  a4l:   {label:"A4 paysage",   w:297,  h:210,  fmt:"a4", orient:"landscape"},
  lettre:{label:"US Letter",    w:215.9,h:279.4,fmt:"letter", orient:"portrait"},
  a0:    {label:"A0 (reprographie)", w:841, h:1189, fmt:"a0", orient:"portrait"}
};
var PRINT_MARGIN = 8;   /* marge non imprimable de sécurité */

/* ---------- feuille de style d'impression du SVG FreeSewing ---------- */
function printCss(){
  return '<style type="text/css">'+
    'path{fill:none;stroke:#111;stroke-width:.5;stroke-linecap:round;stroke-linejoin:round}'+
    'circle{fill:#111;stroke:none}'+
    'text{fill:#111;stroke:none;font-family:Helvetica,Arial,sans-serif;font-size:4px}'+
    '.fabric,.lining,.canvas,.interfacing,.various,.contrast{fill:none;stroke:#111;stroke-width:.6}'+
    '.sa{stroke:#111;stroke-width:.4;stroke-dasharray:3 2}'+
    '.help,.hint{stroke:#888;stroke-width:.3;stroke-dasharray:2 2}'+
    '.mark,.note{stroke:#b03a5b;stroke-width:.45}'+
    '.dashed{stroke-dasharray:3 2}.dotted{stroke-dasharray:.5 2}.lashed{stroke-dasharray:6 2}'+
    '.no-stroke{stroke:none}.fill-mark{fill:#b03a5b;stroke:none}.fill-note{fill:#5b7152;stroke:none}'+
    '.fill-fabric,.fill-current{fill:#111;stroke:none}.fill-various{fill:#777;stroke:none}'+
    '.contrast{stroke:#888}'+
    /* échelle typographique FreeSewing, en mm */
    '.text-xs{font-size:2.6px}.text-sm{font-size:3.2px}.text-base{font-size:4px}'+
    '.text-lg{font-size:5px}.text-xl{font-size:6px}.text-2xl{font-size:7px}'+
    '.text-3xl{font-size:9px}.text-4xl{font-size:11px}'+
    '.font-bold{font-weight:bold}'+
    '.center{text-anchor:middle}.right{text-anchor:end}.left{text-anchor:start}'+
    '</style>';
}

/* ---------- utilitaires ---------- */
function prLoadScript(src){
  return new Promise(function(res,rej){
    var s=document.createElement("script"); s.src=src;
    s.onload=function(){res();}; s.onerror=function(){rej(new Error("Impossible de charger "+src));};
    document.head.appendChild(s);
  });
}
function prReady(){
  var need=[];
  if(!window.jspdf||!window.jspdf.jsPDF) need.push(prLoadScript("vendor/jspdf.umd.min.js"));
  return Promise.all(need).then(function(){
    if(!window.svg2pdf) return prLoadScript("vendor/svg2pdf.umd.min.js");
  }).then(function(){
    if(!window.jspdf||!window.jspdf.jsPDF) throw new Error("jsPDF indisponible");
    return true;
  });
}
function prS2P(){ var s=window.svg2pdf; return (s&&s.svg2pdf)||s; }
function prCode(col,row){ /* A1, B1, … puis AA1 au-delà de 26 colonnes */
  var s="", n=col;
  do { s = String.fromCharCode(65+(n%26)) + s; n = Math.floor(n/26)-1; } while(n>=0);
  return s+(row+1);
}
function prSvgEl(svgString){
  var doc=new DOMParser().parseFromString(svgString,"image/svg+xml");
  var el=doc.documentElement;
  return document.importNode(el,true);
}
function prHost(){
  var h=document.getElementById("_prHost");
  if(!h){ h=document.createElement("div"); h.id="_prHost";
    h.style.cssText="position:fixed;left:-10000px;top:0;width:2000px;height:2000px;overflow:hidden;opacity:0;pointer-events:none;";
    document.body.appendChild(h); }
  return h;
}

/* ---------- construction du PDF ---------- */
function buildPatternPdf(o){
  /* o : {svg, title, subtitle, format, overlap, saCm, onProgress} */
  var F=PRINT_FORMATS[o.format]||PRINT_FORMATS.a4p;
  var overlap = typeof o.overlap==="number" ? o.overlap : 10;
  var host=prHost();

  var probe=prSvgEl(o.svg);
  var W=parseFloat((probe.getAttribute("width")||"0").replace("mm",""))||0;
  var H=parseFloat((probe.getAttribute("height")||"0").replace("mm",""))||0;
  if(!W||!H) return Promise.reject(new Error("dimensions du patron illisibles"));

  var availW=F.w-2*PRINT_MARGIN, availH=F.h-2*PRINT_MARGIN;
  var stepX=availW-overlap, stepY=availH-overlap;
  var cols=Math.max(1,Math.ceil((W-overlap)/stepX));
  var rows=Math.max(1,Math.ceil((H-overlap)/stepY));
  var total=cols*rows;

  var jsPDF=window.jspdf.jsPDF;
  var pdf=new jsPDF({unit:"mm",format:F.fmt,orientation:F.orient,compress:true});
  var s2p=prS2P();

  /* --- page de garde --- */
  coverPage(pdf,F,o,{W:W,H:H,cols:cols,rows:rows,total:total,overlap:overlap});

  /* --- pages du patron, séquentiellement --- */
  var seq=Promise.resolve(), n=0;
  for(var r=0;r<rows;r++){
    for(var c=0;c<cols;c++){
      (function(col,row,idx){
        seq=seq.then(function(){
          if(o.onProgress)o.onProgress(idx+1,total);
          pdf.addPage(F.fmt,F.orient);
          var x0=col*stepX, y0=row*stepY;
          var vw=Math.min(availW,W-x0), vh=Math.min(availH,H-y0);

          var el=prSvgEl(o.svg);
          el.setAttribute("viewBox",x0+" "+y0+" "+availW+" "+availH);
          el.setAttribute("width",availW+"mm");
          el.setAttribute("height",availH+"mm");
          el.insertAdjacentHTML("afterbegin",printCss());
          host.appendChild(el);

          pdf.saveGraphicsState();
          try{ pdf.rect(PRINT_MARGIN,PRINT_MARGIN,availW,availH); pdf.clip(); pdf.discardPath(); }catch(e){}
          return s2p(el,pdf,{x:PRINT_MARGIN,y:PRINT_MARGIN,width:availW,height:availH})
            .then(function(){
              pdf.restoreGraphicsState();
              host.removeChild(el);
              pageFurniture(pdf,F,{col:col,row:row,cols:cols,rows:rows,overlap:overlap,
                availW:availW,availH:availH,vw:vw,vh:vh,title:o.title,idx:idx});
            })
            .catch(function(err){
              try{pdf.restoreGraphicsState();}catch(e){}
              if(el.parentNode)el.parentNode.removeChild(el);
              throw err;
            });
        });
      })(c,r,n++);
    }
  }
  return seq.then(function(){ return pdf; });
}

/* ---------- repères d'assemblage sur chaque page ---------- */
function pageFurniture(pdf,F,p){
  var M=PRINT_MARGIN;
  var code=prCode(p.col,p.row);

  /* cadre de la zone utile */
  pdf.setDrawColor(190); pdf.setLineWidth(0.2);
  pdf.setLineDashPattern([1,1],0);
  pdf.rect(M,M,p.availW,p.availH);
  pdf.setLineDashPattern([],0);

  /* lignes de collage : à droite et en bas, début de la zone de recouvrement */
  pdf.setDrawColor(120); pdf.setLineWidth(0.3);
  if(p.col<p.cols-1){
    var gx=M+p.availW-p.overlap;
    pdf.setLineDashPattern([2,1.5],0);
    pdf.line(gx,M,gx,M+p.availH);
    pdf.setLineDashPattern([],0);
    pdf.setFontSize(6); pdf.setTextColor(120);
    pdf.text("coller "+prCode(p.col+1,p.row)+" ici",gx+1.5,M+p.availH/2,{angle:90});
  }
  if(p.row<p.rows-1){
    var gy=M+p.availH-p.overlap;
    pdf.setLineDashPattern([2,1.5],0);
    pdf.line(M,gy,M+p.availW,gy);
    pdf.setLineDashPattern([],0);
    pdf.setFontSize(6); pdf.setTextColor(120);
    pdf.text("coller "+prCode(p.col,p.row+1)+" ici",M+p.availW/2,gy-1.5,{align:"center"});
  }

  /* triangles d'alignement au milieu des bords partagés */
  function tri(x,y,dir){
    var s=2.4; pdf.setFillColor(60);
    if(dir==="r")      pdf.triangle(x-s,y-s,x-s,y+s,x,y,"F");
    else if(dir==="l") pdf.triangle(x+s,y-s,x+s,y+s,x,y,"F");
    else if(dir==="b") pdf.triangle(x-s,y-s,x+s,y-s,x,y,"F");
    else               pdf.triangle(x-s,y+s,x+s,y+s,x,y,"F");
  }
  if(p.col<p.cols-1) tri(M+p.availW,M+p.availH/2,"r");
  if(p.col>0)        tri(M,M+p.availH/2,"l");
  if(p.row<p.rows-1) tri(M+p.availW/2,M+p.availH,"b");
  if(p.row>0)        tri(M+p.availW/2,M,"t");

  /* pastille de code de page, en haut à gauche */
  pdf.setFillColor(240,235,228); pdf.setDrawColor(150); pdf.setLineWidth(0.2);
  pdf.roundedRect(M+1,M+1,15,7,1.5,1.5,"FD");
  pdf.setTextColor(40); pdf.setFontSize(10);
  pdf.text(code,M+8.5,M+6,{align:"center"});

  /* pied de page */
  pdf.setFontSize(7); pdf.setTextColor(130);
  pdf.text(code+"  ·  "+(p.title||"patron")+"  ·  colonne "+(p.col+1)+"/"+p.cols+", ligne "+(p.row+1)+"/"+p.rows+
    "  ·  imprimer à 100 %", M, F.h-3.5);
  pdf.setTextColor(0);
}

/* ---------- page de garde : échelle, plan d'assemblage, mode d'emploi ---------- */
function coverPage(pdf,F,o,g){
  var M=14, y=M+4;
  pdf.setTextColor(30);
  pdf.setFont("helvetica","bold"); pdf.setFontSize(19);
  pdf.text(o.title||"Mon patron",M,y); y+=8;
  pdf.setFont("helvetica","normal"); pdf.setFontSize(10); pdf.setTextColor(110);
  pdf.text(o.subtitle||"",M,y); y+=5;
  pdf.text("Atelier Herrgott · Lenuf designs · "+new Date().toLocaleDateString("fr-FR"),M,y); y+=10;

  /* bloc « à vérifier avant de couper » */
  pdf.setDrawColor(200); pdf.setFillColor(248,244,238); pdf.setLineWidth(0.3);
  pdf.roundedRect(M,y,F.w-2*M,70,2,2,"FD");
  pdf.setTextColor(30); pdf.setFont("helvetica","bold"); pdf.setFontSize(11);
  pdf.text("1. Vérifie l'échelle avant tout",M+6,y+9);
  pdf.setFont("helvetica","normal"); pdf.setFontSize(9); pdf.setTextColor(70);
  pdf.text("Imprime cette page à 100 % (décoche « ajuster à la page »),",M+6,y+16);
  pdf.text("puis mesure le carré ci-contre : il doit faire exactement 5 cm",M+6,y+21);
  pdf.text("de côté. S'il ne fait pas 5 cm, tout le patron est faux —",M+6,y+26);
  pdf.text("recommence l'impression, ne coupe rien.",M+6,y+31);

  /* le carré témoin, dessiné directement en unités PDF : 50 mm exacts */
  var sx=F.w-M-62, sy=y+8;
  pdf.setDrawColor(30); pdf.setLineWidth(0.5);
  pdf.rect(sx,sy,50,50);
  pdf.setLineWidth(0.2); pdf.setDrawColor(120);
  for(var i=10;i<50;i+=10){ pdf.line(sx+i,sy+47,sx+i,sy+50); pdf.line(sx,sy+i,sx+3,sy+i); }
  pdf.setFontSize(8); pdf.setTextColor(60);
  pdf.text("5 cm",sx+25,sy+27,{align:"center"});
  pdf.text("5 cm",sx+7,sy+25,{align:"center",angle:90});
  pdf.setFontSize(7); pdf.setTextColor(120);
  pdf.text("carré témoin — mesure-le",sx+25,sy+56,{align:"center"});
  y+=78;

  /* assemblage */
  pdf.setTextColor(30); pdf.setFont("helvetica","bold"); pdf.setFontSize(11);
  pdf.text("2. Assemble les "+g.total+" pages",M,y); y+=6;
  pdf.setFont("helvetica","normal"); pdf.setFontSize(9); pdf.setTextColor(70);
  pdf.text("Chaque page porte un code (A1, B1…). Place-les selon le plan ci-dessous, en faisant se recouvrir",M,y); y+=4.6;
  pdf.text("les pages de "+g.overlap+" mm : superpose jusqu'à ce que les triangles noirs des bords coïncident, puis colle",M,y); y+=4.6;
  pdf.text("le long du trait pointillé « coller … ici ». Vérifie que les traits du patron se prolongent bien.",M,y); y+=8;

  /* plan d'assemblage */
  var maxW=F.w-2*M-60, maxH=54;
  var cw=Math.min(maxW/g.cols, maxH/g.rows, 22), ch=cw*(F.h/F.w);
  if(ch*g.rows>maxH){ ch=maxH/g.rows; cw=ch*(F.w/F.h); }
  pdf.setLineWidth(0.25);
  for(var r=0;r<g.rows;r++){
    for(var c=0;c<g.cols;c++){
      var x=M+c*cw, yy=y+r*ch;
      pdf.setDrawColor(150); pdf.setFillColor(255,255,255);
      pdf.rect(x,yy,cw,ch,"FD");
      pdf.setFontSize(Math.min(9,cw*0.5)); pdf.setTextColor(90);
      pdf.text(prCode(c,r),x+cw/2,yy+ch/2+1.5,{align:"center"});
    }
  }
  /* récap à droite du plan */
  var rx=M+g.cols*cw+10, ry=y+4;
  pdf.setFontSize(9); pdf.setTextColor(70);
  pdf.text("Format : "+ (PRINT_FORMATS[o.format]||PRINT_FORMATS.a4p).label, rx, ry); ry+=5;
  pdf.text("Pages : "+g.total+"  ("+g.cols+" × "+g.rows+")", rx, ry); ry+=5;
  pdf.text("Patron : "+Math.round(g.W/10)+" × "+Math.round(g.H/10)+" cm", rx, ry); ry+=5;
  pdf.text("Recouvrement : "+g.overlap+" mm", rx, ry); ry+=5;
  pdf.text("Marges de couture : "+(o.saCm>0 ? o.saCm.toFixed(1).replace(".",",")+" cm incluses" : "non incluses"), rx, ry);
  y+=g.rows*ch+12;

  /* coupe */
  pdf.setTextColor(30); pdf.setFont("helvetica","bold"); pdf.setFontSize(11);
  pdf.text("3. Découpe",M,y); y+=6;
  pdf.setFont("helvetica","normal"); pdf.setFontSize(9); pdf.setTextColor(70);
  if(o.saCm>0){
    pdf.text("Les marges de couture ("+o.saCm.toFixed(1).replace(".",",")+" cm) sont incluses : coupe sur le trait pointillé extérieur.",M,y); y+=4.6;
    pdf.text("Le trait plein intérieur est la ligne de couture.",M,y); y+=4.6;
  } else {
    pdf.text("Les marges de couture ne sont pas incluses : coupe le papier sur le trait, puis ajoute ta marge",M,y); y+=4.6;
    pdf.text("(1 à 1,5 cm) directement sur le tissu en traçant autour du patron.",M,y); y+=4.6;
  }
  pdf.text("Respecte le droit-fil : la flèche de chaque pièce doit être parallèle à la lisière du tissu.",M,y);

  pdf.setFontSize(7.5); pdf.setTextColor(140);
  pdf.text("Patron généré par Mon Atelier Couture · moteur FreeSewing (open source, MIT)",M,F.h-10);
}

/* ---------- interface ---------- */
function fsPrintOpen(slug,label){
  if(!slug){ toast("Génère d'abord un patron"); return; }
  var ov=document.getElementById("prModal");
  if(ov)ov.parentNode.removeChild(ov);
  ov=document.createElement("div");
  ov.id="prModal";
  ov.style.cssText="position:fixed;inset:0;background:rgba(46,42,40,.45);display:flex;align-items:center;justify-content:center;z-index:200;padding:16px;";
  ov.innerHTML='<div class="card" style="max-width:460px;width:100%;max-height:90vh;overflow:auto;">'+
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:6px;">'+
      '<h3 style="font-size:17px;">Imprimer le patron</h3>'+
      '<button class="x" onclick="fsPrintClose()">&times;</button></div>'+
    '<p class="muted" style="font-size:13px;margin:0 0 16px;line-height:1.55;">Un PDF paginé, à assembler à la main : chaque page porte son code, les repères de collage et un carré témoin de 5 cm pour vérifier l\'échelle.</p>'+
    '<div class="row" style="margin-bottom:12px;">'+
      '<div><label class="fld">Format de papier</label><select id="prFormat">'+
        Object.keys(PRINT_FORMATS).map(function(k){return '<option value="'+k+'"'+(k==="a4p"?" selected":"")+'>'+PRINT_FORMATS[k].label+'</option>';}).join("")+
      '</select></div>'+
      '<div><label class="fld">Recouvrement</label><select id="prOverlap"><option value="10" selected>10 mm</option><option value="5">5 mm</option><option value="20">20 mm</option></select></div>'+
    '</div>'+
    '<div class="row" style="margin-bottom:12px;">'+
      '<div><label class="fld">Marges de couture</label><select id="prSa">'+
        '<option value="0">Aucune (je les ajoute sur le tissu)</option>'+
        '<option value="1" selected>1 cm</option><option value="1.5">1,5 cm</option><option value="0.7">7 mm</option><option value="2">2 cm</option>'+
      '</select></div>'+
      '<div style="display:flex;align-items:flex-end;"><label style="font-size:13px;display:inline-flex;align-items:center;gap:6px;"><input type="checkbox" id="prPaperless"> patron coté</label></div>'+
    '</div>'+
    '<p class="muted" style="font-size:12.5px;margin:0 0 16px;line-height:1.5;">« Patron coté » ajoute les mesures de chaque ligne : utile pour tracer directement sur le tissu, sans imprimer.</p>'+
    '<div id="prStatus" class="muted" style="font-size:13px;margin-bottom:12px;"></div>'+
    '<div style="display:flex;gap:8px;flex-wrap:wrap;">'+
      '<button class="btn" id="prGo" onclick="fsPrintGo(\''+slug+'\',\''+(label||"").replace(/'/g,"")+'\')">Créer le PDF</button>'+
      '<button class="btn ghost" onclick="fsPrintClose()">Annuler</button>'+
    '</div></div>';
  document.body.appendChild(ov);
  ov.addEventListener("click",function(e){ if(e.target===ov)fsPrintClose(); });
}
function fsPrintClose(){ var m=document.getElementById("prModal"); if(m)m.parentNode.removeChild(m); }

function fsPrintGo(slug,label){
  var st=document.getElementById("prStatus"), btn=document.getElementById("prGo");
  var format=document.getElementById("prFormat").value;
  var overlap=parseFloat(document.getElementById("prOverlap").value);
  var saCm=parseFloat(document.getElementById("prSa").value)||0;
  var paperless=document.getElementById("prPaperless").checked;
  btn.disabled=true; btn.style.opacity=.6;
  st.innerHTML='<span class="spin"></span> Préparation…';

  prReady().then(function(){
    st.innerHTML='<span class="spin"></span> Génération du patron…';
    var meas=(typeof fsOverrides==="function")?fsOverrides():{};
    var res;
    if(window.FS&&typeof window.FS.draftSvg==="function"){
      res=window.FS.draftSvg(slug,{measurements:meas,sa:saCm>0?saCm*10:0,paperless:paperless});
    } else {
      res={svg:window.FS.draft(slug,meas)}; /* ancien bundle : pas de marges */
      saCm=0;
    }
    if(!res.svg||res.svg.indexOf("<svg")<0)throw new Error("patron vide");
    return buildPatternPdf({
      svg:res.svg, format:format, overlap:overlap, saCm:saCm,
      title:label||slug,
      subtitle:"Patron sur mesure"+(saCm>0?" · marges de couture incluses":""),
      onProgress:function(i,n){ st.innerHTML='<span class="spin"></span> Page '+i+' sur '+n+'…'; }
    });
  }).then(function(pdf){
    var name=(label||slug).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+"-patron.pdf";
    pdf.save(name);
    st.innerHTML="PDF créé. Vérifie le carré de 5 cm sur la première page avant de couper.";
    btn.disabled=false; btn.style.opacity=1;
    setTimeout(fsPrintClose,2200);
  }).catch(function(e){
    st.innerHTML="Impossible de créer le PDF ("+esc(String((e&&e.message)||e).slice(0,110))+").";
    btn.disabled=false; btn.style.opacity=1;
  });
}

/* ---------- branchement sur les deux écrans ---------- */
function fsPrint(){
  var sel=document.getElementById("fsDesign");
  var slug=sel?sel.value:null;
  var label=sel&&sel.selectedOptions&&sel.selectedOptions[0]?sel.selectedOptions[0].textContent:slug;
  fsPrintOpen(slug,label);
}
function patPrint(){
  var slug=window._patpSlug;
  var d=(typeof FSMETA!=="undefined"&&FSMETA[slug])||null;
  fsPrintOpen(slug,d?d.name:slug);
}
window.fsPrint=fsPrint; window.patPrint=patPrint;

/* ---------- aperçu dans l'app : même feuille de style que l'impression ---------- */
window.styleFsSvg=function(svg){
  if(!svg||svg.indexOf("<svg")<0)return svg;
  return svg.replace(/(<svg[^>]*>)/, "$1"+printCss());
};
