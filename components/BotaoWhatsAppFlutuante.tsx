"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, ChevronRight, ChevronLeft } from "lucide-react";

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
        className="fixed bottom-6 right-0 bg-green-500 text-white p-2 rounded-l-full shadow-lg hover:bg-green-600 transition-colors z-40 flex items-center justify-center"
      >
        <ChevronLeft size={20} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-1">
      <button
        type="button"
        onClick={() => setMinimizado(true)}
        aria-label="Ocultar botão do WhatsApp"
        className="bg-gray-700/70 text-white rounded-full p-1.5 hover:bg-gray-800"
      >
        <ChevronRight size={16} />
      </button>

      <a
        href="https://wa.me/5571999999999"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco no WhatsApp"
        className="bg-green-500 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center"
      >
        <MessageCircle size={24} className="sm:w-7 sm:h-7" />
      </a>
    </div>
  );
}