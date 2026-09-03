"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Banner } from "@/types/car";
import Link from "next/link";

export default function GerenciarBanners() {
    const router = useRouter();
    const [banners, setBanners] = useState<Banner[]>([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        async function verificarSessaoEBuscarBanners() {
            const { data: sessao } = await supabase.auth.getSession();

            if (!sessao.session) {
                router.push("/login");
                return;
            }

            const { data, error } = await supabase
                .from("banners")
                .select("*")
                .order("ordem", { ascending: true });

            if (error) {
                console.error("Erro ao buscar banners:", error);
            } else if (data) {
                setBanners(data as Banner[]);
            }

            setCarregando(false);
        }

        verificarSessaoEBuscarBanners();
    }, [router]);

    async function handleAlternarAtivo(banner: Banner) {
        const { error } = await supabase
            .from("banners")
            .update({ ativo: !banner.ativo })
            .eq("id", banner.id);

        if (!error) {
            setBanners((atual) =>
                atual.map((b) => (b.id === banner.id ? { ...b, ativo: !b.ativo } : b))
            );
        }
    }

    async function handleExcluir(banner: Banner) {
        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este banner? Essa ação não pode ser desfeita."
        );

        if (!confirmar) return;

        const { error } = await supabase.from("banners").delete().eq("id", banner.id);

        if (!error) {
            setBanners((atual) => atual.filter((b) => b.id !== banner.id));
        }
    }

    if (carregando) {
        return (
            <main className="max-w-4xl mx-auto p-6">
                <p className="text-gray-500">Carregando...</p>
            </main>
        );
    }

    return (
        <main className="max-w-4xl mx-auto p-6">
            <Link href="/admin" className="text-blue-600 hover:underline">
                ← Voltar ao painel
            </Link>

            <div className="flex justify-between items-center mt-4 mb-6">
                <h1 className="text-2xl font-bold">Gerenciar Banners</h1>
                <Link
                    href="/admin/banners/novo"
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm"
                >
                    + Novo Banner
                </Link>
            </div>

            {banners.length === 0 ? (
                <p className="text-gray-500">Nenhum banner cadastrado ainda.</p>
            ) : (
                <div className="space-y-3">
                    {banners.map((banner) => (
                        <div
                            key={banner.id}
                            className="flex items-center gap-4 justify-between border rounded-lg p-4 bg-white"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={banner.imagem_url}
                                    alt={banner.titulo || "Banner"}
                                    className="w-32 h-16 object-cover rounded-lg flex-shrink-0"
                                />
                                <div>
                                    <p className="font-bold">{banner.titulo || "(sem título)"}</p>
                                    <p className="text-sm text-gray-500">{banner.subtitulo}</p>
                                    <span
                                        className={
                                            "inline-block mt-1 text-xs px-2 py-0.5 rounded-full " +
                                            (banner.ativo
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-500")
                                        }
                                    >
                                        {banner.ativo ? "Ativo" : "Inativo"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Link
                                    href={"/admin/banners/editar/" + banner.id}
                                    className="text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50"
                                >
                                    Editar
                                </Link>
                                <button
                                    onClick={() => handleAlternarAtivo(banner)}
                                    className="text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50"
                                >
                                    {banner.ativo ? "Desativar" : "Ativar"}
                                </button>
                                <button
                                    onClick={() => handleExcluir(banner)}
                                    className="text-sm px-3 py-1.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}