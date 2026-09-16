"use client";

import { Carro } from "@/types/car";
import { MessageCircle } from "lucide-react";

type Props = {
  carro: Carro;
};

export default function BotaoInteresseVeiculo({ carro }: Props) {
  function handleClick() {
    const mensagem =
      "Olá! Tenho interesse no veículo " +
      carro.marca + " " + carro.modelo + " " + carro.versao +
      " (Ano " + carro.ano_fabricacao + "/" + carro.ano_modelo + "). Podem me passar mais informações?";

    const url = "https://wa.me/5571999999999?text=" + encodeURIComponent(mensagem);
    window.open(url, "_blank");
  }

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-2 bg-green-500 text-white rounded-lg py-3 hover:bg-green-600 font-medium mt-4"
    >
      <MessageCircle size={20} />
      Tenho interesse neste veículo
    </button>
  );
}