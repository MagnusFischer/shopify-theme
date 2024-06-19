import type { ComponentType } from '@spinnakernordic/micro-components';
import { FreeMode, Navigation, Mousewheel } from 'swiper/modules';

const Component: ComponentType = async (node) => {
  const swiperElement = node.querySelector<HTMLElement>('[data-swiper]');

  if (swiperElement !== null) {
    const { default: Swiper } = await import(/* webpackChunkName: "swiper" */ 'modules/swiper');
    let currentSwiper = null;

    const setSwiper = () => {
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
    };

    import(/* webpackChunkName: "lodash" */ 'lodash-es/debounce').then(({ default: debounce }) => {
      window.addEventListener('resize', debounce(setSwiper, 100));
    });

    setSwiper();
  }
};

export default Component;
