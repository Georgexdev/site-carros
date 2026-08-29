"use client";

import { useState } from "react";
import { marcasDisponiveis } from "@/data/marcas";

type Props = {
  valorSelecionado: string;
  onSelecionar: (marca: string) => void;
};

export default function SeletorMarca({ valorSelecionado, onSelecionar }: Props) {
  const [usandoOutra, setUsandoOutra] = useState(false);

  const marcaEstaNaLista = marcasDisponiveis.some((m) => m.nome === valorSelecionado);

  function handleSelecionarMarca(nome: string) {
    setUsandoOutra(false);
    onSelecionar(nome);
  }

  function handleClicarOutra() {
    setUsandoOutra(true);
    onSelecionar("");
  }

  return (
    <div>
      <label className="block text-sm text-gray-600 mb-2">Marca</label>

      <div className="flex gap-3 overflow-x-auto pb-3">
        {marcasDisponiveis.map(({ nome, Logo }) => {
          const selecionada = !usandoOutra && valorSelecionado === nome;
          return (
            <button
              key={nome}
              type="button"
              onClick={() => handleSelecionarMarca(nome)}
              className={
                "flex-shrink-0 flex flex-col items-center justify-center gap-1 border rounded-lg p-2 w-40 h-40 hover:border-gray-400 transition-colors " +
                (selecionada ? "border-black border-2" : "border-gray-200")
              }
            >
              <div className="w-20 h-20 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
                <Logo size={110} />
              </div>
              <span className="text-sm text-gray-600 text-center">{nome}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={handleClicarOutra}
          className={
            "flex-shrink-0 flex flex-col items-center justify-center gap-2 border rounded-lg p-4 w-28 h-28 hover:border-gray-400 transition-colors " +
            (usandoOutra ? "border-black border-2" : "border-gray-200")
          }
        >
          <span className="text-3xl">+</span>
          <span className="text-sm text-gray-600">Outra</span>
        </button>
      </div>

      {(usandoOutra || (!marcaEstaNaLista && valorSelecionado !== "")) && (
        <input
          type="text"
          placeholder="Digite o nome da marca"
          value={valorSelecionado}
          onChange={(e) => onSelecionar(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mt-3"
        />
      )}
    </div>
  );
}