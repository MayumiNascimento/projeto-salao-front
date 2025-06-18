import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import PerfilModal from '../modalPerfil/modalPerfil';
import Funcionario from '../../types/Funcionario';

function Sidebar() {
  const tipo = localStorage.getItem('tipo'); // 'admin' ou 'funcionario'
  const [usuario, setUsuario] = useState<Funcionario | null>(null);
  const [isPerfilModalOpen, setIsPerfilModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const funcionarioSalvo = localStorage.getItem('funcionario');
    if (funcionarioSalvo) {
      setUsuario(JSON.parse(funcionarioSalvo));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleOpenPerfilModal = () => setIsPerfilModalOpen(true);
  const handleClosePerfilModal = () => setIsPerfilModalOpen(false);

  return (
    <div className="w-100 w-md-auto sidebar">
      <div className=" sidebar d-flex flex-row flex-md-column align-items-center align-items-md-start background-custom text-white py-2 px-2 px-md-3">
        
        <Link to="/" className="d-flex align-items-center text-white text-decoration-none mb-0 mb-md-3 me-3 me-md-0">
          <i className="bi bi-scissors fs-5 d-md-none me-1"></i>
          <span className="fs-5 d-none d-md-inline">BeleSys</span>
        </Link>

        <ul className="nav nav-pills flex-row flex-md-column justify-content-center w-100">

          {tipo === 'admin' && (
            <>
              <li className="nav-item">
                <Link to="/relatorio" className="nav-link text-light px-2">
                  <i className="bi bi-file-earmark-bar-graph fs-5"></i>
                  <span className="d-none d-md-inline ms-1">Relatórios</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/agenda" className="nav-link text-light px-2">
                  <i className="bi bi-calendar4-week fs-5"></i>
                  <span className="d-none d-md-inline ms-1">Agenda</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/servicos" className="nav-link text-light px-2">
                  <i className="bi bi-tags fs-5"></i>
                  <span className="d-none d-md-inline ms-1">Serviços</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/funcionarios" className="nav-link text-light px-2">
                  <i className="bi bi-people fs-5"></i>
                  <span className="d-none d-md-inline ms-1">Funcionários</span>
                </Link>
              </li>
            </>
          )}

          {tipo === 'funcionario' && (
            <>
              <li className="nav-item">
                <Link to="/agendaFuncionario" className="nav-link text-light px-2">
                  <i className="bi bi-calendar4-week fs-5"></i>
                  <span className="d-none d-md-inline ms-1">Minha agenda</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/comissoes" className="nav-link text-light px-2">
                  <i className="bi bi-cash-coin"></i>
                  <span className="d-none d-md-inline ms-1">Minhas comissões</span>
                </Link>
              </li>

            </>
          )}
        </ul>

        <div className="ms-auto ms-md-0 mt-0 mt-md-auto dropdown">
          <button
            className="d-flex align-items-center text-white text-decoration-none dropdown-toggle bg-transparent border-0"
            id="dropdownUser1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="bi bi-person fs-5"></i>
            <span className="d-none d-md-inline ms-2" style={{fontSize: 20}}>{usuario?.nome || 'Usuário'}</span>
          </button>
          <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
            <li>
              <button className="dropdown-item" onClick={handleOpenPerfilModal}>Meu perfil</button>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button className="dropdown-item" onClick={handleLogout}>Sair</button>
            </li>
          </ul>
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
}

export default Sidebar;