import { Landmark, MessageCircle, Repeat } from "lucide-react";

const itens = [
  { Icone: Landmark, titulo: "8 bancos parceiros", texto: "A melhor taxa para o seu perfil" },
  { Icone: Repeat, titulo: "Aceitamos seu carro na troca", texto: "Avaliação e proposta rápidas" },
  { Icone: MessageCircle, titulo: "Atendimento de verdade", texto: "Fale direto com um consultor" },
];

export default function Diferenciais() {
  return (
    <section aria-label="Diferenciais" className="bg-malu-surface border-y border-gold/20">
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0">
        {itens.map(({ Icone, titulo, texto }, index) => (
          <div
            key={titulo}
            className={"flex items-center gap-4 " + (index > 0 ? "md:pl-10 md:border-l md:border-gold/20" : "")}
          >
            <span className="w-12 h-12 rounded-full border border-gold/50 flex items-center justify-center shrink-0">
              <Icone size={22} strokeWidth={1.6} className="text-gold" aria-hidden="true" />
            </span>
            <span className="flex flex-col gap-1">
              <strong className="text-[#F4EEE2] text-base">{titulo}</strong>
              <span className="text-muted-dark text-sm">{texto}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
