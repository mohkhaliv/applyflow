import type { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MapPin } from 'lucide-react';
import type { JobApplication } from '../types';
export function CardContent({
  application: a,
  onOpen,
  handle,
}: {
  application: JobApplication;
  onOpen?: (a: JobApplication) => void;
  handle?: ReactNode;
}) {
  const title = (
    <>
      <strong>{a.company}</strong>
      <span>{a.role}</span>
    </>
  );
  return (
    <>
      <div className="card-summary">
        {onOpen ? (
          <button className="card-open" onClick={() => onOpen(a)}>
            {title}
          </button>
        ) : (
          <div className="card-open">{title}</div>
        )}
        {handle}
      </div>
      <p className="card-location">
        <MapPin size={13} />
        {a.location || 'Not specified'}
      </p>
      <div className="card-bottom">
        <span>{a.employmentType}</span>
        <time>
          {a.dateApplied
            ? new Date(a.dateApplied + 'T12:00:00').toLocaleDateString(
                undefined,
                { month: 'short', day: 'numeric' },
              )
            : 'Not applied'}
        </time>
      </div>
    </>
  );
}
export function ApplicationCard({
  application: a,
  onOpen,
}: {
  application: JobApplication;
  onOpen: (a: JobApplication) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: a.id, data: { status: a.status } });
  // Leave a placeholder in the list; DragOverlay follows the pointer outside the scroll container.
  return (
    <article
      ref={setNodeRef}
      style={{
        transform: isDragging ? undefined : CSS.Transform.toString(transform),
        transition: isDragging ? undefined : transition,
      }}
      className={'application-card ' + (isDragging ? 'dragging' : '')}
    >
      <CardContent
        application={a}
        onOpen={onOpen}
        handle={
          <button
            className="drag-handle"
            aria-label={'Move ' + a.company + ' application'}
            {...attributes}
            {...listeners}
          >
            <GripVertical size={18} />
          </button>
        }
      />
    </article>
  );
}
