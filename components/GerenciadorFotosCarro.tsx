"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FotoCarro } from "@/types/car";
import ModalRecorteImagem from "@/components/ModalRecorteImagem";
import { X, Crop } from "lucide-react";

type Props = {
    carroId: string;
};

const TAMANHO_MAXIMO_MB = 5;

function traduzirErroUpload(mensagem: string): string {
    if (mensagem.includes("exceeded the maximum allowed size")) {
        return "A imagem é muito grande. O tamanho máximo permitido é " + TAMANHO_MAXIMO_MB + "MB.";
    }
    if (mensagem.includes("mime type") || mensagem.includes("not supported")) {
        return "Tipo de arquivo não permitido. Envie apenas imagens JPG, PNG ou WEBP.";
    }
    return "Não foi possível enviar a imagem. Tente novamente.";
}

export default function GerenciadorFotosCarro({ carroId }: Props) {
    const [fotos, setFotos] = useState<FotoCarro[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState("");
    const [fotoEditando, setFotoEditando] = useState<FotoCarro | null>(null);

    useEffect(() => {
        buscarFotos();
    }, [carroId]);

    async function buscarFotos() {
        const { data } = await supabase
            .from("fotos_carros")
            .select("*")
            .eq("carro_id", carroId)
            .order("ordem", { ascending: true });

        if (data) {
            setFotos(data as FotoCarro[]);
        }
        setCarregando(false);
    }

    async function handleSelecionarArquivos(e: React.ChangeEvent<HTMLInputElement>) {
        const arquivosSelecionados = Array.from(e.target.files || []);
        if (arquivosSelecionados.length === 0) return;

        setEnviando(true);
        setErro("");

        let ordemAtual = fotos.length;
        let algumErro = "";

        for (const arquivo of arquivosSelecionados) {
            const nomeArquivo = Date.now() + "-" + arquivo.name;

            const { error: erroUpload } = await supabase.storage
                .from("fotos-carros")
                .upload(nomeArquivo, arquivo);

            if (!erroUpload) {
                const { data: urlPublica } = supabase.storage
                    .from("fotos-carros")
                    .getPublicUrl(nomeArquivo);

                await supabase.from("fotos_carros").insert({
                    carro_id: carroId,
                    url: urlPublica.publicUrl,
                    ordem: ordemAtual,
                });

                ordemAtual++;
            } else {
                console.error("Erro ao enviar foto:", erroUpload);
                console.log("Mensagem exata do erro:", JSON.stringify(erroUpload.message));
                algumErro = traduzirErroUpload(erroUpload.message);
            }
        }

        if (algumErro) {
            setErro(algumErro);
        }

        await buscarFotos();
        setEnviando(false);
        e.target.value = "";
    }

    async function handleConfirmarRecorte(arquivoRecortado: File) {
        if (!fotoEditando) return;

        setEnviando(true);
        setErro("");

        const nomeArquivo = Date.now() + "-" + arquivoRecortado.name;

        const { error: erroUpload } = await supabase.storage
            .from("fotos-carros")
            .upload(nomeArquivo, arquivoRecortado);

        if (!erroUpload) {
            const { data: urlPublica } = supabase.storage
                .from("fotos-carros")
                .getPublicUrl(nomeArquivo);

            await supabase
                .from("fotos_carros")
                .update({ url: urlPublica.publicUrl })
                .eq("id", fotoEditando.id);

            await buscarFotos();
        } else {
            console.error("Erro ao enviar foto recortada:", erroUpload);
            setErro(traduzirErroUpload(erroUpload.message));
        }

        setFotoEditando(null);
        setEnviando(false);
    }

    async function handleExcluirFoto(foto: FotoCarro) {
        const confirmar = window.confirm("Deseja excluir esta foto?");
        if (!confirmar) return;

        const { error } = await supabase.from("fotos_carros").delete().eq("id", foto.id);

        if (!error) {
            setFotos((atual) => atual.filter((f) => f.id !== foto.id));
        }
    }

    if (carregando) {
        return <p className="text-gray-500 text-sm">Carregando fotos...</p>;
    }

    return (
        <div>
            <label className="block text-sm text-gray-600 mb-2">Fotos do Carro</label>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                {fotos.map((foto) => (
                    <div key={foto.id} className="relative group">
                        <img
                            src={foto.url}
                            alt="Foto do carro"
                            className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                            type="button"
                            onClick={() => setFotoEditando(foto)}
                            className="absolute bottom-1 left-1 bg-black/60 text-white rounded-full p-1 hover:bg-blue-600"
                            title="Recortar foto"
                        >
                            <Crop size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() => handleExcluirFoto(foto)}
                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-600"
                            title="Excluir foto"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}

                <label className="flex items-center justify-center h-24 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400 text-gray-400 text-sm text-center px-1">
                    {enviando ? "Enviando..." : "+ Adicionar"}
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleSelecionarArquivos}
                        disabled={enviando}
                        className="hidden"
                    />
                </label>
            </div>

            {erro && <p className="text-red-600 text-sm mb-2">{erro}</p>}

            <p className="text-xs text-gray-400">
                A primeira foto adicionada é usada como capa nos cards do site. Use o ícone de recorte para ajustar o enquadramento de uma foto. Tamanho máximo: {TAMANHO_MAXIMO_MB}MB por imagem.
            </p>

            {fotoEditando && (
                <ModalRecorteImagem
                    imagemSrc={fotoEditando.url}
                    aspecto={4 / 3}
                    onConfirmar={handleConfirmarRecorte}
                    onCancelar={() => setFotoEditando(null)}
                />
            )}
        </div>
    );
}