// Confere os dados do carro antes de salvar no painel.
// Retorna a mensagem do primeiro problema encontrado, ou "" se estiver tudo certo.

type DadosCarro = {
  marca: string;
  modelo: string;
  anoFabricacao: string;
  anoModelo: string;
  preco: string;
  km: string;
};

export const PRECO_MINIMO = 1000;
export const ANO_MINIMO = 1950;

export function validarCarro(dados: DadosCarro): string {
  const anoAtual = new Date().getFullYear();

  if (!dados.marca.trim()) return "Escolha a marca do veículo.";
  if (dados.modelo.trim().length < 2) return "Preencha o modelo do veículo (ex.: Civic, Corolla).";

  const fabricacao = Number(dados.anoFabricacao);
  const modelo = Number(dados.anoModelo);

  if (!/^\d{4}$/.test(dados.anoFabricacao) || fabricacao < ANO_MINIMO || fabricacao > anoAtual + 1) {
    return "O ano de fabricação precisa ter 4 dígitos, entre " + ANO_MINIMO + " e " + (anoAtual + 1) + ".";
  }
  if (!/^\d{4}$/.test(dados.anoModelo) || modelo < ANO_MINIMO || modelo > anoAtual + 2) {
    return "O ano do modelo precisa ter 4 dígitos, entre " + ANO_MINIMO + " e " + (anoAtual + 2) + ".";
  }
  if (modelo < fabricacao || modelo > fabricacao + 1) {
    return "O ano do modelo deve ser igual ao ano de fabricação ou 1 ano depois (ex.: 2022/2023).";
  }

  const preco = Number(dados.preco);
  if (!preco || preco < PRECO_MINIMO) {
    return "O preço precisa ser de pelo menos R$ " + PRECO_MINIMO.toLocaleString("pt-BR") + ".";
  }

  const km = Number(dados.km);
  if (dados.km.trim() === "" || km < 0 || !Number.isFinite(km)) {
    return "Preencha a quilometragem (use 0 para carro zero km).";
  }

  return "";
}
