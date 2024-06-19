import { ComponentType } from '@spinnakernordic/micro-components';

const Component: ComponentType = (node: HTMLTextAreaElement) => {
  const setOrderNote = () => {
    fetch(`${Shopify.routes.root}cart/update.js`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: node.value }),
      keepalive: true,
      // Allows to make sure the request is fired even when submitting the form
    });
  };

  import(/* webpackChunkName: "lodash" */ 'lodash-es/debounce').then(({ default: debounce }) => {
    node.addEventListener('input', debounce(setOrderNote, 500));
  });
};

export default Component;
