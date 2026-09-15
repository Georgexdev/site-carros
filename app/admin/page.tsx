"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Carro, Administrador } from "@/types/car";
import Link from "next/link";

export default function Admin() {
  const router = useRouter();
  const [administrador, setAdministrador] = useState<Administrador | null>(null);
  const [carros, setCarros] = useState<Carro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [fotosCapas, setFotosCapas] = useState<Record<string, string>>({});

  useEffect(() => {
    async function verificarSessaoEBuscarDados() {
      const { data: sessao } = await supabase.auth.getSession();

      if (!sessao.session) {
        router.push("/login");
        return;
      }

      const { data: admin, error: erroAdmin } = await supabase
        .from("administradores")
        .select("*")
        .eq("id", sessao.session.user.id)
        .single();

      if (erroAdmin || !admin) {
        console.error("Erro ao buscar administrador:", erroAdmin);
        setCarregando(false);
        return;
      }

      setAdministrador(admin as Administrador);

      const { data: listaCarros, error } = await supabase
        .from("carros")
        .select("*")
        .eq("empresa_id", admin.empresa_id)
        .order("criado_em", { ascending: false });

      if (error) {
        console.error("Erro ao buscar carros:", error);
      } else if (listaCarros) {
        setCarros(listaCarros as Carro[]);

        const { data: fotos } = await supabase
          .from("fotos_carros")
          .select("carro_id, url")
          .eq("ordem", 0);

        if (fotos) {
          const mapa: Record<string, string> = {};
          fotos.forEach((foto) => {
            mapa[foto.carro_id] = foto.url;
          });
          setFotosCapas(mapa);
        }
      }

      setCarregando(false);
    }

    verificarSessaoEBuscarDados();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function handleAlternarStatus(carro: Carro) {
    const novoStatus = carro.status === "vendido" ? "disponivel" : "vendido";

    const { error } = await supabase
      .from("carros")
      .update({ status: novoStatus })
      .eq("id", carro.id);

    if (!error) {
      setCarros((atual) =>
        atual.map((c) => (c.id === carro.id ? { ...c, status: novoStatus } : c))
      );
    }
  }

  async function handleAlternarDestaque(carro: Carro) {
    if (!carro.destaque_home) {
      const totalAtual = carros.filter((c) => c.destaque_home).length;
      if (totalAtual >= 3) {
        alert("Já existem 3 veículos em destaque. Remova um antes de adicionar outro.");
        return;
      }
    }

    const { error } = await supabase
      .from("carros")
      .update({ destaque_home: !carro.destaque_home })
      .eq("id", carro.id);

    if (!error) {
      setCarros((atual) =>
        atual.map((c) => (c.id === carro.id ? { ...c, destaque_home: !c.destaque_home } : c))
      );
    }
  }

  async function handleExcluir(carro: Carro) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir " + carro.marca + " " + carro.modelo + "? Essa ação não pode ser desfeita."
    );

    if (!confirmar) return;

    const { error } = await supabase.from("carros").delete().eq("id", carro.id);

    if (!error) {
      setCarros((atual) => atual.filter((c) => c.id !== carro.id));
    }
  }

  if (carregando) {
    return (
      <main className="max-w-6xl mx-auto p-6">
        <p className="text-gray-500">Carregando...</p>
      </main>
    );
  }

  if (!administrador) {
    return (
      <main className="max-w-6xl mx-auto p-6">
        <p className="text-red-600">
          Sua conta ainda não está vinculada a nenhuma empresa. Entre em contato com o suporte.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Sair
        </button>
      </div>

      <p className="text-gray-600 mb-6">Bem-vindo, {administrador.nome}!</p>

      <div className="flex gap-3 mb-8">
        {administrador.pode_gerenciar_carros && (
          <Link
            href="/admin/novo-carro"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
          >
            + Cadastrar Novo Carro
          </Link>
        )}

        {administrador.pode_gerenciar_banners && (
          <Link
            href="/admin/banners"
            className="inline-block bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50"
          >
            Gerenciar Banners
          </Link>
        )}
      </div>

      <h2 className="text-xl font-bold mb-4">Carros Cadastrados ({carros.length})</h2>

      {carros.length === 0 ? (
        <p className="text-gray-500">Nenhum carro cadastrado ainda.</p>
      ) : (
        <div className="space-y-3">
          {carros.map((carro) => (
            <div
              key={carro.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between border rounded-lg p-4 bg-white"
            >
              <div className="flex items-center gap-4">
                <img
                  src={fotosCapas[carro.id] || "https://placehold.co/100x100?text=Sem+foto"}
                  alt={carro.marca + " " + carro.modelo}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div>
                  <p className="font-bold">
                    {carro.marca} {carro.modelo}{" "}
                    <span className="font-normal text-gray-500">{carro.versao}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {carro.ano_fabricacao}/{carro.ano_modelo} • {carro.km.toLocaleString("pt-BR")} km •{" "}
                    {carro.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                  <span
                    className={
                      "inline-block mt-1 text-xs px-2 py-0.5 rounded-full " +
                      (carro.status === "vendido"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700")
                    }
                  >
                    {carro.status === "vendido" ? "Vendido" : "Disponível"}
                  </span>
                </div>
              </div>

              {administrador.pode_gerenciar_carros && (
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={"/admin/editar-carro/" + carro.id}
                    className="text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleAlternarStatus(carro)}
                    className="text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50"
                  >
                    {carro.status === "vendido" ? "Marcar Disponível" : "Marcar Vendido"}
                  </button>
                  <button
                    onClick={() => handleAlternarDestaque(carro)}
                    className={
                      "text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50 " +
                      (carro.destaque_home ? "border-yellow-400 bg-yellow-50 text-yellow-700" : "")
                    }
                  >
                    {carro.destaque_home ? "★ Destacado" : "Destacar"}
                  </button>
                  <button
                    onClick={() => handleExcluir(carro)}
                    className="text-sm px-3 py-1.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                  >
                    Excluir
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}