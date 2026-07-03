import { Grid, ArrowRight } from 'lucide-react';
import { useDashboardContext } from '../../context/DashboardContext';

const PriorityMatrixWidget = () => {
  const { tasks } = useDashboardContext();

  const pendingTasks = tasks.filter(t => !t.checked);

  // Example logic for matrix quadrants based on our mock data structure
  const urgentImportant = pendingTasks.filter(t => t.priority === 'High' && t.isOverdue).length;
  const important = pendingTasks.filter(t => t.priority === 'Medium').length;
  const urgent = pendingTasks.filter(t => t.priority === 'High' && !t.isOverdue).length;
  const later = pendingTasks.filter(t => t.priority === 'Low').length;

  return (
    <div className="card h-full">
      <div className="card-title mb-4">
        <Grid size={16} className="text-primary" />
        <span>PRIORITY MATRIX</span>
      </div>
      
      <div className="flex flex-col flex-1 justify-between">
        <div className="matrix-grid">
          <div className="matrix-quadrant quadrant-urgent-important">
            <span className="text-danger text-sm font-bold mb-1">Urgent + Important</span>
            <span className="text-danger text-2xl font-bold">{urgentImportant}</span>
            <span className="text-danger text-xs font-medium">Tasks</span>
          </div>
          <div className="matrix-quadrant quadrant-important">
            <span className="text-warning text-sm font-bold mb-1">Important</span>
            <span className="text-warning text-2xl font-bold">{important}</span>
            <span className="text-warning text-xs font-medium">Tasks</span>
          </div>
          <div className="matrix-quadrant quadrant-urgent">
            <span className="text-info text-sm font-bold mb-1">Urgent</span>
            <span className="text-info text-2xl font-bold">{urgent}</span>
            <span className="text-info text-xs font-medium">Tasks</span>
          </div>
          <div className="matrix-quadrant quadrant-later">
            <span className="text-muted text-sm font-bold mb-1">Later</span>
            <span className="text-main text-2xl font-bold">{later}</span>
            <span className="text-muted text-xs font-medium">Tasks</span>
          </div>
        </div>
        
        <a href="#" className="flex items-center gap-2 text-primary text-sm font-semibold mt-4">
          Open Matrix <ArrowRight size={16} />
        </a>
      </div>
    </div>
  );
};

export default PriorityMatrixWidget;
