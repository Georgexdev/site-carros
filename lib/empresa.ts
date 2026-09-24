import { supabase } from "@/lib/supabase";

// Qual empresa este site representa.
// Configure NEXT_PUBLIC_EMPRESA_ID no .env.local e na Vercel com o "id" da
// empresa na tabela "empresas" do Supabase. Cada cliente terá o seu.
export const EMPRESA_ID = process.env.NEXT_PUBLIC_EMPRESA_ID ?? "";

// Enquanto EMPRESA_ID não estiver configurado, o site continua funcionando
// como antes (buscando a empresa pelo nome antigo), para não quebrar nada.
const NOME_EMPRESA_ANTIGO = "Concessionária Teste";

if (!EMPRESA_ID) {
  console.warn("NEXT_PUBLIC_EMPRESA_ID não configurado: o site vai mostrar dados de todas as empresas.");
}

export async function buscarEmpresa(colunas: string) {
  const consulta = supabase.from("empresas").select(colunas);

  const { data } = EMPRESA_ID
    ? await consulta.eq("id", EMPRESA_ID).single()
    : await consulta.eq("nome", NOME_EMPRESA_ANTIGO).single();

  return data as Record<string, string | null> | null;
}
