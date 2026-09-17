# Mon Atelier Couture — État du projet (note de reprise)

> À lire en premier pour reprendre le travail, quel que soit le modèle / l'assistant.
> Dernière mise à jour : 14 septembre 2026 — Studio v2 livré.

## Contexte
- Web-app PWA « Atelier Herrgott / Lenuf designs », vanilla JS (pas de build), hébergée sur GitHub Pages, dépôt `Caudrey`.
- Dossier local : `C:\Users\bilal\Documents\app voyage aud\Mon Atelier Couture`. On modifie ici, Bilal réuploade ensuite sur GitHub.
- Données 100 % dans le navigateur (`localStorage`, clé `monAtelierCouture_v5`, objet global `state`). Le code est public, les données privées.
- Libs CDN : Fabric.js 5.3.1, p5.js 1.9.4 (cdnjs). FreeSewing embarqué dans `app.fs.bundle.js`.
- Style code : ES5 (`var`, fonctions globales), un fichier `app.*.js` par module, chargés dans l'ordre en bas de `index.html`. Les modules récents **surchargent** des fonctions globales des modules précédents (ex. `app.studio2.js` redéfinit `cmpAdd`, `cmpRenderEls`, `cmpRenderAI`, `cmpDuplicate`, `cmpClear`, `cmpData`).
- Helpers globaux (dans `app.v6.js`) : `$(id)`, `state`, `save()`, `toast(msg)`, `uid()`, `esc(s)`, `goView(id)`, `renderAll()`.

## Fichiers
| Fichier | Rôle |
|---|---|
| `index.html` | Toute l'UI + CSS. Sections `<section class="view">` par page. |
| `app.v6.js` | Cœur : state, navigation, inspirations, carnet, capsule, profil, tissu, gabarit paramétrique, dessin libre, données, SW register. |
| `app.profiles.js` | Multi-profils de mesures. |
| `app.composer.js` | Studio « Composer » de base (Fabric.js) : canvas `fabCanvas` 480×620, `EL` (bibliothèque d'éléments SVG), couleur/imprimé, texte. |
| `app.elements.js` | Éléments supplémentaires (Robes & jupes, Accessoires, Cols & finitions). |
| `app.elements2.js` | **Nouveau (Studio v2)** : +50 éléments (Hauts, Bas, Manches +, Cols +, Détails +, Technique). |
| `app.studio2.js` | **Nouveau (Studio v2)** : calques, guides/magnétisme, grille, historique, devant/dos, designs sauvegardés (`state.designs`), brouillon auto (`monAtelierCouture_studioDraft`), propriétés, alignement, symétrie, zoom, export PNG/SVG, rendu IA à partir du croquis, raccourcis clavier, rechargement auto quand le SW change. |
| `app.motifs.js` | Générateur de motifs seamless (p5) → fabric.Pattern. |
| `app.libimg.js` | Visuels générés (cartes patrons, swatches, ancien mannequin). |
| `app.fs.bundle.js` | **Bundle FreeSewing v4.10.2 recompilé (16/09/2026) : 68 modèles**, API `FS.draft` (rétro-compatible), `FS.draftSvg`, `FS.info`, `FS.base`, annotations traduites en français. Source du bundle : `build/entry.mjs`. |
| `app.fsinfo.js`, `app.fsx2.js`, `app.freesewing.js`, `app.patterns2.js` | Pages patron, génération sur mesure, bibliothèque, métadonnées des 12 modèles historiques. |
| `app.fsmore.js` | **Nouveau** : catalogue FR des 68 modèles (type, niveau, description), remplissage du sélecteur groupé, fiches d'info générées depuis le bundle, vignettes de patron (cache mémoire + rendu à la demande). |
| `app.print.js` | **Nouveau** : PDF du patron pavé en A4/A0 — page de garde avec carré témoin 5 cm, plan d'assemblage, repères de collage, marges de couture, patron coté. Remplace `fsPrint()` / `patPrint()` et la feuille de style d'aperçu `styleFsSvg()`. |
| `vendor/jspdf.umd.min.js`, `vendor/svg2pdf.umd.min.js` | **Nouveau** : jsPDF 2.5.2 + svg2pdf.js 2.5.0 (MIT), chargés à la demande par `app.print.js`. |
| `build/entry.mjs` | Source du bundle FreeSewing (voir « Reconstruire le bundle »). |
| `app.illus.js` | Placement des 21 illustrations (`Illustrations/`). |
| `app.gemini.js` | Fournisseurs IA (Gemini / OpenAI / Anthropic) : `callText`, `callVision`. |
| `sw.js` | Service worker, cache `atelier-couture-v24`, **network-first** (réseau d'abord, cache en secours hors-ligne). |
| `manifest.webmanifest`, `icon-192.png`, `icon-512.png` | PWA. |

À supprimer du dépôt (obsolètes) : `app.fsexamples.js`, `app.fsx.js` (remplacés par `app.fsx2.js`).

## Fait
- Ossature 6 étapes + Garde-robe capsule, Mes profils, Données ; PWA installable.
- Inspirations (lien OG, image, manuel, palette, tags auto/manuels/vision IA).
- Assistant IA local sans clé, génératif avec clé (OpenAI / Anthropic / Gemini).
- Studio : gabarit paramétrique, dessin libre, **composeur v2** (voir ci-dessous), motifs p5, rendu IA.
- Patrons FreeSewing : 12 modèles, génération sur mesure, page dédiée par patron avec carrousel, import de patron repéré, générateur de pièces simples, calculateur de tissu, bibliothèque de matières.
- Multi-profils, illustrations placées, marque, icône.

### Studio v2 (14/09/2026)
- Panneau **Calques** (`#stLayers`) : sélection, Maj+clic multi, œil, cadenas (`o.locked` + lockMovement/Scaling/Rotation), suppression, renommage (double-clic → `o.name`), réordonnancement par glisser-déposer, boutons ordre.
- **Magnétisme** (`snapObj`) sur bords/centres du canvas et des autres objets, guides roses dessinés sur `fc.contextTop` ; **Grille** dessinée en `after:render` (jamais dans les exports grâce à `st.exporting`).
- **Historique** par vue (`st.hist.devant/dos`), snapshots `fc.toJSON(PROPS)`, Ctrl+Z / Ctrl+Y.
- **Devant / Dos** (`stSetView`) : deux JSON dans `st.views`, mannequin croquis de mode (`manneSVG(view)`), objet `_isManne` non sélectionnable.
- **Designs** : `state.designs = [{id,title,views:{devant,dos},thumbs:{devant,dos},created,updated}]` ; Enregistrer / copie / Nouveau / ouvrir / renommer / dupliquer / supprimer ; brouillon auto restauré au chargement.
- **Propriétés** : couleur, imprimé, contour + épaisseur, opacité, rotation, largeur, aligner ×6, miroir H/V, grouper/dégrouper, symétrie axe central.
- **Zoom** 50–300 % + canvas responsive (`stFit`, dimensions CSS via `setDimensions(...,{cssOnly:true})`).
- **Export** PNG 2× / SVG (mannequin masqué), raccourcis (Suppr, Ctrl+D/C/V/A/G, flèches, Échap).
- **Rendu IA** : envoie le PNG du croquis comme image de référence. Gemini : modèles essayés dans l'ordre `gemini-2.5-flash-image` puis `gemini-2.0-flash-preview-image-generation` ; OpenAI : `POST /v1/images/edits` (gpt-image-1, 1024×1536). **À vérifier avec une vraie clé** (impossible depuis l'environnement de dev).
- SW network-first + reload automatique sur `controllerchange` → plus besoin de « vider les données du site » après cette mise à jour (la v23 cache-first demande un dernier vidage).

Testé en navigateur headless (Playwright) : ajout d'éléments, calques, magnétisme, undo/redo, devant/dos, sauvegarde/chargement/duplication, export SVG, brouillon après rechargement, zoom. Pas d'erreur console.

### Impression & patrons (16/09/2026)
- **Bundle FreeSewing v4.10.2** construit depuis `build/entry.mjs` : 68 modèles (contre 12), 1,78 Mo brut / ~406 Ko gzip. Les 68 se génèrent sans erreur avec `sa`. Mesures de base par taille via `@freesewing/models` (`FS.base(38,'f')`, en mm).
- **Annotations en français** : FreeSewing laisse des clés (`plugin-annotations:cut`, `teagan:chestLine`…) que son frontend traduit ; le bundle les remplace dans le SVG rendu (fonction `translate()` de `entry.mjs`), date comprise. Vérifié : 0 clé brute sur les 68 modèles. Pour ajouter une traduction, éditer `FR` / `FR_DESIGN` dans `entry.mjs` et reconstruire.
- **PDF pavé** (`app.print.js`) : découpe le SVG (1 unité = 1 mm) en pages, une page = un `viewBox` translaté + un clip PDF. Page de garde (carré témoin 50 mm dessiné en unités PDF, donc exact ; plan d'assemblage ; consignes), pastille de code par page (A1, B1…), lignes de collage « coller B1 ici », triangles d'alignement, pied de page. Formats A4 portrait/paysage, Letter, A0 ; recouvrement 5/10/20 mm ; marges de couture 0 à 2 cm ; option patron coté (`paperless`).
- Mesuré sur le PDF rendu à 100 dpi : carré témoin = 50,04 × 50,29 mm. Repères : t-shirt Teagan 18 pages A4, jupe crayon Penelope 13, robe Sophie 29, jupe cercle Sandy 30 (A0 : 3 pages). Génération ~1,5 s pour 30 pages sur desktop.
- **Piège corrigé** : les vignettes de la bibliothèque étaient mises en cache base64 dans `localStorage` (`state.patImg["fs:…"]`) — avec 68 modèles cela saturait le quota et faisait échouer *toutes* les sauvegardes. Désormais cache mémoire (`window._fsThumbs`), rendu à la demande via `IntersectionObserver`, et purge des anciennes entrées au chargement.
- **Autre piège** : `style="background:#xxx"` met `style.backgroundImage` à `"initial"` (chaîne non vide) — l'ancien filtre des vignettes ne générait donc jamais rien. Tester `/url\(/` et non la simple présence.

### Assistant mesures — lot 2.1 (17/09/2026)
- `app.mesures.js` remplace l'ancien formulaire à 6 champs de « Mes profils » par **31 mesures guidées**, chacune avec une silhouette SVG où la mesure est mise en évidence, l'instruction de placement du mètre, et à quoi elle sert. Les mesures facultatives sont marquées comme telles.
- Les mesures sont stockées **sous les noms FreeSewing** (en cm) dans le profil actif, avec un miroir automatique vers les 6 anciennes clés françaises (`taille`, `poitrine`, …) pour ne rien casser. Reprise automatique des anciennes valeurs au premier chargement.
- `fsOverrides()` / `fsMeasure()` sont surchargés : ils envoient désormais **toutes** les mesures connues au moteur (converties en mm), plus `seat` déduit des hanches. Avant, seules 6 mesures partaient et les 7 autres venaient d'une base taille 38 — les patrons étaient donc à moitié standard.
- Effet mesuré : **6 modèles générables sur 68 avant, 55 après** avec un jeu complet. Le résumé en haut de page affiche ce compteur, les mesures les plus utiles à ajouter, et la taille du commerce estimée (utile pour acheter un patron papier).
- Contrôles de cohérence : plages plausibles par mesure, poitrine haute > poitrine, taille-genou > taille-sol, poignet > bras, écart taille/poitrine aberrant. Les cartes fautives passent en orange avec l'explication.
- **Attention** : `saveProfil()` est surchargé (l'ancienne version reconstruisait `mesures` à partir des 6 champs et aurait effacé les 25 autres). Les 6 anciens `<input>` restent dans le DOM, cachés, parce que `renderAll()` d'`app.v6.js` les lit encore au chargement.

### Accueil « Aujourd'hui » (17/09/2026)
- `app.accueil.js` : l'app s'ouvre sur une page qui répond à « qu'est-ce que je fais maintenant ? » — le projet en cours avec sa barre d'avancement et sa prochaine étape, un bouton Continuer qui va droit à l'atelier, quatre compteurs, des pistes contextuelles (compléter les mesures, épingler une inspiration, générer un patron…) et les dernières inspirations en vignettes.
- Le démarrage sur l'accueil est neutralisé si l'URL porte un partage (`?shared`, `?paste`, `?url`) — dans ce cas on va aux inspirations comme avant.

### Images dans IndexedDB — lot 0.3 (17/09/2026)
- `app.store.js` (chargé juste après `app.v6.js`). En mémoire, `state` contient des URL `blob:` directement affichables ; sur disque, elles sont remplacées par `idb:<id>` et les octets vivent dans IndexedDB (base `atelierImages`, store `img`). **Aucun autre module n'a été modifié** : les fonctions de rendu continuent d'utiliser `x.img`.
- `save()` est surchargé : il convertit à la volée tout `data:image…` trouvé n'importe où dans `state` (parcours générique, donc les futures photos de stash ou de journal sont couvertes d'office), écrit dans IndexedDB en tâche de fond, et sérialise une copie où les `blob:` redeviennent des `idb:<id>`.
- Au démarrage : reconstruction des URL blob, puis **ménage** — toute image qu'aucune donnée ne référence plus est supprimée d'IndexedDB.
- `exportData()` surchargé : la sauvegarde `.json` ré-inline toutes les images en base64, donc l'export reste un vrai backup autonome. `importData()` fonctionne sans changement (les `data:` sont repris par le premier `save()`).
- `storeInfo()` en console donne le nombre d'images, leur poids et la taille de localStorage.
- Mesuré : 65 Ko de base64 en localStorage → **1 Ko** ; 44 inspirations + vignettes = 45 images / 387 Ko dans IndexedDB, localStorage à 5 Ko, tous les `save()` réussissent. Suppression d'une inspiration → son image disparaît aussi.
- Reste hors périmètre : le brouillon du Studio (`monAtelierCouture_studioDraft`) garde ses images dans son propre JSON localStorage.

### Par où commencer & mode Atelier — lots 1.1 et 1.2 (17/09/2026)
- `app.guide.js` : **12 projets guidés** en données (`GUIDE_PROJETS`) — chacun avec niveau, temps, tissu conseillé, métrage, budget, mercerie, ce qu'il apprend, les pièges, et son **déroulé d'étapes** (texte, durée, techniques, conseil). Questionnaire de 5 questions (`GUIDE_Q`) → score → 3 propositions dont une mise en avant. Le score pénalise fortement un projet qui demande une machine ou du jersey quand la réponse dit non ; il favorise le bon niveau, la bonne envie et la bonne durée. Enrichir le contenu = ajouter une entrée au tableau, rien d'autre.
- « Démarrer ce projet » crée le projet dans le carnet **avec ses étapes** et ouvre l'atelier.
- `app.atelier.js` : vue `atelier` pensée pour le téléphone à côté de la machine — barre d'avancement, chronomètre (pause automatique si l'onglet passe en arrière-plan ou si on quitte la vue), bloc « prochaine étape » avec son conseil, liste d'étapes cochables avec note et photo par étape, ajout/retrait d'étape, « marquer terminé ».
- `renderProjets()` est **entièrement surchargé** dans `app.atelier.js` (barre d'avancement, temps passé, bouton Ouvrir/Reprendre, « Ajouter des étapes » pour les projets créés à la main). Si tu modifies les cartes du carnet, c'est là — plus dans `app.v6.js`.
- Les photos d'étape passent par `save()` donc atterrissent automatiquement dans IndexedDB.
- Testé : les trois profils de réponses donnent des recommandations cohérentes, création de projet, cochage, chrono, note, photo, retour au carnet synchronisé, et tout survit au rechargement.

### Partage & import d'inspirations (16/09/2026)
- **Android** : `share_target` passé en **POST multipart** (`./share-target`, champ fichier `image`). Le service worker intercepte le POST, range l'image et les métadonnées dans le cache `atelier-share` (clés `__shared-image` / `__shared-meta`, URL absolues calculées depuis `registration.scope`), puis redirige (303) vers `index.html?shared=1`. L'app consomme et vide ce cache au chargement (`consumeSharedPayload`). Testé de bout en bout : POST → 200 → image importée, titre et plateforme conservés.
- **iPhone** : iOS ne permet pas à une PWA d'être cible de partage. Parcours retenu : un **raccourci iOS** « Mon Atelier » dans la feuille de partage, qui copie l'élément puis ouvre `index.html?paste=1` ; l'app affiche alors un grand bouton « Coller » (lecture presse-papiers sur geste utilisateur). Les étapes de création du raccourci sont dans l'app : bouton « Menu Partager › » de l'écran Inspirations (`shareHelp()`), onglets iPhone / Android.
- **Partout** : évènement `paste` global (image ou lien), zone de collage manuelle en repli quand `navigator.clipboard.read()` est refusé, glisser-déposer existant, bouton Photo.
- **Instagram** : trois niveaux, dans cet ordre.
  1. **oEmbed officiel sans jeton** — Meta a rouvert l'accès tokenless le 15 juin 2026 sur `https://graph.facebook.com/v25.0/instagram_oembed?omitscript=true&url=…`, qui renvoie `thumbnail_url` et `author_name` pour les posts publics. L'app l'appelle en direct, puis via relais si CORS refuse. **Non testé en conditions réelles** (accès réseau indisponible depuis l'environnement de dev) — à vérifier sur un vrai lien ; si Meta referme l'accès, les niveaux 2 et 3 prennent le relais sans rien casser.
  2. **Embed officiel en iframe** (`https://www.instagram.com/p/<code>/embed/captioned/`) affiché dans le panneau d'import : la photo est visible même sans miniature récupérable.
  3. **Capture d'écran** partagée ou collée — le seul moyen d'obtenir une copie locale utilisable hors ligne, par la vision IA et comme référence dans le Studio.
  Les adresses d'image Instagram sont signées et **expirent** : le bouton « Épingler avec la photo » télécharge les octets via le relais et enregistre une copie locale (`saveRemoteImage` → `fetchImageBlob` → `importImageBlob`). Le scraping des endpoints internes reste hors de portée (empreinte TLS, IP datacenter bloquées) — ne pas repartir dans cette direction.
- **TikTok** : endpoint oEmbed public sans clé (`https://www.tiktok.com/oembed?url=…`) → miniature récupérée. **Pinterest / Vinted / blogs** : Open Graph via relais CORS.
- `fetchHtml` réécrit avec une **chaîne de relais** (allorigins `raw` → codetabs → corsproxy) au lieu d'un seul, chacun en repli du précédent.
- **Piège corrigé** : le service worker utilisait `cache.addAll(ASSETS)`, qui échoue en bloc si un seul fichier manque — l'installation entière échouait alors, donc plus de hors-ligne *ni de partage*. Remplacé par une mise en cache fichier par fichier tolérante aux absents. C'est ce qui bloquait le partage en test.

### Reconstruire le bundle FreeSewing
```
cd build
npm i @freesewing/core@latest @freesewing/models@latest @freesewing/i18n \
      @freesewing/plugin-transform @freesewing/config esbuild \
      @freesewing/teagan@latest …   # un paquet par modèle listé dans entry.mjs
npx esbuild entry.mjs --bundle --format=iife --minify --outfile=../app.fs.bundle.js
```
Ajouter un modèle = un `import` + une entrée dans l'objet `D` d'`entry.mjs`, puis une ligne dans `FSALL` (`app.fsmore.js`) pour le libellé FR, le type et le niveau.

## Reste à faire

> **L'ordre de priorité et le pourquoi sont dans `ROADMAP.md`** (benchmark, lots, effort, méthode). La liste ci-dessous reste la vue technique.
>
> **Lot 0.1 livré le 16/09/2026** (patron imprimable A4 pavé) — et avec lui le lot 4.1 (bundle FreeSewing v4, 68 modèles), voir la section « Impression & patrons » plus bas. Restent en tête de file : 0.3 images en IndexedDB, 1.1 onboarding première pièce, 1.2 mode Atelier.
>
> Découvertes vérifiées le 15/09/2026, à ne pas refaire :
> - FreeSewing publie **87 designs** en v4 (npm, MIT) ; l'app en embarque 12 en v3.
> - Un bundle v4 (core + 3 designs) se construit avec `esbuild --bundle --format=iife` en **280 Ko** (< les 477 Ko actuels). Dépendances à installer en plus des designs : `@freesewing/plugin-transform`, `@freesewing/config`.
> - **`sa` (marge de couture) est un réglage standard du cœur** : `new Design({measurements, sa: 10, complete: true, paperless: false})` génère bien les chemins de marge ; `paperless: true` ajoute les cotes. Aucun patch à écrire, juste un bundle à jour.
> - Les mesures requises d'un design se lisent dans `Design.patternConfig.measurements` / `.optionalMeasurements` → formulaires générables automatiquement.
> - jsPDF 4.2.1 et svg2pdf.js 2.8.1 sont MIT sur npm → à vendorer dans `vendor/` plutôt qu'en CDN (PWA hors-ligne).
> - Risque bloquant identifié : les images en base64 dans `localStorage` (~5 Mo) vont saturer dès l'ajout de photos → migration IndexedDB à faire avant le stash et le journal photo.

1. **Patron imprimable A4 pavé** : découper le SVG FreeSewing en pages A4 (jsPDF ou impression CSS avec `@page`), carré témoin 5 cm, repères de collage, numéros de page, **option marges de couture** (`sa` FreeSewing : nécessite de recompiler le bundle avec `settings.sa`/`complete`, ou appliquer un offset SVG côté app).
2. **Tech pack / fiche atelier PDF** (jsPDF, cdnjs) : croquis devant/dos (depuis `state.designs` ou le canvas), mesures du profil actif, tissu & métrage, liste de découpe, notes.
3. **Plus de modèles FreeSewing** + exposer les options de chaque design (longueur de manche, etc.) dans l'UI de génération (`app.fsx2.js`).
4. Collecte inspirations niveau 2 : Web Share Target (manifest `share_target`), éventuellement Pinterest API (mini-serveur).
5. Instagram : pas de solution sans API pro (aperçu bloqué). Contournement : capture → import image.
6. Vision IA depuis un lien : Gemini ne va pas chercher l'image distante → il faudrait la télécharger côté client (CORS souvent bloqué) ou passer par un proxy.
7. Placement des illustrations : ajustements page par page si besoin (`app.illus.js`).
8. Idées bonus : cost-per-wear, journal photo par projet, mode partage ; hébergement privé (Netlify/Cloudflare) si confidentialité du code voulue.

## Procédure de mise à jour
1. Modifier les fichiers dans le dossier local.
2. Si un fichier JS est ajouté : l'ajouter à `index.html` (script en bas) **et** à `ASSETS` dans `sw.js`, puis incrémenter `CACHE` (`atelier-couture-vNN`).
3. Réuploader sur `Caudrey` (GitHub Pages).
4. Recharger l'app : avec le SW v24+, le rechargement est automatique ; sinon, une dernière fois, « vider les données du site » ou fenêtre privée.

## Dernier upload à faire (état au 17/09/2026)
Modifiés : `index.html`, `sw.js` (cache v30), `manifest.webmanifest`, `app.fs.bundle.js` (reconstruit en v4).
Nouveaux : `app.store.js`, `app.guide.js`, `app.atelier.js`, `app.mesures.js`, `app.accueil.js`, `app.print.js`, `app.fsmore.js`, `app.share.js`, `vendor/jspdf.umd.min.js`, `vendor/svg2pdf.umd.min.js`, `build/entry.mjs`.

**Ordre de chargement des scripts** (important, les modules se surchargent entre eux) : `app.v6.js` → `app.store.js` → `app.profiles.js` → composer/elements → `app.fsinfo.js` → `app.fsx2.js` → `app.patterns2.js` → motifs → freesewing → illus → gemini → `app.studio2.js` → `app.fsmore.js` → `app.print.js` → `app.share.js` → `app.guide.js` → `app.atelier.js` → `app.mesures.js` → `app.accueil.js`.
Toujours en attente du 14/09 : `app.studio2.js`, `app.elements2.js`.
À supprimer du dépôt : `app.fsexamples.js`, `app.fsx.js`.
Le dossier `vendor/` doit être uploadé tel quel (l'app charge `vendor/jspdf.umd.min.js` à la volée).
