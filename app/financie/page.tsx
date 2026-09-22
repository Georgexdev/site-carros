"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Carro } from "@/types/car";
import { Landmark, Phone, User, Calendar, IdCard, Car as CarIcon, X } from "lucide-react";

const bancosParceiros = [
    { nome: "Santander", logo: "/bancos/santander.png" },
    { nome: "C6 Bank", logo: "/bancos/c6.png" },
    { nome: "BV", logo: "/bancos/bv.png" },
    { nome: "Safra", logo: "/bancos/safra.png" },
    { nome: "Pan", logo: "/bancos/pan.png" },
    { nome: "Itaú", logo: "/bancos/itau.png" },
    { nome: "Bradesco", logo: "/bancos/bradesco.png" },
    { nome: "Mercado Pago", logo: "/bancos/mercadopago.png" },
];

export default function Financie() {
    const [carros, setCarros] = useState<Carro[]>([]);
    const [fotosCapa, setFotosCapa] = useState<Record<string, string>>({});
    const [carregandoCarros, setCarregandoCarros] = useState(true);

    const [listaAberta, setListaAberta] = useState(false);
    const [veiculoSelecionado, setVeiculoSelecionado] = useState<Carro | null>(null);

    const [nome, setNome] = useState("");
    const [celular, setCelular] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [cpf, setCpf] = useState("");
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function buscarCarros() {
            const { data: carrosData } = await supabase
                .from("carros")
                .select("*")
                .eq("status", "disponivel")
                .order("criado_em", { ascending: false });

            const carrosTipados = (carrosData as Carro[]) || [];
            setCarros(carrosTipados);

            if (carrosTipados.length > 0) {
                const ids = carrosTipados.map((c) => c.id);
                const { data: fotosData } = await supabase
                    .from("fotos_carros")
                    .select("carro_id, url")
                    .in("carro_id", ids)
                    .eq("ordem", 0);

                const mapa: Record<string, string> = {};
                (fotosData || []).forEach((f) => {
                    mapa[f.carro_id] = f.url;
                });
                setFotosCapa(mapa);
            }

            setCarregandoCarros(false);
        }

        buscarCarros();
    }, []);

    function formatarCelular(valor: string) {
        const numeros = valor.replace(/\D/g, "").slice(0, 11);
        if (numeros.length <= 2) return numeros;
        if (numeros.length <= 7) return "(" + numeros.slice(0, 2) + ") " + numeros.slice(2);
        return "(" + numeros.slice(0, 2) + ") " + numeros.slice(2, 7) + "-" + numeros.slice(7);
    }

    function formatarCpf(valor: string) {
        const numeros = valor.replace(/\D/g, "").slice(0, 11);
        if (numeros.length <= 3) return numeros;
        if (numeros.length <= 6) return numeros.slice(0, 3) + "." + numeros.slice(3);
        if (numeros.length <= 9)
            return numeros.slice(0, 3) + "." + numeros.slice(3, 6) + "." + numeros.slice(6);
        return (
            numeros.slice(0, 3) + "." + numeros.slice(3, 6) + "." + numeros.slice(6, 9) + "-" + numeros.slice(9)
        );
    }

    function rolarParaFormulario() {
        document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
    }

    function handleSolicitar() {
        if (!veiculoSelecionado || !nome.trim() || !celular.trim()) {
            setErro("Selecione um veículo e preencha nome e celular para continuar.");
            return;
        }

        setErro("");

        const mensagem =
            "Olá! Gostaria de solicitar uma análise de financiamento." +
            "\n\nVeículo de interesse: " +
            veiculoSelecionado.marca + " " + veiculoSelecionado.modelo + " " + veiculoSelecionado.versao +
            " (Ano " + veiculoSelecionado.ano_fabricacao + "/" + veiculoSelecionado.ano_modelo + ")" +
            "\n\nMeus dados:\nNome: " + nome.trim() +
            "\nCelular: " + celular.trim() +
            (dataNascimento.trim() ? "\nData de nascimento: " + dataNascimento.trim() : "") +
            (cpf.trim() ? "\nCPF: " + cpf.trim() : "");

        const url = "https://wa.me/5571999999999?text=" + encodeURIComponent(mensagem);
        window.open(url, "_blank");
    }

    return (
        <main className="max-w-4xl mx-auto p-6">
            {/* Seção 1 */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Bancos Parceiros</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {bancosParceiros.map((banco) => (
                            <div
                                key={banco.nome}
                                className="border rounded-lg py-4 flex flex-col items-center gap-2 text-gray-600"
                            >
                                <img src={banco.logo} alt={banco.nome} className="h-10 max-w-[80%] object-contain" />
                                <span className="text-xs text-center">{banco.nome}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-black text-white rounded-lg p-6">
                    <h1 className="text-xl font-bold">Financie seu próximo carro</h1>
                    <p className="text-gray-300 mt-2">
                        Nossos consultores avaliam qual é a melhor taxa de juros para o seu perfil.
                    </p>
                    <button
                        onClick={rolarParaFormulario}
                        className="mt-4 bg-green-500 hover:bg-green-600 text-white font-medium px-5 py-2 rounded-lg"
                    >
                        Entrar em Contato
                    </button>
                </div>
            </section>

            {/* Seção 2 */}
            <section className="mt-12">
                <h2 className="text-xl font-bold text-center">Como Funciona</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    {[
                        { titulo: "Escolha o veículo", texto: "Selecione o carro do nosso estoque que você tem interesse em financiar." },
                        { titulo: "Preencha seus dados", texto: "Informe seus dados de contato para nossos consultores entrarem em contato." },
                        { titulo: "Receba a proposta", texto: "Nossa equipe te chama no WhatsApp com a melhor condição disponível." },
                    ].map((passo, index) => (
                        <div key={index} className="text-center">
                            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold mx-auto">
                                {index + 1}
                            </div>
                            <h3 className="font-semibold mt-3">{passo.titulo}</h3>
                            <p className="text-gray-600 text-sm mt-1">{passo.texto}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Seção 3 */}
            <section id="formulario" className="mt-12 bg-white border rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6">Solicite sua Análise de Financiamento</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Dados do Veículo</h3>

                        {veiculoSelecionado && !listaAberta ? (
                            <div className="flex items-center gap-3 border rounded-lg p-3">
                                <img
                                    src={fotosCapa[veiculoSelecionado.id] || "https://placehold.co/100x70?text=Carro"}
                                    alt={veiculoSelecionado.marca + " " + veiculoSelecionado.modelo}
                                    className="w-20 h-14 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <p className="font-medium">
                                        {veiculoSelecionado.marca} {veiculoSelecionado.modelo}
                                    </p>
                                    <p className="text-sm text-gray-500">{veiculoSelecionado.versao}</p>
                                </div>
                                <button
                                    onClick={() => setListaAberta(true)}
                                    className="text-sm text-blue-600 hover:underline shrink-0"
                                >
                                    Trocar veículo
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setListaAberta(!listaAberta)}
                                className="w-full flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-3 text-gray-500 hover:border-black"
                            >
                                <CarIcon size={18} />
                                Selecione um veículo
                            </button>
                        )}

                        {listaAberta && (
                            <div className="mt-3 border rounded-lg overflow-hidden">
                                <div className="flex items-center justify-between px-3 py-2 border-b bg-gray-50">
                                    <span className="text-sm text-gray-500">Escolha um veículo</span>
                                    <button
                                        onClick={() => setListaAberta(false)}
                                        className="text-sm text-gray-500 hover:text-black flex items-center gap-1"
                                    >
                                        <X size={16} />
                                        Fechar
                                    </button>
                                </div>

                                <div className="max-h-80 overflow-y-auto divide-y">
                                    {carregandoCarros && (
                                        <p className="text-sm text-gray-500 p-3">Carregando veículos...</p>
                                    )}

                                    {!carregandoCarros && carros.length === 0 && (
                                        <p className="text-sm text-gray-500 p-3">Nenhum veículo disponível no momento.</p>
                                    )}

                                    {carros.map((carro) => (
                                        <button
                                            key={carro.id}
                                            onClick={() => {
                                                setVeiculoSelecionado(carro);
                                                setListaAberta(false);
                                            }}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left"
                                        >
                                            <img
                                                src={fotosCapa[carro.id] || "https://placehold.co/100x70?text=" + carro.modelo}
                                                alt={carro.marca + " " + carro.modelo}
                                                className="w-20 h-14 object-cover rounded shrink-0"
                                            />
                                            <div>
                                                <p className="font-medium">
                                                    {carro.marca} {carro.modelo}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {carro.versao} · {carro.ano_fabricacao}/{carro.ano_modelo} ·{" "}
                                                    {carro.km.toLocaleString("pt-BR")} km
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Dados de Contato</h3>
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
                                    onChange={(e) => setCelular(formatarCelular(e.target.value))}
                                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="relative">
                                    <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="date"
                                        value={dataNascimento}
                                        onChange={(e) => setDataNascimento(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-black text-gray-600"
                                    />
                                </div>

                                <div className="relative">
                                    <IdCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="CPF (opcional)"
                                        value={cpf}
                                        onChange={(e) => setCpf(formatarCpf(e.target.value))}
                                        className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {erro && <p className="text-red-600 text-sm">{erro}</p>}

                    <button
                        onClick={handleSolicitar}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg py-3"
                    >
                        Solicitar Análise
                    </button>
                </div>
            </section>
        </main>
    );
}