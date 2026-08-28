export type Carro = {
  id: string;
  empresa_id: string;
  marca: string;
  modelo: string;
  versao: string;
  ano_fabricacao: number;
  ano_modelo: number;
  preco: number;
  km: number;
  status: "disponivel" | "vendido";
  combustivel: string;
  cambio: string;
  cor: string;
  placa?: string;
  chassi?: string;
  mostrar_placa_chassi: boolean;
};

export type FotoCarro = {
  id: string;
  carro_id: string;
  url: string;
  ordem: number;
};
