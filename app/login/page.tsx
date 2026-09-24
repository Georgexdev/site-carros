"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import LogoMalu from "@/components/LogoMalu";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    setCarregando(false);

    if (error) {
      setErro("Email ou senha incorretos.");
    } else {
      router.push("/admin");
    }
  }

  const campo =
    "w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] pl-11 text-[15px] text-ink focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30";

  return (
    <div className="min-h-screen bg-malu-black flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" aria-label="Voltar ao site" className="mb-10">
        <LogoMalu />
      </Link>

      <div className="w-full max-w-md bg-white rounded-2xl border-t-4 border-gold p-6 sm:p-10">
        <h1 className="font-display text-3xl text-ink">Painel administrativo</h1>
        <p className="text-sm text-muted mt-1.5 mb-8">Entre com seu e-mail e senha.</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="login-email" className="block text-sm font-semibold text-ink mb-2">E-mail</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-text" aria-hidden="true" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className={campo + " pr-4"}
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-senha" className="block text-sm font-semibold text-ink mb-2">Senha</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-text" aria-hidden="true" />
              <input
                id="login-senha"
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                autoComplete="current-password"
                className={campo + " pr-12"}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-muted hover:text-ink"
              >
                {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {erro && <p className="text-[#B42318] text-sm font-medium" role="alert">{erro}</p>}

          <button
            type="submit"
            disabled={carregando}
            className="w-full h-13 min-h-[52px] rounded-xl bg-malu-black text-gold-light font-bold hover:bg-gold hover:text-malu-black transition-colors disabled:opacity-50"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>

      <Link href="/" className="mt-8 text-sm text-muted-dark hover:text-gold">
        ← Voltar ao site
      </Link>
    </div>
  );
}
