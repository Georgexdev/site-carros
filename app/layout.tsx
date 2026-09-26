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
import { SITE_URL } from "@/lib/site";
import { dadosDaLoja, dadosDoSite, paraScript } from "@/lib/dadosEstruturados";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MALU Veículos e Financiamentos | Carros seminovos em Salvador",
    // Nas outras páginas: "Estoque | MALU Veículos"
    template: "%s | MALU Veículos",
  },
  description:
    "Carros seminovos em Salvador-BA com financiamento facilitado em 8 bancos parceiros. Veja o estoque, simule seu financiamento e fale com a MALU Veículos pelo WhatsApp.",
  keywords: [
    "carros seminovos Salvador",
    "carros usados Salvador",
    "loja de carros Salvador",
    "financiamento de veículos Salvador",
    "MALU Veículos",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "MALU Veículos e Financiamentos",
    title: "MALU Veículos e Financiamentos | Carros seminovos em Salvador",
    description: "Veja o estoque, simule seu financiamento e fale com a gente pelo WhatsApp.",
    url: "/",
  },
  // Código de verificação do Google Search Console (configure NEXT_PUBLIC_GOOGLE_VERIFICATION na Vercel).
  verification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION }
    : undefined,
};

// As páginas buscam os dados da loja no banco de novo a cada 60 segundos.
// Assim, o que for alterado no painel aparece no site sem precisar de novo deploy.
export const revalidate = 60;

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: paraScript(dadosDaLoja(loja)) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: paraScript(dadosDoSite(loja)) }}
        />
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
