"use client";

export type TipoOrdenacao = "relevancia" | "menor_preco" | "maior_preco" | "ano_recente" | "ano_antigo" | "menor_km" | "maior_km";
type Props = {
  valor: TipoOrdenacao;
  onSelecionar: (valor: TipoOrdenacao) => void;
};

export default function SeletorOrdenacao({ valor, onSelecionar }: Props) {
  return (
    <label className="h-13 min-h-[52px] px-4 flex items-center gap-2 border border-line-strong rounded-xl bg-[#FBFAF7] text-sm text-muted focus-within:border-gold">
      Ordenar
      <select
        value={valor}
        onChange={(e) => onSelecionar(e.target.value as TipoOrdenacao)}
        className="bg-transparent text-[15px] font-semibold text-ink focus:outline-none py-3"
      >
        <option value="relevancia">Mais recentes</option>
        <option value="menor_preco">Menor preço</option>
        <option value="maior_preco">Maior preço</option>
        <option value="ano_recente">Ano mais novo</option>
        <option value="ano_antigo">Ano mais antigo</option>
        <option value="menor_km">Menor km</option>
        <option value="maior_km">Maior km</option>
      </select>
    </label>
  );
}
