"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function Configuracoes() {
    const router = useRouter();
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState(false);

    const [empresaId, setEmpresaId] = useState("");
    const [sobre, setSobre] = useState("");

    useEffect(() => {
        async function carregarDados() {
            const { data: sessao } = await supabase.auth.getSession();
            if (!sessao.session) {
                router.push("/login");
                return;
            }

            const { data: admin } = await supabase
                .from("administradores")
                .select("empresa_id")
                .eq("id", sessao.session.user.id)
                .single();

            if (!admin) {
                setErro("Não foi possível identificar sua empresa.");
                setCarregando(false);
                return;
            }

            setEmpresaId(admin.empresa_id);

            const { data: empresa } = await supabase
                .from("empresas")
                .select("sobre")
                .eq("id", admin.empresa_id)
                .single();

            if (empresa) {
                setSobre(empresa.sobre || "");
            }

            setCarregando(false);
        }

        carregarDados();
    }, [router]);

    async function handleSalvar(e: React.FormEvent) {
        e.preventDefault();
        setErro("");
        setSucesso(false);
        setSalvando(true);

        const { error } = await supabase
            .from("empresas")
            .update({ sobre })
            .eq("id", empresaId);

        setSalvando(false);

        if (error) {
            setErro("Erro ao salvar as alterações. Tente novamente.");
            console.error(error);
        } else {
            setSucesso(true);
        }
    }

    if (carregando) {
        return (
            <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
                <p className="text-muted">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
            <Link href="/admin" className="inline-flex items-center gap-1 text-sm font-semibold text-gold-text hover:underline">
                ← Voltar aos veículos
            </Link>

            <h1 className="font-display text-3xl sm:text-4xl text-ink mt-3 mb-6">Sobre a loja</h1>

            <form onSubmit={handleSalvar} className="bg-white border border-line rounded-2xl p-5 sm:p-8 space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-ink mb-2">Sobre a loja</label>
                    <textarea
                        value={sobre}
                        onChange={(e) => setSobre(e.target.value)}
                        rows={6}
                        placeholder="Conte um pouco sobre a história e os diferenciais da sua loja..."
                        className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                    />
                    <p className="text-xs text-muted mt-1.5">
                        Este texto será exibido na página “Sobre” do site.
                    </p>
                </div>

                {erro && <p className="text-[#B42318] text-sm font-medium">{erro}</p>}
                {sucesso && <p className="text-[#0F7B3C] text-sm font-medium">Alterações salvas com sucesso!</p>}

                <button
                    type="submit"
                    disabled={salvando}
                    className="w-full h-13 min-h-[52px] rounded-xl bg-malu-black text-gold-light font-bold hover:bg-gold hover:text-malu-black transition-colors disabled:opacity-50"
                >
                    {salvando ? "Salvando..." : "Salvar Alterações"}
                </button>
            </form>
        </div>
    );
}