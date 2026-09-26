import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Imagem que aparece ao compartilhar o site (WhatsApp, Facebook) e que o Google
// pode usar como miniatura. Endereço: /imagem-compartilhar (usada no app/layout.tsx).
// As páginas de carro usam a foto do próprio carro no lugar desta.
const size = { width: 1200, height: 630 };

export const dynamic = "force-static";

export async function GET() {
  const marcellus = await readFile(
    join(process.cwd(), "node_modules/@fontsource/marcellus/files/marcellus-latin-400-normal.woff")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0B0B0B",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid rgba(184,160,112,0.35)",
        }}
      >
        <svg width="150" height="150" viewBox="0 0 64 64">
          <rect width="64" height="64" rx="14" fill="#161513" />
          <path d="M15 46V19l17 20 17-20v27" fill="none" stroke="#B8A070" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ fontFamily: "Marcellus", fontSize: 120, color: "#D9C9A0", letterSpacing: 12, marginTop: 30 }}>MALU</div>
        <div style={{ fontSize: 26, color: "#B8A070", letterSpacing: 10, marginTop: 6 }}>VEÍCULOS E FINANCIAMENTOS</div>
        <div style={{ width: 90, height: 2, background: "#B8A070", marginTop: 40, marginBottom: 34 }} />
        <div style={{ fontSize: 34, color: "#BDB4A3" }}>Carros seminovos em Salvador · Financiamento facilitado</div>
      </div>
    ),
    { ...size, fonts: [{ name: "Marcellus", data: marcellus, style: "normal", weight: 400 }] }
  );
}
