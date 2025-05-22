import React, { useRef, useState } from 'react';
import Funcionario from '../../types/Funcionario';
import Swal from 'sweetalert2';

interface AddFuncionarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  selectedFuncionario?: Funcionario | null;
}

function AddFuncionarioModal ({ isOpen, onClose, onSubmit, selectedFuncionario }: AddFuncionarioModalProps ) {

  const [senha, setSenha] = useState('');

  // Função para gerar senha aleatória
  const gerarSenha = () => {
    const caracteres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
    let senhaGerada = '';
    for (let i = 0; i < 6; i++) {
      senhaGerada += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    setSenha(senhaGerada);
  };

  // Função para copiar senha para a área de transferência
  const copiarSenha = async () => {
    try {
      await navigator.clipboard.writeText(senha);
      Swal.fire('Senha copiada para a área de transferência!');
    } catch (err) {
      Swal.fire('Erro ao copiar a senha.');
    }
  };

  const formRef = useRef<HTMLFormElement>(null);

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current); // Cria o FormData a partir da referência
      onSubmit(formData); // Passa o FormData para a função onSubmit
    }
  };

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header background-custom text-white">
            <h5 className="modal-title">
              <i className="bi bi-person-plus me-2"></i>
              {selectedFuncionario ? 'Editar Funcionário' : 'Adicionar Funcionário'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form ref={formRef} onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nome" className="form-label">Nome:</label>
                <input
                  type="text"
                  className="form-control"
                  id="nome"
                  name="nome"
                  defaultValue={selectedFuncionario?.nome || ''}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email:</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  defaultValue={selectedFuncionario?.email || ''}
                  required
                />
              </div>

              {selectedFuncionario ? 
                <span></span>  :
                <div className="mb-3">
                  <label htmlFor="senha" className="form-label">Senha:</label>
                  <div className=" input-group">
                    <button
                      type="button"
                      className="btn btn-outline-light background-custom"
                      onClick={gerarSenha}
                    >
                    Gerar senha
                    </button>
                    <input
                      type="text"
                      className="form-control"
                      id="senha"
                      name="senha"
                      defaultValue={''}
                      onChange={(e) => setSenha(e.target.value)}
                      value={senha}
                      required
                    />
                  <button type="button" onClick={copiarSenha} className="btn btn-outline-primary">
                    Copiar senha
                  </button>           
                  </div>
                </div>
              }
              <div className="mb-3">
                <label htmlFor="especialidade" className="form-label">Especialidade:</label>
                <input
                  type="text"
                  className="form-control"
                  id="especialidade"
                  name="especialidade"
                  defaultValue={selectedFuncionario?.especialidade || ''}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="tipo" className="form-label">Tipo:</label>
                <select
                  className="form-control"
                  id="tipo"
                  name="tipo"
                  defaultValue={selectedFuncionario?.tipo || 'funcionario'}
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="funcionario">Funcionário</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="comissao" className="form-label">Comissão (%):</label>
                <input
                  type="number"
                  className="form-control"
                  id="comissao"
                  name="comissao"
                  placeholder="Ex: 10"
                  defaultValue={selectedFuncionario?.comissao || ''}
                  required
                />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedFuncionario ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFuncionarioModal;