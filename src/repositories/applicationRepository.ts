import {
  STATUSES,
  type JobApplication,
  type ApplicationStatus,
} from '../types';
import { normalizeOrders, validateApplication } from '../utils/applications';
export interface ApplicationRepository {
  load(): JobApplication[];
  save(apps: JobApplication[]): void;
}
export const STORAGE_KEY = 'applyflow.applications';
export function seedApplications(): JobApplication[] {
  const rows: [string, string, string, ApplicationStatus, number][] = [
    ['Blibli', 'Software Engineer', 'Jakarta', 'Applied', 12],
    ['tiket.com', 'Frontend Engineer', 'Jakarta', 'Applied', 8],
    ['Formulatrix', 'Software Engineer', 'Salatiga', 'Interview', 6],
    ['Shopee', 'Software Engineer Intern', 'Jakarta', 'Wishlist', 1],
  ];
  return normalizeOrders(
    rows.map(([company, role, location, status, days], i) => {
      const created = new Date();
      created.setDate(created.getDate() - days);
      const date = created.toISOString();
      const route: ApplicationStatus[] =
        status === 'Wishlist'
          ? ['Wishlist']
          : status === 'Rejected'
            ? ['Applied', 'Interview', 'Rejected']
            : STATUSES.slice(1, STATUSES.indexOf(status) + 1);
      return {
        id: crypto.randomUUID(),
        company,
        role,
        location,
        employmentType: role.includes('Intern') ? 'Internship' : 'Full-time',
        status,
        order: i,
        dateApplied: status === 'Wishlist' ? '' : date.slice(0, 10),
        createdAt: date,
        updatedAt: new Date(
          created.getTime() + (route.length - 1) * 86400000,
        ).toISOString(),
        statusHistory: route.map((s, j) => ({
          status: s,
          enteredAt: new Date(created.getTime() + j * 86400000).toISOString(),
        })),
        notes:
          status === 'Interview'
            ? 'Prepare project walkthroughs and questions for the engineering team.'
            : '',
      };
    }),
  );
}
function isValidApp(value: unknown): value is JobApplication {
  if (!value || typeof value !== 'object') return false;
  const a = value as Record<string, unknown>;
  if (
    ![
      'id',
      'company',
      'role',
      'location',
      'employmentType',
      'status',
      'createdAt',
      'updatedAt',
    ].every((k) => typeof a[k] === 'string')
  )
    return false;
  if (
    !a.id ||
    !STATUSES.includes(a.status as ApplicationStatus) ||
    !Number.isInteger(a.order) ||
    (a.order as number) < 0
  )
    return false;
  if (
    ['jobUrl', 'notes', 'dateApplied'].some(
      (k) => a[k] !== undefined && typeof a[k] !== 'string',
    )
  )
    return false;
  if (!Array.isArray(a.statusHistory) || !a.statusHistory.length) return false;
  if (
    !a.statusHistory.every(
      (h) =>
        h &&
        typeof h === 'object' &&
        Object.keys(h).sort().join(',') === 'enteredAt,status' &&
        STATUSES.includes(h.status) &&
        typeof h.enteredAt === 'string' &&
        !Number.isNaN(Date.parse(h.enteredAt)),
    )
  )
    return false;
  if (
    a.statusHistory.at(-1).status !== a.status ||
    ['createdAt', 'updatedAt'].some((k) =>
      Number.isNaN(Date.parse(a[k] as string)),
    )
  )
    return false;
  return !validateApplication(a as unknown as JobApplication);
}
export function createLocalRepository(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
): ApplicationRepository {
  return {
    load() {
      let raw: string | null;
      try {
        raw = storage.getItem(STORAGE_KEY);
      } catch {
        throw new Error(
          'Browser storage is unavailable. Changes cannot be saved.',
        );
      }
      if (raw)
        try {
          const data: unknown = JSON.parse(raw);
          if (
            data &&
            typeof data === 'object' &&
            'version' in data &&
            (data.version === 1 || data.version === 2) &&
            'applications' in data &&
            Array.isArray(data.applications) &&
            data.applications.every(isValidApp) &&
            new Set(data.applications.map((a) => a.id)).size ===
              data.applications.length
          ) {
            const apps = normalizeOrders(data.applications);
            if (data.version === 1) {
              const legacy: Record<string, string> = {
                Linear: 'Frontend Engineer',
                Stripe: 'Software Engineer',
                Notion: 'Product Engineer',
                Vercel: 'Frontend Developer',
                Figma: 'Software Engineer Intern',
                Tokopedia: 'Backend Engineer',
                Canva: 'Frontend Engineer',
                GoTo: 'Software Engineer',
              };
              const isOldSample = (a: JobApplication) =>
                legacy[a.company] === a.role &&
                a.statusHistory[0]?.enteredAt === a.createdAt &&
                !a.jobUrl &&
                (a.notes === '' ||
                  a.notes ===
                    'Prepare project walkthroughs and questions for the engineering team.');
              // Migrate only a recognizable complete example set. Keep custom or partial data intact.
              if (
                Object.keys(legacy).every((company) =>
                  apps.some((a) => a.company === company && isOldSample(a)),
                )
              ) {
                const retained = apps.filter((a) => !isOldSample(a));
                const migrated = normalizeOrders([
                  ...retained,
                  ...seedApplications().filter(
                    (a) => !retained.some((b) => b.company === a.company),
                  ),
                ]);
                this.save(migrated);
                return migrated;
              }
            }
            return apps;
          }
        } catch {
          /* Invalid JSON resets to examples. */
        }
      const seed = seedApplications();
      this.save(seed);
      return seed;
    },
    save(apps) {
      storage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: 2, applications: apps }),
      );
    },
  };
}
