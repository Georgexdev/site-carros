"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";

export default function Admin() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function verificarSessao() {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/login");
      } else {
        setUsuario(data.session.user);
        setCarregando(false);
      }
    }

    verificarSessao();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (carregando) {
    return (
      <main className="max-w-6xl mx-auto p-6">
        <p className="text-gray-500">Verificando acesso...</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Sair
        </button>
      </div>

      <p className="text-gray-600 mb-6">
        Bem-vindo, {usuario?.email}!
      </p>

      <Link
        href="/admin/novo-carro"
        className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
      >
        + Cadastrar Novo Carro
      </Link>
    </main>
  );
}