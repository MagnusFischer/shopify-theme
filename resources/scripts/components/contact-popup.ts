import type { ComponentType } from '@spinnakernordic/micro-components';
import Modal from '@utils/modal';

const Component: ComponentType = async (node) => {
  const modalElement = node.querySelector<HTMLElement>('[data-modal]');
  const modal = Modal(modalElement);
  const statusModalElement = node.querySelector<HTMLElement>('[data-status]');
  const statusModal = Modal(statusModalElement);
  const scrollableElements = node.querySelectorAll<HTMLElement>('[data-scrollable]');
  const { default: scrollLock } = await import(
    /* webpackChunkName: "scrolllock" */ 'modules/scrolllock'
  );

  const openButton = node.querySelector<HTMLElement>('[data-open]');
  openButton.addEventListener('click', () => modal.open());

  const closeButton = modalElement.querySelector<HTMLElement>('[data-close]');
  closeButton.addEventListener('click', () => modal.close());

  modal.on('open', () => scrollLock.lock([...scrollableElements]));
  modal.on('close', () => scrollLock.unlock([...scrollableElements]));

  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.get('contact_posted') === 'true') {
    statusModal.open();

    const closeStatus = statusModalElement.querySelector<HTMLElement>('[data-close]');
    closeStatus.addEventListener('click', () => statusModal.close());

    statusModal.on('closed', () => {
      const url = new URL(window.location.href);
      url.searchParams.delete('contact_posted');
      url.hash = '';
      window.history.pushState({}, '', url.toString());
    });
  }
};

export default Component;
