import { supabase } from "@/lib/supabase";
import { Carro } from "@/types/car";
import Link from "next/link";
import { notFound } from "next/navigation";

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
  const imagemTemporaria = "https://placehold.co/600x400?text=" + carroTipado.modelo;

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
          <img
            src={imagemTemporaria}
            alt={carroTipado.marca + " " + carroTipado.modelo}
            className={"w-full h-80 object-cover " + (vendido ? "grayscale opacity-70" : "")}
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