export default interface Funcionario {
    id: number;
    nome: string;
    email: string;
    senha: string;
    especialidade: string;
    tipo: 'admin' | 'funcionario';
    comissao: number; // Valor em porcentagem
  }