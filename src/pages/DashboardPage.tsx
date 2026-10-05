import { useApplications } from '../state/ApplicationsProvider';
import { Link } from 'react-router-dom';
import { DashboardStats } from '../components/DashboardStats';
import { ActivityChart, StatusChart } from '../components/Charts';
import { ApplicationTable } from '../components/ApplicationTable';
export function DashboardPage() {
  const { apps, view, requestDelete } = useApplications();
  return (
    <>
      <DashboardStats apps={apps} />
      <div className="dashboard-grid">
        <ActivityChart apps={apps} />
        <StatusChart apps={apps} />
      </div>
      <section className="panel recent">
        <div className="panel-title">
          <h2>Recent applications</h2>
          <Link className="text-link" to="/applications">
            View all
          </Link>
        </div>
        <ApplicationTable
          apps={[...apps]
            .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
            .slice(0, 5)}
          onOpen={view}
          onDelete={requestDelete}
        />
      </section>
    </>
  );
}
