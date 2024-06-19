import type { ComponentType } from '@spinnakernordic/micro-components';
import Drawer from '@utils/drawer';

const Component: ComponentType = async (node) => {
  const { default: scrollLock } = await import(
    /* webpackChunkName: "scrolllock" */ 'modules/scrolllock'
  );

  const scrollableElements = node.querySelectorAll<HTMLElement>('[data-scrollable]');
  const drawer = Drawer(node);
  const timing = node.style.getPropertyValue('transition-duration');

  const subMenus = node.querySelectorAll<HTMLElement>('[data-menu]');
  const subMenuTriggers = node.querySelectorAll<HTMLElement>('[data-open-menu]');

  const toggles = document.querySelectorAll<HTMLElement>('[data-load="navigation-drawer"]');
  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => drawer.open());
  });
  subMenuTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      subMenus.forEach((menu) => {
        menu.hidden = true;
      });
      const selectedMenu = node.querySelector<HTMLElement>(
        `[data-menu="${trigger.getAttribute('data-open-menu')}"]`
      );
      if (selectedMenu !== null) selectedMenu.hidden = false;
    });
  });

  document.addEventListener('open:mobile:drawer', () => {
    node.style.setProperty('transition-duration', '0ms');
    drawer.open();
    drawer.on('opened', () => node.style.setProperty('transition-duration', timing));
  });

  const closeButton = node.querySelectorAll<HTMLElement>('[data-close]');
  closeButton.forEach((button) => {
    button.addEventListener('click', () => {
      drawer.close();
    });
  });

  drawer.on('open', () => {
    document
      .querySelectorAll<HTMLElement>('.shopify-section-group-header-group')
      .forEach((section) => {
        section.style.zIndex = '50';
      });
    scrollLock.lock([...scrollableElements]);
  });

  drawer.on('closed', () => {
    document
      .querySelectorAll<HTMLElement>('.shopify-section-group-header-group')
      .forEach((section) => {
        section.style.zIndex = '40';
      });
    subMenus.forEach((menu) => {
      menu.hidden = true;
    });
    scrollLock.unlock([...scrollableElements]);
  });

  drawer.open();
};

export default Component;
