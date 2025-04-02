import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Swal from 'sweetalert2';
import Select from 'react-select';

import { Servico } from '../../types/Servico';
import Funcionario from '../../types/Funcionario';
import { Agendamento } from '../../types/Agendamento';

interface AddAgendamentoModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (event: any) => void; 
  selectedDate?: string | null;
  onUpdate?: Agendamento
}

const AddAgendamentoModal: React.FC<AddAgendamentoModalProps> = ({ show, onClose, onSubmit, selectedDate, onUpdate }) => {
  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  const [servicoId, setServicoId] = useState<number[]>([]);
  const [funcionario, setFuncionario] = useState<Funcionario[]>([]);
  const [dia, setDia] = useState(selectedDate || '');
  const [hora, setHora] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const [desconto, setDesconto] = useState<number | ''>('');
  const [total, setTotal] = useState(0);

  const [servicos, setServicos] = useState<Servico[]>([]); 
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]); 

    // Busca a lista de serviços da API
    const fetchServicos = async () => {
      try {
        const response = await api.get<Servico[]>('api/servicos');
        setServicos(response.data);
      } catch (error) {
        console.error('Erro ao buscar serviços:', error);
      }
    };
  
    // Busca a lista de funcionários da API
    const fetchFuncionarios = async () => {
      try {
        const response = await api.get<Funcionario[]>('api/funcionarios');
        setFuncionarios(response.data);
      } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
      }
    };
  
    // Carrega as listas ao abrir o modal
    useEffect(() => {
      if (show) {
        fetchServicos();
        fetchFuncionarios();
      }
    }, [show]);

      // Formatação para o React select
  const servicoOptions = servicos.map((servico) => ({
    value: servico.id,
    label: `${servico.nome} - R$ ${servico.preco}`,
  }));

  const funcionarioOptions = funcionarios.map((funcionario) => ({
    value: funcionario.id,
    label: funcionario.nome,
  }));

  useEffect(() => {
    if (onUpdate) {
      setClienteNome(onUpdate.cliente_nome);
      setClienteTelefone(onUpdate.cliente_telefone);
      setServicos(onUpdate.Servicos);
      setFuncionario(onUpdate.Funcionario);
      setDia(onUpdate.dia);
      setHora(onUpdate.hora);
      setObservacoes(onUpdate.observacoes || '');
      setDesconto(onUpdate.desconto || '');
      setTotal(parseFloat(onUpdate.total));
    } else {
      // Limpa os campos se for um novo agendamento
      setClienteNome('');
      setClienteTelefone('');
      setServicos([]);
      setFuncionarioId('');
      setDia(selectedDate || '');
      setHora('');
      setObservacoes('');
      setDesconto('');
      setTotal(0);
    }
  }, [onUpdate, selectedDate]);


  // ==================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const eventData: Agendamento = {
      cliente_nome: clienteNome,
      cliente_telefone: clienteTelefone,
      funcionario_id: funcionarioId as number,
      dia,
      hora,
      observacoes,
      desconto: desconto || 0,
      status: 'agendado',
      Servicos: servicos,
      id: 0,
      total: '',
      Funcionario: funcionarios
    };

    try {
      if (onUpdate) {
        // Edição - PUT request
        await api.put(`api/agendamentos/${onUpdate.id}`, eventData);
        Swal.fire('Atualizado!', 'O agendamento foi atualizado com sucesso.', 'success');
      } else {
        // Criação - POST request
        const response = await api.post('api/agendamentos', eventData);
        eventData.id = response.data.id;
      }
      
      onSubmit({
        ...eventData,
        Servicos: servicos.filter(s => servicoId.includes(s.id))
      });
      onClose();
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      Swal.fire('Erro!', 'Não foi possível salvar o agendamento.', 'error');
    }
  };

  useEffect(() => { //atualiza o campo 'dia' quando o selectedDate é atualizado
    if(selectedDate){
      setDia(selectedDate)
    }
  }, [selectedDate])


  return (
    <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog w-50">
        <div className="modal-content">
        <div className="modal-header background-custom text-white">
            <h5 className="modal-title">
              <i className="bi bi-person-plus me-2"></i>
              {onUpdate ? 'Editar Agendamento' : 'Novo Agendamento'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>(*) Campos obrigatórios</p>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="mb-3 col-md-6">
                  <label htmlFor="clienteNome">*Cliente:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="clienteNome"
                    value={clienteNome}
                    onChange={(e) => setClienteNome(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3 col-md-6">
                  <label htmlFor="clienteTelefone">*Telefone (WhatsApp):</label>
                  <input
                    type="text"
                    className="form-control"
                    id="clienteTelefone"
                    value={clienteTelefone}
                    onChange={(e) => setClienteTelefone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="mb-3 col-md-6">
                  <label htmlFor="dia">*Data:</label>
                  <input
                    type="date"
                    className="form-control"
                    id="dia"
                    value={dia}
                    onChange={(e) => setDia(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3 col-md-6">
                  <label htmlFor="hora">*Hora:</label>
                  <input
                    type="time"
                    className="form-control"
                    id="hora"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="servicos">*Serviço:</label>
                <Select
                  options={servicoOptions}
                  isMulti // Permite seleção múltipla
                  onChange={() => {
                    setServicos(servicos);
                  }}
                  placeholder="Selecione os serviços..."
                />
              </div>

              <div className="mb-3">
                <label htmlFor="funcionarioId">*Funcionário:</label>
                <Select
                  options={funcionarioOptions}
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setFuncionario(selectedOption.value);
                    }
                  }}
                  placeholder="Selecione o funcionário..."
                />
              </div>

              <div className="row">
                <div className="mb-3 col-md-6">
                  <label htmlFor="valorTotal">Valor Total:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="valorTotal"
                    value={total}
                    disabled
                  />
                </div>
                <div className="mb-3 col-md-6">
                  <label htmlFor="desconto">Desconto (opcional):</label>
                  <input
                    type="number"
                    className="form-control"
                    id="desconto"
                    value={desconto}
                    onChange={(e) => setDesconto(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="valorComDesconto">Valor com Desconto:</label>
                <input
                  type="text"
                  className="form-control"
                  id="valorComDesconto"
                  value={total}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label htmlFor="observacoes">Observações:</label>
                <textarea
                  className="form-control"
                  id="observacoes"
                  rows={3}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary">
                Salvar Evento
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAgendamentoModal;