import { carrosMock } from "@/data/carros";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DetalhesCarro({ params }: Props) {
  const { id } = await params;
  const carro = carrosMock.find((c) => c.id === id);

    if (!carro) {
        notFound();
    }

    const vendido = carro.status === "vendido";

    return (
        <main className="max-w-4x1 mx-auto p-6">
        <Link href="/" className="text-blue-600 hover:underline">
           ← Voltar para todos os carros 
        </Link>
        
        <div className="mt-4 border rounded-lg overflow-hidden shadow-md bg-white">
            <div className="relative">
                {vendido && (
                    <div className="bsolute top-4 left-0 bg-red-600 text-white font-bold px-4 py-1 z-10 rotate-[-20deg] -translate-x-2">
                        VENDIDO
                    </div>
                )}
                <img 
            src={carro.imagem}
            alt={carro.marca + " " + carro.modelo}
            className={"w-full h-80 object-cover " + (vendido ? "grayscale opacity-70" : "")}
          />
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold">
            {carro.marca} {carro.modelo}
          </h1>
          <p className="text-gray-600 text-lg">{carro.versao}</p>

          <div className="grid grid-cols-2 gap-4 mt-4 text-gray-700">
            <p>Ano: {carro.anoFabricacao}/{carro.anoModelo}</p>
            <p>KM: {carro.km.toLocaleString("pt-BR")} km</p>
            <p>Combustível: {carro.combustivel}</p>
            <p>Câmbio: {carro.cambio}</p>
            <p>Cor: {carro.cor}</p>
          </div>

          <p className="text-3xl font-bold mt-6">
            {carro.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
        </div>
      </div>
    </main>
  );
}
