const CACHE="atelier-couture-v31";
const SHARE="atelier-share";
const ASSETS=["./","./index.html","./app.libimg.js","./app.fs.bundle.js","./app.fsinfo.js","./app.fsx2.js","./app.v6.js","./app.store.js","./app.profiles.js","./app.composer.js","./app.elements.js","./app.elements2.js","./app.patterns2.js","./app.motifs.js","./app.freesewing.js","./app.illus.js","./app.gemini.js","./app.studio2.js","./app.fsmore.js","./app.print.js","./app.share.js","./app.guide.js","./app.atelier.js","./app.mesures.js","./app.accueil.js","./vendor/jspdf.umd.min.js","./vendor/svg2pdf.umd.min.js","./manifest.webmanifest","./icon-192.png","./icon-512.png"];

/* On met en cache fichier par fichier : un seul fichier manquant ne doit pas
   faire échouer toute l'installation (sinon plus de hors-ligne ni de partage). */
self.addEventListener("install",e=>{
  e.waitUntil(
    caches.open(CACHE)
      .then(c=>Promise.all(ASSETS.map(a=>c.add(a).catch(()=>null))))
      .then(()=>self.skipWaiting())
  );
});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k!==SHARE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});

/* ---- Partager → Mon Atelier (Android) : on récupère l'image et/ou le lien, puis on ouvre l'app ---- */
async function handleShare(request){
  const base=self.registration.scope;
  try{
    const fd=await request.formData();
    const file=fd.get("image");
    const meta={
      title:(fd.get("title")||"").toString(),
      text:(fd.get("text")||"").toString(),
      url:(fd.get("url")||"").toString(),
      t:Date.now()
    };
    const c=await caches.open(SHARE);
    if(file&&file.size){
      await c.put(new URL("__shared-image",base).href,
        new Response(file,{headers:{"Content-Type":file.type||"image/jpeg"}}));
    }
    await c.put(new URL("__shared-meta",base).href,
      new Response(JSON.stringify(meta),{headers:{"Content-Type":"application/json"}}));
  }catch(e){}
  return Response.redirect(new URL("index.html?shared=1",base).href,303);
}

self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(u.origin!==location.origin)return;
  if(e.request.method==="POST"&&u.pathname.endsWith("/share-target")){
    e.respondWith(handleShare(e.request));
    return;
  }
  if(e.request.method!=="GET")return;
  /* Réseau d'abord (toujours la dernière version en ligne), cache en secours (hors-ligne). */
  e.respondWith(
    fetch(e.request).then(resp=>{
      if(resp&&resp.ok){const cp=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));}
      return resp;
    }).catch(()=>caches.match(e.request).then(r=>r||(e.request.mode==="navigate"?caches.match("./index.html"):undefined)))
  );
});
