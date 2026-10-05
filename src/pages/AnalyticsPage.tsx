import { useApplications } from '../state/ApplicationsProvider';
import { DashboardStats } from '../components/DashboardStats';
import { ActivityChart, StatusChart } from '../components/Charts';
import { getStats, percent } from '../utils/stats';
export function AnalyticsPage() {
  const { apps } = useApplications();
  const s = getStats(apps);
  return (
    <>
      <DashboardStats apps={apps} />
      <div className="conversion-grid">
        <section className="conversion panel">
          <span>Interview conversion</span>
          <strong>{percent(s.interviewRate)}</strong>
          <p>
            Applications that ever reached Interview ÷ all applications that
            ever left Wishlist.
          </p>
        </section>
        <section className="conversion panel">
          <span>Offer conversion</span>
          <strong>{percent(s.offerRate)}</strong>
          <p>
            Applications that ever reached Offer ÷ all applications that ever
            left Wishlist.
          </p>
        </section>
      </div>
      <div className="dashboard-grid">
        <ActivityChart apps={apps} />
        <StatusChart apps={apps} />
      </div>
      <p className="metric-note">
        Conversion rates retain past milestones, even after rejection.
        Wishlist-only items are excluded from application totals. Monthly
        activity uses the applied date; offers and interviews in the summary
        show current statuses.
      </p>
    </>
  );
}
