import type { JobApplication } from '../types';
import { ExternalLink, MapPin } from 'lucide-react';
export function ApplicationDetail({
  application: a,
  onEdit,
  onDelete,
}: {
  application: JobApplication;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <>
      <div className="detail-heading">
        <div>
          <h3>{a.role}</h3>
          <p>{a.company}</p>
        </div>
      </div>
      <div className="detail-meta">
        <span>
          <MapPin size={15} />
          {a.location || 'Location not specified'}
        </span>
        <span>{a.employmentType}</span>
        <span className={'badge ' + a.status.toLowerCase()}>{a.status}</span>
      </div>
      <p className="muted">Applied: {a.dateApplied || 'Not yet applied'}</p>
      {a.jobUrl && (
        <a
          className="text-link"
          href={a.jobUrl}
          target="_blank"
          rel="noreferrer"
        >
          View job posting <ExternalLink size={14} />
        </a>
      )}
      <h3>Notes</h3>
      <p className="notes">{a.notes || 'No notes yet.'}</p>
      <h3>Status history</h3>
      <ol className="history">
        {a.statusHistory.map((h, i) => (
          <li key={i}>
            <strong>{h.status}</strong>
            <time>{new Date(h.enteredAt).toLocaleString()}</time>
          </li>
        ))}
      </ol>
      <div className="modal-actions">
        <button className="danger" onClick={onDelete}>
          Delete application
        </button>
        <button className="primary" onClick={onEdit}>
          Edit application
        </button>
      </div>
    </>
  );
}
