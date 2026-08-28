import { supabase } from "@/lib/supabase";
import { Carro, FotoCarro } from "@/types/car";
import Link from "next/link";
import { notFound } from "next/navigation";
import CarrosselFotos from "@/components/CarrosselFotos";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DetalhesCarro({ params }: Props) {
  const { id } = await params;

  const { data: carro, error } = await supabase
    .from("carros")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !carro) {
    notFound();
  }

  const carroTipado = carro as Carro;
  const vendido = carroTipado.status === "vendido";

  const { data: fotos } = await supabase
    .from("fotos_carros")
    .select("*")
    .eq("carro_id", id)
    .order("ordem", { ascending: true });

  const fotosTipadas = (fotos as FotoCarro[]) || [];
  const temFotos = fotosTipadas.length > 0;

  const fotosParaExibir = temFotos
    ? fotosTipadas
    : [{ id: "placeholder", carro_id: id, url: "https://placehold.co/600x400?text=" + carroTipado.modelo, ordem: 0 }];

  return (
    <main className="max-w-4xl mx-auto p-6">
      <Link href="/" className="text-blue-600 hover:underline">
        ← Voltar para todos os carros
      </Link>

      <div className="mt-4 border rounded-lg overflow-hidden shadow-md bg-white">
        <div className="relative">
          {vendido && (
            <div className="absolute top-4 left-0 bg-red-600 text-white font-bold px-4 py-1 z-10 rotate-[-20deg] -translate-x-2">
              VENDIDO
            </div>
          )}

          <CarrosselFotos
            fotos={fotosParaExibir}
            vendido={vendido}
            altText={carroTipado.marca + " " + carroTipado.modelo}
          />
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold">
            {carroTipado.marca} {carroTipado.modelo}
          </h1>
          <p className="text-gray-600 text-lg">{carroTipado.versao}</p>

          <div className="grid grid-cols-2 gap-4 mt-4 text-gray-700">
            <p>Ano: {carroTipado.ano_fabricacao}/{carroTipado.ano_modelo}</p>
            <p>KM: {carroTipado.km.toLocaleString("pt-BR")} km</p>
            <p>Combustível: {carroTipado.combustivel}</p>
            <p>Câmbio: {carroTipado.cambio}</p>
            <p>Cor: {carroTipado.cor}</p>
          </div>

          <p className="text-3xl font-bold mt-6">
            {carroTipado.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
        </div>
      </div>
    </main>
  );
}