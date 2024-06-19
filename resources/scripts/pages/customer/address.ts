import type { ComponentType } from '@spinnakernordic/micro-components';

const Component: ComponentType = (node) => {
  const deleteButton = node.querySelector<HTMLButtonElement>('[data-delete]');
  const editButton = node.querySelector<HTMLButtonElement>('[data-edit]');

  deleteButton.addEventListener('click', () => {
    /* eslint-disable-next-line */
    if (confirm(deleteButton.getAttribute('data-confirm'))) {
      fetch(deleteButton.getAttribute('data-target'), {
        method: 'delete',
      }).then(() => {
        node.remove();
      });
    }
  });

  editButton.addEventListener('click', () => {
    document.dispatchEvent(
      new CustomEvent('customer:address:edit', {
        detail: { formId: editButton.getAttribute('data-edit') },
      })
    );
  });
};

export default Component;
