// Tira espaços e tabs repetidos (ex.: "Civic\t\tEXL  " → "Civic EXL").
export function limparTexto(valor?: string | null) {
  return (valor || "").replace(/\s+/g, " ").trim();
}

// "Honda Civic EXL" — sem espaços sobrando quando a versão está vazia.
export function nomeDoCarro(carro: { marca?: string | null; modelo?: string | null; versao?: string | null }) {
  return [carro.marca, carro.modelo, carro.versao].map(limparTexto).filter(Boolean).join(" ");
}
