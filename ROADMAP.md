# Mon Atelier Couture — Roadmap produit

**Objectif** : que l'app soit l'outil qui accompagne réellement une débutante de « je voudrais me mettre à la couture » à « j'ai cousu un vêtement que je porte ».
**Date** : 15 septembre 2026 · complète `ETAT-DU-PROJET.md` (état technique) — ce fichier-ci porte le *quoi* et le *pourquoi*.

---

## 1. Le diagnostic en une phrase

L'app est aujourd'hui un **atelier de créatrice** (studio de design, génération de patrons sur mesure, calculateurs) alors qu'une débutante a d'abord besoin d'un **guide** : quoi coudre en premier, est-ce que ça va me aller, comment je coupe, qu'est-ce que je fais à l'étape 7, et pourquoi ma machine fait des nœuds.

Autrement dit : la partie la plus difficile techniquement est faite (FreeSewing embarqué, vrai patron sur mesure, studio Fabric.js) — mais la partie qui décide si elle continue ou abandonne au bout de trois semaines n'existe pas encore.

**Les trois moments où une débutante abandonne**, et ce que l'app en fait aujourd'hui :

| Moment critique | Ce qui la bloque | État dans l'app |
|---|---|---|
| Le tout premier projet | ne sait pas quoi choisir, achète le mauvais tissu, patron trop dur | rien (carnet vide à remplir soi-même) |
| Le patron | PDF illisible, ne sait pas imprimer, pas de marge de couture, taille incertaine | patron généré mais **non imprimable** → inutilisable en l'état |
| La couture elle-même | bloquée à une étape, machine qui déraille, résultat qui ne tombe pas bien | rien |

C'est là que se joue « outil vraiment utile » vs « joli projet perso ».

---

## 2. Benchmark

### 2.1 Ce qui existe (et ce qu'on en retient)

| Outil | Ce qu'il fait bien | Ce qui manque | À prendre |
|---|---|---|---|
| **Sewjo** (iOS/Android, gratuit en bêta) | stash tissus/patrons/mercerie, planification, communauté ; positionné « redécouvre ce que tu as déjà » | pas d'apprentissage, pas de patron | le stash comme point d'entrée quotidien |
| **Threadloop** (web+mobile, ~5 $/mois) | scan code-barres, métrage, tags fibre/poids/couleur, affectation tissu→projet | pas de budget consolidé, pas de log de construction | l'affectation tissu→projet, le scan |
| **Costumary** (web, 9–19 $/mois) | journal de construction par phases, budget auto, web clipper, multi-projets | pas de patron, pas de social | **le journal de construction par étapes** — le cœur de ce qui nous manque |
| **Stash Hub** | import par URL (« Magic Input »), mockup, import/export CSV | gratuit limité à 20 items | l'import par URL (on l'a déjà côté inspirations) |
| **Cora** (iOS) | multi-profils de mesures, organisation par créateur | iOS only, pas de suivi projet | rien (on fait déjà mieux sur les profils) |
| **Sewist.com** | patron sur mesure généré, PDF **avec marges de couture** | payant, catalogue limité, pas de stash ni de suivi | la preuve que le PDF sur mesure est un produit vendable — on l'a en open source |
| **My Body Model** (payant) | croquis de mode **à ses propres mesures**, à imprimer | uniquement ça | **le croquis paramétré sur son corps** pour le Studio |
| **PatternReview** | des décennies d'avis sur les patrons du commerce | interface datée | l'idée de la fiche patron avec retours |
| **Patterned** | base de patrons + log des « makes », suivi de créateurs | zéro gestion de projet | rien |
| Notion / Trello (ce que beaucoup utilisent faute de mieux) | flexible | tout à construire, pénible sur mobile | rien |

**Le constat du marché**, formulé par Costumary et qu'on retrouve partout : *« rien ne se parle : l'inspiration est à un endroit, les matières à un autre, le planning nulle part »*. Les outils existants sont des **trackers**. Aucun ne fait le chaînage complet inspiration → design → patron → tissu → construction → apprentissage.

**Notre position unique** : on est le seul à avoir déjà *la génération de patron sur mesure gratuite* + *un studio de design* + *un carnet*. Personne ne combine ça. Le chaînage complet est notre différenciateur — il faut juste le terminer par les deux bouts (le guidage au début, l'impression/la construction à la fin).

**Ce qu'on ne cherchera pas à battre** : le social/communauté (Sewjo, Patterned) et le catalogue de patrons du commerce (PatternReview). Hors sujet pour une app perso à deux.

### 2.2 Les briques open source à intégrer

| Brique | Licence | Statut | Usage |
|---|---|---|---|
| **FreeSewing v4** (`@freesewing/core` + designs, npm) | MIT | **87 designs** publiés ; l'app n'en embarque que 12, en v3 | recompiler le bundle → catalogue ×7, options par design, `sa` (marges), `paperless` (patron coté) |
| **jsPDF** 4.2.1 (npm) | MIT | à vendorer | export PDF (patron pavé A4, fiche atelier) |
| **svg2pdf.js** 2.8.1 (npm) | MIT | à vendorer | convertir le SVG FreeSewing en PDF vectoriel (pas une image) |
| **Fabric.js** (déjà en place) | MIT | en place, v5 via CDN | studio ; à vendorer aussi pour l'offline |
| **Seamly2D** (ex-Valentina) | GPL, C++ desktop | **non intégrable** (desktop, GPL incompatible avec un front MIT/propriétaire) | inspiration pour le paramétrique uniquement |
| **PDFStitcher** | Python desktop | fait l'inverse de ce qu'on veut (recoller des PDF pavés) | l'algorithme de pavage à l'envers, comme référence |

**Vérifié en conditions réelles pendant cette session** : un bundle FreeSewing v4 (core + 3 designs) se construit avec `esbuild` en 280 Ko — *plus léger que le bundle v3 actuel de 477 Ko* — et le rendu avec `sa: 10` génère bien les chemins de marge de couture, `paperless: true` ajoute les cotes. **Donc le point « recompiler le bundle pour passer `sa` » est résolu : c'est une option standard du cœur FreeSewing, pas un patch.**

---

## 3. Roadmap

Ordre choisi selon un seul critère : *est-ce que ça change quelque chose pour une débutante dès le lendemain ?*
Unité d'effort : **soirée** (≈ 2–3 h).

### Lot 0 — Rendre utilisable ce qui existe (priorité absolue, ~5 soirées)

Aujourd'hui un patron généré ne peut pas être cousu. C'est le trou le plus grave.

**0.1 — Patron imprimable A4 pavé** *(2 soirées)*
Pavage en pages A4 à assembler, **carré témoin 5 cm** sur chaque page, repères de collage (bords hachurés, lettres/chiffres de colonne-ligne comme les patrons du commerce), **option marges de couture** (`sa`, réglable 0–2 cm), option patron coté (`paperless`) pour celles qui préfèrent tracer directement sur le tissu.
*Comment* : FreeSewing rend en mm avec un `viewBox` connu → on calcule la grille de pages (A4 utile 190×277 mm), et pour chaque page on écrit un `<svg>` translaté + clippé, converti en page PDF par `svg2pdf.js` dans un document `jsPDF`. Le carré témoin est dessiné en dur à 50×50 mm dans le repère du PDF (pas dans le SVG) : s'il ne mesure pas 5 cm à la règle, c'est l'impression qui est mal réglée, et on l'écrit sur la page. Option A0 pour l'impression en reprographie, gratuite une fois le pavage écrit.
*Fichier* : `app.print.js` + `vendor/jspdf.umd.min.js`, `vendor/svg2pdf.umd.min.js`.

**0.2 — Fiche atelier PDF (tech pack)** *(1 soirée)*
Une page à emporter : croquis devant/dos du Studio, mesures du profil utilisé, tissu et métrage, liste de découpe (pièce × nombre × sens du droit-fil), mercerie, notes.
*Comment* : même socle jsPDF ; le croquis vient de `stExport('svg')` (Studio v2), les mesures du profil actif, le métrage du calculateur existant.

**0.3 — Migration des images vers IndexedDB** *(2 soirées, invisible mais bloquant)*
Tout `state` (inspirations, rendus IA, vignettes de designs) est aujourd'hui sérialisé en base64 dans **localStorage**, plafonné à ~5 Mo selon les navigateurs. Le jour où elle ajoute des photos de stash et de progression, l'app dira « Mémoire pleine » et s'arrêtera — c'est déjà géré comme un échec de `save()`, mais ça arrivera vite.
*Comment* : petit wrapper `idbPut/idbGet(id, blob)` (une trentaine de lignes, pas de dépendance), `state` ne garde que des `imgId` ; migration transparente au premier chargement (les `data:` existants sont déplacés vers IndexedDB et remplacés par leur id). L'export JSON continue de tout ré-inliner pour rester un vrai backup.

### Lot 1 — L'accompagnement (le cœur du sujet, ~7 soirées)

**1.1 — Onboarding « ta première pièce »** *(2 soirées)*
8 questions (machine ? surjeteuse ? ce qu'elle veut porter, temps dispo, tissus déjà là, morphologie, niveau, patience) → 3 projets proposés avec pourquoi, temps estimé, tissu conseillé avec métrage et budget, liste de courses.
*Comment* : `data/projets-guides.json` — une quinzaine de projets rédigés (chouchou, tote, jupe élastique, top Aaron/Teagan FreeSewing, robe simple…), chacun avec prérequis, techniques mobilisées, pièges. Le moteur de reco est un simple score sur tags, pas d'IA nécessaire — donc ça marche hors-ligne et sans clé.

**1.2 — Mode Atelier : la construction pas à pas** *(3 soirées)*
Le vrai manque du marché. Chaque projet devient une suite d'étapes cochables (préparer le tissu → décatir → couper → marquer → assembler épaules → …), avec par étape : durée estimée, techniques liées, place pour une photo et une note, et un minuteur. En bas : « prochaine étape » et le temps réellement passé.
*Comment* : `app.atelier.js` ; les étapes viennent du projet guidé (JSON) ou d'un modèle générique par type de vêtement, éditables et réordonnables. Rendu mobile d'abord — c'est utilisé debout, à côté de la machine, les mains occupées : gros boutons, pas de scroll fin.

**1.3 — Bibliothèque de techniques** *(1 soirée + contenu au fil de l'eau)*
Glossaire illustré (surfilage, point d'arrêt, pose d'élastique, ourlet roulotté, biais, fronces…), chaque fiche reliée aux étapes qui l'utilisent, avec un lien vidéo. Une recherche en haut.
*Comment* : `data/techniques.json` (titre, 3 lignes d'explication, erreurs fréquentes, lien vidéo, tags) + les SVG de la bibliothèque du Studio comme illustrations. Le contenu se complète progressivement, le code ne bouge plus.

**1.4 — Dépannage machine** *(1 soirée)*
Arbre de diagnostic : « nid d'oiseau sous le tissu », « points sautés », « le fil casse », « le tissu n'avance pas », « la canette fait du bruit » → causes classées par probabilité avec le geste à faire. C'est *la* raison n°1 d'abandon et personne ne le met dans une app.
*Comment* : `data/depannage.json`, une vue à deux niveaux. Contenu à écrire (sources : guides Ageberry, Little Thistle, manuels constructeurs).

### Lot 2 — Le corps et le tombé (~5 soirées)

**2.1 — Assistant mesures guidé** *(2 soirées)*
Chaque mesure avec un schéma montrant où poser le mètre, dans l'ordre logique, avec contrôle de cohérence (tour de hanches < tour de taille → on alerte) et rappel de ce dont chaque patron a besoin. Aujourd'hui les champs sont nus, ce qui garantit des mesures fausses — donc des patrons faux, donc l'abandon.
*Comment* : réutiliser les 13 mesures que FreeSewing demande (elles sont exposées par `Design.patternConfig.measurements`), une illustration SVG par mesure, plus une correspondance avec les tailles commerciales (34/36/38…) pour qu'elle sache quoi acheter dans le commerce aussi.

**2.2 — Croquis à sa silhouette** *(1 soirée)*
Le mannequin du Studio est générique ; le dériver de ses mesures réelles (c'est exactement ce que My Body Model vend). Dessiner sur sa propre silhouette change complètement le rapport à l'outil.
*Comment* : le mannequin est déjà un SVG paramétrable (`manneSVG(view)` dans `app.studio2.js`) — remplacer les constantes par des largeurs calculées depuis poitrine/taille/hanches/stature du profil actif. Plus un export « croquis vierge à imprimer ».

**2.3 — Toile et ajustements** *(2 soirées)*
Journal de fit par projet : photos devant/dos, les plis observés → la correction classique correspondante (trop court dos, épaule tombante, poitrine forte…), et mémorisation des retouches récurrentes dans le profil pour les proposer au projet suivant.

### Lot 3 — Le stash (~4 soirées)

**3.1 — Stock tissus et mercerie** *(2 soirées)* : photo, laize, métrage restant, composition, prix au mètre, lieu d'achat, tags d'usage. Décompte automatique du métrage quand un projet passe en « coupé ».
**3.2 — « Qu'est-ce que je peux faire avec ça ? »** *(1 soirée)* : croiser le métrage du stash avec le calculateur existant → liste des projets réalisables tout de suite. C'est le meilleur déclencheur d'envie qui soit, et le positionnement de Sewjo.
**3.3 — Coût et cost-per-wear** *(1 soirée)* : coût réel par projet (tissu + mercerie + patron), et coût par port si elle log les ports. Argument imparable face à l'achat en magasin.

### Lot 4 — Le catalogue de patrons (~3 soirées)

**4.1 — Bundle FreeSewing v4** *(2 soirées)* : passer de 12 à 40–87 designs, exposer les **options de chaque design** (longueur de manche, ampleur, col…) dans l'UI, et brancher `sa` / `paperless` (déjà prouvé faisable).
*Comment* : `esbuild` en IIFE exposant `window.FS_DESIGNS`, un fichier de métadonnées généré depuis `patternConfig` (mesures requises, options, valeurs par défaut) pour construire les formulaires automatiquement. Le bundle se construit ici, en une commande, et se dépose dans le dépôt — aucun outil à installer chez toi.
**4.2 — Patrons du commerce** *(1 soirée)* : fiche patron manuelle (marque, taille achetée, métrage, retouches faites) pour que les patrons papier vivent aussi dans l'app.

### Lot 5 — Studio, finitions (~3 soirées, déjà bien avancé)

Fait : calques, magnétisme, devant/dos, designs sauvegardés, 101 éléments, rendu IA depuis le croquis.
Reste : composer sur **sa** silhouette (2.2), des éléments plus fins par catégorie de vêtement, et un export du croquis vers la fiche atelier (0.2).

### Hors périmètre (assumé)

Instagram (aperçu bloqué sans API pro — la capture d'écran reste le contournement), la vision IA depuis un lien externe (CORS), le social/communauté, l'app native. Si un jour un mini-serveur devient acceptable, Pinterest et Instagram redeviennent possibles — mais ça casse le « tout reste dans ton navigateur » qui est aussi une qualité.

---

## 4. Ce qu'il faut changer dans la structure, pas seulement ajouter

**La navigation.** Le menu actuel suit le *pipeline de création* (1 Inspirations → 6 Carnet). C'est la logique d'une créatrice qui conçoit. Une débutante ouvre l'app pour savoir **quoi faire maintenant**.
→ Ajouter un écran d'accueil « Aujourd'hui » : le projet en cours avec sa prochaine étape et un bouton pour la lancer, le temps passé, les projets en attente, et une suggestion. Le pipeline reste, en second niveau. *Coût : 1 soirée, impact maximal.*

**Un mode débutante.** Un interrupteur dans le profil qui masque studio avancé, motifs génératifs, réglages IA, et simplifie le vocabulaire. Elle pourra ouvrir les portes quand elle voudra. *Coût : une demi-soirée.*

**Le mobile d'abord pour les nouveaux écrans.** Le Studio se travaille sur ordinateur, mais l'Atelier, le stash et les techniques se consultent debout près de la machine, sur téléphone, souvent d'une main. Les nouveaux écrans se conçoivent à 400 px avant d'être élargis.

---

## 5. Comment on avance (méthode)

**Un lot = un module.** Un fichier `app.<sujet>.js` par sujet, chargé en fin d'`index.html`, qui surcharge ou complète sans toucher au reste — c'est la convention déjà en place et elle tient bien. Pas de framework, pas d'étape de build côté dépôt.

**Le contenu vit en JSON, pas en code.** `data/projets-guides.json`, `data/techniques.json`, `data/depannage.json`. Ça permet d'enrichir le contenu à l'infini sans risque de régression, et de le traduire ou de le corriger à quatre mains.

**Les librairies sont vendorées, pas chargées d'un CDN.** jsPDF et svg2pdf.js (MIT) dans `vendor/`, et à terme Fabric.js aussi : la PWA doit fonctionner dans un atelier sans wifi, et les CDN sont le seul point de panne externe qui reste.

**Chaque lot se termine par les quatre mêmes gestes** : test navigateur headless (Playwright, comme pour le Studio v2), ajout des nouveaux fichiers à `ASSETS` dans `sw.js` + bump du cache, écriture des fichiers dans ton dossier, mise à jour d'`ETAT-DU-PROJET.md`. Si une session s'arrête net, la reprise se fait sur le fichier d'état.

**Une seule vraie dépendance externe subsiste** : les clés IA (Gemini/OpenAI) pour le rendu réaliste et le tagging. Tout le reste fonctionne hors-ligne, sans compte, sans serveur — c'est ce qui rend l'app durable et gratuite.

---

## 6. Ordre d'attaque proposé

| # | Lot | Effort | Pourquoi maintenant |
|---|---|---|---|
| 1 | 0.1 Patron A4 pavé + marges | 2 soirées | sans ça, la meilleure fonction de l'app est inutilisable |
| 2 | 0.3 Images en IndexedDB | 2 soirées | tout le reste (photos, stash, journal) en dépend |
| 3 | 1.1 Onboarding première pièce | 2 soirées | c'est le jour 1 de sa pratique |
| 4 | 1.2 Mode Atelier pas à pas | 3 soirées | c'est ce qui la fait finir la pièce |
| 5 | 4.1 Bundle FreeSewing v4 | 2 soirées | ×7 le catalogue, options, prouvé faisable |
| 6 | 2.1 Assistant mesures | 2 soirées | conditionne la justesse de tous les patrons |
| 7 | 0.2 Fiche atelier PDF | 1 soirée | rend le tout tangible sur la table de coupe |
| 8 | Accueil « Aujourd'hui » + mode débutante | 1,5 soirée | change la perception de l'app entière |
| 9 | 1.3 / 1.4 Techniques et dépannage | 2 soirées + contenu | évite les abandons |
| 10 | Lot 3 stash, 2.2 croquis, 2.3 fit, 3.3 coût | 7 soirées | le confort qui fidélise |

**Environ 25 soirées pour l'ensemble**, dont **9 pour passer d'un beau projet à un outil réellement utilisable** (les quatre premières lignes).

---

## 7. Le test de vérité

Avant chaque ajout, une seule question : *est-ce qu'elle s'en sert un mardi soir, machine allumée, sans que je sois à côté ?*
Et une mesure de succès unique, à regarder dans six mois : **le nombre de vêtements qu'elle porte réellement et qui sont sortis de l'app.** Pas le nombre de designs, pas le nombre de fonctions.

---

### Sources du benchmark
- Best Sewing Apps and Tools (2026) — Costumary : https://www.costumary.com/blog/best-sewing-apps-2026
- 7 Best Sewing Project Planner Tools (2026) — Costumary : https://www.costumary.com/blog/sewing-project-planner-tools-2026
- Sewjo : https://sewjo.app/
- FreeSewing — catalogue des designs : https://freesewing.eu/designs/
- FreeSewing — réglages du cœur (`sa`, `paperless`, `complete`, `margin`) : https://freesewing.dev/reference/settings
- Seamly2D (GPL, desktop) : https://github.com/FashionFreedom/Seamly2D
- PDFStitcher : https://www.pdfstitcher.org/
- svg2pdf.js : https://github.com/yWorks/svg2pdf.js
- Choisir son premier projet — The Weekend Project : https://thweekendproject.substack.com/p/a-beginners-sewing-guide-choosing
- Lire un patron — The Weekend Project : https://thweekendproject.substack.com/p/how-to-read-a-sewing-pattern-a-beginners
- Dépannage machine — Ageberry : https://www.ageberry.com/sewing-machine-troubleshooting-problems-solutions/
