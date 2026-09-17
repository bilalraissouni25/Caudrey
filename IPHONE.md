# Envoyer vers Mon Atelier depuis un iPhone

Sur iPhone, le « Partager → application » natif n'existe pas pour les web-apps (limite d'Apple). La méthode fiable, c'est un **Raccourci** qui apparaît dans le menu Partager d'Instagram, Pinterest et Vinted, et qui ouvre l'app sur le lien partagé.

## 1. Installer l'app sur l'écran d'accueil
1. Ouvre l'adresse du site dans **Safari** (ex. `https://bilalraissouni25.github.io/Caudrey/`).
2. Bouton **Partager** → **Sur l'écran d'accueil** → Ajouter.
3. L'icône « Atelier » apparaît comme une app.

## 2. Créer le raccourci de partage (une seule fois)
1. Ouvre l'app **Raccourcis** (Shortcuts, préinstallée).
2. Onglet en bas → **+** (nouveau raccourci) → renomme-le « Envoyer à Mon Atelier ».
3. Touche le **(i)** en bas → active **Afficher dans la feuille de partage**.
   - Dans « Types acceptés », garde **URLs** (et tu peux laisser Texte).
4. Ajoute une action **« Obtenir les URL à partir de l'entrée »** (Get URLs from Input).
5. Ajoute une action **« Texte »** (Text) et écris :
   `https://bilalraissouni25.github.io/Caudrey/?url=`
   puis insère juste après la variable **URLs** de l'étape précédente.
6. Ajoute une action **« Ouvrir les URL »** (Open URLs) sur ce texte.
7. Enregistre.

## 3. Utilisation
- Tu scrolles dans Instagram / Pinterest / Vinted, tu vois une pièce qui te plaît.
- **Partager** → fais défiler les apps → **Envoyer à Mon Atelier**.
- L'app s'ouvre, récupère l'aperçu et l'épingle dans tes inspirations (avec tags automatiques si ta clé IA est configurée).

> Astuce : si le lien copié marche mieux, tu peux toujours copier le lien puis le coller dans l'onglet Inspirations → Lien. Même résultat.

## Android
Plus simple : une fois l'app installée (menu navigateur → Installer l'application), elle apparaît directement dans le menu Partager, sans raccourci.
