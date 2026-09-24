"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Phone, MessageCircle, Menu, X, Clock, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { EMPRESA_ID } from "@/lib/empresa";
import { useLoja } from "@/components/LojaProvider";
import LogoMalu from "@/components/LogoMalu";

const links = [
    { href: "/estoque", label: "Estoque" },
    { href: "/financie", label: "Financie" },
    { href: "/vender", label: "Venda seu carro" },
    { href: "/sobre", label: "Sobre" },
];

export default function Header() {
    const { loja, linkWhatsApp, linkTelefone } = useLoja();
    const [menuAberto, setMenuAberto] = useState(false);
    const [rolado, setRolado] = useState(false);
    const [temBannerAtivo, setTemBannerAtivo] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === "/";
    const isAdmin = pathname.startsWith("/admin") || pathname === "/login";

    useEffect(() => {
        function handleScroll() {
            setRolado(window.scrollY > 20);
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!isHome) return;

        async function verificarBanner() {
            let consulta = supabase.from("banners").select("id").eq("ativo", true);
            if (EMPRESA_ID) consulta = consulta.eq("empresa_id", EMPRESA_ID);

            const { data } = await consulta.limit(1);

            setTemBannerAtivo(!!data && data.length > 0);
        }

        verificarBanner();
    }, [isHome]);

    const transparente = isHome && temBannerAtivo && !rolado;

    if (isAdmin) {
        return null;
    }

    function estaAtivo(href: string) {
        return pathname === href || pathname.startsWith(href + "/") || (href === "/estoque" && pathname.startsWith("/carro/"));
    }

    return (
        <header className={isHome && temBannerAtivo ? "fixed top-0 left-0 right-0 z-50" : "relative z-40"}>
            <div
                className={
                    "hidden sm:flex text-xs text-muted-dark py-2 px-6 lg:px-16 justify-between items-center border-b transition-colors duration-300 " +
                    (transparente ? "bg-transparent border-white/10" : "bg-malu-black border-gold/20")
                }
            >
                <span className="flex items-center gap-2">
                    <Clock size={14} className="text-gold" aria-hidden="true" />
                    {loja.horarioResumo}
                </span>
                <span className="hidden md:flex items-center gap-2">
                    <MapPin size={14} className="text-gold" aria-hidden="true" />
                    {loja.endereco.linha1} · {loja.endereco.cidade}
                </span>
            </div>

            <div
                className={
                    "text-[#E9E3D6] px-4 sm:px-6 lg:px-16 h-16 md:h-20 flex items-center justify-between transition-colors duration-300 " +
                    (transparente ? "bg-gradient-to-b from-black/60 to-transparent" : "bg-malu-black border-b border-gold/20")
                }
            >
                <Link href="/" aria-label={loja.nome + ", página inicial"} className="md:w-72">
                    <span className="md:hidden"><LogoMalu tamanho="sm" comIcone={false} /></span>
                    <span className="hidden md:block"><LogoMalu /></span>
                </Link>

                <nav aria-label="Principal" className="hidden md:flex items-center gap-8 lg:gap-10 text-sm font-semibold tracking-[0.1em] uppercase">
                    {links.map((link) => {
                        const ativo = estaAtivo(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                aria-current={ativo ? "page" : undefined}
                                className={
                                    "py-2.5 border-b-2 transition-colors " +
                                    (ativo ? "text-gold border-gold" : "border-transparent hover:text-gold")
                                }
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="hidden md:flex items-center gap-5 md:w-72 justify-end">
                    <a href={linkTelefone()} className="hidden lg:flex items-center gap-2 text-sm font-semibold hover:text-gold transition-colors">
                        <Phone size={16} className="text-gold" aria-hidden="true" />
                        {loja.telefoneExibicao}
                    </a>

                    <a
                        href={linkWhatsApp()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 h-11 px-4 rounded-full bg-whatsapp hover:bg-whatsapp-hover text-white text-sm font-bold transition-colors"
                    >
                        <MessageCircle size={18} aria-hidden="true" />
                        WhatsApp
                    </a>
                </div>

                <div className="md:hidden flex items-center gap-2">
                    <a
                        href={linkTelefone()}
                        aria-label="Ligar para a loja"
                        className="w-11 h-11 rounded-full border border-gold/50 flex items-center justify-center"
                    >
                        <Phone size={18} className="text-gold" aria-hidden="true" />
                    </a>
                    <button
                        type="button"
                        onClick={() => setMenuAberto(true)}
                        className="w-11 h-11 rounded-full border border-gold/50 flex items-center justify-center"
                        aria-label="Abrir menu"
                    >
                        <Menu size={22} />
                    </button>
                </div>
            </div>

            {menuAberto && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setMenuAberto(false)}
                    />

                    <div className="absolute right-0 top-0 h-full w-80 max-w-[85%] bg-malu-black border-l border-gold/20 shadow-lg flex flex-col p-6">
                        <div className="flex items-center justify-between mb-8">
                            <LogoMalu tamanho="sm" comIcone={false} />
                            <button
                                type="button"
                                onClick={() => setMenuAberto(false)}
                                className="text-[#E9E3D6] w-11 h-11 flex items-center justify-center -mr-2"
                                aria-label="Fechar menu"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <nav aria-label="Principal" className="flex flex-col text-[#E9E3D6] font-semibold tracking-[0.1em] uppercase text-sm">
                            <Link
                                href="/"
                                onClick={() => setMenuAberto(false)}
                                className={"py-4 border-b border-white/10 " + (isHome ? "text-gold" : "")}
                            >
                                Início
                            </Link>
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMenuAberto(false)}
                                    className={"py-4 border-b border-white/10 " + (estaAtivo(link.href) ? "text-gold" : "")}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-auto flex flex-col gap-4 text-sm text-muted-dark">
                            <span className="flex items-center gap-2">
                                <Clock size={16} className="text-gold" aria-hidden="true" />
                                {loja.horarioResumo}
                            </span>
                            <a href={linkTelefone()} className="flex items-center gap-2 text-[#E9E3D6]">
                                <Phone size={16} className="text-gold" aria-hidden="true" />
                                {loja.telefoneExibicao}
                            </a>
                            <a
                                href={linkWhatsApp()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 bg-whatsapp text-white font-bold h-12 rounded-lg"
                            >
                                <MessageCircle size={18} aria-hidden="true" />
                                Falar no WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
