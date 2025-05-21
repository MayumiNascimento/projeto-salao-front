import React, { useState } from 'react';
import api from '../../services/api';
import { format } from 'date-fns';
import { Agendamento } from '../../types/Agendamento';

interface RelatorioAPI {
  periodo: {
    dataInicio: string;
    dataFim: string;
  };
  totalBruto: string;
  totalLiquido: string;
  comissoes: {
    nome: string;
    totalComissao: number;
  }[];
  agendamentosConcluidos: Agendamento[];
  agendamentosCancelados: Agendamento[];
}


function Relatorio() {

  const [formData, setFormData] = useState({
    dataInicio: format(new Date(), 'yyyy-MM-dd'),
    dataFim: format(new Date(), 'yyyy-MM-dd'),
    incluirCancelados: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [relatorio, setRelatorio] = useState<RelatorioAPI | null>(null);
  const [activeTab, setActiveTab] = useState('concluidos');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const gerarRelatorio = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        dataInicio: formData.dataInicio,
        dataFim: formData.dataFim,
        incluirCancelados: formData.incluirCancelados.toString()
      };

      const response = await api.get<RelatorioAPI>('api/relatorio', { params });
      setRelatorio(response.data);
    }  finally {
      setLoading(false);
    }
  };

    const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
    timeZone: 'UTC'
    });
  };
  
    return (
        <div role="main" className="col d-flex flex-column h-sm-100 p-4">
            <div className="instruction bg-light p-4 rounded mb-4 shadow-sm">
              <h1 className="h4 mb-3">Gerar relatório</h1> <hr className="mb-4" />
              <p className="mb-3">
                Para gerar um relatório de atendimentos, siga os passos abaixo:
              </p>
              <ol className="mb-3">
                <li className="mb-2">Selecione a <strong>Data Inicial</strong> no campo correspondente.</li>
                <li className="mb-2">
                  Selecione a <strong>Data Final</strong> no campo correspondente. <br />
                  <small className="text-muted">Escolha até qual data deseja incluir no relatório. A data final deve ser igual ou posterior à data inicial.</small>
                </li>
                <li>Clique no botão <strong>"Gerar Relatório"</strong>.</li>
              </ol>
              <p className="mb-0">
                O relatório exibirá todos os atendimentos concluídos dentro do intervalo de datas selecionado.
              </p>
            </div>
  
            <div className="report-container bg-white p-4 rounded shadow-sm">

            <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label">Data Início</label>
              <input
                type="date"
                className="form-control"
                name="dataInicio"
                value={formData.dataInicio}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Data Fim</label>
              <input
                type="date"
                className="form-control"
                name="dataFim"
                value={formData.dataFim}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 d-flex align-items-center">
              <div className="form-check mt-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="incluirCancelados"
                  checked={formData.incluirCancelados}
                  onChange={handleChange}
                />
                <label className="form-check-label">
                  Incluir cancelados
                </label>
              </div>
            </div>
          </div>
          
          <button
            className="btn btn-primary"
            onClick={gerarRelatorio}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Gerando...
              </>
            ) : 'Gerar Relatório'}
          </button>
          
          {error && (
            <div className="alert alert-danger mt-3">
              {error}
            </div>
          )}
          
          {relatorio && (
            <div className="mt-4">
              <h4 className="mb-3">
                Período: {formatarData(relatorio.periodo.dataInicio)} a {formatarData(relatorio.periodo.dataFim)}
              </h4>
              
              <div className="row mb-4">
                <div className="col-md-4 mb-3">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h5 className="card-title">Total Bruto</h5>
                      <h3 className="card-text">R$ {relatorio.totalBruto}</h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h5 className="card-title">Total Líquido</h5>
                      <h3 className="card-text">R$ {relatorio.totalLiquido}</h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h5 className="card-title">Total Comissões</h5>
                      <h3 className="card-text">
                        R$ {relatorio.comissoes
                            .reduce((sum, comissao) => sum + comissao.totalComissao, 0).toFixed(2)
                        }
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
              
              <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'concluidos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('concluidos')}
                  >
                    Agendamentos Concluídos
                  </button>
                </li>
                {relatorio.agendamentosCancelados.length > 0 && (
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'cancelados' ? 'active' : ''}`}
                      onClick={() => setActiveTab('cancelados')}
                    >
                      Cancelados ({relatorio.agendamentosCancelados.length})
                    </button>
                  </li>
                )}
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'comissoes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('comissoes')}
                  >
                    Comissões
                  </button>
                </li>
              </ul>
              
              {activeTab === 'concluidos' && (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Cliente</th>
                        <th>Funcionário</th>
                        <th>Serviço</th>
                        <th>Desconto aplicado</th>
                        <th className="text-end">Valor (R$)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {relatorio.agendamentosConcluidos.map((agendamento) => (
                        <tr key={agendamento.id}>
                          <td>{new Date(agendamento.dia).toLocaleDateString()}</td>
                          <td>{agendamento.cliente_nome}</td>
                          <td>{agendamento.funcionario_id}</td>
                          <td>
                            <ul className="list-unstyled mb-0">
                              {agendamento.Servicos?.map((servico, idx) => (
                                <li key={idx}>
                                  {servico.nome} - R${(servico.preco)}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td>{agendamento.desconto}</td>
                          <td className="text-end">{agendamento.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {activeTab === 'cancelados' && relatorio.agendamentosCancelados.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>Funcionário</th>
                        <th>Data</th>
                        <th>Hora</th>
                      </tr>
                    </thead>
                    <tbody>
                      {relatorio.agendamentosCancelados.map((agendamento) => (
                        <tr key={agendamento.id}>
                          <td>{agendamento.cliente_nome}</td>
                          <td>{agendamento.funcionario_id}</td>
                          <td>{agendamento.dia}</td>
                          <td>{agendamento.hora}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {activeTab === 'comissoes' && (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Funcionário</th>
                        <th className="text-end">Comissão (R$)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {relatorio.comissoes.map((comissao, index) => (
                        <tr key={index}>
                          <td>{comissao.nome}</td>
                          <td className="text-end">{comissao.totalComissao.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

  
              
    </div>
  </div>
)};
  
export default Relatorio;