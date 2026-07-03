import { Bell, Clock, Target, Search } from 'lucide-react';
import { useDashboardContext } from '../context/DashboardContext';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const { user } = useDashboardContext();
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="greeting">{getGreeting()}, {user ? user.name : 'Guest'}! 👋</h1>
        <p className="date text-muted">{getFormattedDate()}</p>
      </div>
      
      <div className="header-right">
        <div className="search-bar">
          <Search size={16} className="text-muted" />
          <input type="text" placeholder="Search tasks, docs..." />
        </div>
        
        <div className="header-actions">
          <button className="icon-btn" onClick={() => navigate('/calendar')} title="Go to Calendar">
            <Clock size={20} />
          </button>
          <button className="icon-btn" onClick={() => navigate('/matrix')} title="Priority Matrix">
            <Target size={20} />
          </button>
          
          <div className="user-profile" title={`Logged in as ${user?.name || 'Guest'}`}>
            <div className="avatar">{user ? user.name.charAt(0) : 'G'}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
