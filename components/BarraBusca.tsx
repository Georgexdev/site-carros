"use client";

import { Search } from "lucide-react";
import SeletorOrdenacao, { TipoOrdenacao } from "@/components/SeletorOrdenacao";

type Props = {
  busca: string;
  onBuscar: (valor: string) => void;
  ordenacao: TipoOrdenacao;
  onOrdenar: (valor: TipoOrdenacao) => void;
};

export default function BarraBusca({ busca, onBuscar, ordenacao, onOrdenar }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 p-3 sm:p-4 bg-white border border-line rounded-2xl">
      <label className="flex-1 min-h-[52px] px-4 flex items-center gap-3 border border-line-strong rounded-xl bg-[#FBFAF7] focus-within:border-gold">
        <Search size={18} className="text-gold-text shrink-0" aria-hidden="true" />
        <span className="sr-only">Buscar veículo</span>
        <input
          type="search"
          placeholder="Buscar por marca, modelo ou versão"
          value={busca}
          onChange={(e) => onBuscar(e.target.value)}
          className="flex-1 bg-transparent text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none py-3"
        />
      </label>

      <SeletorOrdenacao valor={ordenacao} onSelecionar={onOrdenar} />
    </div>
  );
}
