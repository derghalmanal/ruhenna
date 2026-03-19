## RUHENNA — Documentation rapide (FR)

Ce dépôt contient l’application web RUHENNA (Next.js) + une base PostgreSQL (via Prisma) + un stockage d’images Cloudinary.

### Prérequis
- Node.js + npm
- Une base PostgreSQL (localement ou via Neon)
- Un compte Cloudinary (pour l’upload d’images)

### Variables d’environnement (exemple)
Créer un fichier `.env` à la racine (ne jamais le publier) :
- `DATABASE_URL=...` (PostgreSQL — Neon en production)
- `ADMIN_USER=...`
- `ADMIN_PASS=...`
- `CLOUDINARY_CLOUD_NAME=...`
- `CLOUDINARY_API_KEY=...`
- `CLOUDINARY_API_SECRET=...`

### Lancer en local
```bash
npm install
npm run dev
```
Puis ouvrir `http://localhost:3000`.

### Base de données (Prisma)
```bash
npx prisma generate
npx prisma migrate dev
```

### Déploiement Vercel (résumé)
1) Créer un projet sur Vercel et connecter le dépôt.
2) Renseigner les variables d’environnement (`DATABASE_URL`, Cloudinary, admin).
3) Créer/brancher une base PostgreSQL Neon et copier l’URL dans `DATABASE_URL`.
4) Déployer.

