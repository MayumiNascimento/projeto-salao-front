import { useState, useEffect } from 'react';
import api from '../../services/api';

import Swal from 'sweetalert2';
import AddFuncionarioModal from '../../components/modalFuncionarios/AddFuncionariosModal';
import ViewFuncionarioModal from '../../components/modalFuncionarios/ViewFuncionariosModal';
import Funcionario from '../../types/Funcionario';
import TabelaFuncionarios from '../../components/tabelaFuncionarios/tabelaFuncionarios';

function Funcionarios (){

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  const fetchFuncionarios = async () => {
    try {
      const response = await api.get('api/funcionarios');
      setFuncionarios(response.data);
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
    }
  };

  const handleAddFuncionario = async (formData: FormData) => {

    const newFuncionario = {
      nome: formData.get('nome') as string,
      email: formData.get('email') as string,
      senha: formData.get('senha') as string,
      especialidade: formData.get('especialidade') as string,
      tipo: formData.get('tipo') as 'admin' | 'funcionario',
      comissao: parseFloat(formData.get('comissao') as string),
    };

    try {
      const response = await api.post('api/funcionarios', newFuncionario);
      setFuncionarios((prevFuncionarios) => [...prevFuncionarios, response.data]);
      setModalOpen(false);

      Swal.fire('Cadastrado!', 'O funcionário foi cadastrado com sucesso.', 'success');
    } catch (error) {
      console.error('Erro ao adicionar funcionário:', error);
      Swal.fire('Erro!', 'Não foi possível cadastrar o funcionário.', 'error');
    }
  };

  const handleViewFuncionario = (funcionario: Funcionario) => {
    setSelectedFuncionario(funcionario);
    setViewModalOpen(true);
  };

  const handleDeleteFuncionario = async (id: number) => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Você não poderá reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`api/funcionarios/${id}`); 
        setFuncionarios(funcionarios.filter((funcionario) => funcionario.id !== id));

        Swal.fire('Excluído!', 'O funcionário foi excluído com sucesso.', 'success');
      } catch (error) {
        console.error('Erro ao excluir funcionário:', error);
        Swal.fire('Erro!', 'Não foi possível excluir o funcionário.', 'error');
      }
    }
  };

  const handleUpdateFuncionario = async (formData: FormData) => {
   
    if (!selectedFuncionario) return;

    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente atualizar este funcionário?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, atualizar!',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {

      const updatedFuncionario = {
        nome: formData.get('nome') as string,
        email: formData.get('email') as string,
        senha: formData.get('senha') as string,
        especialidade: formData.get('especialidade') as string,
        tipo: formData.get('tipo') as 'admin' | 'funcionario',
        comissao: parseFloat(formData.get('comissao') as string),
      };

      try {
        await api.put(`api/funcionarios/${selectedFuncionario.id}`, updatedFuncionario); 
        setFuncionarios(funcionarios.map((funcionario) =>
          funcionario.id === selectedFuncionario.id ? { ...funcionario, ...updatedFuncionario } : funcionario
        ));

        setModalOpen(false);

        Swal.fire('Atualizado!', 'O funcionário foi atualizado com sucesso.', 'success');
      } catch (error) {
        console.error('Erro ao atualizar funcionário:', error);
        Swal.fire('Erro!', 'Não foi possível atualizar o funcionário.', 'error');
      }
    }
  };

    // Função para abrir o modal de edição
    const handleEditFuncionario = (funcionario: Funcionario) => {
      setSelectedFuncionario(funcionario);
      setModalOpen(true);
    };


  return (
    <main role="main" className="flex-column h-sm-100">
      <h1 className="mt-4">Funcionários Cadastrados</h1> <hr className="mb-4" />

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nome, email ou especialidade"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <button
          className="btn background-custom text-white"
          onClick={() => {
            setSelectedFuncionario(null);
            setModalOpen(true);
          }}
        >
          Novo Funcionário
        </button>
      </div>
          <TabelaFuncionarios 
            funcionarios={funcionarios}
            searchTerm={searchTerm}
            onView={handleViewFuncionario}
            onEdit={handleEditFuncionario}
            onDelete={handleDeleteFuncionario} />

      <AddFuncionarioModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedFuncionario(null);
        }}
        onSubmit={selectedFuncionario ? handleUpdateFuncionario : handleAddFuncionario}
        selectedFuncionario={selectedFuncionario}
      />

      <ViewFuncionarioModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        selectedFuncionario={selectedFuncionario}
      />
    </main>
  );
};

export default Funcionarios;