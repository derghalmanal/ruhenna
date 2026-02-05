import { AdminLayoutClient } from "./AdminLayoutClient";

export const metadata = { title: "Administration" };

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
