import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Columns3,
  ChartNoAxesCombined,
  Plus,
  Check,
} from 'lucide-react';
import { useApplications } from '../state/ApplicationsProvider';
import { ApplicationDialogs } from './ApplicationDialogs';
const navigation = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/applications', label: 'Applications', icon: BriefcaseBusiness },
  { path: '/board', label: 'Kanban Board', icon: Columns3 },
];

export function AppLayout() {
  const location = useLocation();
  const { apps, error, notice, add } = useApplications();
  const page = navigation.find((n) => n.path === location.pathname);
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand">
          ApplyFlow
        </Link>
        <nav aria-label="Main navigation">
          {navigation.map(({ path, label, icon: Icon }) => (
            <NavLink key={path} to={path} end={path === '/'}>
              <Icon size={18} />
              {label}
              {path === '/applications' && (
                <span className="nav-count">{apps.length}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="local-info">
            <Check size={15} />
            <span>{error ? 'Unsaved changes' : 'Saved'}</span>
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <span>
            Workspace <span className="slash">/</span>{' '}
            <strong>{page?.label ?? 'Page not found'}</strong>
          </span>
          <span className="date-label">
            {new Date().toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </header>
        <main>
          <div className="page-heading">
            <div>
              <h1>{page?.label ?? 'Page not found'}</h1>
            </div>
            <button className="primary add-button" onClick={() => add()}>
              <Plus size={17} />
              Add application
            </button>
          </div>
          {error && (
            <div role="alert" className="error-banner">
              {error}
            </div>
          )}
          <Outlet />
        </main>
      </div>
      <ApplicationDialogs />
      {notice && (
        <div className="toast" role="status">
          <Check size={16} />
          {notice}
        </div>
      )}
    </div>
  );
}
