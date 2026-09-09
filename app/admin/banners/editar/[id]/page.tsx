"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import ModalRecorteImagem from "@/components/ModalRecorteImagem";

export default function EditarBanner() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [carregandoDados, setCarregandoDados] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [imagemAtual, setImagemAtual] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imagemParaRecortar, setImagemParaRecortar] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");

  useEffect(() => {
    async function carregarBanner() {
      const { data: sessao } = await supabase.auth.getSession();
      if (!sessao.session) {
        router.push("/login");
        return;
      }

      const { data: banner, error } = await supabase
        .from("banners")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !banner) {
        setErro("Banner não encontrado.");
        setCarregandoDados(false);
        return;
      }

      setImagemAtual(banner.imagem_url);
      setTitulo(banner.titulo || "");
      setSubtitulo(banner.subtitulo || "");

      setCarregandoDados(false);
    }

    carregarBanner();
  }, [id, router]);

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
    setSalvando(true);

    let urlImagemFinal = imagemAtual;

    if (arquivo) {
      const nomeArquivo = Date.now() + "-" + arquivo.name;

      const { error: erroUpload } = await supabase.storage
        .from("banners")
        .upload(nomeArquivo, arquivo);

      if (erroUpload) {
        setErro("Erro ao enviar a nova imagem. Tente novamente.");
        console.error(erroUpload);
        setSalvando(false);
        return;
      }

      const { data: urlPublica } = supabase.storage
        .from("banners")
        .getPublicUrl(nomeArquivo);

      urlImagemFinal = urlPublica.publicUrl;
    }

    const { error } = await supabase
      .from("banners")
      .update({
        imagem_url: urlImagemFinal,
        titulo,
        subtitulo,
      })
      .eq("id", id);

    setSalvando(false);

    if (error) {
      setErro("Erro ao salvar as alterações. Tente novamente.");
      console.error(error);
    } else {
      router.push("/admin/banners");
    }
  }

  if (carregandoDados) {
    return (
      <main className="max-w-2xl mx-auto p-6">
        <p className="text-gray-500">Carregando dados do banner...</p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <Link href="/admin/banners" className="text-blue-600 hover:underline">
        ← Voltar aos banners
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-6">Editar Banner</h1>

      <form onSubmit={handleSalvar} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Imagem do Banner</label>

          <img
            src={preview || imagemAtual}
            alt="Banner"
            className="w-full h-48 object-cover rounded-lg mb-3"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleSelecionarArquivo}
            className="w-full border rounded-lg px-4 py-2"
          />
          <p className="text-xs text-gray-400 mt-1">
            Deixe em branco para manter a imagem atual, ou escolha um novo arquivo para substituí-la
          </p>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Subtítulo</label>
          <input
            type="text"
            value={subtitulo}
            onChange={(e) => setSubtitulo(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {erro && <p className="text-red-600 text-sm">{erro}</p>}

        <button
          type="submit"
          disabled={salvando}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Salvar Alterações"}
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
    </main>
  );
}