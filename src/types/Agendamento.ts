export interface Agendamento {
    id: number;
    data: string;
    cliente: string;
    servico: string;
    funcionario: string;
    valorServico: number;
    descontos: number;
    comissaoFuncionario: number;
    valorLiquido: number;
  }