import type { ComponentType } from '@spinnakernordic/micro-components';
import { Autoplay, Pagination } from 'swiper/modules';

const Component: ComponentType = async (node) => {
  const { default: Swiper } = await import(/* webpackChunkName: "swiper" */ 'modules/swiper');
  const swiperSlides = node.querySelectorAll<HTMLElement>('.swiper-slide');
  let currentSwiper = null;

  const customBullet = (index, className) => `
      <button type="button" class="${className}" aria-label="${
    window.theme.strings.accessibility.slideshow.load_slide
  } ${index + 1} ${window.theme.strings.accessibility.slideshow.of} ${
    swiperSlides.length
  }"></button>`;

  const setSwiper = () => {
    if (window.innerWidth <= 1024) {
      if (currentSwiper === null) {
        currentSwiper = new Swiper(node, {
          modules: [Autoplay, Pagination],
          slidesPerView: 'auto',
          spaceBetween: 24,
          loop: true,
          autoplay: {
            delay: 2000,
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: customBullet,
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
};

export default Component;
