"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { linkWhatsApp } from "@/lib/marca";

export default function BotaoWhatsAppFlutuante() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin") || pathname === "/login";
  const [minimizado, setMinimizado] = useState(false);

  if (isAdmin) {
    return null;
  }

  if (minimizado) {
    return (
      <button
        type="button"
        onClick={() => setMinimizado(false)}
        aria-label="Mostrar botão do WhatsApp"
        className="fixed bottom-6 right-0 bg-whatsapp text-white w-9 h-11 rounded-l-full shadow-lg hover:bg-whatsapp-hover transition-colors z-40 flex items-center justify-center"
      >
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => setMinimizado(true)}
        aria-label="Ocultar botão do WhatsApp"
        className="bg-malu-black/80 border border-gold/40 text-gold-light rounded-full w-8 h-8 flex items-center justify-center hover:bg-malu-black"
      >
        <ChevronRight size={16} aria-hidden="true" />
      </button>

      <a
        href={linkWhatsApp()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco no WhatsApp"
        className="bg-whatsapp text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-lg hover:bg-whatsapp-hover transition-colors flex items-center justify-center ring-4 ring-white/70"
      >
        <MessageCircle size={26} aria-hidden="true" />
      </a>
    </div>
  );
}
