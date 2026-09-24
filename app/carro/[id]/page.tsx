import { supabase } from "@/lib/supabase";
import { Carro, FotoCarro } from "@/types/car";
import Link from "next/link";
import { notFound } from "next/navigation";
import CarrosselFotos from "@/components/CarrosselFotos";
import BotaoInteresseVeiculo from "@/components/BotaoInteresseVeiculo";
import { marcasDisponiveis } from "@/data/marcas";
import { coresDisponiveis } from "@/data/opcoesCarro";
import { Landmark, MessageCircle, Repeat } from "lucide-react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const diferenciais = [
  { Icone: Landmark, titulo: "8 bancos parceiros", texto: "Comparamos as taxas para encontrar a melhor condição." },
  { Icone: Repeat, titulo: "Seu usado na troca", texto: "Usamos o valor do seu carro como entrada." },
  { Icone: MessageCircle, titulo: "Atendimento no WhatsApp", texto: "Tire dúvidas e agende sua visita direto com a equipe." },
];

export default async function DetalhesCarro({ params }: Props) {
  const { id } = await params;

  const { data: carro, error } = await supabase
    .from("carros")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !carro) {
    notFound();
  }

  const carroTipado = carro as Carro;
  const vendido = carroTipado.status === "vendido";

  const { data: fotos } = await supabase
    .from("fotos_carros")
    .select("*")
    .eq("carro_id", id)
    .order("ordem", { ascending: true });

  const fotosTipadas = (fotos as FotoCarro[]) || [];

  const marcaEncontrada = marcasDisponiveis.find((m) => m.nome === carroTipado.marca);
  const corEncontrada = coresDisponiveis.find((c) => c.nome === carroTipado.cor);

  const anos = carroTipado.ano_fabricacao + "/" + carroTipado.ano_modelo;
  const km = carroTipado.km.toLocaleString("pt-BR") + " km";

  const fichaTecnica = [
    { rotulo: "Ano", valor: anos },
    { rotulo: "Quilometragem", valor: km },
    { rotulo: "Combustível", valor: carroTipado.combustivel },
    { rotulo: "Câmbio", valor: carroTipado.cambio },
    { rotulo: "Cor", valor: carroTipado.cor },
    { rotulo: "Versão", valor: carroTipado.versao },
  ].filter((item) => item.valor && String(item.valor).trim() !== "");

  const resumo = [anos, km, carroTipado.cambio].filter((t) => t && String(t).trim() !== "").join(" · ");

  return (
    <div className="max-w-6xl mx-auto px-6 pt-8 md:pt-12 pb-16 md:pb-24 flex flex-col gap-7">
      <nav aria-label="Você está em" className="text-[13px] text-muted flex flex-wrap gap-2">
        <Link href="/" className="hover:text-gold-text">Início</Link>
        <span aria-hidden="true">/</span>
        <Link href="/estoque" className="hover:text-gold-text">Estoque</Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink font-semibold" aria-current="page">
          {carroTipado.marca} {carroTipado.modelo}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-8 lg:gap-10 items-start">
        <div className="flex flex-col gap-8 min-w-0">
          <div className="relative">
            <CarrosselFotos
              fotos={fotosTipadas}
              vendido={vendido}
              altText={carroTipado.marca + " " + carroTipado.modelo}
            />
            {vendido && (
              <span className="absolute top-4 left-4 px-3 py-1.5 rounded-md bg-malu-black text-gold text-sm font-bold tracking-[0.2em]">
                VENDIDO
              </span>
            )}
          </div>

          <section className="flex flex-col gap-4">
            <h2 className="font-display text-3xl text-ink">Ficha técnica</h2>
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {fichaTecnica.map((item) => (
                <div key={item.rotulo} className="p-4 md:p-5 rounded-xl bg-white border border-line flex flex-col gap-1.5">
                  <dt className="text-xs font-bold tracking-[0.18em] uppercase text-gold-text">{item.rotulo}</dt>
                  <dd className="text-base md:text-[17px] font-semibold text-ink flex items-center gap-2">
                    {item.rotulo === "Cor" && corEncontrada && (
                      <span
                        className="w-4 h-4 rounded-full border border-line-strong shrink-0"
                        style={{ backgroundColor: corEncontrada.hex }}
                        aria-hidden="true"
                      />
                    )}
                    {item.valor}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <aside className="lg:sticky lg:top-6 p-6 md:p-8 rounded-2xl bg-white border border-line shadow-[0_8px_28px_rgba(28,26,23,0.07)] flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {marcaEncontrada && (
                <span className="w-7 h-7 shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>img]:w-full [&>img]:h-full">
                  <marcaEncontrada.Logo size={28} />
                </span>
              )}
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-gold-text">{carroTipado.marca}</span>
            </div>
            <h1 className="font-display text-[34px] md:text-[38px] leading-tight text-ink">
              {carroTipado.modelo} {carroTipado.versao}
            </h1>
            {resumo && <p className="text-[15px] text-muted">{resumo}</p>}
          </div>

          <div className="py-5 border-y border-[#EFE9DE] flex flex-col gap-1">
            <span className="text-[13px] text-muted">{vendido ? "Este veículo já foi vendido" : "Preço à vista"}</span>
            <strong className="text-4xl font-bold tracking-tight text-ink">
              {carroTipado.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}
            </strong>
          </div>

          {!vendido && (
            <>
              <BotaoInteresseVeiculo carro={carroTipado} />
              <Link
                href={"/financie?carro=" + carroTipado.id}
                className="h-14 flex items-center justify-center rounded-xl bg-gold hover:bg-gold-light text-malu-black font-bold transition-colors"
              >
                Simular financiamento
              </Link>
            </>
          )}

          {vendido && (
            <Link
              href="/estoque"
              className="h-14 flex items-center justify-center rounded-xl bg-malu-black text-gold-light hover:bg-gold hover:text-malu-black font-bold transition-colors"
            >
              Ver outros veículos
            </Link>
          )}

          <Link
            href="/vender"
            className="flex items-center gap-3 p-4 rounded-xl bg-cream text-ink text-sm font-semibold hover:bg-[#EFE9DE] transition-colors"
          >
            <Repeat size={18} className="text-gold-text shrink-0" aria-hidden="true" />
            Tem um carro para dar na troca? Avalie aqui
          </Link>
        </aside>
      </div>

      <ul className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {diferenciais.map(({ Icone, titulo, texto }) => (
          <li key={titulo} className="p-7 rounded-2xl bg-malu-black flex flex-col gap-2.5">
            <Icone size={26} strokeWidth={1.6} className="text-gold" aria-hidden="true" />
            <strong className="text-[#F4EEE2] text-[17px]">{titulo}</strong>
            <span className="text-muted-dark text-sm leading-relaxed">{texto}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
