import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from '../../services/api';
import { Agendamento } from '../../types/Agendamento';

interface CalendarProps {
    onEventClick: (event: any) => void;
    onDateClick: (date: string) => void;
}

function Calendar({ onEventClick, onDateClick }: CalendarProps) {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

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
        },
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      locale={'pt-br'}
      events={events}
      eventClick={onEventClick}
      dateClick={(info) => onDateClick(info.dateStr)}
      themeSystem="bootstrap5"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      }}
      buttonText={{
        today: 'Hoje',
        month: 'Mês',
        week: 'Semana',
        day: 'Dia'
      }}
    />
  );
};

export default Calendar;