import { useState, useMemo } from 'react';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { useDashboardContext } from '../../context/DashboardContext';
import type { GoogleEvent } from '../../context/DashboardContext';
import { Modal } from '../Modal';
import './Widgets.css';

const getGoogleEventDateKey = (event: GoogleEvent): string => {
  if (event.allDay) return event.start.slice(0, 10);
  const d = new Date(event.start);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const formatLocalTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

const AgendaWidget = () => {
  const { agenda, addAgendaItem, deleteAgendaItem, googleEvents, googleConnected } = useDashboardContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [time, setTime] = useState('');
  const [task, setTask] = useState('');

  const todayGoogleEvents = useMemo(() => {
    if (!googleConnected) return [];
    const t = new Date();
    const todayKey = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
    return googleEvents
      .filter(ev => getGoogleEventDateKey(ev) === todayKey)
      .sort((a, b) => a.start.localeCompare(b.start));
  }, [googleEvents, googleConnected]);

  const handleAdd = () => {
    if (time.trim() && task.trim()) {
      addAgendaItem(time.trim(), task.trim(), 'Today');
      setTime('');
      setTask('');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="card h-full flex flex-col">
      <div className="card-title flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-primary" />
          <span>TODAY'S AGENDA</span>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="text-muted hover:text-primary transition-colors">
          <Plus size={16} />
        </button>
      </div>
      
      <div className="timeline mt-4 flex-1 overflow-y-auto pr-2" style={{ maxHeight: '200px' }}>
        {agenda.length === 0 && todayGoogleEvents.length === 0 ? (
          <p className="text-sm text-muted">No agenda items for today.</p>
        ) : (
          <>
            {agenda.map((item) => (
              <div key={item.id} className="timeline-item flex items-center justify-between group">
                <div className="flex items-center">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content flex flex-col justify-center w-20 shrink-0">
                    <span className="timeline-time">{item.time}</span>
                  </div>
                  <div className="timeline-content flex flex-col justify-center ml-2">
                    <span className="timeline-desc font-medium text-main line-clamp-1">{item.task}</span>
                  </div>
                </div>
                <button onClick={() => deleteAgendaItem(item.id)} className="opacity-0 group-hover:opacity-100 text-danger transition-opacity p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {todayGoogleEvents.map((ev) => (
              <div key={`g-${ev.id}`} className="timeline-item flex items-center justify-between">
                <div className="flex items-center">
                  <div className="timeline-dot google-dot"></div>
                  <div className="timeline-content flex flex-col justify-center w-20 shrink-0">
                    <span className="timeline-time">{ev.allDay ? 'All day' : formatLocalTime(ev.start)}</span>
                  </div>
                  <div className="timeline-content flex flex-col justify-center ml-2">
                    <span className="timeline-desc font-medium text-main line-clamp-1">{ev.summary}</span>
                  </div>
                </div>
                <span className="google-badge">Google</span>
              </div>
            ))}
          </>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Agenda Item">
        <input type="text" className="modal-input" placeholder="Time (e.g. 09:00 AM)..." value={time} onChange={e => setTime(e.target.value)} autoFocus />
        <input type="text" className="modal-input mt-2" placeholder="Task description..." value={task} onChange={e => setTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} />
        <button className="btn btn-primary mt-2" onClick={handleAdd}>Save Item</button>
      </Modal>
    </div>
  );
};

export default AgendaWidget;
