import type { ComponentType } from '@spinnakernordic/micro-components';
import { Autoplay, EffectFade } from 'swiper/modules';

const Component: ComponentType = async (node) => {
  const { default: Swiper } = await import(/* webpackChunkName: "swiper" */ 'modules/swiper');
  const announcement = node.querySelector<HTMLElement>('[data-swiper]');
  const config = JSON.parse(node.querySelector<HTMLScriptElement>('[data-config]').innerText);
  let currentSwiper = null;

  const modules = [Autoplay];
  if (config.animation === 'crossfade') {
    modules.push(EffectFade);
  }

  const setSwiper = () => {
    if (window.innerWidth <= 1024) {
      if (currentSwiper === null) {
        currentSwiper = new Swiper(announcement, {
          allowTouchMove: false,
          ...(config.animation === 'crossfade' && {
            effect: 'fade',
            fadeEffect: {
              crossFade: true,
            },
          }),
          modules,
          loop: true,
          autoplay: {
            delay: config.timing,
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
