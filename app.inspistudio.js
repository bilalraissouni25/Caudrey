"use strict";
/* ===== De l'inspiration au patron =====
 * Le chaînon qui manquait entre « j'ai vu ça sur Instagram » et « je le couds » :
 *  1. la photo s'affiche à côté du dessin technique, pour comparer en réglant ;
 *  2. l'app propose les modèles FreeSewing les plus proches (avec l'IA si une clé est
 *     configurée, sinon à partir des tags et de la légende) ;
 *  3. trois réglages « comme sur la photo » (ampleur, longueur, manches) orientent les
 *     options du modèle — un point de départ, que les curseurs affinent.
 */

/* ---------- l'IA lit les images de l'app (blob:) : on les lui donne en data: ---------- */
function isBlobToData(src,max){
  max=max||900;
  return new Promise(function(res,rej){
    if(!src)return rej(new Error("pas d'image"));
    if(src.indexOf("data:")===0)return res(src);
    var img=new Image(); img.crossOrigin="anonymous";
    img.onload=function(){
      var w=img.naturalWidth,h=img.naturalHeight,r=Math.min(1,max/Math.max(w,h));
      var cv=document.createElement("canvas"); cv.width=Math.round(w*r); cv.height=Math.round(h*r);
      cv.getContext("2d").drawImage(img,0,0,cv.width,cv.height);
      try{ res(cv.toDataURL("image/jpeg",0.82)); }catch(e){ rej(e); }
    };
    img.onerror=function(){ rej(new Error("image illisible")); };
    img.src=src;
  });
}
/* Depuis le passage des images en IndexedDB, x.img est une URL blob: — aucun fournisseur
   d'IA ne sait la lire. Toute la vision de l'app (tags compris) passait donc en échec. */
(function(){
  var base=window.callVision;
  if(typeof base!=="function")return;
  window.callVision=function(prompt,imgUrl){
    if(imgUrl&&imgUrl.indexOf("blob:")===0)return isBlobToData(imgUrl).then(function(d){ return base(prompt,d); });
    return base(prompt,imgUrl);
  };
})();

/* ---------- l'inspiration de référence ---------- */
function isInspi(id){ return (state.inspirations||[]).filter(function(x){ return String(x.id)===String(id); })[0]||null; }

function isRefRender(){
  var box=document.getElementById("tkRef"), pair=document.getElementById("tkPair");
  if(!box)return;
  var x=TK.ref?isInspi(TK.ref):null;
  if(!x){
    box.hidden=true; if(pair)pair.classList.remove("on");
    var gr0=document.querySelector("#studioTech .tk-grid"); if(gr0)gr0.classList.remove("avec-ref");
    var b=document.getElementById("tkRefBtn"); if(b)b.textContent="Comparer à une inspiration";
    return;
  }
  box.hidden=false; if(pair)pair.classList.add("on");
  var gr=document.querySelector("#studioTech .tk-grid"); if(gr)gr.classList.add("avec-ref");
  var b2=document.getElementById("tkRefBtn"); if(b2)b2.textContent="Changer d'inspiration";
  box.innerHTML=
    (x.img?'<img src="'+esc(x.img)+'" alt="">':'<div class="tk-noimg">Pas de photo pour cette inspiration</div>')+
    '<div class="tk-reft"><b>'+esc(x.title||"Inspiration")+'</b>'+(x.url?' · <a href="'+esc(x.url)+'" target="_blank" rel="noopener">source</a>':'')+
    ' · <a href="#" onclick="isRefClear();return false;">retirer</a></div>'+
    '<div class="tk-comme"><div class="tq-sec" style="margin:8px 0 6px;">Comme sur la photo</div>'+
      isChips("ampleur",[["ajuste","Ajusté"],["standard","Standard"],["ample","Ample"]])+
      isChips("longueur",[["court","Plus court"],["standard","Standard"],["long","Plus long"]])+
      isChips("manches",[["courtes","Manches courtes"],["standard","Standard"],["longues","Manches longues"]])+
    '</div>'+
    '<div id="isSug" class="is-sug"></div>';
  isSugRender();
}
function isChips(axe,vals){
  var cur=(TK.comme||{})[axe]||"standard";
  return '<div class="is-chips">'+vals.map(function(v){
    return '<button class="'+(cur===v[0]?"on":"")+'" onclick="isComme(\''+axe+'\',\''+v[0]+'\')">'+v[1]+'</button>';
  }).join("")+'</div>';
}
function isRefClear(){ TK.ref=null; TK.comme={}; isRefRender(); }

/* choisir l'inspiration : une grille des photos */
function isRefPick(){
  var L=(state.inspirations||[]).filter(function(x){ return x.img; });
  var old=document.getElementById("isModal"); if(old)old.remove();
  var ov=document.createElement("div"); ov.id="isModal"; ov.className="tq-ov";
  ov.innerHTML='<div class="card tq-box" style="max-width:760px;">'+
    '<div class="tq-hd"><div><div class="tq-cat">Studio · dessin technique</div><h3>Quelle inspiration veux-tu reproduire ?</h3></div>'+
      '<button class="x" onclick="document.getElementById(\'isModal\').remove()">&times;</button></div>'+
    (L.length?'<div class="is-grid">'+L.map(function(x){
      return '<button class="is-it" onclick="isRefSet(\''+x.id+'\');document.getElementById(\'isModal\').remove();">'+
        '<span style="background-image:url(\''+esc(x.img)+'\')"></span><em>'+esc((x.title||"").slice(0,40))+'</em></button>';
    }).join("")+'</div>':'<p class="muted">Aucune inspiration avec photo pour l\'instant. Ajoute-en depuis la page Inspirations.</p>')+
  '</div>';
  document.body.appendChild(ov);
  ov.addEventListener("click",function(e){ if(e.target===ov)ov.remove(); });
}
function isRefSet(id){
  TK.ref=id; TK.comme={};
  isRefRender();
  isSuggest();
}

/* ---------- trouver le modèle le plus proche ---------- */
var IS_TYPES=[
  ["robe",/robe|dress|combinaison|jumpsuit|salopette/],
  ["jupe",/jupe|skirt/],
  ["pantalon",/pantalon|jean|short|legging|jogging|trouser|pants|bermuda|culotte/],
  ["manteau",/veste|manteau|blouson|gilet|kimono|coat|jacket|cardigan|trench/],
  ["top",/top|t-?shirt|tee|chemise|blouse|sweat|hoodie|pull|débardeur|debardeur|brassière|crop|haut|shirt|tunique/],
  ["accessoire",/sac|tote|pochette|tablier|chouchou|bandeau|casquette|bonnet|chapeau|trousse/]
];
function isTexte(x){ return ((x.title||"")+" "+(x.note||"")+" "+(x.tags||[]).join(" ")).toLowerCase(); }
function isTypeDe(txt){ for(var i=0;i<IS_TYPES.length;i++)if(IS_TYPES[i][1].test(txt))return IS_TYPES[i][0]; return null; }
function isCandidats(x){
  var txt=isTexte(x), type=isTypeDe(txt);
  var mots=txt.split(/[^a-zàâçéèêëîïôûùüÿœ-]+/).filter(function(m){ return m.length>3; });
  var dispo={}; (window.FS&&FS.designs||[]).forEach(function(d){ dispo[d]=1; });
  var L=(typeof FSALL!=="undefined"?FSALL:[]).filter(function(d){ return dispo[d.slug]&&d.type!=="enfant"; }).map(function(d){
    var s=0, hay=(d.name+" "+d.desc).toLowerCase();
    if(type&&d.type===type)s+=6;
    mots.forEach(function(m){ if(hay.indexOf(m)>=0)s+=2; });
    if(d.level==="Débutant")s+=1;
    return {d:d,s:s};
  }).filter(function(r){ return r.s>0; }).sort(function(a,b){ return b.s-a.s; });
  return {type:type, liste:L.slice(0,3).map(function(r){ return {slug:r.d.slug, pourquoi:""}; })};
}
function isIaDispo(){ var a=state.ai||{}; return a.provider&&a.provider!=="none"&&a.key; }
function isSuggest(){
  var x=isInspi(TK.ref); if(!x)return;
  TK.sug={etat:"calcul"}; isSugRender();
  var base=isCandidats(x);
  if(!isIaDispo()||!x.img){
    TK.sug={etat:"ok", source:"tags", type:base.type, liste:base.liste};
    isSugRender(); return;
  }
  var cat=(typeof FSALL!=="undefined"?FSALL:[]).filter(function(d){ return d.type!=="enfant"&&(!window.FS||FS.designs.indexOf(d.slug)>=0); })
    .map(function(d){ return d.slug+" — "+d.name+" ("+d.type+") : "+d.desc; }).join("\n");
  var prompt="Tu es modéliste. Regarde ce vêtement et choisis, dans le catalogue ci-dessous, les 3 patrons les plus proches pour le reproduire. "+
    "Réponds UNIQUEMENT en JSON, sans texte autour, au format : "+
    '{"type":"robe|jupe|pantalon|top|manteau|accessoire","description":"une phrase","ampleur":"ajuste|standard|ample","longueur":"court|standard|long","manches":"courtes|standard|longues|sans","modeles":[{"slug":"...","pourquoi":"une phrase courte"}]}'+
    "\nCatalogue :\n"+cat;
  callVision(prompt,x.img).then(function(t){
    var m=String(t).match(/\{[\s\S]*\}/); if(!m)throw new Error("réponse illisible");
    var j=JSON.parse(m[0]);
    var ok=(j.modeles||[]).filter(function(r){ return r&&r.slug&&window.FS&&FS.designs.indexOf(r.slug)>=0; }).slice(0,3);
    if(!ok.length)throw new Error("aucun modèle reconnu");
    TK.sug={etat:"ok", source:"ia", type:j.type, description:j.description||"", liste:ok,
            comme:{ampleur:j.ampleur, longueur:j.longueur, manches:(j.manches==="sans"?"courtes":j.manches)}};
    isSugRender();
  }).catch(function(e){
    TK.sug={etat:"ok", source:"tags", type:base.type, liste:base.liste, erreur:String((e&&e.message)||e).slice(0,80)};
    isSugRender();
  });
}
function isSugRender(){
  var box=document.getElementById("isSug"); if(!box)return;
  var s=TK.sug;
  if(!s){ box.innerHTML=""; return; }
  if(s.etat==="calcul"){ box.innerHTML='<div class="muted" style="font-size:13px;"><span class="spin"></span> Je cherche le patron le plus proche…</div>'; return; }
  if(!s.liste||!s.liste.length){
    box.innerHTML='<div class="muted" style="font-size:13px;line-height:1.5;">Je n\'ai pas reconnu le type de vêtement. Ajoute un tag (robe, jupe, top…) à l\'inspiration, ou choisis le modèle dans la liste.</div>';
    return;
  }
  box.innerHTML='<div class="tq-sec" style="margin:10px 0 6px;">Patrons les plus proches'+(s.source==="ia"?" · analyse IA":" · d'après les tags")+'</div>'+
    (s.description?'<div class="muted" style="font-size:12.5px;margin-bottom:6px;">'+esc(s.description)+'</div>':'')+
    s.liste.map(function(r){
      var d=(typeof FSALL!=="undefined")?FSALL.filter(function(f){return f.slug===r.slug;})[0]:null;
      return '<button class="is-mod'+(TK.slug===r.slug?" on":"")+'" onclick="isChoisir(\''+r.slug+'\')">'+
        '<b>'+esc(d?d.name:r.slug)+'</b><span>'+esc(r.pourquoi||(d?d.level+" · "+d.desc:""))+'</span></button>';
    }).join("")+
    (s.source==="tags"&&!isIaDispo()?'<div class="muted" style="font-size:11.5px;margin-top:6px;">Avec une clé IA (Assistant IA), l\'app regarde la photo elle-même.</div>':'')+
    (s.erreur?'<div class="muted" style="font-size:11.5px;margin-top:6px;">IA indisponible ('+esc(s.erreur)+') — proposition d\'après les tags.</div>':'');
}
function isChoisir(slug){
  var sel=document.getElementById("tkDesign");
  if(sel){ sel.value=slug; sel.dispatchEvent(new Event("change")); }
  /* l'IA a aussi estimé ampleur, longueur, manches : on les applique d'office */
  if(TK.sug&&TK.sug.comme){
    TK.comme={};
    ["ampleur","longueur","manches"].forEach(function(k){ if(TK.sug.comme[k])TK.comme[k]=TK.sug.comme[k]; });
    isAppliquerComme();
  }
  isRefRender();
}

/* ---------- « comme sur la photo » → options du modèle ---------- */
var IS_AXES={
  /* noms relevés sur les 68 modèles du bundle (options pct/deg) */
  ampleur:{re:/^(chest|hips|seat|waist|biceps|bust|shoulder|body|fullBust|extraSeat|extraWaist)Ease$|^ease$/, haut:"ample", bas:"ajuste"},
  longueur:{re:/^(lengthBonus|length|lengthBelowWaist|lengthAdjustment|bodyLength|torsoLength|legLength|lengthInseam)$/, haut:"long", bas:"court"},
  manches:{re:/^(sleeveLengthBonus|sleeveLength|dolmanSleeveLength)$/, haut:"longues", bas:"courtes"}
};
function isComme(axe,val){
  if(!TK.comme)TK.comme={};
  TK.comme[axe]=val;
  isAppliquerComme();
  isRefRender();
}
function isAppliquerComme(){
  var defs=flatOptions(TK.slug), touche=0;
  Object.keys(IS_AXES).forEach(function(axe){
    var v=(TK.comme||{})[axe]; if(!v)return;
    var A=IS_AXES[axe];
    defs.forEach(function(o){
      if(!A.re.test(o.k)||(o.type!=="pct"&&o.type!=="deg"))return;
      var nv=o.def;
      if(v===A.haut)nv=o.def+(o.max-o.def)*0.6;
      else if(v===A.bas)nv=o.def-(o.def-o.min)*0.6;
      TK.vals[o.k]=Math.round(nv*2)/2;
      touche++;
    });
  });
  if(typeof tkOptsRender==="function")tkOptsRender();
  if(typeof tkDraw==="function")tkDraw();
  if(!touche&&Object.keys(TK.comme||{}).some(function(k){ return TK.comme[k]!=="standard"; }))
    toast("Ce modèle n'a pas ce réglage — utilise les curseurs");
}

/* ---------- depuis la page Inspirations : « Dessiner » ---------- */
function inspoToStudio(id){
  goView("studio");
  var b=document.querySelector('#studioMode button[data-s="tech"]'); if(b)b.click();
  setTimeout(function(){ isRefSet(id); },350);
}
(function(){
  var base=window.renderInspo;
  if(typeof base!=="function")return;
  window.renderInspo=function(){
    var r=base.apply(this,arguments);
    try{
      document.querySelectorAll('#inspoList button[onclick^="inspoToProjet("]').forEach(function(bt){
        if(bt.nextElementSibling&&bt.nextElementSibling.classList.contains("is-go"))return;
        var id=(bt.getAttribute("onclick").match(/inspoToProjet\(([^)]*)\)/)||[])[1];
        var n=document.createElement("button");
        n.className="btn ghost sm is-go"; n.textContent="→ patron";
        n.title="Trouver le patron et le dessiner à tes mesures";
        n.setAttribute("onclick","inspoToStudio('"+String(id).replace(/'/g,"")+"')");
        bt.parentNode.insertBefore(n,bt.nextSibling);
      });
    }catch(e){}
    return r;
  };
})();

/* ---------- branchement ---------- */
document.addEventListener("DOMContentLoaded",function(){
  if(typeof TK!=="undefined"&&!TK.comme)TK.comme={};
  if(typeof renderInspo==="function")try{ renderInspo(); }catch(e){}
});
/* une version enregistrée garde son inspiration */
(function(){
  var base=window.tkSaveVersion;
  if(typeof base!=="function")return;
  window.tkSaveVersion=function(){
    var n=(state.variantes||[]).length;
    base.apply(this,arguments);
    if((state.variantes||[]).length>n&&TK.ref){ state.variantes[0].ref=TK.ref; save(); }
  };
  var load=window.tkLoadVersion;
  if(typeof load==="function")window.tkLoadVersion=function(id){
    load.apply(this,arguments);
    var v=(state.variantes||[]).filter(function(x){ return String(x.id)===String(id); })[0];
    if(v&&v.ref&&isInspi(v.ref)){ TK.ref=v.ref; isRefRender(); }
  };
})();
window.isRefPick=isRefPick; window.isRefSet=isRefSet; window.isRefClear=isRefClear;
window.isComme=isComme; window.isChoisir=isChoisir; window.inspoToStudio=inspoToStudio;
window.isSuggest=isSuggest; window.isBlobToData=isBlobToData;
