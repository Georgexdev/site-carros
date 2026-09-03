"use client";

import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";

export default function Header() {
    return (
        <header>
            <div className="bg-gray-900 text-white text-xs py-2 px-4 flex justify-between items-center">
                <span>Horário de atendimento: Seg a Sexta - 8h às 17h | Sáb - 8h às 12h</span>
            </div>

            <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold">
                    Concessionária Teste
                </Link>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/" className="hover:text-gray-300">
                        ESTOQUE
                    </Link>
                    <Link href="/vender" className="hover:text-gray-300">
                        VENDA SEU CARRO
                    </Link>
                    <Link href="/sobre" className="hover:text-gray-300">
                        SOBRE
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <a href="tel:5571999999999" className="flex items-center gap-1 text-sm hover:text-gray-300">
                        <Phone size={16} />
                        (71) 99999-9999
                    </a>

                    <a href="https://wa.me/5571999999999"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 p-2 rounded-full hover:bg-green-600"
                    >
                        <MessageCircle size={20} />
                    </a>
                </div>
            </div>
        </header>
    );
}