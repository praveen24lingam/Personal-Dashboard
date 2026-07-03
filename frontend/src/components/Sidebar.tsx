import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, CalendarDays, BarChart2, Grid, FileText, Plus, Edit3, Flame, CheckCircle2, Target, Calendar } from 'lucide-react';
import { useDashboardContext } from '../context/DashboardContext';
import { Modal } from './Modal';
import './Sidebar.css';

const Sidebar = () => {
  const { user, addTask, addNote, addMeeting } = useDashboardContext();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  
  const [inputValue, setInputValue] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingPlatform, setMeetingPlatform] = useState('Zoom');

  const handleAddTask = () => {
    if (inputValue.trim()) {
      addTask(inputValue.trim());
      setInputValue('');
      setIsTaskModalOpen(false);
    }
  };

  const handleAddNote = () => {
    if (inputValue.trim()) {
      addNote(inputValue.trim());
      setInputValue('');
      setIsNoteModalOpen(false);
    }
  };

  const handleAddMeeting = () => {
    if (inputValue.trim() && meetingTime.trim()) {
      addMeeting(inputValue.trim(), meetingTime.trim(), meetingPlatform, 'Today');
      setInputValue('');
      setMeetingTime('');
      setIsMeetingModalOpen(false);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">✨</div>
          <span className="logo-text">My <strong>Dashboard</strong></span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard className="nav-icon" size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <CheckSquare className="nav-icon" size={20} />
            <span>Tasks</span>
          </NavLink>
          <NavLink to="/calendar" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <CalendarDays className="nav-icon" size={20} />
            <span>Calendar</span>
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <BarChart2 className="nav-icon" size={20} />
            <span>Analytics</span>
          </NavLink>
          <NavLink to="/matrix" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Grid className="nav-icon" size={20} />
            <span>Priority Matrix</span>
          </NavLink>
          <NavLink to="/templates" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FileText className="nav-icon" size={20} />
            <span>Templates</span>
          </NavLink>
        </ul>
      </nav>

      <div className="sidebar-section">
        <h4 className="section-title">QUICK ACTIONS</h4>
        <div className="quick-actions">
          <button className="btn btn-primary" onClick={() => { setInputValue(''); setIsTaskModalOpen(true); }}>
            <Plus size={18} /> New Task
          </button>
          <button className="btn btn-outline" onClick={() => { setInputValue(''); setMeetingTime(''); setIsMeetingModalOpen(true); }}>
            <Calendar size={18} /> New Meeting
          </button>
          <button className="btn btn-outline" onClick={() => { setInputValue(''); setIsNoteModalOpen(true); }}>
            <Edit3 size={18} /> New Note
          </button>
        </div>
      </div>

      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Create New Task">
        <input type="text" className="modal-input" placeholder="Task description..." value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddTask()} autoFocus />
        <button className="btn btn-primary mt-2" onClick={handleAddTask}>Save Task</button>
      </Modal>

      <Modal isOpen={isNoteModalOpen} onClose={() => setIsNoteModalOpen(false)} title="Create New Note">
        <input type="text" className="modal-input" placeholder="Note content..." value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddNote()} autoFocus />
        <button className="btn btn-primary mt-2" onClick={handleAddNote}>Save Note</button>
      </Modal>

      <Modal isOpen={isMeetingModalOpen} onClose={() => setIsMeetingModalOpen(false)} title="Schedule New Meeting">
        <input type="text" className="modal-input" placeholder="Meeting title..." value={inputValue} onChange={e => setInputValue(e.target.value)} autoFocus />
        <input type="text" className="modal-input mt-2" placeholder="Time (e.g. 10:00 AM)..." value={meetingTime} onChange={e => setMeetingTime(e.target.value)} />
        <select className="modal-input mt-2" value={meetingPlatform} onChange={e => setMeetingPlatform(e.target.value)}>
          <option value="Zoom">Zoom</option>
          <option value="Google Meet">Google Meet</option>
          <option value="Teams">Teams</option>
        </select>
        <button className="btn btn-primary mt-2" onClick={handleAddMeeting}>Save Meeting</button>
      </Modal>

      <div className="sidebar-section">
        <h4 className="section-title">STREAKS <Flame size={16} className="text-warning" /></h4>
        <div className="streaks-list">
          <div className="streak-item">
            <div className="streak-icon-wrapper success">
              <CheckCircle2 size={16} />
            </div>
            <div className="streak-info">
              <span className="streak-name">Daily Planning</span>
              <span className="streak-days success-text">{user?.streakDaily || 0} Days</span>
            </div>
          </div>
          <div className="streak-item">
            <div className="streak-icon-wrapper primary">
              <Target size={16} />
            </div>
            <div className="streak-info">
              <span className="streak-name">Focus Task</span>
              <span className="streak-days primary-text">{user?.streakFocus || 0} Days</span>
            </div>
          </div>
          <div className="streak-item">
            <div className="streak-icon-wrapper info">
              <Calendar size={16} />
            </div>
            <div className="streak-info">
              <span className="streak-name">Reflection</span>
              <span className="streak-days info-text">{user?.streakReflection || 0} Days</span>
            </div>
          </div>
        </div>
      </div>

      <div className="quote-card">
        <div className="quote-mark">“</div>
        <p className="quote-text">{user?.quote || 'Discipline today leads to freedom tomorrow.'}</p>
        <div className="quote-bg-illustration"></div>
      </div>
    </aside>
  );
};

export default Sidebar;
