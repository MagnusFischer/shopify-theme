import { ComponentType } from '@spinnakernordic/micro-components';

const Component: ComponentType = (node) => {
  const input = node.querySelector<HTMLInputElement>('[name="quantity"]');
  const prevValue = input.value;
  const incrementButton = node.querySelector('[data-increment]');
  const decrementButton = node.querySelector('[data-decrement]');

  incrementButton.addEventListener('click', () => {
    input.stepUp();
    input.dispatchEvent(new Event('change'));
  });

  decrementButton.addEventListener('click', () => {
    input.stepDown();
    input.dispatchEvent(new Event('change'));
  });

  input.addEventListener('change', (event: Event & { target: HTMLInputElement }) => {
    const data = {
      element: node.closest('li'),
      quantity: parseInt(event.target.value, 10),
      variant: event.target.getAttribute('data-line-key'),
    };

    document.dispatchEvent(new CustomEvent('cart:quantity:changed', { detail: data }));
  });

  document.addEventListener('cart:error', (event: CustomEvent) => {
    if (event.detail.variant !== input.getAttribute('data-line-key')) return;

    if (event.detail.error === 'too many items') {
      const lineItem = node.closest('li');
      lineItem.removeAttribute('aria-busy');

      const errorElement = lineItem.querySelector<HTMLElement>('.cart-drawer__line-item--error');
      errorElement.innerHTML = `<div><p>${theme.strings.cart.errors.exceeded_inventory_limit}</p></div>`;

      errorElement.setAttribute('data-active', 'true');
      errorElement.style.maxHeight = '100px';

      setTimeout(() => {
        errorElement.removeAttribute('data-active');
        errorElement.style.maxHeight = '0px';
      }, 2000);

      input.value = prevValue;
    }
  });
};

export default Component;
