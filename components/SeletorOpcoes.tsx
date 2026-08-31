"use client";

import { useState } from "react";

type Props = {
  label: string;
  opcoes: string[];
  valorSelecionado: string;
  onSelecionar: (valor: string) => void;
};

export default function SeletorOpcoes({ label, opcoes, valorSelecionado, onSelecionar }: Props) {
  const [usandoOutra, setUsandoOutra] = useState(false);

  const valorEstaNaLista = opcoes.includes(valorSelecionado);

  function handleSelecionar(valor: string) {
    setUsandoOutra(false);
    onSelecionar(valor);
  }

  function handleClicarOutra() {
    setUsandoOutra(true);
    onSelecionar("");
  }

  return (
    <div>
      <label className="block text-sm text-gray-600 mb-2">{label}</label>

      <div className="flex flex-wrap gap-2">
        {opcoes.map((opcao) => {
          const selecionada = !usandoOutra && valorSelecionado === opcao;
          return (
            <button
              key={opcao}
              type="button"
              onClick={() => handleSelecionar(opcao)}
              className={
                "px-4 py-2 rounded-lg border text-sm hover:border-gray-400 transition-colors " +
                (selecionada ? "border-black border-2 font-medium" : "border-gray-200")
              }
            >
              {opcao}
            </button>
          );
        })}

        <button
          type="button"
          onClick={handleClicarOutra}
          className={
            "px-4 py-2 rounded-lg border text-sm hover:border-gray-400 transition-colors " +
            (usandoOutra ? "border-black border-2 font-medium" : "border-gray-200")
          }
        >
          Outra
        </button>
      </div>

      {(usandoOutra || (!valorEstaNaLista && valorSelecionado !== "")) && (
        <input
          type="text"
          placeholder={"Digite: " + label.toLowerCase()}
          value={valorSelecionado}
          onChange={(e) => onSelecionar(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mt-3"
        />
      )}
    </div>
  );
}