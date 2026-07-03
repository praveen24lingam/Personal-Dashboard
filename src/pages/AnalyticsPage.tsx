import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useDashboardContext } from '../context/DashboardContext';
import './AnalyticsPage.css';

const AnalyticsPage = () => {
  const { tasks } = useDashboardContext();

  const completed = tasks.filter(t => t.checked).length;
  const pending = tasks.filter(t => !t.checked).length;

  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'High' && !t.checked).length, color: 'var(--danger)' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'Medium' && !t.checked).length, color: 'var(--warning)' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'Low' && !t.checked).length, color: 'var(--success)' }
  ].filter(d => d.value > 0);
  
  // Fallback if no pending tasks
  if (priorityData.length === 0) {
    priorityData.push({ name: 'No Pending Tasks', value: 1, color: 'var(--border-color)' });
  }

  const statusData = [
    { name: 'Completed', value: completed },
    { name: 'Pending', value: pending }
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="header">
        <div className="header-left">
          <h1 className="greeting">Analytics Dashboard</h1>
          <p className="date text-muted">Visualize your productivity and task distribution.</p>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="card shadow-sm analytics-card">
          <h3 className="card-title">Task Completion Status</h3>
          <div style={{ flex: 1, width: '100%', minHeight: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }} />
                <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card shadow-sm analytics-card">
          <h3 className="card-title">Priority Distribution</h3>
          <div style={{ flex: 1, width: '100%', minHeight: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="analytics-legend">
            {priorityData.map(d => (
              <div key={d.name} className="analytics-legend-item">
                <div className="analytics-legend-dot" style={{ backgroundColor: d.color }}></div>
                <span className="analytics-legend-text">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
