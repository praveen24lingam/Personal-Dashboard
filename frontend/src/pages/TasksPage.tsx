import { useState } from 'react';
import { Plus, Search, Filter, Trash2, Edit2 } from 'lucide-react';
import { useDashboardContext } from '../context/DashboardContext';
import type { Task } from '../context/DashboardContext';
import { Modal } from '../components/Modal';

import './TasksPage.css';

const TasksPage = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useDashboardContext();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Date');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'High'|'Medium'|'Low'>('Medium');

  const filteredTasks = tasks.filter(t => {
    if (filter === 'Completed') return t.checked;
    if (filter === 'Pending') return !t.checked;
    if (filter === 'High Priority') return t.priority === 'High';
    return true;
  }).filter(t => t.text.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'Priority') {
        const order = { High: 1, Medium: 2, Low: 3 };
        return order[a.priority] - order[b.priority];
      }
      return 0; // Default sort is as they are stored
    });

  const handleSave = () => {
    if (!text.trim()) return;
    if (editTask) {
      updateTask(editTask.id, { text, priority });
    } else {
      addTask(text, priority);
    }
    setIsModalOpen(false);
  };

  const openModal = (t?: Task) => {
    if (t) {
      setEditTask(t);
      setText(t.text);
      setPriority(t.priority);
    } else {
      setEditTask(null);
      setText('');
      setPriority('Medium');
    }
    setIsModalOpen(true);
  };

  const getPriorityClass = (p: string) => p.toLowerCase();
  const getStatusClass = (s: string) => s.toLowerCase().replace(' ', '-');

  return (
    <div className="flex flex-col h-full">
      <div className="header">
        <div className="header-left">
          <h1 className="greeting">Tasks Management</h1>
          <p className="date text-muted">Manage, filter, and organize all your tasks.</p>
        </div>
        <div className="header-right">
          <button className="btn btn-primary" onClick={() => openModal()}>
            <Plus size={18} /> New Task
          </button>
        </div>
      </div>

      <div className="card w-full flex-1 flex flex-col p-6">
        <div className="tasks-toolbar">
          <div className="tasks-search-bar">
            <Search size={16} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="tasks-search-input"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="tasks-filters">
            <div className="tasks-filter-group">
              <Filter size={16} className="text-muted" />
              <select className="tasks-select" value={filter} onChange={e => setFilter(e.target.value)}>
                <option value="All">All Tasks</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="High Priority">High Priority</option>
              </select>
            </div>
            <select className="tasks-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="Date">Sort by Date</option>
              <option value="Priority">Sort by Priority</option>
            </select>
          </div>
        </div>

        <div className="tasks-table-wrapper">
          <table className="tasks-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>Task Description</th>
                <th>Priority</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => (
                <tr key={task.id}>
                  <td>
                    <input 
                      type="checkbox" 
                      className="custom-checkbox"
                      checked={task.checked}
                      onChange={() => toggleTask(task.id)}
                    />
                  </td>
                  <td style={{ textDecoration: task.checked ? 'line-through' : 'none', color: task.checked ? 'var(--text-muted)' : 'inherit', fontWeight: 500 }}>
                    {task.text}
                  </td>
                  <td>
                    <span className={`badge ${getPriorityClass(task.priority)}`}>{task.priority}</span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusClass(task.status)}`}>{task.status}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="text-muted hover:text-primary transition-colors" style={{ padding: '8px' }} onClick={() => openModal(task)}><Edit2 size={16}/></button>
                    <button className="text-muted hover:text-danger transition-colors" style={{ padding: '8px' }} onClick={() => deleteTask(task.id)}><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={5} className="tasks-table-empty">No tasks found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editTask ? "Edit Task" : "Create New Task"}>
        <div className="flex flex-col gap-4">
          <input type="text" className="modal-input" placeholder="Task description..." value={text} onChange={e => setText(e.target.value)} autoFocus />
          <select className="modal-input" value={priority} onChange={e => setPriority(e.target.value as any)}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <button className="btn btn-primary mt-2" onClick={handleSave}>Save Task</button>
        </div>
      </Modal>
    </div>
  );
};

export default TasksPage;
