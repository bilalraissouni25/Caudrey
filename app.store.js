"use strict";
/* ===== Stockage des images dans IndexedDB =====
 * Avant : toutes les photos vivaient en base64 dans localStorage (~5 Mo maxi) —
 * au bout de quelques dizaines d'inspirations, save() échouait et PLUS RIEN ne se
 * sauvegardait. Désormais localStorage ne garde que le texte, et les images vont
 * dans IndexedDB (des centaines de Mo).
 *
 * Fonctionnement : en mémoire, state contient des URL blob: directement affichables ;
 * sur disque, ces URL sont remplacées par « idb:<id> ». Aucun autre module n'a besoin
 * de le savoir.
 */
(function(){
  var DB="atelierImages", STORE="img", VER=1;
  var byId={}, byUrl={}, dbp=null, pending=0;

  function open(){
    if(dbp)return dbp;
    dbp=new Promise(function(res,rej){
      if(!window.indexedDB)return rej(new Error("IndexedDB indisponible"));
      var rq=indexedDB.open(DB,VER);
      rq.onupgradeneeded=function(){ var db=rq.result; if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE); };
      rq.onsuccess=function(){res(rq.result);};
      rq.onerror=function(){rej(rq.error||new Error("ouverture impossible"));};
    });
    return dbp;
  }
  function tx(mode){ return open().then(function(db){ return db.transaction(STORE,mode).objectStore(STORE); }); }
  function idbPut(id,blob){
    pending++;
    return tx("readwrite").then(function(st){
      return new Promise(function(res,rej){ var r=st.put(blob,id); r.onsuccess=function(){res(true);}; r.onerror=function(){rej(r.error);}; });
    }).then(function(v){pending--;return v;},function(e){pending--;throw e;});
  }
  function idbDel(id){ return tx("readwrite").then(function(st){ st.delete(id); }).catch(function(){}); }
  function idbAll(){
    return tx("readonly").then(function(st){
      return new Promise(function(res,rej){
        var out={}, rq=st.openCursor();
        rq.onsuccess=function(){ var c=rq.result; if(!c)return res(out); out[c.key]=c.value; c.continue(); };
        rq.onerror=function(){rej(rq.error);};
      });
    });
  }

  /* --- conversions --- */
  function dataUrlToBlob(d){
    var m=/^data:([^;,]+)?(;base64)?,(.*)$/.exec(d);
    if(!m)return null;
    var type=m[1]||"image/jpeg", body=m[3];
    try{
      if(m[2]){
        var bin=atob(body), n=bin.length, arr=new Uint8Array(n);
        for(var i=0;i<n;i++)arr[i]=bin.charCodeAt(i);
        return new Blob([arr],{type:type});
      }
      return new Blob([decodeURIComponent(body)],{type:type});
    }catch(e){ return null; }
  }
  function newId(){ return "i"+Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
  function register(id,blob){
    var url=URL.createObjectURL(blob);
    byId[id]=url; byUrl[url]=id;
    return url;
  }

  /* --- parcours générique de l'état --- */
  function walk(node,fn,seen){
    seen=seen||[];
    if(!node||typeof node!=="object")return;
    if(seen.indexOf(node)>=0)return; seen.push(node);
    if(Array.isArray(node)){
      for(var i=0;i<node.length;i++){
        if(typeof node[i]==="string"){ var r=fn(node[i]); if(r!==undefined)node[i]=r; }
        else walk(node[i],fn,seen);
      }
      return;
    }
    for(var k in node){
      if(!Object.prototype.hasOwnProperty.call(node,k))continue;
      var v=node[k];
      if(typeof v==="string"){ var r2=fn(v); if(r2!==undefined)node[k]=r2; }
      else walk(v,fn,seen);
    }
  }

  /* --- migration au démarrage : idb:<id> -> blob: --- */
  function boot(){
    return idbAll().then(function(all){
      Object.keys(all).forEach(function(id){ if(all[id])register(id,all[id]); });
      var missing=0;
      walk(state,function(v){
        if(v.indexOf("idb:")!==0)return;
        var id=v.slice(4);
        if(byId[id])return byId[id];
        missing++; return "";
      });
      /* ménage : on supprime les images auxquelles plus rien ne renvoie */
      var used={};
      walk(state,function(v){ if(byUrl[v])used[byUrl[v]]=1; });
      Object.keys(byId).forEach(function(id){
        if(!used[id]){ URL.revokeObjectURL(byId[id]); delete byUrl[byId[id]]; delete byId[id]; idbDel(id); }
      });
      if(missing&&typeof toast==="function")toast(missing+" image(s) introuvable(s)");
      if(typeof renderAll==="function")renderAll();
      return true;
    }).catch(function(){ return false; });
  }

  /* --- save() : data: -> IndexedDB, blob: -> idb:<id> dans le JSON --- */
  var rawSave=window.save;
  window.save=function(){
    try{
      /* 1. les nouvelles images (data:) partent dans IndexedDB */
      walk(state,function(v){
        if(v.indexOf("data:image")!==0)return;
        var blob=dataUrlToBlob(v);
        if(!blob)return;
        var id=newId();
        idbPut(id,blob).catch(function(){});
        return register(id,blob);
      });
      /* 2. on sérialise une copie où les blob: redeviennent des idb:<id> */
      var clone=JSON.parse(JSON.stringify(state,function(k,v){
        if(typeof v==="string"&&v.indexOf("blob:")===0)return byUrl[v]?("idb:"+byUrl[v]):"";
        return v;
      }));
      localStorage.setItem("monAtelierCouture_v5",JSON.stringify(clone));
      return true;
    }catch(e){
      /* dernier recours : on laisse l'ancienne logique tenter sa chance */
      try{ return rawSave(); }catch(e2){ return false; }
    }
  };

  /* --- sauvegarde exportable : on ré-inline les images --- */
  function blobToDataUrl(blob){
    return new Promise(function(res){ var r=new FileReader(); r.onload=function(){res(r.result);}; r.onerror=function(){res("");}; r.readAsDataURL(blob); });
  }
  window.exportData=function(){
    if(typeof toast==="function")toast("Préparation de la sauvegarde…");
    idbAll().then(function(all){
      var map={};
      Object.keys(all).forEach(function(id){ map[id]=all[id]; });
      var ids=[], clone=JSON.parse(JSON.stringify(state,function(k,v){
        if(typeof v==="string"&&v.indexOf("blob:")===0&&byUrl[v]){ var id=byUrl[v]; ids.push(id); return "idb:"+id; }
        return v;
      }));
      return Promise.all(ids.map(function(id){
        return map[id]?blobToDataUrl(map[id]).then(function(d){ return [id,d]; }):Promise.resolve([id,""]);
      })).then(function(pairs){
        var dict={}; pairs.forEach(function(p){ dict[p[0]]=p[1]; });
        walk(clone,function(v){ if(v.indexOf("idb:")===0)return dict[v.slice(4)]||""; });
        var blob=new Blob([JSON.stringify(clone,null,2)],{type:"application/json"});
        var a=document.createElement("a"); a.href=URL.createObjectURL(blob);
        a.download="mon-atelier-couture.json"; document.body.appendChild(a); a.click();
        setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); },400);
        if(typeof toast==="function")toast("Sauvegarde exportée");
      });
    }).catch(function(){ if(typeof toast==="function")toast("Export impossible"); });
  };

  /* --- outils de diagnostic (console) --- */
  window.storeInfo=function(){
    return idbAll().then(function(all){
      var n=0,o=0; Object.keys(all).forEach(function(k){ n++; o+=(all[k]&&all[k].size)||0; });
      var ls=(localStorage.getItem("monAtelierCouture_v5")||"").length;
      var info={images:n, pesent:Math.round(o/1024)+" Ko", localStorage:Math.round(ls/1024)+" Ko", ecrituresEnCours:pending};
      console.log(info); return info;
    });
  };

  boot();
})();
