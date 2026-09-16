"use client";

import { useRouter } from "next/navigation";
import { Carro } from "@/types/car";
import { MessageCircle, Eye } from "lucide-react";

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

        const url = "https://wa.me/5571999999999?text=" + encodeURIComponent(mensagem);
        window.open(url, "_blank");
        onFechar();
    }

    return (
        <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onFechar}
        >
            <div
                className="bg-white rounded-lg w-full max-w-sm p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-bold mb-1">
                    {carro.marca} {carro.modelo}
                </h3>
                <p className="text-gray-500 text-sm mb-6">{carro.versao}</p>

                <div className="space-y-3">
                    <button
                        onClick={handleVerDetalhes}
                        className="w-full flex items-center justify-center gap-2 border rounded-lg py-3 hover:bg-gray-50"
                    >
                        <Eye size={18} />
                        Ver detalhes completos
                    </button>

                    <button
                        onClick={handleInformarInteresse}
                        className="w-full flex items-center justify-center gap-2 bg-green-500 text-white rounded-lg py-3 hover:bg-green-600"
                    >
                        <MessageCircle size={18} />
                        Informar interesse
                    </button>
                </div>
            </div>
        </div>
    );
}