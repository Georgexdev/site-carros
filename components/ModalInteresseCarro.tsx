"use client";

import { useRouter } from "next/navigation";
import { Carro } from "@/types/car";
import { MessageCircle, Eye } from "lucide-react";
import { linkWhatsApp } from "@/lib/marca";

type Props = {
    carro: Carro;
    onFechar: () => void;
};

export default function ModalInteresseCarro({ carro, onFechar }: Props) {
    const router = useRouter();

    function handleVerDetalhes() {
        onFechar();
        router.push("/carro/" + carro.id);
    }

    function handleInformarInteresse() {
        const mensagem =
            "Olá! Tenho interesse no veículo " +
            carro.marca + " " + carro.modelo + " " + carro.versao +
            " (Ano " + carro.ano_fabricacao + "/" + carro.ano_modelo + "). Podem me passar mais informações?";

        window.open(linkWhatsApp(mensagem), "_blank");
        onFechar();
    }

    return (
        <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onFechar}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={carro.marca + " " + carro.modelo}
                className="bg-white rounded-2xl border-t-4 border-gold w-full max-w-sm p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-gold-text">{carro.marca}</span>
                <h3 className="font-display text-2xl text-ink mt-1">{carro.modelo}</h3>
                <p className="text-muted text-sm mb-6">{carro.versao}</p>

                <div className="space-y-3">
                    <button
                        onClick={handleVerDetalhes}
                        className="w-full h-12 flex items-center justify-center gap-2 border border-line-strong rounded-xl font-semibold hover:border-gold transition-colors"
                    >
                        <Eye size={18} aria-hidden="true" />
                        Ver detalhes completos
                    </button>

                    <button
                        onClick={handleInformarInteresse}
                        className="w-full h-12 flex items-center justify-center gap-2 bg-whatsapp hover:bg-whatsapp-hover text-white rounded-xl font-bold transition-colors"
                    >
                        <MessageCircle size={18} aria-hidden="true" />
                        Informar interesse
                    </button>
                </div>
            </div>
        </div>
    );
}
