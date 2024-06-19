import { ComponentType } from '@spinnakernordic/micro-components';
import formatMoney from '@utils/format-money';

const Component: ComponentType = (node) => {
  const progressBarElement = node.querySelector<HTMLElement>('[data-progress]');
  const progressTextElement = node.querySelector<HTMLElement>('[data-text]');

  document.addEventListener('cart:updated', (event: CustomEvent) => {
    const { total_price: totalPrice } = event.detail;
    const progress = Math.min(Math.max((totalPrice / theme.free_shipping_threshold) * 100, 0), 100);
    progressBarElement.style.width = `${progress}%`;

    if (progress === 100) {
      progressTextElement.innerText = theme.strings.cart.shipping.threshold_reached;
      progressBarElement.style.borderRadius = '99999px';
    } else {
      progressTextElement.innerText = theme.strings.cart.shipping.threshold_remaining.replace(
        '{{ amount }}',
        `${formatMoney(theme.free_shipping_threshold - totalPrice)}`
      );
      progressBarElement.style.borderTopRightRadius = '0px';
      progressBarElement.style.borderBottomRightRadius = '0px';
    }
  });
};

export default Component;
