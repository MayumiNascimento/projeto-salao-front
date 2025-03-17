import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Faz a requisição POST para a rota de login
      const response = await api.post('auth/login', { email, senha });

      // Verifica se a resposta foi bem-sucedida
      if (response.status !== 200) {
        throw new Error('Credenciais inválidas');
      }

      // Extrai os dados da resposta
      const data = response.data;
      const token = data.token;
      const funcionario = data.funcionario;

      // Salva o token no localStorage
      localStorage.setItem('token', token);


      // Salva os dados do funcionário no localStorage
      localStorage.setItem('funcionario', JSON.stringify(funcionario));

      // Redireciona para a página principal
      navigate('/servicos'); // Alterar para a rota desejada após o login
    } catch (err) {
      setError('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: '300px' }}>
        <h2 className="text-center mb-4">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Usuário</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Senha</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;