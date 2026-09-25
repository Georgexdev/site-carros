import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estoque de carros seminovos em Salvador",
  description: "Veja todos os carros disponíveis na MALU Veículos, em Salvador-BA. Filtre por marca, compare preços e fale com a gente pelo WhatsApp.",
  alternates: { canonical: "/estoque" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
