import { BriefcaseBusiness, Trash2 } from 'lucide-react';
import type { JobApplication } from '../types';
export function ApplicationTable({
  apps,
  onOpen,
  onDelete,
}: {
  apps: JobApplication[];
  onOpen: (a: JobApplication) => void;
  onDelete: (a: JobApplication) => void;
}) {
  return apps.length ? (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Company & role</th>
            <th>Status</th>
            <th>Location</th>
            <th>Applied</th>
            <th>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {apps.map((a) => (
            <tr key={a.id}>
              <td>
                <button className="table-company" onClick={() => onOpen(a)}>
                  <span>
                    <strong>{a.company}</strong>
                    <small>{a.role}</small>
                  </span>
                </button>
              </td>
              <td>
                <span className={'badge ' + a.status.toLowerCase()}>
                  {a.status}
                </span>
              </td>
              <td>{a.location || '—'}</td>
              <td>
                {a.dateApplied
                  ? new Date(a.dateApplied + 'T12:00:00').toLocaleDateString(
                      undefined,
                      { month: 'short', day: 'numeric', year: 'numeric' },
                    )
                  : 'Not applied'}
              </td>
              <td>
                <button
                  className="icon-button"
                  aria-label={'Delete ' + a.company + ' application'}
                  onClick={() => onDelete(a)}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="empty">
      <BriefcaseBusiness size={28} />
      <h3>No applications found</h3>
      <p>Change the filters or add an application.</p>
    </div>
  );
}
