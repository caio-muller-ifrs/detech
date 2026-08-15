import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Detech · Gestão de idosos",
  description: "Gestão humanizada para lares e cuidadores independentes"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
