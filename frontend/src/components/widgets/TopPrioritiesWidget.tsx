import { Star } from 'lucide-react';
import { useDashboardContext } from '../../context/DashboardContext';

const TopPrioritiesWidget = () => {
  const { tasks } = useDashboardContext();

  const topPriorities = tasks
    .filter(t => !t.checked)
    .sort((a, b) => {
      // Sort High > Medium > Low
      const order = { High: 1, Medium: 2, Low: 3 };
      return order[a.priority] - order[b.priority];
    })
    .slice(0, 3)
    .map((t, index) => {
      const pColor = t.priority === 'High' ? 'var(--primary)' : t.priority === 'Medium' ? 'var(--warning)' : 'var(--success)';
      return {
        id: index + 1,
        text: t.text,
        priority: t.priority,
        class: t.priority.toLowerCase(),
        color: pColor
      };
    });

  return (
    <div className="card h-full">
      <div className="card-title">
        <Star size={16} className="text-warning" />
        <span>TOP 3 PRIORITIES</span>
      </div>
      
      <div className="flex flex-col gap-4 mt-2">
        {topPriorities.length === 0 ? (
          <span className="text-sm text-muted">No pending priorities! 🎉</span>
        ) : (
          topPriorities.map(p => (
            <div key={p.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  style={{ 
                    backgroundColor: p.color, 
                    color: 'white', 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '600',
                    flexShrink: 0
                  }}>
                  {p.id}
                </div>
                <span className="text-sm font-medium line-clamp-1">{p.text}</span>
              </div>
              <span className={`badge ${p.class}`}>{p.priority}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopPrioritiesWidget;
