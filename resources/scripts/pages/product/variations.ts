import { ComponentType } from '@spinnakernordic/micro-components';
import Drawer from '@utils/drawer';

const Component: ComponentType = async (node) => {
  const drawerElement = document.querySelector<HTMLElement>('[data-drawer="variations"]');
  const drawer = Drawer(drawerElement);

  const openButton = node.querySelector<HTMLElement>('[data-open-variations]');
  openButton.addEventListener('click', () => {
    drawer.toggle();
  });

  const closeButtons = drawerElement.querySelectorAll<HTMLElement>('[data-close]');
  closeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      drawer.close();
    });
  });
};

export default Component;
