import { throttle } from 'lodash-es';

const setScrollbarWidth = () => {
  const scrollbarWidth = window.innerWidth - document.body.clientWidth;
  document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
};
setScrollbarWidth();
window.addEventListener('resize', throttle(setScrollbarWidth));
