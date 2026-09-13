"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Phone, MessageCircle, Menu, X } from "lucide-react";

export default function Header() {
    const [menuAberto, setMenuAberto] = useState(false);
    const [rolado, setRolado] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === "/";
    const isAdmin = pathname.startsWith("/admin");

    useEffect(() => {
        function handleScroll() {
            setRolado(window.scrollY > 20);
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const transparente = isHome && !rolado;

    if (isAdmin) {
        return null;
    }

    return (
        <header className={isHome ? "fixed top-0 left-0 right-0 z-50" : "relative"}>
            <div
                className={
                    "text-white text-xs py-2 px-4 flex justify-between items-center transition-colors duration-300 " +
                    (transparente ? "bg-transparent" : "bg-gray-900")
                }
            >
                <span>Horário de atendimento: Seg a Sexta - 8h às 17h | Sáb - 8h às 12h</span>
            </div>

            <div
                className={
                    "text-white px-4 py-3 flex items-center justify-between transition-colors duration-300 " +
                    (transparente ? "bg-transparent" : "bg-black")
                }
            >
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                        CT
                    </div>
                    <span className="text-xl font-bold">MALU VEICULOS</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/estoque" className="hover:text-gray-300">
                        ESTOQUE
                    </Link>
                    <Link href="/vender" className="hover:text-gray-300">
                        VENDA SEU CARRO
                    </Link>
                    <Link href="/sobre" className="hover:text-gray-300">
                        SOBRE
                    </Link>
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <a href="tel:5571999999999" className="flex items-center gap-1 text-sm hover:text-gray-300">
                        <Phone size={16} />
                        (71) 99999-9999
                    </a>

                    <a
                        href="https://wa.me/5571999999999"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 p-2 rounded-full hover:bg-green-600"
                    >
                        <MessageCircle size={20} />
                    </a>
                </div>

                <button
                    onClick={() => setMenuAberto(true)}
                    className="md:hidden"
                    aria-label="Abrir menu"
                >
                    <Menu size={26} />
                </button>
            </div>

            {menuAberto && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setMenuAberto(false)}
                    />

                    <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-lg flex flex-col p-6">
                        <button
                            onClick={() => setMenuAberto(false)}
                            className="self-end mb-6 text-gray-500"
                            aria-label="Fechar menu"
                        >
                            <X size={24} />
                        </button>

                        <nav className="flex flex-col gap-5 text-gray-800 font-medium">
                            <Link href="/estoque" onClick={() => setMenuAberto(false)}>
                                ESTOQUE
                            </Link>
                            <Link href="/vender" onClick={() => setMenuAberto(false)}>
                                VENDA SEU CARRO
                            </Link>
                            <Link href="/sobre" onClick={() => setMenuAberto(false)}>
                                SOBRE
                            </Link>
                        </nav>

                        <div className="mt-8 pt-6 border-t flex flex-col gap-4">
                            <a
                                href="tel:5571999999999"
                                className="flex items-center gap-2 text-gray-700"
                            >
                                <Phone size={18} />
                                (71) 99999-9999
                            </a>

                            <a
                                href="https://wa.me/5571999999999"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg w-fit"
                            >
                                <MessageCircle size={18} />
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}