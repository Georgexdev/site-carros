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
    <main className="max-w-md mx-auto p-6">
      <Link href="/admin" className="text-blue-600 hover:underline">
        ← Voltar ao painel
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-6">Alterar Senha</h1>

      <form onSubmit={handleSalvar} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Nova senha</label>
          <div className="relative">
            <input
              type={mostrarSenha ? "text" : "password"}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full border rounded-lg px-4 py-2 pr-12"
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Confirmar nova senha</label>
          <input
            type={mostrarSenha ? "text" : "password"}
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {erro && <p className="text-red-600 text-sm">{erro}</p>}
        {sucesso && <p className="text-green-600 text-sm">Senha alterada com sucesso!</p>}

        <button
          type="submit"
          disabled={salvando}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Alterar Senha"}
        </button>
      </form>
    </main>
  );
}