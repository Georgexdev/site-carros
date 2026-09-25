import { DadosLoja } from "@/lib/loja";
import { Carro, FotoCarro } from "@/types/car";
import { SITE_URL } from "@/lib/site";

// Dados estruturados (Schema.org): um "cartão" invisível que explica ao Google
// que o site é uma loja de carros e que cada página de carro é uma oferta com preço.

// "8h às 17h" → "08:00-17:00" (retorna null se não conseguir entender)
function converterHorario(texto: string) {
  const achado = texto.match(/(\d{1,2})\s*h\s*(\d{2})?\s*(?:às|as|a|-|–)\s*(\d{1,2})\s*h\s*(\d{2})?/i);
  if (!achado) return null;
  const inicio = achado[1].padStart(2, "0") + ":" + (achado[2] || "00");
  const fim = achado[3].padStart(2, "0") + ":" + (achado[4] || "00");
  return inicio + "-" + fim;
}

export function dadosDaLoja(loja: DadosLoja) {
  const horarios: string[] = [];
  const semana = converterHorario(loja.horarios[0].horario);
  const sabado = converterHorario(loja.horarios[1].horario);
  const domingo = converterHorario(loja.horarios[2].horario);
  if (semana) horarios.push("Mo-Fr " + semana);
  if (sabado) horarios.push("Sa " + sabado);
  if (domingo) horarios.push("Su " + domingo);

  const [cidade, estado] = loja.endereco.cidade.split("/").map((t) => t.trim());

  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: loja.nome,
    description: loja.descricao,
    url: SITE_URL,
    image: SITE_URL + "/apple-icon.png",
    telephone: "+" + loja.whatsapp,
    email: loja.email || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: loja.endereco.linha1,
      addressLocality: cidade,
      addressRegion: estado,
      postalCode: loja.endereco.cep,
      addressCountry: "BR",
    },
    openingHours: horarios.length ? horarios : undefined,
    sameAs: [loja.instagramUrl],
  };
}

export function dadosDoCarro(carro: Carro, fotos: FotoCarro[], nomeLoja: string) {
  const nome = [carro.marca, carro.modelo, carro.versao].filter(Boolean).join(" ");
  const url = SITE_URL + "/carro/" + carro.id;

  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name: nome + " " + carro.ano_fabricacao + "/" + carro.ano_modelo,
    url,
    image: fotos.map((f) => f.url),
    brand: { "@type": "Brand", name: carro.marca },
    model: carro.modelo,
    vehicleModelDate: String(carro.ano_modelo),
    productionDate: String(carro.ano_fabricacao),
    mileageFromOdometer: { "@type": "QuantitativeValue", value: carro.km, unitCode: "KMT" },
    fuelType: carro.combustivel || undefined,
    vehicleTransmission: carro.cambio || undefined,
    color: carro.cor || undefined,
    itemCondition: "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      url,
      price: carro.preco,
      priceCurrency: "BRL",
      availability:
        carro.status === "vendido" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      seller: { "@type": "AutoDealer", name: nomeLoja },
    },
  };
}

// Transforma o objeto em texto seguro para colocar dentro de <script>.
export function paraScript(dados: object) {
  return JSON.stringify(dados).replace(/</g, "\\u003c");
}
