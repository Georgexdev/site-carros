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
            <main className="max-w-2xl mx-auto p-6">
                <p className="text-gray-500">Carregando...</p>
            </main>
        );
    }

    return (
        <main className="max-w-2xl mx-auto p-6">
            <Link href="/admin" className="text-blue-600 hover:underline">
                ← Voltar ao painel
            </Link>

            <h1 className="text-2xl font-bold mt-4 mb-6">Configurações da Loja</h1>

            <form onSubmit={handleSalvar} className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Sobre a loja</label>
                    <textarea
                        value={sobre}
                        onChange={(e) => setSobre(e.target.value)}
                        rows={6}
                        placeholder="Conte um pouco sobre a história e os diferenciais da sua loja..."
                        className="w-full border rounded-lg px-4 py-2"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Este texto será exibido na página "Sobre" do site.
                    </p>
                </div>

                {erro && <p className="text-red-600 text-sm">{erro}</p>}
                {sucesso && <p className="text-green-600 text-sm">Alterações salvas com sucesso!</p>}

                <button
                    type="submit"
                    disabled={salvando}
                    className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                    {salvando ? "Salvando..." : "Salvar Alterações"}
                </button>
            </form>
        </main>
    );
}