"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Car, ExternalLink, Image as ImageIcon, KeyRound, LogOut, Menu, PlusCircle, Store, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Administrador } from "@/types/car";
import LogoMalu from "@/components/LogoMalu";

type ItemMenu = {
  href: string;
  label: string;
  Icone: typeof Car;
  visivel: boolean;
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [administrador, setAdministrador] = useState<Administrador | null>(null);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    async function buscarAdministrador() {
      const { data: sessao } = await supabase.auth.getSession();
      if (!sessao.session) return;

      const { data } = await supabase
        .from("administradores")
        .select("*")
        .eq("id", sessao.session.user.id)
        .single();

      if (data) setAdministrador(data as Administrador);
    }

    buscarAdministrador();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const itens: ItemMenu[] = [
    { href: "/admin", label: "Veículos", Icone: Car, visivel: true },
    { href: "/admin/novo-carro", label: "Cadastrar veículo", Icone: PlusCircle, visivel: !!administrador?.pode_gerenciar_carros },
    { href: "/admin/banners", label: "Banners", Icone: ImageIcon, visivel: !!administrador?.pode_gerenciar_banners },
    { href: "/admin/configuracoes", label: "Dados da loja", Icone: Store, visivel: true },
    { href: "/admin/alterar-senha", label: "Alterar senha", Icone: KeyRound, visivel: true },
  ];

  function estaAtivo(href: string) {
    if (href === "/admin") return pathname === "/admin" || pathname.startsWith("/admin/editar-carro");
    return pathname === href || pathname.startsWith(href + "/");
  }

  const navegacao = (
    <nav aria-label="Painel" className="flex flex-col gap-1">
      {itens.filter((i) => i.visivel).map(({ href, label, Icone }) => {
        const ativo = estaAtivo(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={ativo ? "page" : undefined}
            onClick={() => setMenuAberto(false)}
            className={
              "flex items-center gap-3 h-11 px-3 rounded-lg text-sm font-semibold transition-colors " +
              (ativo ? "bg-gold/15 text-gold" : "text-[#D8D0C0] hover:bg-white/5 hover:text-[#F4EEE2]")
            }
          >
            <Icone size={18} aria-hidden="true" className={ativo ? "text-gold" : "text-muted-soft"} />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  const rodapeMenu = (
    <div className="flex flex-col gap-1 pt-4 border-t border-white/10">
      {administrador && (
        <div className="px-3 pb-3">
          <p className="text-xs text-muted-soft">Conectado como</p>
          <p className="text-sm font-semibold text-[#F4EEE2] truncate">{administrador.nome}</p>
        </div>
      )}
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 h-11 px-3 rounded-lg text-sm font-semibold text-[#D8D0C0] hover:bg-white/5 hover:text-[#F4EEE2] transition-colors"
      >
        <ExternalLink size={18} className="text-muted-soft" aria-hidden="true" />
        Ver site
      </a>
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-3 h-11 px-3 rounded-lg text-sm font-semibold text-[#F2A7A0] hover:bg-white/5 transition-colors text-left"
      >
        <LogOut size={18} aria-hidden="true" />
        Sair da conta
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream md:flex">
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-malu-black border-r border-gold/20 p-5 sticky top-0 h-screen">
        <Link href="/admin" className="px-2 pt-2 pb-2">
          <LogoMalu tamanho="sm" comIcone={false} />
        </Link>
        <span className="px-2 mb-8 mt-2 text-[11px] font-bold tracking-[0.24em] uppercase text-muted-soft">Painel administrativo</span>
        {navegacao}
        <div className="mt-auto">{rodapeMenu}</div>
      </aside>

      <div className="md:hidden sticky top-0 z-30 h-16 px-4 bg-malu-black border-b border-gold/20 flex items-center justify-between">
        <Link href="/admin">
          <LogoMalu tamanho="sm" comIcone={false} />
        </Link>
        <button
          type="button"
          onClick={() => setMenuAberto(true)}
          aria-label="Abrir menu do painel"
          className="w-11 h-11 rounded-full border border-gold/50 flex items-center justify-center text-[#E9E3D6]"
        >
          <Menu size={22} />
        </button>
      </div>

      {menuAberto && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMenuAberto(false)} />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[85%] bg-malu-black border-r border-gold/20 p-5 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <LogoMalu tamanho="sm" comIcone={false} />
              <button
                type="button"
                onClick={() => setMenuAberto(false)}
                aria-label="Fechar menu"
                className="w-11 h-11 flex items-center justify-center text-[#E9E3D6] -mr-2"
              >
                <X size={22} />
              </button>
            </div>
            {navegacao}
            <div className="mt-auto">{rodapeMenu}</div>
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
