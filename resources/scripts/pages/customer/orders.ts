import type { ComponentType } from '@spinnakernordic/micro-components';

const Component: ComponentType = (node) => {
  const inititalizeOrders = () => {
    const pagination = node.querySelector<HTMLElement>('[data-pagination]');

    if (pagination !== null) {
      const pageButtons = pagination.querySelectorAll('[data-page]');
      pageButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const pageURL = button.getAttribute('data-page');

          fetch(pageURL)
            .then((res) => res.text())
            .then((data) => {
              const response = new DOMParser().parseFromString(data, 'text/html');

              const currentOrderTable = node.querySelector<HTMLElement>('[data-orders]');
              const newOrderTable = response.querySelector<HTMLElement>('[data-orders]');
              currentOrderTable.replaceWith(newOrderTable);

              inititalizeOrders();
            });
        });
      });
    }
  };
  inititalizeOrders();
};

export default Component;
