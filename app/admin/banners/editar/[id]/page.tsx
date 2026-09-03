"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function EditarBanner() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [carregandoDados, setCarregandoDados] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [imagemUrl, setImagemUrl] = useState("");
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [ordem, setOrdem] = useState("0");

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

      setImagemUrl(banner.imagem_url);
      setTitulo(banner.titulo || "");
      setSubtitulo(banner.subtitulo || "");
      setOrdem(String(banner.ordem));

      setCarregandoDados(false);
    }

    carregarBanner();
  }, [id, router]);

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setSalvando(true);

    const { error } = await supabase
      .from("banners")
      .update({
        imagem_url: imagemUrl,
        titulo,
        subtitulo,
        ordem: Number(ordem),
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
          <label className="block text-sm text-gray-600 mb-1">URL da Imagem</label>
          <input
            type="text"
            value={imagemUrl}
            onChange={(e) => setImagemUrl(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
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

        <div>
          <label className="block text-sm text-gray-600 mb-1">Ordem de exibição</label>
          <input
            type="number"
            value={ordem}
            onChange={(e) => setOrdem(e.target.value)}
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
    </main>
  );
}