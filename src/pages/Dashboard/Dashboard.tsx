import React, { useEffect, useState } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

import api from "../../services/api";

import { Agendamento } from "../../types/Agendamento";

import WhatsAppStatus from "../../components/whatsappStatus/WhatsAppStatus";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";


const Dashboard = () => {
  const [dados, setDados] = useState({
    totalAgendamentos: 0,
    totalFuncionarios: 0,
    receitaTotal: 0,
  });
  const [dadosMensais, setDadosMensais] = useState([]);

  const [agendamentosDoDia, setAgendamentosDoDia] = useState<Agendamento[]>([]);

  useEffect(() => {
    fetchDash();
    fetchAgendamentosDoDia();
    fetchDesempenhoMensal();
  }, []);

  const fetchDash = async () => {
    try {
      const response = await api.get('/api/dashboard');
      setDados(response.data.dados);
    } catch (error) {
      console.error('Erro ao buscar informações:', error);
    }
  };

  const fetchAgendamentosDoDia = async () => {
    try {
      const response = await api.get('/api/agendamentos');
      const hoje = new Date().toISOString().split("T")[0];
      const filtrados = response.data.filter(
        (ag: Agendamento) => ag.dia === hoje
      );
      setAgendamentosDoDia(filtrados);
    } catch (error) {
      console.error('Erro ao buscar agendamentos do dia:', error);
    }
  };

  const fetchDesempenhoMensal = async () => {
    try {
      const response = await api.get('/api/dashboard/desempenho-mensal'); // você define essa rota
      setDadosMensais(response.data);
    } catch (error) {
      console.error("Erro ao buscar desempenho mensal:", error);
    }
  };
  

  const eventosCalendario = agendamentosDoDia
    .filter((ag) => ag.dia && ag.hora)
    .map((ag) => {
      const dataHora = `${ag.dia}T${ag.hora}`;
      const tituloServico = ag.Servicos?.map((s) => s.nome).join(", ") || "Serviço";
      const funcionario = ag.Funcionario?.nome || "Funcionário";

      return {
        id: ag.id?.toString(),
        title: `${tituloServico} - ${funcionario}`,
        start: dataHora,
      };
    });

  return (
      <div className="container-fluid px-3 py-3">
        {/* Cartões de métricas */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-start border-primary border-4">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Total de Agendamentos</h6>
                  <h3 className="text-primary fw-bold">{dados.totalAgendamentos}</h3>
                </div>
                <i className="bi bi-calendar2-check text-primary fs-2"></i>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-start border-info border-4">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Funcionários</h6>
                  <h3 className="text-info fw-bold">{dados.totalFuncionarios}</h3>
                </div>
                <i className="bi bi-people text-info fs-2"></i>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-start border-success border-4">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Receita Total</h6>
                  <h3 className="text-success fw-bold">R$ {(dados?.receitaTotal ?? 0).toFixed(2)}</h3>
                </div>
                <i className="bi bi-cash-coin text-success fs-2"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Calendário - Agendamentos do Dia */}
          <div className="col-12 col-lg-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title mb-3">Agendamentos de Hoje</h5>
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin]}
                  initialView="timeGridDay"
                  initialDate={new Date()}
                  events={eventosCalendario}
                  headerToolbar={false} 
                  locale="pt-br"
                  height={650}
                />
              </div>
            </div>
          </div>

          {/* Gráfico de Desempenho + WhatsApp */}
          <div className="col-12 col-lg-6 d-flex flex-column gap-4">
            {/* Gráfico */}
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4">Desempenho Mensal</h5>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={dadosMensais}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="agendamentos" fill="#0d6efd" name="Atendimentos" />
                    <Bar dataKey="receita" fill="#ffc107" name="Receita (R$)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Card de Conexão com WhatsApp
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title mb-3">Conexão com o WhatsApp</h5>
                <WhatsAppStatus />
              </div>
            </div> */}
          </div>
        </div>
      </div>
  );
};

export default Dashboard;