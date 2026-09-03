"use client";

import { MessageCircle } from "lucide-react";

export default function BotaoWhatsAppFlutuante() {
  return (
    
    <a
      href="https://wa.me/5571999999999"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50 flex items-center justify-center"
      aria-label="Fale conosco no WhatsApp">
      <MessageCircle size={28} />
    </a>
  );
}