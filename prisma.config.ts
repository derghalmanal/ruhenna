/**
 * Configuration Prisma (migrations/seed).
 *
 * Rôle : indiquer à Prisma où se trouve le schéma, où écrire les migrations,
 * comment lancer le seed, et quelle variable d’environnement contient l’URL DB.
 */
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: `tsx prisma/seed.ts`, 
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});