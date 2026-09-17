# Héberger Mon Atelier Couture en ligne (gratuit)

L'app est un site statique : aucun serveur nécessaire. L'héberger en ligne (HTTPS) débloque deux choses : tu y accèdes depuis ton téléphone, et le **bouton Partager natif** (Instagram/Pinterest/Vinted → Mon Atelier) devient possible après installation.

Le dossier à publier est **`Mon Atelier Couture`** entier (index.html, manifest.webmanifest, sw.js, icon-192.png, icon-512.png).

---

## Option A — Netlify Drop (le plus simple, glisser-déposer)

1. Va sur **app.netlify.com/drop**.
2. Crée un compte gratuit (email ou GitHub) — nécessaire pour garder le site en ligne.
3. **Glisse le dossier `Mon Atelier Couture`** dans la zone.
4. En quelques secondes tu obtiens une adresse du type `https://xxxx.netlify.app`. C'est fini.
- Gratuit, 100 Go/mois. Tu peux re-glisser le dossier pour mettre à jour.

## Option B — Cloudflare Pages (bande passante illimitée)

1. Compte gratuit sur **pages.cloudflare.com**.
2. « Create a project » → « Direct Upload » → téléverse le dossier.
3. Adresse en `https://xxxx.pages.dev`.
- Idéal si beaucoup de visites ; limite de 25 Mo par fichier (large ici).

## Option C — GitHub Pages (si tu as déjà GitHub)

1. Crée un dépôt public, ex. `atelier-couture`.
2. Téléverse les fichiers du dossier (bouton « Add file → Upload files »).
3. Settings → Pages → Source : branche `main`, dossier `/root` → Save.
4. Adresse en `https://tonpseudo.github.io/atelier-couture/`.
- 100 % gratuit, mais pas de glisser-déposer.

---

## Installer l'app sur le téléphone (pour le bouton Partager)

1. Ouvre l'adresse du site dans le navigateur du téléphone.
2. Menu du navigateur → **« Installer l'application »** / « Ajouter à l'écran d'accueil ».
3. L'icône apparaît comme une vraie app.
4. Désormais, dans Instagram/Pinterest/Vinted : **Partager → Mon Atelier** → le lien arrive dans tes inspirations.

> Astuce Android : le partage de lien marche très bien. Sur iPhone, si « Mon Atelier » n'apparaît pas dans le menu Partager, utilise l'import par lien (copier le lien → onglet Inspirations → coller).

---

## Mettre à jour l'app

Quand on modifie les fichiers : re-glisser le dossier (Netlify/Cloudflare) ou re-téléverser (GitHub). Le service worker (`sw.js`) gère la mise en cache et l'usage hors-ligne ; il se met à jour automatiquement à la visite suivante.
