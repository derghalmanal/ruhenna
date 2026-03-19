/**
 * Accès base de données (Prisma).
 *
 * Rôle : exposer une instance unique de PrismaClient, avec l’adaptateur PostgreSQL,
 * afin d’éviter d’ouvrir trop de connexions en développement (hot-reload) et de
 * centraliser l’accès DB dans tout le projet.
 */
import { PrismaClient } from "@prisma/client"; 
import { PrismaPg } from "@prisma/adapter-pg"; 
const globalForPrisma = global as unknown as {
  prisma: PrismaClient; 
}; 
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL, 
}); 
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter, 
  }); 
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma; 
export default prisma; 