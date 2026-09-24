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
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
        <p className="text-muted">Carregando dados do banner...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
      <Link href="/admin/banners" className="inline-flex items-center gap-1 text-sm font-semibold text-gold-text hover:underline">
        ← Voltar aos banners
      </Link>

      <h1 className="font-display text-3xl sm:text-4xl text-ink mt-3 mb-6">Editar banner</h1>

      <form onSubmit={handleSalvar} className="bg-white border border-line rounded-2xl p-5 sm:p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-ink mb-2">Imagem do Banner</label>

          <img
            src={preview || imagemAtual}
            alt="Banner"
            className="w-full h-48 object-cover rounded-xl mb-3"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleSelecionarArquivo}
            className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
          <p className="text-xs text-muted mt-1.5">
            Deixe em branco para manter a imagem atual, ou escolha um novo arquivo para substituí-la
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-2">Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-2">Subtítulo</label>
          <input
            type="text"
            value={subtitulo}
            onChange={(e) => setSubtitulo(e.target.value)}
            className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
        </div>

        {erro && <p className="text-[#B42318] text-sm font-medium">{erro}</p>}

        <button
          type="submit"
          disabled={salvando}
          className="w-full h-13 min-h-[52px] rounded-xl bg-malu-black text-gold-light font-bold hover:bg-gold hover:text-malu-black transition-colors disabled:opacity-50"
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
    </div>
  );
}