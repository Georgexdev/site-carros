"use client";

import { useState } from "react";
import { Check, MessageCircle, Phone, User } from "lucide-react";
import { useLoja } from "@/components/LojaProvider";
import { celularValido } from "@/lib/validacao";

const vantagens = [
    { titulo: "Use seu carro como entrada", texto: "Na troca, o valor do seu usado abate direto do próximo carro." },
    { titulo: "Proposta pelo WhatsApp", texto: "Mande os dados do veículo e nossa equipe responde com uma avaliação." },
    { titulo: "Atendimento direto com a loja", texto: "Você conversa com quem vai avaliar e fechar o negócio." },
];

const campo =
    "w-full h-13 min-h-[52px] border border-line-strong rounded-xl bg-[#FBFAF7] text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30";
const rotulo = "block text-sm font-semibold text-ink mb-2";
const tituloGrupo = "text-xs font-bold tracking-[0.2em] uppercase text-gold-text mb-3";

type Motivo = "troca" | "venda" | null;

export default function VendaSeuCarro() {
    const { linkWhatsApp } = useLoja();
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [ano, setAno] = useState("");
    const [km, setKm] = useState("");
    const [motivo, setMotivo] = useState<Motivo>(null);
    const [nome, setNome] = useState("");
    const [celular, setCelular] = useState("");
    const [erro, setErro] = useState("");

    function formatarCelular(valor: string) {
        const numeros = valor.replace(/\D/g, "").slice(0, 11);
        if (numeros.length <= 2) return numeros;
        if (numeros.length <= 7) return "(" + numeros.slice(0, 2) + ") " + numeros.slice(2);
        return "(" + numeros.slice(0, 2) + ") " + numeros.slice(2, 7) + "-" + numeros.slice(7);
    }

    function handleCelularChange(valor: string) {
        setCelular(formatarCelular(valor));
    }

    // Ano: só números, no máximo 4 dígitos.
    function handleAnoChange(valor: string) {
        setAno(valor.replace(/\D/g, "").slice(0, 4));
    }

    // Km: só números, com ponto a cada milhar (45000 → 45.000).
    function handleKmChange(valor: string) {
        const numeros = valor.replace(/\D/g, "").slice(0, 7);
        setKm(numeros ? Number(numeros).toLocaleString("pt-BR") : "");
    }

    function handleEnviar() {
        const anoMaximo = new Date().getFullYear() + 1;
        const problemas = [
            !motivo ? "escolha se você quer trocar por outro carro ou apenas vender" : null,
            ano && (ano.length !== 4 || Number(ano) < 1950 || Number(ano) > anoMaximo)
                ? "confira o ano do veículo (entre 1950 e " + anoMaximo + ")"
                : null,
            !nome.trim() ? "informe seu nome" : null,
            !celular.trim()
                ? "informe seu celular com DDD"
                : !celularValido(celular)
                  ? "confira o celular: DDD + 9 dígitos, ex.: (71) 98429-6345"
                  : null,
        ].filter(Boolean) as string[];

        if (problemas.length > 0) {
            const texto = problemas.join("; ");
            setErro(texto.charAt(0).toUpperCase() + texto.slice(1) + ".");
            return;
        }

        setErro("");

        const motivoTexto =
            motivo === "troca" ? "trocar por outro carro da loja" : "apenas vender";

        const linhasVeiculo = [
            marca.trim() ? "Marca: " + marca.trim() : null,
            modelo.trim() ? "Modelo: " + modelo.trim() : null,
            ano.trim() ? "Ano: " + ano.trim() : null,
            km.trim() ? "KM: " + km.trim() + " km" : null,
        ].filter(Boolean);

        const mensagem =
            "Olá! Gostaria de avaliar meu veículo para " + motivoTexto + "." +
            (linhasVeiculo.length > 0 ? "\n\nDados do veículo:\n" + linhasVeiculo.join("\n") : "") +
            "\n\nMeus dados:\nNome: " + nome.trim() +
            "\nCelular: " + celular.trim();

        window.open(linkWhatsApp(mensagem), "_blank");
    }

    function classeMotivo(valor: Motivo) {
        return (
            "h-14 rounded-xl border text-[15px] font-bold transition-colors " +
            (motivo === valor
                ? "bg-malu-black text-gold-light border-malu-black"
                : "bg-white border-line-strong text-ink hover:border-gold")
        );
    }

    return (
        <div>
            <section className="bg-malu-black border-b border-gold/20">
                <div className="max-w-6xl mx-auto px-6 py-14 md:py-20 flex flex-col gap-5">
                    <span className="text-xs md:text-[13px] font-bold tracking-[0.28em] uppercase text-gold">Venda ou troca</span>
                    <h1 className="font-display text-[40px] md:text-[60px] leading-[1.05] text-[#F4EEE2]">Venda ou troque seu carro</h1>
                    <p className="text-base md:text-lg leading-relaxed text-muted-dark max-w-2xl">
                        Preencha os dados abaixo e fale direto com a nossa equipe pelo WhatsApp.
                    </p>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6 py-14 md:py-24 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_560px] gap-12 lg:gap-16 items-start">
                <section className="flex flex-col gap-6 order-2 lg:order-1">
                    <h2 className="font-display text-3xl md:text-4xl text-ink">Por que vender pra MALU</h2>
                    <ul className="flex flex-col gap-4">
                        {vantagens.map((v) => (
                            <li key={v.titulo} className="flex gap-4 items-start p-5 rounded-2xl bg-white border border-line">
                                <span className="w-11 h-11 rounded-full bg-malu-black flex items-center justify-center shrink-0">
                                    <Check size={20} strokeWidth={2.2} className="text-gold" aria-hidden="true" />
                                </span>
                                <div className="flex flex-col gap-1.5">
                                    <strong className="text-[17px] text-ink">{v.titulo}</strong>
                                    <span className="text-[15px] leading-relaxed text-muted">{v.texto}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="order-1 lg:order-2 p-6 md:p-10 rounded-2xl bg-white border border-line border-t-4 border-t-gold shadow-[0_8px_28px_rgba(28,26,23,0.07)] space-y-7">
                    <div>
                        <h2 className={tituloGrupo}>O que você deseja?</h2>
                        <div role="group" aria-label="O que você deseja" className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setMotivo("troca")}
                                aria-pressed={motivo === "troca"}
                                className={classeMotivo("troca")}
                            >
                                Trocar por outro carro
                            </button>
                            <button
                                type="button"
                                onClick={() => setMotivo("venda")}
                                aria-pressed={motivo === "venda"}
                                className={classeMotivo("venda")}
                            >
                                Apenas vender
                            </button>
                        </div>
                    </div>

                    <div>
                        <h2 className={tituloGrupo}>Seu veículo</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="vender-marca" className={rotulo}>Marca</label>
                                <input id="vender-marca" type="text" placeholder="Ex.: Toyota" value={marca} onChange={(e) => setMarca(e.target.value)} className={campo + " px-4"} />
                            </div>
                            <div>
                                <label htmlFor="vender-modelo" className={rotulo}>Modelo</label>
                                <input id="vender-modelo" type="text" placeholder="Ex.: Corolla" value={modelo} onChange={(e) => setModelo(e.target.value)} className={campo + " px-4"} />
                            </div>
                            <div>
                                <label htmlFor="vender-ano" className={rotulo}>Ano</label>
                                <input id="vender-ano" type="text" inputMode="numeric" placeholder="Ex.: 2020" maxLength={4} value={ano} onChange={(e) => handleAnoChange(e.target.value)} className={campo + " px-4"} />
                            </div>
                            <div>
                                <label htmlFor="vender-km" className={rotulo}>Quilometragem</label>
                                <input id="vender-km" type="text" inputMode="numeric" placeholder="Ex.: 45.000" value={km} onChange={(e) => handleKmChange(e.target.value)} className={campo + " px-4"} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className={tituloGrupo}>Seus dados</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="vender-nome" className={rotulo}>Nome completo</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-text" aria-hidden="true" />
                                    <input
                                        id="vender-nome"
                                        type="text"
                                        autoComplete="name"
                                        placeholder="Como devemos te chamar"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        className={campo + " pl-11 pr-3"}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="vender-celular" className={rotulo}>Celular (WhatsApp)</label>
                                <div className="relative">
                                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-text" aria-hidden="true" />
                                    <input
                                        id="vender-celular"
                                        type="tel"
                                        inputMode="numeric"
                                        autoComplete="tel-national"
                                        placeholder="(71) 9 0000-0000"
                                        value={celular}
                                        onChange={(e) => handleCelularChange(e.target.value)}
                                        className={campo + " pl-11 pr-3"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {erro && <p className="text-[#B42318] text-sm font-medium" role="alert">{erro}</p>}

                    <button
                        type="button"
                        data-esconde-whats-flutuante
                        onClick={handleEnviar}
                        className="w-full h-14 flex items-center justify-center gap-2.5 bg-whatsapp hover:bg-whatsapp-hover text-white rounded-xl font-bold transition-colors"
                    >
                        <MessageCircle size={20} aria-hidden="true" />
                        Falar com a loja no WhatsApp
                    </button>
                </section>
            </div>
        </div>
    );
}
