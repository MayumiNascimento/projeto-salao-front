import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [mostrarCredenciais, setMostrarCredenciais] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Faz a requisição POST para a rota de login
      const response = await api.post('auth/login', { email, senha });

      // Verifica se a resposta foi bem-sucedida
      if (response.status !== 200) {
        throw new Error('Credenciais inválidas, tente novamente');
      }

      // Extrai os dados da resposta
      const data = response.data;
      const token = data.token;
      const funcionario = data.funcionario;

      // Salva o token no localStorage
      localStorage.setItem('token', token);

      // Salva os dados do funcionário no localStorage
      localStorage.setItem('funcionario', JSON.stringify(funcionario));

      // Salva os dados do funcionário no localStorage
      localStorage.setItem('funcionario', JSON.stringify(funcionario));

      // Salva o tipo do usuário ('admin' ou 'funcionario')
      localStorage.setItem('tipo', funcionario.tipo);

      // Redireciona para a rota de acordo com o role
      if (funcionario.tipo === 'admin') {
        navigate('/agenda');
      } 
        else if (funcionario.tipo === 'funcionario') {
        navigate('/agendaFuncionario');

      } else {
        throw new Error('usuário inválido');
      }
      
    } catch (err) {
      setError('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 background-custom" style={{ minHeight: '100vh' }}>
      <div
        className="card shadow-lg p-4 border-0"
        style={{
          width: '350px',
          borderRadius: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.15)', // branco com transparência para contraste suave
          backdropFilter: 'blur(10px)', // efeito de blur 
          color: '#fff',
        }}
      >
        <h2 className="text-center mb-4" style={{ fontWeight: '700' }}>Bem-vindo</h2>
        {error && (
          <div className="alert alert-danger" style={{ backgroundColor: 'rgba(255, 69, 58, 0.85)', color: '#fff' }}>
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label" style={{ color: '#ddd' }}>Usuário</label>
            <input
              type="text"
              className="form-control rounded-pill"
              id="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff' }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label" style={{ color: '#ddd' }}>Senha</label>
            <input
              type="password"
              className="form-control rounded-pill"
              id="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff' }}
            />
          </div>
          <button type="submit" className="btn btn-light w-100 rounded-pill fw-semibold" style={{ color: '#4a148c' }}>
            Entrar
          </button>
        </form>

                <div className="text-center mt-3">
          <button
            className="btn btn-sm text-light"
            style={{ fontSize: '0.9rem', textDecoration: 'underline' }}
            onClick={() => setMostrarCredenciais(!mostrarCredenciais)}
            type="button"
          >
            {mostrarCredenciais ? 'Ocultar credenciais de teste' : 'Mostrar credenciais de teste'}
          </button>

          {mostrarCredenciais && (
            <div className="mt-2 text-start text-light small border rounded p-2" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <p className="mb-1"><strong>Admin:</strong></p>
              <p className="mb-1">Email: <code>admin@gmail.com</code></p>
              <p className="mb-3">Senha: <code>123456</code></p>
            </div>
          )}
        </div>
      </div>
    </div>

  );
};

export default Login;