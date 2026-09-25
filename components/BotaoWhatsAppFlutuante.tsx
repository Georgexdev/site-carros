"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { useLoja } from "@/components/LojaProvider";

// Qualquer elemento com este atributo esconde o botão flutuante enquanto estiver na tela.
// Usado no rodapé, no menu do celular e em botões que ficariam cobertos (enviar formulário etc.).
const SELETOR = "[data-esconde-whats-flutuante]";

function useEscondidoPorElementos(pathname: string) {
  const [escondido, setEscondido] = useState(false);

  useEffect(() => {
    const visiveis = new Set<Element>();
    const observados = new Set<Element>();

    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) visiveis.add(entrada.target);
        else visiveis.delete(entrada.target);
      });
      setEscondido(visiveis.size > 0);
    });

    // Procura os elementos marcados de novo sempre que a página muda
    // (ex.: o menu abre, os carros terminam de carregar).
    function procurar() {
      const atuais = new Set(document.querySelectorAll(SELETOR));
      atuais.forEach((el) => {
        if (!observados.has(el)) {
          observados.add(el);
          observador.observe(el);
        }
      });
      observados.forEach((el) => {
        if (!atuais.has(el)) {
          observados.delete(el);
          visiveis.delete(el);
          observador.unobserve(el);
        }
      });
      setEscondido(visiveis.size > 0);
    }

    procurar();
    const mutacoes = new MutationObserver(procurar);
    mutacoes.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutacoes.disconnect();
      observador.disconnect();
    };
  }, [pathname]);

  return escondido;
}

export default function BotaoWhatsAppFlutuante() {
  const { linkWhatsApp } = useLoja();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin") || pathname === "/login";
  const [minimizado, setMinimizado] = useState(false);
  const escondido = useEscondidoPorElementos(pathname);

  if (isAdmin) {
    return null;
  }

  // Some com uma animação suave e deixa de receber cliques/Tab enquanto escondido.
  const visibilidade =
    "transition-all duration-300 " + (escondido ? "opacity-0 translate-y-6 pointer-events-none" : "opacity-100");

  if (minimizado) {
    return (
      <button
        type="button"
        onClick={() => setMinimizado(false)}
        aria-label="Mostrar botão do WhatsApp"
        inert={escondido}
        className={
          "fixed bottom-6 right-0 bg-whatsapp text-white w-9 h-11 rounded-l-full shadow-lg hover:bg-whatsapp-hover z-40 flex items-center justify-center " +
          visibilidade
        }
      >
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
    );
  }

  return (
    <div
      inert={escondido}
      className={"fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-1.5 " + visibilidade}
    >
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
