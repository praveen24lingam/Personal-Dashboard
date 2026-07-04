import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { Modal } from '../components/Modal';
import { useDashboardContext } from '../context/DashboardContext';
import type { GoogleEvent, GoogleEventInput } from '../context/DashboardContext';
import './CalendarPage.css';

const toDateKey = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const addDaysToDateKey = (dateKey: string, days: number): string => {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(y, m - 1, d + days);
  return toDateKey(dt.getFullYear(), dt.getMonth(), dt.getDate());
};

// event.start for all-day events is already a bare 'YYYY-MM-DD' string - slicing it
// avoids `new Date('YYYY-MM-DD')` parsing as UTC midnight, which rolls back a day
// in any timezone behind UTC once read back with local getters.
const getGoogleEventDateKey = (event: GoogleEvent): string => {
  if (event.allDay) return event.start.slice(0, 10);
  const d = new Date(event.start);
  return toDateKey(d.getFullYear(), d.getMonth(), d.getDate());
};

const timeFormatter = new Intl.DateTimeFormat([], { hour: 'numeric', minute: '2-digit' });
const formatLocalTime = (iso: string) => {
  try {
    return timeFormatter.format(new Date(iso));
  } catch {
    return '';
  }
};

const CalendarPage = () => {
  const {
    tasks, agenda, meetings,
    googleConnected, googleEvents, googleLoading,
    connectGoogleCalendar, disconnectGoogleCalendar,
    createGoogleEvent, updateGoogleEvent, deleteGoogleEvent,
  } = useDashboardContext();

  const [searchParams, setSearchParams] = useSearchParams();
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const status = searchParams.get('google');
    if (status === 'connected') setBanner({ type: 'success', text: 'Google Calendar connected successfully.' });
    else if (status === 'error') setBanner({ type: 'error', text: 'Could not connect Google Calendar. Please try again.' });
    if (status) {
      const next = new URLSearchParams(searchParams);
      next.delete('google');
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 5000);
    return () => clearTimeout(t);
  }, [banner]);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDate = today.getDate();

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  const calendarCells = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    calendarCells.push({ day: prevMonthDays - i, isCurrentMonth: false });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push({ day: i, isCurrentMonth: true });
  }

  const remainingCells = 42 - calendarCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({ day: i, isCurrentMonth: false });
  }

  const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const googleEventsByDate = useMemo(() => {
    const map = new Map<string, GoogleEvent[]>();
    for (const ev of googleEvents) {
      const key = getGoogleEventDateKey(ev);
      const bucket = map.get(key);
      if (bucket) bucket.push(ev); else map.set(key, [ev]);
    }
    return map;
  }, [googleEvents]);

  // For simplicity, local tasks/agenda/meetings items are only shown on today's cell
  // since they don't carry a real date. Google events carry real dates so they're
  // matched to every day in the displayed month.
  const getItemsForDay = (day: number, isCurrentMonth: boolean) => {
    const items: Array<{ type: string; text: string; googleEvent?: GoogleEvent }> = [];
    if (!isCurrentMonth) return items;

    if (day === currentDate) {
      items.push(
        ...tasks.filter(t => !t.checked).map(t => ({ type: 'task', text: t.text })),
        ...agenda.map(a => ({ type: 'agenda', text: `${a.time} - ${a.task}` })),
        ...meetings.map(m => ({ type: 'meeting', text: `${m.time} - ${m.title}` }))
      );
    }

    if (googleConnected) {
      const dateKey = toDateKey(currentYear, currentMonth, day);
      const dayEvents = googleEventsByDate.get(dateKey) ?? [];
      
      // Limit to max 10 events per cell to prevent layout thrashing/freezing
      const displayEvents = dayEvents.slice(0, 10);
      
      items.push(...displayEvents.map(ev => ({
        type: 'google',
        text: ev.allDay ? ev.summary : `${formatLocalTime(ev.start)} ${ev.summary}`,
        googleEvent: ev,
      })));
      
      if (dayEvents.length > 10) {
        items.push({ type: 'google', text: `+${dayEvents.length - 10} more` });
      }
    }

    return items;
  };

  // -- Add/Edit Event Modal --
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<GoogleEvent | null>(null);
  const [formSummary, setFormSummary] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formAllDay, setFormAllDay] = useState(false);
  const [formStartTime, setFormStartTime] = useState('09:00');
  const [formEndTime, setFormEndTime] = useState('10:00');
  const [formLocation, setFormLocation] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formError, setFormError] = useState('');

  const todayKey = toDateKey(currentYear, currentMonth, currentDate);

  const openCreateModal = (dateKey: string = todayKey) => {
    setEditingEvent(null);
    setFormSummary(''); setFormLocation(''); setFormDescription('');
    setFormAllDay(false); setFormDate(dateKey);
    setFormStartTime('09:00'); setFormEndTime('10:00');
    setFormError(''); setIsEventModalOpen(true);
  };

  const openEditModal = (ev: GoogleEvent) => {
    setEditingEvent(ev);
    setFormSummary(ev.summary); setFormLocation(ev.location); setFormDescription(ev.description);
    setFormAllDay(ev.allDay);
    if (ev.allDay) {
      setFormDate(ev.start);
    } else {
      const s = new Date(ev.start);
      const e = new Date(ev.end);
      setFormDate(toDateKey(s.getFullYear(), s.getMonth(), s.getDate()));
      setFormStartTime(`${String(s.getHours()).padStart(2, '0')}:${String(s.getMinutes()).padStart(2, '0')}`);
      setFormEndTime(`${String(e.getHours()).padStart(2, '0')}:${String(e.getMinutes()).padStart(2, '0')}`);
    }
    setFormError(''); setIsEventModalOpen(true);
  };

  const closeEventModal = () => setIsEventModalOpen(false);

  const handleSaveEvent = async () => {
    if (!formSummary.trim() || !formDate) { setFormError('Title and date are required.'); return; }
    if (!formAllDay && formEndTime <= formStartTime) { setFormError('End time must be after start time.'); return; }

    const input: GoogleEventInput = formAllDay
      ? {
          summary: formSummary.trim(), location: formLocation.trim() || undefined,
          description: formDescription.trim() || undefined,
          start: formDate, end: addDaysToDateKey(formDate, 1),
          allDay: true,
        }
      : {
          summary: formSummary.trim(), location: formLocation.trim() || undefined,
          description: formDescription.trim() || undefined,
          start: `${formDate}T${formStartTime}:00`, end: `${formDate}T${formEndTime}:00`,
          allDay: false, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };

    try {
      if (editingEvent) await updateGoogleEvent(editingEvent.id, input);
      else await createGoogleEvent(input);
      closeEventModal();
    } catch {
      setFormError('Failed to save event. Please try again.');
    }
  };

  const handleDeleteEvent = (ev: GoogleEvent) => {
    if (!window.confirm(`Delete "${ev.summary}" from Google Calendar?`)) return;
    deleteGoogleEvent(ev.id);
    if (editingEvent?.id === ev.id) closeEventModal();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="header">
        <div className="header-left">
          <h1 className="greeting">Calendar</h1>
          <p className="date text-muted">Schedule and manage your events.</p>
        </div>
        <div className="header-right flex items-center gap-3">
          <h2 className="text-xl font-bold text-primary">{monthName}</h2>
          {googleConnected ? (
            <div className="google-status-group">
              <span className="google-status-badge connected">Google Calendar connected</span>
              <button className="btn btn-primary" onClick={() => openCreateModal()}>
                <Plus size={14} /> Add Event
              </button>
              <button className="btn btn-outline-primary" onClick={disconnectGoogleCalendar}>Disconnect</button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={connectGoogleCalendar}>Connect Google Calendar</button>
          )}
        </div>
      </div>

      {banner && <div className={`calendar-banner ${banner.type}`}>{banner.text}</div>}

      <div className="card shadow-sm calendar-card flex flex-col">
        <div className="cal-grid-header">
          {daysOfWeek.map((day, i) => (
            <div key={`h-${i}`} className="cal-cell-header">{day}</div>
          ))}
        </div>
        <div className="cal-grid-body">
          {calendarCells.map((cell, i) => {
            const isToday = cell.isCurrentMonth && cell.day === currentDate;
            const items = getItemsForDay(cell.day, cell.isCurrentMonth);

            return (
              <div key={`c-${i}`} className={`cal-cell ${!cell.isCurrentMonth ? 'muted' : ''} ${isToday ? 'active-day' : ''}`}>
                {cell.isCurrentMonth && googleConnected && (
                  <button
                    className="cal-add-event-btn"
                    title="Add event"
                    onClick={() => openCreateModal(toDateKey(currentYear, currentMonth, cell.day))}
                  >
                    <Plus size={12} />
                  </button>
                )}
                <div className="cal-day-number">{cell.day}</div>
                <div className="cal-events">
                  {items.map((item, idx) => (
                    item.type === 'google' && item.googleEvent ? (
                      <div key={`g-${item.googleEvent.id}`} className="cal-event google" onClick={() => openEditModal(item.googleEvent!)}>
                        <span className="cal-event-text">{item.text}</span>
                        <button
                          className="cal-event-delete"
                          onClick={(e) => { e.stopPropagation(); handleDeleteEvent(item.googleEvent!); }}
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ) : (
                      <div key={idx} className={`cal-event ${item.type}`}>{item.text}</div>
                    )
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal isOpen={isEventModalOpen} onClose={closeEventModal} title={editingEvent ? 'Edit Event' : 'Add Event'}>
        <input
          type="text" className="modal-input" placeholder="Event title..."
          value={formSummary} onChange={e => setFormSummary(e.target.value)} autoFocus
        />

        <label className="modal-checkbox-row">
          <input type="checkbox" checked={formAllDay} onChange={e => setFormAllDay(e.target.checked)} />
          <span>All-day event</span>
        </label>

        <input type="date" className="modal-input" value={formDate} onChange={e => setFormDate(e.target.value)} />

        {!formAllDay && (
          <div className="modal-time-row">
            <input type="time" className="modal-input" value={formStartTime} onChange={e => setFormStartTime(e.target.value)} />
            <span className="modal-time-sep">to</span>
            <input type="time" className="modal-input" value={formEndTime} onChange={e => setFormEndTime(e.target.value)} />
          </div>
        )}

        <input
          type="text" className="modal-input" placeholder="Location (optional)..."
          value={formLocation} onChange={e => setFormLocation(e.target.value)}
        />
        <textarea
          className="modal-input" placeholder="Description (optional)..." rows={3}
          value={formDescription} onChange={e => setFormDescription(e.target.value)}
        />

        {formError && <p className="modal-error-text">{formError}</p>}

        <div className="modal-actions">
          {editingEvent && (
            <button className="btn btn-outline-danger" onClick={() => handleDeleteEvent(editingEvent)}>Delete</button>
          )}
          <button className="btn btn-primary" onClick={handleSaveEvent} disabled={googleLoading}>
            {editingEvent ? 'Update Event' : 'Save Event'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CalendarPage;
