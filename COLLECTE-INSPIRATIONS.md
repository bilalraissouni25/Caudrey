# Collecter ses inspirations depuis Instagram, Pinterest et Vinted

Toutes les options étudiées, classées par faisabilité réelle (juin 2026). Le résumé : **le bouton Partager natif (PWA) est la meilleure voie**, l'import par lien la complète, et les API officielles ne valent le coup que pour Pinterest avec un serveur.

---

## 1. Le bouton « Partager » natif — recommandé

Quand l'app est **hébergée en ligne et installée** sur le téléphone (PWA), elle s'inscrit dans le menu *Partager* du système. Depuis l'appli Instagram, Pinterest ou Vinted, on fait **Partager → Mon Atelier**, et le lien arrive directement dans l'onglet Inspirations.

- **Marche pour les trois applis** (et n'importe quelle autre), sans aucune API.
- **Gratuit**, pas de clé, pas de validation.
- Déjà câblé dans l'app : `manifest.webmanifest` déclare un `share_target`, et `index.html` lit le lien partagé au chargement.
- **Condition** : l'app doit être servie en HTTPS et « installée » (Ajouter à l'écran d'accueil). Donc → héberger d'abord (voir `HEBERGEMENT.md`).
- Limite : sur iOS le partage de PWA est plus capricieux que sur Android ; en repli, l'import par lien fonctionne partout.

## 2. L'import par lien (copier-coller) — déjà actif

Dans l'app, onglet **Inspirations → Importer un lien** : on colle l'URL d'un pin, d'un post ou d'une annonce, l'app récupère automatiquement l'image d'aperçu et le titre (balises Open Graph), via un relais public gratuit.

- Fonctionne **en local** (fichier ouvert sur l'ordi) comme en ligne.
- Couvre Pinterest, Vinted, blogs couture, e-shops. Instagram marche quand le post est public et non protégé.
- Limite : certains sites très protégés masquent l'aperçu → dans ce cas le lien est quand même enregistré.

## 3. Les API officielles — par plateforme

### Pinterest — possible, mais demande un serveur
- API v5 réelle, gratuite, avec OAuth (`pins:read`, `boards:read`) : on pourrait importer un **tableau entier** d'un coup.
- Nécessite : créer une app sur le portail développeur Pinterest, un **petit serveur** pour garder le secret OAuth, et une revue pour passer en accès « Standard » (l'accès « Trial » suffit pour tester).
- C'est l'évolution naturelle si tu veux un vrai « connecter mon compte Pinterest ».

### Instagram — inadapté à un usage perso
- L'API Graph exige un compte **professionnel/créateur**, une app Meta validée, et ne donne accès qu'à **ton propre** contenu — pas à tes posts *enregistrés*, ni au contenu des autres.
- L'ancien « Basic Display » est fermé. → Pour Instagram, on s'appuie sur le bouton Partager et l'import par lien.

### Vinted — pas d'API publique
- Aucune API ouverte. Seulement des services de *scraping* tiers (payants, fragiles, détection anti-bot Datadome) et contraires aux conditions d'utilisation.
- → Bouton Partager + import par lien uniquement. C'est suffisant pour épingler un article qui te plaît.

## 4. Autres voies possibles

- **Bookmarklet** : un petit favori « Épingler dans l'Atelier » qu'on clique sur n'importe quelle page web pour envoyer l'URL à l'app. Léger à ajouter une fois l'app hébergée.
- **Extension navigateur** : un bouton permanent dans Chrome/Firefox pour capturer une image en un clic. Plus puissant, mais c'est un projet en soi (paquet d'extension à publier).
- **Réception d'image partagée** (et pas juste le lien) : possible via `share_target` en `method: POST` + service worker qui reçoit le fichier. Évolution prévue une fois l'app hébergée.
- **Import d'un export de données** : Pinterest et Instagram permettent de télécharger ses données ; on pourrait lire ce fichier pour importer en masse. Solution de secours sans API.

---

## Recommandation

1. **Héberger l'app** (voir `HEBERGEMENT.md`) → débloque le bouton Partager natif pour les trois plateformes.
2. Garder **l'import par lien** comme filet universel.
3. Plus tard, si tu veux importer des **tableaux Pinterest entiers** : ajouter un petit serveur + l'API Pinterest v5.
