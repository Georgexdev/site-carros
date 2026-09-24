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
      <label className="block text-sm font-semibold text-ink mb-3">Cor</label>

      <div className="flex flex-wrap gap-2">
        {opcoes.map(({ nome, hex }) => {
          const selecionada = !usandoOutra && valorSelecionado === nome;
          return (
            <button
              key={nome}
              type="button"
              onClick={() => handleSelecionar(nome)}
              className={
                "flex items-center gap-2 h-11 px-3 rounded-xl border text-sm hover:border-gold/60 transition-colors " +
                (selecionada ? "border-gold border-2 bg-gold/10 font-semibold text-ink" : "border-line bg-white")
              }
            >
              <span
                className="w-4 h-4 rounded-full border border-line-strong"
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
          placeholder="Digite o nome da cor"
          value={valorSelecionado}
          onChange={(e) => onSelecionar(e.target.value)}
          className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 mt-3"
        />
      )}
    </div>
  );
}