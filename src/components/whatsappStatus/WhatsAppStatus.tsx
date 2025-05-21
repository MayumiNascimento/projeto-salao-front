import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Atualize para a URL correta

function WhatsAppStatus() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    socket.on('whatsappStatus', (newStatus: string) => {
      setStatus(newStatus);

      if (newStatus === 'connected') {
         setQrCode(null); // Remove o QR Code quando conectado
        setVisible(true); // Mostra painel para a mensagem "Conectado"
      } else if (newStatus === 'disconnected' || newStatus === 'timeout') {
        setVisible(true); // Exibe se desconectado ou aguardando
      }
    });

    socket.on('qrCode', (base64Qr: string) => {
      setQrCode(base64Qr);
      setVisible(true);
    });

    socket.on('connect_error', () => {
      setStatus('Erro de conexão');
      setVisible(true);
    });

    return () => {
      socket.off('whatsappStatus');
      socket.off('qrCode');
      socket.off('connect_error');
    };
  }, []);

  if (!visible) {
    return null; 
  }

  return (
     <div className="d-flex flex-column align-items-center">
      {status === 'CONNECTED' || 'connected' ? (
        <div className="text-success">
          <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>WhatsApp conectado com sucesso!</p>
        </div>
      ) : qrCode ? (
        <img
          src={qrCode}
          alt="QR Code do WhatsApp"
          style={{ width: '200px', height: 'auto', borderRadius: '6px' }}
        />
      ) : (
        <div className="d-flex flex-column align-items-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="text-muted mb-0">Aguardando QR Code do WhatsApp...</p>
        </div>
      )}

    </div>
  );
}

export default WhatsAppStatus;
