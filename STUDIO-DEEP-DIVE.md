# Studio design — état de l'art et plan de refonte

**Objectif** : sortir le Studio du registre « Canva pour vêtements » pour en faire un outil de conception qui tient debout face à un regard professionnel — sans serveur, sans abonnement, dans une PWA.
**Date** : 17 septembre 2026. Complète `ROADMAP.md` et `ETAT-DU-PROJET.md`.

---

## 1. Le diagnostic, sans ménagement

Le Studio actuel est un éditeur de formes libres : on pose des silhouettes SVG sur un canvas, on les colore, on les empile. C'est agréable et ça ne sert à rien, pour une raison précise : **le dessin ne sait rien du vêtement**. Déplacer une manche ne change ni le patron, ni le métrage, ni les mesures. Le croquis est un cul-de-sac — il ne descend nulle part dans la chaîne.

C'est exactement ce qui sépare un jouet d'un outil professionnel. Dans un outil pro, le dessin technique et le patron sont **deux vues du même objet**. On ne dessine pas une manche trois-quarts : on règle la longueur de manche à 0,62, et le dessin *et* le patron changent ensemble.

Deuxième problème, cosmétique mais décisif pour la crédibilité : le rendu ne respecte aucune convention du dessin technique. Formes pleines colorées, pas de hiérarchie de traits, pas de symétrie garantie, pas de vue dos systématique, motifs génératifs et rendu IA « joli ». Un dessin technique professionnel, c'est du noir et blanc, des traits hiérarchisés, une symétrie parfaite, et aucun effet.

---

## 2. Ce que font réellement les professionnels

### La chaîne de production
Le flux standard, tel que le décrivent les praticiens du secteur : le vêtement **commence dans Illustrator**, où le designer pose la silhouette et dessine les *flats* techniques ; les variantes s'explorent avec un outil génératif (Vizcom) ; le patron est finalisé, puis importé dans **CLO 3D, Browzwear (VStitcher) ou Style3D** pour être assemblé, simulé et essayé sur un avatar ; les matières se travaillent dans Substance 3D ; le tout part en tech pack vers l'usine. Le constat du terrain est que « la mode n'a pas besoin de plus de modeleurs, elle a besoin de gens qui comprennent toute la chaîne » — la friction est dans les passages de relais, pas dans les outils pris isolément.

Ce qui compte pour nous : **personne ne dessine dans le vide**. Le dessin sert à spécifier, et il est en permanence confronté au patron et au corps.

### Les conventions du dessin technique (le *flat*)
Ce sont des règles dures, et c'est ce qui fait qu'un dessin « fait pro » ou pas :

- **Proportions réelles** : le flat est construit sur une grille où chaque carreau vaut une mesure réelle (longueur, largeur poitrine/hanches, longueur de manche), pas sur un canon stylisé.
- **Symétrie stricte** : on dessine une moitié, on la reflète. Jamais deux côtés dessinés à la main.
- **Hiérarchie des traits** : contour épais, coutures moyennes, surpiqûres en pointillé fin. C'est la hiérarchie qui rend le dessin lisible par un atelier.
- **Noir et blanc, aucun ombrage** : le flat n'est pas une illustration. Ce qui est coloré ou ombré est un *float*, un autre objet.
- **Devant et dos obligatoires**, et idéalement des vues de détail : « devant/dos ne suffisent pas à une usine pour comprendre les exigences ».
- **Tout ce qui se coud doit être visible** : ouvertures, fermetures, poches, boutons, passants, position des surpiqûres.

### Les formats d'échange
Le standard d'interopérabilité des patrons est le **DXF, dans ses deux déclinaisons métier : AAMA et ASTM D6673**. Chacune encode les contours de pièces, les marges de couture, les crans, les trous de perçage, le droit-fil orienté, les lignes internes, les règles de gradation et le texte — en assignant chaque type d'élément à un numéro de calque, et en codant chaque sommet (courbe, angle, cran, point de gradation). Les deux sont « proches cousines », l'ASTM étant la plus formellement publiée. C'est ce que lisent CLO, les traceurs et les découpeuses.

**Exporter en DXF-AAMA, c'est le geste qui fait basculer un outil amateur dans la catégorie sérieuse** : ça veut dire qu'un patron sorti de l'app peut aller chez un traceur professionnel ou dans un logiciel CAO.

---

## 3. Ce que vend le marché grand public — et ce que ça nous apprend

**Tailornova**, à 49 $/mois, fait exactement ceci : on saisit ses mesures, l'outil construit un **FitModel 3D** personnalisé, on compose un vêtement à partir de gabarits paramétriques, on voit un aperçu 3D *et* un flat, et le **patron sur mesure est généré en trois secondes**, téléchargeable pour impression, traceur ou découpe laser.

C'est la preuve de marché de la thèse ci-dessous : **le grand public paye pour du paramétrique relié au patron**, pas pour un outil de dessin. Et nous avons déjà, gratuitement et hors ligne, le moteur qui coûte le plus cher dans cette équation.

Les autres repères : **Seamly2D / Valentina** (GPL, bureau) font du paramétrique pur mais avec une courbe d'apprentissage rude et aucune 3D ; **PatternReview** sert de mémoire collective ; les apps grand public (Sewjo, Threadloop, Cora) ne font que du suivi.

---

## 4. Ce que les gens construisent eux-mêmes

Le plus instructif, parce que ça montre ce qui est atteignable par une personne seule.

| Projet | Ce que c'est | Licence | Ce qu'on en retient |
|---|---|---|---|
| **openclo** (`sssamuelll/openclo`) | éditeur de patrons 2D **+ visualisation 3D du vêtement, dans le navigateur** | open source | quelqu'un fait déjà tourner la boucle 2D↔3D en web : ce n'est pas hors de portée |
| **Costumy** (`cdrinmatane/Costumy`) | prototype qui transforme un patron 2D en vêtement 3D : mesures sur un corps 3D → **patron généré via freesewing.org** → maillage avec informations de couture → drapé → export | GPL-3.0 | **ils utilisent FreeSewing exactement comme nous** ; la chaîne mesures → patron → drapé est validée par quelqu'un d'autre |
| **Garment-Pattern-Generator** (Korosteleva) | génération de jeux de données de vêtements 3D avec leurs patrons | recherche | la représentation « patron + coutures » comme donnée structurée est un standard de fait en recherche |
| **Dress-1-to-3** | une seule photo → tenue 3D **prête à simuler**, via diffusion + physique différentiable | recherche | l'image → vêtement simulable existe, mais c'est du GPU et du niveau labo |
| **oxihuman** (`cool-japan/oxihuman`) | générateur de corps humain paramétrique **100 % client, WASM 259 Ko gzip**, sliders taille/poids/muscle/âge, **ajustement sur mesures réelles poitrine/taille/hanches à ±0,66 cm**, export GLB/OBJ/STL | Apache-2.0 (maillage CC0 issu de MakeHuman) | **le mannequin à ses mesures, en 3D, dans le navigateur, pour 259 Ko** — c'est la trouvaille de ce tour d'horizon |
| **Anny** (NAVER Labs) | modèle humain paramétrique open source, 13 000 sommets, 564 blendshapes, de l'enfant à la personne âgée | Apache-2.0 | alternative plus riche si oxihuman montre ses limites |
| **makehuman-js** | construction de personnages 3D dans le navigateur | open source | la voie historique, plus lourde |
| **dxf-writer** (npm) | écriture de fichiers DXF (calques, polylignes, texte) | MIT | de quoi implémenter l'export DXF-AAMA en quelques centaines de lignes |
| **three.js** | 3D navigateur | MIT | le socle si on va vers la 3D |

Côté plus exotique, la scène **Fabricademy / Grasshopper** fabrique des vêtements par règles génératives (motifs paramétriques, structures déployables, tissus programmés). Intéressant culturellement, peu transposable ici : ça produit de la forme, pas du vêtement portable.

---

## 5. Le pivot : le dessin doit sortir du patron, pas l'inverse

Voilà la thèse, et tout le reste en découle.

**Le Studio ne doit plus être un canvas où l'on pose des formes. Il doit être une vue éditable du patron.** On a sous le capot 68 modèles paramétriques, et chacun expose des dizaines de réglages — **Teagan en a 50 à lui seul** : aisance à la poitrine, aisance au biceps, aisance au col, facteur de col, longueur bonus, forme d'emmanchure, et ainsi de suite. Chaque pièce du patron peut être rendue isolément avec ses dimensions réelles (vérifié : le devant de Teagan fait 296 × 697 mm, la manche 337 × 183 mm).

Donc : **un curseur bouge → le dessin technique se redessine → le patron se redessine → le métrage se recalcule.** C'est la même donnée vue de trois façons. C'est ce que Tailornova facture 49 $/mois, et c'est à notre portée parce que le moteur est déjà là et déjà français.

Corollaire brutal : **le dessin libre n'est plus le cœur du Studio**. Il redevient ce qu'il est chez les pros — un calque d'annotation par-dessus le dessin technique, pour noter une idée, une retouche, un détail à inventer.

---

## 6. Le plan, en cinq étages

Chaque étage a une valeur propre. On peut s'arrêter à n'importe lequel.

### Étage 1 — Le dessin technique généré depuis le patron *(3 soirées, aucune dépendance)*
Construire le flat devant/dos à partir des pièces réelles du patron : contour de la pièce devant (reflété au pli), contour du dos, manche montée en place, aux proportions exactes puisqu'on connaît les millimètres.
Conventions pro appliquées d'office : noir et blanc, contour à 0,8 mm, coutures à 0,5, surpiqûres en pointillé 0,3, symétrie garantie par construction, vue devant et vue dos côte à côte, cotation optionnelle des mesures finies.
*Ce que ça change* : pour la première fois, le dessin **est** le vêtement. Et il est juste.

### Étage 2 — Le panneau paramétrique *(3 soirées)*
Exposer les options du modèle en curseurs lisibles et traduits — longueur, aisances, profondeur d'encolure, forme d'emmanchure — avec mise à jour en direct du flat, du patron et du métrage. Plus un comparateur : deux ou trois variantes côte à côte, et la possibilité d'enregistrer une variante comme « ma version ».
*Ce que ça change* : on passe de « choisir un patron » à « concevoir son vêtement ».

### Étage 3 — Le corps et les calques *(3 soirées)*
La silhouette du fond dérivée de ses mesures réelles (le mannequin est déjà un SVG paramétrable). Des calques qui veulent dire quelque chose — tissu principal, doublure, surpiqûres, mercerie, annotations — au lieu de calques anonymes. Et le dessin libre rétrogradé au rang de calque d'annotation.
*Ce que ça change* : le Studio devient lisible par quelqu'un d'autre qu'elle.

### Étage 4 — Le tech pack *(2 soirées)*
Le document qui fait basculer l'outil dans le sérieux : flat devant/dos, nomenclature des pièces avec nombre et sens de coupe, tableau des mesures finies, plan de coupe, mercerie, notes de construction — en PDF, sur la base du module d'impression déjà écrit.
*Ce que ça change* : ce qui sort de l'app ressemble à ce que reçoit un atelier.

### Étage 5 — Le pas de côté *(le reste, à la carte)*
- **Export DXF-AAMA** *(2 soirées, `dxf-writer` en MIT)* : le patron devient utilisable par un traceur professionnel, une découpeuse, CLO ou Seamly2D. Peu de gens s'en serviront ; c'est précisément ce qui prouve que l'outil est sérieux.
- **Avatar 3D à ses mesures** *(3–4 soirées, oxihuman en Apache-2.0, 259 Ko)* : voir le corps en 3D, tourner autour, et à terme y projeter les couleurs et le tissu.
- **Drapé approximatif** *(chantier ouvert, risqué)* : coudre les panneaux 2D sur l'avatar avec une simulation masse-ressort. openclo et Costumy montrent que c'est faisable ; la qualité CLO, non. À ne tenter que si les quatre premiers étages sont finis, et en l'assumant comme un aperçu, pas comme un essayage.

---

## 7. Ce qu'il faut assumer de supprimer ou rétrograder

- **Le dessin libre comme cœur** → calque d'annotation.
- **Le générateur de motifs p5** → déplacé vers la partie Tissu (c'est un imprimé, pas un outil de conception), ou supprimé.
- **Le rendu réaliste IA** → gardé, mais présenté pour ce qu'il est : une image d'ambiance pour se projeter, jamais une représentation fidèle du vêtement qui sortira de la machine. Un outil pro ne confond pas un rendu et une spécification.
- **La bibliothèque de 101 éléments décoratifs** → réduite à ce qui est un vrai détail de construction (poche, patte, passant, fermeture) et relié au tech pack ; le reste (cœurs, étoiles, lunettes) sort.

---

## 8. Ordre d'attaque proposé

1. **Étage 1** — le flat depuis le patron. C'est le socle, et c'est ce qui rend le reste possible.
2. **Étage 2** — le panneau paramétrique. C'est là que l'outil devient un outil de conception.
3. **Étage 4** — le tech pack. Effort faible, effet maximal sur la crédibilité.
4. **Étage 3** — le corps et les calques. Confort et lisibilité.
5. **Étage 5** — DXF d'abord (peu cher, très signifiant), 3D ensuite si l'envie est là.

Environ **onze soirées** pour les étages 1, 2 et 4 — c'est-à-dire pour que le Studio cesse d'être un jouet.

---

### Sources
- Le stack 3D de la mode et le flux réel : https://3dartist.substack.com/p/3d-fashion-deep-dive-02-the-3d-fashion
- Conventions du dessin technique : https://www.pointsofmeasure.com/tutorials-education/how-to-draw-technical-flats-by-hand · https://techpacker.com/blog/design/what-you-need-to-know-about-fashion-flat-sketches/
- DXF-AAMA vs DXF-ASTM : https://minervapatterns.com/blog/dxf-aama-vs-dxf-astm
- Tailornova (paramétrique + FitModel + patron sur mesure, 49 $/mois) : https://tailornova.com/
- openclo — éditeur 2D + 3D navigateur : https://github.com/sssamuelll/openclo
- Costumy — patron FreeSewing → vêtement 3D : https://github.com/cdrinmatane/Costumy
- Garment-Pattern-Generator : https://github.com/maria-korosteleva/Garment-Pattern-Generator
- Dress-1-to-3 (photo → 3D simulable) : https://dress-1-to-3.github.io/
- oxihuman — corps paramétrique client, WASM : https://github.com/cool-japan/oxihuman
- Anny (NAVER Labs) : https://europe.naverlabs.com/blog/anny-a-free-to-use-3d-human-parametric-model-for-all-ages/
- dxf-writer : https://www.npmjs.com/package/dxf-writer
- Computational couture / Fabricademy : https://class.textile-academy.org/2025/maricruz-garcia/assignments/week06/
