"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DadosLoja, linkTelefoneDe, linkWhatsAppDe, montarDadosLoja } from "@/lib/loja";

const LojaContext = createContext<DadosLoja>(montarDadosLoja(null));

type Props = {
  loja: DadosLoja;
  children: ReactNode;
};

// Disponibiliza os dados da loja (vindos do banco no layout) para os
// componentes do navegador, como cabeçalho, rodapé e botões de WhatsApp.
export default function LojaProvider({ loja, children }: Props) {
  return <LojaContext.Provider value={loja}>{children}</LojaContext.Provider>;
}

export function useLoja() {
  const loja = useContext(LojaContext);
  return {
    loja,
    linkWhatsApp: (mensagem?: string) => linkWhatsAppDe(loja.whatsapp, mensagem),
    linkTelefone: () => linkTelefoneDe(loja.whatsapp),
  };
}
