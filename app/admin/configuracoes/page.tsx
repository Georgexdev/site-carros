"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { MARCA } from "@/lib/marca";

type CamposLoja = {
    whatsapp: string;
    telefone: string;
    email: string;
    cnpj: string;
    instagram: string;
    endereco: string;
    cidade: string;
    cep: string;
    horario_semana: string;
    horario_sabado: string;
    horario_domingo: string;
    sobre: string;
};

const camposVazios: CamposLoja = {
    whatsapp: "",
    telefone: "",
    email: "",
    cnpj: "",
    instagram: "",
    endereco: "",
    cidade: "",
    cep: "",
    horario_semana: "",
    horario_sabado: "",
    horario_domingo: "",
    sobre: "",
};

const campo =
    "w-full h-12 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30";
const rotulo = "block text-sm font-semibold text-ink mb-2";
const ajuda = "text-xs text-muted mt-1.5";
const tituloSecao = "text-xs font-bold tracking-[0.2em] uppercase text-gold-text";

function mascaraTelefone(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 6) return "(" + numeros.slice(0, 2) + ") " + numeros.slice(2);
    if (numeros.length <= 10)
        return "(" + numeros.slice(0, 2) + ") " + numeros.slice(2, 6) + "-" + numeros.slice(6);
    return "(" + numeros.slice(0, 2) + ") " + numeros.slice(2, 7) + "-" + numeros.slice(7);
}

function mascaraCnpj(valor: string) {
    const n = valor.replace(/\D/g, "").slice(0, 14);
    if (n.length <= 2) return n;
    if (n.length <= 5) return n.slice(0, 2) + "." + n.slice(2);
    if (n.length <= 8) return n.slice(0, 2) + "." + n.slice(2, 5) + "." + n.slice(5);
    if (n.length <= 12) return n.slice(0, 2) + "." + n.slice(2, 5) + "." + n.slice(5, 8) + "/" + n.slice(8);
    return n.slice(0, 2) + "." + n.slice(2, 5) + "." + n.slice(5, 8) + "/" + n.slice(8, 12) + "-" + n.slice(12);
}

function mascaraCep(valor: string) {
    const n = valor.replace(/\D/g, "").slice(0, 8);
    if (n.length <= 5) return n;
    return n.slice(0, 5) + "-" + n.slice(5);
}

export default function Configuracoes() {
    const router = useRouter();
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState(false);

    const [empresaId, setEmpresaId] = useState("");
    const [dados, setDados] = useState<CamposLoja>(camposVazios);

    useEffect(() => {
        async function carregarDados() {
            const { data: sessao } = await supabase.auth.getSession();
            if (!sessao.session) {
                router.push("/login");
                return;
            }

            const { data: admin } = await supabase
                .from("administradores")
                .select("empresa_id")
                .eq("id", sessao.session.user.id)
                .single();

            if (!admin) {
                setErro("Não foi possível identificar sua empresa.");
                setCarregando(false);
                return;
            }

            setEmpresaId(admin.empresa_id);

            const { data: empresa, error } = await supabase
                .from("empresas")
                .select("*")
                .eq("id", admin.empresa_id)
                .single();

            if (error) {
                console.error(error);
            }

            if (empresa) {
                const preenchido = { ...camposVazios };
                (Object.keys(camposVazios) as (keyof CamposLoja)[]).forEach((chave) => {
                    preenchido[chave] = empresa[chave] || "";
                });
                setDados(preenchido);
            }

            setCarregando(false);
        }

        carregarDados();
    }, [router]);

    function alterar(chave: keyof CamposLoja, valor: string) {
        setSucesso(false);
        setDados((atual) => ({ ...atual, [chave]: valor }));
    }

    async function handleSalvar(e: React.FormEvent) {
        e.preventDefault();
        setErro("");
        setSucesso(false);

        const digitosWhats = dados.whatsapp.replace(/\D/g, "");
        if (digitosWhats && digitosWhats.length < 10) {
            setErro("O WhatsApp precisa ter DDD + número. Exemplo: (71) 98429-6345.");
            return;
        }

        setSalvando(true);

        // Campos vazios são salvos como "vazio" no banco: o site usa o valor padrão.
        const atualizacao: Record<string, string | null> = {};
        (Object.keys(dados) as (keyof CamposLoja)[]).forEach((chave) => {
            const valor = dados[chave].trim();
            atualizacao[chave] = valor === "" ? null : valor;
        });

        const { data, error } = await supabase
            .from("empresas")
            .update(atualizacao)
            .eq("id", empresaId)
            .select("id");

        setSalvando(false);

        if (error) {
            setErro(
                error.message.includes("column")
                    ? "O banco ainda não tem os campos novos. Rode o comando SQL da Parte 1 no Supabase."
                    : "Erro ao salvar as alterações. Tente novamente."
            );
            console.error(error);
        } else if (!data || data.length === 0) {
            // Sem erro, mas nada foi salvo: normalmente é permissão (RLS) no banco.
            setErro("Não foi possível salvar: sua conta não tem permissão para alterar os dados desta loja.");
        } else {
            setSucesso(true);
        }
    }

    if (carregando) {
        return (
            <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
                <p className="text-muted">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
            <Link href="/admin" className="inline-flex items-center gap-1 text-sm font-semibold text-gold-text hover:underline">
                ← Voltar aos veículos
            </Link>

            <h1 className="font-display text-3xl sm:text-4xl text-ink mt-3 mb-2">Dados da loja</h1>
            <p className="text-sm text-muted mb-6">
                Essas informações aparecem no cabeçalho, no rodapé, nos botões de WhatsApp e na página Sobre.
                Campos em branco usam o valor padrão (mostrado em cinza). As mudanças aparecem no site em até 1 minuto.
            </p>

            <form onSubmit={handleSalvar} className="bg-white border border-line rounded-2xl p-5 sm:p-8 space-y-8">
                <section className="space-y-4">
                    <h2 className={tituloSecao}>Contato</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="cfg-whatsapp" className={rotulo}>WhatsApp</label>
                            <input
                                id="cfg-whatsapp"
                                type="tel"
                                inputMode="numeric"
                                value={dados.whatsapp}
                                onChange={(e) => alterar("whatsapp", mascaraTelefone(e.target.value))}
                                placeholder={MARCA.telefoneExibicao}
                                className={campo}
                            />
                            <p className={ajuda}>Usado em todos os botões de WhatsApp do site.</p>
                        </div>
                        <div>
                            <label htmlFor="cfg-telefone" className={rotulo}>
                                Telefone <span className="font-normal text-muted text-[13px]">(opcional)</span>
                            </label>
                            <input
                                id="cfg-telefone"
                                type="tel"
                                inputMode="numeric"
                                value={dados.telefone}
                                onChange={(e) => alterar("telefone", mascaraTelefone(e.target.value))}
                                placeholder="Igual ao WhatsApp"
                                className={campo}
                            />
                            <p className={ajuda}>Deixe em branco para mostrar o número do WhatsApp.</p>
                        </div>
                        <div>
                            <label htmlFor="cfg-email" className={rotulo}>E-mail</label>
                            <input
                                id="cfg-email"
                                type="email"
                                value={dados.email}
                                onChange={(e) => alterar("email", e.target.value)}
                                placeholder="contato@sualoja.com.br"
                                className={campo}
                            />
                            <p className={ajuda}>Em branco, o e-mail não aparece no site.</p>
                        </div>
                        <div>
                            <label htmlFor="cfg-instagram" className={rotulo}>Instagram</label>
                            <input
                                id="cfg-instagram"
                                type="text"
                                value={dados.instagram}
                                onChange={(e) => alterar("instagram", e.target.value)}
                                placeholder={MARCA.instagramUsuario}
                                className={campo}
                            />
                            <p className={ajuda}>Pode ser o @ ou o link do perfil.</p>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="cfg-cnpj" className={rotulo}>CNPJ</label>
                            <input
                                id="cfg-cnpj"
                                type="text"
                                inputMode="numeric"
                                value={dados.cnpj}
                                onChange={(e) => alterar("cnpj", mascaraCnpj(e.target.value))}
                                placeholder="00.000.000/0000-00"
                                className={campo}
                            />
                            <p className={ajuda}>Aparece no rodapé. Em branco, não aparece.</p>
                        </div>
                    </div>
                </section>

                <section className="space-y-4 border-t border-line pt-8">
                    <h2 className={tituloSecao}>Endereço</h2>
                    <div>
                        <label htmlFor="cfg-endereco" className={rotulo}>Rua, número e bairro</label>
                        <input
                            id="cfg-endereco"
                            type="text"
                            value={dados.endereco}
                            onChange={(e) => alterar("endereco", e.target.value)}
                            placeholder={MARCA.endereco.linha1}
                            className={campo}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_180px] gap-4">
                        <div>
                            <label htmlFor="cfg-cidade" className={rotulo}>Cidade/UF</label>
                            <input
                                id="cfg-cidade"
                                type="text"
                                value={dados.cidade}
                                onChange={(e) => alterar("cidade", e.target.value)}
                                placeholder={MARCA.endereco.cidade}
                                className={campo}
                            />
                        </div>
                        <div>
                            <label htmlFor="cfg-cep" className={rotulo}>CEP</label>
                            <input
                                id="cfg-cep"
                                type="text"
                                inputMode="numeric"
                                value={dados.cep}
                                onChange={(e) => alterar("cep", mascaraCep(e.target.value))}
                                placeholder={MARCA.endereco.cep}
                                className={campo}
                            />
                        </div>
                    </div>
                </section>

                <section className="space-y-4 border-t border-line pt-8">
                    <h2 className={tituloSecao}>Horário de atendimento</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="cfg-semana" className={rotulo}>Segunda a sexta</label>
                            <input
                                id="cfg-semana"
                                type="text"
                                value={dados.horario_semana}
                                onChange={(e) => alterar("horario_semana", e.target.value)}
                                placeholder={MARCA.horarios[0].horario}
                                className={campo}
                            />
                        </div>
                        <div>
                            <label htmlFor="cfg-sabado" className={rotulo}>Sábado</label>
                            <input
                                id="cfg-sabado"
                                type="text"
                                value={dados.horario_sabado}
                                onChange={(e) => alterar("horario_sabado", e.target.value)}
                                placeholder={MARCA.horarios[1].horario}
                                className={campo}
                            />
                        </div>
                        <div>
                            <label htmlFor="cfg-domingo" className={rotulo}>Domingo</label>
                            <input
                                id="cfg-domingo"
                                type="text"
                                value={dados.horario_domingo}
                                onChange={(e) => alterar("horario_domingo", e.target.value)}
                                placeholder={MARCA.horarios[2].horario}
                                className={campo}
                            />
                        </div>
                    </div>
                    <p className={ajuda}>Exemplos: “8h às 17h”, “8h às 12h”, “Fechado”.</p>
                </section>

                <section className="space-y-4 border-t border-line pt-8">
                    <h2 className={tituloSecao}>Sobre a loja</h2>
                    <div>
                        <label htmlFor="cfg-sobre" className={rotulo}>Texto da página Sobre</label>
                        <textarea
                            id="cfg-sobre"
                            value={dados.sobre}
                            onChange={(e) => alterar("sobre", e.target.value)}
                            rows={7}
                            placeholder="Conte um pouco sobre a história e os diferenciais da sua loja..."
                            className="w-full min-h-40 border border-line-strong rounded-xl bg-[#FBFAF7] px-4 py-3 text-[15px] leading-relaxed text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                        />
                        <p className={ajuda}>Este texto aparece na página “Sobre” do site. Pode pular linhas.</p>
                    </div>
                </section>

                {erro && <p className="text-[#B42318] text-sm font-medium" role="alert">{erro}</p>}
                {sucesso && (
                    <p className="text-[#0F7B3C] text-sm font-medium" role="status">
                        Alterações salvas! Em até 1 minuto elas aparecem no site.
                    </p>
                )}

                <button
                    type="submit"
                    disabled={salvando}
                    className="w-full h-13 min-h-[52px] rounded-xl bg-malu-black text-gold-light font-bold hover:bg-gold hover:text-malu-black transition-colors disabled:opacity-50"
                >
                    {salvando ? "Salvando..." : "Salvar alterações"}
                </button>
            </form>
        </div>
    );
}
