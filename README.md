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

## Connecter le formulaire HubSpot

Tant que les identifiants HubSpot ne sont pas renseignés, le site affiche un **formulaire de démonstration** qui n’envoie aucune donnée. Dès qu’ils le sont, le composant `HubSpotForm` charge le script HubSpot et affiche le vrai formulaire.

### 1. Récupérer les valeurs dans HubSpot

HubSpot > Marketing > Formulaires > votre formulaire > **Partager / Intégrer**. Le code d’intégration ressemble à l’un de ces deux formats :

**Format A (classique, « v2 »)**

```html
<script charset="utf-8" type="text/javascript" src="//js-eu1.hsforms.net/forms/embed/v2.js"></script>
<script>
  hbspt.forms.create({
    region: "eu1",                                  // -> VITE_HUBSPOT_REGION
    portalId: "12345678",                           // -> VITE_HUBSPOT_PORTAL_ID
    formId: "1a2b3c4d-1234-5678-9abc-0123456789ab"  // -> VITE_HUBSPOT_FORM_ID
  });
</script>
```
→ `VITE_HUBSPOT_EMBED_MODE=v2`

**Format B (nouvel éditeur)**

```html
<script src="https://js-eu1.hsforms.net/forms/embed/12345678.js" defer></script>
<div class="hs-form-frame" data-region="eu1" data-form-id="1a2b3c4d-..." data-portal-id="12345678"></div>
```
→ `VITE_HUBSPOT_EMBED_MODE=frame`, avec `data-region`, `data-portal-id` et `data-form-id` comme valeurs.

Ne collez pas le code HTML dans le projet : seules les trois valeurs (région, portal ID, form ID) sont nécessaires.

### 2. En local

Ajoutez ces lignes au fichier `.env.local` à la racine du projet (créez-le à partir de `.env.example` s’il n’existe pas ; s’il contient déjà une ligne `VERCEL_OIDC_TOKEN` ajoutée par Vercel, gardez-la) :

```
VITE_HUBSPOT_REGION=eu1
VITE_HUBSPOT_PORTAL_ID=12345678
VITE_HUBSPOT_FORM_ID=1a2b3c4d-1234-5678-9abc-0123456789ab
VITE_HUBSPOT_EMBED_MODE=v2
```

Relancez `npm run dev`. `.env.local` est ignoré par git.

### 3. Sur Vercel (site en ligne)

Les variables Vite sont intégrées **au moment du build** : après les avoir ajoutées ou modifiées, il faut **redéployer**.

En ligne de commande (chaque commande demande la valeur) :

```bash
npx vercel env add VITE_HUBSPOT_REGION production
npx vercel env add VITE_HUBSPOT_PORTAL_ID production
npx vercel env add VITE_HUBSPOT_FORM_ID production
npx vercel env add VITE_HUBSPOT_EMBED_MODE production
npx vercel --prod
```

Ou dans le tableau de bord : projet `atlastech-solutions` > **Settings > Environment Variables** > ajoutez les quatre variables (environnement *Production*), puis **Deployments > ⋯ > Redeploy**.

Attention : `npx vercel env pull` réécrit `.env.local` ; sauvegardez vos valeurs locales avant de l’utiliser.

Ces valeurs ne sont pas secrètes : elles figurent de toute façon dans le code de la page publiée.

### Style du formulaire HubSpot

- **Format A (v2)** : le formulaire est inséré directement dans la page et le thème HubSpot est désactivé (`css: ''`). Les règles `.hubspot-embed` de `src/components/HubSpotForm.css` l’habillent aux couleurs du site (Poppins, champs arrondis 12 px, bouton orange). Si votre compte affiche malgré tout le formulaire dans un iframe, appliquez les réglages ci-dessous dans HubSpot.
- **Format B (frame)** : le formulaire est rendu dans un iframe, le CSS du site ne peut pas l’atteindre. Dans l’éditeur de formulaire HubSpot (onglet Style), utilisez :
  - Police : Poppins
  - Couleur principale / bouton : `#EB7D1A`, texte du bouton `#0F172A`
  - Texte des libellés : `#0F172A`, texte d’aide : `#64748B`
  - Bordure des champs : `#CBD5E1`, rayon 12 px
  - Couleur de focus : `#104896`

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
