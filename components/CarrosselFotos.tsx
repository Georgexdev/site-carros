"use client";

import { useState } from "react";
import { FotoCarro } from "@/types/car";

type Props = {
  fotos: FotoCarro[];
  vendido: boolean;
  altText: string;
};

export default function CarrosselFotos({ fotos, vendido, altText }: Props) {
  const [indiceAtual, setIndiceAtual] = useState(0);

  function irParaAnterior() {
    setIndiceAtual((atual) => (atual === 0 ? fotos.length - 1 : atual - 1));
  }

  function irParaProxima() {
    setIndiceAtual((atual) => (atual === fotos.length - 1 ? 0 : atual + 1));
  }

  const fotoAtual = fotos[indiceAtual];

  return (
    <div className="relative">
      <img
        src={fotoAtual.url}
        alt={altText}
        className={"w-full h-80 object-cover " + (vendido ? "grayscale opacity-70" : "")}
      />

      {fotos.length > 1 && (
        <>
          <button
            onClick={irParaAnterior}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/70"
          >
            ‹
          </button>

          <button
            onClick={irParaProxima}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/70"
          >
            ›
          </button>

          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {fotos.map((foto, index) => (
              <button
                key={foto.id}
                onClick={() => setIndiceAtual(index)}
                className={
                  "w-2.5 h-2.5 rounded-full " +
                  (index === indiceAtual ? "bg-white" : "bg-white/50")
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}