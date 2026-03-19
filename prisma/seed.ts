/**
 * Seed Prisma (données initiales).
 *
 * Rôle : créer (ou mettre à jour) un jeu de données de départ pour le développement
 * et les démonstrations : catégories, produits, services, etc.
 *
 * Important : le seed est idempotent autant que possible via `upsert`
 * (rejouable sans dupliquer).
 */
import prisma from "@/lib/prisma";

async function main() {
  console.log("Seeding database...");

  const categories = [
    { slug: "cones", label: "Cônes de Henné", sortOrder: 0 },
    { slug: "coffrets", label: "Coffrets", sortOrder: 1 },
    { slug: "poudres", label: "Poudres", sortOrder: 2 },
    { slug: "soins", label: "Soins", sortOrder: 3 },
    { slug: "accessoires", label: "Accessoires", sortOrder: 4 },
    { slug: "kits", label: "Kits", sortOrder: 5 },
  ];
  // Catégories produits : upsert pour rejouer le seed sans doublons.
  for (const c of categories) {
    await prisma.productCategory.upsert({
      where: { slug: c.slug },
      update: { label: c.label, sortOrder: c.sortOrder },
      create: c,
    });
  }

  const products = [
    { name: "Cône Henné Naturel – Qualité Premium", slug: "cone-henne-naturel-premium", description: "Cône de henné naturel de qualité premium, idéal pour des motifs fins et détaillés. Formule douce enrichie en huiles essentielles pour une couleur intense et longue tenue.", price: 5.99, category: "cones"},
    { name: "Cône Henné Noir Jagua", slug: "cone-henne-noir-jagua", description: "Cône de henné noir à base de jagua pour un résultat sombre et contrasté.", price: 7.99, category: "cones" },
    { name: "Lot de 6 Cônes Henné Assorti", slug: "lot-6-cones-assortis", description: "Assortiment de 6 cônes : 3 naturels + 3 noirs.", price: 29.99, compareAtPrice: 35.94, category: "cones"},
    { name: "Coffret Mariée – Henné & Soins", slug: "coffret-mariee-henne-soins", description: "Coffret luxueux spécialement conçu pour les futures mariées. Contient 4 cônes premium, huile de soin post-henné, pochoirs exclusifs.", price: 49.99, category: "coffrets"},
    { name: "Coffret Découverte Henné", slug: "coffret-decouverte-henne", description: "Le coffret idéal pour débuter dans l'art du henné.", price: 24.99, category: "coffrets" },
    { name: "Coffret Cadeau Prestige", slug: "coffret-cadeau-prestige", description: "Un cadeau d'exception dans un écrin doré.", price: 69.99, category: "coffrets" },
    { name: "Poudre de Henné Bio – 100g", slug: "poudre-henne-bio-100g", description: "Poudre de henné biologique certifiée, origine Rajasthan.", price: 12.99, category: "poudres" },
    { name: "Poudre Indigo Naturelle – 100g", slug: "poudre-indigo-naturelle-100g", description: "Poudre d'indigo pure pour obtenir des teintes noires à bleutées.", price: 14.99, category: "poudres" },
    { name: "Huile de Soin Post-Henné", slug: "huile-soin-post-henne", description: "Huile nourrissante à base d'argan et d'eucalyptus.", price: 9.99, category: "soins" },
    { name: "Baume Fixateur de Henné", slug: "baume-fixateur-henne", description: "Baume naturel pour intensifier la couleur du henné.", price: 8.49, category: "soins" },
    { name: "Set d'Applicateurs Professionnels", slug: "set-applicateurs-professionnels", description: "Ensemble de 5 applicateurs à pointe fine de différentes tailles.", price: 15.99, category: "accessoires" },
    { name: "Pochoirs Henné – Collection Florale", slug: "pochoirs-collection-florale", description: "20 pochoirs réutilisables avec des motifs floraux et arabesques.", price: 11.99, category: "accessoires" },
    { name: "Kit Complet Professionnel", slug: "kit-complet-professionnel", description: "Tout le nécessaire du professionnel : cônes, applicateurs, pochoirs, huile de soin et mallette.", price: 89.99, compareAtPrice: 110.00, category: "kits"},
    { name: "Kit Initiation – Mon Premier Henné", slug: "kit-initiation-premier-henne", description: "Kit spécialement conçu pour les débutants.", price: 19.99, category: "kits" },
  ];

  // Produits : on crée les fiches (images vides par défaut).
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        category: p.category,
        images: [],
        active: true,
      },
    });
  }

  const services = [
    { name: "Henné Mains Simple", slug: "henne-mains-simple", description: "Motif simple et élégant sur le dos de la main ou la paume.", duration: 30, price: 25.00 },
    { name: "Henné Mains Complet", slug: "henne-mains-complet", description: "Design élaboré couvrant les deux mains.", duration: 60, price: 50.00 },
    { name: "Henné Mariée", slug: "henne-mariee", description: "Prestation complète pour la mariée : mains et avant-bras.", duration: 120, price: 150.00 },
    { name: "Henné Pieds", slug: "henne-pieds", description: "Motifs raffinés sur les pieds et chevilles.", duration: 45, price: 35.00 },
    { name: "Atelier Découverte Henné", slug: "atelier-decouverte-henne", description: "Apprenez les bases de l'art du henné lors d'un atelier convivial.", duration: 90, price: 40.00 },
  ];

  const createdServices: { id: string; name: string }[] = [];
  for (const s of services) {
    const svc = await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: { ...s, active: true },
    });
    createdServices.push({ id: svc.id, name: svc.name });
  }

  for (const svc of createdServices) {
    const existing = await prisma.serviceAvailability.findMany({ where: { serviceId: svc.id } });
    if (existing.length === 0) {
      if (svc.name.includes("Mariée")) {
        await prisma.serviceAvailability.create({
          data: { serviceId: svc.id, dayOfWeek: 6, startTime: "09:00", endTime: "18:00" },
        });
      } else if (svc.name.includes("Atelier")) {
        for (const day of [3, 6]) {
          await prisma.serviceAvailability.create({
            data: { serviceId: svc.id, dayOfWeek: day, startTime: "14:00", endTime: "18:00" },
          });
        }
      } else {
        for (const day of [1, 2, 3, 4, 5]) {
          await prisma.serviceAvailability.create({
            data: { serviceId: svc.id, dayOfWeek: day, startTime: "09:00", endTime: "18:00" },
          });
        }
        await prisma.serviceAvailability.create({
          data: { serviceId: svc.id, dayOfWeek: 6, startTime: "09:00", endTime: "14:00" },
        });
      }
    }
  }

  const posts = [
    { title: "Les bienfaits du henné naturel pour la peau", slug: "bienfaits-henne-naturel-peau", excerpt: "Découvrez pourquoi le henné naturel est bien plus qu'un simple ornement.", content: "<h2>Un art millénaire aux vertus insoupçonnées</h2><p>Le henné est utilisé depuis des millénaires.</p>", published: true, publishedAt: new Date("2026-01-15") },
    { title: "Guide complet : votre premier henné à la maison", slug: "guide-premier-henne-maison", excerpt: "Tout ce qu'il faut savoir pour réussir votre première application.", content: "<h2>Préparez votre espace</h2><p>Assurez-vous d'avoir un espace propre et bien éclairé.</p>", published: true, publishedAt: new Date("2026-02-01") },
    { title: "Tendances henné 2026 : motifs et styles", slug: "tendances-henne-2026", excerpt: "Les motifs qui feront sensation cette année.", content: "<h2>Le minimalisme géométrique</h2><p>La tendance est aux motifs épurés.</p>", published: true, publishedAt: new Date("2026-02-20") },
  ];
  for (const p of posts) {
    await prisma.blogPost.upsert({ where: { slug: p.slug }, update: {}, create: p });
  }

  const galleryCount = await prisma.galleryImage.count();
  if (galleryCount === 0) {
    const galleryData = [
      { title: "Motif floral traditionnel", description: "Design classique", featured: true, sortOrder: 0 },
      { title: "Henné mariée – mains complètes", description: "Prestation mariage", featured: true, sortOrder: 1 },
      { title: "Arabesques modernes", description: "Style contemporain et traditionnel", featured: false, sortOrder: 2 },
    ];
    for (const g of galleryData) {
      await prisma.galleryImage.create({ data: { ...g, imageUrl: "/assets/logo.png" } });
    }
  }

  if (createdServices.length > 0) {
    const aptCount = await prisma.appointment.count();
    if (aptCount === 0) {
      const now = new Date();
      const appointments = [
        { serviceId: createdServices[0].id, date: new Date(now.getFullYear(), now.getMonth(), 15), startTime: "10:00", endTime: "10:30", status: "CONFIRMED" as const, clientName: "Sarah Benali", clientEmail: "sarah@example.com", clientPhone: "06 12 34 56 78" },
        { serviceId: createdServices[1].id, date: new Date(now.getFullYear(), now.getMonth(), 16), startTime: "14:00", endTime: "15:00", status: "PENDING" as const, clientName: "Fatima Kaddouri", clientEmail: "fatima@example.com", clientPhone: "06 98 76 54 32" },
        { serviceId: createdServices[2].id, date: new Date(now.getFullYear(), now.getMonth(), 20), startTime: "09:00", endTime: "11:00", status: "PENDING" as const, clientName: "Amina Lahlou", clientEmail: "amina@example.com" },
      ];
      for (const apt of appointments) {
        try { await prisma.appointment.create({ data: apt }); } catch { /* unique constraint */ }
      }
    }
  }

  const msgCount = await prisma.contactMessage.count();
  if (msgCount === 0) {
    await prisma.contactMessage.createMany({
      data: [
        { senderName: "Marie Dupont", phone: "06 12 34 56 78", email: "marie@example.com", subject: "Disponibilité pour un mariage", message: "Bonjour, je souhaiterais savoir si vous êtes disponible pour un mariage le 15 juin." },
        { senderName: "Ahmed Ben Said", phone: "06 09 87 65 43", email: "ahmed@example.com", subject: "Question sur les cônes", message: "Bonjour, j'aimerais savoir la durée de conservation de vos cônes de henné." },
      ],
    });
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });