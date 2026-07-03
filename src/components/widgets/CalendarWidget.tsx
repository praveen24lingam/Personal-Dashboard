import { useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDashboardContext } from '../../context/DashboardContext';
import type { GoogleEvent } from '../../context/DashboardContext';
import './Calendar.css';

const getGoogleEventDateKey = (event: GoogleEvent): string => {
  if (event.allDay) return event.start.slice(0, 10);
  const d = new Date(event.start);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const CalendarWidget = () => {
  const { googleConnected, googleEvents, connectGoogleCalendar } = useDashboardContext();

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDate = today.getDate();

  const monthGoogleDays = useMemo(() => {
    const set = new Set<number>();
    if (!googleConnected) return set;
    for (const ev of googleEvents) {
      const [y, m, d] = getGoogleEventDateKey(ev).split('-').map(Number);
      if (y === currentYear && m - 1 === currentMonth) set.add(d);
    }
    return set;
  }, [googleEvents, googleConnected, currentYear, currentMonth]);

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  const calendarCells = [];
  
  // Prev month padding
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarCells.push({ day: prevMonthDays - i, isCurrentMonth: false });
  }
  
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push({ day: i, isCurrentMonth: true });
  }
  
  // Next month padding to complete grid (42 cells max)
  const remainingCells = 42 - calendarCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({ day: i, isCurrentMonth: false });
  }

  const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="card h-full">
      <div className="card-title mb-4">
        <Calendar size={16} className="text-primary" />
        <span>CALENDAR</span>
      </div>
      
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <h4 className="font-bold text-main mb-4">{monthName}</h4>
          
          <div className="calendar-grid">
            {daysOfWeek.map((day, i) => (
              <div key={`header-${i}`} className="calendar-day-header">{day}</div>
            ))}
            
            {calendarCells.map((cell, i) => {
              const isToday = cell.isCurrentMonth && cell.day === currentDate;
              const hasGoogleEvents = cell.isCurrentMonth && monthGoogleDays.has(cell.day);
              return (
                <div
                  key={`day-${i}`}
                  className={`calendar-day ${!cell.isCurrentMonth ? 'muted' : ''} ${isToday ? 'active' : ''}`}
                >
                  {cell.day}
                  {hasGoogleEvents && <span className="calendar-day-dot" />}
                </div>
              );
            })}
          </div>
        </div>

        {!googleConnected && (
          <button className="calendar-connect-hint" onClick={connectGoogleCalendar}>
            <Calendar size={12} /> Connect Google Calendar
          </button>
        )}

        <Link to="/calendar" className="btn btn-outline-primary mt-6 text-center block">
          Open Calendar
        </Link>
      </div>
    </div>
  );
};

export default CalendarWidget;
