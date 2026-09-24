"use client";

import { useState, useRef } from "react";
import { Car, ChevronLeft, ChevronRight } from "lucide-react";
import { FotoCarro } from "@/types/car";

type Props = {
  fotos: FotoCarro[];
  vendido: boolean;
  altText: string;
};

export default function CarrosselFotos({ fotos, vendido, altText }: Props) {
  const [indiceAtual, setIndiceAtual] = useState(0);
  const posicaoInicial = useRef(0);
  const posicaoFinal = useRef(0);

  function irParaAnterior() {
    setIndiceAtual((atual) => (atual === 0 ? fotos.length - 1 : atual - 1));
  }

  function irParaProxima() {
    setIndiceAtual((atual) => (atual === fotos.length - 1 ? 0 : atual + 1));
  }

  function handleTouchStart(e: React.TouchEvent) {
    posicaoInicial.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    posicaoFinal.current = e.changedTouches[0].clientX;
    const diferenca = posicaoInicial.current - posicaoFinal.current;

    const distanciaMinima = 50;

    if (diferenca > distanciaMinima) {
      irParaProxima();
    } else if (diferenca < -distanciaMinima) {
      irParaAnterior();
    }
  }

  if (fotos.length === 0) {
    return (
      <div className="h-72 md:h-[460px] rounded-2xl bg-malu-surface flex flex-col items-center justify-center gap-3">
        <Car size={120} strokeWidth={0.6} className="text-gold/60" aria-hidden="true" />
        <span className="text-xs font-semibold tracking-[0.24em] uppercase text-muted-soft">Fotos em breve</span>
      </div>
    );
  }

  const fotoAtual = fotos[indiceAtual];
  const botaoSeta =
    "absolute top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-malu-black/60 border border-gold/50 text-gold-light flex items-center justify-center hover:bg-malu-black/80 transition-colors";

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative h-72 md:h-[460px] rounded-2xl overflow-hidden bg-malu-surface"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={fotoAtual.url}
          alt={altText + " – foto " + (indiceAtual + 1)}
          className={"w-full h-full object-cover " + (vendido ? "grayscale opacity-70" : "")}
        />

        {fotos.length > 1 && (
          <>
            <button onClick={irParaAnterior} aria-label="Foto anterior" className={botaoSeta + " left-4"}>
              <ChevronLeft size={22} aria-hidden="true" />
            </button>

            <button onClick={irParaProxima} aria-label="Próxima foto" className={botaoSeta + " right-4"}>
              <ChevronRight size={22} aria-hidden="true" />
            </button>

            <span className="absolute right-4 bottom-4 px-3 py-1 rounded-full bg-malu-black/70 text-gold-light text-[13px] font-semibold">
              {indiceAtual + 1} / {fotos.length}
            </span>
          </>
        )}
      </div>

      {fotos.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {fotos.map((foto, index) => (
            <button
              key={foto.id}
              onClick={() => setIndiceAtual(index)}
              aria-label={"Ver foto " + (index + 1)}
              aria-current={index === indiceAtual}
              className={
                "shrink-0 w-24 h-16 md:w-32 md:h-20 rounded-xl overflow-hidden border-2 transition-all " +
                (index === indiceAtual ? "border-gold" : "border-transparent opacity-70 hover:opacity-100")
              }
            >
              <img src={foto.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
