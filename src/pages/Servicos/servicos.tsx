import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Swal from 'sweetalert2';
import AddServicoModal from '../../components/modalServicos/AddServicosModal';
import ViewServicoModal from '../../components/modalServicos/ViewServicoModal';
import TabelaServicos from '../../components/tabelaServicos/tabelaServicos';
import { Servico } from '../../types/Servico';

function Servicos() {

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [selectedServico, setSelectedServico] = useState<Servico | null>(null);

  useEffect(() => {
    fetchServicos();
  }, []);

  const fetchServicos = async () => {
    try {
      const response = await api.get('/api/servicos'); // Usa a instância do axios
      setServicos(response.data);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    }
  };

  const handleAddServico = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newServico = {
      nome: formData.get('serviceName') as string,
      categoria: formData.get('serviceCategory') as string,
      preco: parseFloat(formData.get('serviceValue') as string),
    };

    try {
      const response = await api.post('/api/servicos', newServico); // Usa a instância do axios
      setServicos([...servicos, response.data]);

      await fetchServicos(); // Atualiza a tabela sem atualizar a página
      setModalOpen(false);

      Swal.fire('Cadastrado!', 'O serviço foi cadastrado com sucesso.', 'success');
    } catch (error) {
      Swal.fire('Erro!', 'Não foi possível cadastrar o serviço.', 'error');
    }
  };

  const handleViewServico = (servico: Servico) => {
    setSelectedServico(servico);
    setViewModalOpen(true);
  };

  const handleDeleteServico = async (id: number) => {
    try {
      await api.delete(`/api/servicos/${id}`); // Usa a instância do axios
      setServicos(servicos.filter((servico) => servico.id !== id));

      Swal.fire('Excluído!', 'O serviço foi excluído com sucesso.', 'success');
    } catch (error) {
      Swal.fire('Erro!', 'Não foi possível excluir o serviço.', 'error');
    }
  };

  const handleUpdateServico = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedServico) return;

    const formData = new FormData(event.currentTarget);
    const updatedServico = {
      nome: formData.get('serviceName') as string,
      categoria: formData.get('serviceCategory') as string,
      preco: parseFloat(formData.get('serviceValue') as string),
    };

    try {
      await api.put(`/api/servicos/${selectedServico.id}`, updatedServico); // Usa a instância do axios
      setServicos(servicos.map(servico =>
        servico.id === selectedServico.id ? { ...servico, ...updatedServico } : servico
      ));

      setModalOpen(false);

      Swal.fire('Atualizado!', 'O serviço foi atualizado com sucesso.', 'success');
    } catch (error) {
      Swal.fire('Erro!', 'Não foi possível atualizar o serviço.', 'error');
    }
  };

  const handleEdit = (servico: Servico) => {
    setSelectedServico(servico)
    setModalOpen(true)
  };


  return (
    <main role="main" className=" flex-column h-sm-100">
      <h1 className="mt-4">Serviços Cadastrados</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Filtro de busca:"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <button
          className="btn background-custom text-white"
          onClick={() => 
          {
            setSelectedServico(null) //para limpar os campos do modal
            setModalOpen(true)
          }}
        >
          Novo Serviço
        </button>
      </div>

      <TabelaServicos 
        servicos={servicos}
        searchTerm={searchTerm}
        onView={handleViewServico}
        onEdit={handleEdit}
        onDelete={handleDeleteServico}
        />

      <AddServicoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={selectedServico ? handleUpdateServico : handleAddServico}
        selectedServico={selectedServico}
      />

      <ViewServicoModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        selectedServico={selectedServico}
      />
    </main>
  );
};

export default Servicos;