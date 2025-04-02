import React, { useState, useEffect } from 'react';

import BotaoFlutuante from '../../components/botaoFlutuante/botaoFlutuante';

import  Calendar  from '../../components/calendar/Calendar';
import AddAgendamentoModal from '../../components/modalAgenda/AddAgendamentoModal';
import ViewAgendamentoModal from '../../components/modalAgenda/ViewAgendamentoModal';
import api from '../../services/api';
import { Agendamento } from '../../types/Agendamento';
import Swal from 'sweetalert2';

function Agenda() {

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [agendamento, setAgendamento] = useState<any[]>([])

  const fetchEvents = async () => {
    try {
      const response = await api.get<Agendamento[]>('api/agendamentos');
      const formattedEvents = response.data.map((event) => ({
        id: event.id,
        title: event.cliente_nome,
        start: `${event.dia}T${event.hora}`,
        extendedProps: {
          cliente_telefone: event.cliente_telefone,

          funcionario_id: event.funcionario_id,
          status: event.status,
          observacoes: event.observacoes,
          desconto: event.desconto,
          total: event.total
        },
      }));
      setAgendamento(formattedEvents);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };

  // Carrega os eventos ao montar o componente
  useEffect(() => {
    fetchEvents();
  }, []);

  // Abre o modal de detalhes do evento
  const handleEventClick = async (info: any) => {
    const eventId = info.event.id;
     
    try{
      const response = await api.get(`api/agendamentos/${eventId}`);
      setSelectedEvent(response.data);
      setShowViewModal(true);
    } catch(error){
      Swal.fire('Erro', 'Não foi possível carregar os detalhes do agendamento', 'error');
    }
    
  };

  const handleCreate  = async (eventData: any) => {
    try {
      await api.post('api/agendamentos', eventData);
      alert('Agendamento criado com sucesso!');
      fetchEvents(); // Atualiza o calendário
      setShowModal(false); // Fecha o modal
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      alert('Erro ao criar agendamento. Tente novamente.');
    }
  };

  // Atualiza o status de um agendamento
  const handleUpdateEventStatus = async (id: number, status: string) => {
    try {
      await api.put(`api/agendamentos/${id}`, { status });
      alert('Status atualizado com sucesso!');
      fetchEvents(); // Atualiza o calendário
      setShowViewModal(false); // Fecha o modal
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status. Tente novamente.');
    }
  };

  const handleUpdateEvent = async (agendamentoData: Agendamento) => {
    try {
      await api.put(`api/agendamentos/${agendamentoData.id}`, agendamentoData);
      Swal.fire('Sucesso!', 'Agendamento atualizado com sucesso', 'success');
      fetchEvents(); // Atualiza o calendário
      setShowViewModal(false); // Fecha o modal de visualização
    } catch (error) {
      console.error('Erro ao editar agendamento:', error);
      Swal.fire('Erro!', 'Não foi possível atualizar o agendamento', 'error');
    }
  };

  //abre modal de criar
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setShowModal(true);
  };

    // Função para abrir o modal de edição
    const handleEditClick = (agendamento: Agendamento) => {
      setSelectedEvent(agendamento);
      setShowViewModal(false); // Fecha o modal de visualização
      setShowEditModal(true); // Abre o modal de edição
    };

return (
  <div className="container-fluid">
      <div className="row">
        <main role="main" className="col d-flex flex-column h-sm-100">
          <Calendar onEventClick={handleEventClick} onDateClick={handleDateClick} />

          <BotaoFlutuante onClick={() => setShowModal(true)} />
            
        </main>
      </div>

      <AddAgendamentoModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreate}
        selectedDate={selectedDate}
        onUpdate={selectedEvent}
      />

    {selectedEvent && (
      <ViewAgendamentoModal
        show={showViewModal}
        onClose={() => setShowViewModal(false)}
        agendamento={selectedEvent}
        onUpdateStatus={(id: number, status: string) => handleUpdateEventStatus(id, status)}
        onUpdate={handleEditClick}
      />
    )}
    </div>
  )
}

export default Agenda;

