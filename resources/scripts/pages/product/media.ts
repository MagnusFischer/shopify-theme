import { ComponentType } from '@spinnakernordic/micro-components';

const Component: ComponentType = async (node) => {
  const mode = node.dataset.config;
  const thumbnails = node.querySelectorAll('[data-thumbnail]');
  let swiper = null;

  const setSwiper = async () => {
    if (mode === 'slider') {
      const { default: Swiper } = await import(/* webpackChunkName: "swiper" */ 'modules/swiper');
      swiper = new Swiper(node.querySelector<HTMLElement>('.swiper'), {
        slidesPerView: 'auto',
        autoHeight: true,
      });
    } else if (window.innerWidth <= 1024) {
      const { default: Swiper } = await import(/* webpackChunkName: "swiper" */ 'modules/swiper');
      swiper = new Swiper(node.querySelector<HTMLElement>('.swiper'), {
        slidesPerView: 'auto',
        autoHeight: true,
      });
    } else if (swiper !== null) {
      swiper.destroy(true, true);
      swiper = null;
    }

    if (swiper !== null) {
      thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener('click', () => {
          const index = parseInt(thumbnail.getAttribute('data-thumbnail'), 10);
          swiper.slideTo(index);
        });
      });

      let currentThumbnail = null;
      swiper.on('slideChange', (e) => {
        thumbnails.forEach((thumbnail) => thumbnail.removeAttribute('data-current'));
        currentThumbnail = node.querySelector<HTMLElement>(`[data-thumbnail="${e.activeIndex}"]`);
        currentThumbnail?.setAttribute('data-current', '');
        currentThumbnail?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      });

      swiper.on('transitionEnd', () => {
        currentThumbnail?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      });
    }
  };

  if (mode === 'waterfall') {
    import(/* webpackChunkName: "lodash" */ 'lodash-es/debounce').then(({ default: debounce }) => {
      window.addEventListener('resize', debounce(setSwiper, 100));
    });
  }

  setSwiper();
};

export default Component;
