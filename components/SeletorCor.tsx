"use client";

import { useState } from "react";

type Cor = {
  nome: string;
  hex: string;
};

type Props = {
  opcoes: Cor[];
  valorSelecionado: string;
  onSelecionar: (valor: string) => void;
};

export default function SeletorCor({ opcoes, valorSelecionado, onSelecionar }: Props) {
  const [usandoOutra, setUsandoOutra] = useState(false);

  const valorEstaNaLista = opcoes.some((c) => c.nome === valorSelecionado);

  function handleSelecionar(nome: string) {
    setUsandoOutra(false);
    onSelecionar(nome);
  }

  function handleClicarOutra() {
    setUsandoOutra(true);
    onSelecionar("");
  }

  return (
    <div>
      <label className="block text-sm text-gray-600 mb-2">Cor</label>

      <div className="flex flex-wrap gap-2">
        {opcoes.map(({ nome, hex }) => {
          const selecionada = !usandoOutra && valorSelecionado === nome;
          return (
            <button
              key={nome}
              type="button"
              onClick={() => handleSelecionar(nome)}
              className={
                "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm hover:border-gray-400 transition-colors " +
                (selecionada ? "border-black border-2 font-medium" : "border-gray-200")
              }
            >
              <span
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: hex }}
              />
              {nome}
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
          placeholder="Digite o nome da cor"
          value={valorSelecionado}
          onChange={(e) => onSelecionar(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mt-3"
        />
      )}
    </div>
  );
}