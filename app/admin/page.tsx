"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Carro, Administrador } from "@/types/car";
import Link from "next/link";
import { Car, Eye, Pencil, PlusCircle, Star, Trash2, CheckCircle2, RotateCcw, Search } from "lucide-react";

export default function Admin() {
  const router = useRouter();
  const [administrador, setAdministrador] = useState<Administrador | null>(null);
  const [carros, setCarros] = useState<Carro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [fotosCapas, setFotosCapas] = useState<Record<string, string>>({});
  const [filtro, setFiltro] = useState<"todos" | "disponivel" | "vendido">("todos");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    async function verificarSessaoEBuscarDados() {
      const { data: sessao } = await supabase.auth.getSession();

      if (!sessao.session) {
        router.push("/login");
        return;
      }

      const { data: admin, error: erroAdmin } = await supabase
        .from("administradores")
        .select("*")
        .eq("id", sessao.session.user.id)
        .single();

      if (erroAdmin || !admin) {
        console.error("Erro ao buscar administrador:", erroAdmin);
        setCarregando(false);
        return;
      }

      setAdministrador(admin as Administrador);

      const { data: listaCarros, error } = await supabase
        .from("carros")
        .select("*")
        .eq("empresa_id", admin.empresa_id)
        .order("criado_em", { ascending: false });

      if (error) {
        console.error("Erro ao buscar carros:", error);
      } else if (listaCarros) {
        setCarros(listaCarros as Carro[]);

        const { data: fotos } = await supabase
          .from("fotos_carros")
          .select("carro_id, url")
          .eq("ordem", 0);

        if (fotos) {
          const mapa: Record<string, string> = {};
          fotos.forEach((foto) => {
            mapa[foto.carro_id] = foto.url;
          });
          setFotosCapas(mapa);
        }
      }

      setCarregando(false);
    }

    verificarSessaoEBuscarDados();
  }, [router]);

  async function handleAlternarStatus(carro: Carro) {
    const novoStatus = carro.status === "vendido" ? "disponivel" : "vendido";

    const { error } = await supabase
      .from("carros")
      .update({ status: novoStatus })
      .eq("id", carro.id);

    if (!error) {
      setCarros((atual) =>
        atual.map((c) => (c.id === carro.id ? { ...c, status: novoStatus } : c))
      );
    }
  }

  async function handleAlternarDestaque(carro: Carro) {
    if (!carro.destaque_home) {
      const totalAtual = carros.filter((c) => c.destaque_home).length;
      if (totalAtual >= 3) {
        alert("Já existem 3 veículos em destaque. Remova um antes de adicionar outro.");
        return;
      }
    }

    const { error } = await supabase
      .from("carros")
      .update({ destaque_home: !carro.destaque_home })
      .eq("id", carro.id);

    if (!error) {
      setCarros((atual) =>
        atual.map((c) => (c.id === carro.id ? { ...c, destaque_home: !c.destaque_home } : c))
      );
    }
  }

  async function handleExcluir(carro: Carro) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir " + carro.marca + " " + carro.modelo + "? Essa ação não pode ser desfeita."
    );

    if (!confirmar) return;

    const { error } = await supabase.from("carros").delete().eq("id", carro.id);

    if (!error) {
      setCarros((atual) => atual.filter((c) => c.id !== carro.id));
    }
  }

  if (carregando) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        <div className="h-9 w-48 rounded bg-line animate-pulse mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-white border border-line animate-pulse" />
          ))}
        </div>
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-white border border-line animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!administrador) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        <p className="text-[#B42318] font-medium">
          Sua conta ainda não está vinculada a nenhuma empresa. Entre em contato com o suporte.
        </p>
      </div>
    );
  }

  const totalDisponiveis = carros.filter((c) => c.status === "disponivel").length;
  const totalVendidos = carros.filter((c) => c.status === "vendido").length;
  const totalDestaques = carros.filter((c) => c.destaque_home).length;

  const termo = busca.trim().toLowerCase();
  const carrosExibidos = carros
    .filter((c) => filtro === "todos" || c.status === filtro)
    .filter((c) => termo === "" || (c.marca + " " + c.modelo + " " + c.versao).toLowerCase().includes(termo));

  const indicadores = [
    { rotulo: "Cadastrados", valor: String(carros.length) },
    { rotulo: "Disponíveis", valor: String(totalDisponiveis) },
    { rotulo: "Vendidos", valor: String(totalVendidos) },
    { rotulo: "Em destaque", valor: totalDestaques + "/3" },
  ];

  const abas: { id: typeof filtro; label: string }[] = [
    { id: "todos", label: "Todos" },
    { id: "disponivel", label: "Disponíveis" },
    { id: "vendido", label: "Vendidos" },
  ];

  const botaoAcao =
    "text-sm font-semibold h-10 px-3 inline-flex items-center gap-1.5 border border-line-strong rounded-lg bg-white text-ink hover:border-gold transition-colors";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-muted">Olá, {administrador.nome}</p>
          <h1 className="font-display text-3xl sm:text-4xl text-ink mt-1">Veículos</h1>
        </div>

        {administrador.pode_gerenciar_carros && (
          <Link
            href="/admin/novo-carro"
            className="h-12 px-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gold hover:bg-gold-light text-malu-black font-bold transition-colors"
          >
            <PlusCircle size={18} aria-hidden="true" />
            Cadastrar veículo
          </Link>
        )}
      </div>

      <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {indicadores.map((item) => (
          <div key={item.rotulo} className="p-5 rounded-2xl bg-white border border-line">
            <dt className="text-xs font-bold tracking-[0.18em] uppercase text-gold-text">{item.rotulo}</dt>
            <dd className="font-display text-3xl text-ink mt-2">{item.valor}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-4">
        <div role="group" aria-label="Filtrar por status" className="inline-flex p-1 rounded-xl bg-white border border-line w-fit">
          {abas.map((aba) => (
            <button
              key={aba.id}
              type="button"
              onClick={() => setFiltro(aba.id)}
              aria-pressed={filtro === aba.id}
              className={
                "h-9 px-4 rounded-lg text-sm font-semibold transition-colors " +
                (filtro === aba.id ? "bg-malu-black text-gold-light" : "text-muted hover:text-ink")
              }
            >
              {aba.label}
            </button>
          ))}
        </div>

        <label className="h-11 px-3 flex items-center gap-2 rounded-xl bg-white border border-line focus-within:border-gold sm:w-72">
          <Search size={16} className="text-gold-text" aria-hidden="true" />
          <span className="sr-only">Buscar veículo</span>
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por marca ou modelo"
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-[#8A8174]"
          />
        </label>
      </div>

      {carrosExibidos.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white border border-dashed border-line-strong text-center">
          <Car size={40} strokeWidth={1.2} className="text-gold-text mx-auto mb-3" aria-hidden="true" />
          <p className="text-muted">
            {carros.length === 0 ? "Nenhum carro cadastrado ainda." : "Nenhum veículo encontrado com esse filtro."}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {carrosExibidos.map((carro) => {
            const vendido = carro.status === "vendido";
            return (
              <li
                key={carro.id}
                className="flex flex-col lg:flex-row lg:items-center gap-4 lg:justify-between rounded-2xl p-4 bg-white border border-line"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {fotosCapas[carro.id] ? (
                    <img
                      src={fotosCapas[carro.id]}
                      alt={carro.marca + " " + carro.modelo}
                      className={"w-24 h-20 object-cover rounded-xl flex-shrink-0 " + (vendido ? "grayscale opacity-70" : "")}
                    />
                  ) : (
                    <span className="w-24 h-20 rounded-xl bg-malu-surface flex items-center justify-center flex-shrink-0">
                      <Car size={28} strokeWidth={1.2} className="text-gold/70" aria-hidden="true" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={
                          "text-[11px] font-bold tracking-[0.14em] uppercase px-2 py-0.5 rounded-md " +
                          (vendido ? "bg-[#EFE9DE] text-muted" : "bg-[#E4F2E9] text-[#0F7B3C]")
                        }
                      >
                        {vendido ? "Vendido" : "Disponível"}
                      </span>
                      {carro.destaque_home && (
                        <span className="text-[11px] font-bold tracking-[0.14em] uppercase px-2 py-0.5 rounded-md bg-malu-black text-gold inline-flex items-center gap-1">
                          <Star size={11} fill="currentColor" aria-hidden="true" />
                          Destaque
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-ink mt-1.5 truncate">
                      {carro.marca} {carro.modelo}{" "}
                      <span className="font-normal text-muted">{carro.versao}</span>
                    </p>
                    <p className="text-sm text-muted">
                      {carro.ano_fabricacao}/{carro.ano_modelo} · {carro.km.toLocaleString("pt-BR")} km ·{" "}
                      <strong className="text-ink">
                        {carro.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </strong>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <a href={"/carro/" + carro.id} target="_blank" rel="noopener noreferrer" className={botaoAcao} aria-label={"Ver anúncio de " + carro.marca + " " + carro.modelo}>
                    <Eye size={15} aria-hidden="true" />
                    Ver
                  </a>
                  {administrador.pode_gerenciar_carros && (
                    <>
                      <Link href={"/admin/editar-carro/" + carro.id} className={botaoAcao}>
                        <Pencil size={15} aria-hidden="true" />
                        Editar
                      </Link>
                      <button onClick={() => handleAlternarStatus(carro)} className={botaoAcao}>
                        {vendido ? <RotateCcw size={15} aria-hidden="true" /> : <CheckCircle2 size={15} aria-hidden="true" />}
                        {vendido ? "Marcar disponível" : "Marcar vendido"}
                      </button>
                      <button
                        onClick={() => handleAlternarDestaque(carro)}
                        aria-pressed={carro.destaque_home}
                        className={
                          botaoAcao + (carro.destaque_home ? " !border-gold bg-gold/10 text-gold-text" : "")
                        }
                      >
                        <Star size={15} fill={carro.destaque_home ? "currentColor" : "none"} aria-hidden="true" />
                        {carro.destaque_home ? "Destacado" : "Destacar"}
                      </button>
                      <button
                        onClick={() => handleExcluir(carro)}
                        className="text-sm font-semibold h-10 px-3 inline-flex items-center gap-1.5 border border-[#F1C7C2] text-[#B42318] rounded-lg bg-white hover:bg-[#FDF1F0] transition-colors"
                      >
                        <Trash2 size={15} aria-hidden="true" />
                        Excluir
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
