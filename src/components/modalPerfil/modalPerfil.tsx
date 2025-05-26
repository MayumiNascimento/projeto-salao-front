import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import api from '../../services/api';
import Swal from 'sweetalert2';
import Funcionario  from '../../types/Funcionario';

interface PerfilModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuario: Funcionario
}

function PerfilModal({ isOpen, onClose, usuario } : PerfilModalProps){
const [senhaAtual, setSenhaAtual] = useState<string>('');
  const [novaSenha, setNovaSenha] = useState<string>('');
  const [confirmarSenha, setConfirmarSenha] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleTrocaSenha = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (novaSenha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        'api/funcionarios/trocar-senha',
        {
          id: usuario.id,
          senhaAtual,
          novaSenha,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      Swal.fire('Sucesso!', response.data.message, 'success');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
      setError('');

    } catch (erro) {
      console.error(erro);
      Swal.fire('Erro','Senha atual incorreta')
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(

  <div className="modal fade show" 
      style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
      <div className="modal-dialog modal-dialog-centered" style={{position: 'relative'}}>
        <div className="modal-content">
          <div className="modal-header background-custom text-white">
            <h5 className="modal-title">
              <i className="bi bi-person-circle me-2"></i>
              Perfil do Usuário
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-4">
              <h1 className=' fs-4'><strong>Informações do {usuario.tipo === 'admin' ? 'Administrador' : 'Funcionário'}</strong></h1>
              <p><strong>Nome:</strong> {usuario.nome}</p>
              <p><strong>Email:</strong> {usuario.email}</p>
              <p><strong>Comissão:</strong> {usuario.comissao}%</p>
              {usuario.especialidade && <p><strong>Especialidade:</strong> {usuario.especialidade}</p>}
            </div>

            <hr />

            <h2 className='text-center fs-5'>Trocar Senha</h2>
            <form onSubmit={handleTrocaSenha}>
              <div className="mb-3">
                <label htmlFor="senhaAtual" className="form-label">Senha Atual</label>
                <input
                  type="password"
                  className="form-control"
                  id="senhaAtual"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="novaSenha" className="form-label">Nova Senha</label>
                <input
                  type="password"
                  className="form-control"
                  id="novaSenha"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmarSenha" className="form-label">Confirmar Nova Senha</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmarSenha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                />
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Fechar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar Senha
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PerfilModal;