"use client";

import { marcasDisponiveis } from "@/data/marcas";

type Props = {
  marcaSelecionada: string;
  onSelecionar: (marca: string) => void;
};

export default function FiltroMarca({ marcaSelecionada, onSelecionar }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-3">
      {marcasDisponiveis.map(({ nome, Logo }) => {
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