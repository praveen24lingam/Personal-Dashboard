import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface Task { id: string; text: string; priority: TaskPriority; status: TaskStatus; date: string; checked: boolean; isOverdue: boolean; }
export interface Note { id: string; text: string; }
export interface ChecklistItem { id: string; text: string; checked: boolean; }
export interface DailyReflection { wentWell: string; win: string; improvement: string; tomorrowTask: string; }
export interface User { id: string; name: string; quote: string; streakDaily: number; streakFocus: number; streakReflection: number; }
export interface Goal { id: string; title: string; target: number; current: number; }
export interface FocusTask { id: string; title: string; priority: string; }
export interface AgendaItem { id: string; time: string; task: string; date: string; }
export interface Meeting { id: string; title: string; time: string; platform: string; date: string; }
export interface Template { id: string; title: string; description: string; }
export interface GoogleEvent {
  id: string; summary: string; description: string; location: string;
  start: string; end: string; allDay: boolean; hangoutLink: string; htmlLink: string;
}
export interface GoogleEventInput {
  summary: string; description?: string; location?: string; start: string; end: string; allDay: boolean; timeZone?: string;
}

interface DashboardState {
  tasks: Task[]; notes: Note[]; checklist: ChecklistItem[]; reflection: DailyReflection;
  user: User | null; goal: Goal | null; focusTask: FocusTask | null;
  agenda: AgendaItem[]; meetings: Meeting[]; templates: Template[];
  loading: boolean;
  googleConnected: boolean; googleEvents: GoogleEvent[]; googleLoading: boolean;
}

interface DashboardContextType extends DashboardState {
  toggleTask: (id: string) => Promise<void>;
  addTask: (text: string, priority?: TaskPriority, status?: TaskStatus, date?: string) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addNote: (text: string) => Promise<void>;
  toggleChecklist: (id: string) => Promise<void>;
  updateReflection: (field: keyof DailyReflection, value: string) => Promise<void>;
  updateGoal: (title: string, target: number, current: number) => Promise<void>;
  updateFocusTask: (title: string, priority: string) => Promise<void>;
  addAgendaItem: (time: string, task: string, date: string) => Promise<void>;
  deleteAgendaItem: (id: string) => Promise<void>;
  addMeeting: (title: string, time: string, platform: string, date: string) => Promise<void>;
  deleteMeeting: (id: string) => Promise<void>;
  addTemplate: (title: string, description: string) => Promise<void>;
  updateTemplate: (id: string, title: string, description: string) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  connectGoogleCalendar: () => void;
  disconnectGoogleCalendar: () => Promise<void>;
  fetchGoogleEvents: (timeMin: string, timeMax: string) => Promise<void>;
  createGoogleEvent: (input: GoogleEventInput) => Promise<void>;
  updateGoogleEvent: (id: string, input: GoogleEventInput) => Promise<void>;
  deleteGoogleEvent: (id: string) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [reflection, setReflection] = useState<DailyReflection>({ wentWell: '', win: '', improvement: '', tomorrowTask: '' });
  const [user, setUser] = useState<User | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [focusTask, setFocusTask] = useState<FocusTask | null>(null);
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [googleEvents, setGoogleEvents] = useState<GoogleEvent[]>([]);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleRange, setGoogleRange] = useState<{ timeMin: string; timeMax: string } | null>(null);

  const fetchData = async () => {
    try {
      const [tasksRes, notesRes, checkRes, refRes, userRes, goalRes, focusRes, agendaRes, meetRes, tempRes] = await Promise.all([
        axios.get(`${API_URL}/tasks`), axios.get(`${API_URL}/notes`), axios.get(`${API_URL}/checklist`),
        axios.get(`${API_URL}/reflection`), axios.get(`${API_URL}/user`), axios.get(`${API_URL}/goals`),
        axios.get(`${API_URL}/focus`), axios.get(`${API_URL}/agenda`), axios.get(`${API_URL}/meetings`), axios.get(`${API_URL}/templates`)
      ]);
      setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []); 
      setNotes(Array.isArray(notesRes.data) ? notesRes.data : []); 
      setChecklist(Array.isArray(checkRes.data) ? checkRes.data : []);
      setReflection(refRes.data); setUser(userRes.data); setGoal(goalRes.data);
      setFocusTask(focusRes.data); 
      setAgenda(Array.isArray(agendaRes.data) ? agendaRes.data : []); 
      setMeetings(Array.isArray(meetRes.data) ? meetRes.data : []); 
      setTemplates(Array.isArray(tempRes.data) ? tempRes.data : []);
    } catch (err) { console.error('Error fetching data', err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // -- GOOGLE CALENDAR --
  const fetchGoogleEvents = async (timeMin: string, timeMax: string) => {
    setGoogleRange({ timeMin, timeMax });
    setGoogleLoading(true);
    try {
      const res = await axios.get(`${API_URL}/calendar/events`, { params: { timeMin, timeMax } });
      setGoogleEvents(res.data);
    } catch {
      setGoogleEvents([]);
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await axios.get(`${API_URL}/calendar/status`);
        setGoogleConnected(res.data.connected);
        if (res.data.connected) {
          const now = new Date();
          const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
          const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
          fetchGoogleEvents(start, end);
        }
      } catch { setGoogleConnected(false); }
    };
    checkConnection();
  }, []);

  const connectGoogleCalendar = () => { window.location.href = `${API_URL}/calendar/auth`; };

  const disconnectGoogleCalendar = async () => {
    await axios.post(`${API_URL}/calendar/disconnect`);
    setGoogleConnected(false);
    setGoogleEvents([]);
  };

  const refetchGoogleRange = async () => {
    if (googleRange) await fetchGoogleEvents(googleRange.timeMin, googleRange.timeMax);
  };

  const createGoogleEvent = async (input: GoogleEventInput) => {
    await axios.post(`${API_URL}/calendar/events`, input);
    await refetchGoogleRange();
  };
  const updateGoogleEvent = async (id: string, input: GoogleEventInput) => {
    await axios.put(`${API_URL}/calendar/events/${id}`, input);
    await refetchGoogleRange();
  };
  const deleteGoogleEvent = async (id: string) => {
    setGoogleEvents(googleEvents.filter(e => e.id !== id));
    try { await axios.delete(`${API_URL}/calendar/events/${id}`); } catch { refetchGoogleRange(); }
  };

  // -- TASKS --
  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const isNowChecked = !task.checked;
    const newStatus = isNowChecked ? 'Completed' : 'In Progress';
    setTasks(tasks.map(t => t.id === id ? { ...t, checked: isNowChecked, status: newStatus } : t));
    try { await axios.put(`${API_URL}/tasks/${id}`, { checked: isNowChecked, status: newStatus }); } catch { fetchData(); }
  };
  const addTask = async (text: string, priority: TaskPriority = 'Medium', status: TaskStatus = 'Not Started', date: string = 'Today') => {
    if (!text.trim()) return;
    const newTask: Task = { id: Date.now().toString(), text, priority, status, date, checked: status === 'Completed', isOverdue: false };
    setTasks([...tasks, newTask]);
    try { await axios.post(`${API_URL}/tasks`, newTask); } catch { fetchData(); }
  };
  const updateTask = async (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
    const fullTask = tasks.find(t => t.id === id);
    if (!fullTask) return;
    try { await axios.put(`${API_URL}/tasks/${id}`, { ...fullTask, ...updates }); } catch { fetchData(); }
  };
  const deleteTask = async (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    try { await axios.delete(`${API_URL}/tasks/${id}`); } catch { fetchData(); }
  };

  // -- NOTES & CHECKLIST & REFLECTION --
  const addNote = async (text: string) => {
    if (!text.trim()) return;
    const newNote = { id: Date.now().toString(), text };
    setNotes([...notes, newNote]);
    try { await axios.post(`${API_URL}/notes`, newNote); } catch { fetchData(); }
  };
  const toggleChecklist = async (id: string) => {
    const item = checklist.find(c => c.id === id);
    if (!item) return;
    setChecklist(checklist.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
    try { await axios.put(`${API_URL}/checklist/${id}`, { checked: !item.checked }); } catch { fetchData(); }
  };
  const updateReflection = async (field: keyof DailyReflection, value: string) => {
    const newReflection = { ...reflection, [field]: value };
    setReflection(newReflection);
    try { await axios.put(`${API_URL}/reflection`, newReflection); } catch { fetchData(); }
  };

  // -- NEW MODULES --
  const updateGoal = async (title: string, target: number, current: number) => {
    setGoal(prev => prev ? { ...prev, title, target, current } : null);
    try { await axios.put(`${API_URL}/goals`, { title, target, current }); } catch { fetchData(); }
  };
  const updateFocusTask = async (title: string, priority: string) => {
    setFocusTask(prev => prev ? { ...prev, title, priority } : null);
    try { await axios.put(`${API_URL}/focus`, { title, priority }); } catch { fetchData(); }
  };
  
  const addAgendaItem = async (time: string, task: string, date: string) => {
    const item = { id: Date.now().toString(), time, task, date };
    setAgenda([...agenda, item]);
    try { await axios.post(`${API_URL}/agenda`, item); } catch { fetchData(); }
  };
  const deleteAgendaItem = async (id: string) => {
    setAgenda(agenda.filter(a => a.id !== id));
    try { await axios.delete(`${API_URL}/agenda/${id}`); } catch { fetchData(); }
  };

  const addMeeting = async (title: string, time: string, platform: string, date: string) => {
    const meeting = { id: Date.now().toString(), title, time, platform, date };
    setMeetings([...meetings, meeting]);
    try { await axios.post(`${API_URL}/meetings`, meeting); } catch { fetchData(); }
  };
  const deleteMeeting = async (id: string) => {
    setMeetings(meetings.filter(m => m.id !== id));
    try { await axios.delete(`${API_URL}/meetings/${id}`); } catch { fetchData(); }
  };

  const addTemplate = async (title: string, description: string) => {
    const item = { id: Date.now().toString(), title, description };
    setTemplates([...templates, item]);
    try { await axios.post(`${API_URL}/templates`, item); } catch { fetchData(); }
  };
  const updateTemplate = async (id: string, title: string, description: string) => {
    setTemplates(templates.map(t => t.id === id ? { ...t, title, description } : t));
    try { await axios.put(`${API_URL}/templates/${id}`, { title, description }); } catch { fetchData(); }
  };
  const deleteTemplate = async (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    try { await axios.delete(`${API_URL}/templates/${id}`); } catch { fetchData(); }
  };

  return (
    <DashboardContext.Provider value={{
      tasks, notes, checklist, reflection, user, goal, focusTask, agenda, meetings, templates, loading,
      googleConnected, googleEvents, googleLoading,
      toggleTask, addTask, updateTask, deleteTask, addNote, toggleChecklist, updateReflection,
      updateGoal, updateFocusTask, addAgendaItem, deleteAgendaItem, addMeeting, deleteMeeting,
      addTemplate, updateTemplate, deleteTemplate,
      connectGoogleCalendar, disconnectGoogleCalendar, fetchGoogleEvents,
      createGoogleEvent, updateGoogleEvent, deleteGoogleEvent
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) { throw new Error('useDashboardContext must be used within a DashboardProvider'); }
  return context;
};
