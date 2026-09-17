import { supabase } from "@/lib/supabase";

export default async function Sobre() {
  const { data: empresa } = await supabase
    .from("empresas")
    .select("nome, sobre")
    .eq("nome", "Concessionária Teste")
    .single();

  const textoSobre = empresa?.sobre || "Em breve, mais informações sobre nossa empresa.";

  return (
    <main className="max-w-3xl mx-auto p-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Sobre Nós</h1>

      <div className="prose text-gray-700 leading-relaxed whitespace-pre-line">
        {textoSobre}
      </div>
    </main>
  );
}