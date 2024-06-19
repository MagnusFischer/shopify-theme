import { ComponentType } from '@spinnakernordic/micro-components';

const Component: ComponentType = async (node) => {
  const stockCounters = node.querySelectorAll<HTMLElement>('[data-variant-id]');

  document.addEventListener('product:variant:changed', (e: CustomEvent) => {
    stockCounters.forEach((counter) => {
      const counterVariantID = parseInt(counter.getAttribute('data-variant-id'), 10);
      counter.hidden = e.detail.id !== counterVariantID;
    });
  });
};

export default Component;
