import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Financiamento de veículos em Salvador",
  description: "Financie seu carro com a MALU Veículos. Comparamos as taxas de 8 bancos parceiros para encontrar a melhor condição para o seu perfil.",
  alternates: { canonical: "/financie" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
