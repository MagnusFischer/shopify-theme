import type { ComponentType } from '@spinnakernordic/micro-components';
import clear from '@utils/clear';
import { FreeMode, Navigation, Mousewheel } from 'swiper/modules';

const Component: ComponentType = async (node, { app }) => {
  const setSwiper = async () => {
    const swiperElement = node.querySelector<HTMLElement>('[data-swiper]');
    if (swiperElement !== null) {
      const { default: Swiper } = await import(/* webpackChunkName: "swiper" */ 'modules/swiper');
      let currentSwiper = null;

      if (window.innerWidth >= 1024) {
        if (currentSwiper === null) {
          currentSwiper = new Swiper(swiperElement, {
            modules: [FreeMode, Navigation, Mousewheel],
            freeMode: true,
            slidesPerView: 'auto',
            spaceBetween: 16,
            navigation: {
              nextEl: '.carousel--next',
              prevEl: '.carousel--prev',
            },
            mousewheel: {
              forceToAxis: true,
            },
          });
        }
      } else if (currentSwiper !== null) {
        currentSwiper.destroy(true, true);
        currentSwiper = null;
      }
    }
  };

  const { sectionId, productId, baseUrl, limit } = node.dataset;

  const fetchRecommendations = async () => {
    const params = new URLSearchParams({
      section_id: sectionId,
      product_id: productId,
      intent: 'related',
      limit,
    });

    const response = await fetch(`${baseUrl}?${params}`);

    if (response.status >= 200 && response.status < 300) {
      return response.text();
    }

    throw new Error(
      `Could not fetch product recommendations. Server responded with: ${response.status}`
    );
  };

  try {
    const response = await fetchRecommendations();

    const container = document.createElement('div');
    container.innerHTML = response;

    const relatedProducts = container.querySelectorAll('.product-item');

    if (relatedProducts.length > 0) {
      clear(node);
      node.insertAdjacentHTML('beforeend', container.querySelector('[data-component]').innerHTML);

      app.mount();
      container.remove();

      import(/* webpackChunkName: "lodash" */ 'lodash-es/debounce').then(
        ({ default: debounce }) => {
          window.addEventListener('resize', debounce(setSwiper, 100));
        }
      );

      setSwiper();
    } else {
      node.parentElement.remove();
    }
  } catch (e) {
    node.parentElement.remove();

    throw e;
  }
};

export default Component;
