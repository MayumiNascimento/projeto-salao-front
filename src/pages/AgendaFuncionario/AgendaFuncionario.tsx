import { useState, useEffect } from 'react';
import api from '../../services/api';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Swal from 'sweetalert2';

function AgendaFuncionario() {

  const [agendamento, setAgendamento] = useState<any[]>([])

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('api/agenda'); 
      const data = response.data.dados; // acesso ao array dentro de "dados"
      const formattedEvents = data.map((event: any) => ({
        id: event.id,
        title: event.cliente_nome,
        start: `${event.dia}T${event.hora}`,
        Servicos: event.Servicos,
        status: event.status,
        extendedProps: {
          status: event.status,
          observacoes: event.observacoes,
          Servicos: event.Servicos
        },
      }));
      setAgendamento(formattedEvents);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };

return (
  <div className="container-fluid">
      <div className="row">
        <main role="main" className="col d-flex flex-column h-sm-100">
          <h1 className="mt-4">Agenda de Atendimentos</h1> <hr className="mb-4" />
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={'pt-br'}
            events={agendamento}
            themeSystem="bootstrap5"
            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,list',
            }}
            buttonText={{
                today: 'Hoje',
                month: 'Mês',
                week: 'Semana',
                day: 'Dia',
                list: 'Lista'
            }}

            eventClick={(info) => {
              const props = info.event.extendedProps;
              const title = info.event.title;

              const listaServico = props.Servicos.map((servico: { nome: any; }) => servico.nome).join(', ')
          
              Swal.fire({
                title: `Agendamento: ${title}`,
                html: `
                  <b> Hora:</b> ${props.hora || 'N/D'}<br/>
                  <b> Serviço:</b> ${listaServico || 'N/D'}<br/>
                  <b> Status:</b> ${props.status || 'N/D'}<br/>
                  <b> Observações:</b> ${props.observacoes || 'Nenhuma'}<br/>
                `,
                icon: 'info',
                confirmButtonText: 'Fechar',
                customClass: {
                popup: 'text-start', 
                },
              });
            }}
            />
        </main>
      </div>

    </div>
  )
}

export default AgendaFuncionario;