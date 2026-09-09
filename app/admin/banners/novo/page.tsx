"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function NovoBanner() {
    const router = useRouter();
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    const [arquivo, setArquivo] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [titulo, setTitulo] = useState("");
    const [subtitulo, setSubtitulo] = useState("");

    function handleSelecionarArquivo(e: React.ChangeEvent<HTMLInputElement>) {
        const arquivoSelecionado = e.target.files?.[0];
        if (arquivoSelecionado) {
            setArquivo(arquivoSelecionado);
            setPreview(URL.createObjectURL(arquivoSelecionado));
        }
    }

    async function handleSalvar(e: React.FormEvent) {
        e.preventDefault();
        setErro("");

        if (!arquivo) {
            setErro("Selecione uma imagem para o banner.");
            return;
        }

        setSalvando(true);

        const { data: sessao } = await supabase.auth.getSession();
        if (!sessao.session) {
            router.push("/login");
            return;
        }

        const nomeArquivo = Date.now() + "-" + arquivo.name;

        const { error: erroUpload } = await supabase.storage
            .from("banners")
            .upload(nomeArquivo, arquivo);

        if (erroUpload) {
            setErro("Erro ao enviar a imagem. Tente novamente.");
            console.error(erroUpload);
            setSalvando(false);
            return;
        }

        const { data: urlPublica } = supabase.storage
            .from("banners")
            .getPublicUrl(nomeArquivo);

        const { data: administrador } = await supabase
            .from("administradores")
            .select("empresa_id")
            .eq("id", sessao.session.user.id)
            .single();

        const { error } = await supabase.from("banners").insert({
            empresa_id: administrador?.empresa_id,
            imagem_url: urlPublica.publicUrl,
            titulo,
            subtitulo,
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
                    <label className="block text-sm text-gray-600 mb-1">Imagem do Banner</label>

                    {preview && (
                        <img
                            src={preview}
                            alt="Pré-visualização"
                            className="w-full h-48 object-cover rounded-lg mb-3"
                        />
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleSelecionarArquivo}
                        required
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

                {erro && <p className="text-red-600 text-sm">{erro}</p>}

                <button
                    type="submit"
                    disabled={salvando}
                    className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                    {salvando ? "Enviando..." : "Salvar Banner"}
                </button>
            </form>
        </main>
    );
}