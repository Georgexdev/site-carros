"use client";

import { Carro } from "@/types/car";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useEffect, useState } from "react";

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

  const imagemExibida = foto || "https://placehold.co/600x400?text=" + carro.modelo;

  return (
    <Link href={"/carro/" + carro.id} className="block relative border rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow">
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
        <h2 className="text-lg font-bold">
          {carro.marca} {carro.modelo}
        </h2>
        <p className="text-gray-600">{carro.versao}</p>
        <p className="text-sm text-gray-500">
          {carro.ano_fabricacao}/{carro.ano_modelo} • {carro.km.toLocaleString("pt-BR")} km
        </p>
        <p className="text-xl font-semibold mt-2">
          {carro.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </p>
      </div>
    </Link>
  );
}