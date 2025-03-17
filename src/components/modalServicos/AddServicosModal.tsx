import React from 'react';
import { Servico } from '../../types/Servico';

interface AddServicoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  selectedServico?: Servico | null;
}

const AddServicoModal: React.FC<AddServicoModalProps> = ({ isOpen, onClose, onSubmit, selectedServico }) => {
  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header background-custom text-white">
            <h5 className="modal-title">
              <i className="bi bi-pencil-square me-2"></i>
              {selectedServico ? "Editar serviço" : 'Adicionar Serviço'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label htmlFor="serviceName" className="form-label">Serviço:</label>
                <input
                  type="text"
                  className="form-control"
                  id="serviceName"
                  name="serviceName"
                  defaultValue={selectedServico?.nome || ''}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="serviceCategory" className="form-label">Categoria:</label>
                <input
                  type="text"
                  className="form-control"
                  id="serviceCategory"
                  name="serviceCategory"
                  defaultValue={selectedServico?.categoria || ''}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="serviceValue" className="form-label">Valor:</label>
                <input
                  type="number"
                  className="form-control"
                  id="serviceValue"
                  name="serviceValue"
                  placeholder="R$ (valor em reais)"
                  defaultValue={selectedServico?.preco || ''}
                  required
                />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedServico ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddServicoModal;