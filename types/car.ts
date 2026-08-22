export type Carro = {
    id: string;
    marca: string;
    modelo: string
    versao: string;
    anoFabricacao: number;
    anoModelo: number;
    preco: number;
    km: number;
    imagem: string;
    combustivel: string;
    cambio: string;
    cor: string;
    status: "disponivel" | "vendido";
};
