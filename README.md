# Écran Magasin

Affichage temps réel des **factures en attente de retrait**, conçu pour tourner en plein écran sur une TV ou un moniteur installé dans l'espace client d'un magasin.

Le client voit apparaître sa facture, entend son numéro annoncé à voix haute, et la carte disparaît dans une pluie de confettis dès que la commande est livrée.

---

## Ce que fait l'écran

- **Grille par magasin** — une colonne par point de retrait, une carte par facture (référence, client, heure, progression `x/y articles`).
- **Rafraîchissement automatique** — l'API est interrogée toutes les 5 secondes, sans rechargement de page.
- **Annonce vocale** — « FACTURE N° 1234 LIVRÉE » via la Web Speech API (voix française si le navigateur en a une).
- **Signal sonore** — un accord ascendant pour une nouvelle facture, descendant pour une livraison (généré à la volée par la Web Audio API : aucun fichier son à héberger).
- **Confettis + toast** au moment de la livraison.
- **Alerte retard** — une facture non livrée depuis plus de 20 minutes passe en style « retard ».
- **Bandeau compteurs** — en attente, livrées du jour, partielles, total en attente.
- **Bandeau défilant** de messages commerciaux + horloge et date en français dans l'en-tête.

Le tout en mode kiosque : `100vw × 100vh`, `overflow: hidden`, typographie surdimensionnée pour être lisible à plusieurs mètres.

---

## Stack

React 19 · Vite 8 · Axios · canvas-confetti · Tabler Icons + police Oswald (chargées par CDN dans `src/App.css`).

Pas de router, pas de state manager : toute la logique tient dans des hooks maison (`src/hooks/`).

---

## Démarrer en local

Prérequis : Node.js 20+ et l'API backend qui tourne sur `http://localhost:8000`.

```bash
npm install
npm run dev
```

L'écran s'ouvre sur `http://localhost:5173` et interroge par défaut le tenant `localhost` (`http://localhost:8000/api`).

Autres commandes :

```bash
npm run build     # build de production dans dist/
npm run preview   # sert le build localement
npm run lint      # ESLint
```

---

## Multi-tenant

Le tenant est choisi par le paramètre d'URL `?tenant=` et détermine à quelle API l'écran se connecte :

| URL ouverte                              | API interrogée                       |
| ---------------------------------------- | ------------------------------------ |
| `http://localhost:5173/`                 | `http://localhost:8000/api`          |
| `https://…/?tenant=ibp`                  | `https://ibp.app-bys.com/api`        |
| `https://…/?tenant=demo-factura`         | `https://demo-factura.app-bys.com/api` |
| `?tenant=` inconnu ou absent en prod     | retombe sur `demo-factura`           |

Pour **ajouter un magasin**, une seule ligne à écrire dans `tenantMap` — [src/hooks/useQueryTenant.js](src/hooks/useQueryTenant.js) :

```js
'mon-magasin': 'https://mon-magasin.app-bys.com',
```

Le tenant actif est affiché en haut à gauche de l'écran (badge bleu). C'est un repère de développement : à retirer avant une mise en production visible par les clients — [src/App.jsx](src/App.jsx).

---

## Ce que l'API doit renvoyer

Un seul endpoint est appelé : `GET {apiUrl}/livraisons/en-attente`

```json
{
  "data": [
    {
      "id": 42,
      "reference": "FA-2026-0042",
      "client_nom": "SARL Dupont",
      "date_creation": "2026-08-30 14:05:00",
      "statut": "pending",
      "articles_complets": 3,
      "articles_totaux": 5,
      "magasins": [
        { "id": 1, "nom": "Magasin Centre", "statut": "pending" }
      ]
    }
  ],
  "stats": { "en_attente": 12, "livrées": 34, "partielles": 2, "total": 48 },
  "pending_total": 12
}
```

Points d'attention :

- `date_creation` doit être une chaîne dont les caractères 11 à 16 sont l'heure (`"…  14:05  …"`) : l'écran fait un `substring(11, 16)`, il ne parse pas la date pour l'affichage.
- `statut` vaut `"pending"`, `"partial"` ou `"delivered"`. Un magasin dont le `statut` est `delivered` n'apparaît plus dans sa colonne.
- Une facture **disparue de la réponse** est considérée comme livrée : c'est ce qui déclenche l'animation, les confettis et l'annonce vocale.
- L'API doit autoriser le CORS depuis le domaine de l'écran.

---

## Structure

```
src/
├─ App.jsx                    Assemblage de l'écran + toasts, voix, sons
├─ App.css                    Toute la mise en page kiosque (~550 lignes)
├─ components/
│  ├─ TopBar.jsx              Marque, pastille « En direct », horloge
│  ├─ CounterBar.jsx          Les 4 compteurs
│  ├─ InvoiceGrid.jsx         Colonnes par magasin, cartes, confettis
│  ├─ TickerBar.jsx           Bandeau défilant
│  └─ Toast.jsx               Notification livraison / nouvelle facture
└─ hooks/
   ├─ useQueryTenant.js       Tenant via ?tenant= → URL de l'API
   ├─ useLivraisons.js        Polling 5 s de l'API
   ├─ useInvoiceAnimation.js  Détecte apparitions/disparitions, retient 1,2 s les cartes qui sortent
   ├─ useDelayAlert.js        Marque les factures de plus de 20 min
   ├─ useSpeech.js            Annonce vocale
   └─ useSoundNotification.js Sons synthétisés
```

**Fichiers présents mais plus utilisés** (héritage des premières versions, à supprimer ou à réintégrer) : `src/api/livraisonsApi.js`, `src/hooks/useTenant.js` (détection par sous-domaine Vercel), `src/components/Sidebar.jsx`.

À noter : `VITE_API_URL` n'est lu que par `livraisonsApi.js`, qui n'est plus appelé. **Modifier `.env.local` ne change donc rien** — l'URL de l'API vient exclusivement de `useQueryTenant.js`.

---

## Déploiement

Site statique, aucun serveur Node requis. Sur Vercel :

- Build : `npm run build`
- Dossier de sortie : `dist`
- Ouvrir ensuite l'écran avec le bon tenant : `https://ecran-magasin.vercel.app/?tenant=ibp`

Sur l'écran du magasin, lancer le navigateur en mode kiosque et pointer sur cette URL.

> **Le son et la voix ne démarrent qu'après une première interaction** avec la page (clic ou touche) : les navigateurs bloquent l'audio automatique. Après un redémarrage de l'écran, pensez à cliquer une fois sur la page.

---

## Licence

Projet privé — usage interne.
