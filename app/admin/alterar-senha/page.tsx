"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function AlterarSenha() {
  const router = useRouter();
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setSucesso(false);

    if (novaSenha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setSalvando(true);

    const { error } = await supabase.auth.updateUser({ password: novaSenha });

    setSalvando(false);

    if (error) {
      setErro("Erro ao alterar a senha. Tente novamente.");
      console.error(error);
    } else {
      setSucesso(true);
      setNovaSenha("");
      setConfirmarSenha("");
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-8 py-8">
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm font-semibold text-gold-text hover:underline">
        ← Voltar aos veículos
      </Link>

      <h1 className="font-display text-3xl sm:text-4xl text-ink mt-3 mb-6">Alterar senha</h1>

      <form onSubmit={handleSalvar} className="bg-white border border-line rounded-2xl p-5 sm:p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-ink mb-2">Nova senha</label>
          <div className="relative">
            <input
              type={mostrarSenha ? "text" : "password"}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] pl-4 pr-12 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-muted hover:text-ink"
            >
              {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-2">Confirmar nova senha</label>
          <input
            type={mostrarSenha ? "text" : "password"}
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
        </div>

        {erro && <p className="text-[#B42318] text-sm font-medium">{erro}</p>}
        {sucesso && <p className="text-[#0F7B3C] text-sm font-medium">Senha alterada com sucesso!</p>}

        <button
          type="submit"
          disabled={salvando}
          className="w-full h-13 min-h-[52px] rounded-xl bg-malu-black text-gold-light font-bold hover:bg-gold hover:text-malu-black transition-colors disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Alterar Senha"}
        </button>
      </form>
    </div>
  );
}