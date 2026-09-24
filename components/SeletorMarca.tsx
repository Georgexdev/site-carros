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
      <label className="block text-sm font-semibold text-ink mb-3">Marca</label>

      <div className="flex gap-3 overflow-x-auto pb-3">
        {marcasDisponiveis.map(({ nome, Logo }) => {
          const selecionada = !usandoOutra && valorSelecionado === nome;
          return (
            <button
              key={nome}
              type="button"
              onClick={() => handleSelecionarMarca(nome)}
              className={
                "flex-shrink-0 flex flex-col items-center justify-center gap-1 border rounded-xl p-2 w-32 h-32 hover:border-gold/60 transition-colors " +
                (selecionada ? "border-gold border-2 bg-white shadow-sm" : "border-line bg-white")
              }
            >
              <div className="w-20 h-20 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
                <Logo size={110} />
              </div>
              <span className="text-sm text-ink text-center">{nome}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={handleClicarOutra}
          className={
            "flex-shrink-0 flex flex-col items-center justify-center gap-2 border rounded-xl p-4 w-32 h-32 hover:border-gold/60 transition-colors " +
            (usandoOutra ? "border-gold border-2 bg-white shadow-sm" : "border-line bg-white")
          }
        >
          <span className="text-3xl">+</span>
          <span className="text-sm text-muted">Outra</span>
        </button>
      </div>

      {(usandoOutra || (!marcaEstaNaLista && valorSelecionado !== "")) && (
        <input
          type="text"
          placeholder="Digite o nome da marca"
          value={valorSelecionado}
          onChange={(e) => onSelecionar(e.target.value)}
          className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 mt-3"
        />
      )}
    </div>
  );
}