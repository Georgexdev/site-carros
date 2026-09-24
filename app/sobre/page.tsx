import { buscarEmpresa } from "@/lib/empresa";
import { MARCA } from "@/lib/marca";
import { Clock, Landmark, MapPin, MessageCircle, ShieldCheck } from "lucide-react";

const valores = [
  { Icone: ShieldCheck, titulo: "Estoque atualizado", texto: "Os carros que você vê no site estão disponíveis na loja." },
  { Icone: Landmark, titulo: "Condições facilitadas", texto: "Financiamento com bancos parceiros e seu usado na troca." },
  { Icone: MessageCircle, titulo: "Atendimento de verdade", texto: "Fale direto com nossa equipe pelo WhatsApp ou venha até a loja." },
];

export default async function Sobre() {
  const empresa = await buscarEmpresa("nome, sobre");

  const textoSobre = empresa?.sobre?.trim() || "Em breve, mais informações sobre nossa empresa.";

  return (
    <div>
      <section className="bg-malu-black border-b border-gold/20">
        <div className="max-w-4xl mx-auto px-6 py-14 md:py-20 flex flex-col gap-5">
          <span className="text-xs md:text-[13px] font-bold tracking-[0.28em] uppercase text-gold">Sobre nós</span>
          <h1 className="font-display text-[40px] md:text-[60px] leading-[1.05] text-[#F4EEE2]">Quem é a MALU</h1>
          <div className="text-base md:text-lg leading-relaxed text-muted-dark whitespace-pre-line">{textoSobre}</div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14 md:py-24 flex flex-col gap-9">
        <div className="flex flex-col gap-3">
          <span className="text-xs md:text-[13px] font-bold tracking-[0.28em] uppercase text-gold-text">Nosso jeito</span>
          <h2 className="font-display text-4xl md:text-[44px] leading-tight text-ink">O que nos guia</h2>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {valores.map(({ Icone, titulo, texto }) => (
            <li key={titulo} className="p-7 md:p-8 rounded-2xl bg-white border border-line flex flex-col gap-3.5">
              <Icone size={28} strokeWidth={1.6} className="text-gold-text" aria-hidden="true" />
              <strong className="text-[19px] text-ink">{titulo}</strong>
              <span className="text-[15px] leading-relaxed text-muted">{texto}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16 md:pb-24">
        <div className="rounded-3xl overflow-hidden bg-malu-black grid grid-cols-1 lg:grid-cols-[420px_minmax(0,1fr)]">
          <div className="p-8 md:p-11 flex flex-col gap-5">
            <span className="text-xs md:text-[13px] font-bold tracking-[0.28em] uppercase text-gold">Visite a loja</span>
            <strong className="font-display font-normal text-3xl leading-tight text-[#F4EEE2]">{MARCA.endereco.linha1}</strong>
            <span className="flex items-center gap-2 text-[15px] text-muted-dark">
              <MapPin size={16} className="text-gold" aria-hidden="true" />
              {MARCA.endereco.cidade} · {MARCA.endereco.cep}
            </span>
            <dl className="flex flex-col gap-2 text-[15px] text-muted-dark">
              {MARCA.horarios.map((h) => (
                <div key={h.dias} className="flex items-center gap-2">
                  <Clock size={16} className="text-gold" aria-hidden="true" />
                  <dt>{h.dias}:</dt>
                  <dd className="text-[#E9E3D6] font-semibold">{h.horario}</dd>
                </div>
              ))}
            </dl>
            <a
              href={MARCA.endereco.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto w-fit h-12 px-6 flex items-center rounded-xl bg-gold hover:bg-gold-light text-malu-black font-bold transition-colors"
            >
              Como chegar
            </a>
          </div>
          <div className="h-72 lg:h-auto lg:min-h-[380px] bg-malu-surface-2">
            <iframe
              title={"Mapa: " + MARCA.nome}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5148.499987944242!2d-38.5029791!3d-12.9748712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x71605004d36662b%3A0x35033bc728680985!2sMALU%20VEICULOS!5e1!3m2!1spt-BR!2sbr!4v1790127430018!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
