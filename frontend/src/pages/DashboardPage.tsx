import Header from '../components/Header';
import WeeklyGoalWidget from '../components/widgets/WeeklyGoalWidget';
import FocusTaskWidget from '../components/widgets/FocusTaskWidget';
import ProgressWidget from '../components/widgets/ProgressWidget';
import TopPrioritiesWidget from '../components/widgets/TopPrioritiesWidget';
import AgendaWidget from '../components/widgets/AgendaWidget';
import MeetingsWidget from '../components/widgets/MeetingsWidget';
import TodoListWidget from '../components/widgets/TodoListWidget';
import OverdueTasksWidget from '../components/widgets/OverdueTasksWidget';
import PendingTasksWidget from '../components/widgets/PendingTasksWidget';
import CalendarWidget from '../components/widgets/CalendarWidget';
import QuickNotesWidget from '../components/widgets/QuickNotesWidget';
import PriorityMatrixWidget from '../components/widgets/PriorityMatrixWidget';
import ChecklistWidget from '../components/widgets/ChecklistWidget';
import DailyReflectionWidget from '../components/widgets/DailyReflectionWidget';
import FooterQuote from '../components/FooterQuote';

const DashboardPage = () => {
  return (
    <>
      <Header />
      
      <div className="dashboard-grid">
        {/* Row 1 */}
        <div className="col-span-1">
          <WeeklyGoalWidget />
        </div>
        <div className="col-span-1">
          <FocusTaskWidget />
        </div>
        <div className="col-span-2">
          <ProgressWidget />
        </div>

        {/* Row 2 */}
        <div className="col-span-1">
          <TopPrioritiesWidget />
        </div>
        <div className="col-span-1">
          <AgendaWidget />
        </div>
        <div className="col-span-2">
          <MeetingsWidget />
        </div>

        {/* Row 3 */}
        <div className="col-span-3">
          <TodoListWidget />
        </div>
        <div className="col-span-1 flex flex-col gap-6">
          <OverdueTasksWidget />
          <PendingTasksWidget />
        </div>

        {/* Row 4 */}
        <div className="col-span-1">
          <CalendarWidget />
        </div>
        <div className="col-span-1">
          <QuickNotesWidget />
        </div>
        <div className="col-span-2">
          <PriorityMatrixWidget />
        </div>

        {/* Row 5 - Bottom */}
        <div className="col-span-1">
          <ChecklistWidget />
        </div>
        <div className="col-span-3">
          <DailyReflectionWidget />
        </div>
      </div>

      <FooterQuote />
    </>
  );
};

export default DashboardPage;
