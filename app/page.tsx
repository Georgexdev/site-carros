import CarroCard from "@/components/CarroCard";
import { carrosMock } from "@/data/carros";

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