import { useState } from 'react';
import { Flame, Edit2, CheckCircle2 } from 'lucide-react';
import { useDashboardContext } from '../../context/DashboardContext';

const FocusTaskWidget = () => {
  const { focusTask, updateFocusTask } = useDashboardContext();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('');

  const startEdit = () => {
    if (focusTask) {
      setTitle(focusTask.title);
      setPriority(focusTask.priority);
      setIsEditing(true);
    }
  };

  const saveEdit = () => {
    updateFocusTask(title, priority);
    setIsEditing(false);
  };

  if (!focusTask) return null;

  return (
    <div className="card h-full focus-card">
      <div className="card-title flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <Flame size={16} className="text-warning" />
          <span className="text-warning">FOCUS OF THE DAY</span>
        </div>
        <button onClick={isEditing ? saveEdit : startEdit} className="text-warning hover:text-white transition-colors">
          {isEditing ? <CheckCircle2 size={14} /> : <Edit2 size={14} />}
        </button>
      </div>
      
      <div className="flex flex-col justify-center flex-1">
        {isEditing ? (
          <div className="flex flex-col gap-2 w-full mt-2">
            <input type="text" className="modal-input" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }} value={title} onChange={e => setTitle(e.target.value)} />
            <select className="modal-input" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }} value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="High" style={{ color: 'black' }}>High</option>
              <option value="Medium" style={{ color: 'black' }}>Medium</option>
              <option value="Low" style={{ color: 'black' }}>Low</option>
            </select>
          </div>
        ) : (
          <h2 className="text-2xl font-bold mt-2 leading-tight">{focusTask.title}</h2>
        )}
      </div>
      
      {!isEditing && (
        <div className="mt-4">
          <span className="badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
            {focusTask.priority} Priority
          </span>
        </div>
      )}
    </div>
  );
};

export default FocusTaskWidget;
