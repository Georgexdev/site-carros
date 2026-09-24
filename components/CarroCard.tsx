"use client";

import { Carro } from "@/types/car";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Link from "next/link";
import { marcasDisponiveis } from "@/data/marcas";
import { ArrowRight, Calendar, Car, Gauge } from "lucide-react";

type Props = {
  carro: Carro;
};

export default function CarroCard({ carro }: Props) {
  const vendido = carro.status === "vendido";
  const [foto, setFoto] = useState<string | null>(null);

  useEffect(() => {
    async function buscarFoto() {
      const { data } = await supabase
        .from("fotos_carros")
        .select("url")
        .eq("carro_id", carro.id)
        .order("ordem", { ascending: true })
        .limit(1)
        .single();

      if (data) {
        setFoto(data.url);
      }
    }

    buscarFoto();
  }, [carro.id]);

  const marcaEncontrada = marcasDisponiveis.find((m) => m.nome === carro.marca);
  const LogoMarca = marcaEncontrada?.Logo;
  const anos = carro.ano_fabricacao + "/" + carro.ano_modelo;

  return (
    <Link
      href={"/carro/" + carro.id}
      className="group flex flex-col relative bg-white border border-line rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(28,26,23,0.04),0_8px_24px_rgba(28,26,23,0.06)] hover:shadow-[0_2px_4px_rgba(28,26,23,0.06),0_16px_36px_rgba(28,26,23,0.12)] hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="relative h-52 bg-malu-surface overflow-hidden">
        {foto ? (
          <img
            src={foto}
            alt={carro.marca + " " + carro.modelo}
            className={
              "w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300 " +
              (vendido ? "grayscale opacity-60" : "")
            }
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Car size={64} strokeWidth={0.9} className="text-gold/60" aria-hidden="true" />
            <span className="text-[11px] font-semibold tracking-[0.24em] uppercase text-muted-soft">Foto em breve</span>
          </div>
        )}

        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-malu-black/75 border border-gold/50 text-gold-light text-xs font-semibold">
          {anos}
        </span>

        {vendido && (
          <span className="absolute top-3 right-3 px-3 py-1 rounded-md bg-malu-black text-gold text-xs font-bold tracking-[0.2em]">
            VENDIDO
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col gap-2.5 flex-1">
        <div className="flex items-center gap-2">
          {LogoMarca && (
            <span className="w-6 h-6 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>img]:w-full [&>img]:h-full">
              <LogoMarca size={24} />
            </span>
          )}
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-gold-text">{carro.marca}</span>
        </div>

        <div>
          <h3 className="text-xl font-bold leading-tight text-ink">{carro.modelo}</h3>
          {carro.versao && <p className="text-sm text-muted mt-1">{carro.versao}</p>}
        </div>

        <div className="flex items-center gap-4 text-[13px] text-muted">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-gold-text" aria-hidden="true" />
            {anos}
          </span>
          <span className="flex items-center gap-1.5">
            <Gauge size={14} className="text-gold-text" aria-hidden="true" />
            {carro.km.toLocaleString("pt-BR")} km
          </span>
        </div>

        <div className="mt-auto pt-4 border-t border-[#EFE9DE] flex items-end justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-muted">{vendido ? "Vendido" : "À vista"}</span>
            <strong className="text-2xl font-bold tracking-tight text-ink">
              {carro.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}
            </strong>
          </div>
          <span className="h-11 px-4 flex items-center gap-2 rounded-lg bg-malu-black text-gold-light text-sm font-bold group-hover:bg-gold group-hover:text-malu-black transition-colors">
            Ver detalhes
            <ArrowRight size={16} aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
