import type { ComponentType } from '@spinnakernordic/micro-components';

const Component: ComponentType = (node) => {
  const addToCartButton = document.querySelector<HTMLElement>('[data-add-to-cart]');
  const productInfo = document.querySelector<HTMLElement>('[data-product-info]');
  const scrollButton = node.querySelector<HTMLButtonElement>('button');

  scrollButton.addEventListener('click', () => {
    if (window.innerWidth < 1024) {
      productInfo.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      window.scrollTo({
        behavior: 'smooth',
        top: 0,
      });
    }
  });

  const headerHeight = parseInt(
    document.documentElement.style.getPropertyValue('--navigation-height').split('px')[0],
    10
  );

  const setVisible = () => {
    if (
      addToCartButton.getBoundingClientRect().top <=
      headerHeight - addToCartButton.clientHeight
    ) {
      node.setAttribute('data-open', 'true');
    } else {
      node.setAttribute('data-open', 'false');
    }
  };

  setVisible();

  window.addEventListener('scroll', () => {
    setVisible();
  });
};

export default Component;
