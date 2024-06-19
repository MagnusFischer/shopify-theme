import type { ComponentType } from '@spinnakernordic/micro-components';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';

const Component: ComponentType = async (node) => {
  const { default: Swiper } = await import(/* webpackChunkName: "swiper" */ 'modules/swiper');
  const swiperElement = node.querySelector<HTMLElement>('[data-swiper]');
  const swiperSlides = swiperElement.querySelectorAll<HTMLElement>('.swiper-slide');
  const config = JSON.parse(node.querySelector<HTMLScriptElement>('[data-config]').innerText);
  let customBullet = null;
  const modules = [];

  if (config.autoplay) {
    modules.push(Autoplay);
  }
  if (config.transition === 'crossfade') {
    modules.push(EffectFade);
  }
  if (config.pagination !== 'hidden') {
    modules.push(Pagination);
  }

  if (config.pagination === 'dots') {
    customBullet = (index, className) => `
        <button type="button" class="${className}" aria-label="${
      window.theme.strings.accessibility.slideshow.load_slide
    } ${index + 1} ${window.theme.strings.accessibility.slideshow.of} ${
      swiperSlides.length
    }"></button>`;
  }

  const swiper = new Swiper(swiperElement, {
    autoHeight: true,
    ...(config.transition === 'crossfade' && {
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
    }),
    modules,
    loop: true,
    ...(config.autoplay && {
      autoplay: {
        delay: config.timing * 1000,
      },
    }),
    ...(config.pagination !== 'hidden' && {
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        renderBullet: customBullet,
      },
    }),
  });
};

export default Component;
