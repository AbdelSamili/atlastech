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
    HubSpotForm.jsx/.css     formulaire de contact, envoi vers l’API Forms HubSpot
```

## Formulaire HubSpot

Le formulaire « Demander une démo » est un formulaire React aux couleurs du site (`src/components/HubSpotForm.jsx`). À l’envoi, il transmet les données au formulaire HubSpot existant (portail `149836789`, région `eu1`) via l’**API Forms de HubSpot** : chaque envoi crée ou met à jour un contact dans le CRM et apparaît dans les soumissions du formulaire. Aucun iframe ni script HubSpot n’est chargé.

### Envoi

```
POST https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formId}
Content-Type: application/json
```

Point d’accès *unauthenticated* documenté par HubSpot ; il accepte les requêtes depuis le navigateur (CORS). L’hôte `api.hsforms.com` est le seul listé dans la documentation : HubSpot achemine la soumission vers le bon centre de données (eu1) grâce au portal ID.

Correspondance des champs (noms internes lus dans la définition du formulaire HubSpot) :

| Champ du site | Propriété HubSpot |
| --- | --- |
| Prénom | `0-1/firstname` |
| Nom | `0-1/lastname` |
| E-mail professionnel | `0-1/email` |
| Entreprise | `0-2/name` (champ « Entreprise » du formulaire, fiche entreprise) et `0-1/company` (nom de l’entreprise sur le contact) |
| Votre besoin | `0-1/message` (facultatif) |
| Case de consentement | `legalConsentOptions.consent` (`consentToProcess: true` + texte affiché) |

Le contexte envoie `pageUri` (URL courante), `pageName` (titre de la page) et `hutk` uniquement si le cookie `hubspotutk` existe (il n’existe que si le code de suivi HubSpot est installé sur le site).

Comportement : validation en français avant l’envoi (champs obligatoires, format de l’e-mail, consentement), bouton désactivé « Envoi en cours… » pendant la requête, message de remerciement en cas de succès, message « Une erreur est survenue, veuillez réessayer. » en cas d’échec avec conservation des valeurs saisies. Le détail de l’erreur HubSpot est affiché dans la console du navigateur (`[HubSpot] Échec de l’envoi du formulaire`).

Pour vérifier un nom interne dans HubSpot : **Paramètres > Propriétés**, chercher la propriété, puis lire son **nom interne**.

### Variables

| Variable | Valeur |
| --- | --- |
| `VITE_HUBSPOT_REGION` | région du compte, ex. `eu1` |
| `VITE_HUBSPOT_PORTAL_ID` | portal ID (`data-portal-id` du code d’intégration) |
| `VITE_HUBSPOT_FORM_ID` | ID du formulaire (`data-form-id`) |

Si l’une d’elles manque, le formulaire s’affiche avec le bouton désactivé et la mention « Formulaire non configuré ». Ces valeurs ne sont pas secrètes : elles figurent dans le code de la page publiée.

**En local** : copiez `.env.example` en `.env`, remplissez les trois valeurs, puis relancez `npm run dev`. `.env` est ignoré par git.

**Sur Vercel** : Vite intègre les variables **au moment du build**, il faut donc **redéployer après chaque ajout ou modification**.

```bash
npx vercel env add VITE_HUBSPOT_REGION production       # puis la même chose avec "preview"
npx vercel env add VITE_HUBSPOT_PORTAL_ID production
npx vercel env add VITE_HUBSPOT_FORM_ID production
npx vercel --prod
```

Pour modifier une valeur existante : `npx vercel env rm NOM production` puis `npx vercel env add …`. Ou dans le tableau de bord : projet `atlastech-solutions` > **Settings > Environment Variables**, puis **Deployments > ⋯ > Redeploy**.

### Points d’attention

- Si vous activez **reCAPTCHA** sur le formulaire HubSpot, l’API refusera les envois (`FORM_HAS_RECAPTCHA_ENABLED`) : laissez-le désactivé.
- Si vous **renommez ou supprimez un champ** dans HubSpot, mettez à jour la correspondance dans `buildPayload()` (`HubSpotForm.jsx`).

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
