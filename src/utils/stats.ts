import { STATUSES, type JobApplication } from '../types';
export function getStats(apps: JobApplication[], now = new Date()) {
  const submitted = apps.filter((a) =>
    a.statusHistory.some((h) => h.status !== 'Wishlist'),
  );
  const interviewCount = submitted.filter((a) =>
    a.statusHistory.some((h) => h.status === 'Interview'),
  ).length;
  const offerCount = submitted.filter((a) =>
    a.statusHistory.some((h) => h.status === 'Offer'),
  ).length;
  const month =
    now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  return {
    total: submitted.length,
    thisMonth: submitted.filter((a) => a.dateApplied?.startsWith(month)).length,
    currentInterviews: apps.filter((a) => a.status === 'Interview').length,
    offers: apps.filter((a) => a.status === 'Offer').length,
    interviewRate: submitted.length ? interviewCount / submitted.length : null,
    offerRate: submitted.length ? offerCount / submitted.length : null,
    byStatus: STATUSES.map((status) => ({
      status,
      count: apps.filter((a) => a.status === status).length,
    })),
    overTime: Object.entries(
      submitted.reduce<Record<string, number>>((acc, a) => {
        const date =
          a.dateApplied ??
          a.statusHistory
            .find((h) => h.status !== 'Wishlist')!
            .enteredAt.slice(0, 10);
        acc[date] = (acc[date] ?? 0) + 1;
        return acc;
      }, {}),
    )
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count })),
  };
}
export const percent = (value: number | null) =>
  value === null ? 'N/A' : Math.round(value * 100) + '%';
