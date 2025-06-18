import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL, {
  transports: ["websocket"],
   reconnection: true,
  reconnectionAttempts: 10,
  timeout: 60000,
  withCredentials: true
});

function WhatsAppStatus() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    socket.on('whatsappStatus', (newStatus: string) => {
      setStatus(newStatus);

      if (newStatus.toLowerCase() === 'connected') {
         setQrCode(null); // Remove o QR Code quando conectado
         setVisible(true); // Mostra painel para a mensagem "Conectado"
      } else if (newStatus.toLowerCase() === 'disconnected' || newStatus.toLowerCase() === 'timeout') {
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
console.log(status)
  return (
  <div className="d-flex flex-column align-items-center">
    {status.toLowerCase() === 'connected' ? (
      <div className="text-success">
        <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
          ✅ WhatsApp conectado com sucesso!
        </p>
      </div>
    ) : 
      qrCode ? (
        <img
          src={qrCode}
          alt="QR Code do WhatsApp"
          style={{ width: '200px', height: 'auto', borderRadius: '6px' }}
        />
      ) : null }
  </div>
  );
}

export default WhatsAppStatus;
