import { useApplications } from '../state/ApplicationsProvider';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { KanbanBoard } from '../components/KanbanBoard';
export function BoardPage() {
  const { apps, visible, filters, setFilters, move, view, add } =
    useApplications();
  return (
    <>
      <SearchFilterBar filters={filters} onChange={setFilters} board />
      <KanbanBoard
        apps={visible}
        allApps={apps}
        onMove={move}
        onOpen={view}
        onAdd={add}
        filtered={!!filters.search.trim() || filters.status !== 'all'}
      />
    </>
  );
}
