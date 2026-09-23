import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import BotaoWhatsAppFlutuante from "@/components/BotaoWhatsAppFlutuante";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MALU Veículos e Financiamentos",
  description: "Confira nosso estoque de veículos, simule seu financiamento e fale direto com nossa equipe pelo WhatsApp.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { data: empresa } = await supabase
    .from("empresas")
    .select("nome, logo_url, cor_primaria, cor_secundaria")
    .eq("nome", "Concessionária Teste")
    .single();

  const corPrimaria = empresa?.cor_primaria || "#B8A271";
  const corSecundaria = empresa?.cor_secundaria || "#000000";

  const variaveisDeCor = {
    "--cor-primaria": corPrimaria,
    "--cor-secundaria": corSecundaria,
  } as CSSProperties;

  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={variaveisDeCor}
    >
      <body className="min-h-full flex flex-col">
        <Header nomeEmpresa={empresa?.nome} logoUrl={empresa?.logo_url} />
        <main className="flex-1">{children}</main>
        <Footer nomeEmpresa={empresa?.nome} />
        <BotaoWhatsAppFlutuante />
      </body>
    </html>
  );
}