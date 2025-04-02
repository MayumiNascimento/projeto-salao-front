import React from 'react';

interface BotaoFlutuanteProps {
  onClick: () => void
}

function BotaoFlutuante ({onClick}: BotaoFlutuanteProps) {
  return (
    <div>
        <button
          id="botaoFlutuante"
          className="btn background-custom btn-lg rounded-circle text-white"
          style={{ position: 'fixed', bottom: '40px', right: '40px', zIndex: 1000 }}
          onClick={onClick}
        >
        <i className="bi bi-plus"></i>
        </button>  
    </div>
  );
};

export default BotaoFlutuante;