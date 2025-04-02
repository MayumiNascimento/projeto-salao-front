import Funcionario from "./Funcionario";
import { Servico } from "./Servico";
export type Agendamento = {
  id: number;
  cliente_nome: string;
  cliente_telefone: string;
  funcionario_id: number;
  dia: string; // Data no formato YYYY-MM-DD
  hora: string; // Hora no formato HH:MM:SS
  status: 'agendado' | 'concluido' | 'cancelado';
  observacoes?: string;
  desconto?: number;
  total: string;
  Servicos: Servico[];
  Funcionario: Funcionario;
};