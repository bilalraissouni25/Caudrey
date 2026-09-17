# Intégrations open-source possibles — Mon Atelier Couture

Lecture du panorama « Design textile open source », filtrée pour **notre app** : web, 100 % navigateur (client-side), hébergée gratuitement (GitHub Pages), sans serveur. Objectif rappel : inspiration → design facile & créatif → patron → tissu → réalisation, pour un utilisateur lambda.

Critère clé : **est-ce une lib JavaScript exécutable dans le navigateur ?** Si oui → intégrable. Si c'est une appli desktop (C++, Python, Java, Tauri) → on peut seulement y renvoyer, pas l'embarquer.

---

## A. À intégrer en priorité (fort impact, faisable)

### 1. FreeSewing — le moteur de patrons dans l'app  ⭐ le plus structurant
- **Ce que c'est** : moteur open-source (MIT) écrit en **JavaScript** qui transforme des mesures en patron.
- **Ce que ça nous apporte** : générer un **vrai patron sur mesure dans l'app** (pas juste un lien), l'afficher en SVG, et produire le **patron imprimable A4** — la fonctionnalité patron + impression qu'on repousse depuis le début.
- **Comment** : import du cœur `@freesewing/core` + un design (ex. Aaron, Teagan…) via un CDN ESM (esm.sh / jsdelivr), branché sur les mesures du profil.
- **Effort** : élevé (apprendre l'API, mapper les mesures, rendu SVG, pavage A4). **Le plus gros levier.**

### 2. p5.js — la fabrique de motifs/imprimés  ⭐ le plus créatif
- **Ce que c'est** : librairie de creative coding, **navigateur natif**.
- **Ce que ça nous apporte** : un **générateur d'imprimés seamless** (pois, rayures, fleuri, géométriques, génératifs) paramétrables et recolorables, appliqués sur les éléments du Studio. Remplace nos 3 motifs codés en dur par une vraie palette infinie.
- **Comment** : p5.js depuis CDN, génère une tuile → appliquée comme remplissage (pattern) dans le composeur Fabric.js.
- **Effort** : moyen. Très bon rapport plaisir/effort.

---

## B. À recommander comme outils compagnons (liens, non intégrables)

Applis desktop puissantes, à conseiller à l'utilisateur avancé — impossibles à embarquer dans une page web :
- **Seamly2D** (ex-Valentina) — LA référence du patronage paramétrique libre.
- **Inkscape** — vectoriel (dossiers techniques, motifs en tuiles de clone).
- **Krita** — peinture numérique, mode répétition temps réel pour motifs seamless.
- **GIMP** — retouche bitmap.
- **FreeCAD / Blender** — 3D paramétrique et simulation (avancé).

→ Idée légère : une petite page « Outils compagnons » dans l'app avec ces liens et à quoi ils servent.

---

## C. Futur / ambitieux (faisable un jour, lourd aujourd'hui)

### Simulation 3D du drapé sur avatar
- **Blender** (desktop) ou un solveur de tissu **XPBD** porté en **three.js** (WebGL).
- Apporterait : voir le vêtement « tomber » en 3D sur un mannequin.
- **Effort** : très élevé (physique temps réel + avatar). À garder pour plus tard.

### IA : texte/image → patron
- **GarmentDiffusion**, **GarmentCode/GarmentCodeData** : la direction de fond du domaine (« inspiration → patron » automatique).
- Frein : ce sont des **modèles de recherche**, sans API hébergée prête à l'emploi. Les héberger soi-même = très lourd.
- Note : notre « rendu IA » couvre déjà le volet **visuel** ; le volet **patron auto** viendra quand ces modèles seront accessibles via API.

---

## D. Hors périmètre couture (autres métiers)

Pertinents seulement si Siqqun élargit vers d'autres artisanats — à classer comme extensions futures, pas pour l'objectif actuel :
- **Tissage** : AdaCAD, WeaveDreamer, format WIF.
- **Tricot** : AYAB (machines Brother), kpg (image → grille).
- **Broderie machine** : Ink/Stitch (extension Inkscape), PEmbroider.

---

## E. Sous le capot — seulement si on « construit » des algos

Kernels géométriques bas niveau (non pertinents pour notre app web) : **OpenCascade**, **CGAL**, **libIGL**, **Patro** (Python), **JBlockCreator** (Java). À ignorer sauf si on bâtit un moteur de patronage maison (or FreeSewing fait déjà le job en JS).

---

## Reco de séquence (quand tu voudras intégrer)
1. **FreeSewing** dans l'app → vrais patrons + impression A4 (débloque le plus de valeur).
2. **p5.js** → motifs infinis dans le Studio (créativité + plaisir).
3. Plus tard : page « outils compagnons » (liens), puis exploration **3D three.js** et **IA → patron** quand l'écosystème le permet.
