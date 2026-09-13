"use client";

import { useState, useEffect } from "react";
import CarroCard from "@/components/CarroCard";
import { supabase } from "@/lib/supabase";
import { Carro } from "@/types/car";
import FiltroMarca from "@/components/FiltroMarca";
import SeletorOrdenacao, { TipoOrdenacao } from "@/components/SeletorOrdenacao";

export default function Estoque() {
  const [busca, setBusca] = useState("");
  const [marcaFiltro, setMarcaFiltro] = useState("");
  const [ordenacao, setOrdenacao] = useState<TipoOrdenacao>("relevancia");
  const [carros, setCarros] = useState<Carro[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarCarros() {
      const { data, error } = await supabase
        .from("carros")
        .select("*");

      if (error) {
        console.error("Erro ao buscar carros:", error);
      } else if (data) {
        setCarros(data as Carro[]);
      }

      setCarregando(false);
    }

    buscarCarros();
  }, []);

  const carrosFiltradosPorMarca = marcaFiltro
    ? carros.filter((carro) => carro.marca === marcaFiltro)
    : carros;

  const carrosOrdenados = [...carrosFiltradosPorMarca].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "vendido" ? 1 : -1;
    }

    switch (ordenacao) {
      case "menor_preco":
        return a.preco - b.preco;
      case "maior_preco":
        return b.preco - a.preco;
      case "ano_recente":
        return b.ano_modelo - a.ano_modelo;
      case "menor_km":
        return a.km - b.km;
      default:
        return 0;
    }
  });

  const termo = busca.trim().toLowerCase();

  const textoCompleto = (carro: Carro) =>
    (carro.marca + " " + carro.modelo + " " + carro.versao).toLowerCase();

  const resultadosExatos = carrosOrdenados.filter((carro) =>
    textoCompleto(carro).includes(termo)
  );

  const palavras = termo.split(" ").filter((p) => p.length > 0);

  const resultadosSemelhantes = carrosOrdenados.filter((carro) => {
    if (resultadosExatos.includes(carro)) return false;
    return palavras.some((palavra) => textoCompleto(carro).includes(palavra));
  });

  const mostrarSemelhantes = termo !== "" && resultadosExatos.length === 0;

  const totalDisponiveis = carros.filter((carro) => carro.status === "disponivel").length;

  if (carregando) {
    return (
      <main className="max-w-6xl mx-auto p-6">
        <p className="text-gray-500">Carregando carros...</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Nosso Estoque</h1>
      <p className="text-gray-600 mb-6">
        {totalDisponiveis} veículo{totalDisponiveis !== 1 ? "s" : ""} disponível{totalDisponiveis !== 1 ? "eis" : ""} no momento
      </p>

      <FiltroMarca marcaSelecionada={marcaFiltro} onSelecionar={setMarcaFiltro} />

      <div className="flex flex-col sm:flex-row gap-3 mt-6 mb-8">
        <input
          type="text"
          placeholder="Buscar por marca, modelo ou versão..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-3 text-lg"
        />

        <SeletorOrdenacao valor={ordenacao} onSelecionar={setOrdenacao} />
      </div>

      {termo === "" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {carrosOrdenados.map((carro) => (
            <CarroCard key={carro.id} carro={carro} />
          ))}
        </div>
      )}

      {termo !== "" && resultadosExatos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resultadosExatos.map((carro) => (
            <CarroCard key={carro.id} carro={carro} />
          ))}
        </div>
      )}

      {mostrarSemelhantes && resultadosSemelhantes.length > 0 && (
        <div>
          <p className="text-gray-600 mb-4">
            Não encontramos exatamente o que você buscou, mas talvez você goste destes:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resultadosSemelhantes.map((carro) => (
              <CarroCard key={carro.id} carro={carro} />
            ))}
          </div>
        </div>
      )}

      {mostrarSemelhantes && resultadosSemelhantes.length === 0 && (
        <p className="text-gray-600">
          Nenhum carro encontrado para essa busca no momento.
        </p>
      )}
    </main>
  );
}