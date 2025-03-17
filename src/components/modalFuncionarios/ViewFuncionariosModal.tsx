import React from 'react';
import Funcionario  from '../../types/Funcionario';

interface ViewFuncionarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFuncionario: Funcionario | null;
}

const ViewFuncionarioModal: React.FC<ViewFuncionarioModalProps> = ({ isOpen, onClose, selectedFuncionario }) => {
  if (!isOpen || !selectedFuncionario) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header background-custom text-white">
            <h5 className="modal-title">
              <i className="bi bi-person-circle me-2"></i>
              Detalhes do Funcionário
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <strong>Nome:</strong> {selectedFuncionario.nome}
            </div>
            <div className="mb-3">
              <strong>Email:</strong> {selectedFuncionario.email}
            </div>
            <div className="mb-3">
              <strong>Especialidade:</strong> {selectedFuncionario.especialidade}
            </div>
            <div className="mb-3">
              <strong>Tipo:</strong> {selectedFuncionario.tipo === 'admin' ? 'Administrador' : 'Funcionário'}
            </div>
            <div className="mb-3">
              <strong>Comissão:</strong> {selectedFuncionario.comissao}%
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewFuncionarioModal;