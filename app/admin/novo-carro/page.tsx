"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import SeletorMarca from "@/components/SeletorMarca";
import SeletorOpcoes from "@/components/SeletorOpcoes";
import SeletorCor from "@/components/SeletorCor";
import { coresDisponiveis, combustiveisDisponiveis, cambiosDisponiveis } from "@/data/opcoesCarro";


export default function NovoCarro() {
    const router = useRouter();
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [versao, setVersao] = useState("");
    const [anoFabricacao, setAnoFabricacao] = useState("");
    const [anoModelo, setAnoModelo] = useState("");
    const [preco, setPreco] = useState("");
    const [km, setKm] = useState("");
    const [cor, setCor] = useState("");
    const [combustivel, setCombustivel] = useState("");
    const [cambio, setCambio] = useState("");
    const [placa, setPlaca] = useState("");
    const [chassi, setChassi] = useState("");
    const [mostrarPlacaChassi, setMostrarPlacaChassi] = useState(false);

    async function handleSalvar(e: React.FormEvent) {
        e.preventDefault();
        setErro("");
        setSalvando(true);

        const { data: sessao } = await supabase.auth.getSession();
        if (!sessao.session) {
            router.push("/login");
            return;
        }

        const { data: administrador } = await supabase
            .from("administradores")
            .select("empresa_id")
            .eq("id", sessao.session.user.id)
            .single();

        const { data: novoCarro, error } = await supabase
            .from("carros")
            .insert({
                empresa_id: administrador?.empresa_id,
                marca,
                modelo,
                versao,
                ano_fabricacao: Number(anoFabricacao),
                ano_modelo: Number(anoModelo),
                preco: Number(preco),
                km: Number(km),
                cor,
                combustivel,
                cambio,
                placa,
                chassi,
                mostrar_placa_chassi: mostrarPlacaChassi,
                status: "disponivel",
            })
            .select()
            .single();

        setSalvando(false);

        if (error || !novoCarro) {
            setErro("Erro ao salvar o carro. Tente novamente.");
            console.error(error);
        } else {
            router.push("/admin/editar-carro/" + novoCarro.id);
        }

    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
            <Link href="/admin" className="inline-flex items-center gap-1 text-sm font-semibold text-gold-text hover:underline">
                ← Voltar aos veículos
            </Link>

            <h1 className="font-display text-3xl sm:text-4xl text-ink mt-3 mb-6">Cadastrar veículo</h1>

            <form onSubmit={handleSalvar} className="bg-white border border-line rounded-2xl p-5 sm:p-8 space-y-6">
                <SeletorMarca valorSelecionado={marca} onSelecionar={setMarca} />

                <div>
                    <label className="block text-sm font-semibold text-ink mb-2">Modelo</label>
                    <input
                        type="text"
                        value={modelo}
                        onChange={(e) => setModelo(e.target.value)}
                        required
                        className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-ink mb-2">Versão</label>
                    <input
                        type="text"
                        value={versao}
                        onChange={(e) => setVersao(e.target.value)}
                        className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-ink mb-2">Ano de Fabricação</label>
                        <input
                            type="number"
                            value={anoFabricacao}
                            onChange={(e) => setAnoFabricacao(e.target.value)}
                            required
                            className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-ink mb-2">Ano do Modelo</label>
                        <input
                            type="number"
                            value={anoModelo}
                            onChange={(e) => setAnoModelo(e.target.value)}
                            required
                            className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-ink mb-2">Preço (R$)</label>
                        <input
                            type="number"
                            value={preco}
                            onChange={(e) => setPreco(e.target.value)}
                            required
                            className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-ink mb-2">Quilometragem</label>
                        <input
                            type="number"
                            value={km}
                            onChange={(e) => setKm(e.target.value)}
                            required
                            className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                        />
                    </div>
                </div>

                <SeletorCor
                    opcoes={coresDisponiveis}
                    valorSelecionado={cor}
                    onSelecionar={setCor}
                />

                <SeletorOpcoes
                    label="Combustível"
                    opcoes={combustiveisDisponiveis}
                    valorSelecionado={combustivel}
                    onSelecionar={setCombustivel}
                />

                <SeletorOpcoes
                    label="Câmbio"
                    opcoes={cambiosDisponiveis}
                    valorSelecionado={cambio}
                    onSelecionar={setCambio}
                />

                <div className="border-t border-line pt-6">
                    <p className="text-sm text-muted mb-4">Dados internos (não aparecem publicamente, a menos que ativado abaixo)</p>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-ink mb-2">Placa</label>
                            <input
                                type="text"
                                value={placa}
                                onChange={(e) => setPlaca(e.target.value)}
                                className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-ink mb-2">Chassi</label>
                            <input
                                type="text"
                                value={chassi}
                                onChange={(e) => setChassi(e.target.value)}
                                className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                            />
                        </div>
                    </div>

                    <label className="flex items-center gap-3 mt-4 text-sm text-ink [&>input]:w-5 [&>input]:h-5 [&>input]:accent-[#7A6538]">
                        <input
                            type="checkbox"
                            checked={mostrarPlacaChassi}
                            onChange={(e) => setMostrarPlacaChassi(e.target.checked)}
                        />
                        Exibir placa e chassi publicamente no anúncio
                    </label>
                </div>

                {erro && <p className="text-[#B42318] text-sm font-medium">{erro}</p>}

                <button
                    type="submit"
                    disabled={salvando}
                    className="w-full h-13 min-h-[52px] rounded-xl bg-malu-black text-gold-light font-bold hover:bg-gold hover:text-malu-black transition-colors disabled:opacity-50"
                >
                    {salvando ? "Salvando..." : "Salvar veículo"}
                </button>
            </form>
        </div>
    );
}