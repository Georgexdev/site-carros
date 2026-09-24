"use client";

import { marcasDisponiveis } from "@/data/marcas";
import { Carro } from "@/types/car";
import { LayoutGrid } from "lucide-react";

type Props = {
  marcaSelecionada: string;
  onSelecionar: (marca: string) => void;
  carros: Carro[];
};

const base =
  "group flex-shrink-0 flex flex-col items-center justify-center gap-2 rounded-xl w-24 h-24 sm:w-28 sm:h-28 transition-all";
const ativo = "bg-white border-2 border-gold shadow-[0_6px_18px_rgba(28,26,23,0.10)]";
const inativo = "bg-white border border-line hover:border-gold/60";

export default function FiltroMarca({ marcaSelecionada, onSelecionar, carros }: Props) {
  const marcasComEstoque = marcasDisponiveis.filter((marca) =>
    carros.some((carro) => carro.marca === marca.nome)
  );

  if (marcasComEstoque.length === 0) {
    return null;
  }

  const todasSelecionada = marcaSelecionada === "";

  return (
    <div role="group" aria-label="Filtrar por marca" className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1">
      <button
        type="button"
        onClick={() => onSelecionar("")}
        aria-pressed={todasSelecionada}
        className={base + " " + (todasSelecionada ? ativo : inativo)}
      >
        <LayoutGrid size={30} strokeWidth={1.4} className={todasSelecionada ? "text-gold-text" : "text-muted"} aria-hidden="true" />
        <span className={"text-sm " + (todasSelecionada ? "font-bold text-ink" : "text-muted")}>Todas</span>
      </button>

      {marcasComEstoque.map(({ nome, Logo }) => {
        const selecionada = marcaSelecionada === nome;
        return (
          <button
            key={nome}
            type="button"
            onClick={() => onSelecionar(selecionada ? "" : nome)}
            aria-pressed={selecionada}
            className={base + " " + (selecionada ? ativo : inativo)}
          >
            <span
              className={
                "w-12 h-12 flex items-center justify-center transition-all [&>svg]:w-full [&>svg]:h-full [&>img]:w-full [&>img]:h-full " +
                (selecionada ? "" : "grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100")
              }
            >
              <Logo size={48} />
            </span>
            <span className={"text-sm " + (selecionada ? "font-bold text-ink" : "text-muted")}>{nome}</span>
          </button>
        );
      })}
    </div>
  );
}
