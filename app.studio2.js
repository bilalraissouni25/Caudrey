"use strict";
/* ===== STUDIO v2 : calques, guides + magnétisme, historique, devant/dos, designs sauvegardés, export, rendu IA depuis le croquis ===== */
(function(){
  var W=480, H=620;
  var PROPS=["name","locked","selectable","evented","_isManne","_isBg","hasControls","lockMovementX","lockMovementY","lockRotation","lockScalingX","lockScalingY","hoverCursor"];
  var DRAFT_KEY="monAtelierCouture_studioDraft";
  var st={view:"devant",views:{devant:null,dos:null},designId:null,snap:true,grid:false,zoom:1,hist:{devant:[],dos:[]},hidx:{devant:-1,dos:-1},restoring:false,exporting:false,guides:[],clip:null,ready:false};
  window.stState=st;

  /* ---------- ordre des catégories ---------- */
  if(typeof EL!=="undefined"){
    var order=["Silhouettes","Robes & jupes","Hauts","Bas","Cols & encolures","Cols +","Cols & finitions","Manches","Manches +","Bas & volumes","Détails","Détails +","Accessoires","Technique","Formes"];
    var copy={}; order.forEach(function(k){if(EL[k])copy[k]=EL[k];}); Object.keys(EL).forEach(function(k){if(!copy[k])copy[k]=EL[k];});
    Object.keys(EL).forEach(function(k){delete EL[k];}); Object.keys(copy).forEach(function(k){EL[k]=copy[k];});
    if(typeof cmpBuildCats==="function"&&document.getElementById("cmpCat"))cmpBuildCats();
  }

  /* ---------- mannequin (croquis de mode, devant / dos) ---------- */
  function manneSVG(view){
    /* silhouette construite sur ses mesures quand app.corps.js est là */
    if(typeof window.corpsSvg==="function"){
      try{ return window.corpsSvg({trait:"#8f8279", ep:7, reperes:view!=="dos"}); }catch(e){}
    }
    var s="#8f8279", w=2.6;
    var body='<ellipse cx="100" cy="40" rx="21" ry="27" fill="none" stroke="'+s+'" stroke-width="'+w+'"/>'+
      '<path d="M91 66 L90 84 M109 66 L110 84" stroke="'+s+'" stroke-width="'+w+'" fill="none"/>'+
      '<path d="M90 84 Q100 80 110 84 L150 92 Q156 96 152 104 L140 130 Q136 170 130 200 Q128 240 138 262 L134 300 Q122 320 100 316 Q78 320 66 300 L62 262 Q72 240 70 200 Q64 170 60 130 L48 104 Q44 96 50 92 Z" fill="none" stroke="'+s+'" stroke-width="'+w+'"/>'+
      '<path d="M50 96 Q34 150 34 200 Q30 250 26 300 Q24 312 32 318 M150 96 Q166 150 166 200 Q170 250 174 300 Q176 312 168 318" fill="none" stroke="'+s+'" stroke-width="'+w+'"/>'+
      '<path d="M66 300 Q64 380 70 460 Q74 530 72 596 L92 596 Q92 520 96 460 Q100 400 100 340 Q100 400 104 460 Q108 520 108 596 L128 596 Q126 530 130 460 Q136 380 134 300" fill="none" stroke="'+s+'" stroke-width="'+w+'"/>';
    if(view==="dos"){
      body+='<path d="M100 84 L100 316" stroke="'+s+'" stroke-width="1.6" stroke-dasharray="6 5" fill="none"/>'+
        '<path d="M80 100 Q90 120 84 140 M120 100 Q110 120 116 140" stroke="'+s+'" stroke-width="1.6" fill="none"/>';
    }else{
      body+='<path d="M92 34 Q96 30 100 34 M100 34 Q104 30 108 34 M100 40 L100 48 M94 54 Q100 58 106 54" stroke="'+s+'" stroke-width="1.5" fill="none"/>'+
        '<path d="M72 200 L128 200" stroke="'+s+'" stroke-width="1.2" stroke-dasharray="4 4" fill="none"/>';
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 620">'+body+'</svg>';
  }

  /* ---------- helpers ---------- */
  function ready(){return typeof fc!=="undefined"&&fc&&window.fabric;}
  function objs(){return fc.getObjects();}
  function nameOf(o){if(o.name)return o.name;if(o.type==="textbox"||o.type==="i-text"||o.type==="text")return (o.text||"Texte").slice(0,18);if(o._isManne)return "Mannequin";if(o.type==="group")return "Groupe";if(o.type==="rect")return "Rectangle";if(o.type==="image")return "Image";return o.type||"Élément";}
  function fillOf(o){var f=null;(function walk(x){if(f)return;if(x._objects&&x._objects.length){x._objects.forEach(walk);return;}if(typeof x.fill==="string"&&x.fill&&x.fill!=="none")f=x.fill;else if(x.fill&&x.fill.source)f="pattern";else if(typeof x.stroke==="string"&&x.stroke&&x.stroke!=="none")f=x.stroke;})(o);return f||"#ccc";}
  function snapshot(){return JSON.stringify(fc.toJSON(PROPS));}
  function activeObjs(){return fc.getActiveObjects();}
  function setLocked(o,l){o.locked=!!l;o.set({lockMovementX:l,lockMovementY:l,lockRotation:l,lockScalingX:l,lockScalingY:l,hasControls:!l,hoverCursor:l?"not-allowed":"move"});}
  function download(name,href){var a=document.createElement("a");a.href=href;a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);},100);}
  function slug(s){return (s||"design").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"design";}

  /* ---------- historique ---------- */
  var histT=null;
  function pushHist(){if(st.restoring||!st.ready)return;clearTimeout(histT);histT=setTimeout(function(){if(st.restoring)return;var s=snapshot(),h=st.hist[st.view],i=st.hidx[st.view];if(h[i]===s)return;h=h.slice(0,i+1);h.push(s);if(h.length>60)h.shift();st.hist[st.view]=h;st.hidx[st.view]=h.length-1;updHistBtns();saveDraft();},30);}
  function updHistBtns(){var u=$("stUndo"),r=$("stRedo");if(!u)return;u.disabled=st.hidx[st.view]<=0;r.disabled=st.hidx[st.view]>=st.hist[st.view].length-1;u.style.opacity=u.disabled?.45:1;r.style.opacity=r.disabled?.45:1;}
  function restore(json,cb){st.restoring=true;fc.discardActiveObject();fc.loadFromJSON(json||{objects:[],background:"#ffffff"},function(){fc.backgroundColor=fc.backgroundColor||"#ffffff";relink();fc.requestRenderAll();st.restoring=false;refreshLayers();syncProps();if(cb)cb();});}
  function relink(){window._cmpManne=null;objs().forEach(function(o){if(o._isManne){window._cmpManne=o;o.set({selectable:false,evented:false});}if(o.locked)setLocked(o,true);});$("stManneBtn").classList.toggle("on",!!window._cmpManne);}
  window.stUndo=function(){var i=st.hidx[st.view];if(i<=0)return;st.hidx[st.view]=i-1;restore(st.hist[st.view][i-1],function(){updHistBtns();saveDraft();});};
  window.stRedo=function(){var h=st.hist[st.view],i=st.hidx[st.view];if(i>=h.length-1)return;st.hidx[st.view]=i+1;restore(h[i+1],function(){updHistBtns();saveDraft();});};

  /* ---------- brouillon auto ---------- */
  var draftT=null;
  function saveDraft(){clearTimeout(draftT);draftT=setTimeout(function(){try{var v={};v[st.view]=snapshot();var other=st.view==="devant"?"dos":"devant";v[other]=st.views[other];localStorage.setItem(DRAFT_KEY,JSON.stringify({views:v,view:st.view,designId:st.designId,title:$("stTitle").value}));}catch(e){}},400);}
  function loadDraft(){try{var d=JSON.parse(localStorage.getItem(DRAFT_KEY)||"null");if(!d||!d.views)return false;st.views=d.views;st.view=d.view||"devant";st.designId=d.designId||null;$("stTitle").value=d.title||"";document.querySelectorAll("#stView button").forEach(function(b){b.classList.toggle("on",b.dataset.w===st.view);});restore(st.views[st.view],function(){resetHist();});return true;}catch(e){return false;}}
  function resetHist(){st.hist={devant:[],dos:[]};st.hidx={devant:-1,dos:-1};st.hist[st.view].push(snapshot());st.hidx[st.view]=0;var o=st.view==="devant"?"dos":"devant";if(st.views[o]){st.hist[o].push(st.views[o]);st.hidx[o]=0;}updHistBtns();}

  /* ---------- devant / dos ---------- */
  window.stSetView=function(v){if(!ready()||v===st.view)return;st.views[st.view]=snapshot();st.view=v;document.querySelectorAll("#stView button").forEach(function(b){b.classList.toggle("on",b.dataset.w===v);});var hadManne=!!window._cmpManne;restore(st.views[v],function(){if(!st.views[v]&&hadManne)stMannequin(true);if(st.hidx[v]<0){st.hist[v]=[snapshot()];st.hidx[v]=0;}updHistBtns();saveDraft();});};

  /* ---------- mannequin ---------- */
  window.stMannequin=function(force){if(!ready())return;if(window._cmpManne&&force!==true){fc.remove(window._cmpManne);window._cmpManne=null;$("stManneBtn").classList.remove("on");fc.requestRenderAll();return;}if(window._cmpManne)return;fabric.loadSVGFromString(manneSVG(st.view),function(o2,opts){var o=fabric.util.groupSVGElements(o2,opts);o.set({originX:"center",originY:"center",left:W/2,top:H/2+4,selectable:false,evented:false,opacity:0.28,name:"Mannequin ("+st.view+")",_isManne:true});setLocked(o,true);o.scaleToHeight(H-24);fc.add(o);fc.sendToBack(o);window._cmpManne=o;$("stManneBtn").classList.add("on");fc.requestRenderAll();});};
  window.cmpMannequin=function(){stMannequin();};

  /* ---------- ajout d'éléments (nommés) ---------- */
  window.cmpAdd=function(el){if(!ready())return;fabric.loadSVGFromString(el.svg,function(o2,opts){var o=fabric.util.groupSVGElements(o2,opts);o.set({originX:"center",originY:"center",left:W/2,top:H/2,name:el.n});o.scaleToWidth(el.w||140);fc.add(o);fc.setActiveObject(o);fc.requestRenderAll();});};
  function elBtn(el){var btn=document.createElement("button");btn.className="btn ghost sm";btn.title=el.n;btn.innerHTML='<span>'+el.svg.replace("<svg",'<svg width="40" height="40"')+'</span><span>'+el.n+'</span>';btn.addEventListener("click",function(){cmpAdd(el);});return btn;}
  window.cmpRenderEls=function(){var box=$("cmpElements");if(!box)return;box.innerHTML="";var q=(($("stSearch")||{}).value||"").trim().toLowerCase();var list=[];if(q){Object.keys(EL).forEach(function(k){EL[k].forEach(function(e){if(e.n.toLowerCase().indexOf(q)>=0)list.push(e);});});}else list=EL[cmpCat]||[];if(!list.length){box.innerHTML='<div class="st-empty" style="grid-column:1/-1;">Aucun élément</div>';return;}list.forEach(function(el){box.appendChild(elBtn(el));});};

  /* ---------- calques ---------- */
  var dragIdx=null;
  function refreshLayers(){var box=$("stLayers");if(!box||!ready())return;var list=objs().slice().reverse(),act=activeObjs();box.innerHTML="";$("stLayerCount").textContent=list.length?list.length+(list.length>1?" calques":" calque"):"";if(!list.length){box.innerHTML='<div class="st-empty">Ajoute un élément depuis la bibliothèque.</div>';cmpItems=[];return;}
    cmpItems=list.filter(function(o){return !o._isManne&&o.visible!==false;}).map(nameOf);
    list.forEach(function(o,ri){var idx=list.length-1-ri;var row=document.createElement("div");row.className="st-layer"+(act.indexOf(o)>=0?" sel":"")+(o.visible===false?" hid":"");row.draggable=true;
      var f=fillOf(o);var ico=f==="pattern"?'<span class="ico" style="background:repeating-linear-gradient(45deg,#9c5d7c 0 3px,#f3e7ee 3px 6px);"></span>':'<span class="ico" style="background:'+f+';"></span>';
      row.innerHTML=ico+'<span class="nm" title="'+esc(nameOf(o))+'">'+esc(nameOf(o))+'</span><button class="eye'+(o.visible===false?"":" on")+'" title="Afficher / masquer">'+(o.visible===false?"&#9711;":"&#9673;")+'</button><button class="lock'+(o.locked?" on":"")+'" title="Verrouiller">'+(o.locked?"&#128274;":"&#128275;")+'</button><button class="del" title="Supprimer">&#10005;</button>';
      row.addEventListener("click",function(e){if(e.target.tagName==="BUTTON"||e.target.tagName==="INPUT")return;if(o._isManne){toast("Le mannequin est un guide : déverrouille-le pour le manipuler");return;}if(e.shiftKey&&act.length){var sel=act.concat([o]);fc.discardActiveObject();var as=new fabric.ActiveSelection(sel,{canvas:fc});fc.setActiveObject(as);}else fc.setActiveObject(o);fc.requestRenderAll();});
      row.querySelector(".eye").addEventListener("click",function(){o.visible=o.visible===false;if(o.visible===false&&act.indexOf(o)>=0)fc.discardActiveObject();fc.requestRenderAll();refreshLayers();pushHist();});
      row.querySelector(".lock").addEventListener("click",function(){var l=!o.locked;setLocked(o,l);if(o._isManne){o.set({selectable:!l,evented:!l});if(!l){fc.setActiveObject(o);}}fc.requestRenderAll();refreshLayers();pushHist();});
      row.querySelector(".del").addEventListener("click",function(){fc.remove(o);if(o._isManne){window._cmpManne=null;$("stManneBtn").classList.remove("on");}fc.requestRenderAll();});
      row.querySelector(".nm").addEventListener("dblclick",function(){var inp=document.createElement("input");inp.type="text";inp.value=nameOf(o);this.replaceWith(inp);inp.focus();inp.select();function done(){o.name=inp.value.trim()||nameOf(o);refreshLayers();pushHist();}inp.addEventListener("blur",done);inp.addEventListener("keydown",function(e){if(e.key==="Enter")inp.blur();if(e.key==="Escape"){inp.value=nameOf(o);inp.blur();}e.stopPropagation();});});
      row.addEventListener("dragstart",function(e){dragIdx=idx;e.dataTransfer.effectAllowed="move";});
      row.addEventListener("dragover",function(e){e.preventDefault();row.classList.add("dragover");});
      row.addEventListener("dragleave",function(){row.classList.remove("dragover");});
      row.addEventListener("drop",function(e){e.preventDefault();row.classList.remove("dragover");if(dragIdx===null||dragIdx===idx)return;var mv=objs()[dragIdx];fc.moveTo(mv,idx);dragIdx=null;fc.requestRenderAll();refreshLayers();pushHist();});
      box.appendChild(row);});}
  window.stOrder=function(where){var a=activeObjs();if(!a.length)return;a.forEach(function(o){if(where==="front")fc.bringToFront(o);else fc.sendToBack(o);});if(where==="back"&&window._cmpManne)fc.sendToBack(window._cmpManne);fc.requestRenderAll();refreshLayers();pushHist();};

  /* ---------- propriétés ---------- */
  var syncing=false;
  function syncProps(){var a=fc.getActiveObject();syncing=true;var nm=$("stSelName");if(!a){nm.textContent="aucune sélection";$("stProps").style.opacity=.55;}else{nm.textContent=a.type==="activeSelection"?a._objects.length+" éléments":nameOf(a);$("stProps").style.opacity=1;$("stOpacity").value=Math.round((a.opacity==null?1:a.opacity)*100);$("stOpacityOut").textContent=$("stOpacity").value;$("stAngle").value=Math.round(a.angle||0);$("stWidth").value=Math.round(a.getScaledWidth());var sw=null,sc=null;(function walk(x){if(x._objects&&x._objects.length){x._objects.forEach(walk);return;}if(sw===null&&x.strokeWidth!=null&&x.stroke&&x.stroke!=="none"){sw=x.strokeWidth;sc=x.stroke;}})(a);if(sw!==null){$("stStrokeW").value=sw;$("stStrokeWOut").textContent=sw;if(/^#[0-9a-f]{6}$/i.test(sc))$("stStroke").value=sc;}}syncing=false;}
  function eachActive(fn){var a=fc.getActiveObject();if(!a)return false;if(a.type==="activeSelection")a._objects.forEach(fn);else fn(a);fc.requestRenderAll();return true;}
  function bind(){
    $("stOpacity").addEventListener("input",function(){if(syncing)return;var v=parseInt(this.value,10)/100;$("stOpacityOut").textContent=this.value;eachActive(function(o){o.set("opacity",v);});});
    $("stOpacity").addEventListener("change",pushHist);
    $("stAngle").addEventListener("change",function(){if(syncing)return;var a=fc.getActiveObject();if(!a)return;a.rotate(parseFloat(this.value)||0);a.setCoords();fc.requestRenderAll();pushHist();});
    $("stWidth").addEventListener("change",function(){if(syncing)return;var a=fc.getActiveObject();if(!a)return;var w=parseFloat(this.value);if(w>4){a.scaleToWidth(w);a.setCoords();fc.requestRenderAll();pushHist();}});
    $("stStroke").addEventListener("input",function(){if(syncing)return;var c=this.value;eachActive(function(o){cmpEach(o,function(s){if(s.stroke&&s.stroke!=="none")s.set("stroke",c);});});});
    $("stStroke").addEventListener("change",pushHist);
    $("stStrokeW").addEventListener("input",function(){if(syncing)return;var w=parseFloat(this.value),c=$("stStroke").value;$("stStrokeWOut").textContent=w;eachActive(function(o){cmpEach(o,function(s){if(w===0){s.set("strokeWidth",0);}else{if(!s.stroke||s.stroke==="none")s.set("stroke",c);s.set("strokeWidth",w);}});});});
    $("stStrokeW").addEventListener("change",pushHist);
    $("cmpColor").addEventListener("change",pushHist);
    document.querySelectorAll("#cmpPrint button").forEach(function(b){b.addEventListener("click",function(){setTimeout(pushHist,10);});});
    $("stSearch").addEventListener("input",function(){cmpRenderEls();});
    document.querySelectorAll("#stView button").forEach(function(b){b.addEventListener("click",function(){stSetView(b.dataset.w);});});
    window.addEventListener("resize",stFit);
  }
  window.stAlign=function(how){var a=fc.getActiveObject();if(!a){toast("Sélectionne un élément");return;}var r=a.getBoundingRect(true,true);var dx=0,dy=0;if(how==="left")dx=-r.left;if(how==="right")dx=W-(r.left+r.width);if(how==="hcenter")dx=W/2-(r.left+r.width/2);if(how==="top")dy=-r.top;if(how==="bottom")dy=H-(r.top+r.height);if(how==="vcenter")dy=H/2-(r.top+r.height/2);a.set({left:a.left+dx,top:a.top+dy});a.setCoords();fc.requestRenderAll();pushHist();};
  window.stFlip=function(ax){if(!eachActive(function(o){o.set(ax==="x"?"flipX":"flipY",!(ax==="x"?o.flipX:o.flipY));}))toast("Sélectionne un élément");pushHist();};
  window.stGroup=function(){var a=fc.getActiveObject();if(!a){toast("Sélectionne plusieurs éléments (Maj+clic)");return;}if(a.type==="activeSelection"){var g=a.toGroup();g.set({name:"Groupe"});fc.setActiveObject(g);}else if(a.type==="group"){var s=a.toActiveSelection();s._objects.forEach(function(o){if(!o.name)o.name=nameOf(a)+" · partie";});}else{toast("Rien à grouper");return;}fc.requestRenderAll();refreshLayers();pushHist();};
  window.stSymmetry=function(){var a=fc.getActiveObject();if(!a){toast("Sélectionne un élément");return;}a.clone(function(c){var p=a.getCenterPoint();c.set({flipX:!a.flipX,name:nameOf(a)+" (miroir)"});c.setPositionByOrigin(new fabric.Point(W-p.x,p.y),"center","center");if(a.angle)c.set("angle",-a.angle);c.setCoords();fc.discardActiveObject();if(c.type==="activeSelection"){c.canvas=fc;c.forEachObject(function(o){fc.add(o);});c.setCoords();}else fc.add(c);fc.setActiveObject(c);fc.requestRenderAll();},PROPS);};
  window.cmpDuplicate=function(){var a=fc.getActiveObject();if(!a)return;a.clone(function(c){fc.discardActiveObject();c.set({left:c.left+20,top:c.top+20,evented:true});if(c.type==="activeSelection"){c.canvas=fc;c.forEachObject(function(o){fc.add(o);});c.setCoords();}else fc.add(c);fc.setActiveObject(c);fc.requestRenderAll();},PROPS);};
  window.stClearConfirm=function(){var n=objs().filter(function(o){return !o._isManne;}).length;if(n&&!confirm("Effacer les "+n+" élément(s) de la vue "+st.view+" ?"))return;objs().slice().forEach(function(o){if(!o._isManne)fc.remove(o);});fc.discardActiveObject();fc.requestRenderAll();};
  window.cmpClear=window.stClearConfirm;

  /* ---------- guides & magnétisme ---------- */
  window.stToggleSnap=function(){st.snap=!st.snap;$("stSnapBtn").classList.toggle("on",st.snap);};
  window.stToggleGrid=function(){st.grid=!st.grid;$("stGridBtn").classList.toggle("on",st.grid);fc.requestRenderAll();};
  function snapObj(t){var th=6/st.zoom;var r=t.getBoundingRect(true,true);var xs=[0,W/2,W],ys=[0,H/2,H];var inSel=t.type==="activeSelection"?t._objects:[t];objs().forEach(function(o){if(inSel.indexOf(o)>=0||o.visible===false||o._isBg)return;var b=o.getBoundingRect(true,true);xs.push(b.left,b.left+b.width/2,b.left+b.width);ys.push(b.top,b.top+b.height/2,b.top+b.height);});var tx=[r.left,r.left+r.width/2,r.left+r.width],ty=[r.top,r.top+r.height/2,r.top+r.height];var bx=null,by=null;tx.forEach(function(v){xs.forEach(function(c){var d=c-v;if(Math.abs(d)<th&&(bx===null||Math.abs(d)<Math.abs(bx.d)))bx={d:d,c:c};});});ty.forEach(function(v){ys.forEach(function(c){var d=c-v;if(Math.abs(d)<th&&(by===null||Math.abs(d)<Math.abs(by.d)))by={d:d,c:c};});});st.guides=[];if(bx){t.set("left",t.left+bx.d);st.guides.push({x:bx.c});}if(by){t.set("top",t.top+by.d);st.guides.push({y:by.c});}t.setCoords();}
  function drawGuides(){if(!st.guides.length)return;var ctx=fc.contextTop;if(!ctx)return;ctx.save();var v=fc.viewportTransform;ctx.transform(v[0],v[1],v[2],v[3],v[4],v[5]);ctx.strokeStyle="#d4537e";ctx.lineWidth=1/st.zoom;ctx.setLineDash([5/st.zoom,4/st.zoom]);st.guides.forEach(function(g){ctx.beginPath();if(g.x!=null){ctx.moveTo(g.x,0);ctx.lineTo(g.x,H);}else{ctx.moveTo(0,g.y);ctx.lineTo(W,g.y);}ctx.stroke();});ctx.restore();}
  function drawGrid(e){if(!st.grid||st.exporting)return;var ctx=e.ctx||fc.getContext();ctx.save();var v=fc.viewportTransform;ctx.transform(v[0],v[1],v[2],v[3],v[4],v[5]);ctx.strokeStyle="rgba(90,74,82,0.10)";ctx.lineWidth=1/st.zoom;for(var x=20;x<W;x+=20){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}for(var y=20;y<H;y+=20){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}ctx.strokeStyle="rgba(156,93,124,0.35)";ctx.beginPath();ctx.moveTo(W/2,0);ctx.lineTo(W/2,H);ctx.stroke();ctx.restore();}

  /* ---------- zoom / responsive ---------- */
  window.stZoom=function(dir){if(dir===0)st.zoom=1;else st.zoom=Math.min(3,Math.max(0.5,Math.round((st.zoom+(dir>0?0.25:-0.25))*100)/100));fc.setZoom(st.zoom);stFit();};
  window.stFit=function(){if(!ready())return;var wrap=$("stWrap");if(!wrap)return;var z=st.zoom;fc.setDimensions({width:W*z,height:H*z});var cw=wrap.clientWidth-20;if(cw<50)cw=W*z;var s=Math.min(1,cw/(W*z));fc.setDimensions({width:(W*z*s)+"px",height:(H*z*s)+"px"},{cssOnly:true});$("stZoomOut").textContent=Math.round(z*100)+" %";fc.requestRenderAll();};

  /* ---------- designs sauvegardés ---------- */
  function thumb(){st.exporting=true;var d;try{d=fc.toDataURL({format:"jpeg",quality:0.7,multiplier:0.32});}catch(e){d="";}st.exporting=false;return d;}
  function designs(){state.designs=state.designs||[];return state.designs;}
  window.stSaveDesign=function(copy){if(!ready())return;st.views[st.view]=snapshot();var title=$("stTitle").value.trim();var list=designs();var d=st.designId?list.filter(function(x){return x.id===st.designId;})[0]:null;var th=thumb();
    if(d&&!copy){d.title=title||d.title;d.views={devant:st.views.devant,dos:st.views.dos};d.thumbs=d.thumbs||{};d.thumbs[st.view]=th;d.updated=Date.now();}
    else{if(!title)title=d?d.title+" (copie)":"Design "+(list.length+1);d={id:uid(),title:title,views:{devant:st.views.devant,dos:st.views.dos},thumbs:{},created:Date.now(),updated:Date.now()};d.thumbs[st.view]=th;list.unshift(d);st.designId=d.id;$("stTitle").value=title;}
    if(!save()){if(!copy&&d)toast("Mémoire du navigateur pleine : supprime des designs ou des images");else{list.shift();st.designId=null;toast("Mémoire pleine, design non enregistré");}return;}
    renderDesigns();saveDraft();toast(copy?"Copie enregistrée":"Design enregistré");};
  window.stLoadDesign=function(id){var d=designs().filter(function(x){return x.id===id;})[0];if(!d)return;st.views={devant:d.views.devant||null,dos:d.views.dos||null};st.designId=d.id;st.view="devant";$("stTitle").value=d.title;document.querySelectorAll("#stView button").forEach(function(b){b.classList.toggle("on",b.dataset.w==="devant");});restore(st.views.devant,function(){resetHist();saveDraft();renderDesigns();});toast("« "+d.title+" » ouvert");};
  window.stDupDesign=function(id){var d=designs().filter(function(x){return x.id===id;})[0];if(!d)return;var c=JSON.parse(JSON.stringify(d));c.id=uid();c.title=d.title+" (copie)";c.created=c.updated=Date.now();designs().unshift(c);if(!save()){designs().shift();toast("Mémoire pleine");return;}renderDesigns();toast("Design dupliqué");};
  window.stRenameDesign=function(id){var d=designs().filter(function(x){return x.id===id;})[0];if(!d)return;var t=prompt("Nouveau nom :",d.title);if(t===null)return;d.title=t.trim()||d.title;save();if(st.designId===id)$("stTitle").value=d.title;renderDesigns();};
  window.stDelDesign=function(id){var d=designs().filter(function(x){return x.id===id;})[0];if(!d||!confirm("Supprimer « "+d.title+" » ?"))return;state.designs=designs().filter(function(x){return x.id!==id;});save();if(st.designId===id)st.designId=null;renderDesigns();saveDraft();};
  window.stNewDesign=function(){if(objs().filter(function(o){return !o._isManne;}).length&&!confirm("Nouveau design ? Pense à enregistrer le design courant avant."))return;var hadManne=!!window._cmpManne;st.views={devant:null,dos:null};st.designId=null;st.view="devant";$("stTitle").value="";document.querySelectorAll("#stView button").forEach(function(b){b.classList.toggle("on",b.dataset.w==="devant");});restore(null,function(){if(hadManne)stMannequin(true);resetHist();saveDraft();renderDesigns();});};
  function renderDesigns(){var box=$("stDesigns");if(!box)return;var list=designs();$("stDesignCount").textContent=list.length?list.length+" enregistré"+(list.length>1?"s":""):"";if(!list.length){box.innerHTML='<div class="st-empty" style="grid-column:1/-1;">Aucun design enregistré. Compose, nomme, puis « Enregistrer ».</div>';return;}box.innerHTML=list.map(function(d){var th=(d.thumbs&&(d.thumbs.devant||d.thumbs.dos))||"";var when=new Date(d.updated||d.created).toLocaleDateString("fr-FR",{day:"numeric",month:"short"});return '<div class="st-design'+(d.id===st.designId?" cur":"")+'" onclick="stLoadDesign('+d.id+')"><div class="th" style="background-image:url('+th+');"></div><div class="bd"><b title="'+esc(d.title)+'">'+esc(d.title)+'</b><span class="muted">'+when+(d.views&&d.views.dos?" · devant + dos":"")+'</span><div class="acts" onclick="event.stopPropagation()"><button onclick="stRenameDesign('+d.id+')" title="Renommer">&#9998;</button><button onclick="stDupDesign('+d.id+')" title="Dupliquer">&#10697;</button><button onclick="stDelDesign('+d.id+')" title="Supprimer">&#10005;</button></div></div></div>';}).join("");}

  /* ---------- export ---------- */
  function withoutManne(fn){var m=window._cmpManne,vis=m?m.visible:null;if(m)m.visible=false;st.exporting=true;var r;try{r=fn();}finally{st.exporting=false;if(m)m.visible=vis;fc.requestRenderAll();}return r;}
  window.stExport=function(fmt){if(!ready())return;var name=slug($("stTitle").value)+"-"+st.view;if(fmt==="svg"){var s=withoutManne(function(){return fc.toSVG({width:W,height:H,viewBox:{x:0,y:0,width:W,height:H}});});download(name+".svg","data:image/svg+xml;charset=utf-8,"+encodeURIComponent(s));}else{var d=withoutManne(function(){return fc.toDataURL({format:"png",multiplier:2});});download(name+".png",d);}toast("Export "+fmt.toUpperCase()+" lancé");};
  window.cmpData=function(){return withoutManne(function(){return fc.toDataURL({format:"jpeg",quality:0.85,multiplier:1});});};

  /* ---------- rendu IA à partir du croquis ---------- */
  var GEM_IMG_MODELS=["gemini-3.1-flash-image","gemini-2.5-flash-image"];
  function sketchPNG(){st.exporting=true;var d=fc.toDataURL({format:"png",multiplier:1});st.exporting=false;return d;}
  function describe(){var names=objs().filter(function(o){return !o._isManne&&o.visible!==false;}).map(nameOf);var cols={};objs().forEach(function(o){if(o._isManne)return;var f=fillOf(o);if(f&&f!=="pattern"&&f!=="#ccc")cols[f]=1;});return {items:names.join(", ")||"un vêtement",colors:Object.keys(cols).slice(0,6).join(", ")};}
  function gemImage(key,prompt,png,i){i=i||0;if(i>=GEM_IMG_MODELS.length)return Promise.reject("aucun modèle image Gemini disponible");var mm=png.match(/^data:(.*?);base64,(.*)$/);return fetch("https://generativelanguage.googleapis.com/v1beta/models/"+GEM_IMG_MODELS[i]+":generateContent?key="+encodeURIComponent(key),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:prompt},{inline_data:{mime_type:mm[1],data:mm[2]}}]}],generationConfig:{responseModalities:["TEXT","IMAGE"]}})}).then(function(r){return r.json();}).then(function(d){if(d.error){if(/not found|not supported|unsupported|404/i.test(d.error.message||"")&&i<GEM_IMG_MODELS.length-1)return gemImage(key,prompt,png,i+1);throw d.error.message;}var parts=(d.candidates&&d.candidates[0]&&d.candidates[0].content&&d.candidates[0].content.parts)||[];for(var k=0;k<parts.length;k++){var p=parts[k].inlineData||parts[k].inline_data;if(p&&p.data)return "data:"+(p.mimeType||p.mime_type||"image/png")+";base64,"+p.data;}throw "pas d'image renvoyée";});}
  function oaiImage(key,prompt,png){return fetch(png).then(function(r){return r.blob();}).then(function(blob){var fd=new FormData();fd.append("model","gpt-image-1");fd.append("prompt",prompt);fd.append("size","1024x1536");fd.append("image",blob,"sketch.png");return fetch("https://api.openai.com/v1/images/edits",{method:"POST",headers:{"Authorization":"Bearer "+key},body:fd});}).then(function(r){return r.json();}).then(function(d){if(d.error)throw d.error.message;var b64=d.data[0].b64_json;return b64?("data:image/png;base64,"+b64):d.data[0].url;});}
  window.cmpRenderAI=function(){var out=$("cmpAiOut");if(!out||!ready())return;var prov=(state.ai&&state.ai.provider)||"none";if((prov!=="openai"&&prov!=="gemini")||!state.ai.key){out.innerHTML='<div class="muted" style="font-size:13px;">Le rendu réaliste utilise OpenAI ou Google Gemini : choisis l\'un des deux et colle ta clé dans l\'onglet Assistant IA.</div>';return;}
    var d=describe(),extra=($("cmpPrompt").value||"").trim();
    var prompt="Tu es un photographe de mode. L'image jointe est un croquis technique à plat (vue "+(st.view==="dos"?"de dos":"de face")+") d'une création couture. Génère une photographie de mode réaliste en studio de ce vêtement exact, porté par un mannequin, "+(st.view==="dos"?"vu de dos":"vu de face")+". Respecte fidèlement la silhouette, les proportions, la position de chaque pièce ("+d.items+")"+(d.colors?", et les couleurs exactes ("+d.colors+")":"")+" ainsi que les imprimés visibles sur le croquis. "+(extra?extra+". ":"")+"Lumière douce, fond neutre uni, tissu au rendu réaliste et détaillé, haute qualité. Ne rajoute aucun élément absent du croquis.";
    out.innerHTML='<div class="muted"><span class="spin"></span> Rendu à partir de ton croquis… (10 à 30 s)</div>';
    var png=sketchPNG();var pr=prov==="gemini"?gemImage(state.ai.key,prompt,png):oaiImage(state.ai.key,prompt,png);
    pr.then(function(url){window._cmpRender=url;out.innerHTML='<div class="card"><div style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-start;"><img src="'+png+'" style="width:120px;border-radius:8px;border:1px solid var(--line);" title="Croquis envoyé"><img src="'+url+'" style="flex:1;min-width:200px;max-width:380px;border-radius:10px;border:1px solid var(--line);"></div><div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;"><button class="btn sm" onclick="cmpSaveRender()">Enregistrer ce rendu</button><button class="btn ghost sm" onclick="cmpRenderAI()">Relancer</button></div></div>';}).catch(function(e){out.innerHTML='<div class="muted" style="font-size:13px;">Rendu impossible ('+esc(String(e).slice(0,140))+').</div>';});};

  /* ---------- clavier ---------- */
  function studioActive(){var v=$("studio");return v&&v.classList.contains("active")&&$("studioComposer").style.display!=="none";}
  document.addEventListener("keydown",function(e){if(!ready()||!studioActive())return;var t=e.target;if(t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable))return;var a=fc.getActiveObject();if(a&&a.isEditing)return;var k=e.key.toLowerCase(),mod=e.ctrlKey||e.metaKey;
    if(mod&&k==="z"&&!e.shiftKey){e.preventDefault();stUndo();return;}
    if((mod&&k==="y")||(mod&&e.shiftKey&&k==="z")){e.preventDefault();stRedo();return;}
    if(mod&&k==="d"){e.preventDefault();cmpDuplicate();return;}
    if(mod&&k==="g"){e.preventDefault();stGroup();return;}
    if(mod&&k==="a"){e.preventDefault();fc.discardActiveObject();var sel=objs().filter(function(o){return !o._isManne&&o.visible!==false&&!o.locked;});if(sel.length){fc.setActiveObject(new fabric.ActiveSelection(sel,{canvas:fc}));fc.requestRenderAll();}return;}
    if(mod&&k==="c"){if(a){a.clone(function(c){st.clip=c;},PROPS);}return;}
    if(mod&&k==="v"){if(st.clip){st.clip.clone(function(c){fc.discardActiveObject();c.set({left:c.left+20,top:c.top+20,evented:true});if(c.type==="activeSelection"){c.canvas=fc;c.forEachObject(function(o){fc.add(o);});c.setCoords();}else fc.add(c);fc.setActiveObject(c);fc.requestRenderAll();},PROPS);}return;}
    if(k==="delete"||k==="backspace"){if(a){e.preventDefault();cmpDelete();}return;}
    if(k==="escape"){fc.discardActiveObject();fc.requestRenderAll();return;}
    if(k.indexOf("arrow")===0&&a&&!a.locked){e.preventDefault();var s=e.shiftKey?10:1;if(k==="arrowleft")a.left-=s;if(k==="arrowright")a.left+=s;if(k==="arrowup")a.top-=s;if(k==="arrowdown")a.top+=s;a.setCoords();fc.requestRenderAll();pushHist();}
  });

  /* ---------- init ---------- */
  function init(){if(!ready()){if(typeof cmpInit==="function")cmpInit();if(!ready()){setTimeout(init,300);return;}}
    fc.selectionColor="rgba(156,93,124,0.12)";fc.selectionBorderColor="#9c5d7c";fabric.Object.prototype.set({transparentCorners:false,cornerColor:"#fff",cornerStrokeColor:"#9c5d7c",borderColor:"#9c5d7c",cornerSize:9,cornerStyle:"circle",padding:2});
    fc.on("object:added",function(e){var o=e.target;if(!o.name&&o.type==="rect"&&o.left===0&&o.top===0&&o.width>=W-1){o.name="Fond motif";o._isBg=true;}refreshLayers();pushHist();});
    fc.on("object:removed",function(){refreshLayers();pushHist();});
    fc.on("object:modified",function(){st.guides=[];refreshLayers();syncProps();pushHist();});
    fc.on("text:changed",function(){refreshLayers();pushHist();});
    fc.on("selection:created",function(){refreshLayers();syncProps();});fc.on("selection:updated",function(){refreshLayers();syncProps();});fc.on("selection:cleared",function(){refreshLayers();syncProps();});
    fc.on("object:moving",function(e){if(st.snap)snapObj(e.target);});
    fc.on("mouse:up",function(){if(st.guides.length){st.guides=[];fc.requestRenderAll();}});
    fc.on("before:render",function(){if(fc.contextTop&&!st.exporting)fc.clearContext(fc.contextTop);});
    fc.on("after:render",function(e){drawGrid(e);drawGuides();});
    bind();
    st.ready=true;
    if(!loadDraft()){resetHist();}
    refreshLayers();syncProps();renderDesigns();cmpRenderEls();stFit();
    var _go=window.goView;window.goView=function(v){_go(v);if(v==="studio")setTimeout(stFit,40);};
    document.querySelectorAll("#studioMode button").forEach(function(b){b.addEventListener("click",function(){if(b.dataset.s==="composer")setTimeout(stFit,40);});});
    var _ra=window.renderAll;if(typeof _ra==="function")window.renderAll=function(){_ra();renderDesigns();if(typeof cmpRenderPalette==="function")cmpRenderPalette();};
  }
  init();

  /* ---------- mise à jour du service worker sans « vider les données » ---------- */
  if("serviceWorker" in navigator){var hadCtrl=!!navigator.serviceWorker.controller,reloaded=false;navigator.serviceWorker.addEventListener("controllerchange",function(){if(reloaded||!hadCtrl)return;reloaded=true;toast("Mise à jour installée — rechargement…");setTimeout(function(){location.reload();},900);});}
})();
