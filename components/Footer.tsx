"use client";

import { usePathname } from "next/navigation";
import { MapPin, Phone, MessageCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useLoja } from "@/components/LojaProvider";
import LogoMalu from "@/components/LogoMalu";

function IconeInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

const tituloColuna = "text-xs font-bold uppercase tracking-[0.22em] text-gold mb-5";

export default function Footer() {
  const { loja, linkWhatsApp, linkTelefone } = useLoja();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin") || pathname === "/login";

  if (isAdmin) {
    return null;
  }

  return (
    <footer data-esconde-whats-flutuante className="bg-malu-black text-[#D8D0C0] border-t border-gold/40 mt-auto">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.4fr] gap-10 lg:gap-12">
        <div className="flex flex-col gap-5">
          <Link href="/" aria-label={loja.nome + ", página inicial"} className="w-fit">
            <LogoMalu comIcone={false} />
          </Link>
          <p className="text-sm text-muted-dark leading-relaxed">{loja.descricao}</p>

          <a
            href={loja.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-fit text-sm font-semibold text-[#E9E3D6] hover:text-gold transition-colors"
          >
            <span className="w-11 h-11 rounded-full border border-gold/50 flex items-center justify-center text-gold">
              <IconeInstagram />
            </span>
            {loja.instagramUsuario}
          </a>
        </div>

        <div>
          <h2 className={tituloColuna}>Navegação</h2>
          <ul className="space-y-3 text-sm">
            <li><Link href="/estoque" className="hover:text-gold transition-colors">Estoque</Link></li>
            <li><Link href="/financie" className="hover:text-gold transition-colors">Financiamento</Link></li>
            <li><Link href="/vender" className="hover:text-gold transition-colors">Venda ou troque seu carro</Link></li>
            <li><Link href="/sobre" className="hover:text-gold transition-colors">Sobre a MALU</Link></li>
          </ul>
        </div>

        <div>
          <h2 className={tituloColuna}>Horário</h2>
          <dl className="space-y-3 text-sm">
            {loja.horarios.map((h) => (
              <div key={h.dias} className="flex justify-between gap-4">
                <dt>{h.dias}</dt>
                <dd className={h.horario === "Fechado" ? "text-muted-soft" : "text-[#E9E3D6] font-semibold"}>{h.horario}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className={tituloColuna}>Contato</h2>
          <div className="space-y-3 text-sm">
            <a
              href={loja.endereco.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 hover:text-gold transition-colors"
            >
              <MapPin size={17} className="flex-shrink-0 mt-0.5 text-gold" aria-hidden="true" />
              {loja.endereco.linha1}, {loja.endereco.cidade} · {loja.endereco.cep}
            </a>

            <a href={linkTelefone()} className="flex items-center gap-3 hover:text-gold transition-colors w-fit">
              <Phone size={17} className="text-gold" aria-hidden="true" />
              {loja.telefoneExibicao}
            </a>

            <a
              href={linkWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:text-gold transition-colors w-fit"
            >
              <MessageCircle size={17} className="text-gold" aria-hidden="true" />
              WhatsApp
            </a>

            {loja.email && (
              <a href={"mailto:" + loja.email} className="flex items-center gap-3 hover:text-gold transition-colors w-fit">
                <Mail size={17} className="text-gold" aria-hidden="true" />
                {loja.email}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gold/20">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-soft text-center">
          <span>
            © {new Date().getFullYear()} {loja.nome}
            {loja.cnpj && " · CNPJ " + loja.cnpj}
          </span>
          <Link href="/termos" className="text-muted-dark hover:text-gold underline transition-colors">
            Termos de uso e privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
