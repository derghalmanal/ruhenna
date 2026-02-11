import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...\n");

  const hashedPassword = await hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: { name: "Administrateur", email: "admin@example.com", hashedPassword, role: "ADMIN" },
  });
  console.log("Admin user:", admin.email);

  const productsData = [
    { name: "Coffret Henné Traditionnel", slug: "coffret-henne-traditionnel", description: "Coffret cadeau contenant poudre de henné naturel et accessoires pour des motifs traditionnels.", price: new Decimal("49.90"), compareAtPrice: new Decimal("59.90"), stock: 25, isGiftOption: true, category: "Coffrets", images: ["/assets/logo.png"], featured: true },
    { name: "Poudre de Henné Maroc", slug: "poudre-henne-maroc", description: "Poudre de henné 100% naturelle importée du Maroc, teinte cuivrée intense.", price: new Decimal("34.90"), stock: 50, isGiftOption: false, category: "Poudres", images: ["/assets/logo.png"], featured: true },
    { name: "Kit Initiation Art du Henné", slug: "kit-initiation-art-henne", description: "Kit complet pour débuter : cônes, poudre, pochoirs et guide des motifs.", price: new Decimal("89.00"), compareAtPrice: new Decimal("99.00"), stock: 15, isGiftOption: true, category: "Kits", images: ["/assets/logo.png"], featured: false },
    { name: "Huile de Soin Post-Henné", slug: "huile-soin-post-henne", description: "Huile nourrissante pour prolonger l'éclat et la durée du henné.", price: new Decimal("28.50"), stock: 40, isGiftOption: false, category: "Soins", images: ["/assets/logo.png"], featured: false },
    { name: "Cône Décoratif Premium", slug: "cone-decoratif-premium", description: "Lot de 10 cônes professionnels pour un tracé précis des motifs.", price: new Decimal("14.90"), stock: 100, isGiftOption: false, category: "Accessoires", images: ["/assets/logo.png"], featured: false },
  ];
  for (const p of productsData) { await prisma.product.upsert({ where: { slug: p.slug }, update: {}, create: p }); }
  console.log("5 products created");

  const servicesData = [
    { name: "Décoration Mains", slug: "decoration-mains", description: "Motifs traditionnels sur les deux mains, style marocain.", duration: 30, price: new Decimal("40.00") },
    { name: "Mains et Avant-bras Complet", slug: "mains-avant-bras-complet", description: "Décoration complète des mains et avant-bras avec motifs personnalisés.", duration: 60, price: new Decimal("75.00") },
    { name: "Prestation Événementielle", slug: "prestation-evenementielle", description: "Session henné pour événements (mariages, fêtes) avec plusieurs modèles.", duration: 90, price: new Decimal("120.00") },
  ];
  for (const s of servicesData) { await prisma.service.upsert({ where: { slug: s.slug }, update: {}, create: s }); }
  console.log("3 services created");

  const galleryData = [
    { title: "Motifs traditionnels", imageUrl: "/assets/logo.png", sortOrder: 0 },
    { title: "Décoration mariage", imageUrl: "/assets/logo.png", sortOrder: 1 },
    { title: "Style marocain", imageUrl: "/assets/logo.png", sortOrder: 2 },
    { title: "Détails artistiques", imageUrl: "/assets/logo.png", sortOrder: 3 },
    { title: "Cérémonie henné", imageUrl: "/assets/logo.png", sortOrder: 4 },
    { title: "Créations artisanales", imageUrl: "/assets/logo.png", sortOrder: 5 },
  ];
  for (let i = 0; i < galleryData.length; i++) {
    const g = galleryData[i];
    await prisma.galleryImage.upsert({ where: { id: `gallery-seed-${i + 1}` }, update: {}, create: { id: `gallery-seed-${i + 1}`, title: g.title, imageUrl: g.imageUrl, sortOrder: g.sortOrder } });
  }
  console.log("6 gallery images created");

  const blogData = [
    { title: "Les traditions du henné à travers le Maghreb", slug: "traditions-henne-maghreb", excerpt: "Découvrez l'histoire et les coutumes du henné dans les pays du Maghreb.", content: "Contenu de l'article sur les traditions du henné..." },
    { title: "L'art du henné : motifs et significations", slug: "art-henne-motifs-significations", excerpt: "Une exploration des motifs traditionnels et de leur symbolique.", content: "Contenu de l'article sur les motifs et significations..." },
    { title: "Henné et mariage : une cérémonie ancestrale", slug: "henne-mariage-ceremonie-ancestrale", excerpt: "Le rôle du henné dans les célébrations de mariage traditionnelles.", content: "Contenu de l'article sur le henné et le mariage..." },
  ];
  for (const b of blogData) { await prisma.blogPost.upsert({ where: { slug: b.slug }, update: {}, create: { ...b, published: false } }); }
  console.log("3 blog posts created");

  console.log("\nSeed completed successfully!");
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
