import { getStats, percent } from '../utils/stats';
import type { JobApplication } from '../types';
export function DashboardStats({ apps }: { apps: JobApplication[] }) {
  const s = getStats(apps);
  const cards = [
    {
      label: 'Total applications',
      value: s.total,
      foot: s.thisMonth + ' applied this month',
    },
    {
      label: 'Active interviews',
      value: s.currentInterviews,
      foot: percent(s.interviewRate) + ' interview conversion',
    },
    {
      label: 'Offers received',
      value: s.offers,
      foot: percent(s.offerRate) + ' offer conversion',
    },
    {
      label: 'Applied this month',
      value: s.thisMonth,
      foot: new Date().toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric',
      }),
    },
  ];
  return (
    <div className="stats-grid">
      {cards.map(({ label, value, foot }) => (
        <section className="stat-card" key={label}>
          <div>
            <span>{label}</span>
          </div>
          <strong>{value}</strong>
          <p>{foot}</p>
        </section>
      ))}
    </div>
  );
}
