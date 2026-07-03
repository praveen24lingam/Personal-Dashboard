import { useDashboardContext } from '../context/DashboardContext';
import { AlertCircle, Calendar, Play, Coffee } from 'lucide-react';
import './MatrixPage.css';

const MatrixPage = () => {
  const { tasks } = useDashboardContext();
  const pendingTasks = tasks.filter(t => !t.checked);

  // Eisenhower categorization
  const urgentImportant = pendingTasks.filter(t => t.priority === 'High' && t.isOverdue);
  const important = pendingTasks.filter(t => t.priority === 'High' && !t.isOverdue);
  const urgent = pendingTasks.filter(t => t.priority === 'Medium' && t.status === 'In Progress');
  const later = pendingTasks.filter(t => t.priority === 'Low' || (t.priority === 'Medium' && t.status !== 'In Progress'));

  const renderTaskList = (list: typeof tasks, emptyMsg: string) => (
    <div className="flex flex-col gap-2 mt-4 overflow-y-auto pr-2" style={{ maxHeight: '200px' }}>
      {list.length === 0 ? <p className="text-muted text-sm italic">{emptyMsg}</p> : list.map(t => (
        <div key={t.id} className="p-3 bg-gray-50 border border-gray-100 rounded-md text-sm flex justify-between items-center" style={{ backgroundColor: '#F9FAFB', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)' }}>
          <span className="font-medium text-main">{t.text}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="header">
        <div className="header-left">
          <h1 className="greeting">Priority Matrix</h1>
          <p className="date text-muted">Eisenhower Matrix based on task priorities.</p>
        </div>
      </div>

      <div className="matrix-grid">
        <div className="card shadow-sm matrix-quadrant danger">
          <h3 className="card-title text-danger mb-1"><AlertCircle size={14}/> Do First (Urgent & Important)</h3>
          <p className="text-xs text-muted">Overdue high priority tasks.</p>
          {renderTaskList(urgentImportant, "No critical tasks!")}
        </div>
        
        <div className="card shadow-sm matrix-quadrant warning">
          <h3 className="card-title text-warning mb-1"><Calendar size={14}/> Schedule (Important, Not Urgent)</h3>
          <p className="text-xs text-muted">Medium priority tasks.</p>
          {renderTaskList(important, "No scheduled tasks.")}
        </div>
        
        <div className="card shadow-sm matrix-quadrant info">
          <h3 className="card-title text-info mb-1"><Play size={14}/> Delegate (Urgent, Not Important)</h3>
          <p className="text-xs text-muted">High priority tasks (not overdue).</p>
          {renderTaskList(urgent, "No urgent tasks.")}
        </div>
        
        <div className="card shadow-sm matrix-quadrant gray">
          <h3 className="card-title text-gray-500 mb-1" style={{ color: 'var(--text-muted)' }}><Coffee size={14}/> Don't Do (Not Urgent, Not Important)</h3>
          <p className="text-xs text-muted">Low priority tasks.</p>
          {renderTaskList(later, "No backlogged tasks.")}
        </div>
      </div>
    </div>
  );
};

export default MatrixPage;
