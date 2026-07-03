import { Clock, ArrowRight } from 'lucide-react';
import { useDashboardContext } from '../../context/DashboardContext';

const PendingTasksWidget = () => {
  const { tasks } = useDashboardContext();
  
  // Exclude overdue to avoid duplication with Overdue Widget
  const pendingTasks = tasks.filter(t => !t.checked && !t.isOverdue).slice(0, 3); // showing top 3

  return (
    <div className="card" style={{ flex: 1 }}>
      <div className="card-title">
        <Clock size={16} className="text-warning" />
        <span>PENDING TASKS</span>
      </div>
      
      <ul className="flex flex-col gap-4 mt-2">
        {pendingTasks.length === 0 ? (
          <li className="text-sm text-muted">All caught up!</li>
        ) : (
          pendingTasks.map(task => (
            <li key={task.id} className="flex items-center gap-2 text-sm font-medium">
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-main)' }}></div>
              <span className="line-clamp-1">{task.text}</span>
            </li>
          ))
        )}
      </ul>
      
      <a href="#" className="flex items-center gap-2 text-primary text-sm font-semibold mt-4">
        View all <ArrowRight size={16} />
      </a>
    </div>
  );
};

export default PendingTasksWidget;
