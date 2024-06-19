import type { ComponentType } from '@spinnakernordic/micro-components';
import drawer from '@utils/drawer';

const Component: ComponentType = async (node: HTMLFormElement) => {
  const scrollableElements = node.querySelectorAll<HTMLElement>('[data-scrollable]');
  const { default: scrollLock } = await import(
    /* webpackChunkName: "scrolllock" */ 'modules/scrolllock'
  );
  const Drawer = drawer(node);

  Drawer.on('open', () => scrollLock.lock([...scrollableElements]));
  Drawer.on('closed', () => scrollLock.unlock([...scrollableElements]));

  node
    .querySelectorAll('[data-close]')
    .forEach((closeButton) => closeButton.addEventListener('click', () => Drawer.close()));

  document
    .querySelectorAll(`[data-open="${node.dataset.drawer}"]`)
    .forEach((trigger) => trigger.addEventListener('click', () => Drawer.open()));
};

export default Component;
