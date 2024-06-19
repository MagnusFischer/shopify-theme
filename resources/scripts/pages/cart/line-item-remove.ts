import { ComponentType } from '@spinnakernordic/micro-components';

const Component: ComponentType = (node) => {
  node.addEventListener('click', () => {
    const data = {
      element: node.closest('li'),
      quantity: 0,
      variant: node.getAttribute('data-line-key'),
    };

    document.dispatchEvent(new CustomEvent('cart:quantity:changed', { detail: data }));
  });
};

export default Component;
