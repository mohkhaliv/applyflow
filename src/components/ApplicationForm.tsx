import { useState, type FormEvent } from 'react';
import { STATUSES, type ApplicationInput, type JobApplication } from '../types';
import { validateApplication } from '../utils/applications';
export function ApplicationForm({
  application,
  onSave,
  onCancel,
}: {
  application?: JobApplication | ApplicationInput;
  onSave: (data: ApplicationInput) => void;
  onCancel: () => void;
}) {
  const [data, setData] = useState<ApplicationInput>(
    application ?? {
      company: '',
      role: '',
      location: '',
      employmentType: 'Full-time',
      status: 'Wishlist',
      dateApplied: '',
      jobUrl: '',
      notes: '',
    },
  );
  const [error, setError] = useState('');
  function submit(e: FormEvent) {
    e.preventDefault();
    const message = validateApplication(data);
    setError(message);
    if (!message) onSave(data);
  }
  function field(key: keyof ApplicationInput, value: string) {
    setData({ ...data, [key]: value });
  }
  return (
    <form onSubmit={submit} noValidate>
      <div className="form-grid">
        <label>
          Company *
          <input
            autoFocus
            value={data.company}
            onChange={(e) => field('company', e.target.value)}
            required
            placeholder="e.g. Linear"
          />
        </label>
        <label>
          Role *
          <input
            value={data.role}
            onChange={(e) => field('role', e.target.value)}
            required
            placeholder="e.g. Frontend Engineer"
          />
        </label>
        <label>
          Location
          <input
            value={data.location}
            onChange={(e) => field('location', e.target.value)}
            placeholder="City or Remote"
          />
        </label>
        <label>
          Employment type *
          <select
            value={data.employmentType}
            onChange={(e) => field('employmentType', e.target.value)}
          >
            {[
              'Full-time',
              'Part-time',
              'Contract',
              'Internship',
              'Temporary',
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Status *
          <select
            value={data.status}
            onChange={(e) => field('status', e.target.value)}
          >
            {STATUSES.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Applied date{data.status !== 'Wishlist' ? ' *' : ''}
          <input
            type="date"
            value={data.dateApplied ?? ''}
            onChange={(e) => field('dateApplied', e.target.value)}
            required={data.status !== 'Wishlist'}
          />
        </label>
        <label className="full">
          Job URL
          <input
            type="url"
            value={data.jobUrl ?? ''}
            onChange={(e) => field('jobUrl', e.target.value)}
            placeholder="https://…"
          />
        </label>
        <label className="full">
          Notes
          <textarea
            rows={4}
            value={data.notes ?? ''}
            onChange={(e) => field('notes', e.target.value)}
            placeholder="Contacts, next steps, and things to remember"
          />
        </label>
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="modal-actions">
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="primary" type="submit">
          Save application
        </button>
      </div>
    </form>
  );
}
