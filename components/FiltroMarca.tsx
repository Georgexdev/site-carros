"use client";

import { marcasDisponiveis } from "@/data/marcas";
import { Carro } from "@/types/car";

type Props = {
  marcaSelecionada: string;
  onSelecionar: (marca: string) => void;
  carros: Carro[];
};

export default function FiltroMarca({ marcaSelecionada, onSelecionar, carros }: Props) {
  const marcasComEstoque = marcasDisponiveis.filter((marca) =>
    carros.some((carro) => carro.marca === marca.nome)
  );

  if (marcasComEstoque.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-3">
      {marcasComEstoque.map(({ nome, Logo }) => {
        const selecionada = marcaSelecionada === nome;
        return (
          <button
            key={nome}
            type="button"
            onClick={() => onSelecionar(selecionada ? "" : nome)}
            className={
              "flex-shrink-0 flex flex-col items-center justify-center gap-1 border rounded-lg p-2 w-28 h-28 hover:border-gray-400 transition-colors " +
              (selecionada ? "border-black border-2 bg-gray-50" : "border-gray-200")
            }
          >
            <div className="w-14 h-14 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
              <Logo size={72} />
            </div>
            <span className="text-sm text-gray-600 text-center">{nome}</span>
          </button>
        );
      })}
    </div>
  );
}