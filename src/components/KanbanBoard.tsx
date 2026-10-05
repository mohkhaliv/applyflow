import { ApplicationCard, CardContent } from './ApplicationCard';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  pointerWithin,
  type CollisionDetection,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { GripVertical, Plus } from 'lucide-react';
import { normalizeOrders } from '../utils/applications';
import {
  STATUSES,
  type ApplicationStatus,
  type JobApplication,
} from '../types';

export function KanbanColumn({
  status,
  apps,
  onOpen,
  onAdd,
  highlighted = false,
}: {
  highlighted?: boolean;
  status: ApplicationStatus;
  apps: JobApplication[];
  onOpen: (a: JobApplication) => void;
  onAdd: (s: ApplicationStatus) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status, data: { status } });
  return (
    <section
      ref={setNodeRef}
      className={'kanban-column ' + (isOver || highlighted ? 'over' : '')}
      aria-label={status + ' column'}
    >
      <div className="column-heading">
        <span className={'status-dot ' + status.toLowerCase()} />
        <h3>{status}</h3>
        <span className="count">{apps.length}</span>
        <button
          className="icon-button"
          aria-label={'Add to ' + status}
          onClick={() => onAdd(status)}
        >
          <Plus size={16} />
        </button>
      </div>
      <SortableContext
        items={apps.map((a) => a.id)}
        strategy={verticalListSortingStrategy}
      >
        {apps.map((a) => (
          <ApplicationCard key={a.id} application={a} onOpen={onOpen} />
        ))}
      </SortableContext>
      {!apps.length && (
        <div className="column-empty">Drop an application here</div>
      )}
    </section>
  );
}
// Prefer the card under the pointer over its containing column.
const boardCollision: CollisionDetection = (args) => {
  const hits = pointerWithin(args);
  if (hits.length)
    return hits
      .filter((hit) => !STATUSES.includes(hit.id as ApplicationStatus))
      .slice(0, 1)
      .concat(
        hits.filter((hit) => STATUSES.includes(hit.id as ApplicationStatus)),
      )
      .slice(0, 1);
  return [];
};

export function KanbanBoard({
  apps,
  allApps,
  onMove,
  onOpen,
  onAdd,
  filtered,
}: {
  apps: JobApplication[];
  allApps: JobApplication[];
  onMove: (id: string, status: ApplicationStatus, index: number) => void;
  onOpen: (a: JobApplication) => void;
  onAdd: (s: ApplicationStatus) => void;
  filtered: boolean;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [preview, setPreview] = useState<JobApplication[] | null>(null);
  const working = preview ?? allApps;
  const visibleIds = new Set(apps.map((a) => a.id));
  const activeApplication = allApps.find((a) => a.id === activeId);
  const previewStatus = working.find((a) => a.id === activeId)?.status;
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function cancel() {
    setActiveId(null);
    setPreview(null);
  }
  function overColumn({ active, over }: DragOverEvent) {
    if (!over) return;
    setPreview((current) => {
      if (!current) return current;
      const source = current.find((a) => a.id === active.id);
      const target = current.find((a) => a.id === over.id);
      const status = target?.status ?? (over.id as ApplicationStatus);
      if (!source || !STATUSES.includes(status) || source.status === status)
        return current;
      const destination = current
        .filter((a) => a.status === status && a.id !== active.id)
        .sort((a, b) => a.order - b.order);
      const below =
        active.rect.current.translated &&
        active.rect.current.translated.top >
          over.rect.top + over.rect.height / 2;
      const index =
        filtered || !target
          ? destination.length
          : destination.findIndex((a) => a.id === target.id) + (below ? 1 : 0);
      // Preview only: no date, timestamps, or history are changed until the drop is committed.
      destination.splice(Math.max(0, index), 0, { ...source, status });
      return normalizeOrders([
        ...current.filter((a) => a.id !== source.id && a.status !== status),
        ...destination.map((a, order) => ({ ...a, order })),
      ]);
    });
  }
  function end({ active, over }: DragEndEvent) {
    const source = working.find((a) => a.id === active.id);
    const original = allApps.find((a) => a.id === active.id);
    const target = working.find((a) => a.id === over?.id);
    const status =
      target?.status ??
      (over && STATUSES.includes(over.id as ApplicationStatus)
        ? (over.id as ApplicationStatus)
        : source?.status);
    cancel();
    if (!over || !source || !original || !status) return;
    if (filtered && original.status === status) return;
    const index = filtered
      ? allApps.filter((a) => a.status === status && a.id !== source.id).length
      : (target?.order ??
        working.filter((a) => a.status === status && a.id !== source.id)
          .length);
    if (original.status === status && original.order === index) return;
    onMove(source.id, status, index);
  }
  return (
    <>
      <p className="board-help">
        {filtered
          ? 'Filtered view: move between columns; reordering is paused.'
          : 'Drag the handle to move a card.'}
      </p>
      <DndContext
        sensors={sensors}
        accessibility={{
          screenReaderInstructions: {
            draggable:
              'Drag with a mouse or touch. To change status using a keyboard, open application details and choose Edit application.',
          },
        }}
        collisionDetection={boardCollision}
        onDragStart={({ active }) => {
          setActiveId(String(active.id));
          setPreview(allApps);
        }}
        onDragOver={overColumn}
        onDragCancel={cancel}
        onDragEnd={end}
      >
        <div className="kanban-board">
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              highlighted={!!activeId && previewStatus === status}
              apps={working
                .filter((a) => visibleIds.has(a.id) && a.status === status)
                .sort((a, b) => a.order - b.order)}
              onOpen={onOpen}
              onAdd={onAdd}
            />
          ))}
        </div>
        {createPortal(
          <DragOverlay dropAnimation={null}>
            {activeApplication ? (
              <article
                className="application-card drag-overlay-card"
                aria-hidden="true"
              >
                <CardContent
                  application={activeApplication}
                  handle={<GripVertical size={18} />}
                />
              </article>
            ) : null}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </>
  );
}
