import { ApplicationForm } from './ApplicationForm';
import { ApplicationDetail } from './ApplicationDetail';
import { Modal } from './Modal';
import { useApplications } from '../state/ApplicationsProvider';

export function ApplicationDialogs() {
  const {
    form,
    detail,
    deleting,
    save,
    edit,
    closeForm,
    closeDetail,
    requestDelete,
    cancelDelete,
    confirmDelete,
  } = useApplications();
  return (
    <>
      {form && (
        <Modal
          title={form.id ? 'Edit application' : 'Add application'}
          onClose={closeForm}
        >
          <ApplicationForm
            application={form.input}
            onSave={save}
            onCancel={closeForm}
          />
        </Modal>
      )}
      {detail && !form && !deleting && (
        <Modal title="Application details" onClose={closeDetail}>
          <ApplicationDetail
            application={detail}
            onEdit={() => edit(detail)}
            onDelete={() => requestDelete(detail)}
          />
        </Modal>
      )}
      {deleting && (
        <Modal title="Delete application?" onClose={cancelDelete}>
          <p>
            Remove <strong>{deleting.role}</strong> at{' '}
            <strong>{deleting.company}</strong>? Its notes and status history
            will also be deleted. This cannot be undone.
          </p>
          <div className="modal-actions">
            <button onClick={cancelDelete}>Cancel</button>
            <button className="danger solid" onClick={confirmDelete}>
              Delete application
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
