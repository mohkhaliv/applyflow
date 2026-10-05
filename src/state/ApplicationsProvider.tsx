import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  createLocalRepository,
  seedApplications,
} from '../repositories/applicationRepository';
import {
  deleteApplication,
  filterApplications,
  moveApplication,
  saveApplication,
} from '../utils/applications';
import type {
  ApplicationInput,
  ApplicationStatus,
  Filters,
  JobApplication,
} from '../types';

type ApplicationFormState = { input: ApplicationInput; id?: string };
type ApplicationsContextValue = {
  apps: JobApplication[];
  visible: JobApplication[];
  filters: Filters;
  setFilters: (filters: Filters) => void;
  error: string;
  notice: string;
  form: ApplicationFormState | null;
  detail: JobApplication | undefined;
  deleting: JobApplication | null;
  add: (status?: ApplicationStatus) => void;
  edit: (application: JobApplication) => void;
  view: (application: JobApplication) => void;
  closeForm: () => void;
  closeDetail: () => void;
  requestDelete: (application: JobApplication) => void;
  cancelDelete: () => void;
  confirmDelete: () => void;
  save: (input: ApplicationInput) => void;
  move: (id: string, status: ApplicationStatus, index: number) => void;
};
const ApplicationsContext = createContext<ApplicationsContextValue | null>(
  null,
);
const blank = (status: ApplicationStatus = 'Wishlist'): ApplicationInput => ({
  company: '',
  role: '',
  location: '',
  employmentType: 'Full-time',
  status,
  dateApplied: '',
  jobUrl: '',
  notes: '',
});

export function ApplicationsProvider({ children }: { children: ReactNode }) {
  const [repo] = useState(() =>
    createLocalRepository({
      getItem: (key) => window.localStorage.getItem(key),
      setItem: (key, value) => window.localStorage.setItem(key, value),
    }),
  );
  const [initial] = useState(() => {
    try {
      return { apps: repo.load(), error: '' };
    } catch {
      return {
        apps: seedApplications(),
        error: 'Browser storage is unavailable. Changes cannot be saved.',
      };
    }
  });
  const [error, setError] = useState(initial.error);
  const [apps, setApps] = useState<JobApplication[]>(initial.apps);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: 'all',
    sort: 'newest',
  });
  const [form, setForm] = useState<{
    input: ApplicationInput;
    id?: string;
  } | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<JobApplication | null>(null);
  const [notice, setNotice] = useState('');
  const detail = apps.find((a) => a.id === detailId);
  const visible = useMemo(
    () => filterApplications(apps, filters),
    [apps, filters],
  );
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 3500);
    return () => clearTimeout(timer);
  }, [notice]);
  function commit(next: JobApplication[], message: string) {
    try {
      repo.save(next);
      setError('');
    } catch {
      setError(
        'Changes could not be saved to this browser. Keep this tab open and enable browser storage.',
      );
    }
    setApps(next);
    setNotice(message);
  }
  function save(input: ApplicationInput) {
    try {
      commit(saveApplication(apps, input, form?.id), 'Application saved');
      setForm(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save application.');
    }
  }
  function move(id: string, status: ApplicationStatus, index: number) {
    const app = apps.find((a) => a.id === id)!;
    if (status !== 'Wishlist' && !app.dateApplied) {
      setForm({ input: { ...app, status }, id });
      setNotice('Choose an applied date to complete this move.');
      return;
    }
    try {
      commit(
        moveApplication(apps, id, status, index, {
          filtered: !!filters.search.trim() || filters.status !== 'all',
        }),
        'Board updated',
      );
    } catch (e) {
      setError(String(e));
    }
  }

  function add(status: ApplicationStatus = 'Wishlist') {
    setForm({ input: blank(status) });
  }
  function edit(application: JobApplication) {
    setForm({ input: application, id: application.id });
    setDetailId(null);
  }
  function view(application: JobApplication) {
    setDetailId(application.id);
  }
  function confirmDelete() {
    if (!deleting) return;
    commit(deleteApplication(apps, deleting.id), 'Application deleted');
    setDeleting(null);
    setDetailId(null);
  }
  return (
    <ApplicationsContext.Provider
      value={{
        apps,
        visible,
        filters,
        setFilters,
        error,
        notice,
        form,
        detail,
        deleting,
        add,
        edit,
        view,
        closeForm: () => setForm(null),
        closeDetail: () => setDetailId(null),
        requestDelete: setDeleting,
        cancelDelete: () => setDeleting(null),
        confirmDelete,
        save,
        move,
      }}
    >
      {children}
    </ApplicationsContext.Provider>
  );
}
export function useApplications() {
  const context = useContext(ApplicationsContext);
  if (!context)
    throw new Error(
      'useApplications must be used inside ApplicationsProvider.',
    );
  return context;
}
