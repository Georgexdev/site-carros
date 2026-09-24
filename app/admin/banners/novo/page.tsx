"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import ModalRecorteImagem from "@/components/ModalRecorteImagem";

export default function NovoBanner() {
    const router = useRouter();
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    const [arquivo, setArquivo] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [imagemParaRecortar, setImagemParaRecortar] = useState<string | null>(null);
    const [titulo, setTitulo] = useState("");
    const [subtitulo, setSubtitulo] = useState("");

    function handleSelecionarArquivo(e: React.ChangeEvent<HTMLInputElement>) {
        const arquivoSelecionado = e.target.files?.[0];
        if (arquivoSelecionado) {
            setImagemParaRecortar(URL.createObjectURL(arquivoSelecionado));
        }
    }

    function handleConfirmarRecorte(arquivoRecortado: File) {
        setArquivo(arquivoRecortado);
        setPreview(URL.createObjectURL(arquivoRecortado));
        setImagemParaRecortar(null);
    }

    function handleCancelarRecorte() {
        setImagemParaRecortar(null);
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
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
            <Link href="/admin/banners" className="inline-flex items-center gap-1 text-sm font-semibold text-gold-text hover:underline">
                ← Voltar aos banners
            </Link>

            <h1 className="font-display text-3xl sm:text-4xl text-ink mt-3 mb-6">Novo banner</h1>

            <form onSubmit={handleSalvar} className="bg-white border border-line rounded-2xl p-5 sm:p-8 space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-ink mb-2">Imagem do Banner</label>

                    {preview && (
                        <img
                            src={preview}
                            alt="Pré-visualização"
                            className="w-full h-48 object-cover rounded-xl mb-3"
                        />
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleSelecionarArquivo}
                        required
                        className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                    />
                    <p className="text-xs text-muted mt-1.5">
                        Recomendado: imagem larga, formato paisagem (ex: 1600x600 pixels)
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-ink mb-2">Título</label>
                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Ex: DESCUBRA SEU PRÓXIMO CARRO"
                        className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-ink mb-2">Subtítulo</label>
                    <input
                        type="text"
                        value={subtitulo}
                        onChange={(e) => setSubtitulo(e.target.value)}
                        placeholder="Ex: Explore nosso estoque completo!"
                        className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                    />
                </div>

                {erro && <p className="text-[#B42318] text-sm font-medium">{erro}</p>}

                <button
                    type="submit"
                    disabled={salvando}
                    className="w-full h-13 min-h-[52px] rounded-xl bg-malu-black text-gold-light font-bold hover:bg-gold hover:text-malu-black transition-colors disabled:opacity-50"
                >
                    {salvando ? "Enviando..." : "Salvar Banner"}
                </button>
            </form>

            {imagemParaRecortar && (
                <ModalRecorteImagem
                    imagemSrc={imagemParaRecortar}
                    aspecto={16 / 9}
                    onConfirmar={handleConfirmarRecorte}
                    onCancelar={handleCancelarRecorte}
                />
            )}
        </div>
    );
}