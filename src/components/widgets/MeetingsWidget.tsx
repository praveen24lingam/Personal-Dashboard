import { useState, useMemo } from 'react';
import { Video, Plus, Trash2 } from 'lucide-react';
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

const MeetingsWidget = () => {
  const { meetings, addMeeting, deleteMeeting, googleEvents, googleConnected } = useDashboardContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [platform, setPlatform] = useState('Zoom');

  const todayGoogleMeetings = useMemo(() => {
    if (!googleConnected) return [];
    const t = new Date();
    const todayKey = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
    return googleEvents
      .filter(ev => !ev.allDay && ev.hangoutLink && getGoogleEventDateKey(ev) === todayKey)
      .sort((a, b) => a.start.localeCompare(b.start));
  }, [googleEvents, googleConnected]);

  const handleAdd = () => {
    if (title.trim() && time.trim()) {
      addMeeting(title.trim(), time.trim(), platform, 'Today');
      setTitle('');
      setTime('');
      setPlatform('Zoom');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="card h-full flex flex-col">
      <div className="card-title flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <Video size={16} className="text-info" />
          <span>MEETINGS</span>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="text-muted hover:text-info transition-colors">
          <Plus size={16} />
        </button>
      </div>
      
      <div className="flex flex-col gap-3 mt-4 flex-1 overflow-y-auto" style={{ maxHeight: '200px' }}>
        {meetings.length === 0 && todayGoogleMeetings.length === 0 ? (
          <p className="text-sm text-muted">No meetings today.</p>
        ) : (
          <>
            {meetings.map((meeting) => (
              <div key={meeting.id} className="meeting-item group">
                <div className="meeting-time">
                  <span>{meeting.time}</span>
                </div>
                <div className="meeting-details flex-1">
                  <span className="meeting-title">{meeting.title}</span>
                  <span className="meeting-platform">{meeting.platform}</span>
                </div>
                <button onClick={() => deleteMeeting(meeting.id)} className="opacity-0 group-hover:opacity-100 text-danger transition-opacity p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {todayGoogleMeetings.map((ev) => (
              <div key={`g-${ev.id}`} className="meeting-item">
                <div className="meeting-time">
                  <span>{formatLocalTime(ev.start)}</span>
                </div>
                <div className="meeting-details flex-1">
                  <span className="meeting-title">{ev.summary}</span>
                  <span className="meeting-platform">Google Meet</span>
                </div>
                <a href={ev.hangoutLink} target="_blank" rel="noreferrer" className="google-badge">Google</a>
              </div>
            ))}
          </>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Meeting">
        <input type="text" className="modal-input" placeholder="Meeting title..." value={title} onChange={e => setTitle(e.target.value)} autoFocus />
        <input type="text" className="modal-input mt-2" placeholder="Time (e.g. 10:00 AM)..." value={time} onChange={e => setTime(e.target.value)} />
        <select className="modal-input mt-2" value={platform} onChange={e => setPlatform(e.target.value)}>
          <option value="Zoom">Zoom</option>
          <option value="Google Meet">Google Meet</option>
          <option value="Teams">Teams</option>
        </select>
        <button className="btn btn-primary mt-2" onClick={handleAdd}>Save Meeting</button>
      </Modal>
    </div>
  );
};

export default MeetingsWidget;
