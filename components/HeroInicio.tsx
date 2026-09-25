import Link from "next/link";
import { ArrowRight, Car } from "lucide-react";

export default function HeroInicio() {
  return (
    <section className="bg-malu-black">
      <div className="max-w-6xl mx-auto px-6 py-14 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="flex flex-col gap-6 md:gap-7">
          <span className="text-xs md:text-[13px] font-bold tracking-[0.28em] uppercase text-gold">Salvador · Bahia</span>
          <h1 className="font-display text-[40px] leading-[1.08] md:text-[60px] md:leading-[1.05] text-[#F4EEE2]">
            Seu próximo carro, com o financiamento certo.
          </h1>
          <p className="text-base md:text-lg leading-relaxed text-muted-dark max-w-lg">
            Encontre o carro ideal com quem entende do assunto. Estoque atualizado, condições facilitadas e atendimento de verdade.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
            <Link
              href="/estoque"
              className="h-14 px-7 flex items-center justify-center gap-2.5 rounded-xl bg-gold hover:bg-gold-light text-malu-black font-bold transition-colors"
            >
              Ver estoque
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href="/financie"
              className="h-14 px-7 flex items-center justify-center rounded-xl border border-gold text-gold-light hover:bg-gold/10 font-bold transition-colors"
            >
              Quero financiar
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex h-[420px] rounded-3xl bg-malu-surface border border-gold/30 items-center justify-center">
          <Car size={200} strokeWidth={0.5} className="text-gold/50" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
