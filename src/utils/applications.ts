import {
  STATUSES,
  type JobApplication,
  type ApplicationInput,
  type ApplicationStatus,
  type Filters,
} from '../types';
export function validateApplication(data: ApplicationInput): string {
  if (!data.company.trim() || !data.role.trim() || !data.employmentType.trim())
    return 'Company, role, and employment type are required.';
  if (!STATUSES.includes(data.status)) return 'Select a valid status.';
  if (data.status !== 'Wishlist' && !data.dateApplied)
    return 'An applied date is required outside Wishlist.';
  if (
    data.dateApplied &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(data.dateApplied) ||
      Number.isNaN(Date.parse(data.dateApplied)) ||
      new Date(data.dateApplied).toISOString().slice(0, 10) !==
        data.dateApplied)
  )
    return 'Enter a valid applied date.';
  if (data.jobUrl?.trim()) {
    try {
      if (!['http:', 'https:'].includes(new URL(data.jobUrl.trim()).protocol))
        return 'Job URL must start with http:// or https://.';
    } catch {
      return 'Enter a valid job URL.';
    }
  }
  return '';
}
export function normalizeOrders(apps: JobApplication[]): JobApplication[] {
  return STATUSES.flatMap((status) =>
    apps
      .filter((a) => a.status === status)
      .sort((a, b) => a.order - b.order)
      .map((a, order) => ({ ...a, order })),
  );
}
export function saveApplication(
  apps: JobApplication[],
  input: ApplicationInput,
  id?: string,
  now = new Date().toISOString(),
): JobApplication[] {
  const data = {
    ...input,
    company: input.company.trim(),
    role: input.role.trim(),
    location: input.location.trim(),
    employmentType: input.employmentType.trim(),
    jobUrl: input.jobUrl?.trim(),
    notes: input.notes?.trim(),
    dateApplied: input.dateApplied?.trim(),
  };
  const error = validateApplication(data);
  if (error) throw new Error(error);
  const existing = apps.find((a) => a.id === id);
  const changed = existing && existing.status !== data.status;
  const app: JobApplication = {
    ...data,
    id: existing?.id ?? crypto.randomUUID(),
    order:
      existing && !changed
        ? existing.order
        : apps.filter((a) => a.status === data.status).length,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    statusHistory: existing
      ? [
          ...existing.statusHistory,
          ...(changed ? [{ status: data.status, enteredAt: now }] : []),
        ]
      : [{ status: data.status, enteredAt: now }],
  };
  return normalizeOrders(
    existing
      ? apps.map((a) => (a.id === existing.id ? app : a))
      : [...apps, app],
  );
}
export function moveApplication(
  apps: JobApplication[],
  id: string,
  status: ApplicationStatus,
  index: number,
  options: { filtered?: boolean; dateApplied?: string; now?: string } = {},
): JobApplication[] {
  const app = apps.find((a) => a.id === id);
  if (!app || !STATUSES.includes(status)) return apps;
  if (options.filtered && app.status === status) return apps;
  const dateApplied = app.dateApplied || options.dateApplied;
  if (status !== 'Wishlist' && !dateApplied)
    throw new Error('Choose an applied date before moving this application.');
  const validation = validateApplication({ ...app, status, dateApplied });
  if (validation) throw new Error(validation);
  const now = options.now ?? new Date().toISOString();
  const target = apps
    .filter((a) => a.status === status && a.id !== id)
    .sort((a, b) => a.order - b.order);
  const moved = {
    ...app,
    status,
    dateApplied,
    updatedAt: now,
    statusHistory:
      app.status === status
        ? app.statusHistory
        : [...app.statusHistory, { status, enteredAt: now }],
  };
  target.splice(Math.max(0, Math.min(index, target.length)), 0, moved);
  return normalizeOrders([
    ...apps.filter((a) => a.id !== id && a.status !== status),
    ...target.map((a, order) => ({ ...a, order })),
  ]);
}
export function deleteApplication(apps: JobApplication[], id: string) {
  return normalizeOrders(apps.filter((a) => a.id !== id));
}
export function filterApplications(apps: JobApplication[], filters: Filters) {
  const q = filters.search.trim().toLowerCase();
  return apps
    .filter(
      (a) =>
        (filters.status === 'all' || a.status === filters.status) &&
        [a.company, a.role, a.location].some((v) =>
          v.toLowerCase().includes(q),
        ),
    )
    .sort((a, b) =>
      filters.sort === 'company'
        ? a.company.localeCompare(b.company)
        : filters.sort === 'oldest'
          ? a.createdAt.localeCompare(b.createdAt)
          : b.createdAt.localeCompare(a.createdAt),
    );
}
