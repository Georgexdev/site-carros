// Regras simples para conferir os dados digitados pelo cliente nos formulários do site.

export function somenteNumeros(valor: string) {
  return valor.replace(/\D/g, "");
}

// Celular com DDD: 11 dígitos, começando com 9 depois do DDD. Ex.: (71) 98429-6345
export function celularValido(valor: string) {
  const numeros = somenteNumeros(valor);
  if (numeros.length !== 11) return false;
  const ddd = Number(numeros.slice(0, 2));
  return ddd >= 11 && ddd <= 99 && numeros[2] === "9";
}

// Confere os dois dígitos verificadores do CPF.
export function cpfValido(valor: string) {
  const numeros = somenteNumeros(valor);
  if (numeros.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(numeros)) return false; // 000.000.000-00, 111.111.111-11...

  const digito = (tamanho: number) => {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) {
      soma += Number(numeros[i]) * (tamanho + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return digito(9) === Number(numeros[9]) && digito(10) === Number(numeros[10]);
}

// Data no formato do campo de data (AAAA-MM-DD). Retorna a idade ou null se a data for inválida.
export function idadePelaData(valor: string) {
  const [ano, mes, dia] = valor.split("-").map(Number);
  if (!ano || !mes || !dia) return null;

  const nascimento = new Date(ano, mes - 1, dia);
  if (nascimento.getFullYear() !== ano || nascimento.getMonth() !== mes - 1) return null;

  const hoje = new Date();
  let idade = hoje.getFullYear() - ano;
  const aindaNaoFezAniversario =
    hoje.getMonth() < mes - 1 || (hoje.getMonth() === mes - 1 && hoje.getDate() < dia);
  if (aindaNaoFezAniversario) idade--;
  return idade;
}

// Converte AAAA-MM-DD em DD/MM/AAAA para a mensagem do WhatsApp.
export function dataBrasileira(valor: string) {
  const [ano, mes, dia] = valor.split("-");
  return ano && mes && dia ? dia + "/" + mes + "/" + ano : valor;
}
