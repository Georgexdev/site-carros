"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Banner } from "@/types/car";

export default function BannerCarrossel() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [indiceAtual, setIndiceAtual] = useState(0);
    const posicaoInicial = useRef(0);
    const posicaoFinal = useRef(0);

    useEffect(() => {
        async function buscarBanners() {
            const { data } = await supabase
                .from("banners")
                .select("*")
                .eq("ativo", true)
                .order("ordem", { ascending: true });

            if (data) {
                setBanners(data as Banner[]);
            }
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

    if (banners.length === 0) {
        return null;
    }

    const banner = banners[indiceAtual];

    return (
        <div
            className="relative w-full h-[400px] overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <img
                src={banner.imagem_url}
                alt={banner.titulo || "Banner"}
                className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white text-center px-4">
                {banner.titulo && (
                    <h2 className="text-4xl font-bold mb-2">{banner.titulo}</h2>
                )}
                {banner.subtitulo && (
                    <p className="text-lg">{banner.subtitulo}</p>
                )}
            </div>

            {banners.length > 1 && (
                <>
                    <button
                        onClick={irParaAnterior}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70"
                    >
                        ‹
                    </button>

                    <button
                        onClick={irParaProxima}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70"
                    >
                        ›
                    </button>

                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                        {banners.map((b, index) => (
                            <button
                                key={b.id}
                                onClick={() => setIndiceAtual(index)}
                                className={
                                    "w-2.5 h-2.5 rounded-full " +
                                    (index === indiceAtual ? "bg-white" : "bg-white/50")
                                }
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}