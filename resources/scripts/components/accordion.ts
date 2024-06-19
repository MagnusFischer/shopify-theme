import type { ComponentType } from '@spinnakernordic/micro-components';

const Component: ComponentType = (node) => {
  const toggle = node.querySelector<HTMLElement>('.accordion__toggle');
  const contentWrapper = node.querySelector<HTMLElement>('.accordion__content');
  const content = node.querySelector<HTMLElement>('[data-content]');

  const setMaxHeight = () => {
    let contentHeight = content.offsetHeight;
    contentHeight += parseInt(window.getComputedStyle(content).getPropertyValue('margin-top'), 10);
    contentHeight += parseInt(
      window.getComputedStyle(content).getPropertyValue('margin-bottom'),
      10
    );

    if (node.hasAttribute('open')) {
      contentWrapper.style.maxHeight = `${contentHeight}px`;
    } else {
      contentWrapper.style.maxHeight = `0px`;
    }
  };

  setMaxHeight();

  toggle.addEventListener('click', () => {
    node.toggleAttribute('open');
    setMaxHeight();
  });
};

export default Component;
