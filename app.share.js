"use strict";
/* ===== Partage & import d'inspirations =====
 * Android : Partager → Mon Atelier (image ou lien) via share_target POST, traité par le service worker.
 * iPhone  : raccourci « Mon Atelier » dans le menu Partager → ouvre l'app avec le lien,
 *           ou copie l'image et ouvre l'app en mode « coller ».
 * Partout : coller (⌘V / presse-papiers), glisser-déposer, photo.
 */

/* ---------- récupération de l'aperçu d'un lien : chaîne de proxys ---------- */
var PROXIES=[
  function(u){return "https://api.allorigins.win/raw?url="+encodeURIComponent(u);},
  function(u){return "https://api.codetabs.com/v1/proxy?quest="+encodeURIComponent(u);},
  function(u){return "https://corsproxy.io/?url="+encodeURIComponent(u);}
];
function fetchHtml(url){
  var i=0;
  function next(){
    if(i>=PROXIES.length)return Promise.reject(new Error("aucun relais disponible"));
    var p=PROXIES[i++];
    return fetch(p(url),{cache:"no-store"}).then(function(r){
      if(!r.ok)throw new Error("HTTP "+r.status);
      return r.text();
    }).then(function(t){
      if(!t||t.length<80)throw new Error("réponse vide");
      return t;
    }).catch(next);
  }
  return next();
}
window.fetchHtml=fetchHtml;

/* ---------- sources particulières ---------- */
function tiktokOembed(url){
  return fetch("https://www.tiktok.com/oembed?url="+encodeURIComponent(url))
    .then(function(r){ if(!r.ok)throw 0; return r.json(); })
    .then(function(d){ return {img:d.thumbnail_url||"", title:d.title||"", desc:d.author_name?("par "+d.author_name):""}; });
}
function isInstagram(u){ return /instagram\.com|instagr\.am/i.test(u); }
function isTiktok(u){ return /tiktok\.com/i.test(u); }

/* --- Instagram : oEmbed officiel (sans jeton depuis juin 2026) --- */
var IG_OEMBED="https://graph.facebook.com/v25.0/instagram_oembed?omitscript=true&url=";
function igCode(u){ var m=(u||"").match(/instagram\.com\/(?:[^/]+\/)?(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i); return m?m[1]:null; }
function igEmbedUrl(u){ var c=igCode(u); return c?("https://www.instagram.com/p/"+c+"/embed/captioned/"):null; }
function instagramMeta(url){
  var end=IG_OEMBED+encodeURIComponent(url);
  function parse(d){
    if(!d||d.error)throw new Error("oEmbed indisponible");
    return {img:d.thumbnail_url||"", title:d.author_name?("@"+d.author_name):"Inspiration Instagram", desc:"", html:d.html||""};
  }
  return fetch(end,{cache:"no-store"}).then(function(r){ if(!r.ok)throw 0; return r.json(); }).then(parse)
    .catch(function(){ return fetchHtml(end).then(function(t){ return parse(JSON.parse(t)); }); });
}

/* Récupère les octets d'une image distante via un relais (permet d'en garder une copie locale) */
function fetchImageBlob(url){
  var i=0;
  function next(){
    if(i>=PROXIES.length)return Promise.reject(new Error("image inaccessible"));
    return fetch(PROXIES[i++](url),{cache:"no-store"}).then(function(r){
      if(!r.ok)throw 0; return r.blob();
    }).then(function(b){
      if(!b||b.size<500||b.type.indexOf("image")!==0)throw 0;
      return b;
    }).catch(next);
  }
  return next();
}
function saveRemoteImage(imgUrl,meta){
  return fetchImageBlob(imgUrl).then(function(b){ return importImageBlob(b,meta); });
}
window.saveRemoteImage=saveRemoteImage;

/* ---------- import d'une image (fichier, blob ou dataURL) ---------- */
function importImageBlob(blob,meta){
  return new Promise(function(res,rej){
    if(!blob)return rej(new Error("pas d'image"));
    var rd=new FileReader();
    rd.onerror=function(){rej(new Error("lecture impossible"));};
    rd.onload=function(){
      var img=new Image();
      img.onerror=function(){rej(new Error("image illisible"));};
      img.onload=function(){
        var max=900,w=img.width,h=img.height;
        if(w>max||h>max){var r=Math.min(max/w,max/h);w=Math.round(w*r);h=Math.round(h*r);}
        var cv=document.createElement("canvas");cv.width=w;cv.height=h;
        cv.getContext("2d").drawImage(img,0,0,w,h);
        var data=cv.toDataURL("image/jpeg",0.74);
        var m=meta||{};
        var obj={id:uid(),title:m.title||"Inspiration",img:data,note:m.note||"",
                 url:m.url||"",platform:m.platform||"Image",tags:[]};
        state.inspirations.unshift(obj);
        if(!save()){ state.inspirations.shift(); return rej(new Error("mémoire pleine")); }
        if(typeof autoTag==="function")autoTag(obj);
        if(typeof renderInspo==="function")renderInspo();
        if(typeof refreshRefSelect==="function")refreshRefSelect();
        res(obj);
      };
      img.src=rd.result;
    };
    rd.readAsDataURL(blob);
  });
}
window.importImageBlob=importImageBlob;

function platformFromUrl(u){
  if(!u)return "Image";
  if(isInstagram(u))return "Instagram";
  if(/pinterest\./i.test(u))return "Pinterest";
  if(/vinted\./i.test(u))return "Vinted";
  if(isTiktok(u))return "TikTok";
  return "Web";
}

/* ---------- ce qui arrive par le menu Partager d'Android (service worker) ---------- */
function shareKey(n){ return new URL(n, location.href.split("?")[0]).href; }
function consumeSharedPayload(){
  if(!("caches" in window))return Promise.resolve(false);
  var K_META=shareKey("__shared-meta"), K_IMG=shareKey("__shared-image");
  return caches.open("atelier-share").then(function(c){
    return c.match(K_META).then(function(mr){
      if(!mr)return false;
      return mr.json().then(function(meta){
        return c.match(K_IMG).then(function(ir){
          var done=Promise.resolve(false);
          if(ir){
            done=ir.blob().then(function(blob){
              return importImageBlob(blob,{
                title:(meta.title||meta.text||"Inspiration partagée").slice(0,80),
                url:meta.url||"", platform:platformFromUrl(meta.url)
              }).then(function(){ toast("Inspiration ajoutée depuis le partage"); return true; });
            });
          } else if(meta.url||meta.text){
            var m=(meta.url||meta.text||"").match(/https?:\/\/\S+/);
            if(m){ shareImportLink(m[0]); done=Promise.resolve(true); }
          }
          return done.then(function(r){
            c.delete(K_IMG); c.delete(K_META);
            return r;
          });
        });
      });
    });
  }).catch(function(){ return false; });
}

/* ---------- import d'un lien, avec aperçu ---------- */
function shareImportLink(url){
  goView("inspirations");
  var inp=$("impUrl"); if(inp)inp.value=url;
  var st=$("impStatus"), pv=$("impPreview");
  var plat=platformFromUrl(url);
  if(st)st.innerHTML='<span class="spin"></span> Recherche de l\'aperçu sur '+plat+'…';
  if(pv)pv.innerHTML="";

  /* Instagram : on tente l'oEmbed officiel (sans jeton depuis juin 2026), puis l'embed, puis la capture */
  if(isInstagram(url)){
    window._pending={img:"",url:url,platform:"Instagram"};
    instagramMeta(url).then(function(m){
      if(!m.img)throw new Error("pas de miniature");
      window._pending.img=m.img;
      if(st)st.innerHTML='Photo récupérée sur <span class="badge Instagram">Instagram</span>.';
      if(pv)pv.innerHTML='<div class="card" style="display:flex;gap:14px;flex-wrap:wrap;align-items:flex-start;">'+
        '<img src="'+esc(m.img)+'" referrerpolicy="no-referrer" style="width:130px;height:130px;object-fit:cover;border-radius:10px;border:1px solid var(--line);" onerror="this.style.display=\'none\'">'+
        '<div style="flex:1;min-width:200px;"><label class="fld">Titre</label>'+
        '<input id="pvTitle" type="text" value="'+esc((m.title||"Inspiration Instagram").slice(0,90))+'">'+
        '<label class="fld" style="margin-top:8px;">Note</label>'+
        '<input id="pvNote" type="text" placeholder="Ce qui te plaît...">'+
        '<p class="muted" style="font-size:12.5px;margin:10px 0 0;line-height:1.5;">Instagram fait expirer ses adresses d\'image : garde une copie dans l\'app pour la conserver et la tagger.</p>'+
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">'+
        '<button class="btn" onclick="igPinWithCopy()">Épingler avec la photo</button>'+
        '<button class="btn ghost" onclick="savePending()">Épingler le lien seul</button>'+
        '</div></div></div>';
    }).catch(function(){
      var emb=igEmbedUrl(url);
      if(st)st.innerHTML="Instagram ne donne pas la photo pour ce lien.";
      if(pv)pv.innerHTML=
        '<div class="card" style="background:var(--accent-soft);border:none;">'+
        '<div style="font-weight:600;margin-bottom:6px;">Le lien est gardé — ajoute la photo en 2 gestes</div>'+
        '<div class="muted" style="font-size:13.5px;line-height:1.6;margin-bottom:12px;">'+
        'Fais une <b>capture d\'écran</b> du post puis partage-la vers Mon Atelier, ou colle-la ici.</div>'+
        (emb?'<div style="background:#fff;border-radius:10px;overflow:hidden;border:1px solid var(--line);margin-bottom:12px;">'+
             '<iframe src="'+esc(emb)+'" loading="lazy" style="width:100%;height:420px;border:0;" scrolling="no"></iframe></div>':'')+
        '<div style="display:flex;gap:8px;flex-wrap:wrap;">'+
        '<button class="btn" onclick="pasteFromClipboard()">Coller la capture</button>'+
        '<button class="btn ghost" onclick="document.getElementById(\'imgFile\').click()">Choisir dans mes photos</button>'+
        '<button class="btn ghost" onclick="savePending()">Garder le lien seul</button>'+
        '</div></div>';
    });
    return;
  }

  var pr = isTiktok(url) ? tiktokOembed(url).catch(function(){ return fetchHtml(url).then(metaFrom); })
                         : fetchHtml(url).then(metaFrom);
  pr.then(function(m){
    window._pending={img:m.img||"",url:url,platform:plat};
    if(st)st.innerHTML=m.img?('Aperçu trouvé sur <span class="badge '+plat+'">'+plat+'</span> — ajuste et épingle.')
                            :'Pas d\'image trouvée, mais tu peux enregistrer le lien (ou coller une capture).';
    if(pv)pv.innerHTML='<div class="card" style="display:flex;gap:14px;flex-wrap:wrap;align-items:flex-start;">'+
      (m.img?'<img src="'+esc(m.img)+'" style="width:130px;height:130px;object-fit:cover;border-radius:10px;border:1px solid var(--line);" onerror="this.style.display=\'none\'">':'')+
      '<div style="flex:1;min-width:200px;"><label class="fld">Titre</label>'+
      '<input id="pvTitle" type="text" value="'+esc((m.title||"").slice(0,90))+'">'+
      '<label class="fld" style="margin-top:8px;">Note</label>'+
      '<input id="pvNote" type="text" value="'+esc((m.desc||"").slice(0,120))+'" placeholder="Ce qui te plaît...">'+
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">'+
      '<button class="btn" onclick="savePending()">Épingler</button>'+
      (m.img?"":'<button class="btn ghost" onclick="pasteFromClipboard()">Coller une capture</button>')+
      '</div></div></div>';
  }).catch(function(){
    window._pending={img:"",url:url,platform:plat};
    if(st)st.innerHTML="Récupération automatique impossible sur ce site.";
    if(pv)pv.innerHTML='<div class="card"><label class="fld">Titre</label>'+
      '<input id="pvTitle" type="text" placeholder="Mon inspiration '+plat+'">'+
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">'+
      '<button class="btn" onclick="savePending()">Enregistrer le lien</button>'+
      '<button class="btn ghost" onclick="pasteFromClipboard()">Coller une capture</button></div></div>';
  });
}
window.shareImportLink=shareImportLink;
function importLink(){
  var url=($("impUrl").value||"").trim();
  if(!url){toast("Colle un lien d'abord");return;}
  if(!/^https?:\/\//.test(url))url="https://"+url;
  shareImportLink(url);
}
window.importLink=importLink;

/* épingle une inspiration Instagram en gardant une vraie copie de la photo */
function igPinWithCopy(){
  var p=window._pending||{};
  if(!p.img)return savePending();
  var title=(($("pvTitle")||{}).value||"Inspiration Instagram").trim();
  var note=(($("pvNote")||{}).value||"").trim();
  var st=$("impStatus");
  if(st)st.innerHTML='<span class="spin"></span> Copie de la photo…';
  saveRemoteImage(p.img,{title:title,note:note,url:p.url,platform:"Instagram"})
    .then(function(){
      window._pending=null;
      if($("impUrl"))$("impUrl").value="";
      if(st)st.innerHTML="";
      if($("impPreview"))$("impPreview").innerHTML="";
      toast("Inspiration épinglée avec sa photo");
    })
    .catch(function(){
      if(st)st.innerHTML="Copie impossible — le lien et l'aperçu sont gardés.";
      savePending();
    });
}
window.igPinWithCopy=igPinWithCopy;

/* ---------- coller : image ou lien ---------- */
function pasteFromClipboard(){
  if(!navigator.clipboard||!navigator.clipboard.read){
    return pasteFallback();
  }
  navigator.clipboard.read().then(function(items){
    for(var i=0;i<items.length;i++){
      var types=items[i].types||[];
      for(var j=0;j<types.length;j++){
        if(types[j].indexOf("image/")===0){
          return items[i].getType(types[j]).then(function(blob){
            return importImageBlob(blob,{title:"Inspiration collée",platform:"Image"});
          }).then(function(){ goView("inspirations"); toast("Image collée et ajoutée"); });
        }
      }
    }
    if(navigator.clipboard.readText)return navigator.clipboard.readText().then(handlePastedText);
    throw new Error("rien d'exploitable");
  }).catch(function(){
    if(navigator.clipboard&&navigator.clipboard.readText){
      navigator.clipboard.readText().then(handlePastedText).catch(pasteFallback);
    } else pasteFallback();
  });
}
window.pasteFromClipboard=pasteFromClipboard;

function handlePastedText(txt){
  var m=(txt||"").match(/https?:\/\/\S+/);
  if(m){ shareImportLink(m[0]); toast("Lien collé"); }
  else pasteFallback();
}

/* iOS peut refuser la lecture directe : on offre une zone où coller à la main */
function pasteFallback(){
  var ov=document.getElementById("pasteModal");
  if(ov)ov.parentNode.removeChild(ov);
  ov=document.createElement("div");
  ov.id="pasteModal";
  ov.style.cssText="position:fixed;inset:0;background:rgba(46,42,40,.45);display:flex;align-items:center;justify-content:center;z-index:210;padding:16px;";
  ov.innerHTML='<div class="card" style="max-width:420px;width:100%;">'+
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:6px;">'+
      '<h3 style="font-size:17px;">Coller ton inspiration</h3>'+
      '<button class="x" onclick="pasteClose()">&times;</button></div>'+
    '<p class="muted" style="font-size:13.5px;margin:0 0 12px;line-height:1.55;">Appuie longuement dans le cadre puis choisis <b>Coller</b> : une image comme un lien fonctionnent.</p>'+
    '<div id="pasteZone" contenteditable="true" style="min-height:110px;border:2px dashed var(--line);border-radius:12px;padding:14px;font-size:14px;color:var(--muted);outline:none;-webkit-user-select:text;user-select:text;">Colle ici…</div>'+
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">'+
      '<button class="btn ghost" onclick="document.getElementById(\'imgFile\').click();pasteClose();">Choisir une photo</button>'+
      '<button class="btn ghost" onclick="pasteClose()">Fermer</button></div></div>';
  document.body.appendChild(ov);
  var z=document.getElementById("pasteZone");
  z.addEventListener("focus",function(){ if(z.textContent.indexOf("Colle ici")===0)z.textContent=""; });
  z.addEventListener("paste",function(e){
    var dt=e.clipboardData; if(!dt)return;
    var files=[].slice.call(dt.files||[]);
    var items=[].slice.call(dt.items||[]);
    var imgItem=items.filter(function(it){return it.type&&it.type.indexOf("image/")===0;})[0];
    if(files.length||imgItem){
      e.preventDefault();
      var blob=files[0]||imgItem.getAsFile();
      importImageBlob(blob,{title:"Inspiration collée",platform:"Image"})
        .then(function(){ pasteClose(); goView("inspirations"); toast("Image ajoutée"); })
        .catch(function(err){ toast(String(err.message||err)); });
      return;
    }
    var txt=dt.getData("text");
    if(txt&&/https?:\/\//.test(txt)){ e.preventDefault(); pasteClose(); handlePastedText(txt); }
  });
  setTimeout(function(){ try{z.focus();}catch(e){} },80);
}
function pasteClose(){ var m=document.getElementById("pasteModal"); if(m)m.parentNode.removeChild(m); }
window.pasteClose=pasteClose;

/* coller n'importe où dans l'app (ordinateur surtout) */
document.addEventListener("paste",function(e){
  var t=e.target;
  if(t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable))return;
  var dt=e.clipboardData; if(!dt)return;
  var items=[].slice.call(dt.items||[]);
  var imgItem=items.filter(function(it){return it.type&&it.type.indexOf("image/")===0;})[0];
  if(imgItem){
    e.preventDefault();
    importImageBlob(imgItem.getAsFile(),{title:"Inspiration collée",platform:"Image"})
      .then(function(){ goView("inspirations"); toast("Image collée et ajoutée"); })
      .catch(function(err){ toast(String(err.message||err)); });
    return;
  }
  var txt=dt.getData("text");
  if(txt&&/https?:\/\//.test(txt)){ e.preventDefault(); handlePastedText(txt); }
});

/* ---------- mode d'emploi iPhone ---------- */
function shareHelp(){
  var base=location.origin+location.pathname.replace(/[^/]*$/,"")+"index.html";
  var ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
  var ov=document.getElementById("shareHelpModal");
  if(ov)ov.parentNode.removeChild(ov);
  ov=document.createElement("div");
  ov.id="shareHelpModal";
  ov.style.cssText="position:fixed;inset:0;background:rgba(46,42,40,.45);display:flex;align-items:center;justify-content:center;z-index:210;padding:16px;";
  ov.innerHTML='<div class="card" style="max-width:520px;width:100%;max-height:88vh;overflow:auto;">'+
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:4px;">'+
      '<h3 style="font-size:17px;">Mettre « Mon Atelier » dans le menu Partager</h3>'+
      '<button class="x" onclick="shareHelpClose()">&times;</button></div>'+
    '<div class="seg" id="shareHelpTabs" style="margin:12px 0;">'+
      '<button class="'+(ios?"on":"")+'" data-t="ios">iPhone</button>'+
      '<button class="'+(ios?"":"on")+'" data-t="android">Android</button></div>'+

    '<div id="shareHelpIos" style="display:'+(ios?"block":"none")+';">'+
      '<p class="muted" style="font-size:13.5px;line-height:1.6;margin:0 0 12px;">iOS ne permet pas à une app web d\'apparaître seule dans le menu Partager. Un raccourci fait le travail — à créer une seule fois, en deux minutes.</p>'+
      '<ol style="font-size:14px;line-height:1.75;padding-left:20px;margin:0 0 14px;">'+
      '<li>Ouvre l\'app <b>Raccourcis</b> → <b>+</b> en haut à droite.</li>'+
      '<li>Touche le titre du raccourci → <b>Renommer</b> → « Mon Atelier ».</li>'+
      '<li>Touche l\'icône <b>ⓘ</b> (Détails) → active <b>Afficher dans la feuille de partage</b>. Dans « Types acceptés », garde <b>Images</b> et <b>URL</b>.</li>'+
      '<li>Ajoute l\'action <b>Si</b> : « Si <i>Entrée du raccourci</i> a une <b>valeur</b> ».</li>'+
      '<li>Dans le <b>Si</b>, ajoute <b>Copier dans le presse-papiers</b> (entrée = Entrée du raccourci), puis <b>Ouvrir l\'URL</b> avec :<br>'+
        '<code style="display:block;background:var(--surface2);padding:8px 10px;border-radius:8px;margin:6px 0;font-size:12px;word-break:break-all;">'+esc(base)+'?paste=1</code></li>'+
      '<li>Termine. Désormais : dans Instagram ou Pinterest, <b>Partager → Mon Atelier</b>, puis un appui sur <b>Coller</b> dans l\'app.</li>'+
      '</ol>'+
      '<p class="muted" style="font-size:13px;line-height:1.6;margin:0 0 12px;">Encore plus simple pour Instagram : fais une <b>capture d\'écran</b>, touche l\'aperçu en bas à gauche, <b>Partager → Mon Atelier</b>.</p>'+
      '<div style="display:flex;gap:8px;flex-wrap:wrap;">'+
        '<button class="btn" onclick="shareCopyUrl(\''+esc(base)+'?paste=1\')">Copier l\'adresse du raccourci</button>'+
        '<button class="btn ghost" onclick="shareHelpClose()">Fermer</button></div>'+
    '</div>'+

    '<div id="shareHelpAndroid" style="display:'+(ios?"none":"block")+';">'+
      '<p class="muted" style="font-size:13.5px;line-height:1.6;margin:0 0 12px;">Rien à installer : il suffit que l\'app soit ajoutée à l\'écran d\'accueil.</p>'+
      '<ol style="font-size:14px;line-height:1.75;padding-left:20px;margin:0 0 14px;">'+
      '<li>Ouvre l\'app dans <b>Chrome</b> → menu <b>⋮</b> → <b>Installer l\'application</b>.</li>'+
      '<li>Dans Instagram, Pinterest, Vinted ou la galerie : <b>Partager</b> → <b>Mon Atelier</b>.</li>'+
      '<li>L\'image ou le lien arrive directement dans tes inspirations.</li>'+
      '</ol>'+
      '<p class="muted" style="font-size:13px;line-height:1.6;">Sur Instagram, partage plutôt une <b>capture d\'écran</b> : le lien seul ne donne pas la photo.</p>'+
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;"><button class="btn ghost" onclick="shareHelpClose()">Fermer</button></div>'+
    '</div></div>';
  document.body.appendChild(ov);
  ov.querySelectorAll("#shareHelpTabs button").forEach(function(b){
    b.addEventListener("click",function(){
      ov.querySelectorAll("#shareHelpTabs button").forEach(function(n){n.classList.remove("on");});
      b.classList.add("on");
      document.getElementById("shareHelpIos").style.display=b.dataset.t==="ios"?"block":"none";
      document.getElementById("shareHelpAndroid").style.display=b.dataset.t==="android"?"block":"none";
    });
  });
}
function shareHelpClose(){ var m=document.getElementById("shareHelpModal"); if(m)m.parentNode.removeChild(m); }
function shareCopyUrl(u){
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(u).then(function(){toast("Adresse copiée");},function(){toast(u);});
  else toast(u);
}
window.shareHelp=shareHelp; window.shareHelpClose=shareHelpClose; window.shareCopyUrl=shareCopyUrl;

/* ---------- au chargement ---------- */
function handleShared(){
  var qs=new URLSearchParams(location.search);
  var clean=function(){ try{history.replaceState({},"",location.pathname);}catch(e){} };

  if(qs.get("shared")){
    goView("inspirations");
    consumeSharedPayload().then(function(ok){
      if(!ok)toast("Rien reçu du partage — réessaie");
      clean();
    });
    return;
  }
  if(qs.get("paste")){
    goView("inspirations");
    clean();
    setTimeout(function(){
      var ov=document.createElement("div");
      ov.id="pasteInvite";
      ov.style.cssText="position:fixed;inset:0;background:rgba(46,42,40,.5);display:flex;align-items:center;justify-content:center;z-index:210;padding:16px;";
      ov.innerHTML='<div class="card" style="max-width:380px;width:100%;text-align:center;">'+
        '<h3 style="font-size:18px;margin-bottom:8px;">Ton inspiration est prête</h3>'+
        '<p class="muted" style="font-size:13.5px;line-height:1.55;margin:0 0 16px;">Un appui pour la coller dans ton atelier.</p>'+
        '<button class="btn" style="width:100%;padding:14px;font-size:16px;" onclick="document.getElementById(\'pasteInvite\').remove();pasteFromClipboard();">Coller</button>'+
        '<button class="btn ghost" style="width:100%;margin-top:8px;" onclick="document.getElementById(\'pasteInvite\').remove()">Plus tard</button></div>';
      document.body.appendChild(ov);
    },250);
    return;
  }
  var shared=qs.get("url")||qs.get("text")||"";
  var m=shared.match(/https?:\/\/\S+/);
  if(m){ shareImportLink(m[0]); clean(); }
}
window.handleShared=handleShared;
handleShared();
