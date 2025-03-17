import React, { useState } from 'react';
import axios from 'axios';
import { Agendamento } from '../../types/Agendamento';

function Relatorio() {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [error, setError] = useState<string>('');
    const [isSearchPerformed, setIsSearchPerformed] = useState<boolean>(false); // Estado para controlar se a busca foi realizada
  
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!startDate || !endDate) {
          setError('Por favor, selecione ambas as datas.');
          return;
        }
    
        try {
          const response = await axios.get('http://localhost:3000/api/agendamentos', {
            params: { startDate, endDate },
          });
            setAgendamentos(response.data);
            setError('');
            setIsSearchPerformed(true);
        } catch (err) {
            setError('Erro ao buscar agendamentos.');
            console.error(err);
            setIsSearchPerformed(true); 
        }
      };
  
    return (
        <div role="main" className="col d-flex flex-column h-sm-100 p-4">
            <div className="instruction bg-light p-4 rounded mb-4 shadow-sm">
              <h1 className="h4 mb-3">Gerar relatório</h1>
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
              <form onSubmit={handleSubmit} className="mb-4">
                <div className="row g-3">
                  <div className="col-md-5">
                    <label htmlFor="startDate" className="form-label">Data Inicial</label>
                    <input
                      type="date"
                      className="form-control"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-5">
                    <label htmlFor="endDate" className="form-label">Data Final</label>
                    <input
                      type="date"
                      className="form-control"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-2 d-flex align-items-end">
                    <button type="submit" className="btn background-custom text-white w-100">
                      Gerar Relatório
                    </button>
                  </div>
                </div>
              </form>
  
              {error && <div className="alert alert-danger">{error}</div>}
  
              {/* Tabela só é exibida se a busca foi realizada */}
              {isSearchPerformed && (
                <table className="table-responsive table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Data</th>
                      <th>Cliente</th>
                      <th>Serviço</th>
                      <th>Funcionário</th>
                      <th>Valor do serviço</th>
                      <th>Descontos</th>
                      <th>Comissão do funcionário</th>
                      <th>Valor Líquido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agendamentos.length > 0 ? (
                      agendamentos.map((agendamento) => (
                        <tr key={agendamento.id}>
                          <td>{agendamento.data}</td>
                          <td>{agendamento.cliente}</td>
                          <td>{agendamento.servico}</td>
                          <td>{agendamento.funcionario}</td>
                          <td>R$ {agendamento.valorServico.toFixed(2)}</td>
                          <td>R$ {agendamento.descontos.toFixed(2)}</td>
                          <td>R$ {agendamento.comissaoFuncionario.toFixed(2)}</td>
                          <td>R$ {agendamento.valorLiquido.toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="text-center">Nenhum agendamento encontrado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
            </div>
    );
  };
  
  export default Relatorio;