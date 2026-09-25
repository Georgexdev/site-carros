"use client";

import { Carro } from "@/types/car";
import { MessageCircle } from "lucide-react";
import { useLoja } from "@/components/LojaProvider";

type Props = {
  carro: Carro;
};

export default function BotaoInteresseVeiculo({ carro }: Props) {
  const { linkWhatsApp } = useLoja();
  function handleClick() {
    const mensagem =
      "Olá! Tenho interesse no veículo " +
      carro.marca + " " + carro.modelo + " " + carro.versao +
      " (Ano " + carro.ano_fabricacao + "/" + carro.ano_modelo + "). Podem me passar mais informações?";

    window.open(linkWhatsApp(mensagem), "_blank");
  }

  return (
    <button
      type="button"
      data-esconde-whats-flutuante
      onClick={handleClick}
      className="w-full h-14 flex items-center justify-center gap-2.5 bg-whatsapp hover:bg-whatsapp-hover text-white rounded-xl font-bold transition-colors"
    >
      <MessageCircle size={20} aria-hidden="true" />
      Tenho interesse neste veículo
    </button>
  );
}
