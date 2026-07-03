import { useState } from 'react';
import { Target, CheckCircle2, Edit2 } from 'lucide-react';
import { useDashboardContext } from '../../context/DashboardContext';
import './Widgets.css';

const WeeklyGoalWidget = () => {
  const { goal, updateGoal } = useDashboardContext();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [current, setCurrent] = useState('');
  const [target, setTarget] = useState('');

  const startEdit = () => {
    if (goal) {
      setTitle(goal.title);
      setCurrent(goal.current.toString());
      setTarget(goal.target.toString());
      setIsEditing(true);
    }
  };

  const saveEdit = () => {
    updateGoal(title, parseInt(current, 10), parseInt(target, 10));
    setIsEditing(false);
  };

  if (!goal) return null;

  const percentage = Math.round((goal.current / goal.target) * 100);

  return (
    <div className="card h-full">
      <div className="card-title flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-primary" />
          <span>WEEKLY GOAL</span>
        </div>
        <button onClick={isEditing ? saveEdit : startEdit} className="text-muted hover:text-primary transition-colors">
          {isEditing ? <CheckCircle2 size={14} /> : <Edit2 size={14} />}
        </button>
      </div>
      
      <div className="flex flex-col justify-between h-full pt-2">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <input type="text" className="modal-input" value={title} onChange={e => setTitle(e.target.value)} />
            <div className="flex gap-2">
              <input type="number" className="modal-input w-1/2" placeholder="Current" value={current} onChange={e => setCurrent(e.target.value)} />
              <input type="number" className="modal-input w-1/2" placeholder="Target" value={target} onChange={e => setTarget(e.target.value)} />
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold text-main line-clamp-2">{goal.title}</h3>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-primary">{percentage}% Complete</span>
                <span className="text-muted font-medium">{goal.current}/{goal.target}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeeklyGoalWidget;
