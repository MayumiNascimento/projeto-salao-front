import React from 'react';
import { Servico } from '../../types/Servico';

interface ViewServicoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServico: Servico | null;
}

const ViewServicoModal: React.FC<ViewServicoModalProps> = ({ isOpen, onClose, selectedServico }) => {
  if (!isOpen || !selectedServico) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header background-custom text-white">
            <h5 className="modal-title">
              <i className="bi bi-eye me-2"></i>
              Detalhes do Serviço
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <strong>Serviço:</strong> {selectedServico.nome}
            </div>
            <div className="mb-3">
              <strong>Categoria:</strong> {selectedServico.categoria}
            </div>
            <div className="mb-3">
              <strong>Valor:</strong> R$ {selectedServico.preco}
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewServicoModal;