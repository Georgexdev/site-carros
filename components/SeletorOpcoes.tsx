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
      <label className="block text-sm font-semibold text-ink mb-3">{label}</label>

      <div className="flex flex-wrap gap-2">
        {opcoes.map((opcao) => {
          const selecionada = !usandoOutra && valorSelecionado === opcao;
          return (
            <button
              key={opcao}
              type="button"
              onClick={() => handleSelecionar(opcao)}
              className={
                "h-11 px-4 rounded-xl border text-sm hover:border-gold/60 transition-colors " +
                (selecionada ? "border-gold border-2 bg-gold/10 font-semibold text-ink" : "border-line bg-white")
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
            "h-11 px-4 rounded-xl border text-sm hover:border-gold/60 transition-colors " +
            (usandoOutra ? "border-gold border-2 bg-gold/10 font-semibold text-ink" : "border-line bg-white")
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
          className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 mt-3"
        />
      )}
    </div>
  );
}