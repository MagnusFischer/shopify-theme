import { ComponentType } from '@spinnakernordic/micro-components';

const Component: ComponentType = (node) => {
  const input = node.querySelector<HTMLInputElement>('[name="quantity"]');
  const incrementButton = node.querySelector('[data-increment]');
  const decrementButton = node.querySelector('[data-decrement]');

  incrementButton.addEventListener('click', () => {
    input.stepUp();
  });

  decrementButton.addEventListener('click', () => {
    input.stepDown();
  });
};

export default Component;
