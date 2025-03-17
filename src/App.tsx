import React, { JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router'
import './App.css';
import Sidebar from './components/Sidebar/sidebar';
import Servicos from './pages/Servicos/servicos';
import Login from './pages/Login/Login';
import Funcionarios from './pages/Funcionarios/Funcionarios';
import Relatorio from './pages/Relatorio/relatorio';

// Componente para proteger rotas
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token'); // Verifica se o token existe
  return token ? children : <Navigate to="/login" />; // Redireciona para o login se não houver token
};

function App() {
  return (
    <Router>
      <Routes>
       {/* Rota pública */}
       <Route path="/" element={<Login />} />

      {/* Rotas protegidas */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div className="d-flex flex-column flex-md-row min-vh-100">
                {/* Sidebar */}
                <div className="col-12 col-md-3 col-xl-2 p-0" style={{ flexShrink: 0 }}>
                  <Sidebar />
                </div>

                {/* Conteúdo principal */}
                <div className="col-12 col-md-9 col-xl-10 p-3 overflow-auto">
                  <Routes>
                    <Route path="/servicos" element={<Servicos />} />
                    <Route path="/funcionarios" element={<Funcionarios />} />
                    <Route path='/relatorio' element={<Relatorio />} />
                  </Routes>
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
