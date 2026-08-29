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

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {marcasDisponiveis.map(({ nome, Logo }) => {
          const selecionada = !usandoOutra && valorSelecionado === nome;
          return (
            <button
              key={nome}
              type="button"
              onClick={() => handleSelecionarMarca(nome)}
              className={
                "flex flex-col items-center justify-center gap-1 border rounded-lg p-3 hover:border-gray-400 transition-colors " +
                (selecionada ? "border-black border-2" : "border-gray-200")
              }
            >
              <Logo size={32} />
              <span className="text-xs text-gray-600">{nome}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={handleClicarOutra}
          className={
            "flex flex-col items-center justify-center gap-1 border rounded-lg p-3 hover:border-gray-400 transition-colors " +
            (usandoOutra ? "border-black border-2" : "border-gray-200")
          }
        >
          <span className="text-2xl">+</span>
          <span className="text-xs text-gray-600">Outra</span>
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