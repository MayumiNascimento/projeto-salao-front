import React from 'react';
import { Servico } from '../../types/Servico';

interface TabelaServicosProps {
  servicos: Servico[];
  searchTerm: string;
  onView: (servicos: Servico) => void;
  onEdit: (servicos: Servico) => void;
  onDelete: (id: number) => void;
}

const TabelaServicos: React.FC<TabelaServicosProps> = ({ 
    servicos, 
    searchTerm, 
    onView,
    onEdit,
    onDelete,}) => {

        const filteredServicos = servicos.filter((servico) => {
            const searchLower = searchTerm.toLowerCase();
            return (
              servico.nome?.toLowerCase().includes(searchLower) || // Filtra por nome
              servico.categoria?.toLowerCase().includes(searchLower) // Filtra por categoria
            );
          });

return(
    <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Serviço</th>
              <th>Categoria</th>
              <th>Valor</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredServicos.map((servico) => (
              <tr key={servico.id}>
                <td>{servico.nome}</td>
                <td>{servico.categoria}</td>
                <td>R$ {servico.preco}</td>
                <td>
                  <button
                    className="btn btn-sm border mr-2"
                    onClick={() => onView(servico)}
                  >
                    <i className="bi bi-eye"></i>
                  </button>
                  <button
                    className="btn btn-sm border mr-2"
                    onClick={() => { onEdit(servico);
                    }}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger "
                    onClick={() => onDelete(servico?.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
)
}

export default TabelaServicos;
