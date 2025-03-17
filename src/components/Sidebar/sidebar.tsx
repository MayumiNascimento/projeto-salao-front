import React, { useState, useEffect } from 'react';
import { Link, useNavigate  } from 'react-router';

import PerfilModal from '../modalPerfil/modalPerfil';
import Funcionario  from '../../types/Funcionario';

function Sidebar() {
  const [usuario, setUsuario] = useState<Funcionario | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove o token
    navigate('/'); // Redireciona para o login
  };

  // Recupera os dados do funcionário do localStorage ao carregar o componente
  useEffect(() => {
    const funcionarioSalvo = localStorage.getItem('funcionario');
    if (funcionarioSalvo) {
      setUsuario(JSON.parse(funcionarioSalvo));
    }
  }, []);

  const [isPerfilModalOpen, setIsPerfilModalOpen] = useState<boolean>(false);

  const handleOpenPerfilModal = () => {
    setIsPerfilModalOpen(true);
  };

  const handleClosePerfilModal = () => {
    setIsPerfilModalOpen(false);
  };

  return (
    <div className="container-fluid overflow-hidden">
      <div className="row vh-100 overflow-auto">
        <div className="col-12 col-md-auto px-sm-2 px-0 background-custom d-flex flex-column sticky-top sidebar h-auto overflow-auto">
          <div className="d-flex flex-sm-column flex-row flex-grow-1 align-items-center align-items-sm-start px-3 pt-2 text-white">
            <Link to="/" className="d-flex align-items-center pb-sm-3 mb-md-5 me-md-auto text-white text-decoration-none">
              <span className="fs-5px">BeleSys</span>
            </Link>
            <ul className="nav nav-pills flex-sm-column flex-row flex-nowrap flex-shrink-1 flex-sm-grow-0 flex-grow-1 mb-sm-auto mb-0 justify-content-center align-items-center align-items-sm-start w-100" id="menu">
              <li className="nav-item w-100">
                <Link to="/home" className="nav-link px-sm-0 px-3 text-light">
                  <i className="fs-5 bi-house"></i><span className="ms-1 d-none d-sm-inline"> Home</span>
                </Link>
              </li>
              <li className="nav-item w-100">
                <Link to="/relatorio" className="nav-link px-sm-0 px-2 text-light">
                  <i className="bi bi-file-earmark-bar-graph"></i><span className="ms-1 d-none d-sm-inline"> Relatórios</span>
                </Link>
              </li>
              <li className='nav-item w-100'>
                <Link to="/agenda" className="nav-link px-sm-0 px-2 text-light">
                  <i className="bi bi-calendar4-week"></i><span className="ms-1 d-none d-sm-inline"> Agenda</span>
                </Link>
              </li>
              <li className='nav-item w-100'>
                <Link to="/servicos" className="nav-link px-sm-0 px-2 text-light">
                  <i className="bi bi-tags"></i><span className="ms-1 d-none d-sm-inline"> Serviços</span>
                </Link>
              </li>
              <li className='nav-item w-100'>
                <Link to="/funcionarios" className="nav-link px-sm-0 px-2 text-light w-100">
                  <i className="bi bi-people"></i><span className="ms-1 d-none d-sm-inline"> Funcionarios</span>
                </Link>
              </li>
            </ul>
            <div className="dropdown py-sm-4 mt-sm-auto ms-auto ms-sm-0 flex-shrink-1">
              <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="https://github.com/mdo.png" alt="hugenerd" width="28" height="28" className="rounded-circle" />
                <span className="d-none d-sm-inline mx-1">{usuario?.nome || 'Usuário'}</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                <li><a className="dropdown-item" href="#" onClick={handleOpenPerfilModal}>Perfil</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#" onClick={handleLogout}>Sair</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Perfil */}
      {usuario && (
        <PerfilModal
          isOpen={isPerfilModalOpen}
          onClose={handleClosePerfilModal}
          usuario={usuario}
        />
      )}
    </div>
  );
};

export default Sidebar;