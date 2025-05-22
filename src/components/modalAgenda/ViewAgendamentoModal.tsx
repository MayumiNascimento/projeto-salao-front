import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Agendamento } from '../../types/Agendamento';

interface ViewAgendamentoModalProps {
  show: boolean;
  onClose: () => void;
  agendamento: Agendamento;
  onUpdateStatus: (id: number, status: 'agendado' | 'concluido' | 'cancelado') => void;
  onUpdate: (agendamento: Agendamento) => void;
  selectedDate: string | null;
}

function ViewAgendamentoModal({ show, onClose, agendamento, onUpdateStatus, onUpdate }: ViewAgendamentoModalProps) {
  const [status, setStatus] = useState(agendamento.status);

  useEffect(() => {
    setStatus(agendamento.status);
  }, [agendamento]);
  

const handleUpdateStatus = async () => {
  if (!agendamento.id) {
    Swal.fire({
      title: 'Erro!',
      text: 'Agendamento inválido',
      icon: 'error',
      confirmButtonColor: '#e74a3b'
    });
    return;
  }

  try {
    await onUpdateStatus(agendamento.id, status);

    Swal.fire({
      title: 'Sucesso!',
      text: 'Status atualizado com sucesso',
      icon: 'success',
      confirmButtonColor: '#4e73df'
    });

    onClose();
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    Swal.fire({
      title: 'Erro!',
      text: 'Não foi possível atualizar o status',
      icon: 'error',
      confirmButtonColor: '#e74a3b'
    });
  }
};

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
    timeZone: 'UTC'
    });
  };

  const getStatusColor = () => {
    switch (status) {
      case 'concluido':
        return 'bg-success';
      case 'cancelado':
        return 'bg-danger';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div 
      className={`modal fade ${show ? 'show' : ''}`} 
      style={{ 
        display: show ? 'block' : 'none', 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(5px)'
      }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header background-custom text-white">
            <h5 className="modal-title">
              <i className="fas fa-calendar-alt me-2"></i>
              Detalhes do Agendamento
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h6 className="card-title text-primary">
                      <i className="fas fa-user me-2"></i>
                      Informações do Cliente
                    </h6>
                    <hr className="mt-1 mb-3" />
                    <p className="mb-2">
                      <strong>Nome:</strong> {agendamento.cliente_nome}
                    </p>
                    <p className="mb-0">
                      <strong>Telefone:</strong> {agendamento.cliente_telefone}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h6 className="card-title text-primary">
                      <i className="fas fa-user-tie me-2"></i>
                      Profissional
                    </h6>
                    <hr className="mt-1 mb-3" />
                    <p className="mb-2">
                      <strong>Nome:</strong> {agendamento.Funcionario?.nome }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h6 className="card-title text-primary">
                      <i className="fas fa-calendar-day me-2"></i>
                      Data e Hora
                    </h6>
                    <hr className="mt-1 mb-3" />
                    <p className="mb-2">
                      <strong>Data:</strong> {formatarData(agendamento.dia)}
                    </p>
                    <p className="mb-0">
                      <strong>Hora:</strong> {agendamento.hora}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h6 className="card-title text-primary">
                      <i className="fas fa-tags me-2"></i>
                      Status
                    </h6>
                    <hr className="mt-1 mb-3" />
                    <span className={`badge ${getStatusColor()} p-2`}>
                      {status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

              <div className="card mb-4 border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="card-title text-primary">
                    <i className="fas fa-concierge-bell me-2"></i>
                    Serviços Contratados
                  </h6>
                  <hr className="mt-1 mb-3" />
                  <div className="table-responsive">
                    <table className="table table-sm table-hover">
                      <thead className="bg-light">
                        <tr>
                          <th>Serviço</th>
                          <th>Preço</th>

                        </tr>
                      </thead>
                      <tbody>
                        {agendamento.Servicos?.map((servico) => (
                          <tr key={servico.id}>
                            <td>{servico.nome}</td>
                            <td>{servico.preco}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-light">
                      <tr>
                        <th colSpan={2}>Desconto</th>
                        <th>-{agendamento.desconto}</th>
                      </tr>
                        <tr className="table-active">
                          <th colSpan={2}>Total</th>
                          <th>
                            {agendamento.total}
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>


            <div className="card mb-4 border-0 shadow-sm">
              <div className="card-body">
                <h6 className="card-title text-primary">
                  <i className="fas fa-info-circle me-2"></i>
                  Observações
                </h6>
                <hr className="mt-1 mb-3" />
                <p className="mb-0">
                  {agendamento.observacoes || 'Nenhuma observação registrada'}
                </p>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="card-title text-primary">
                  <i className="fas fa-sync-alt me-2"></i>
                  Alterar Status
                </h6>
                <hr className="mt-1 mb-3" />
                <div className="btn-group w-100" role="group">
                  <input
                    type="radio"
                    className="btn-check"
                    id="statusAgendado"
                    name="status"
                    value="agendado"
                    checked={status === 'agendado'}
                    onChange={() => setStatus('agendado')}
                  />
                  <label 
                    className={`btn btn-outline-primary ${status === 'agendado' ? 'active' : ''}`}
                    htmlFor="statusAgendado"
                  >
                    Agendado
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    id="statusConcluido"
                    name="status"
                    value="concluido"
                    checked={status === 'concluido'}
                    onChange={() => setStatus('concluido')}
                  />
                  <label 
                    className={`btn btn-outline-success ${status === 'concluido' ? 'active' : ''}`}
                    htmlFor="statusConcluido"
                  >
                    Concluído
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    id="statusCancelado"
                    name="status"
                    value="cancelado"
                    checked={status === 'cancelado'}
                    onChange={() => setStatus('cancelado')}
                  />
                  <label 
                    className={`btn btn-outline-danger ${status === 'cancelado' ? 'active' : ''}`}
                    htmlFor="statusCancelado"
                  >
                    Cancelado
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn background-custom text-white me-2"
              onClick={() => {
                onUpdate(agendamento); 
              }}
            >
              <i className="fas fa-edit me-2"></i>
              Editar
            </button>

            <button 
              type="button" 
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              <i className="fas fa-times me-2"></i>
              Fechar
            </button>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleUpdateStatus}
            >
              <i className="fas fa-save me-2"></i>
              Salvar Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewAgendamentoModal;