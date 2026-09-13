"use client";

export type TipoOrdenacao = "relevancia" | "menor_preco" | "maior_preco" | "ano_recente" | "menor_km";

type Props = {
  valor: TipoOrdenacao;
  onSelecionar: (valor: TipoOrdenacao) => void;
};

export default function SeletorOrdenacao({ valor, onSelecionar }: Props) {
  return (
    <select
      value={valor}
      onChange={(e) => onSelecionar(e.target.value as TipoOrdenacao)}
      className="border rounded-lg px-4 py-3 text-sm bg-white"
    >
      <option value="relevancia">Mais recentes</option>
      <option value="menor_preco">Menor preço</option>
      <option value="maior_preco">Maior preço</option>
      <option value="ano_recente">Ano mais novo</option>
      <option value="menor_km">Menor km</option>
    </select>
  );
}