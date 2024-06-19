import type { ComponentType } from '@spinnakernordic/micro-components';
import addToCartEvent from '@utils/tracking';

const Component: ComponentType = async (node) => {
  const form = node.querySelector<HTMLFormElement>('form');
  const behavior = node.getAttribute('data-behavior');
  const statusDefault = node.querySelector<HTMLElement>('[data-default]');
  const statusLoading = node.querySelector<HTMLElement>('[data-loading]');
  const statusSuccess = node.querySelector<HTMLElement>('[data-success]');

  const updateStatus = () => {
    document.removeEventListener('cart:updated', updateStatus);
    statusLoading.hidden = true;
    statusSuccess.hidden = false;

    setTimeout(() => {
      statusSuccess.hidden = true;
      statusDefault.hidden = false;
    }, 2000);
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    document.dispatchEvent(new Event('close:predictive'));

    if (theme.cart_type === 'page') {
      addToCartEvent([
        {
          id: formData.get('id'),
          quantity: formData.has('quantity') ? formData.get('quantity') : 1,
        },
      ]);
      form.submit();
      return;
    }

    if (behavior === 'inline') {
      statusSuccess.hidden = true;
      statusDefault.hidden = true;
      statusLoading.hidden = false;
      document.addEventListener('cart:updated', updateStatus);
    } else {
      document.dispatchEvent(new Event('cart-drawer:open'));
    }

    const variant = {
      id: formData.get('id'),
      quantity: formData.has('quantity') ? formData.get('quantity') : 1,
    };

    document.dispatchEvent(new CustomEvent('cart:add:variant', { detail: variant }));
  });
};

export default Component;
