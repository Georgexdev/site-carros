"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Repeat } from "lucide-react";
import CarroCard from "@/components/CarroCard";
import { supabase } from "@/lib/supabase";
import { EMPRESA_ID } from "@/lib/empresa";
import { Carro } from "@/types/car";
import FiltroMarca from "@/components/FiltroMarca";
import BannerCarrossel from "@/components/BannerCarrossel";
import HeroInicio from "@/components/HeroInicio";
import Diferenciais from "@/components/Diferenciais";
import BarraBusca from "@/components/BarraBusca";
import GradeCarrosCarregando from "@/components/GradeCarrosCarregando";
import { TipoOrdenacao } from "@/components/SeletorOrdenacao";
import { bancosParceiros } from "@/data/bancos";

export default function Home() {
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

  const filtroAtivo = termo !== "" || marcaFiltro !== "";

  const grade = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8";

  return (
    <div>
      <BannerCarrossel semBanners={<HeroInicio />} />

      <Diferenciais />

      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <span className="text-xs md:text-[13px] font-bold tracking-[0.28em] uppercase text-gold-text">Estoque</span>
            <h2 className="font-display text-4xl md:text-[44px] leading-tight text-ink">Carros disponíveis</h2>
          </div>
          <Link
            href="/estoque"
            className="flex items-center gap-2 w-fit text-[15px] font-bold text-ink border-b-2 border-gold pb-1 hover:text-gold-text transition-colors"
          >
            Ver todo o estoque
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {carregando ? (
          <GradeCarrosCarregando quantidade={3} />
        ) : (
          <>
            <FiltroMarca marcaSelecionada={marcaFiltro} onSelecionar={setMarcaFiltro} carros={carros} />

            <BarraBusca busca={busca} onBuscar={setBusca} ordenacao={ordenacao} onOrdenar={setOrdenacao} />

            {!filtroAtivo && (
              <>
                <div className={grade}>
                  {carrosOrdenados.filter((carro) => carro.destaque_home).map((carro) => (
                    <CarroCard key={carro.id} carro={carro} />
                  ))}
                </div>

                <div className="text-center mt-2">
                  <Link
                    href="/estoque"
                    className="inline-flex items-center gap-2 h-13 min-h-[52px] px-8 rounded-xl bg-malu-black text-gold-light hover:bg-gold hover:text-malu-black font-bold transition-colors"
                  >
                    Ver todos os nossos veículos
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </div>
              </>
            )}

            {filtroAtivo && resultadosExatos.length > 0 && (
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

            {filtroAtivo && !mostrarSemelhantes && resultadosExatos.length === 0 && (
              <p className="text-muted">Nenhum carro dessa marca disponível no momento.</p>
            )}
          </>
        )}
      </section>

      <section className="bg-malu-black">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="flex flex-col gap-5">
            <span className="text-xs md:text-[13px] font-bold tracking-[0.28em] uppercase text-gold">Financiamento</span>
            <h2 className="font-display text-4xl md:text-[44px] leading-tight text-[#F4EEE2]">Financie seu próximo carro</h2>
            <p className="text-base md:text-[17px] leading-relaxed text-muted-dark">
              Nossos consultores avaliam qual é a melhor taxa de juros para o seu perfil e te chamam no WhatsApp com a proposta.
            </p>
            <Link
              href="/financie"
              className="w-fit mt-2 h-14 px-7 flex items-center rounded-xl bg-gold hover:bg-gold-light text-malu-black font-bold transition-colors"
            >
              Solicitar análise
            </Link>
          </div>

          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3" aria-label="Bancos parceiros">
            {bancosParceiros.map((banco) => (
              <li
                key={banco.nome}
                className="group h-20 rounded-xl bg-white/[0.04] border border-gold/20 flex items-center justify-center p-3"
              >
                <span className="bg-white rounded-lg w-full h-full flex items-center justify-center px-2">
                  <img
                    src={banco.logo}
                    alt={banco.nome}
                    className="max-h-8 max-w-full object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="rounded-3xl bg-white border border-line overflow-hidden grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 md:p-12 flex flex-col gap-4 justify-center">
            <span className="text-xs md:text-[13px] font-bold tracking-[0.28em] uppercase text-gold-text">Venda ou troca</span>
            <h2 className="font-display text-3xl md:text-4xl leading-tight text-ink">Quer vender ou trocar seu carro?</h2>
            <p className="text-base leading-relaxed text-muted">
              Mande os dados do seu veículo e receba uma proposta da nossa equipe pelo WhatsApp.
            </p>
            <Link
              href="/vender"
              className="w-fit mt-2 h-12 px-6 flex items-center rounded-xl bg-malu-black text-gold-light hover:bg-gold hover:text-malu-black font-bold transition-colors"
            >
              Avaliar meu carro
            </Link>
          </div>
          <div className="hidden md:flex bg-malu-surface items-center justify-center min-h-[280px]">
            <Repeat size={110} strokeWidth={0.7} className="text-gold/60" aria-hidden="true" />
          </div>
        </div>
      </section>
    </div>
  );
}
