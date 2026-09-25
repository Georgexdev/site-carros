import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Venda ou troque seu carro",
  description: "Quer vender ou trocar seu carro em Salvador? Mande os dados do veículo e receba uma proposta da MALU Veículos pelo WhatsApp.",
  alternates: { canonical: "/vender" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
