"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Banner } from "@/types/car";
import Link from "next/link";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import BannerItem from "@/components/BannerItem";

export default function GerenciarBanners() {
    const router = useRouter();
    const [banners, setBanners] = useState<Banner[]>([]);
    const [carregando, setCarregando] = useState(true);

    const sensors = useSensors(useSensor(PointerSensor));

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

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const indiceAntigo = banners.findIndex((b) => b.id === active.id);
        const indiceNovo = banners.findIndex((b) => b.id === over.id);

        const novaLista = arrayMove(banners, indiceAntigo, indiceNovo);
        setBanners(novaLista);

        const atualizacoes = novaLista.map((banner, index) =>
            supabase.from("banners").update({ ordem: index }).eq("id", banner.id)
        );

        await Promise.all(atualizacoes);
    }

    if (carregando) {
        return (
            <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
                <p className="text-muted">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
            <Link href="/admin" className="inline-flex items-center gap-1 text-sm font-semibold text-gold-text hover:underline">
                ← Voltar aos veículos
            </Link>

            <div className="flex justify-between items-center mt-4 mb-6">
                <h1 className="font-display text-3xl sm:text-4xl text-ink">Banners</h1>
                <Link
                    href="/admin/banners/novo"
                    className="h-11 px-5 inline-flex items-center rounded-xl bg-gold hover:bg-gold-light text-malu-black text-sm font-bold transition-colors"
                >
                    + Novo banner
                </Link>
            </div>

            {banners.length === 0 ? (
                <p className="text-muted">Nenhum banner cadastrado ainda.</p>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={banners.map((b) => b.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3">
                            {banners.map((banner) => (
                                <BannerItem
                                    key={banner.id}
                                    banner={banner}
                                    onAlternarAtivo={handleAlternarAtivo}
                                    onExcluir={handleExcluir}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
}