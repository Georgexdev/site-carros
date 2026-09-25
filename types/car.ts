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
  destaque_home: boolean;
  opcionais?: string[] | null;
  descricao?: string | null;
};

export type FotoCarro = {
  id: string;
  carro_id: string;
  url: string;
  ordem: number;
};

export type Banner = {
  id: string;
  empresa_id: string;
  imagem_url: string;
  titulo: string | null;
  subtitulo: string | null;
  ordem: number;
  ativo: boolean;
};

export type Administrador = {
  id: string;
  empresa_id: string;
  nome: string;
  papel: "dono" | "funcionario";
  pode_gerenciar_carros: boolean;
  pode_gerenciar_banners: boolean;
  pode_gerenciar_usuarios: boolean;
};