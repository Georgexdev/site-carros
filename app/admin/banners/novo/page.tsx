"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function NovoBanner() {
    const router = useRouter();
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    const [imagemUrl, setImagemUrl] = useState("");
    const [titulo, setTitulo] = useState("");
    const [subtitulo, setSubtitulo] = useState("");
    const [ordem, setOrdem] = useState("0");

    async function handleSalvar(e: React.FormEvent) {
        e.preventDefault();
        setErro("");
        setSalvando(true);

        const { data: sessao } = await supabase.auth.getSession();
        if (!sessao.session) {
            router.push("/login");
            return;
        }

        const { data: empresa } = await supabase
            .from("empresas")
            .select("id")
            .eq("nome", "Concessionária Teste")
            .single();

        const { error } = await supabase.from("banners").insert({
            empresa_id: empresa?.id,
            imagem_url: imagemUrl,
            titulo,
            subtitulo,
            ordem: Number(ordem),
            ativo: true,
        });

        setSalvando(false);

        if (error) {
            setErro("Erro ao salvar o banner. Tente novamente.");
            console.error(error);
        } else {
            router.push("/admin/banners");
        }
    }

    return (
        <main className="max-w-2xl mx-auto p-6">
            <Link href="/admin/banners" className="text-blue-600 hover:underline">
                ← Voltar aos banners
            </Link>

            <h1 className="text-2xl font-bold mt-4 mb-6">Novo Banner</h1>

            <form onSubmit={handleSalvar} className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-600 mb-1">URL da Imagem</label>
                    <input
                        type="text"
                        value={imagemUrl}
                        onChange={(e) => setImagemUrl(e.target.value)}
                        required
                        placeholder="https://..."
                        className="w-full border rounded-lg px-4 py-2"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Recomendado: imagem larga, formato paisagem (ex: 1600x600 pixels)
                    </p>
                </div>

                <div>
                    <label className="block text-sm text-gray-600 mb-1">Título</label>
                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Ex: DESCUBRA SEU PRÓXIMO CARRO"
                        className="w-full border rounded-lg px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-600 mb-1">Subtítulo</label>
                    <input
                        type="text"
                        value={subtitulo}
                        onChange={(e) => setSubtitulo(e.target.value)}
                        placeholder="Ex: Explore nosso estoque completo!"
                        className="w-full border rounded-lg px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-600 mb-1">Ordem de exibição</label>
                    <input
                        type="number"
                        value={ordem}
                        onChange={(e) => setOrdem(e.target.value)}
                        className="w-full border rounded-lg px-4 py-2"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Banners com número menor aparecem primeiro no carrossel
                    </p>
                </div>

                {erro && <p className="text-red-600 text-sm">{erro}</p>}

                <button
                    type="submit"
                    disabled={salvando}
                    className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                    {salvando ? "Salvando..." : "Salvar Banner"}
                </button>
            </form>
        </main>
    );
}