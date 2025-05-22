import React from 'react';
import Funcionario from '../../types/Funcionario';

interface TabelaFuncionariosProps {
  funcionarios: Funcionario[];
  searchTerm: string;
  onView: (funcionario: Funcionario) => void;
  onEdit: (funcionario: Funcionario) => void;
  onDelete: (id: number) => void;
}

const TabelaFuncionarios: React.FC<TabelaFuncionariosProps> = ({ 
    funcionarios, 
    searchTerm, 
    onView,
    onEdit,
    onDelete,}) => {

  // filtro de busca
  const filteredFuncionarios = funcionarios.filter((funcionario) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      funcionario.nome?.toLowerCase().includes(searchLower) ||
      funcionario.email?.toLowerCase().includes(searchLower) ||
      funcionario.especialidade?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Email</th>
          <th>Especialidade</th>
        </tr>
      </thead>
      <tbody>
        {filteredFuncionarios.map((funcionario) => {
          const desativado = funcionario.nome.startsWith('Funcionário Desativado');

        return(
          
          <tr key={funcionario.id}>
            <td>{funcionario.nome}</td>
            <td>{funcionario.email}</td>
            <td>{funcionario.especialidade} </td>
            <td>
              <button
                className="btn btn-sm border mr-2"
                onClick={() => onView(funcionario)}
                disabled={desativado}
              >
                <i className="bi bi-eye"></i>
              </button>
              <button
                className="btn btn-sm border mr-2"
                onClick={() => {onEdit(funcionario); }}
                disabled={desativado}
              >
                <i className="bi bi-pencil"></i>
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => onDelete(funcionario.id!)}
                disabled={desativado}
              >
                <i className="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        )})}
      </tbody>
    </table>
  );
};

export default TabelaFuncionarios;