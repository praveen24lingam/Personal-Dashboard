import { useState } from 'react';
import { CheckSquare, ArrowUp, Plus } from 'lucide-react';
import { useDashboardContext } from '../../context/DashboardContext';
import { Modal } from '../Modal';
import './TodoList.css';

const TodoListWidget = () => {
  const { tasks, toggleTask, addTask } = useDashboardContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleAddTask = () => {
    if (inputValue.trim()) {
      addTask(inputValue.trim());
      setInputValue('');
      setIsModalOpen(false);
    }
  };

  const getPriorityClass = (priority: string) => {
    return priority.toLowerCase();
  };

  const getStatusClass = (status: string) => {
    return status.toLowerCase().replace(' ', '-');
  };

  return (
    <div className="card h-full">
      <div className="card-title mb-6">
        <CheckSquare size={16} className="text-primary" />
        <span>TO-DO LIST</span>
      </div>
      
      <div className="todo-table-wrapper">
        <table className="todo-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}><ArrowUp size={14} className="text-muted" /></th>
              <th>Task</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>
                  <input 
                    type="checkbox" 
                    className="custom-checkbox"
                    checked={task.checked}
                    onChange={() => toggleTask(task.id)}
                  />
                </td>
                <td className="font-medium" style={{ textDecoration: task.checked ? 'line-through' : 'none', color: task.checked ? 'var(--text-muted)' : 'inherit' }}>{task.text}</td>
                <td>
                  <span className={`badge ${getPriorityClass(task.priority)}`}>{task.priority}</span>
                </td>
                <td>
                  <span className={`badge ${getStatusClass(task.status)}`}>{task.status}</span>
                </td>
                <td className="text-muted text-sm">{task.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <button className="btn text-primary justify-start mt-4" style={{ padding: '8px 0' }} onClick={() => { setInputValue(''); setIsModalOpen(true); }}>
        <Plus size={16} /> New Task
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <input 
          type="text" 
          className="modal-input" 
          placeholder="Task description..." 
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddTask()}
          autoFocus
        />
        <button className="btn btn-primary mt-2" onClick={handleAddTask}>Save Task</button>
      </Modal>
    </div>
  );
};

export default TodoListWidget;
