import type { ComponentType } from '@spinnakernordic/micro-components';
import Drawer from '@utils/drawer';

const Component: ComponentType = (node) => {
  const addButton = node.querySelector<HTMLButtonElement>('[data-add-address]');
  const drawerElement = node.querySelector<HTMLElement>('[data-address-drawer]');
  const drawerClose = drawerElement.querySelector<HTMLFormElement>('[data-close]');
  const drawer = Drawer(drawerElement);
  drawerClose.addEventListener('click', () => drawer.close());

  document.addEventListener('customer:address:edit', (event: CustomEvent) => {
    const editAddressForm = node.querySelector<HTMLElement>(`#EditAddress_${event.detail.formId}`);
    if (editAddressForm !== undefined) editAddressForm.hidden = false;

    drawer.open();
  });

  document.addEventListener('customer:address:edited', () => {
    document.dispatchEvent(new Event('app:remount'));
    drawer.close();
  });

  document.addEventListener('customer:address:created', () => {
    document.dispatchEvent(new Event('app:remount'));
    drawer.close();
  });

  addButton.addEventListener('click', () => {
    node.querySelector<HTMLElement>(`#NewAddress`).hidden = false;
    drawer.open();
  });

  drawer.on('closed', () => document.dispatchEvent(new Event('customer:address:closed')));
};

export default Component;
