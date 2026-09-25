import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { EMPRESA_ID } from "@/lib/empresa";
import { SITE_URL } from "@/lib/site";

// O mapa do site é refeito a cada 1 hora, para incluir os carros novos.
export const revalidate = 3600;

// Lista de páginas que o Google deve conhecer, incluindo cada carro disponível.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paginas: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: SITE_URL + "/estoque", changeFrequency: "daily", priority: 0.9 },
    { url: SITE_URL + "/financie", changeFrequency: "monthly", priority: 0.7 },
    { url: SITE_URL + "/vender", changeFrequency: "monthly", priority: 0.7 },
    { url: SITE_URL + "/sobre", changeFrequency: "monthly", priority: 0.6 },
    { url: SITE_URL + "/termos", changeFrequency: "yearly", priority: 0.2 },
  ];

  let consulta = supabase.from("carros").select("id, criado_em").eq("status", "disponivel");
  if (EMPRESA_ID) consulta = consulta.eq("empresa_id", EMPRESA_ID);
  const { data: carros } = await consulta;

  (carros || []).forEach((carro) => {
    paginas.push({
      url: SITE_URL + "/carro/" + carro.id,
      lastModified: carro.criado_em ? new Date(carro.criado_em) : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  return paginas;
}
