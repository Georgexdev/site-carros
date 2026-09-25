"use client";

import { useState, useEffect, useRef } from "react";
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
import { limparTexto, nomeDoCarro } from "@/lib/texto";

const ORDENACOES: TipoOrdenacao[] = ["relevancia", "menor_preco", "maior_preco", "ano_recente", "ano_antigo", "menor_km", "maior_km"];

export default function Estoque() {
  const { linkWhatsApp } = useLoja();
  const [busca, setBusca] = useState("");
  const [marcaFiltro, setMarcaFiltro] = useState("");
  const [ordenacao, setOrdenacao] = useState<TipoOrdenacao>("relevancia");
  const [carros, setCarros] = useState<Carro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const urlLida = useRef(false);

  // Sempre que um filtro muda, atualiza o link. Assim dá para compartilhar ou voltar do carro sem perder a busca.
  useEffect(() => {
    if (!urlLida.current) return;
    const parametros = new URLSearchParams();
    if (busca.trim()) parametros.set("busca", busca.trim());
    if (marcaFiltro) parametros.set("marca", marcaFiltro);
    if (ordenacao !== "relevancia") parametros.set("ordem", ordenacao);
    const consulta = parametros.toString();
    window.history.replaceState(null, "", consulta ? "?" + consulta : window.location.pathname);
  }, [busca, marcaFiltro, ordenacao]);

  useEffect(() => {
    async function buscarCarros() {
      let consulta = supabase.from("carros").select("*");
      if (EMPRESA_ID) consulta = consulta.eq("empresa_id", EMPRESA_ID);

      // Mais novos primeiro: é a ordem "Mais recentes" do seletor.
      const { data, error } = await consulta.order("criado_em", { ascending: false });

      if (error) {
        console.error("Erro ao buscar carros:", error);
      } else if (data) {
        setCarros(data as Carro[]);
      }

      // Aplica os filtros que vieram no link (ex.: /estoque?marca=Toyota&busca=corolla).
      const parametros = new URLSearchParams(window.location.search);
      const ordemDaUrl = parametros.get("ordem") as TipoOrdenacao | null;
      setBusca(parametros.get("busca") || "");
      setMarcaFiltro(parametros.get("marca") || "");
      if (ordemDaUrl && ORDENACOES.includes(ordemDaUrl)) setOrdenacao(ordemDaUrl);
      urlLida.current = true;

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
        return b.ano_modelo - a.ano_modelo || b.ano_fabricacao - a.ano_fabricacao;
      case "ano_antigo":
        return a.ano_modelo - b.ano_modelo || a.ano_fabricacao - b.ano_fabricacao;
      case "menor_km":
        return a.km - b.km;
      case "maior_km":
        return b.km - a.km;
      default:
        return 0;
    }
  });

  const termo = limparTexto(busca).toLowerCase();

  const textoCompleto = (carro: Carro) =>
    nomeDoCarro(carro).toLowerCase();

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

  // O contador acompanha o que está na tela: busca e marca escolhida.
  const filtroAtivo = termo !== "" || marcaFiltro !== "";
  const carrosNaTela = termo === "" ? carrosOrdenados : mostrarSemelhantes ? resultadosSemelhantes : resultadosExatos;
  const disponiveisNaTela = carrosNaTela.filter((carro) => carro.status === "disponivel").length;

  function limparFiltros() {
    setBusca("");
    setMarcaFiltro("");
  }

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
        {!carregando && !filtroAtivo && (
          <p className="text-muted" aria-live="polite">
            {totalDisponiveis} veículo{totalDisponiveis !== 1 ? "s" : ""} disponíve{totalDisponiveis !== 1 ? "is" : "l"} no momento
          </p>
        )}
        {!carregando && filtroAtivo && (
          <p className="text-muted flex flex-wrap items-center gap-x-3 gap-y-1" aria-live="polite">
            <span>
              {mostrarSemelhantes ? "Nenhum resultado exato · " : ""}
              <strong className="text-ink">{disponiveisNaTela}</strong> de {totalDisponiveis} veículo{totalDisponiveis !== 1 ? "s" : ""}
              {marcaFiltro ? " · " + marcaFiltro : ""}
            </span>
            <button type="button" onClick={limparFiltros} className="text-sm font-semibold text-gold-text underline hover:text-ink">
              Limpar filtros
            </button>
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
