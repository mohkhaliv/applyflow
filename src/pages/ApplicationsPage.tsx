import { useApplications } from '../state/ApplicationsProvider';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { ApplicationTable } from '../components/ApplicationTable';
export function ApplicationsPage() {
  const { apps, visible, filters, setFilters, view, requestDelete } =
    useApplications();
  return (
    <>
      <SearchFilterBar filters={filters} onChange={setFilters} />
      <section className="panel">
        <div className="panel-title">
          <h2>
            Applications <span className="count">{visible.length}</span>
          </h2>
          <span>{apps.length} total tracked</span>
        </div>
        <ApplicationTable
          apps={visible}
          onOpen={view}
          onDelete={requestDelete}
        />
      </section>
    </>
  );
}
