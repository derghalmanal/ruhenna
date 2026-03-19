/**
 * Page Réservation (route `/reservation`).
 *
 * Rôle : charger les services actifs en base (server component) puis déléguer
 * l’expérience interactive au composant client `ReservationClient`.
 */
import prisma from "@/lib/prisma";
import ReservationClient from "./ReservationClient";

export const dynamic = "force-dynamic";

export default async function ReservationPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      duration: true,
      price: true,
      slug: true,
      description: true,
      availabilities: {
        select: {
          dayOfWeek: true,
          startDate: true,
          endDate: true,
          startTime: true,
          endTime: true,
        },
      },
    },
  });

  const servicesForClient = services.map((s: any) => ({
    id: s.id,
    name: s.name,
    duration: s.duration,
    price: Number(s.price),
    description: s.description ?? "",
    availabilities: s.availabilities.map((a: any) => ({
      dayOfWeek: a.dayOfWeek,
      startDate: a.startDate ? a.startDate.toISOString().slice(0, 10) : null,
      endDate: a.endDate ? a.endDate.toISOString().slice(0, 10) : null,
      startTime: a.startTime,
      endTime: a.endTime,
    })),
  }));

  return (
    <main>
      <ReservationClient services={servicesForClient} />
    </main>
  );
}
