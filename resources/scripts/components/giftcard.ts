import type { ComponentType } from '@spinnakernordic/micro-components';
import modal from '@utils/modal';

const Component: ComponentType = async (node) => {
  const qrCodeModalElement = node.querySelector<HTMLElement>('[data-qr-code-modal]');
  const qrCodeModal = modal(qrCodeModalElement);
  const openQRModal = node.querySelector<HTMLElement>('[data-show-qr-code]');
  openQRModal.addEventListener('click', () => {
    qrCodeModal.open();
  });
  const copyButton = node.querySelector<HTMLElement>('[data-copy]');
  const copyStatus = node.querySelector<HTMLElement>('[data-status]');

  copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(copyButton.getAttribute('data-copy')).then(() => {
      copyStatus.innerHTML = 'Code copied to clipboard!';

      setTimeout(() => {
        copyStatus.innerHTML = 'Copy gift card code';
      }, 2500);
    });
  });
};

export default Component;
