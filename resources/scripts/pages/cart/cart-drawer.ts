import { ComponentType } from '@spinnakernordic/micro-components';
import Drawer from '@utils/drawer';
import Cart from '@utils/cart';
import { viewCartEvent } from '@utils/tracking';

const Component: ComponentType = async (node) => {
  const { default: scrollLock } = await import(
    /* webpackChunkName: "scrolllock" */ 'modules/scrolllock'
  );
  const lineItems = node.querySelector<HTMLElement>('[data-line-items]');
  const empty = node.querySelector<HTMLElement>('[data-cart-empty]');
  Cart(node, node.getAttribute('data-section'));
  const drawer = Drawer(node);

  const toggleButtons = document.querySelectorAll('[data-toggle="cart-drawer"]');
  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      drawer.toggle();
    });
  });

  document.addEventListener('cart-drawer:open', () => {
    drawer.open();
  });

  drawer.on('open', () => {
    scrollLock.lock([node, lineItems, empty]);
    viewCartEvent();
  });
  drawer.on('close', () => {
    scrollLock.unlock([node, lineItems, empty]);
  });

  if (node.hasAttribute('data-design-mode')) {
    document.addEventListener('shopify:section:select', (e) => {
      if (e.target === node.parentElement) {
        drawer.open();
      } else {
        drawer.close();
      }
    });
  }
};

export default Component;
