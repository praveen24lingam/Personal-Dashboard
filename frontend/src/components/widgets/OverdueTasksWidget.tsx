import { AlertTriangle } from 'lucide-react';
import { useDashboardContext } from '../../context/DashboardContext';

const OverdueTasksWidget = () => {
  const { tasks } = useDashboardContext();
  
  const overdueTasks = tasks.filter(t => t.isOverdue && !t.checked);

  return (
    <div className="card" style={{ flex: 1 }}>
      <div className="card-title">
        <AlertTriangle size={16} className="text-danger" />
        <span>OVERDUE TASKS</span>
      </div>
      
      <ul className="flex flex-col gap-4 mt-2">
        {overdueTasks.length === 0 ? (
          <li className="text-sm text-muted">No overdue tasks!</li>
        ) : (
          overdueTasks.map(task => (
            <li key={task.id} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-main)' }}></div>
                <span className="font-medium">{task.text}</span>
              </div>
              <span className="text-danger font-medium">{task.date}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default OverdueTasksWidget;
