import type { ComponentType } from '@spinnakernordic/micro-components';
import { debounce } from 'lodash-es';

const Component: ComponentType = async (node) => {
  const megamenuParents = node.querySelectorAll<HTMLElement>('.megamenu__parent');

  const getMenuXPositions = () => {
    megamenuParents.forEach((link) => {
      const { x } = link.getBoundingClientRect();
      link.style.setProperty('--link-x-position', `${x}px`);
    });
  };

  getMenuXPositions();
  window.addEventListener('resize', debounce(getMenuXPositions, 500));
};

export default Component;
