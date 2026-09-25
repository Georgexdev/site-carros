"use client";

import { useState, useEffect } from "react";
import CarroCard from "@/components/CarroCard";
import { supabase } from "@/lib/supabase";
import { EMPRESA_ID } from "@/lib/empresa";
import { Carro } from "@/types/car";
import FiltroMarca from "@/components/FiltroMarca";
import { TipoOrdenacao } from "@/components/SeletorOrdenacao";
import BarraBusca from "@/components/BarraBusca";
import GradeCarrosCarregando from "@/components/GradeCarrosCarregando";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useLoja } from "@/components/LojaProvider";

export default function Estoque() {
  const { linkWhatsApp } = useLoja();
  const [busca, setBusca] = useState("");
  const [marcaFiltro, setMarcaFiltro] = useState("");
  const [ordenacao, setOrdenacao] = useState<TipoOrdenacao>("relevancia");
  const [carros, setCarros] = useState<Carro[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarCarros() {
      let consulta = supabase.from("carros").select("*");
      if (EMPRESA_ID) consulta = consulta.eq("empresa_id", EMPRESA_ID);

      const { data, error } = await consulta;

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
      case "ano_antigo":
        return a.ano_modelo - b.ano_modelo;
      case "menor_km":
        return a.km - b.km;
      case "maior_km":
        return b.km - a.km;
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

  const grade = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8";

  return (
    <div className="max-w-6xl mx-auto px-6 pt-10 md:pt-14 pb-16 md:pb-24 flex flex-col gap-7">
      <nav aria-label="Você está em" className="text-[13px] text-muted flex gap-2">
        <Link href="/" className="hover:text-gold-text">Início</Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink font-semibold" aria-current="page">Estoque</span>
      </nav>

      <div className="flex flex-col gap-2">
        <h1 className="font-display text-4xl md:text-[52px] leading-tight text-ink">Nosso estoque</h1>
        {!carregando && (
          <p className="text-muted">
            {totalDisponiveis} veículo{totalDisponiveis !== 1 ? "s" : ""} disponíve{totalDisponiveis !== 1 ? "is" : "l"} no momento
          </p>
        )}
      </div>

      {carregando ? (
        <GradeCarrosCarregando quantidade={6} />
      ) : (
        <>
          <BarraBusca busca={busca} onBuscar={setBusca} ordenacao={ordenacao} onOrdenar={setOrdenacao} />

          <FiltroMarca marcaSelecionada={marcaFiltro} onSelecionar={setMarcaFiltro} carros={carros} />

          {termo === "" && carrosOrdenados.length > 0 && (
            <div className={grade}>
              {carrosOrdenados.map((carro) => (
                <CarroCard key={carro.id} carro={carro} />
              ))}
            </div>
          )}

          {termo === "" && carrosOrdenados.length === 0 && (
            <p className="text-muted">Nenhum veículo disponível no momento.</p>
          )}

          {termo !== "" && resultadosExatos.length > 0 && (
            <div className={grade}>
              {resultadosExatos.map((carro) => (
                <CarroCard key={carro.id} carro={carro} />
              ))}
            </div>
          )}

          {mostrarSemelhantes && resultadosSemelhantes.length > 0 && (
            <div>
              <p className="text-muted mb-4">
                Não encontramos exatamente o que você buscou, mas talvez você goste destes:
              </p>
              <div className={grade}>
                {resultadosSemelhantes.map((carro) => (
                  <CarroCard key={carro.id} carro={carro} />
                ))}
              </div>
            </div>
          )}

          {mostrarSemelhantes && resultadosSemelhantes.length === 0 && (
            <p className="text-muted">Nenhum carro encontrado para essa busca no momento.</p>
          )}
        </>
      )}

      <div className="mt-4 p-6 md:p-10 rounded-2xl bg-malu-black flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex flex-col gap-1.5">
          <strong className="font-display font-normal text-2xl md:text-[26px] text-[#F4EEE2]">Não encontrou o carro que procura?</strong>
          <span className="text-[15px] text-muted-dark">Conte pra gente o modelo e avisamos quando chegar.</span>
        </div>
        <a
          href={linkWhatsApp("Olá! Estou procurando um carro que não encontrei no estoque do site.")}
          target="_blank"
          rel="noopener noreferrer"
          data-esconde-whats-flutuante
          className="h-13 min-h-[52px] px-6 flex items-center justify-center gap-2.5 rounded-xl bg-whatsapp hover:bg-whatsapp-hover text-white font-bold transition-colors shrink-0"
        >
          <MessageCircle size={18} aria-hidden="true" />
          Falar no WhatsApp
        </a>
      </div>
    </div>
  );
}
