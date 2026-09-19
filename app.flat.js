"use strict";
/* ===== Vue technique : le dessin du vêtement construit à partir du patron =====
 * Principe : on ne dessine plus des formes libres. On récupère le contour réel de
 * chaque pièce du patron (classe `fabric`), on reflète celles coupées au pli, et on
 * assemble une planche technique aux conventions du métier :
 * noir et blanc, hiérarchie des traits, symétrie par construction, devant et dos.
 */

/* ---------- extraction des pièces depuis le moteur ---------- */
function flatParts(design){
  if(!window.FS||typeof FS.info!=="function")return [];
  var info=null; try{ info=FS.info(design); }catch(e){}
  if(!info||!info.parts)return [];
  var all=Object.keys(info.parts);
  /* une pièce héritée (titan.front) fait double emploi quand le modèle a la sienne
     (paco.front) : on ne garde que celle du modèle. */
  var propres={};
  all.forEach(function(p){ var t=p.split("."); if(t[0]===design)propres[t.slice(1).join(".")]=1; });
  return all.filter(function(p){
    var t=p.split(".");
    return t[0]===design || !propres[t.slice(1).join(".")];
  });
}

/* rôle d'une pièce, déduit de son nom — sert à la mise en planche */
function flatRole(part){
  var n=(part.split(".")[1]||part).toLowerCase();
  if(/sleeve|manche/.test(n))return "manche";
  if(/front|devant/.test(n)&&!/facing|parement/.test(n))return "devant";
  if(/back|dos/.test(n)&&!/facing|parement/.test(n))return "dos";
  if(/skirt|jupe/.test(n))return "jupe";
  if(/pants|trouser|leg/.test(n))return "jambe";
  if(/collar|col\b/.test(n))return "col";
  if(/cuff|poignet/.test(n))return "poignet";
  if(/waistband|ceinture/.test(n))return "ceinture";
  if(/pocket|poche/.test(n))return "poche";
  if(/hood|capuche/.test(n))return "capuche";
  if(/band|bande|binding|bias/.test(n))return "bande";
  if(/facing|parement/.test(n))return "parement";
  return "pièce";
}
function flatNom(part){
  var n=(part.split(".")[1]||part);
  var r=flatRole(part);
  var fr={manche:"Manche",devant:"Devant",dos:"Dos",jupe:"Jupe",jambe:"Jambe",col:"Col",
          poignet:"Poignet",ceinture:"Ceinture",poche:"Poche",capuche:"Capuche",
          bande:"Bande",parement:"Parement"};
  if(fr[r])return fr[r];
  return n.replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/^./,function(c){return c.toUpperCase();});
}

/* ---------- mesure exacte d'un chemin, via le navigateur ---------- */
var _flatHost=null;
function flatHost(){
  if(_flatHost&&document.body.contains(_flatHost))return _flatHost;
  _flatHost=document.createElementNS("http://www.w3.org/2000/svg","svg");
  _flatHost.setAttribute("width","10"); _flatHost.setAttribute("height","10");
  _flatHost.style.cssText="position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none;";
  document.body.appendChild(_flatHost);
  return _flatHost;
}
function flatBBox(d){
  var h=flatHost();
  var p=document.createElementNS("http://www.w3.org/2000/svg","path");
  p.setAttribute("d",d); h.appendChild(p);
  var b; try{ b=p.getBBox(); }catch(e){ b={x:0,y:0,width:0,height:0}; }
  var o={x:b.x,y:b.y,w:b.width,h:b.height};
  h.removeChild(p);
  return o;
}

/* échantillonnage du contour : sert à trouver le point d'épaule */
function flatSample(d,n){
  n=n||300;
  var h=flatHost();
  var p=document.createElementNS("http://www.w3.org/2000/svg","path");
  p.setAttribute("d",d); h.appendChild(p);
  var out=[];
  try{
    var L=p.getTotalLength();
    for(var i=0;i<=n;i++){ var q=p.getPointAtLength(L*i/n); out.push({x:q.x,y:q.y}); }
  }catch(e){}
  h.removeChild(p);
  return out;
}

/* emmanchure : le point d'épaule (haut, côté extérieur) et le dessous de bras
   (le point le plus éloigné du milieu dans le haut de la pièce). */
function flatArmhole(p){
  var b=p.bbox, axe=(p.fold&&p.fold.axe==="v")?p.fold.v:(b.x+b.w/2);
  var sgn=1, pts=p.pts||[];
  if(!pts.length)return null;
  /* côté extérieur = celui qui s'éloigne le plus du milieu */
  var far=0; pts.forEach(function(q){ if(Math.abs(q.x-axe)>Math.abs(far))far=q.x-axe; });
  sgn=far<0?-1:1;
  var haut=pts.filter(function(q){ return q.y<=b.y+b.h*0.40 && (q.x-axe)*sgn>0; });
  if(!haut.length)return null;
  var U=haut[0]; haut.forEach(function(q){ if((q.x-axe)*sgn>(U.x-axe)*sgn)U=q; });
  var dmax=(U.x-axe)*sgn;
  var ext=haut.filter(function(q){ return (q.x-axe)*sgn>dmax*0.42; });
  var S=ext[0]; ext.forEach(function(q){ if(q.y<S.y)S=q; });
  return {axe:axe, sgn:sgn, S:S, U:U, dmax:dmax};
}

/* ---------- une pièce : contour + ligne de pli + cotes ---------- */
function flatPiece(design,part,meas,opts){
  var r=null;
  try{ r=FS.draftSvg(design,{measurements:meas,options:opts||{},only:[part],complete:true,sa:0}); }
  catch(e){ return null; }
  if(!r||!r.svg)return null;
  var svg=r.svg, out={part:part, nom:flatNom(part), role:flatRole(part), fold:null, d:null};

  var paths=[];
  var re=/<path([^>]*?)\/?>/g, m;
  while((m=re.exec(svg))){
    var attrs=m[1];
    var cls=(attrs.match(/class="([^"]*)"/)||[])[1]||"";
    var d=(attrs.match(/\sd="([^"]*)"/)||[])[1]||"";
    if(!d)continue;
    paths.push({cls:cls,d:d,attrs:attrs});
  }
  /* contour du tissu : le plus long chemin de classe fabric */
  var fab=paths.filter(function(p){ return /\bfabric\b/.test(p.cls)&&!/\bsa\b/.test(p.cls); })
               .sort(function(a,b){ return b.d.length-a.d.length; })[0];
  if(!fab)return null;
  /* certains modèles (Bibi…) tracent le contour en plusieurs morceaux : on les raboute */
  if(!/z\s*$/i.test(fab.d.trim())){
    var fabs=paths.filter(function(p){ return /\bfabric\b/.test(p.cls)&&!/\bsa\b/.test(p.cls); });
    var ch=fabs.length>1?flatChainer(fabs.map(function(p){ return p.d; })):null;
    if(ch)fab={d:ch};
  }
  out.d=fab.d;
  out.bbox=flatBBox(fab.d);
  out.pts=flatSample(fab.d);

  /* consigne de coupe, déjà traduite par le bundle ("Couper 2 en miroir dans le tissu principal") */
  var tx=svg.match(/<text[^>]*>[\s\S]*?<\/text>/g)||[];
  var secours=null;
  for(var i=0;i<tx.length;i++){
    var t=tx[i].replace(/<[^>]+>/g,"").replace(/&#160;/g," ").trim();
    if(/^Couper\s+\d/.test(t)){ out.coupe=t; break; }          /* « Couper 2 en miroir… » */
    if(/^Couper/.test(t)&&!secours)secours=t;                    /* « Couper au pli — droit-fil » */
  }
  if(!out.coupe)out.coupe=secours||null;
  out.nb=(function(){ var m=(out.coupe||"").match(/Couper\s+(\d+)/); return m?parseInt(m[1],10):1; })();

  /* ligne de pli : le chemin portant le marqueur cutonfold */
  var fold=paths.filter(function(p){ return /cutonfold/.test(p.attrs); })[0];
  if(fold){
    var fb=flatBBox(fold.d);
    /* pli vertical si la ligne est plus haute que large */
    out.fold=(fb.h>=fb.w)?{axe:"v",v:fb.x+fb.w/2}:{axe:"h",v:fb.y+fb.h/2};
    /* le marqueur de pli est dessiné à côté du bord : on recale le pli sur le bord le plus proche */
    if(out.fold.axe==="v"&&out.bbox){
      var bx=out.bbox, dg=Math.abs(out.fold.v-bx.x), dd=Math.abs(out.fold.v-(bx.x+bx.w));
      if(Math.min(dg,dd)<25)out.fold.v=(dg<=dd)?bx.x:bx.x+bx.w;
    }
  }
  return out;
}

/* tracés absolus M/L/C -> {a:point de départ, s:[{t,p:[...]}]} */
function flatParse(d){
  var tok=d.match(/[MLCZmlcz]|-?\d*\.?\d+(?:e[-+]?\d+)?/g)||[], cmd="", n=[], o=null, bad=false;
  function fl(){
    if(!cmd)return;
    var P=[]; for(var i=0;i+1<n.length;i+=2)P.push([n[i],n[i+1]]);
    if(cmd==="M"){ if(o){ bad=true; return; } o={a:P[0],s:[]}; P.slice(1).forEach(function(q){ o.s.push({t:"L",p:[q]}); }); }
    else if(cmd==="L")P.forEach(function(q){ o.s.push({t:"L",p:[q]}); });
    else if(cmd==="C")for(var j=0;j+2<P.length;j+=3)o.s.push({t:"C",p:[P[j],P[j+1],P[j+2]]});
    else if(/[Zz]/.test(cmd)){}
    else bad=true;
  }
  tok.forEach(function(t){ if(/^[A-Za-z]$/.test(t)){ fl(); cmd=t; n=[]; } else n.push(parseFloat(t)); });
  fl();
  return (bad||!o)?null:o;
}
function flatFin(o){ return o.s.length?o.s[o.s.length-1].p[o.s[o.s.length-1].p.length-1]:o.a; }
function flatInverser(o){
  var pts=[o.a]; o.s.forEach(function(g){ pts.push(g.p[g.p.length-1]); });
  var r={a:pts[pts.length-1],s:[]};
  for(var i=o.s.length-1;i>=0;i--){
    var g=o.s[i], dep=pts[i];
    r.s.push(g.t==="C"?{t:"C",p:[g.p[1],g.p[0],dep]}:{t:"L",p:[dep]});
  }
  return r;
}
function flatChainer(ds){
  var L=ds.map(flatParse).filter(Boolean); if(L.length<2)return null;
  function pr(a,b){ return Math.abs(a[0]-b[0])<1.5&&Math.abs(a[1]-b[1])<1.5; }
  var cur=L.shift(), guard=0;
  while(L.length&&guard++<40){
    var fin=flatFin(cur), k=-1, inv=false;
    for(var i=0;i<L.length;i++){ if(pr(L[i].a,fin)){k=i;break;} if(pr(flatFin(L[i]),fin)){k=i;inv=true;break;} }
    if(k<0)break;
    var nx=L.splice(k,1)[0]; if(inv)nx=flatInverser(nx);
    cur.s=cur.s.concat(nx.s);
  }
  if(!pr(flatFin(cur),cur.a)||cur.s.length<3)return null;
  function f(q){ return q[0].toFixed(2)+","+q[1].toFixed(2); }
  return "M "+f(cur.a)+" "+cur.s.map(function(g){ return g.t+" "+g.p.map(f).join(" "); }).join(" ")+" z";
}

/* ---------- construction de la planche ---------- */
function flatBuild(design,meas,opts){
  var parts=flatParts(design);
  if(!parts.length)return null;
  var pieces=[];
  parts.forEach(function(p){
    var x=flatPiece(design,p,meas,opts);
    if(x&&x.bbox&&x.bbox.w>3&&x.bbox.h>3)pieces.push(x);
  });
  if(!pieces.length)return null;
  var type=null;
  if(typeof FSALL!=="undefined"){ var x=FSALL.filter(function(d){return d.slug===design;})[0]; if(x)type=x.type; }
  return {design:design, type:type, pieces:pieces};
}

/* déforme un tracé absolu (M, L, C, Z — ce que produit FreeSewing) point par point */
function flatWarpD(d,f){
  var out=[], cmd="", nums=[];
  var tok=d.match(/[MLCZmlcz]|-?\d*\.?\d+(?:e[-+]?\d+)?/g)||[];
  function flush(){
    if(!cmd)return;
    if(/[Zz]/.test(cmd)){ out.push("z"); return; }
    var pts=[];
    for(var i=0;i+1<nums.length;i+=2){ var x=nums[i], y=nums[i+1]; pts.push(f(x,y).toFixed(2)+","+y.toFixed(2)); }
    out.push(cmd.toUpperCase()+" "+pts.join(" "));
  }
  tok.forEach(function(t){ if(/^[A-Za-z]$/.test(t)){ flush(); cmd=t; nums=[]; } else nums.push(parseFloat(t)); });
  flush();
  return out.join(" ");
}
/* un groupe SVG pour une pièce, reflétée si elle est coupée au pli */
function flatGroup(p,opt){
  opt=opt||{};
  var d=esc(window.FLAT_WARP?flatWarpD(p.d,window.FLAT_WARP):p.d);
  var fl=opt.fill||"none"; if(window.FLAT_PORTEE&&fl==="none")fl="#fff";
  var trait='fill="'+fl+'" stroke="#111" stroke-width="'+(opt.trait||2.2)+'" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"';
  var dr=' data-role="'+(p.role||"")+'"';   /* sert au tissu de contraste, pièce par pièce */
  var g='<path'+dr+' d="'+d+'" '+trait+'/>';
  /* vue portée : un modelé léger, sombre sur les côtés du corps, clair au milieu */
  var ombre="";
  if(window.FLAT_PORTEE){
    var gid="poC";
    if(p.fold&&p.fold.axe==="v")gid=(p.fold.v>p.bbox.x+p.bbox.w/2)?"poL":"poR";   /* le côté loin du pli est le flanc */
    ombre='<path d="'+d+'" fill="url(#'+gid+')" stroke="none" pointer-events="none"/>';
    g+=ombre;
  }
  if(p.fold&&p.fold.axe==="v"){
    if(window.FLAT_PORTEE)opt.pli=false;
    g+='<g transform="translate('+(2*p.fold.v).toFixed(2)+',0) scale(-1,1)"><path'+dr+' d="'+d+'" '+trait+'/>'+ombre+'</g>';
    /* le bord de pli est dessiné deux fois : on l'efface, il n'existe pas sur le vêtement */
    var y1=(p.bbox.y-2).toFixed(2), y2=(p.bbox.y+p.bbox.h+2).toFixed(2), fx=p.fold.v.toFixed(2);
    if(window.FLAT_PORTEE&&p.pts){
      /* portée : on n'efface que le long du pli, sans déborder sur la silhouette */
      var sur=p.pts.filter(function(q){ return Math.abs(q.x-p.fold.v)<1.5; }).map(function(q){ return q.y; });
      if(sur.length>1){ y1=(Math.min.apply(null,sur)+1.5).toFixed(2); y2=(Math.max.apply(null,sur)-1.5).toFixed(2); }
    }
    g+='<line x1="'+fx+'" y1="'+y1+'" x2="'+fx+'" y2="'+y2+'" stroke="#fff" stroke-width="'+((opt.trait||2.2)+2)+'" vector-effect="non-scaling-stroke"/>';
    if(opt.pli!==false)
      g+='<line x1="'+fx+'" y1="'+y1+'" x2="'+fx+'" y2="'+y2+
         '" stroke="#bbb" stroke-width="0.8" stroke-dasharray="7 4" vector-effect="non-scaling-stroke"/>';
  }
  return g;
}
/* emprise réelle d'une pièce une fois reflétée */
function flatSpan(p){
  var b=p.bbox;
  if(p.fold&&p.fold.axe==="v"){
    var x1=Math.min(b.x, 2*p.fold.v-(b.x+b.w));
    var x2=Math.max(b.x+b.w, 2*p.fold.v-b.x);
    return {x:x1,y:b.y,w:x2-x1,h:b.h};
  }
  return {x:b.x,y:b.y,w:b.w,h:b.h};
}

function flatAssemblable(board){
  if(!board)return false;
  /* bas et accessoires : les pièces à plat ne ressemblent pas au vêtement porté */
  if(board.type==="jupe"||board.type==="pantalon"||board.type==="accessoire")return false;
  /* plusieurs pièces devant (découpes princesse, devant droit/gauche, parementures) :
     les juxtaposer donnerait un dessin faux — la planche de pièces est plus honnête */
  var nd=board.pieces.filter(function(p){ return p.role==="devant"; }).length;
  var nb=board.pieces.filter(function(p){ return p.role==="dos"; }).length;
  if(nd>1||nb>1)return false;
  return nd+nb>0;
}

/* ---------- vue assemblée (hauts, robes) ou planche de pièces ---------- */
function flatSvg(board,mode){
  if(!board)return "";
  var P=board.pieces;
  var devant=P.filter(function(p){return p.role==="devant";})[0];
  var dos=P.filter(function(p){return p.role==="dos";})[0];
  var manche=P.filter(function(p){return p.role==="manche";})[0];
  var jupe=P.filter(function(p){return p.role==="jupe";})[0];
  var jambe=P.filter(function(p){return p.role==="jambe";})[0];
  /* une vue « vêtement » n'a de sens qu'avec un devant ou un dos : une jupe cercle
     ou une jambe seule ne ressemblent pas au vêtement porté. */
  if(mode==="pieces"||!flatAssemblable(board))return flatSvgPieces(board);

  function vue(principal,titre){
    if(!principal)return null;
    var s=flatSpan(principal), g="", gM="", deb=0, corpsBox=null, corpsLen=0;
    /* la silhouette à ses mesures, posée derrière le vêtement (même unité : le mm) */
    if(window.FLAT_CORPS&&typeof corpsSvgParts==="function"){
      try{
        var cr=corpsSvgParts(window.FLAT_CORPS_OPT||{});
        var cax=(principal.fold&&principal.fold.axe==="v")?principal.fold.v:(s.x+s.w/2);
        var cy=(principal.role==="devant"||principal.role==="dos")?s.y:(s.y-cr.M.yWaist);
        g+='<g transform="translate('+cax.toFixed(1)+','+cy.toFixed(1)+')" opacity="'+(window.FLAT_PORTEE?1:0.6)+'">'+cr.g+'</g>';
        corpsBox={x:cr.box.x+cax, y:cr.box.y+cy, w:cr.box.w, h:cr.box.h};
        corpsLen=g.length;
      }catch(e){}
    }
    var pad=30;
    /* Manches : la pièce est la manche entière déroulée ; vue à plat on n'en voit
       que la moitié. On l'accroche par le milieu de sa tête au point d'épaule,
       inclinée vers l'extérieur, comme sur un dessin technique. */
    /* vue portée : à plat, le vêtement montre la moitié de son tour ; porté, il s'enroule
       autour du corps et, de face, on n'en voit que ≈ tour / 2,9 (le même rapport que la
       silhouette, corpsDemi = tour / 5,8). On resserre donc la pièce autour de son axe :
       rien aux épaules (la carrure se voit telle quelle), 0,69 dès le dessous de bras. */
    var W=null;
    if(window.FLAT_PORTEE){
      var ahW=flatArmhole(principal);
      var axW=(principal.fold&&principal.fold.axe==="v")?principal.fold.v:(s.x+s.w/2);
      var yU=ahW?Math.max(ahW.U.y,ahW.S.y):(s.y+s.h*0.25);
      W={ax:axW, y0:s.y, y1:yU, k:2/2.9};
    }
    function kW(y){ if(!W)return 1; if(y<=W.y0)return 1; if(y>=W.y1)return W.k; var t=(y-W.y0)/(W.y1-W.y0); t=t*t*(3-2*t); return 1+(W.k-1)*t; }
    if(manche){
      var ms=flatSpan(manche);
      var cx=(ms.x+ms.w/2).toFixed(2), cy=ms.y.toFixed(2);
      var ang=window.FLAT_ANG||32, r=ang*Math.PI/180;
      var ah=flatArmhole(principal);
      var axe=ah?ah.axe:(s.x+s.w/2);
      var mx=ah?(Math.abs((ah.S.x+ah.U.x)/2-axe)):(s.w/2), my=ah?((ah.S.y+ah.U.y)/2):(s.y+s.h*0.15);
      var sxM=0.5, tuck=(ms.h*0.22).toFixed(1);
      if(W&&ah){
        var dem=ms.w*0.33/2;
        /* portée : la manche tombe le long du bras ; tête posée au point d'épaule,
           largeur vue de face ≈ tour de manche / π */
        mx=Math.abs(ah.S.x-axe)*kW(ah.S.y)+dem*0.55; my=ah.S.y+ms.h*0.02; sxM=0.33; tuck="0";
      }
      var epX=axe+mx, epX2=axe-mx, epY=my;
      /* on enfonce la tête de manche sous le corps : sur un dessin technique,
         la couture d'emmanchure est la seule chose visible à cet endroit. */
      var inner='<g transform="translate(0,'+tuck+') scale('+sxM+',1) translate('+(-cx)+','+(-cy)+')">'+flatGroup(manche,{trait:2,pli:false,fill:"#fff"})+'</g>';
      gM='<g transform="translate('+epX.toFixed(2)+','+epY.toFixed(2)+') rotate('+(-ang)+')">'+inner+'</g>'+
         '<g transform="translate('+epX2.toFixed(2)+','+epY.toFixed(2)+') scale(-1,1) rotate('+(-ang)+')">'+inner+'</g>';
      if(!W)g+=gM;   /* à plat, sous le corps ; portée, par-dessus (la couture d'emmanchure se voit) */
      deb=ms.w*0.5*Math.cos(r)+ms.h*Math.sin(r)+10;
    }
    window.FLAT_WARP=W?function(x,y){ return W.ax+(x-W.ax)*kW(y); }:null;
    try{ g+=flatGroup(principal,{trait:2.6,fill:manche?"#fff":"none"}); } finally{ window.FLAT_WARP=null; }
    if(W&&gM)g+=gM;
    var box={x:s.x-deb-pad, y:s.y-pad, w:s.w+deb*2+pad*2, h:s.h+pad*2};
    if(corpsBox){
      var x1=Math.min(box.x,corpsBox.x-10), x2=Math.max(box.x+box.w,corpsBox.x+corpsBox.w+10);
      var y1=Math.min(box.y,corpsBox.y), y2=Math.max(box.y+box.h,corpsBox.y+corpsBox.h);
      box={x:x1,y:y1,w:x2-x1,h:y2-y1};
    }
    if(manche){ var mh=flatSpan(manche).h, ah2=flatArmhole(principal);
      box.h=Math.max(box.h, (ah2?(ah2.S.y+ah2.U.y)/2:s.y)+mh*Math.cos((window.FLAT_ANG||32)*Math.PI/180)+pad-box.y); }
    return {g:g, box:box, titre:titre};
  }

  var vues=[];
  var v1=vue(devant||dos, "Devant");
  var v2=(devant&&dos)?vue(dos,"Dos"):null;
  if(v1)vues.push(v1); if(v2)vues.push(v2);
  if(!vues.length)return flatSvgPieces(board);

  var gap=90, x=0, H=0, W=0, body="", fsMax=0;
  vues.forEach(function(v){
    var fs=Math.min(42,Math.max(14,v.box.w*0.05)); fsMax=Math.max(fsMax,fs);
    body+='<g transform="translate('+(x-v.box.x).toFixed(2)+',0)">'+v.g+
          '<text x="'+(v.box.x+v.box.w/2).toFixed(2)+'" y="'+(v.box.y-fs*0.5).toFixed(2)+
          '" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="'+fs.toFixed(0)+'" fill="#666">'+esc(v.titre)+'</text></g>';
    x+=v.box.w+gap; W=x-gap; H=Math.max(H,v.box.y+v.box.h);
  });
  var y0=Math.min.apply(null,vues.map(function(v){return v.box.y;}))-fsMax*1.7;
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+(-10)+' '+y0.toFixed(2)+' '+(W+20).toFixed(2)+' '+(H-y0+20).toFixed(2)+'" width="100%">'+body+'</svg>';
}

function flatSvgPieces(board){
  var P=board.pieces.slice().sort(function(a,b){ return flatSpan(b).w*flatSpan(b).h-flatSpan(a).w*flatSpan(a).h; });
  var gap=40, x=0, ligneH=0, y=0, maxW=1400, body="", W=0;
  P.forEach(function(p){
    var s=flatSpan(p);
    var fs=Math.min(34,Math.max(13,s.w*0.08));
    if(x>0&&x+s.w>maxW){ x=0; y+=ligneH+gap+fs*1.8; ligneH=0; }
    body+='<g transform="translate('+(x-s.x).toFixed(2)+','+(y-s.y).toFixed(2)+')">'+flatGroup(p,{trait:2.2})+
      '<text x="'+(s.x+s.w/2).toFixed(2)+'" y="'+(s.y+s.h+fs*1.4).toFixed(2)+'" text-anchor="middle" '+
      'font-family="Helvetica,Arial,sans-serif" font-size="'+fs.toFixed(0)+'" fill="#666">'+esc(p.nom)+
      (p.fold?' · au pli':'')+'</text></g>';
    x+=s.w+gap; ligneH=Math.max(ligneH,s.h); W=Math.max(W,x-gap);
  });
  var H=y+ligneH+52;
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 '+(W+20).toFixed(2)+' '+(H+20).toFixed(2)+'" width="100%">'+body+'</svg>';
}

/* ---------- mesures finies, lues sur les pièces ---------- */
function flatCotes(board){
  var out=[];
  var d=board.pieces.filter(function(p){return p.role==="devant"||p.role==="jupe"||p.role==="jambe";})[0];
  if(d){
    var s=flatSpan(d);
    out.push({l:"Largeur du vêtement à plat", v:Math.round(s.w/10)+" cm"});
    out.push({l:"Longueur totale", v:Math.round(s.h/10)+" cm"});
    out.push({l:"Tour correspondant", v:Math.round(s.w*2/10)+" cm"});
  }
  var m=board.pieces.filter(function(p){return p.role==="manche";})[0];
  if(m){ var ms=flatSpan(m); out.push({l:"Longueur de manche", v:Math.round(ms.h/10)+" cm"}); }
  out.push({l:"Nombre de pièces", v:board.pieces.length});
  return out;
}

/* ---------- panneau d'options du modèle ---------- */
var FLAT_OPT_FR={
  chestEase:"Aisance poitrine", bicepsEase:"Aisance bras", collarEase:"Aisance encolure",
  cuffEase:"Aisance poignet", shoulderEase:"Aisance épaules", hipsEase:"Aisance hanches",
  waistEase:"Aisance taille", seatEase:"Aisance bassin", kneeEase:"Aisance genou",
  lengthBonus:"Longueur ajoutée", sleeveLengthBonus:"Longueur de manche",
  sleevecapEase:"Embu de tête de manche", necklineDepth:"Profondeur d'encolure",
  necklineWidth:"Largeur d'encolure", armholeDepth:"Profondeur d'emmanchure",
  collarFactor:"Hauteur de col", hemWidth:"Largeur d'ourlet", waistbandWidth:"Largeur de ceinture",
  fullness:"Ampleur", flare:"Évasement", rise:"Hauteur de taille", legWidth:"Largeur de jambe"

  /* ajout 19/09 : les options les plus visibles des 68 modèles */
  ,acrossBackFactor:"Carrure dos", backNeckCutout:"Échancrure d'encolure dos", armholeDepthFactor:"Profondeur d'emmanchure",
  draftForHighBust:"Tracer sur la poitrine haute", length:"Longueur", crossSeamCurveAngle:"Fourche dos : angle",
  crossSeamCurveBend:"Fourche dos : courbure", crossSeamCurveStart:"Fourche dos : départ", fitWaist:"Ajuster à la taille",
  crotchDrop:"Descente d'entrejambe", crotchSeamCurveAngle:"Fourche devant : angle", crotchSeamCurveBend:"Fourche devant : courbure",
  crotchSeamCurveStart:"Fourche devant : départ", frontArmholeDeeper:"Emmanchure devant plus creusée", bulge:"Galbe",
  size:"Taille", hem:"Ourlet", armholeDrop:"Descente d'emmanchure", lengthRatio:"Proportion de longueur", backRise:"Montant dos",
  stretch:"Élasticité du tissu", cuffWidth:"Largeur du poignet", construction:"Construction", dart:"Pince",
  dolmanSleeveLength:"Longueur de manche kimono", extraBustEase:"Aisance poitrine en plus", ease:"Aisance", waistband:"Ceinture",
  armholeDartCurved:"Pince d'emmanchure courbe", armholeDartCurvePoint:"Pince d'emmanchure : point", armholeDartCurveWidth:"Pince d'emmanchure : largeur",
  backOpening:"Ouverture dos", strapWidth:"Largeur de bretelle", backPocketDepth:"Profondeur de poche arrière",
  backPocketWidth:"Largeur de poche arrière", beltLoops:"Passants", backArmholeCurvature:"Courbure d'emmanchure dos",
  backArmholePitchDepth:"Repère d'emmanchure dos", backArmholeSlant:"Inclinaison d'emmanchure dos", backDartHeight:"Hauteur de pince dos",
  backHemSlope:"Pente de l'ourlet dos", knotWidth:"Largeur du nœud", tipWidth:"Largeur de la pointe", widthRatio:"Proportion de largeur",
  frontScyeDart:"Pince d'emmanchure devant", beltWidth:"Largeur de ceinture", buttonSpacingHorizontal:"Écart des boutons",
  panels:"Panneaux", waistReduction:"Réduction à la taille", flyWidth:"Largeur de braguette", curvedDarts:"Pinces courbes",
  headEase:"Aisance de tête", neckWidth:"Largeur d'encolure", pocket:"Poche", waistbandsize:"Hauteur de ceinture",
  waistlowering:"Taille abaissée", waistreduction:"Réduction à la taille", armholeDartPosition:"Position de la pince d'emmanchure",
  bustSpanEase:"Écart de poitrine", armLength:"Longueur de bras", fitKnee:"Ajuster au genou", elasticWidth:"Largeur d'élastique",
  backCoverage:"Couvrance du dos", backDarts:"Pinces dos", headRatio:"Proportion de tête", widthBonus:"Largeur ajoutée",
  backDip:"Descente du dos", backExposure:"Dos découvert", frontDip:"Descente du devant", frontExposure:"Devant découvert",
  gussetPosition:"Position du gousset", gussetWidth:"Largeur du gousset", knitBindingWidth:"Largeur de la bande en maille",
  necklineBend:"Courbure d'encolure", necklineDrop:"Descente d'encolure", shoulderStrapPlacement:"Position des bretelles",
  shoulderStrapWidth:"Largeur des bretelles", stretchFactor:"Élasticité", bibLength:"Longueur de bavette", bibWidth:"Largeur de bavette",
  chestDepth:"Profondeur de poitrine", collarBandHeight:"Hauteur du pied de col", legBonus:"Longueur de jambe ajoutée",
  legStretch:"Élasticité en largeur", backDrop:"Descente dos", frontDrop:"Descente devant", frontRise:"Montant devant",
  hipRise:"Montant aux hanches", cuffStyle:"Style de poignet", ventLength:"Longueur de fente", waistbandBelowWaist:"Ceinture sous la taille",
  articulatedKnee:"Genou articulé", armholeWidthBack:"Largeur d'emmanchure dos", armholeWidthFront:"Largeur d'emmanchure devant",
  bottomWidthBonus:"Ampleur du bas", bustEase:"Aisance poitrine", necklineCoverage:"Couvrance de l'encolure",
  sleeveLength:"Longueur de manche", sleevecapHeight:"Hauteur de tête de manche", drapeAngle:"Angle du drapé", curve:"Courbe",
  shoulderEase:"Aisance épaules", shoulderSlopeReduction:"Pente d'épaule réduite", sleeveWidth:"Largeur de manche",
  collarEase:"Aisance d'encolure", lengthBelowWaist:"Longueur sous la taille", torsoLength:"Longueur du buste"
};
function flatOptFr(k){
  if(FLAT_OPT_FR[k])return FLAT_OPT_FR[k];
  return k.replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/^./,function(c){return c.toUpperCase();});
}
/* on ne montre que ce qui parle : pourcentages et booléens des groupes utiles */
function flatOptions(design){
  var info=null; try{ info=FS.info(design); }catch(e){}
  if(!info)return [];
  var o=info.options||{}, out=[];
  Object.keys(o).forEach(function(k){
    var v=o[k];
    if(!v||typeof v!=="object")return;
    if(typeof v.pct!=="undefined"){
      out.push({k:k, type:"pct", def:v.pct, min:(v.min!=null?v.min:0), max:(v.max!=null?v.max:100)});
    } else if(typeof v.bool!=="undefined"){
      out.push({k:k, type:"bool", def:!!v.bool});
    } else if(v.list&&v.list.length&&v.list.length<=6){
      out.push({k:k, type:"list", def:v.dflt||v.list[0], list:v.list});
    } else if(typeof v.deg!=="undefined"){
      out.push({k:k, type:"deg", def:v.deg, min:(v.min!=null?v.min:0), max:(v.max!=null?v.max:45)});
    } else if(typeof v.count!=="undefined"){
      out.push({k:k, type:"count", def:v.count, min:(v.min!=null?v.min:0), max:(v.max!=null?v.max:12)});
    }
  });
  /* les plus parlantes d'abord */
  var prio=Object.keys(FLAT_OPT_FR);
  out.sort(function(a,b){
    var ia=prio.indexOf(a.k), ib=prio.indexOf(b.k);
    if(ia<0)ia=99; if(ib<0)ib=99;
    return ia-ib||a.k.localeCompare(b.k);
  });
  return out;
}

/* =====================================================================
 *  Vue technique — interface (onglet « Dessin technique » du Studio)
 * ===================================================================== */
var TK={slug:"teagan", mode:"assemble", vals:{}, board:null, busy:false};

function tkLabel(slug){
  if(typeof FSALL!=="undefined"){
    var x=FSALL.filter(function(d){return d.slug===slug;})[0];
    if(x)return x.name;
  }
  return slug;
}

function tkFillDesigns(){
  var sel=document.getElementById("tkDesign");
  if(!sel||!window.FS)return;
  var dispo={}; (FS.designs||[]).forEach(function(d){dispo[d]=1;});
  var groupes=[["top","Hauts"],["robe","Robes"],["jupe","Jupes"],["pantalon","Bas"],
               ["manteau","Vestes & manteaux"],["accessoire","Accessoires"],["autre","Autres"]];
  var liste=(typeof FSALL!=="undefined")?FSALL:[];
  var html="";
  groupes.forEach(function(g){
    var items=liste.filter(function(d){return (d.type||"autre")===g[0]&&dispo[d.slug];});
    if(!items.length)return;
    html+='<optgroup label="'+esc(g[1])+'">';
    items.forEach(function(d){ html+='<option value="'+esc(d.slug)+'">'+esc(d.name)+'</option>'; });
    html+='</optgroup>';
  });
  if(!html)html=(FS.designs||[]).map(function(d){return '<option value="'+esc(d)+'">'+esc(d)+'</option>';}).join("");
  sel.innerHTML=html;
  sel.value=TK.slug;
  if(!sel.value){ sel.selectedIndex=0; TK.slug=sel.value; }
}

/* ----- panneau d'options ----- */
function tkOptsRender(){
  var box=document.getElementById("tkOpts"); if(!box)return;
  var opts=flatOptions(TK.slug).slice(0,14);
  document.getElementById("tkOptCount").textContent=opts.length?opts.length+" réglages":"";
  if(!opts.length){ box.innerHTML='<p class="muted" style="font-size:12.5px;">Ce modèle n\'a pas d\'option réglable.</p>'; return; }
  var h="";
  opts.forEach(function(o){
    var v=(TK.vals[o.k]!=null)?TK.vals[o.k]:o.def;
    var id="tko_"+o.k;
    h+='<div class="tk-opt"><label class="fld" style="margin:0;">'+esc(flatOptFr(o.k));
    if(o.type==="pct"||o.type==="deg"||o.type==="count")
      h+=' <span class="muted" id="'+id+'_v">'+tkFmt(o,v)+'</span>';
    h+='</label>';
    if(o.type==="pct")
      h+='<input type="range" id="'+id+'" min="'+o.min+'" max="'+o.max+'" step="0.5" value="'+v+'" oninput="tkSet(\''+o.k+'\',this.value,\'pct\')">';
    else if(o.type==="deg")
      h+='<input type="range" id="'+id+'" min="'+o.min+'" max="'+o.max+'" step="1" value="'+v+'" oninput="tkSet(\''+o.k+'\',this.value,\'deg\')">';
    else if(o.type==="count")
      h+='<input type="range" id="'+id+'" min="'+o.min+'" max="'+o.max+'" step="1" value="'+v+'" oninput="tkSet(\''+o.k+'\',this.value,\'count\')">';
    else if(o.type==="bool")
      h+='<label style="font-size:13px;display:inline-flex;align-items:center;gap:6px;"><input type="checkbox" id="'+id+'" '+(v?"checked":"")+' onchange="tkSet(\''+o.k+'\',this.checked,\'bool\')"> activer</label>';
    else if(o.type==="list")
      h+='<select id="'+id+'" onchange="tkSet(\''+o.k+'\',this.value,\'list\')">'+o.list.map(function(x){
            return '<option'+(x===v?" selected":"")+'>'+esc(String(x))+'</option>';}).join("")+'</select>';
    h+='</div>';
  });
  box.innerHTML=h;
}
function tkFmt(o,v){
  if(o.type==="pct")return Math.round(v)+" %";
  if(o.type==="deg")return Math.round(v)+"°";
  return String(v);
}
var _tkT=null;
function tkSet(k,v,type){
  if(type==="bool")TK.vals[k]=!!v;
  else if(type==="list")TK.vals[k]=v;
  else {
    TK.vals[k]=parseFloat(v);
    var lbl=document.getElementById("tko_"+k+"_v");
    if(lbl)lbl.textContent=tkFmt({type:type},TK.vals[k]);
  }
  clearTimeout(_tkT); _tkT=setTimeout(tkDraw,320);
}
function tkReset(){ TK.vals={}; tkOptsRender(); tkDraw(); }

/* valeurs prêtes pour le moteur : les pourcentages partent en fraction */
function tkEngineOpts(){
  var defs=flatOptions(TK.slug), o={};
  defs.forEach(function(d){
    if(TK.vals[d.k]==null)return;
    o[d.k]=(d.type==="pct")?TK.vals[d.k]/100:TK.vals[d.k];
  });
  return o;
}

/* ----- dessin ----- */
function tkFini(){
  TK.busy=false;
  if(TK._encore){ TK._encore=false; setTimeout(tkDraw,10); }
}
function tkDraw(){
  var wrap=document.getElementById("tkWrap"); if(!wrap)return;
  if(!window.FS||typeof FS.draftSvg!=="function"){
    wrap.innerHTML='<p class="muted" style="padding:20px;">Moteur non chargé. Recharge la page en ligne.</p>'; return;
  }
  /* un rendu en cours ne doit pas faire perdre la demande suivante */
  if(TK.busy){ TK._encore=true; return; }
  TK.busy=true;
  wrap.innerHTML='<p class="muted" style="padding:24px;text-align:center;"><span class="spin"></span> Construction du dessin technique…</p>';
  var note=document.getElementById("tkNote"); if(note)note.textContent="";
  setTimeout(function(){
    try{
      var meas=(typeof fsOverrides==="function")?fsOverrides():{};
      var board=flatBuild(TK.slug, meas, tkEngineOpts());
      TK.board=board;
      if(!board){ wrap.innerHTML='<p class="muted" style="padding:24px;">Ce modèle n\'a pas pu être dessiné avec tes mesures. Complète ton profil, ou choisis-en un autre.</p>'; TK.busy=false; return; }
      var forcee=(TK.mode!=="pieces"&&!flatAssemblable(board));
      /* on garde le choix de vue : le modèle suivant pourra de nouveau s'afficher assemblé ou porté */
      wrap.innerHTML='<div class="tk-svg">'+flatSvg(board,forcee?"pieces":TK.mode)+'</div>';
      tkCotes();
      if(forcee&&note){ note.textContent="Ce modèle se lit mieux pièce par pièce : sa forme à plat n'a rien à voir avec sa silhouette portée. Pièces du patron de « "+tkLabel(TK.slug)+" », à tes mesures."; tkFini(); return; }
      if(note)note.textContent="Dessin construit à partir du patron réel de « "+tkLabel(TK.slug)+" », à tes mesures. Chaque trait est une couture ou un bord du vêtement.";
    }catch(e){
      wrap.innerHTML='<p class="muted" style="padding:24px;">Erreur : '+esc(String((e&&e.message)||e).slice(0,140))+'</p>';
    }
    tkFini();
  },30);
}
function tkCotes(){
  var box=document.getElementById("tkCotes"); if(!box)return;
  if(!TK.board){ box.innerHTML=""; return; }
  var c=flatCotes(TK.board);
  box.innerHTML=c.map(function(x){
    return '<div class="tk-cote"><span>'+esc(x.l)+'</span><b>'+esc(String(x.v))+'</b></div>';
  }).join("")+'<p class="muted" style="font-size:11.5px;margin-top:8px;">Mesures du vêtement fini, sans marges de couture.</p>';
}

/* ----- sorties ----- */
function tkSvgString(){
  var el=document.querySelector("#tkWrap svg");
  return el?new XMLSerializer().serializeToString(el):"";
}
function tkExport(kind){
  var svg=tkSvgString();
  if(!svg){ toast("Dessine d'abord le vêtement"); return; }
  var nom=tkLabel(TK.slug).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  if(kind==="svg"){
    var b=new Blob([svg],{type:"image/svg+xml"});
    tkDownload(URL.createObjectURL(b), nom+"-technique.svg");
    return;
  }
  var img=new Image();
  img.onload=function(){
    var W=1600, H=Math.round(W*(img.height/img.width))||1200;
    var cv=document.createElement("canvas"); cv.width=W; cv.height=H;
    var cx=cv.getContext("2d"); cx.fillStyle="#fff"; cx.fillRect(0,0,W,H);
    cx.drawImage(img,0,0,W,H);
    tkDownload(cv.toDataURL("image/png"), nom+"-technique.png");
  };
  img.onerror=function(){ toast("Export impossible"); };
  img.src="data:image/svg+xml;base64,"+btoa(unescape(encodeURIComponent(svg)));
}
function tkDownload(url,name){
  var a=document.createElement("a"); a.href=url; a.download=name;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(function(){ if(url.indexOf("blob:")===0)URL.revokeObjectURL(url); },2000);
}
function tkToCarnet(){
  if(typeof state==="undefined")return;
  state.projets.unshift({id:uid(),name:tkLabel(TK.slug),piece:"Patron sur mesure",diff:"Intermédiaire",stat:"envie",tissu:"",date:""});
  save();
  if(typeof renderProjets==="function"){renderProjets();renderCarnetStats();}
  toast("Ajouté au carnet");
}
function tkToPatron(){
  window._tkOpts={slug:TK.slug, opts:tkEngineOpts()};
  goView("patrons");
  if(typeof setPatMode==="function")setPatMode("creer");
  var sel=document.getElementById("fsDesign");
  if(sel){ sel.value=TK.slug; }
  if(typeof fsGenerate==="function")fsGenerate();
}

/* le générateur de patron reprend les options réglées ici */
var _tkBaseGen=window.fsGenerate;
window.fsGenerate=function(){
  var sel=document.getElementById("fsDesign"), st=document.getElementById("fsStatus"), out=document.getElementById("fsOut");
  if(!sel||!window.FS||typeof FS.draftSvg!=="function")return _tkBaseGen&&_tkBaseGen();
  var name=sel.value;
  var opts=(window._tkOpts&&window._tkOpts.slug===name)?window._tkOpts.opts:{};
  out.innerHTML=""; st.innerHTML='<span class="spin"></span> Génération de ton patron sur mesure…';
  setTimeout(function(){
    try{
      var meas=(typeof fsOverrides==="function")?fsOverrides():{};
      var r=FS.draftSvg(name,{measurements:meas, options:opts});
      if(!r||!r.svg||r.svg.indexOf("<svg")<0)throw new Error("rendu vide");
      var svg=(typeof styleFsSvg==="function")?styleFsSvg(r.svg):r.svg;
      window._fsSvg=svg;
      out.innerHTML='<div style="padding:10px;overflow:auto;max-height:560px;background:#fff;border-radius:10px;border:1px solid var(--line);">'+svg+'</div>';
      st.innerHTML='Patron « '+esc(tkLabel(name))+' » généré à tes mesures'+(Object.keys(opts).length?' (avec tes réglages du dessin technique)':'')+
        '. <button class="btn ghost sm" onclick="fsPrint()">Imprimer</button> <button class="btn ghost sm" onclick="fsToCarnet(\''+name+'\')">+ carnet</button>';
    }catch(e){
      st.innerHTML='Erreur de génération : '+esc(String((e&&e.message)||e).slice(0,140));
    }
  },40);
};

/* ----- branchement de l'onglet ----- */
function tkShow(){
  var el=document.getElementById("studioTech"); if(!el)return;
  el.style.display="block";
  if(!TK._init){
    TK._init=true;
    tkFillDesigns();
    var sel=document.getElementById("tkDesign");
    if(sel)sel.addEventListener("change",function(){ TK.slug=sel.value; TK.vals={}; tkOptsRender(); tkDraw(); });
    document.querySelectorAll("#tkMode button").forEach(function(b){
      b.addEventListener("click",function(){
        document.querySelectorAll("#tkMode button").forEach(function(n){n.classList.remove("on");});
        b.classList.add("on"); TK.mode=b.dataset.m; tkDraw();
      });
    });
    tkOptsRender();
    tkVersRender();
    tkDraw();
  }
}
document.addEventListener("DOMContentLoaded",function(){
  document.querySelectorAll("#studioMode button").forEach(function(b){
    b.addEventListener("click",function(){
      var s=b.dataset.s, el=document.getElementById("studioTech");
      if(!el)return;
      if(s==="tech")tkShow(); else el.style.display="none";
    });
  });
});
window.tkSet=tkSet; window.tkDraw=tkDraw; window.tkReset=tkReset;
window.tkExport=tkExport; window.tkToCarnet=tkToCarnet; window.tkToPatron=tkToPatron;

/* ---------- « ma version » : réglages enregistrés par modèle ---------- */
function tkVersions(){
  if(typeof state==="undefined")return [];
  if(!state.variantes)state.variantes=[];
  return state.variantes.filter(function(v){ return v.slug===TK.slug; });
}
function tkSaveVersion(){
  if(typeof state==="undefined")return;
  if(!state.variantes)state.variantes=[];
  var n=tkVersions().length+1;
  var nom=prompt("Nom de cette version :", tkLabel(TK.slug).split("—")[0].trim()+" v"+n);
  if(nom===null)return;
  state.variantes.unshift({
    id:uid(), slug:TK.slug, nom:(nom||("Version "+n)).slice(0,40),
    vals:JSON.parse(JSON.stringify(TK.vals)), date:new Date().toISOString().slice(0,10)
  });
  save(); tkVersRender(); toast("Version enregistrée");
}
function tkLoadVersion(id){
  /* uid() peut rendre un nombre ; l'attribut onclick, lui, passe une chaîne */
  var v=(state.variantes||[]).filter(function(x){return String(x.id)===String(id);})[0];
  if(!v)return;
  TK.vals=JSON.parse(JSON.stringify(v.vals||{}));
  tkOptsRender(); tkDraw(); toast("« "+v.nom+" » chargée");
}
function tkDelVersion(id,ev){
  if(ev)ev.stopPropagation();
  state.variantes=(state.variantes||[]).filter(function(x){return String(x.id)!==String(id);});
  save(); tkVersRender();
}
function tkVersRender(){
  var box=document.getElementById("tkVers"); if(!box)return;
  var L=tkVersions();
  if(!L.length){ box.innerHTML='<p class="muted" style="font-size:11.5px;margin:6px 0 0;">Règle le modèle puis enregistre-le comme version, pour comparer deux idées.</p>'; return; }
  box.innerHTML=L.map(function(v){
    var n=Object.keys(v.vals||{}).length;
    return '<div class="tk-ver" onclick="tkLoadVersion(\''+v.id+'\')"><span class="nm">'+esc(v.nom)+'</span>'+
      '<span class="muted" style="font-size:11px;">'+n+' rég.</span>'+
      '<button title="Supprimer" onclick="tkDelVersion(\''+v.id+'\',event)">✕</button></div>';
  }).join("");
}

/* ---------- comparateur ---------- */
function tkCompare(){
  var L=tkVersions().slice(0,2);
  var wrap=document.getElementById("tkWrap"); if(!wrap)return;
  var meas=(typeof fsOverrides==="function")?fsOverrides():{};
  wrap.innerHTML='<p class="muted" style="padding:24px;text-align:center;"><span class="spin"></span> Comparaison…</p>';
  setTimeout(function(){
    var cols=[{nom:"Réglages en cours", vals:TK.vals}].concat(L.map(function(v){ return {nom:v.nom, vals:v.vals}; }));
    var html='<div class="tk-cmp">';
    cols.forEach(function(c){
      var vals=c.vals||{}, o={};
      flatOptions(TK.slug).forEach(function(d){ if(vals[d.k]!=null)o[d.k]=(d.type==="pct")?vals[d.k]/100:vals[d.k]; });
      var b=null; try{ b=flatBuild(TK.slug, meas, o); }catch(e){}
      html+='<div class="col"><h4>'+esc(c.nom)+'</h4>'+(b?flatSvg(b,TK.mode):'<p class="muted">non calculable</p>')+
        '<div class="lst">'+(b?flatCotes(b).slice(0,3).map(function(x){ return esc(x.l)+" : <b>"+esc(String(x.v))+"</b>"; }).join("<br>"):"")+'</div></div>';
    });
    html+='</div>';
    wrap.innerHTML=html;
    var note=document.getElementById("tkNote");
    if(note)note.textContent=cols.length>1
      ? "Comparaison des réglages en cours avec tes versions enregistrées. Clique « Redessiner » pour revenir à la vue normale."
      : "Aucune version enregistrée pour ce modèle : règle les options puis « Enregistrer cette version » pour comparer deux idées côte à côte.";
  },30);
}
window.tkSaveVersion=tkSaveVersion; window.tkLoadVersion=tkLoadVersion;
window.tkDelVersion=tkDelVersion; window.tkCompare=tkCompare;

/* ---------- silhouette en fond ---------- */
function tkCorps(){
  window.FLAT_CORPS=!window.FLAT_CORPS;
  var b=document.getElementById("tkCorpsBtn");
  if(b)b.classList.toggle("on",!!window.FLAT_CORPS);
  if(window.FLAT_CORPS&&TK.mode==="pieces"){
    TK.mode="assemble";
    document.querySelectorAll("#tkMode button").forEach(function(n){ n.classList.toggle("on",n.dataset.m==="assemble"); });
  }
  tkDraw();
  if(window.FLAT_CORPS&&typeof corpsMesures==="function"){
    var M=corpsMesures();
    toast(M.reelles>=8?"Silhouette construite sur tes mesures":"Silhouette approchée : complète tes mesures pour l'ajuster");
  }
}
window.tkCorps=tkCorps;
