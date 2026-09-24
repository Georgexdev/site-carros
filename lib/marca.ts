// Dados da marca usados em todo o site público.
// Altere aqui (e só aqui) quando o telefone, e-mail ou endereço mudarem.

export const MARCA = {
  nome: "MALU Veículos e Financiamentos",
  nomeCurto: "MALU",
  slogan: "Veículos e Financiamentos",
  descricao:
    "Encontre o carro ideal pra você com quem entende do assunto. Estoque atualizado, condições facilitadas e atendimento de verdade.",

  // TODO: trocar pelo número real da loja (apenas dígitos, com DDI 55).
  whatsapp: "5571999999999",
  telefoneExibicao: "(71) 99999-9999",

  // Deixe vazio para esconder o e-mail do rodapé.
  email: "",
  // Deixe vazio para esconder o CNPJ do rodapé.
  cnpj: "",

  instagramUrl: "https://www.instagram.com/maluveiculos_",
  instagramUsuario: "@maluveiculos_",

  endereco: {
    linha1: "Av. Pres. Castelo Branco, Nazaré",
    cidade: "Salvador/BA",
    cep: "40045-050",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=MALU+VEICULOS+Salvador",
  },

  horarios: [
    { dias: "Segunda a sexta", horario: "8h às 17h" },
    { dias: "Sábado", horario: "8h às 12h" },
    { dias: "Domingo", horario: "Fechado" },
  ],
  horarioResumo: "Seg a Sex, 8h às 17h · Sáb, 8h às 12h",
};

export function linkWhatsApp(mensagem?: string) {
  const base = "https://wa.me/" + MARCA.whatsapp;
  return mensagem ? base + "?text=" + encodeURIComponent(mensagem) : base;
}

export function linkTelefone() {
  return "tel:" + MARCA.whatsapp;
}
