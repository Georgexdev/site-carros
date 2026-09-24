import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import "@fontsource/marcellus/400.css";
import "@fontsource-variable/manrope";
import "./globals.css";
import Header from "@/components/Header";
import BotaoWhatsAppFlutuante from "@/components/BotaoWhatsAppFlutuante";
import Footer from "@/components/Footer";
import { buscarEmpresa } from "@/lib/empresa";
import { COLUNAS_LOJA, montarDadosLoja } from "@/lib/loja";
import LojaProvider from "@/components/LojaProvider";

export const metadata: Metadata = {
  title: "MALU Veículos e Financiamentos",
  description: "Confira nosso estoque de veículos, simule seu financiamento e fale direto com nossa equipe pelo WhatsApp.",
};

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const colunasBase = "nome, logo_url, cor_primaria, cor_secundaria";
  // Se as colunas novas ainda não existirem no banco, busca só as básicas.
  const empresa =
    (await buscarEmpresa(colunasBase + ", " + COLUNAS_LOJA)) ?? (await buscarEmpresa(colunasBase));
  const loja = montarDadosLoja(empresa);

  const corPrimaria = empresa?.cor_primaria || "#B8A070";
  const corSecundaria = empresa?.cor_secundaria || "#0B0B0B";

  const variaveisDeCor = {
    "--cor-primaria": corPrimaria,
    "--cor-secundaria": corSecundaria,
  } as CSSProperties;

  return (
    <html lang="pt-BR" className="h-full antialiased" style={variaveisDeCor}>
      <body className="min-h-full flex flex-col">
        <LojaProvider loja={loja}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <BotaoWhatsAppFlutuante />
        </LojaProvider>
      </body>
    </html>
  );
}
