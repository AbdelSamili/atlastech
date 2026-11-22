# AtlasTech Solutions – site vitrine

Site one-page d’une **entreprise fictive** (projet universitaire, Master Qualité du Logiciel, FST Fès) utilisé dans une présentation CRM HubSpot. Le formulaire « Demander une démo » est prévu pour être relié à HubSpot : chaque prospect qui le remplit apparaît automatiquement comme contact dans le CRM.

- React + Vite, CSS simple, icônes `lucide-react`
- En ligne : **https://atlastech-solutions.vercel.app/**

## Lancer en local

```bash
npm install
npm run dev        # http://localhost:5173/
npm run build      # build de production dans dist/
npm run preview    # sert dist/ sur http://localhost:4173/
```

## Déploiement

Le site est hébergé sur **Vercel**, projet `atlastech-solutions`, servi à la racine du domaine (`base: '/'` dans `vite.config.js`). C’est cette adresse, sans `https://`, qui est saisie dans le champ « Site web de l’entreprise » de HubSpot : `atlastech-solutions.vercel.app`.

- Preset Vercel : **Vite**, commande de build `npm run build`, dossier de sortie `dist`. Aucun `vercel.json` n’est nécessaire.
- **Déploiement automatique** : le dépôt GitHub `AbdelSamili/atlastech` est connecté au projet Vercel. Chaque push sur `main` déclenche un déploiement de production ; les autres branches obtiennent une URL de prévisualisation.
- **Déploiement manuel** depuis ce dossier (déjà lié au projet via `.vercel/`) :

  ```bash
  npx vercel login     # une seule fois
  npx vercel --prod    # build + mise en production
  ```

- **Redéployer sans changer le code** (par exemple après avoir ajouté une variable d’environnement) : tableau de bord Vercel > projet `atlastech-solutions` > **Deployments** > menu `⋯` du dernier déploiement > **Redeploy**, ou `npx vercel --prod`.

## Structure

```
src/
  App.jsx                    assemblage des sections
  index.css                  tokens (couleurs, rayons, typo), boutons, animations
  nav.js                     liens de navigation (en-tête et pied de page)
  components/
    Header, Hero, Solutions, Method, About, Contact, Footer
    HubSpotForm.jsx/.css     formulaire HubSpot + formulaire de démonstration
```

## Formulaire HubSpot

Le formulaire « Demander une démo » est le formulaire HubSpot du portail `149836789` (région `eu1`). Chaque envoi crée ou met à jour un contact dans le CRM.

Si l’une des trois variables manque, le site affiche à la place un **formulaire de démonstration** qui n’envoie aucune donnée.

### Fonctionnement (`src/components/HubSpotForm.jsx`)

Le composant reproduit le code d’intégration HubSpot (format `hs-form-frame`) :

```html
<script src="https://js-eu1.hsforms.net/forms/embed/149836789.js" defer></script>
<div class="hs-form-frame" data-region="eu1" data-form-id="9d1edabd-…" data-portal-id="149836789"></div>
```

- La `div` est rendue par React avec les valeurs des variables d’environnement ; le script est injecté **après le montage**, une seule fois par page (balise identifiée par `id="hubspot-forms-embed"`).
- Le script HubSpot surveille la page (`MutationObserver`) : si le composant est remonté, le formulaire réapparaît sans recharger le script.
- Un squelette « Chargement du formulaire… » s’affiche jusqu’à l’événement HubSpot `hs-form-event:on-ready` (ou le chargement de l’iframe). Après 20 s sans réponse, un message d’erreur s’affiche.

### Variables

| Variable | Valeur dans le code HubSpot |
| --- | --- |
| `VITE_HUBSPOT_REGION` | `data-region` (ex. `eu1`) |
| `VITE_HUBSPOT_PORTAL_ID` | `data-portal-id` |
| `VITE_HUBSPOT_FORM_ID` | `data-form-id` |

Ces valeurs ne sont pas secrètes : elles figurent de toute façon dans le code de la page publiée.

**En local** : copiez `.env.example` en `.env` et remplissez les trois valeurs, puis relancez `npm run dev`. `.env` est ignoré par git.

**Sur Vercel** : Vite intègre les variables **au moment du build**, il faut donc **redéployer après chaque ajout ou modification**.

```bash
npx vercel env add VITE_HUBSPOT_REGION production       # puis la même chose avec "preview"
npx vercel env add VITE_HUBSPOT_PORTAL_ID production
npx vercel env add VITE_HUBSPOT_FORM_ID production
npx vercel --prod
```

Pour modifier une valeur existante : `npx vercel env rm NOM production` puis `npx vercel env add …`. Ou dans le tableau de bord : projet `atlastech-solutions` > **Settings > Environment Variables**, puis **Deployments > ⋯ > Redeploy**.

### Style du formulaire

Le formulaire est rendu dans un **iframe** : le CSS du site ne peut pas atteindre ses champs. Le site ne gère que le conteneur (carte blanche, bordure, rayon 24 px). Le style se règle dans HubSpot, éditeur du formulaire > onglet **Style** :

- Police : Poppins (ou la plus proche proposée)
- Bouton : fond `#EB7D1A`, texte `#0F172A`
- Libellés et texte : `#0F172A`, texte d’aide et placeholders : `#64748B`
- Champs : fond blanc, bordure `#CBD5E1`, rayon 12 px ; couleur de focus `#104896`
- Pas de titre ni de paragraphe d’introduction dans le formulaire : la section du site les affiche déjà


## Charte

| Rôle | Valeur |
| --- | --- |
| Bleu principal | `#104896` |
| Bleu clair | `#EEF3FB` |
| Orange (CTA, accents) | `#EB7D1A` (texte foncé dessus pour le contraste AA) |
| Vert (succès uniquement) | `#16A34A` |
| Texte / texte secondaire | `#0F172A` / `#64748B` |
| Bordures | `#E2E8F0` |

---

Entreprise fictive – projet universitaire, Master Qualité du Logiciel (MQL), FST Fès.
