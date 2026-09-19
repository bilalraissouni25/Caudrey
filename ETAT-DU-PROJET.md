# Mon Atelier Couture — État du projet (note de reprise)

> À lire en premier pour reprendre le travail, quel que soit le modèle / l'assistant.
> Dernière mise à jour : 18 septembre 2026 — Studio : dessin technique, fiche atelier PDF, silhouette à ses mesures (étages 1, 2, 4, la moitié du 3, et l'export DXF de l'étage 5).

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
| `app.flat.js` | **Nouveau (18/09/2026)** : vue « Dessin technique » du Studio — dessin du vêtement construit depuis le patron, options paramétriques, cotes du vêtement fini, export SVG/PNG. Surcharge `fsGenerate()`. |
| `app.corps.js` | **Nouveau (18/09/2026)** : silhouette paramétrique à ses mesures, en millimètres, superposable au dessin technique ; sert aussi de mannequin au Studio composer. |
| `app.dxf.js` | **Nouveau (19/09/2026)** : export DXF-AAMA des pièces (coupe, couture, droit-fil, miroir, identification), à la main en R12. |
| `app.inbox.js` | **Nouveau (19/09/2026)** : boîte de réception iPhone (raccourci → ntfy → app), mise en place guidée et test ; nouvelle chaîne Instagram `igFetch()`. |
| `app.inspistudio.js` | **Nouveau (19/09/2026)** : inspiration à côté du dessin technique, modèles les plus proches (IA ou tags), réglages « comme sur la photo » ; `callVision()` accepte les images `blob:`. |
| `app.parcours.js` | **Nouveau (19/09/2026)** : barre de parcours du Studio, galerie des modèles à ses mesures, tissu sur le dessin + réserve de tissus, liste de courses, « Coudre ce modèle » (étapes de montage), retouches après essayage. |
| `app.idee.js` | **Nouveau (19/09/2026)** : onglet Imaginer (phrase → croquis paramétrique + patrons proches ; photo → croquis crayon/trait ; dessin technique → fond du Composer) ; corrige `refreshRefSelect()`. |
| `app.machine.js` | **Nouveau (19/09/2026)** : profil machine (Brother FS40s) — conseils de dépannage, réglages par technique et par étape. |
| `app.portee.js` | **Nouveau (19/09/2026)** : vue « Portée » du Dessin technique — le vêtement sur sa silhouette, dans son tissu, avec modelé. |
| `app.mobile.js` | **Nouveau (19/09/2026)** : ergonomie iPhone — menu replié, dessin collé en haut pendant les réglages, onglets qui défilent. |
| `app.depannage.js` | **Nouveau (19/09/2026)** : dépannage machine pas à pas (10 symptômes), accessible depuis Techniques et le mode Atelier. |
| `app.techniques.js` | **Nouveau (19/09/2026)** : bibliothèque de 28 techniques avec schémas, liée aux étapes du mode Atelier, progression « acquises ». |
| `app.techpack.js` | **Nouveau (18/09/2026)** : fiche atelier PDF 3 pages (dessin technique, nomenclature, plan de coupe et métrage, notes). Dépend de `app.flat.js` et des utilitaires de `app.print.js`. |
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

### Dessin technique — étages 1 et 2 du plan Studio (18/09/2026)
- `app.flat.js` (chargé en dernier) : nouvel onglet **« Dessin technique »** du Studio (`#studioTech`, 4e bouton de `#studioMode`). Le dessin n'est plus composé d'éléments décoratifs : il est **construit à partir du vrai patron**. Pour chaque pièce, `FS.draftSvg(design,{only:[part],complete:true,sa:0})` ; on extrait le plus long chemin `class="fabric"` (le contour tissu), on repère la ligne de pli au marqueur `cutonfold`, et on reflète la pièce par `transform="translate(2·foldX,0) scale(-1,1)"` — aucun parsing de chemin, donc la symétrie est exacte.
- Deux vues : **Vêtement** (devant + dos, manches accrochées à l'emmanchure réelle) et **Planche de pièces** (toutes les pièces nommées, « au pli » signalé). Les bas et accessoires (jupe, pantalon) basculent d'office sur la planche : leur forme à plat ne ressemble pas au vêtement porté, l'afficher en « vêtement » serait un mensonge.
- Placement des manches : `flatArmhole()` échantillonne le contour (`getPointAtLength`, 300 points) pour trouver le point d'épaule et le dessous de bras ; la manche est accrochée au milieu de cette corde, inclinée de 32°, et **réduite de moitié en largeur** (la pièce est la manche entière déroulée, à plat on n'en voit qu'une face). Le corps est rempli en blanc pour masquer la tête de manche, comme sur un vrai dessin technique.
- **Options paramétriques** (étage 2) : `flatOptions()` lit `FS.info(design).options` et génère jusqu'à 14 curseurs/cases (aisances, longueurs, profondeur d'encolure…), libellés en français via `FLAT_OPT_FR`. Chaque réglage redessine le vêtement (débounce 320 ms) et met à jour les **cotes du vêtement fini** (largeur à plat, longueur, tour correspondant, longueur de manche) lues sur les pièces, pas estimées.
- Les pourcentages partent au moteur **en fraction** (`valeur/100`) : `normalizeOptions()` du bundle ne divise que les valeurs > 1, envoyer 0,5 % serait sinon compris comme 50 %.
- Les réglages suivent le patron : `fsGenerate()` est surchargé (il passe désormais par `FS.draftSvg` avec `options`) et `fsPrintGo()` reprend `window._tkOpts` — donc le PDF imprimé est bien le vêtement réglé dans le Studio.
- Pièces héritées : `FS.info().parts` contient aussi les pièces du modèle parent (`titan.front` pour Paco, `brian.base` pour Teagan). On écarte une pièce héritée **seulement si le modèle a la sienne du même nom** — filtrer strictement sur le préfixe casse les modèles qui héritent tout (Simone n'a en propre que `simone.fbaFront`).
- Testé (Playwright) : 62 modèles dans le sélecteur, Teagan/Sven/Hugo/Breanna en vue vêtement, Sandy/Paco/Shin/Simone en planche, curseur d'aisance poitrine au maximum → largeur à plat 58 → 63 cm, aucune erreur console. Génération 40 à 400 ms selon le modèle.
- Limites connues : la manche est un dessin honnête mais simplifié (pas de pli de coude, hem droit) ; Paco ne rend pas sa pièce dos seule (pas de chemin `fabric` quand on la tire isolément) ; les blocs de base (Breanna) ont des manches longues qui partent loin du corps.

### Versions & fiche atelier — fin de l'étage 2 et étage 4 (18/09/2026)
- **Mes versions** (`state.variantes = [{id,slug,nom,vals,date}]`) : « Enregistrer cette version » garde les réglages du modèle courant ; la liste sous le panneau d'options recharge ou supprime une version. **Comparateur** : « Comparer » affiche côte à côte les réglages en cours et les deux dernières versions du modèle, chacun avec ses trois cotes principales.
- **Piège corrigé** : `uid()` rend un nombre, l'attribut `onclick` repasse une chaîne — la comparaison `x.id===id` échouait en silence et le clic ne chargeait rien. Comparer avec `String(...)` partout où un id transite par le HTML.
- **File d'attente de rendu** : `tkDraw()` ignorait une demande arrivée pendant un rendu (`TK.busy`), donc un clic pendant le dessin initial était perdu. Désormais `TK._encore` + `tkFini()` rejouent la dernière demande.
- `app.techpack.js` — **fiche atelier PDF** (bouton « Fiche atelier (PDF) » de la vue technique), 3 pages A4 : 1) dessin technique devant/dos à l'échelle, mesures du vêtement fini, réglages utilisés, et un bloc de lignes vierges pour écrire à la main ; 2) planche des pièces + nomenclature (pièce, consigne de coupe réelle lue dans le patron, largeur, hauteur) ; 3) plan de coupe dessiné, métrage, fournitures, notes de construction.
- **Plan de coupe** : rangement par étagères des pièces (quantité déduite de la consigne « Couper 2 en miroir »), sur un tissu plié en deux à la laize choisie, 5 mm de marge autour de chaque pièce. Teagan en 140 cm → 1,2 m. C'est une estimation honnête, pas un placement optimisé : la fiche le dit et conseille 10 à 15 % de plus pour un tissu à sens.
- **Consigne de coupe** : le SVG d'une pièce contient plusieurs textes commençant par « Couper » — le droit-fil (« Couper au pli — droit-fil ») arrive avant la vraie consigne. On cherche d'abord `Couper <nombre>`, le reste en secours.
- Le PDF réutilise `prReady()` / `prSvgEl()` / `prHost()` d'`app.print.js` : pas de seconde copie de jsPDF.
- Testé (Playwright, PDF rendu en image) : les trois pages sont justes, aucune erreur console, enregistrement + rechargement + chargement d'une version → 58 cm → 63 cm de largeur à plat.

### La silhouette à ses mesures — étage 3, première moitié (18/09/2026)
- `app.corps.js` : silhouette de face construite à partir des mesures du profil, **dans la même unité que les patrons (1 unité = 1 mm)**. Elle se superpose donc au dessin technique sans aucune mise à l'échelle : on voit où tombe l'ourlet, où s'arrête la manche, si l'encolure est trop large.
- Largeur de face déduite d'une circonférence par `circ / 5.8` (section elliptique). Les niveaux (poitrine, taille, hanches, genou, sol) viennent des mesures réelles ; ce qui manque est estimé à partir du reste via `FS.base`, jamais tiré au hasard. `corpsMesures().reelles` compte les mesures réellement prises.
- Bouton **« Silhouette »** dans la vue technique (`window.FLAT_CORPS`) : le corps est posé derrière le vêtement, l'axe du corps sur la ligne de pli, le creux du cou sur le haut de la pièce devant (pour un bas, c'est la ligne de taille qui sert de repère). La fiche atelier PDF suit automatiquement, puisqu'elle utilise `flatSvg()`.
- Le mannequin du Studio « Composer » (`manneSVG()` dans `app.studio2.js`) délègue maintenant à `corpsSvg()` quand `app.corps.js` est chargé : le fond de croquis est lui aussi à ses mesures. **Non testable ici** (Fabric.js vient de cdnjs, bloqué depuis l'environnement de dev) — la délégation est dans un `try/catch` qui retombe sur l'ancien mannequin.
- Manches : la tête de manche est enfoncée de 22 % de la hauteur de la pièce sous le corps du vêtement, et les manches sont remplies de blanc — sinon la courbe de tête de manche dépasse l'épaule et le dessin ressemble à un décolleté cut-out.
- Reste de l'étage 3 : les **calques métier** (tissu principal, doublure, surpiqûres, mercerie, annotations) dans le Studio composer — non fait, c'est une refonte du panneau Calques d'`app.studio2.js`.

### Export DXF-AAMA — étage 5, premier volet (19/09/2026)
- `app.dxf.js` : bouton **« Export DXF »** de la vue technique. Écrit à la main en DXF R12 ASCII (aucune bibliothèque) selon les conventions AAMA / ASTM D6673 : **un BLOCK par pièce**, calque `1` = contour de coupe (avec marges), `14` = ligne de couture, `7` = droit-fil, `6` = ligne de miroir pour les pièces au pli ; textes d'identification (`Piece Name`, `Quantity`, `Size`, `Material`) dans chaque bloc ; `Style Name` dans les entités. Millimètres (`$INSUNITS 4`), axe Y inversé par rapport au SVG.
- Les courbes sont échantillonnées tous les 2 mm (`getPointAtLength`), ce qui donne des fichiers de 200 à 750 Ko. La marge de couture est celle du champ « Marge de couture » de la page Patrons (1 cm par défaut) ; les options réglées dans le Studio sont prises en compte.
- Quantité lue dans la consigne du patron (« Couper 2 en miroir »). Droit-fil : celui du patron s'il existe, sinon parallèle à la ligne de pli (décalé de 3 cm), sinon vertical au centre.
- Textes en ASCII pur (accents retirés) : beaucoup de traceurs et de logiciels anciens ne lisent pas l'UTF-8 dans un DXF R12.
- Validé avec **ezdxf** (audit : 0 erreur, 0 correction) sur Teagan, Hugo, Sandy, Simone, Paco ; dimensions cohérentes avec les pièces (devant Teagan 296 mm + marges = 307 mm) ; rendu vérifié à l'œil.
- **Non testé** dans un vrai logiciel de patronage (Seamly2D, CLO, Optitex) ni sur une découpeuse — c'est la prochaine vérification à faire si l'usage se présente.

### Sa machine : Brother FS40s (19/09/2026)
- `app.machine.js`. `state.machine = {modele:"fs40s"}` par défaut (sélecteur « Ma machine » en tête du dépannage ; « Autre machine » rend les conseils génériques). `MACHINES.fs40s` contient une fiche (ce qu'il faut savoir), des **remplacements du dépannage** (texte, et titre si la cause n'existe pas sur cette machine : pas de volant à débrayer → « L'axe du bobineur est resté à droite ») et des **réglages par technique** (point, pied, aiguille).
- Ces réglages apparaissent : en encadré « Sur ta Brother FS40s » dans les fiches Techniques ; dans le dépannage (étiquette) ; et dans les étapes générées par « Coudre ce modèle » (« Machine : … »).
- **Sources** (vérifiées le 19/09/2026) : FAQ Brother FS40s (enfilage : bouton de position d'aiguille, enfile-aiguille pour aiguilles 75/11 à 100/16 seulement ; tension : sens inverse des aiguilles d'une montre = moins tendu) ; notice FS-40 en français (bobineur vers la droite, aiguille double réf. 131096-121 + pied J + largeur ≤ 5 mm, aiguilles par tissu) ; test Couture Enfant (40 points dont 5 boutonnières, 7 × 5 mm, 750 pts/min, canette transparente, griffes via sélecteur arrière, marche/arrêt + curseur de vitesse, écran avec lettre du pied, limite ≥ 4 épaisseurs épaisses). **Pas trouvé** : le tableau des numéros de points — l'app ne donne donc jamais de numéro, elle renvoie à l'écran de la machine.

### Studio : contraste et comparaison de tissus (19/09/2026)
- Les pièces du dessin technique portent leur rôle (`data-role` posé par `flatGroup()`). `pcHabiller()` sait habiller deux tissus : principal (`pcFab`) et **contraste** (`pcFab2`) sur les rôles choisis (manches, col, poignets, poches, capuche, bandes, parementures, dos, jupe) — color-block, col blanc, poches colorées. En vue « vêtement » seules les manches sont visibles ; la planche de pièces montre le reste.
- La liste de courses calcule **un métrage par tissu** (plan de coupe séparé pour les pièces en contraste), aussi dans le texte envoyé au téléphone. Le projet créé garde `modele.contraste`.
- **Comparer des tissus** : 2 ou 3 tissus de la réserve, le même vêtement côte à côte (identifiants de motif rendus uniques par colonne), bouton « Choisir celui-ci ».
- Testé : manches en écru sur corps rayé (4 pièces manche, 2 devant habillées), métrages séparés (0,7 m + 0,3 m en 150), 3 colonnes, projet avec 5 étapes sur 10 annotées « Machine : … », aucune erreur ; PDF, DXF et galerie inchangés.

### Imaginer : concrétiser une idée sans savoir dessiner (19/09/2026)
- `app.idee.js`. **Nouvel onglet « Imaginer », ouvert par défaut dans le Studio** (le Composer est masqué au départ ; `studio2` l'initialise quand même au chargement et le recadre au clic). Trois portes :
  1. **« Je la décris »** : une phrase en français (« une robe midi évasée à pois bleu marine, col V, manches ballon, ceinture »). `idLire()` en tire le type, le modèle FreeSewing le plus proche (+ 2 voisins), ampleur/longueur/manches, couleur (26 teintes) et matière. `idDesign()` pilote le **gabarit paramétrique existant** (`drawDesign()` d'`app.v6.js` : silhouette, longueur, encolure, 6 types de manches, bas volanté/plissé/asymétrique/portefeuille, ceinture/nœud, poches, boutons, fente, pois/rayures/fleuri, couleur) → **croquis devant/dos coloré**, décrit en toutes lettres avec les accords (« Haut droit, court… »). En dessous, les 3 patrons les plus proches dessinés à ses mesures, dans la couleur. « C'est ça — continuer » ouvre le dessin technique réglé et coloré ; « Modifier le croquis » ouvre le gabarit avec tous les champs remplis ; « Garder » l'ajoute aux inspirations. Aucune clé IA nécessaire.
     Avec une clé OpenAI / Gemini : « Croquis de mode par l'IA » (flat sketch devant/dos, image-only ; présenté comme croquis d'ambiance, pas comme dessin juste). **Non testé avec une vraie clé.**
  2. **« Je l'ai en photo »** : photo ou inspiration → **croquis au crayon** (niveaux de gris « éclaircis » par leur négatif flouté, la méthode classique) ou **dessin au trait** (contours de Sobel, seuil adaptatif), avec curseur d'intensité. Flou « boîte » en 3 passes écrit à la main (pas de `ctx.filter`, absent des anciens iOS). Tout reste sur le téléphone. « Décalquer et annoter » l'ajoute aux inspirations et l'ouvre comme calque de fond dans « Dessiner ».
  3. **« Je la compose »** : le dessin technique du modèle (proportions justes, tissu compris) devient un **fond verrouillé dans le Composer** ; elle y glisse volants, poches, nœuds, cols depuis la bibliothèque de 101 éléments. Traits convertis sans `vector-effect` (inconnu de Fabric). Testé avec Fabric 5.3 servi en local.
- **Régression corrigée** : `refreshRefSelect()` ne proposait que les images `data:` comme calque de fond de « Dessiner » — depuis le passage en IndexedDB (`blob:`), plus aucune inspiration n'était décalquable. Redéfini dans `app.idee.js`.
- Limite : pour les modèles à découpes (Sasha, Bella, Noble…), les vignettes de patron restent en planche de pièces ; c'est le croquis paramétrique qui donne l'allure.

### Dépannage machine (19/09/2026)
- `app.depannage.js` : onglet **« Ma machine fait des siennes »** dans la page Techniques. 10 symptômes (nid de fils, fil qui casse, points sautés, aiguille qui casse, tissu qui n'avance pas, couture qui fronce, tension, bruit, aiguille bloquée, canette), 3 à 5 causes chacun **dans l'ordre de fréquence**, une piste à la fois avec « C'est réglé » / « Toujours pas », barre de progression, et un écran final honnête (« c'est pour l'atelier de réparation, note ce qui se passe »). Ce qui a réglé le problème est gardé (`state.depannages`).
- Lien « La machine fait des siennes ? » en bas du mode Atelier, qui ouvre directement le dépannage.

### Le parcours complet dans le Studio (19/09/2026)
- `app.parcours.js`. Constat de départ (benchmark) : Tailornova montre le tissu sur un vêtement 3D, dessin technique et patron sur mesure ; les couturières amateurs se plaignent surtout de la **dispersion** (« Pinterest pour l'inspiration, un tableur pour le stock, les notes du téléphone pour les mesures » — Costumary 2026), du manque de visualisation avant de couper, de l'accès à leur stock en magasin et de l'absence de suivi des retouches. D'où un parcours unique, affiché en **barre d'étapes** en haut du dessin technique : Inspiration → Modèle → Tissu → Achats → Patron → Coudre (chaque étape cliquable, la prochaine est mise en avant).
- **Galerie des modèles** (étape Modèle, bouton « Galerie ») : tous les modèles d'un type **dessinés à ses mesures**, triés du plus simple au plus technique, avec l'étiquette maille / chaîne et trame. Les blocs de base sont masqués par défaut (case pour les afficher). Vignettes dessinées une par une (≈ 0,5 à 1,5 s par type), en cache mémoire.
- **Tissu sur le dessin** : photo prise en magasin (+ largeur de tissu visible sur la photo, qui donne l'échelle ; astuce carte bancaire = 8,5 cm), couleur unie, ou imprimé d'une inspiration. Rendu par un `<pattern>` SVG en unités mm : le motif est **à l'échelle réelle** sur le vêtement. Appliqué dans `flatSvg()` → l'écran, la comparaison de versions, la galerie et la **fiche atelier PDF** (svg2pdf gère le motif, vérifié) en profitent. Le trait blanc qui efface le bord de pli prend lui aussi le tissu.
- **Ma réserve de tissus** : `state.tissus = [{id,nom,type,mode,img|couleur,echelleCm,ratio,laize,metres}]`, réutilisable d'un projet à l'autre. Alerte si la matière ne convient pas au modèle (jersey attendu pour Teagan, etc. — liste `PC_MAILLE`).
- **Liste de courses** : métrage calculé par le vrai plan de coupe en 110 / 140 / 150 cm (+12 % si imprimé), tissu conseillé par type de modèle, mercerie déduite des pièces du patron (bord-côte, entoilage, boutons, fermeture, élastique, cordon…), bilan « tu en as 1 m, il en faut 1,4 m ». Bouton « Envoyer sur mon téléphone » (`navigator.share`, sinon presse-papiers) et lien vers la fiche FreeSewing du modèle.
- **Coudre ce modèle** : crée un projet du carnet avec ses **étapes de montage** générées selon le type (haut maille / chaîne et trame, robe, jupe, pantalon) et les pièces présentes (poches, col, capuche, poignets, braguette, pinces…), chacune reliée aux fiches Techniques ; ouvre directement le mode Atelier. Le projet garde `modele:{slug, vals, ref, tissu}`. Première étape : lien vers les instructions officielles FreeSewing (freesewing.eu/docs/designs/<slug>/instructions/).
- **Retouches après essayage** : 14 symptômes (« serré à la poitrine », « l'encolure bâille », « ça tire entre les omoplates »…) → les options concernées bougent d'un pas, le dessin se met à jour, et une version « Après essayage — … » garde la trace de ce qui a changé. Seuls les symptômes corrigeables sur le modèle affiché sont proposés.
- `flatAssemblable()` : plusieurs pièces devant ou dos (découpes princesse, devant droit/gauche) → planche de pièces plutôt qu'un assemblage faux.
- Testé (Playwright) : tissu → 8 pièces habillées ; liste de courses Teagan (1,4 m en 140 cm avec motif, manque 0,4 m) ; retouche poitrine 58 → 60 cm ; projet de 10 étapes avec 13 liens vers les fiches ; barre 6/6 cochée en fin de parcours ; aucune erreur.

### iPhone : la boîte de réception (19/09/2026) — remplace l'ancien raccourci
- **Bug de fond découvert** (sources : firt.dev « iOS PWA Compatibility », WebKit bug 194593) : sur iPhone, une app ajoutée à l'écran d'accueil a un **stockage séparé de Safari**, et un lien ouvert depuis un raccourci **s'ouvre dans Safari, jamais dans l'app installée**. L'ancien parcours (raccourci → presse-papiers → `index.html?paste=1`) enregistrait donc l'inspiration dans Safari, invisible depuis l'app installée. iOS n'a toujours pas `share_target`.
- `app.inbox.js` : le raccourci ne rouvre plus rien. Il fait un `POST https://ntfy.sh/` en JSON `{topic, message}` puis affiche « Envoyé à Mon Atelier ✓ » : **on reste dans Instagram**. L'app relève la boîte à l'ouverture, au retour au premier plan (`visibilitychange`) et sur demande, et importe chaque lien comme inspiration (photo copiée en local, légende en note, tags automatiques). Du texte seul devient une note d'idée.
- Le « sujet » ntfy est aléatoire (`atelier-` + 22 caractères) et sert de mot de passe : qui le connaît peut lire et déposer. Messages gardés **12 h** sur ntfy.sh (par défaut de ce serveur) ; un serveur ntfy à soi se règle dans « Réglages avancés ».
- Mise en place guidée dans l'app (Inspirations → « Menu Partager » sur iPhone ouvre directement la configuration) avec boutons « Copier » pour l'adresse et le code, et **« Tester la boîte »** : l'app s'envoie un message et le relit, ce qui valide serveur, code et réseau sur son téléphone.
- **Installation express** possible : Bilal construit le raccourci une fois sur son iPhone avec une *question d'import* pour le code, le partage en lien iCloud, et colle ce lien dans « Réglages avancés ». L'app affiche alors « Installer le raccourci » + « Copier mon code ».
- Aucune requête tant que la boîte n'a pas été configurée. Relevé : lecture directe, puis via les relais CORS si le navigateur refuse. Doublons ignorés (même URL), `?igsh=` retiré des liens Instagram.
- **Non vérifiable depuis l'environnement de dev** (ntfy.sh bloqué par le proxy) : testé avec un faux serveur ntfy au même format (NDJSON, `since=<id>`), 2 messages → 2 inspirations, 0 doublon à la relève suivante. **Premier vrai test à faire sur son iPhone avec « Tester la boîte ».**

### Instagram : chaîne d'import revue (19/09/2026)
- Constat : Meta a **retiré `thumbnail_url` et `author_name` des réponses oEmbed le 3/11/2025** (Iframely), avant de rouvrir l'oEmbed sans jeton le 15/06/2026. La miniature n'est donc plus garantie par oEmbed.
- `igFetch()` combine : 1) oEmbed v25.0 sans jeton, en demandant `fields=thumbnail_url,author_name,html`, et lecture de la **légende** dans le HTML d'intégration ; 2) la **page d'intégration publique** (`/p/<code>/embed/captioned/`) via les relais : image (`img.EmbeddedMediaImage`, ou `display_url` dans le JSON), auteur, légende. Ce qui manque à l'un, l'autre le complète. `instagramMeta()` est remplacé : l'import manuel d'un lien en profite aussi.
- Testé avec des réponses simulées au format actuel (oEmbed sans miniature + page d'intégration) : photo récupérée et copiée en local, légende et hashtags en note, tags auto « robe », « manches ballon ».

### De l'inspiration au patron — Studio (19/09/2026)
- `app.inspistudio.js`. Sur chaque carte d'inspiration, bouton **« → patron »** : ouvre le dessin technique avec la photo **à côté du dessin** (mise en page élargie : les cotes passent sous les options).
- **Patrons les plus proches** : avec une clé IA, l'app envoie la photo et le catalogue des 68 modèles, et reçoit en JSON le type, une description, 3 modèles avec leur raison, et une estimation ampleur / longueur / manches. Sans clé : score à partir des tags, du titre et de la légende (type de vêtement + mots communs avec la description du modèle). Les slugs inconnus renvoyés par l'IA sont écartés.
- **« Comme sur la photo »** : trois rangées de puces (Ajusté/Standard/Ample, Plus court/Standard/Plus long, Manches courtes/Standard/Manches longues) qui poussent les options du modèle à 60 % vers leur min ou max. Options ciblées relevées sur les 68 modèles (`chestEase` ×28, `lengthBonus` ×28, `sleeveLengthBonus` ×17, `sleeveLength` ×7…). Si l'IA a estimé ces trois axes, ils s'appliquent d'office au choix du modèle.
- Une version enregistrée garde son inspiration (`variante.ref`) et la réaffiche au chargement.
- `FLAT_OPT_FR` passe de 22 à ~125 libellés français (options les plus visibles des 68 modèles).

### IA : deux pannes silencieuses corrigées (19/09/2026)
- **Les images n'étaient plus lisibles par l'IA** depuis le passage en IndexedDB : `x.img` est une URL `blob:` qu'aucun fournisseur ne sait lire, donc tags par vision et analyses échouaient (repli silencieux sur les tags texte). `callVision()` convertit désormais `blob:` → `data:` JPEG 900 px.
- **Modèles retirés** : `gemini-1.5-flash` (arrêté) → `gemini-2.5-flash` ; `gemini-2.0-flash-preview-image-generation` (arrêté le 14/11/2025) → `gemini-3.1-flash-image`, puis `gemini-2.5-flash-image` en secours (arrêt annoncé le 2/10/2026) ; `claude-3-5-haiku` (retiré le 19/02/2026) → `claude-haiku-4-5`. `max_tokens` de la vision 200 → 700 (la réponse JSON du Studio était tronquée). `gpt-4o-mini` non vérifié.

### Bibliothèque de techniques (19/09/2026)
- `app.techniques.js` + vue **« Techniques »** (menu Commencer). **28 fiches** (`TECHS`) en 7 familles : Préparer, Coudre, Finitions, Fermer, Ajuster, Décorer. Chaque fiche : pourquoi ce geste compte, matériel, étapes, erreurs fréquentes, astuce, et pour 15 d'entre elles un **schéma SVG** (droit-fil, couture et arrêts, zigzag, ourlet double en coupe, crans, angle pivoté, surpiqûre, tube retourné, coulisse élastique, coins boxés, bande d'encolure, biais, manche à plat, point invisible, fermeture).
- **Toutes les techniques citées par les 12 projets guidés ont leur fiche** (vérifié par test : 0 non couverte), grâce aux `alias` qui font le lien avec les noms utilisés dans `GUIDE_PROJETS` (`techFind()` ignore accents et casse).
- **Dans le mode Atelier**, les noms de techniques sous chaque étape deviennent des liens qui ouvrent la fiche **par-dessus**, sans quitter le projet. Branché en enveloppant `atelierRender()` : `app.atelier.js` n'est pas modifié.
- Piège : `innerHTML` rend `&middot;` sous forme du caractère `·` — chercher l'entité ne trouvait rien.
- « Je sais le faire » → `state.techniques = {id: date}` ; compteur « n / 28 techniques acquises » en haut de la page. Bouton « Voir en vidéo » : recherche YouTube ciblée en français (aucune vidéo embarquée, rien à maintenir).
- Enrichir = ajouter un objet à `TECHS` (et un schéma dans `TSCH` si utile). Fiches rédigées au tutoiement.

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

### Studio sur iPhone + vue « Portée » (19/09/2026)
- **Audit iPhone 13 (390 px)** : le menu latéral s'empilait en haut de chaque écran (≈ 700 px à faire défiler) et la rangée de boutons du Dessin technique débordait (page élargie à 558 px). Corrigé.
- `app.mobile.js` + CSS `@media(max-width:760px)` : barre du haut collante (logo, nom de l'écran, bouton ☰ qui déplie le menu, se referme au choix) ; `viewport-fit=cover` + `env(safe-area-inset-top)` ; étapes et onglets du Studio sur une ligne qui défile (l'onglet actif est ramené dans le champ) ; boutons pleine largeur.
- **Dessin technique sur téléphone** : la carte « Options du modèle » passe sous le dessin (`mobPlacerOptions`, remise en place au-dessus de 760 px) ; repliée par défaut (« Ajuster ▾ ») ; le dessin (`#tkPair`) est `position:sticky` (34 vh) : elle voit le vêtement changer pendant qu'elle bouge les curseurs. Curseurs à la couleur de l'app (`accent-color`).
- **Vue « Portée »** (bouton entre « Vêtement » et « Planche de pièces ») : `flatSvg(board,"portee")` (wrapper dans `app.portee.js`) pose le vêtement sur la silhouette pleine à ses mesures (`corpsSvgParts` accepte `fill`), dans son tissu (pcHabiller s'applique toujours), avec un modelé (dégradés `poL/poR/poC` : flancs plus sombres, milieu éclairé ; chemin d'ombre ajouté par `flatGroup` quand `FLAT_PORTEE`).
  - Largeur portée : à plat on voit la moitié du tour ; porté, ≈ tour / 2,9 (même rapport que la silhouette). `flatWarpD` resserre la pièce autour du pli, progressivement : ×1 aux épaules (la carrure reste vraie), ×0,69 dès le dessous de bras.
  - Manches : tête au point d'épaule, largeur ≈ tour de manche / π (×0,33), inclinaison 7°, dessinées **par-dessus** le corps (la couture d'emmanchure se voit).
  - 4 silhouettes : Mannequin (défaut), Clair, Mat, Foncé (`state.portee.teint`).
  - Seulement pour les hauts/robes symétriques (devant ou dos coupé au pli, `poPossible`) ; sinon dessin technique + note. Le choix de vue n'est plus écrasé quand un modèle doit s'afficher en pièces (tkDraw).
- **Corrections du moteur de dessin** (profitent à toutes les vues, PDF et DXF) : contours tracés en plusieurs morceaux (Bibi) raboutés (`flatParse/flatInverser/flatChainer`) ; ligne de pli recalée sur le bord de la pièce (le marqueur FreeSewing est dessiné 7,5 mm à côté → trait parasite au milieu du vêtement).
- Testé : 62 modèles × 3 vues sans erreur ni NaN ; captures iPhone 13 (Imaginer, Dessin technique, menu, Portée Bibi/Teagan). Non testé sur un vrai iPhone.

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

## Dernier upload à faire (état au 18/09/2026)
Modifiés : `app.flat.js` (`data-role`, vue portée, pli recalé, contours raboutés), `app.corps.js` (remplissage), `app.parcours.js` (contraste, comparaison), `app.techpack.js` (tissu dans la fiche), `app.gemini.js` (modèles IA à jour), `app.studio2.js` (mannequin + modèle d'image Gemini), `index.html`, `sw.js` (**cache v42**), `manifest.webmanifest`, `app.fs.bundle.js` (reconstruit en v4), `app.print.js` (reprend les options du dessin technique).
Nouveaux : `app.flat.js`, `app.corps.js`, `app.techpack.js`, `app.dxf.js`, `app.techniques.js`, `app.inbox.js`, `app.inspistudio.js`, `app.parcours.js`, `app.idee.js`, `app.depannage.js`, `app.machine.js`, `app.portee.js`, `app.mobile.js`, `app.store.js`, `app.guide.js`, `app.atelier.js`, `app.mesures.js`, `app.accueil.js`, `app.print.js`, `app.fsmore.js`, `app.share.js`, `vendor/jspdf.umd.min.js`, `vendor/svg2pdf.umd.min.js`, `build/entry.mjs`.

**Ordre de chargement des scripts** (important, les modules se surchargent entre eux) : `app.v6.js` → `app.store.js` → `app.profiles.js` → composer/elements → `app.fsinfo.js` → `app.fsx2.js` → `app.patterns2.js` → motifs → freesewing → illus → gemini → `app.studio2.js` → `app.fsmore.js` → `app.print.js` → `app.share.js` → `app.guide.js` → `app.atelier.js` → `app.mesures.js` → `app.accueil.js` → `app.corps.js` → `app.flat.js` → `app.techpack.js` → `app.dxf.js` → `app.techniques.js` → `app.inbox.js` → `app.inspistudio.js` → `app.parcours.js` → `app.idee.js` → `app.depannage.js` → `app.machine.js` → `app.portee.js` → `app.mobile.js`.
Toujours en attente du 14/09 : `app.studio2.js`, `app.elements2.js`.
À supprimer du dépôt : `app.fsexamples.js`, `app.fsx.js`.
Le dossier `vendor/` doit être uploadé tel quel (l'app charge `vendor/jspdf.umd.min.js` à la volée).
