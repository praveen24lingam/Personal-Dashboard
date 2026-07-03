import { CheckSquare } from 'lucide-react';
import { useDashboardContext } from '../../context/DashboardContext';
import './TodoList.css'; 

const ChecklistWidget = () => {
  const { checklist, toggleChecklist } = useDashboardContext();

  return (
    <div className="card h-full">
      <div className="card-title mb-4">
        <CheckSquare size={16} className="text-primary" />
        <span>END OF DAY CHECKLIST</span>
      </div>
      
      <div className="flex flex-col gap-4 mt-2">
        {checklist.map(item => (
          <label key={item.id} className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              className="custom-checkbox"
              checked={item.checked}
              onChange={() => toggleChecklist(item.id)}
            />
            <span className="text-sm font-medium text-main" style={{ textDecoration: item.checked ? 'line-through' : 'none', color: item.checked ? 'var(--text-muted)' : 'inherit' }}>{item.text}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ChecklistWidget;
