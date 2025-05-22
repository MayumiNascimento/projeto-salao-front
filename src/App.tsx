import React, { JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router'
import './App.css';
import Sidebar from './components/Sidebar/sidebar';
import Servicos from './pages/Servicos/servicos';
import Login from './pages/Login/Login';
import Funcionarios from './pages/Funcionarios/Funcionarios';
import Relatorio from './pages/Relatorio/relatorio';
import Agenda from './pages/Agenda/Agenda';
import Dashboard from './pages/Dashboard/Dashboard';
import AgendaFuncionario from './pages/AgendaFuncionario/AgendaFuncionario';
import Comissao from './pages/Comissao/Comissao';

  // Função auxiliar para pegar o tipo do usuário logado
    const getTipo = () => {
      const funcionario = localStorage.getItem('funcionario');
      if (!funcionario) return null;
      try {
        return JSON.parse(funcionario).tipo;
      } catch {
        return null;
      }
    };

    //Rotas protegidas
    const AdminRoute = ({ children }: { children: JSX.Element }) => {
      const token = localStorage.getItem('token');
      const tipo = getTipo();
      return token && tipo === 'admin' ? children : <Navigate to="/login" />;
    };
    
    const FuncRoute = ({ children }: { children: JSX.Element }) => {
      const token = localStorage.getItem('token');
      const tipo = getTipo();
      return token && tipo === 'funcionario' ? children : <Navigate to="/login" />;
    };


function App() {
  
  const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="d-flex flex-column flex-md-row min-vh-100">
      <main className="flex-grow bg-light">
        <Sidebar />
      </main>
      <div className="flex-grow-1 p-3 overflow-auto">{children}</div>
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* Rota de login */}
        <Route path="/login" element={<Login />} />

        {/* Redirecionamento padrão */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* ROTAS PARA ADMINISTRADOR */}
        <Route
          path="/home"
          element={
            <AdminRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </AdminRoute>
          }
        />
        <Route
          path="/servicos"
          element={
            <AdminRoute>
              <Layout>
                <Servicos />
              </Layout>
            </AdminRoute>
          }
        />
        <Route
          path="/agenda"
          element={
            <AdminRoute>
              <Layout>
                <Agenda />
              </Layout>
            </AdminRoute>
          }
        />
        <Route
          path="/funcionarios"
          element={
            <AdminRoute>
              <Layout>
                <Funcionarios />
              </Layout>
            </AdminRoute>
          }
        />
        <Route
          path="/relatorio"
          element={
            <AdminRoute>
              <Layout>
                <Relatorio />
              </Layout>
            </AdminRoute>
          }
        />

        {/* ROTAS PARA FUNCIONÁRIO */}
        <Route
          path="/AgendaFuncionario"
          element={
            <FuncRoute>
              <Layout>
                <AgendaFuncionario />
              </Layout>
            </FuncRoute>
          }
        />
        <Route
          path="/comissoes"
          element={
            <FuncRoute>
              <Layout>
                <Comissao />
              </Layout>
            </FuncRoute>
          }
        />
      </Routes>
    </Router>
  );

}

export default App
