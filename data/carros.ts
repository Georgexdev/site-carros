import { Carro } from "@/types/car";

export const carrosMock: Carro[] = [
    {
    id: "1",
    marca: "Toyota",
    modelo: "Corolla",
    versao: "Altis Hybrid",
    anoFabricacao: 2023,
    anoModelo: 2024,
    preco: 155900,
    km: 12000,
    imagem: "https://placehold.co/600x400?text=Corolla",
    status: "disponivel",
    combustivel: "Híbrido (Flex + Elétrico)",
    cambio: "Automático CVT",
    cor: "Prata",
  },
  {
    id: "2",
    marca: "Honda",
    modelo: "Civic",
    versao: "Touring",
    anoFabricacao: 2022,
    anoModelo: 2023,
    preco: 142500,
    km: 25000,
    imagem: "https://placehold.co/600x400?text=Civic",
    status: "vendido",
    combustivel: "Flex",
    cambio: "Automático CVT",
    cor: "Preto",
  },
];