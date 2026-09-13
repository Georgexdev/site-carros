"use client";

import { usePathname } from "next/navigation";
import { MapPin, Phone, MessageCircle, Mail } from "lucide-react";

function IconeInstagram() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="gradienteInstagram" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFDD55" />
          <stop offset="25%" stopColor="#FF543E" />
          <stop offset="50%" stopColor="#C837AB" />
          <stop offset="100%" stopColor="#5A6EE8" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#gradienteInstagram)" />
      <rect x="2" y="2" width="20" height="20" rx="6" fill="none" stroke="none" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="white" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="white" />
    </svg>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-0">
        <div className="h-72 md:h-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3808.0!2d-38.5!3d-12.97!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzEyLjAiUyAzOMKwMzAnMDAuMCJX!5e0!3m2!1spt-BR!2sbr!4v1600000000000"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="p-8">
          <h3 className="text-xl font-bold mb-4">Concessionária Teste</h3>

          <div className="space-y-3 text-sm text-gray-300">
            <p className="flex items-start gap-2">
              <MapPin size={18} className="flex-shrink-0 mt-0.5" />
              Avenida Exemplo, 1000 - Bairro Modelo - Salvador/BA - CEP 40000-000
            </p>

            <a href="tel:5571999999999" className="flex items-center gap-2 hover:text-white">
              <Phone size={18} />
              (71) 99999-9999
            </a>

            <a
              href="https://wa.me/5571999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white"
            >
              <MessageCircle size={18} />
              (71) 99999-9999
            </a>

            <a href="mailto:contato@concessionariateste.com.br" className="flex items-center gap-2 hover:text-white">
              <Mail size={18} />
              contato@concessionariateste.com.br
            </a>

            <a
              href="https://www.instagram.com/maluveiculos_?stkn=MWJhc202ZWdkYmNxcg=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white"
            >
              <IconeInstagram />
              @maluveiculos_
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Concessionária Teste. Todos os direitos reservados.
      </div>
    </footer>
  );
}