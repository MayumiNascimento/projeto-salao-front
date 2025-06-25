import { useEffect, useState } from 'react';
import api from '../../services/api';

function Comissao() {
  const [comissoes, setComissoes] = useState<any[]>([]);
  const [totalComissao, setTotalComissao] = useState<number>(0);
  const [periodo, setPeriodo] = useState<string>('semana');

  useEffect(() => {
    fetchComissoes();
  }, [periodo]);

  const fetchComissoes = async () => {
    try {
      const response = await api.get(`/api/comissoes?periodo=${periodo}`);
      setComissoes(response.data.comissoes);
      setTotalComissao(response.data.totalComissao);
    } catch (erro) {
      console.error("Erro ao carregar comissões:", erro);
    }
  };

    const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
    timeZone: 'UTC'
    });
  };

  return (
    <div className="container mt-4">
      <h2>💰 Minhas Comissões</h2>
      <div className="mb-3">
        <label className="form-label">Filtrar por período:</label>
        <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} className="form-select w-auto">
          <option value="dia">Hoje</option>
          <option value="semana">Últimos 7 dias</option>
        </select>
      </div>

      <h4>Total: R$ {totalComissao.toFixed(2)}</h4>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Data</th>
            <th>Comissão (R$)</th>
          </tr>
        </thead>
        <tbody>
          {comissoes.map((c) => (
            <tr key={c.id}>
              <td>{formatarData(c.dia)}</td>
              <td>R$ {c.comissao.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Comissao;