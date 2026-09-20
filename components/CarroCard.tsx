"use client";

import { Carro } from "@/types/car";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import ModalInteresseCarro from "@/components/ModalInteresseCarro";
import { marcasDisponiveis } from "@/data/marcas";
import { Calendar, Gauge } from "lucide-react";

type Props = {
  carro: Carro;
};

export default function CarroCard({ carro }: Props) {
  const vendido = carro.status === "vendido";
  const [foto, setFoto] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

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

  const imagemExibida = foto || "https://placehold.co/600x400?text=" + carro.modelo;

  const marcaEncontrada = marcasDisponiveis.find((m) => m.nome === carro.marca);
  const LogoMarca = marcaEncontrada?.Logo;

  return (
    <>
      <div
        onClick={() => setModalAberto(true)}
        className="block relative border rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow cursor-pointer"
      >
        {vendido && (
          <div className="absolute top-4 left-0 bg-red-600 text-white font-bold px-4 py-1 z-10 rotate-[-20deg] -translate-x-2">
            VENDIDO
          </div>
        )}

        <img
          src={imagemExibida}
          alt={carro.marca + " " + carro.modelo}
          className={"w-full h-48 object-cover " + (vendido ? "grayscale opacity-70" : "")}
        />

        <div className="p-4">
          <div className="flex items-center gap-2">
            {LogoMarca && (
              <div className="w-6 h-6 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
                <LogoMarca size={24} />
              </div>
            )}
            <h2 className="text-lg font-bold">
              {carro.marca} {carro.modelo}
            </h2>
          </div>

          <p className="text-gray-600">{carro.versao}</p>

          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar size={15} />
              {carro.ano_fabricacao}/{carro.ano_modelo}
            </span>
            <span className="flex items-center gap-1">
              <Gauge size={15} />
              {carro.km.toLocaleString("pt-BR")} km
            </span>
          </div>

          <p className="text-xl font-semibold mt-2">
            {carro.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>

          <div className="mt-3 border border-black text-black text-center py-2 rounded-lg text-sm font-medium hover:bg-black hover:text-white transition-colors">
            Ver mais
          </div>
        </div>
      </div>

      {modalAberto && (
        <ModalInteresseCarro carro={carro} onFechar={() => setModalAberto(false)} />
      )}
    </>
  );
}