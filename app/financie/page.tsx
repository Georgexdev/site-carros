"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { EMPRESA_ID } from "@/lib/empresa";
import { Carro } from "@/types/car";
import { Phone, User, Calendar, IdCard, Car as CarIcon, X, ShieldCheck } from "lucide-react";
import { bancosParceiros } from "@/data/bancos";
import { useLoja } from "@/components/LojaProvider";
import { celularValido, cpfValido, idadePelaData, dataBrasileira } from "@/lib/validacao";
import { nomeDoCarro } from "@/lib/texto";

type CampoFormulario = "veiculo" | "nome" | "celular" | "nascimento" | "cpf";

const passos = [
    { titulo: "Escolha o veículo", texto: "Selecione o carro do nosso estoque que você tem interesse em financiar." },
    { titulo: "Preencha seus dados", texto: "Informe seus dados de contato para nossos consultores entrarem em contato." },
    { titulo: "Receba a proposta", texto: "Nossa equipe te chama no WhatsApp com a melhor condição disponível." },
];

const campo =
    "w-full h-13 min-h-[52px] border border-line-strong rounded-xl bg-[#FBFAF7] pl-11 pr-3 text-[15px] text-ink placeholder:text-[#8A8174] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30";
const campoComErro = " !border-[#B42318] focus:!ring-[#B42318]/20";
const rotulo = "block text-sm font-semibold text-ink mb-2";
const textoErro = "mt-1.5 text-[13px] font-medium text-[#B42318]";
const iconeCampo = "absolute left-4 top-1/2 -translate-y-1/2 text-gold-text";
const tituloGrupo = "text-xs font-bold tracking-[0.2em] uppercase text-gold-text mb-3";

export default function Financie() {
    const { linkWhatsApp } = useLoja();
    const [carros, setCarros] = useState<Carro[]>([]);
    const [fotosCapa, setFotosCapa] = useState<Record<string, string>>({});
    const [carregandoCarros, setCarregandoCarros] = useState(true);

    const [listaAberta, setListaAberta] = useState(false);
    const [veiculoSelecionado, setVeiculoSelecionado] = useState<Carro | null>(null);

    const [nome, setNome] = useState("");
    const [celular, setCelular] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [cpf, setCpf] = useState("");
    const [errosCampos, setErrosCampos] = useState<Partial<Record<CampoFormulario, string>>>({});

    // Tira o aviso vermelho do campo assim que o cliente começa a corrigir.
    function limparErro(campo: CampoFormulario) {
        if (!errosCampos[campo]) return;
        const restantes = { ...errosCampos };
        delete restantes[campo];
        setErrosCampos(restantes);
    }

    // Resumo mostrado acima do botão; diminui conforme o cliente corrige os campos.
    const errosRestantes = Object.values(errosCampos);
    const erro =
        errosRestantes.length === 0
            ? ""
            : errosRestantes.length === 1
              ? errosRestantes[0]
              : "Confira os " + errosRestantes.length + " campos destacados em vermelho.";

    function propsDeErro(nomeCampo: CampoFormulario) {
        const mensagem = errosCampos[nomeCampo];
        return {
            "aria-invalid": mensagem ? true : undefined,
            "aria-describedby": mensagem ? "erro-" + nomeCampo : undefined,
            className: campo + (mensagem ? campoComErro : ""),
        };
    }

    useEffect(() => {
        async function buscarCarros() {
            let consulta = supabase.from("carros").select("*").eq("status", "disponivel");
            if (EMPRESA_ID) consulta = consulta.eq("empresa_id", EMPRESA_ID);

            const { data: carrosData } = await consulta.order("criado_em", { ascending: false });

            const carrosTipados = (carrosData as Carro[]) || [];
            setCarros(carrosTipados);

            // Pré-seleciona o veículo quando vem da página de detalhes (/financie?carro=ID)
            const idDaUrl = new URLSearchParams(window.location.search).get("carro");
            const carroDaUrl = idDaUrl ? carrosTipados.find((c) => c.id === idDaUrl) : undefined;
            if (carroDaUrl) {
                setVeiculoSelecionado(carroDaUrl);
            }

            if (carrosTipados.length > 0) {
                const ids = carrosTipados.map((c) => c.id);
                const { data: fotosData } = await supabase
                    .from("fotos_carros")
                    .select("carro_id, url")
                    .in("carro_id", ids)
                    .eq("ordem", 0);

                const mapa: Record<string, string> = {};
                (fotosData || []).forEach((f) => {
                    mapa[f.carro_id] = f.url;
                });
                setFotosCapa(mapa);
            }

            setCarregandoCarros(false);
        }

        buscarCarros();
    }, []);

    function formatarCelular(valor: string) {
        const numeros = valor.replace(/\D/g, "").slice(0, 11);
        if (numeros.length <= 2) return numeros;
        if (numeros.length <= 7) return "(" + numeros.slice(0, 2) + ") " + numeros.slice(2);
        return "(" + numeros.slice(0, 2) + ") " + numeros.slice(2, 7) + "-" + numeros.slice(7);
    }

    function formatarCpf(valor: string) {
        const numeros = valor.replace(/\D/g, "").slice(0, 11);
        if (numeros.length <= 3) return numeros;
        if (numeros.length <= 6) return numeros.slice(0, 3) + "." + numeros.slice(3);
        if (numeros.length <= 9)
            return numeros.slice(0, 3) + "." + numeros.slice(3, 6) + "." + numeros.slice(6);
        return (
            numeros.slice(0, 3) + "." + numeros.slice(3, 6) + "." + numeros.slice(6, 9) + "-" + numeros.slice(9)
        );
    }

    function rolarParaFormulario() {
        document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
    }

    function validar() {
        const erros: Partial<Record<CampoFormulario, string>> = {};

        if (!veiculoSelecionado) erros.veiculo = "Escolha o carro que você quer financiar.";

        if (!nome.trim()) erros.nome = "Informe seu nome.";
        else if (nome.trim().length < 3) erros.nome = "Digite seu nome completo.";

        if (!celular.trim()) erros.celular = "Informe seu celular com DDD.";
        else if (!celularValido(celular)) erros.celular = "Celular inválido. Use o DDD + 9 dígitos, ex.: (71) 98429-6345.";

        if (dataNascimento) {
            const idade = idadePelaData(dataNascimento);
            if (idade === null || idade < 0) erros.nascimento = "Data de nascimento inválida.";
            else if (idade < 18) erros.nascimento = "O financiamento é só para maiores de 18 anos.";
            else if (idade > 100) erros.nascimento = "Confira o ano de nascimento.";
        }

        if (cpf.trim() && !cpfValido(cpf)) erros.cpf = "CPF inválido. Confira os números.";

        return erros;
    }

    function handleSolicitar() {
        const erros = validar();
        setErrosCampos(erros);

        if (Object.keys(erros).length > 0) {
            const primeiro = (["veiculo", "nome", "celular", "nascimento", "cpf"] as CampoFormulario[]).find((c) => erros[c]);
            const idsCampos: Record<CampoFormulario, string> = {
                veiculo: "botao-veiculo-financiamento",
                nome: "nome-financiamento",
                celular: "celular-financiamento",
                nascimento: "nascimento-financiamento",
                cpf: "cpf-financiamento",
            };
            if (primeiro) document.getElementById(idsCampos[primeiro])?.focus();
            return;
        }

        if (!veiculoSelecionado) return;

        const mensagem =
            "Olá! Gostaria de solicitar uma análise de financiamento." +
            "\n\nVeículo de interesse: " +
            nomeDoCarro(veiculoSelecionado) +
            " (Ano " + veiculoSelecionado.ano_fabricacao + "/" + veiculoSelecionado.ano_modelo + ")" +
            "\n\nMeus dados:\nNome: " + nome.trim() +
            "\nCelular: " + celular.trim() +
            (dataNascimento ? "\nData de nascimento: " + dataBrasileira(dataNascimento) : "") +
            (cpf.trim() ? "\nCPF: " + cpf.trim() : "");

        window.open(linkWhatsApp(mensagem), "_blank");
    }

    return (
        <div>
            <section className="bg-malu-black border-b border-gold/20">
                <div className="max-w-6xl mx-auto px-6 py-14 md:py-20 flex flex-col gap-5">
                    <span className="text-xs md:text-[13px] font-bold tracking-[0.28em] uppercase text-gold">Financiamento</span>
                    <h1 className="font-display text-[40px] md:text-[60px] leading-[1.05] text-[#F4EEE2]">Financie seu próximo carro</h1>
                    <p className="text-base md:text-lg leading-relaxed text-muted-dark max-w-2xl">
                        Nossos consultores avaliam qual é a melhor taxa de juros para o seu perfil, entre {bancosParceiros.length} bancos parceiros.
                    </p>
                    <button
                        type="button"
                        onClick={rolarParaFormulario}
                        className="lg:hidden w-fit mt-2 h-14 px-7 rounded-xl bg-gold hover:bg-gold-light text-malu-black font-bold transition-colors"
                    >
                        Solicitar análise
                    </button>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6 py-14 md:py-24 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_540px] gap-12 lg:gap-16 items-start">
                <div className="flex flex-col gap-12">
                    <section className="flex flex-col gap-7">
                        <h2 className="font-display text-3xl md:text-4xl text-ink">Como funciona</h2>
                        <ol className="flex flex-col gap-7">
                            {passos.map((passo, index) => (
                                <li key={passo.titulo} className="flex gap-5 items-start">
                                    <span className="w-13 h-13 min-w-[52px] min-h-[52px] rounded-full bg-malu-black border border-gold text-gold font-display text-[22px] flex items-center justify-center shrink-0">
                                        {index + 1}
                                    </span>
                                    <div className="flex flex-col gap-1.5 pt-1">
                                        <strong className="text-lg text-ink">{passo.titulo}</strong>
                                        <span className="text-[15px] leading-relaxed text-muted">{passo.texto}</span>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </section>

                    <section className="flex flex-col gap-5">
                        <h2 className="text-xs md:text-[13px] font-bold tracking-[0.28em] uppercase text-gold-text">Bancos parceiros</h2>
                        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {bancosParceiros.map((banco) => (
                                <li
                                    key={banco.nome}
                                    className="group h-20 rounded-xl bg-white border border-line flex items-center justify-center px-3 hover:border-gold/60 transition-colors"
                                >
                                    <img
                                        src={banco.logo}
                                        alt={banco.nome}
                                        className="max-h-9 max-w-full object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                                    />
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <section
                    id="formulario"
                    className="scroll-mt-6 p-6 md:p-10 rounded-2xl bg-white border border-line border-t-4 border-t-gold shadow-[0_8px_28px_rgba(28,26,23,0.07)]"
                >
                    <h2 className="font-display text-3xl text-ink">Solicite sua análise</h2>
                    <p className="text-sm text-muted mt-1.5 mb-8">Leva menos de 1 minuto. Respondemos pelo WhatsApp.</p>

                    <div className="space-y-7">
                        <div>
                            <h3 className={tituloGrupo}>Veículo</h3>

                            {veiculoSelecionado && !listaAberta ? (
                                <div className="flex items-center gap-3 border border-gold/60 bg-cream rounded-xl p-3">
                                    {fotosCapa[veiculoSelecionado.id] ? (
                                        <img
                                            src={fotosCapa[veiculoSelecionado.id]}
                                            alt={veiculoSelecionado.marca + " " + veiculoSelecionado.modelo}
                                            className="w-20 h-14 object-cover rounded-lg shrink-0"
                                        />
                                    ) : (
                                        <span className="w-20 h-14 rounded-lg bg-malu-surface flex items-center justify-center shrink-0">
                                            <CarIcon size={24} className="text-gold/70" aria-hidden="true" />
                                        </span>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-ink truncate">
                                            {veiculoSelecionado.marca} {veiculoSelecionado.modelo}
                                        </p>
                                        <p className="text-sm text-muted truncate">{veiculoSelecionado.versao}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setListaAberta(true)}
                                        className="text-sm font-semibold text-gold-text hover:underline shrink-0 px-2 py-2"
                                    >
                                        Trocar
                                    </button>
                                </div>
                            ) : (
                                <button
                                    id="botao-veiculo-financiamento"
                                    type="button"
                                    onClick={() => setListaAberta(!listaAberta)}
                                    aria-describedby={errosCampos.veiculo ? "erro-veiculo" : undefined}
                                    className={
                                        "w-full h-13 min-h-[52px] flex items-center gap-3 border bg-[#FBFAF7] rounded-xl px-4 text-[15px] text-muted hover:border-gold transition-colors " +
                                        (errosCampos.veiculo ? "!border-[#B42318]" : "border-line-strong")
                                    }
                                >
                                    <CarIcon size={18} className="text-gold-text" aria-hidden="true" />
                                    Qual carro você quer financiar?
                                </button>
                            )}
                            {errosCampos.veiculo && !veiculoSelecionado && (
                                <p id="erro-veiculo" className={textoErro}>{errosCampos.veiculo}</p>
                            )}

                            {listaAberta && (
                                <div className="mt-3 border border-line rounded-xl overflow-hidden">
                                    <div className="flex items-center justify-between px-4 py-2 border-b border-line bg-cream">
                                        <span className="text-sm text-muted">Escolha um veículo</span>
                                        <button
                                            type="button"
                                            onClick={() => setListaAberta(false)}
                                            className="text-sm text-muted hover:text-ink flex items-center gap-1 py-2"
                                        >
                                            <X size={16} aria-hidden="true" />
                                            Fechar
                                        </button>
                                    </div>

                                    <div className="max-h-80 overflow-y-auto divide-y divide-line">
                                        {carregandoCarros && (
                                            <p className="text-sm text-muted p-4">Carregando veículos...</p>
                                        )}

                                        {!carregandoCarros && carros.length === 0 && (
                                            <p className="text-sm text-muted p-4">Nenhum veículo disponível no momento.</p>
                                        )}

                                        {carros.map((carro) => (
                                            <button
                                                type="button"
                                                key={carro.id}
                                                onClick={() => {
                                                    setVeiculoSelecionado(carro);
                                                    limparErro("veiculo");
                                                    setListaAberta(false);
                                                }}
                                                className="w-full flex items-center gap-3 p-3 hover:bg-cream text-left transition-colors"
                                            >
                                                {fotosCapa[carro.id] ? (
                                                    <img
                                                        src={fotosCapa[carro.id]}
                                                        alt={carro.marca + " " + carro.modelo}
                                                        className="w-20 h-14 object-cover rounded-lg shrink-0"
                                                    />
                                                ) : (
                                                    <span className="w-20 h-14 rounded-lg bg-malu-surface flex items-center justify-center shrink-0">
                                                        <CarIcon size={24} className="text-gold/70" aria-hidden="true" />
                                                    </span>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-ink">
                                                        {carro.marca} {carro.modelo}
                                                    </p>
                                                    <p className="text-sm text-muted">
                                                        {carro.versao} · {carro.ano_fabricacao}/{carro.ano_modelo} ·{" "}
                                                        {carro.km.toLocaleString("pt-BR")} km
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className={tituloGrupo}>Seus dados</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="nome-financiamento" className={rotulo}>
                                        Nome completo
                                    </label>
                                    <div className="relative">
                                        <User size={18} className={iconeCampo} aria-hidden="true" />
                                        <input
                                            id="nome-financiamento"
                                            type="text"
                                            autoComplete="name"
                                            placeholder="Como devemos te chamar"
                                            value={nome}
                                            onChange={(e) => { setNome(e.target.value); limparErro("nome"); }}
                                            required
                                            {...propsDeErro("nome")}
                                        />
                                    </div>
                                    {errosCampos.nome && <p id="erro-nome" className={textoErro}>{errosCampos.nome}</p>}
                                </div>

                                <div>
                                    <label htmlFor="celular-financiamento" className={rotulo}>
                                        Celular (WhatsApp)
                                    </label>
                                    <div className="relative">
                                        <Phone size={18} className={iconeCampo} aria-hidden="true" />
                                        <input
                                            id="celular-financiamento"
                                            type="tel"
                                            inputMode="numeric"
                                            autoComplete="tel-national"
                                            placeholder="(71) 9 0000-0000"
                                            value={celular}
                                            onChange={(e) => { setCelular(formatarCelular(e.target.value)); limparErro("celular"); }}
                                            required
                                            {...propsDeErro("celular")}
                                        />
                                    </div>
                                    {errosCampos.celular && <p id="erro-celular" className={textoErro}>{errosCampos.celular}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="nascimento-financiamento" className={rotulo}>
                                            Nascimento <span className="font-normal text-muted text-[13px]">(opcional)</span>
                                        </label>
                                        <div className="relative">
                                            <Calendar size={18} className={iconeCampo} aria-hidden="true" />
                                            <input
                                                id="nascimento-financiamento"
                                                type="date"
                                                value={dataNascimento}
                                                onChange={(e) => { setDataNascimento(e.target.value); limparErro("nascimento"); }}
                                                {...propsDeErro("nascimento")}
                                            />
                                        </div>
                                        {errosCampos.nascimento && <p id="erro-nascimento" className={textoErro}>{errosCampos.nascimento}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="cpf-financiamento" className={rotulo}>
                                            CPF <span className="font-normal text-muted text-[13px]">(opcional)</span>
                                        </label>
                                        <div className="relative">
                                            <IdCard size={18} className={iconeCampo} aria-hidden="true" />
                                            <input
                                                id="cpf-financiamento"
                                                type="text"
                                                inputMode="numeric"
                                                placeholder="000.000.000-00"
                                                value={cpf}
                                                onChange={(e) => { setCpf(formatarCpf(e.target.value)); limparErro("cpf"); }}
                                                {...propsDeErro("cpf")}
                                            />
                                        </div>
                                        {errosCampos.cpf && <p id="erro-cpf" className={textoErro}>{errosCampos.cpf}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {erro && <p className="text-[#B42318] text-sm font-medium" role="alert">{erro}</p>}

                        <button
                            type="button"
                            data-esconde-whats-flutuante
                            onClick={handleSolicitar}
                            className="w-full h-14 rounded-xl bg-gold hover:bg-gold-light text-malu-black font-bold transition-colors"
                        >
                            Solicitar análise
                        </button>

                        <p className="flex items-center gap-2 text-[13px] text-muted">
                            <ShieldCheck size={16} className="text-gold-text shrink-0" aria-hidden="true" />
                            Seus dados são usados só para a análise de crédito.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
