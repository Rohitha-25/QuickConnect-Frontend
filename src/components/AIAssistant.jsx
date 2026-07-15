import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';

export default function AIAssistant({ onClose, services }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi! Tell me what's required repairing at home or what you need help with — I'll QuickConnect the right service for you ⚙️" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // ✅ Now calls our own backend, not Anthropic directly.
      // The backend holds the API key and grounds the AI in the real
      // services list from the database, so it can never recommend
      // something that doesn't actually exist.
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const res = await axios.post('/ai/chat', { message: userMsg, history });

      const { reply, recommendedService } = res.data;
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);

      if (recommendedService) {
        const recLower = recommendedService.toLowerCase();
        const matched = services?.find(s =>
          s.serviceName?.toLowerCase().includes(recLower) ||
          recLower.includes(s.serviceName?.toLowerCase())
        );

        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'ai',
            text: `✅ I recommend: ${recommendedService}`,
            action: matched ? { label: `Book ${matched.serviceName}`, serviceId: matched.id } : null
          }]);
        }, 400);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I ran into an issue. Please try again!" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (serviceId) => {
    localStorage.setItem('preselectedServiceId', serviceId);
    onClose();
    navigate('/components/booking');
  };

  return (
    <div className="qc-modal-overlay" onClick={onClose}>
      <div className="qc-modal" onClick={e => e.stopPropagation()}>
        <div className="qc-modal-header">
          <h3>✦ QC Assistant</h3>
          <button className="qc-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="qc-chat-messages">
          {messages.map((msg, i) => (
            <div key={i}>
              <div className={`qc-chat-msg ${msg.role}`}>{msg.text}</div>
              {msg.action && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '6px' }}>
                  <button
                    className="btn-primary"
                    style={{ fontSize: '12px', padding: '7px 14px' }}
                    onClick={() => handleBook(msg.action.serviceId)}
                  >
                    {msg.action.label} →
                  </button>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="qc-chat-msg ai" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="qc-spinner" /> Thinking...
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="qc-chat-input-row">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Describe your problem..."
            autoFocus
          />
          <button className="btn-primary" onClick={sendMessage} disabled={loading || !input.trim()}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
