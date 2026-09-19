"use strict";
/* ===== iPhone → Mon Atelier : la boîte de réception =====
 *
 * Le problème, vérifié (firt.dev, WebKit #194593) :
 *   1. iOS ne laisse pas une app web apparaître dans le menu Partager (pas de share_target).
 *   2. Une app ajoutée à l'écran d'accueil a son PROPRE stockage, séparé de Safari.
 *   3. Un lien ouvert depuis un raccourci s'ouvre dans Safari, jamais dans l'app installée.
 * L'ancien parcours (raccourci → copie → ouvre ?paste=1) atterrissait donc dans Safari :
 * l'inspiration était enregistrée… dans un stockage que l'app installée ne voit pas.
 *
 * La solution : le raccourci ne rouvre rien. Il dépose le lien dans une boîte aux lettres
 * (un « sujet » ntfy.sh au nom aléatoire, qui sert de mot de passe) et affiche
 * « Envoyé ✓ » — on reste dans Instagram. À la prochaine ouverture de l'app, elle relève
 * la boîte et importe tout, photo comprise quand c'est possible.
 *
 * Limites assumées : ntfy.sh garde les messages 12 h ; au-delà il faut un serveur ntfy
 * à soi (champ « serveur » ci-dessous), rien d'autre ne change.
 */

var INBOX_DEF_SERVER="https://ntfy.sh";

function inboxCfg(){
  if(typeof state==="undefined")return {};
  if(!state.inbox)state.inbox={};
  var c=state.inbox;
  if(!c.server)c.server=INBOX_DEF_SERVER;
  if(!c.topic){
    var a=new Uint8Array(16); (window.crypto||window.msCrypto).getRandomValues(a);
    c.topic="atelier-"+Array.prototype.map.call(a,function(b){return ("0"+b.toString(36)).slice(-2);}).join("").slice(0,22);
    try{ save(); }catch(e){}
  }
  if(!c.vus)c.vus=[];
  return c;
}
function inboxBase(){ var c=inboxCfg(); return c.server.replace(/\/+$/,""); }

/* ---------- lecture de la boîte ---------- */
function inboxFetch(url){
  /* direct d'abord ; si le navigateur refuse (CORS, réseau), on passe par les relais */
  return fetch(url,{cache:"no-store"}).then(function(r){
    if(!r.ok)throw new Error("HTTP "+r.status); return r.text();
  }).catch(function(){
    var i=0;
    function next(){
      if(typeof PROXIES==="undefined"||i>=PROXIES.length)return Promise.reject(new Error("boîte injoignable"));
      return fetch(PROXIES[i++](url+"&_="+Date.now()),{cache:"no-store"}).then(function(r){
        if(!r.ok)throw 0; return r.text();
      }).catch(next);
    }
    return next();
  });
}
function inboxParse(txt){
  return String(txt||"").split("\n").map(function(l){
    l=l.trim(); if(!l)return null;
    try{ return JSON.parse(l); }catch(e){ return null; }
  }).filter(function(m){ return m&&m.event==="message"; });
}

var _inboxBusy=false, _inboxLast=0;
function inboxPoll(opt){
  opt=opt||{};
  var c=inboxCfg();
  /* on ne relève que si le raccourci a été mis en place (sinon : aucune requête) */
  if(!c.topic||c.off||!(c.installe||c.vuSetup))return Promise.resolve(0);
  if(_inboxBusy)return Promise.resolve(0);
  if(!opt.force&&Date.now()-_inboxLast<20000)return Promise.resolve(0);
  _inboxBusy=true; _inboxLast=Date.now();
  var since=c.dernier||"12h";
  var url=inboxBase()+"/"+encodeURIComponent(c.topic)+"/json?poll=1&since="+encodeURIComponent(since);
  inboxEtat("relève…");
  return inboxFetch(url).then(function(txt){
    var msgs=inboxParse(txt).filter(function(m){ return c.vus.indexOf(m.id)<0; });
    if(!msgs.length){ inboxEtat(); return 0; }
    if(!c.installe){ c.installe=true; save(); }
    /* un par un : on ne sature pas les relais et l'ordre d'arrivée est respecté */
    var n=0;
    return msgs.reduce(function(p,m){
      return p.then(function(){
        return inboxImport(m).then(function(ok){ if(ok)n++; }).catch(function(){}).then(function(){
          c.vus.push(m.id); if(c.vus.length>300)c.vus=c.vus.slice(-300);
          c.dernier=m.id; save();
        });
      });
    },Promise.resolve()).then(function(){
      if(n)toast(n===1?"1 inspiration arrivée de ton iPhone":n+" inspirations arrivées de ton iPhone");
      inboxEtat();
      return n;
    });
  }).catch(function(e){
    inboxEtat("hors ligne");
    return 0;
  }).then(function(n){ _inboxBusy=false; return n; });
}

/* ---------- un message → une inspiration ---------- */
function inboxImport(m){
  var txt=String(m.message||"").trim();
  if(!txt||txt==="__test__")return Promise.resolve(false);
  var u=(txt.match(/https?:\/\/[^\s"'<>]+/)||[])[0];
  if(!u){
    /* du texte seul : une note d'idée */
    state.inspirations.unshift({id:uid(),title:txt.slice(0,70),img:"",note:txt.slice(0,400),url:"",platform:"Note",tags:[]});
    save(); if(typeof renderInspo==="function")renderInspo();
    return Promise.resolve(true);
  }
  u=u.replace(/[).,;]+$/,"");
  if(isInstagram(u))u=u.split("?")[0];   /* ?igsh=… : un traceur de partage, rien d'utile */
  if(state.inspirations.some(function(x){ return x.url&&x.url.split("?")[0]===u.split("?")[0]; }))return Promise.resolve(false);
  var plat=platformFromUrl(u);
  var meta;
  if(isInstagram(u))meta=igFetch(u);
  else if(isTiktok(u))meta=tiktokOembed(u).catch(function(){ return fetchHtml(u).then(metaFrom); });
  else meta=fetchHtml(u).then(metaFrom);
  return meta.catch(function(){ return {}; }).then(function(d){
    d=d||{};
    var titre=(d.title||(d.auteur?"@"+d.auteur:"")||("Inspiration "+plat)).slice(0,90);
    var note=(d.caption||d.desc||"").slice(0,300);
    var info={title:titre,note:note,url:u,platform:plat};
    function lienSeul(img){
      var obj={id:uid(),title:titre,img:img||"",note:note,url:u,platform:plat,tags:[],photoManquante:!img};
      state.inspirations.unshift(obj); save();
      if(typeof autoTag==="function")try{autoTag(obj);}catch(e){}
      if(typeof renderInspo==="function")renderInspo();
      return true;
    }
    if(!d.img)return lienSeul("");
    /* une vraie copie locale : les adresses d'image Instagram expirent */
    return saveRemoteImage(d.img,info).then(function(){ return true; })
      .catch(function(){ return lienSeul(isInstagram(u)?"":d.img); });
  });
}

/* ---------- Instagram : trois sources, de la plus officielle à la plus robuste ---------- */
function igDecode(s){
  var t=document.createElement("textarea"); t.innerHTML=s; return t.value;
}
/* 1. oEmbed Meta, sans jeton depuis le 15/06/2026 pour les posts publics.
      Meta a retiré thumbnail_url des réponses fin 2025 ; on le demande explicitement,
      et on garde au moins la légende contenue dans le HTML d'intégration. */
function igOembed(url){
  var base="https://graph.facebook.com/v25.0/instagram_oembed?omitscript=true&url="+encodeURIComponent(url);
  function lire(t){
    var d=(typeof t==="string")?JSON.parse(t):t;
    if(!d||d.error)throw new Error("oEmbed");
    var cap="";
    if(d.html){
      var doc=new DOMParser().parseFromString(d.html,"text/html");
      var p=doc.querySelector("blockquote p, blockquote a");
      cap=p?p.textContent.trim():"";
    }
    return {img:d.thumbnail_url||"", auteur:d.author_name||"", caption:cap};
  }
  function essai(u){
    return fetch(u,{cache:"no-store"}).then(function(r){ if(!r.ok)throw 0; return r.json(); }).then(lire)
      .catch(function(){ return fetchHtml(u).then(lire); });
  }
  return essai(base+"&fields=thumbnail_url,author_name,html").catch(function(){ return essai(base); });
}
/* 2. La page d'intégration publique (celle qu'affichent tous les sites qui intègrent un post) */
function igEmbedPage(url){
  var e=igEmbedUrl(url); if(!e)return Promise.reject(new Error("pas un post"));
  return fetchHtml(e).then(function(html){
    var doc=new DOMParser().parseFromString(html,"text/html");
    var img="", auteur="", cap="";
    var im=doc.querySelector("img.EmbeddedMediaImage")||doc.querySelector(".EmbeddedMedia img")||doc.querySelector('img[src*="scontent"]');
    if(im)img=im.getAttribute("src")||"";
    if(!img){
      var m=html.match(/"display_url"\s*:\s*"([^"]+)"/)||html.match(/\\"display_url\\":\\"([^\\"]+(?:\\\\\/[^\\"]*)*)\\"/);
      if(m)img=m[1].replace(/\\\//g,"/").replace(/\\u0026/g,"&").replace(/\\\\/g,"");
    }
    var us=doc.querySelector(".UsernameText")||doc.querySelector(".Username");
    if(us)auteur=us.textContent.trim();
    var c=doc.querySelector(".Caption");
    if(c){
      var cl=c.cloneNode(true);
      cl.querySelectorAll(".CaptionUsername,.CaptionComments").forEach(function(n){ n.remove(); });
      cap=cl.textContent.replace(/\s+/g," ").trim();
    }
    if(!img&&!cap)throw new Error("embed vide");
    return {img:igDecode(img), auteur:auteur, caption:cap};
  });
}
/* on combine : ce qui manque à l'un, l'autre le complète */
function igFetch(url){
  var a=igOembed(url).catch(function(){ return {}; });
  return a.then(function(o){
    if(o.img&&o.caption)return o;
    return igEmbedPage(url).then(function(e){
      return {img:o.img||e.img, auteur:o.auteur||e.auteur, caption:o.caption||e.caption};
    }).catch(function(){ if(o.img||o.caption||o.auteur)return o; throw new Error("Instagram muet"); });
  }).then(function(r){
    r.title=r.auteur?("@"+r.auteur):"Inspiration Instagram";
    return r;
  });
}
/* l'import manuel (coller un lien) profite de la même chaîne */
window.instagramMeta=function(url){
  return igFetch(url).then(function(r){ return {img:r.img||"", title:r.title, desc:r.caption||"", html:""}; });
};

/* ---------- affichage de l'état dans la page Inspirations ---------- */
function inboxEtat(msg){
  var el=document.getElementById("inboxEtat"); if(!el)return;
  var c=inboxCfg();
  if(!c.installe){ el.innerHTML='<button class="btn ghost sm" onclick="inboxSetup()">Envoyer depuis Instagram sur iPhone ›</button>'; return; }
  var h=new Date(_inboxLast||Date.now());
  el.innerHTML='<span class="ib-dot'+(msg==="hors ligne"?" off":"")+'"></span> Boîte iPhone '+
    (msg?esc(msg):('relevée à '+("0"+h.getHours()).slice(-2)+':'+("0"+h.getMinutes()).slice(-2)))+
    ' · <a href="#" onclick="inboxPoll({force:true});return false;">relever</a> · <a href="#" onclick="inboxSetup();return false;">réglages</a>';
}

/* ---------- mise en place : le raccourci, pas à pas ---------- */
function inboxCopier(txt,label){
  function ok(){ toast((label||"Copié")+" ✓"); }
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(ok,function(){ prompt("Copie ceci :",txt); });
  else prompt("Copie ceci :",txt);
}
function inboxSetup(){
  var c=inboxCfg();
  if(!c.vuSetup){ c.vuSetup=true; save(); }
  var old=document.getElementById("ibModal"); if(old)old.remove();
  var ov=document.createElement("div"); ov.id="ibModal"; ov.className="tq-ov";
  var lien=c.lienRaccourci||"";
  var code='<code class="ib-code">';
  ov.innerHTML='<div class="card tq-box">'+
    '<div class="tq-hd"><div><div class="tq-cat">iPhone · 3 minutes, une seule fois</div><h3>Partager depuis Instagram vers Mon Atelier</h3></div>'+
      '<button class="x" onclick="document.getElementById(\'ibModal\').remove()">&times;</button></div>'+
    '<p class="tq-why">Ensuite, sur n\'importe quel post : <b>Partager → Mon Atelier</b>. Un petit « Envoyé ✓ » s\'affiche, tu restes dans Instagram. Le post, sa photo et sa légende t\'attendent dans l\'app.</p>'+

    (lien?'<div class="ib-fast"><b>Installation express</b><div class="muted" style="font-size:13px;margin:4px 0 10px;">Le raccourci est déjà prêt : touche le bouton, puis colle ton code quand l\'iPhone le demande.</div>'+
      '<div style="display:flex;gap:8px;flex-wrap:wrap;"><a class="btn" href="'+esc(lien)+'" target="_blank" rel="noopener">Installer le raccourci</a>'+
      '<button class="btn ghost" onclick="inboxCopier(\''+esc(c.topic)+'\',\'Code copié\')">Copier mon code</button></div></div>'+
      '<div class="tq-sec">Ou à la main</div>':'')+

    '<ol class="tq-et">'+
      '<li>Ouvre l\'app <b>Raccourcis</b>, touche <b>+</b>. Touche le nom en haut → <b>Renommer</b> → « Mon Atelier ».</li>'+
      '<li>Touche <b>ⓘ</b> en bas → active <b>Afficher dans la feuille de partage</b>. En haut de l\'éditeur, touche le mot bleu après « Recevoir » et ne garde que <b>URL</b> et <b>Texte</b>. Juste en dessous, « Si aucune entrée » → <b>Obtenir le presse-papiers</b>.</li>'+
      '<li>Ajoute l\'action <b>Obtenir le contenu de l\'URL</b>. Dans URL, colle :'+
        '<div class="ib-row">'+code+esc(inboxBase())+'</code><button class="btn ghost sm" onclick="inboxCopier(\''+esc(inboxBase())+'\',\'Adresse copiée\')">Copier</button></div></li>'+
      '<li>Touche <b>›</b> sur l\'action : Méthode <b>POST</b>, Corps de la requête <b>JSON</b>. Ajoute deux champs <b>Texte</b> :'+
        '<div class="ib-row"><span class="ib-k">topic</span>'+code+esc(c.topic)+'</code><button class="btn ghost sm" onclick="inboxCopier(\''+esc(c.topic)+'\',\'Code copié\')">Copier</button></div>'+
        '<div class="ib-row"><span class="ib-k">message</span><span class="muted" style="font-size:13px;">touche le champ, puis la variable <b>Entrée du raccourci</b></span></div></li>'+
      '<li>Ajoute l\'action <b>Afficher la notification</b> : « Envoyé à Mon Atelier ✓ ». C\'est fini.</li>'+
    '</ol>'+
    '<div class="tq-tip"><b>Ton code est ta clé</b> Toute personne qui le connaît peut lire et déposer des liens dans ta boîte : ne le partage pas. Tu peux en changer à tout moment (il faudra alors mettre le raccourci à jour).</div>'+

    '<div class="tq-sec">Vérifier que tout marche</div>'+
    '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">'+
      '<button class="btn" onclick="inboxTest()">Tester la boîte</button>'+
      '<button class="btn ghost" onclick="inboxPoll({force:true})">Relever maintenant</button>'+
      '<span id="ibTest" class="muted" style="font-size:13px;"></span></div>'+
    '<p class="muted" style="font-size:12.5px;line-height:1.5;margin:10px 0 0;">Puis fais un vrai essai : partage un post depuis Instagram, reviens ici, il arrive dans tes inspirations. Les envois sont gardés <b>12 h</b> : ouvre l\'app au moins une fois dans la journée.</p>'+

    '<details style="margin-top:14px;"><summary class="muted" style="font-size:13px;cursor:pointer;">Réglages avancés</summary>'+
      '<label class="fld" style="margin-top:10px;">Serveur (ntfy)</label><input id="ibServer" type="url" value="'+esc(c.server)+'">'+
      '<label class="fld" style="margin-top:10px;">Lien iCloud du raccourci (installation express)</label><input id="ibLien" type="url" placeholder="https://www.icloud.com/shortcuts/…" value="'+esc(lien)+'">'+
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">'+
        '<button class="btn ghost sm" onclick="inboxSaveCfg()">Enregistrer</button>'+
        '<button class="btn ghost sm" onclick="inboxNewCode()">Changer de code</button>'+
        '<button class="btn ghost sm" onclick="inboxToggle()">'+(c.off?"Réactiver la boîte":"Désactiver la boîte")+'</button></div>'+
    '</details>'+
  '</div>';
  document.body.appendChild(ov);
  ov.addEventListener("click",function(e){ if(e.target===ov)ov.remove(); });
}
function inboxSaveCfg(){
  var c=inboxCfg();
  var s=(document.getElementById("ibServer").value||"").trim(); if(/^https?:\/\//.test(s))c.server=s;
  c.lienRaccourci=(document.getElementById("ibLien").value||"").trim();
  save(); toast("Réglages enregistrés"); inboxSetup();
}
function inboxNewCode(){
  if(!confirm("Changer de code ? Le raccourci actuel n'enverra plus rien tant que tu ne l'auras pas mis à jour."))return;
  var c=inboxCfg(); c.topic=""; c.dernier=""; c.vus=[]; inboxCfg(); save(); inboxSetup();
}
function inboxToggle(){ var c=inboxCfg(); c.off=!c.off; save(); inboxSetup(); inboxEtat(); }

/* l'app s'envoie un message à elle-même et le relit : valide le serveur, le code et le réseau */
function inboxTest(){
  var c=inboxCfg(), el=document.getElementById("ibTest");
  if(el)el.innerHTML='<span class="spin"></span> Envoi…';
  fetch(inboxBase()+"/",{method:"POST",body:JSON.stringify({topic:c.topic,message:"__test__",title:"Mon Atelier"})})
    .then(function(r){ if(!r.ok)throw new Error("envoi refusé ("+r.status+")"); return r.json(); })
    .then(function(sent){
      if(el)el.innerHTML='<span class="spin"></span> Relecture…';
      var url=inboxBase()+"/"+encodeURIComponent(c.topic)+"/json?poll=1&since=5m";
      return inboxFetch(url).then(function(t){
        var ok=inboxParse(t).some(function(m){ return m.id===sent.id; });
        if(!ok)throw new Error("message envoyé mais pas relu");
        c.installe=true; save(); inboxEtat();
        if(el)el.innerHTML='<b style="color:var(--accent-ink)">✓ La boîte fonctionne.</b> Fais maintenant un essai depuis Instagram.';
      });
    }).catch(function(e){
      if(el)el.textContent="✗ "+String((e&&e.message)||e)+". Vérifie la connexion, puis réessaie.";
    });
}

/* ---------- l'ancien mode d'emploi iPhone est remplacé ---------- */
(function(){
  var base=window.shareHelp;
  window.shareHelp=function(){
    var ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
    if(ios||!base){ inboxSetup(); return; }
    base();
    var el=document.getElementById("shareHelpIos");
    if(el)el.innerHTML='<p class="muted" style="font-size:13.5px;line-height:1.6;margin:0 0 12px;">Sur iPhone, le partage passe par un raccourci qui dépose le post dans ta boîte Mon Atelier, sans quitter Instagram.</p>'+
      '<button class="btn" onclick="shareHelpClose();inboxSetup()">Configurer sur iPhone</button>';
  };
})();

/* ---------- relève automatique ---------- */
document.addEventListener("DOMContentLoaded",function(){
  var h=document.querySelector("#inspirations .grab-h");
  if(h&&!document.getElementById("inboxEtat")){
    var d=document.createElement("div"); d.id="inboxEtat"; d.className="ib-etat";
    h.parentNode.insertBefore(d,h.nextSibling);
  }
  inboxEtat();
  setTimeout(function(){ inboxPoll(); },1200);
});
document.addEventListener("visibilitychange",function(){
  if(document.visibilityState==="visible")inboxPoll();
});
window.inboxPoll=inboxPoll; window.inboxSetup=inboxSetup; window.inboxTest=inboxTest;
window.inboxSaveCfg=inboxSaveCfg; window.inboxNewCode=inboxNewCode; window.inboxToggle=inboxToggle;
window.inboxCopier=inboxCopier; window.igFetch=igFetch;
