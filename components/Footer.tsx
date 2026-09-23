"use client";

import { usePathname } from "next/navigation";
import { MapPin, Phone, MessageCircle, Mail } from "lucide-react";
import Link from "next/link";

type Props = {
  nomeEmpresa?: string;
  logoUrl?: string;
};

function IconeInstagram() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="gradienteInstagram" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFDD55" />
          <stop offset="25%" stopColor="#FF543E" />
          <stop offset="50%" stopColor="#C837AB" />
          <stop offset="100%" stopColor="#5A6EE8" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#gradienteInstagram)" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="white" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="white" />
    </svg>
  );
}

export default function Footer({ nomeEmpresa, logoUrl }: Props) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin") || pathname === "/login";

  if (isAdmin) {
    return null;
  }

  const nome = nomeEmpresa || "Concessionária Teste";

  return (
    <footer className="bg-[var(--cor-secundaria)] text-white mt-auto">
      <div className="h-1 bg-[var(--cor-primaria)]" />

      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          {logoUrl ? (
            <img src={logoUrl} alt={nome} className="h-14 w-auto mb-4" />
          ) : (
            <h3 className="text-xl font-bold mb-4">{nome}</h3>
          )}
          <p className="text-sm text-gray-400 leading-relaxed">
            Encontre o carro ideal pra você com quem entende do assunto. Estoque atualizado,
            condições facilitadas e atendimento de verdade.
          </p>

          <a
            href="https://www.instagram.com/maluveiculos_?stkn=MWJhc202ZWdkYmNxcg=="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors mt-5"
            aria-label="Instagram"
          >
            <IconeInstagram />
          </a>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-5">Horário de Atendimento</h4>
          <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm text-gray-300 max-w-[220px]">
            <span>Segunda a Sexta</span>
            <span className="text-gray-400 text-right">8h às 17h</span>
            <span>Sábado</span>
            <span className="text-gray-400 text-right">8h às 12h</span>
            <span>Domingo</span>
            <span className="text-gray-400 text-right">Fechado</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-5">Contato</h4>
          <div className="space-y-3 text-sm text-gray-300">
            <p className="flex items-start gap-2">
              <MapPin size={18} className="flex-shrink-0 mt-0.5 text-[var(--cor-primaria)]" />
              Av. Pres. Castelo Branco - Nazaré, Salvador - BA, 40045-050
            </p>

            <a href="tel:5571999999999" className="flex items-center gap-2 hover:text-[var(--cor-primaria)] transition-colors w-fit">
              <Phone size={18} className="text-[var(--cor-primaria)]" />
              (71) 99999-9999
            </a>

            <a
              href="https://wa.me/5571999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[var(--cor-primaria)] transition-colors w-fit"
            >
              <MessageCircle size={18} className="text-[var(--cor-primaria)]" />
              (71) 99999-9999
            </a>

            <a href="mailto:contato@concessionariateste.com.br" className="flex items-center gap-2 hover:text-[var(--cor-primaria)] transition-colors w-fit">
              <Mail size={18} className="text-[var(--cor-primaria)]" />
              contato@concessionariateste.com.br
            </a>
          </div>
        </div>
      </div >

      <div className="max-w-6xl mx-auto px-6 pb-14">
        <div className="rounded-xl overflow-hidden h-64 border border-white/10">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5148.499987944242!2d-38.5029791!3d-12.9748712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x71605004d36662b%3A0x35033bc728680985!2sMALU%20VEICULOS!5e1!3m2!1spt-BR!2sbr!4v1790127430018!5m2!1spt-BR!2sbr"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className="border-t border-white/10 py-5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center text-xs text-gray-500">
        <span>© {new Date().getFullYear()} {nome}. Todos os direitos reservados.</span>
        <Link href="/termos" className="hover:text-[var(--cor-primaria)] underline transition-colors">
          Termos de Uso e Privacidade
        </Link>
      </div>
    </footer >
  );
}