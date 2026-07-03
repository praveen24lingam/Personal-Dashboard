import { Sparkles } from 'lucide-react';
import { useDashboardContext } from '../../context/DashboardContext';

const ProgressWidget = () => {
  const { tasks } = useDashboardContext();

  const total = tasks.length;
  const done = tasks.filter(t => t.checked).length;
  const pending = total - done;
  const percentage = total === 0 ? 0 : Math.round((done / total) * 100);

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="card h-full">
      <div className="card-title">
        <Sparkles size={16} className="text-primary" />
        <span>TODAY'S PROGRESS</span>
      </div>
      
      <div className="flex items-center gap-6" style={{ height: '100%' }}>
        <div className="donut-chart-container">
          <svg width="100" height="100" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#F4F1FE"
              strokeWidth="12"
            />
            {/* Foreground circle - secondary (green part to show remaining uncompleted as a fixed base if needed, but standard is just showing progress) */}
            {/* We'll just show the single progress fill */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="var(--primary)"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
            
            <text x="50" y="50" textAnchor="middle" dy="6" fontSize="20" fontWeight="700" fill="var(--text-main)">
              {percentage}%
            </text>
          </svg>
        </div>
        
        <div className="stats-list flex-1">
          <div className="stat-item flex justify-between gap-8 mb-2">
            <span className="text-muted text-sm font-medium">Done</span>
            <span className="font-bold">{done}</span>
          </div>
          <div className="stat-item flex justify-between gap-8 mb-2">
            <span className="text-muted text-sm font-medium">Pending</span>
            <span className="font-bold">{pending}</span>
          </div>
          <div className="stat-item flex justify-between gap-8">
            <span className="text-muted text-sm font-medium">Total</span>
            <span className="font-bold">{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressWidget;
