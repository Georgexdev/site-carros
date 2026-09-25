import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, SearchX } from "lucide-react";
import LinkWhatsApp from "@/components/LinkWhatsApp";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false },
};

// Aparece quando o endereço não existe ou quando o carro foi removido do estoque.
export default function PaginaNaoEncontrada() {
  return (
    <section className="bg-malu-black border-b border-gold/20">
      <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 flex flex-col items-center text-center gap-5">
        <span className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center">
          <SearchX size={28} strokeWidth={1.6} className="text-gold" aria-hidden="true" />
        </span>
        <span className="text-xs md:text-[13px] font-bold tracking-[0.28em] uppercase text-gold">Erro 404</span>
        <h1 className="font-display text-[38px] md:text-[56px] leading-[1.05] text-[#F4EEE2]">Página não encontrada</h1>
        <p className="text-base md:text-lg leading-relaxed text-muted-dark max-w-xl">
          O carro pode ter sido vendido ou o link está incorreto. Veja os veículos disponíveis no estoque ou fale com a
          nossa equipe.
        </p>

        <div className="mt-3 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            href="/estoque"
            className="h-14 px-8 flex items-center justify-center rounded-xl bg-gold hover:bg-gold-light text-malu-black font-bold transition-colors"
          >
            Ver estoque
          </Link>
          <LinkWhatsApp
            mensagem="Olá! Tentei abrir uma página do site e não encontrei. Podem me ajudar?"
            className="h-14 px-8 flex items-center justify-center gap-2.5 rounded-xl bg-whatsapp hover:bg-whatsapp-hover text-white font-bold transition-colors"
          >
            <MessageCircle size={18} aria-hidden="true" />
            Falar no WhatsApp
          </LinkWhatsApp>
        </div>

        <Link href="/" className="mt-2 text-sm font-semibold text-muted-dark hover:text-gold underline">
          Voltar para o início
        </Link>
      </div>
    </section>
  );
}
