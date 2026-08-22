import { Carro } from "@/types/car";

type Props = {
    carro: carro;
};

export default function CarroCard({ carro }: Props) {
    const vendido = carro.status === "vendido";

    return (
        <div className="relative border rounded-lg overflow-hidden shadow-md bg-white">
            {vendido && (
                <div className="absolute top-4 left-0 bg-red-600 text-white font-bold px-4 py-1 z-10 rotate-[-20deg] -translate-x-2">
                    VENDIDO
                </div>
            )}

            <img
                src={carro.imagem}
                alt={carro.marca + "  " + carro.modelo}
                className={"w-full h-48 object-cover " + (vendido ? "grayscale opacity-70" : "")}
        />

        <div className="p-4">
            <h2 className="text-lg font-bold">
                {carro.marca} {carro.modelo}
            </h2>
            <p className="text-gray-600">{carro.versao}</p>
            <p className="text-sm text-gray-500">
                {carro.anoFabricacao}/{carro.anoModelo} • {carro.km.toLocaleString("pt-BR")} km
                </p>
                <p className="text-xl font-semibold mt-2">
                    {carro.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL"})}
                </p>
            </div>
        </div>
    );
}