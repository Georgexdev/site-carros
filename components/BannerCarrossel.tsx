"use client";

import { useEffect, useState, useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { EMPRESA_ID } from "@/lib/empresa";
import { Banner } from "@/types/car";

type Props = {
    // Conteúdo exibido quando não há nenhum banner ativo cadastrado.
    semBanners?: ReactNode;
};

export default function BannerCarrossel({ semBanners = null }: Props) {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [carregado, setCarregado] = useState(false);
    const [indiceAtual, setIndiceAtual] = useState(0);
    const posicaoInicial = useRef(0);
    const posicaoFinal = useRef(0);

    useEffect(() => {
        async function buscarBanners() {
            let consulta = supabase.from("banners").select("*").eq("ativo", true);
            if (EMPRESA_ID) consulta = consulta.eq("empresa_id", EMPRESA_ID);

            const { data } = await consulta.order("ordem", { ascending: true });

            if (data) {
                setBanners(data as Banner[]);
            }
            setCarregado(true);
        }

        buscarBanners();
    }, []);

    function irParaAnterior() {
        setIndiceAtual((atual) => (atual === 0 ? banners.length - 1 : atual - 1));
    }

    function irParaProxima() {
        setIndiceAtual((atual) => (atual === banners.length - 1 ? 0 : atual + 1));
    }

    function handleTouchStart(e: React.TouchEvent) {
        posicaoInicial.current = e.touches[0].clientX;
    }

    function handleTouchEnd(e: React.TouchEvent) {
        posicaoFinal.current = e.changedTouches[0].clientX;
        const diferenca = posicaoInicial.current - posicaoFinal.current;

        const distanciaMinima = 50;

        if (diferenca > distanciaMinima) {
            irParaProxima();
        } else if (diferenca < -distanciaMinima) {
            irParaAnterior();
        }
    }

    if (!carregado) {
        return <div className="w-full h-[420px] md:h-[560px] bg-malu-black" aria-hidden="true" />;
    }

    if (banners.length === 0) {
        return <>{semBanners}</>;
    }

    const banner = banners[indiceAtual];

    return (
        <div
            className="relative w-full h-[420px] md:h-[560px] overflow-hidden bg-malu-black"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <img
                src={banner.imagem_url}
                alt={banner.titulo || "Banner"}
                className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />

            {(banner.titulo || banner.subtitulo) && (
                <div className="absolute inset-x-0 bottom-0 pb-16 md:pb-20">
                    <div className="max-w-6xl mx-auto px-6 flex flex-col gap-3">
                        {banner.titulo && (
                            <h2 className="font-display text-4xl md:text-6xl leading-tight text-[#F4EEE2] max-w-3xl">
                                {banner.titulo}
                            </h2>
                        )}
                        {banner.subtitulo && (
                            <p className="text-base md:text-lg text-[#E9E3D6] max-w-2xl">{banner.subtitulo}</p>
                        )}
                        <span className="block w-16 h-0.5 bg-gold mt-2" aria-hidden="true" />
                    </div>
                </div>
            )}

            {banners.length > 1 && (
                <>
                    <button
                        onClick={irParaAnterior}
                        aria-label="Banner anterior"
                        className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-malu-black/60 border border-gold/50 text-gold-light items-center justify-center hover:bg-malu-black/80 transition-colors"
                    >
                        <ChevronLeft size={22} aria-hidden="true" />
                    </button>

                    <button
                        onClick={irParaProxima}
                        aria-label="Próximo banner"
                        className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-malu-black/60 border border-gold/50 text-gold-light items-center justify-center hover:bg-malu-black/80 transition-colors"
                    >
                        <ChevronRight size={22} aria-hidden="true" />
                    </button>

                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
                        {banners.map((b, index) => (
                            <button
                                key={b.id}
                                onClick={() => setIndiceAtual(index)}
                                aria-label={"Ir para banner " + (index + 1)}
                                aria-current={index === indiceAtual}
                                className="w-9 h-9 flex items-center justify-center"
                            >
                                <span
                                    className={
                                        "h-1 rounded-full block transition-all " +
                                        (index === indiceAtual ? "w-8 bg-gold" : "w-4 bg-white/50")
                                    }
                                />
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
