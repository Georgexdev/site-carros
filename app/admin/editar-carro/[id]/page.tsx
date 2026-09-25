"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { validarCarro, PRECO_MINIMO, ANO_MINIMO } from "@/lib/validarCarro";
import Link from "next/link";
import SeletorMarca from "@/components/SeletorMarca";
import SeletorOpcoes from "@/components/SeletorOpcoes";
import SeletorCor from "@/components/SeletorCor";
import { coresDisponiveis, combustiveisDisponiveis, cambiosDisponiveis } from "@/data/opcoesCarro";
import GerenciadorFotosCarro from "@/components/GerenciadorFotosCarro";
import { limparTexto } from "@/lib/texto";
import CamposExtrasCarro from "@/components/CamposExtrasCarro";

export default function EditarCarro() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [carregandoDados, setCarregandoDados] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [versao, setVersao] = useState("");
  const [anoFabricacao, setAnoFabricacao] = useState("");
  const [anoModelo, setAnoModelo] = useState("");
  const [preco, setPreco] = useState("");
  const [km, setKm] = useState("");
  const [cor, setCor] = useState("");
  const [combustivel, setCombustivel] = useState("");
  const [cambio, setCambio] = useState("");
  const [placa, setPlaca] = useState("");
  const [chassi, setChassi] = useState("");
  const [mostrarPlacaChassi, setMostrarPlacaChassi] = useState(false);
  const [opcionais, setOpcionais] = useState<string[]>([]);
  const [descricao, setDescricao] = useState("");
  const [destaqueHome, setDestaqueHome] = useState(false);
  const [totalDestaques, setTotalDestaques] = useState(0);
  const [erroDestaque, setErroDestaque] = useState("");

  useEffect(() => {
    async function carregarCarro() {
      const { data: sessao } = await supabase.auth.getSession();
      if (!sessao.session) {
        router.push("/login");
        return;
      }

      const { data: carro, error } = await supabase
        .from("carros")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !carro) {
        setErro("Carro não encontrado.");
        setCarregandoDados(false);
        return;
      }

      setMarca(carro.marca);
      setModelo(carro.modelo);
      setVersao(carro.versao || "");
      setAnoFabricacao(String(carro.ano_fabricacao));
      setAnoModelo(String(carro.ano_modelo));
      setPreco(String(carro.preco));
      setKm(String(carro.km));
      setCor(carro.cor || "");
      setCombustivel(carro.combustivel || "");
      setCambio(carro.cambio || "");
      setPlaca(carro.placa || "");
      setChassi(carro.chassi || "");
      setMostrarPlacaChassi(carro.mostrar_placa_chassi || false);
      setDestaqueHome(carro.destaque_home || false);
      setOpcionais(carro.opcionais || []);
      setDescricao(carro.descricao || "");

      const { count } = await supabase
        .from("carros")
        .select("*", { count: "exact", head: true })
        .eq("empresa_id", carro.empresa_id)
        .eq("destaque_home", true);

      setTotalDestaques(count || 0);
      setCarregandoDados(false);
    }

    carregarCarro();
  }, [id, router]);

  function handleAlternarDestaque(marcado: boolean) {
    setErroDestaque("");

    if (marcado && !destaqueHome && totalDestaques >= 3) {
      setErroDestaque("Já existem 3 veículos em destaque. Desmarque um antes de adicionar outro.");
      return;
    }

    setDestaqueHome(marcado);
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    const problema = validarCarro({ marca, modelo, anoFabricacao, anoModelo, preco, km });
    if (problema) {
      setErro(problema);
      return;
    }

    setSalvando(true);

    const { error } = await supabase
      .from("carros")
      .update({
        marca: limparTexto(marca),
        modelo: limparTexto(modelo),
        versao: limparTexto(versao),
        ano_fabricacao: Number(anoFabricacao),
        ano_modelo: Number(anoModelo),
        preco: Number(preco),
        km: Number(km),
        cor,
        combustivel,
        cambio,
        placa,
        chassi,
        mostrar_placa_chassi: mostrarPlacaChassi,
        destaque_home: destaqueHome,
        opcionais,
        descricao: descricao.trim(),
      })
      .eq("id", id);

    setSalvando(false);

    if (error) {
      setErro("Erro ao salvar as alterações. Tente novamente.");
      console.error(error);
    } else {
      router.push("/admin");
    }
  }

  if (carregandoDados) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
        <p className="text-muted">Carregando dados do carro...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm font-semibold text-gold-text hover:underline">
        ← Voltar aos veículos
      </Link>

      <h1 className="font-display text-3xl sm:text-4xl text-ink mt-3 mb-6">Editar veículo</h1>

      <form onSubmit={handleSalvar} className="bg-white border border-line rounded-2xl p-5 sm:p-8 space-y-6">
        <GerenciadorFotosCarro carroId={id} />

        <div className="border-t border-line pt-6">
          <SeletorMarca valorSelecionado={marca} onSelecionar={setMarca} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-2">Modelo</label>
          <input
            type="text"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            required
            className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-2">Versão</label>
          <input
            type="text"
            value={versao}
            onChange={(e) => setVersao(e.target.value)}
            className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Ano de Fabricação</label>
            <input
              type="number"
              value={anoFabricacao}
              min={ANO_MINIMO}
              placeholder="Ex.: 2022"
              onChange={(e) => setAnoFabricacao(e.target.value)}
              required
              className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Ano do Modelo</label>
            <input
              type="number"
              value={anoModelo}
              min={ANO_MINIMO}
              placeholder="Ex.: 2023"
              onChange={(e) => setAnoModelo(e.target.value)}
              required
              className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Preço (R$)</label>
            <input
              type="number"
              value={preco}
              min={PRECO_MINIMO}
              placeholder="Ex.: 142500"
              onChange={(e) => setPreco(e.target.value)}
              required
              className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Quilometragem</label>
            <input
              type="number"
              value={km}
              min={0}
              placeholder="Ex.: 25000"
              onChange={(e) => setKm(e.target.value)}
              required
              className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
            />
          </div>
        </div>

        <SeletorCor
          opcoes={coresDisponiveis}
          valorSelecionado={cor}
          onSelecionar={setCor}
        />

        <SeletorOpcoes
          label="Combustível"
          opcoes={combustiveisDisponiveis}
          valorSelecionado={combustivel}
          onSelecionar={setCombustivel}
        />

        <SeletorOpcoes
          label="Câmbio"
          opcoes={cambiosDisponiveis}
          valorSelecionado={cambio}
          onSelecionar={setCambio}
        />

        <CamposExtrasCarro
          opcionais={opcionais}
          onMudarOpcionais={setOpcionais}
          descricao={descricao}
          onMudarDescricao={setDescricao}
        />

        <div className="border-t border-line pt-6">
          <p className="text-sm text-muted mb-4">Dados internos (não aparecem publicamente, a menos que ativado abaixo)</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Placa</label>
              <input
                type="text"
                value={placa}
                onChange={(e) => setPlaca(e.target.value)}
                className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Chassi</label>
              <input
                type="text"
                value={chassi}
                onChange={(e) => setChassi(e.target.value)}
                className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 mt-4 text-sm text-ink [&>input]:w-5 [&>input]:h-5 [&>input]:accent-[#7A6538]">
            <input
              type="checkbox"
              checked={mostrarPlacaChassi}
              onChange={(e) => setMostrarPlacaChassi(e.target.checked)}
            />
            Exibir placa e chassi publicamente no anúncio
          </label>
        </div>

        <div className="border-t border-line pt-6">
          <label className="flex items-center gap-3 text-sm text-ink [&>input]:w-5 [&>input]:h-5 [&>input]:accent-[#7A6538]">
            <input
              type="checkbox"
              checked={destaqueHome}
              onChange={(e) => handleAlternarDestaque(e.target.checked)}
            />
            Destacar este veículo na página inicial
          </label>
          <p className="text-xs text-muted mt-1.5">
            Máximo de 3 veículos em destaque ({totalDestaques}/3 no momento)
          </p>
          {erroDestaque && <p className="text-[#B42318] text-sm font-medium mt-1.5">{erroDestaque}</p>}
        </div>

        {erro && <p className="text-[#B42318] text-sm font-medium">{erro}</p>}

        <button
          type="submit"
          disabled={salvando}
          className="w-full h-13 min-h-[52px] rounded-xl bg-malu-black text-gold-light font-bold hover:bg-gold hover:text-malu-black transition-colors disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>
    </div>
  );
}