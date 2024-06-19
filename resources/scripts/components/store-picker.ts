import type { ComponentType } from '@spinnakernordic/micro-components';
import Modal from '@utils/modal';
import isbot from 'isbot';

const Component: ComponentType = async (node) => {
  isbot.extend(['x11']);
  if (isbot(navigator.userAgent)) return;

  const scrollableElements = node.querySelectorAll<HTMLElement>('[data-scrollable]');
  const { default: scrollLock } = await import(
    /* webpackChunkName: "scrolllock" */ 'modules/scrolllock'
  );
  const modal = Modal(node);

  const closeButton = node.querySelector('[data-close]');
  closeButton.addEventListener('click', () => modal.close());

  modal.on('open', () => scrollLock.lock([...scrollableElements]));
  modal.on('closed', () => scrollLock.unlock([...scrollableElements]));

  const openButtons = document.querySelectorAll('[data-load="store-picker"]');
  openButtons.forEach((button) => button.addEventListener('click', () => modal.open()));

  modal.open();
};

export default Component;
