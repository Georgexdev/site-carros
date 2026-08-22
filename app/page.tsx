import CarroCard from "@/components/CarroCard";
import { Carro } from "@/types/car";

const carrosMock: Carro[] = [
  {
    id: "1",
    marca: "Toyota",
    modelo: "Corolla",
    versao: "Altis Hybrid",
    anoFabricacao: 2023,
    anoModelo: 2024,
    preco: 155900,
    km: 12000,
    imagem: "https://placehold.co/600x400?text=Corolla",
    status: "disponivel",
  },
  {
    id: "2",
    marca: "Honda",
    modelo: "Civic",
    versao: "Touring",
    anoFabricacao: 2022,
    anoModelo: 2023,
    preco: 142500,
    km: 25000,
    imagem: "https://placehold.co/600x400?text=Civic",
    status: "vendido",
  },
];

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Carros Disponíveis</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {carrosMock.map((carro) => (
          <CarroCard key={carro.id} carro={carro} />
        ))}
      </div>
    </main>
  );
}