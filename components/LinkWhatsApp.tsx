"use client";

import type { ReactNode } from "react";
import { useLoja } from "@/components/LojaProvider";

type Props = {
  mensagem?: string;
  className?: string;
  children: ReactNode;
};

// Link para o WhatsApp da loja que pode ser usado dentro de páginas do servidor.
export default function LinkWhatsApp({ mensagem, className, children }: Props) {
  const { linkWhatsApp } = useLoja();
  return (
    <a href={linkWhatsApp(mensagem)} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}
