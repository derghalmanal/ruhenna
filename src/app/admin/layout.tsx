/**
 * Layout de l’espace administration (route `/admin/*`).
 *
 * Rôle : encapsuler toutes les pages admin dans une UI commune (sidebar, header…)
 * via `AdminLayoutClient`.
 */
import { AdminLayoutClient } from "./AdminLayoutClient";

export const metadata = { title: "Administration" };

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
