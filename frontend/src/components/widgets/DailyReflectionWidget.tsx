import { Heart, Trophy, Rocket } from 'lucide-react';
import { useDashboardContext } from '../../context/DashboardContext';
import './DailyReflection.css';

const DailyReflectionWidget = () => {
  const { reflection, updateReflection } = useDashboardContext();

  return (
    <div className="card h-full">
      <div className="card-title mb-6">
        <Heart size={16} className="text-danger" fill="currentColor" />
        <span>DAILY REFLECTION</span>
      </div>
      
      <div className="reflection-grid">
        <div className="reflection-item">
          <label className="reflection-label">What went well?</label>
          <input 
            type="text" 
            className="reflection-input success-bg" 
            placeholder="What went well today?" 
            value={reflection.wentWell}
            onChange={(e) => updateReflection('wentWell', e.target.value)}
          />
        </div>
        
        <div className="reflection-item">
          <label className="reflection-label">
            <Trophy size={14} className="text-warning" /> Today's Win
          </label>
          <input 
            type="text" 
            className="reflection-input default-bg" 
            placeholder="My biggest win today" 
            value={reflection.win}
            onChange={(e) => updateReflection('win', e.target.value)}
          />
        </div>
        
        <div className="reflection-item">
          <label className="reflection-label">What can be improved?</label>
          <input 
            type="text" 
            className="reflection-input warning-bg" 
            placeholder="What can be improved?" 
            value={reflection.improvement}
            onChange={(e) => updateReflection('improvement', e.target.value)}
          />
        </div>
        
        <div className="reflection-item">
          <label className="reflection-label">
            <Rocket size={14} className="text-info" /> Tomorrow's First Task
          </label>
          <input 
            type="text" 
            className="reflection-input default-bg" 
            placeholder="What's the first task tomorrow?" 
            value={reflection.tomorrowTask}
            onChange={(e) => updateReflection('tomorrowTask', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default DailyReflectionWidget;
