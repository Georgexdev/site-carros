import { MARCA } from "@/lib/marca";

// Dados de contato da loja que aparecem no site.
// Vêm da tabela "empresas" (editáveis no painel, em "Sobre a loja").
// Qualquer campo vazio no banco usa o valor de reserva de lib/marca.ts.

export type DadosLoja = {
  nome: string;
  descricao: string;
  whatsapp: string; // só dígitos, com DDI 55
  telefoneExibicao: string;
  email: string;
  cnpj: string;
  instagramUrl: string;
  instagramUsuario: string;
  endereco: {
    linha1: string;
    cidade: string;
    cep: string;
    mapsUrl: string;
  };
  horarios: { dias: string; horario: string }[];
  horarioResumo: string;
};

// Colunas da tabela "empresas" usadas para montar os dados da loja.
export const COLUNAS_LOJA =
  "whatsapp, telefone, email, cnpj, endereco, cidade, cep, horario_semana, horario_sabado, horario_domingo, instagram";

type LinhaEmpresa = Record<string, string | null> | null;

function texto(valor: string | null | undefined) {
  return (valor ?? "").trim();
}

// "(71) 98429-6345" → "5571984296345"
export function normalizarWhatsApp(valor: string) {
  const digitos = valor.replace(/\D/g, "");
  if (digitos.length === 10 || digitos.length === 11) return "55" + digitos;
  return digitos;
}

// "5571984296345" → "(71) 98429-6345"
export function formatarTelefone(valor: string) {
  let digitos = valor.replace(/\D/g, "");
  if (digitos.startsWith("55") && (digitos.length === 12 || digitos.length === 13)) {
    digitos = digitos.slice(2);
  }
  if (digitos.length === 11) return "(" + digitos.slice(0, 2) + ") " + digitos.slice(2, 7) + "-" + digitos.slice(7);
  if (digitos.length === 10) return "(" + digitos.slice(0, 2) + ") " + digitos.slice(2, 6) + "-" + digitos.slice(6);
  return valor;
}

// "@maluveiculos_" ou "https://instagram.com/maluveiculos_" → "maluveiculos_"
export function normalizarInstagram(valor: string) {
  return valor
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .replace(/[/?#].*$/, "");
}

export function montarDadosLoja(empresa: LinhaEmpresa): DadosLoja {
  const whatsapp = texto(empresa?.whatsapp) ? normalizarWhatsApp(texto(empresa?.whatsapp)) : MARCA.whatsapp;

  const telefoneBanco = texto(empresa?.telefone);
  const telefoneExibicao = telefoneBanco
    ? formatarTelefone(telefoneBanco)
    : texto(empresa?.whatsapp)
      ? formatarTelefone(whatsapp)
      : MARCA.telefoneExibicao;

  const instagramBanco = normalizarInstagram(texto(empresa?.instagram));
  const instagramUsuario = instagramBanco ? "@" + instagramBanco : MARCA.instagramUsuario;
  const instagramUrl = instagramBanco ? "https://www.instagram.com/" + instagramBanco : MARCA.instagramUrl;

  const linha1 = texto(empresa?.endereco) || MARCA.endereco.linha1;
  const cidade = texto(empresa?.cidade) || MARCA.endereco.cidade;
  const cep = texto(empresa?.cep) || MARCA.endereco.cep;
  const enderecoMudou = !!(texto(empresa?.endereco) || texto(empresa?.cidade));
  const mapsUrl = enderecoMudou
    ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(linha1 + ", " + cidade)
    : MARCA.endereco.mapsUrl;

  const semana = texto(empresa?.horario_semana) || MARCA.horarios[0].horario;
  const sabado = texto(empresa?.horario_sabado) || MARCA.horarios[1].horario;
  const domingo = texto(empresa?.horario_domingo) || MARCA.horarios[2].horario;

  return {
    nome: MARCA.nome,
    descricao: MARCA.descricao,
    whatsapp,
    telefoneExibicao,
    email: texto(empresa?.email) || MARCA.email,
    cnpj: texto(empresa?.cnpj) || MARCA.cnpj,
    instagramUrl,
    instagramUsuario,
    endereco: { linha1, cidade, cep, mapsUrl },
    horarios: [
      { dias: "Segunda a sexta", horario: semana },
      { dias: "Sábado", horario: sabado },
      { dias: "Domingo", horario: domingo },
    ],
    horarioResumo: "Seg a Sex, " + semana + " · Sáb, " + sabado,
  };
}

export function linkWhatsAppDe(numero: string, mensagem?: string) {
  const base = "https://wa.me/" + numero;
  return mensagem ? base + "?text=" + encodeURIComponent(mensagem) : base;
}

export function linkTelefoneDe(numero: string) {
  return "tel:" + numero;
}
