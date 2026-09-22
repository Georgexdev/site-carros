"use client";

import { useState } from "react";
import { Car, Phone, User } from "lucide-react";

type Motivo = "troca" | "venda" | null;

export default function VendaSeuCarro() {
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

    function handleEnviar() {
        if (!nome.trim() || !celular.trim() || !motivo) {
            setErro("Preencha nome, celular e o motivo para continuar.");
            return;
        }

        setErro("");

        const motivoTexto =
            motivo === "troca" ? "trocar por outro carro da loja" : "apenas vender";

        const linhasVeiculo = [
            marca.trim() ? "Marca: " + marca.trim() : null,
            modelo.trim() ? "Modelo: " + modelo.trim() : null,
            ano.trim() ? "Ano: " + ano.trim() : null,
            km.trim() ? "KM: " + km.trim() : null,
        ].filter(Boolean);

        const mensagem =
            "Olá! Gostaria de avaliar meu veículo para " + motivoTexto + "." +
            (linhasVeiculo.length > 0 ? "\n\nDados do veículo:\n" + linhasVeiculo.join("\n") : "") +
            "\n\nMeus dados:\nNome: " + nome.trim() +
            "\nCelular: " + celular.trim();

        const url = "https://wa.me/5571999999999?text=" + encodeURIComponent(mensagem);
        window.open(url, "_blank");
    }

    return (
        <main className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <Car size={28} />
                Venda ou troque seu carro
            </h1>
            <p className="text-gray-600 mt-1">
                Preencha os dados abaixo e fale direto com a nossa equipe pelo WhatsApp.
            </p>

            <div className="mt-6 bg-white border rounded-lg shadow-sm p-6 space-y-5">
                <div>
                    <h2 className="font-semibold text-gray-800 mb-3">O que você deseja?</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setMotivo("troca")}
                            className={
                                "border rounded-lg py-3 text-sm font-medium transition-colors " +
                                (motivo === "troca"
                                    ? "bg-black text-white border-black"
                                    : "border-gray-300 text-gray-700 hover:border-black")
                            }
                        >
                            Trocar por outro carro
                        </button>
                        <button
                            type="button"
                            onClick={() => setMotivo("venda")}
                            className={
                                "border rounded-lg py-3 text-sm font-medium transition-colors " +
                                (motivo === "venda"
                                    ? "bg-black text-white border-black"
                                    : "border-gray-300 text-gray-700 hover:border-black")
                            }
                        >
                            Apenas vender
                        </button>
                    </div>
                </div>

                <div>
                    <h2 className="font-semibold text-gray-800 mb-3">Dados do seu veículo</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="text"
                            placeholder="Marca"
                            value={marca}
                            onChange={(e) => setMarca(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <input
                            type="text"
                            placeholder="Modelo"
                            value={modelo}
                            onChange={(e) => setModelo(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <input
                            type="text"
                            placeholder="Ano"
                            value={ano}
                            onChange={(e) => setAno(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <input
                            type="text"
                            placeholder="KM"
                            value={km}
                            onChange={(e) => setKm(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                </div>

                <div>
                    <h2 className="font-semibold text-gray-800 mb-3">Seus dados</h2>
                    <div className="space-y-3">
                        <div className="relative">
                            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Nome completo"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        <div className="relative">
                            <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="(71) 99999-9999"
                                value={celular}
                                onChange={(e) => handleCelularChange(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                    </div>
                </div>

                {erro && <p className="text-red-600 text-sm">{erro}</p>}

                <button
                    type="button"
                    onClick={handleEnviar}
                    className="w-full bg-green-500 text-white rounded-lg py-3 hover:bg-green-600 font-medium"
                >
                    Falar com a loja no WhatsApp
                </button>
            </div>
        </main>
    );
}