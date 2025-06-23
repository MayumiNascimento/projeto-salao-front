import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import ReactDOM from 'react-dom';

const socket = io(process.env.REACT_APP_SOCKET_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
  timeout: 60000,
  withCredentials: true
});

type WhatsAppStatusProps = {
  show: boolean;
  onClose: () => void;
};

function WhatsAppStatus({show, onClose}: WhatsAppStatusProps) {

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
  return ReactDOM.createPortal(
   <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">Status do WhatsApp</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body d-flex flex-column align-items-center">
            {status.toLowerCase() === 'connected' ? (
              <div className="text-success text-center">
                <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                  ✅ WhatsApp conectado com sucesso!
                </p>
              </div>
            ) : qrCode ? (
              <img
                src={qrCode}
                alt="QR Code do WhatsApp"
                style={{ width: '200px', height: 'auto', borderRadius: '6px' }}
              />
            ) : (
              <p>Aguardando conexão...</p>
            )}
          </div>
        </div>
      </div>

    </div>,
    document.body
  );
}

export default WhatsAppStatus;