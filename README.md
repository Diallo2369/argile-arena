# Argile Arena

« Ma maison risque-t-elle de se fissurer ? » Site statique : une page par commune de France métropolitaine, une page résultat par adresse calculée dans le navigateur, des guides et des outils.

## Chaîne de données

```
npm run data:fetch    → scripts/data.mjs      télécharge dans data/raw/ (hors dépôt)
npm run data:prepare  → scripts/prepare.mjs   produit data/site/*.json et public/data/
npm run check         → scripts/check-data.mjs bloque si les volumes ou les villes témoins sont anormaux
npm run build         → astro build, puis scripts/postbuild.mjs (plan du site, robots.txt, CNAME)
```

Sources (toutes publiques, Licence Ouverte) :

| Donnée | Source | Usage |
| --- | --- | --- |
| Communes, codes postaux, contours | geo.api.gouv.fr (INSEE) | pages communes, part du territoire exposée |
| Arrêtés « sécheresse » | gaspar.zip, files.georisques.fr (fichier `catnat_gaspar_*.csv`, code `SEC`) | arrêtés, années touchées |
| Carte d'exposition 2026 | PMTiles publié par la DINUM sur data.gouv.fr (couche `rga`, attribut `ALEA`) | niveau à l'adresse, part du territoire, carte |
| Géocodage | Géoplateforme de l'IGN (`data.geopf.fr/geocodage`) | recherche d'adresse, dans le navigateur |
| Fond de carte | Plan IGN (WMTS Géoplateforme) | carte de la page résultat |

Pour travailler sans réseau : `npm run data:fixtures` fabrique un jeu de test à partir de fichiers déjà téléchargés (variable `FIXTURES`, contours approchés par des cercles).

## Où modifier quoi

| Fichier | Rôle |
| --- | --- |
| `src/lib/core.js` | Toutes les pages en fonctions qui renvoient du HTML : accueil, commune, département, guides, actualités, aides, méthode, à propos, mentions. Constantes : indice, plan d'action, barème Anah, Fonds, FAQ. |
| `src/lib/result.js` | Page résultat d'une adresse (rendue dans le navigateur) |
| `src/lib/pages.js` | Adresses, titres, descriptions et données structurées des pages éditoriales |
| `src/lib/rga.js` | Lecture de la carte des argiles (PMTiles), partagée Node / navigateur |
| `src/lib/site-config.js` | Adresse du site, ouverture à Google, mesure d'audience |
| `src/scripts/app.js` | Menu, recherche, animations, lettres, fissuromètre, rappel d'agenda |
| `src/scripts/result-page.js` | Page résultat : carte des argiles au point, questions, carte MapLibre |
| `src/styles/site.css` | Tout le style, variables de couleur en tête |
| `src/layouts/Base.astro` | En-tête, recherche plein écran, pied de page, balises de référencement |

## Publication (GitHub Pages)

`.github/workflows/deploy.yml` construit et publie à chaque envoi sur `main`, chaque lundi à 4 h 41 UTC (nouveaux arrêtés) et à la demande.

Variables du dépôt (Settings › Secrets and variables › Actions › Variables) :

- `SITE_URL` : `https://argilearena.fr` par défaut.
- `NOINDEX` : `1` par défaut, le site reste fermé à Google ; mettre `0` après relecture.
- `CF_BEACON` : jeton Cloudflare Web Analytics (sans cookie), facultatif.

Réglages : Settings › Pages › Source : « GitHub Actions ». Domaine personnalisé : `argilearena.fr`, puis « Enforce HTTPS ».

DNS (Cloudflare, en « DNS uniquement ») : quatre enregistrements A vers 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 et un CNAME `www` vers `<compte>.github.io`.

## Points d'attention

- Le fichier PMTiles (≈ 120 Mo) est lu directement sur data.gouv.fr par le navigateur (requêtes par plages). Si data.gouv.fr publie une nouvelle version, changer l'adresse dans `scripts/data.mjs` et `src/scripts/result-page.js`.
- Taille du site : environ 20 Ko par page commune, soit 700 Mo environ pour 35 000 communes (limite GitHub Pages : 1 Go).
- Pages « noindex » : adresse, communes sans exposition moyenne ou forte et sans arrêté.
