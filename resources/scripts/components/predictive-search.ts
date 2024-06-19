import type { ComponentType } from '@spinnakernordic/micro-components';
import clear from '@utils/clear';
import { hide as hideOverlay, show as showOverlay } from '@utils/overlay';
import repaint from '@utils/repaint';
import transitionEnd from '@utils/transition-end';
import { debounce } from 'lodash-es';

const Component: ComponentType = async (node) => {
  const { default: scrollLock } = await import(
    /* webpackChunkName: "scrolllock" */ 'modules/scrolllock'
  );

  const shopifySection = document.querySelector<HTMLElement>(
    `#shopify-section-${node.getAttribute('data-section')}`
  );
  const secondaryMenu = document.querySelector<HTMLElement>('.header__navigation--secondary-menu');
  const closeButton = node.querySelectorAll<HTMLElement>('[data-close]');

  const openSearch = document.querySelectorAll<HTMLElement>(
    `[data-load="${node.dataset.loadTarget}"]`
  );
  const desktopMenu = document.querySelector<HTMLElement>('.header__navigation--desktop-menu');

  const setTop = () => {
    shopifySection.style.setProperty(
      '--top-offset',
      `${secondaryMenu.getBoundingClientRect().top}px`
    );
  };

  setTop();
  window.addEventListener('scroll', () => setTop());

  const container = node.querySelector<HTMLElement>('.predictive-search__container');
  const form = node.querySelector<HTMLFormElement>('form');
  const fakeSearchInput = document.querySelector<HTMLInputElement>(
    `[data-load="${node.dataset.loadTarget}"]`
  );
  const searchInput = node.querySelector<HTMLInputElement>('[data-search-input]');
  const results = node.querySelector<HTMLElement>('[data-results]');

  form.addEventListener('reset', () => {
    fakeSearchInput.value = '';
    clear(results);
    searchInput.focus();
  });

  const openSearchModal = () => {
    setTimeout(() => {
      openSearch.forEach((element) => {
        element.parentElement.hidden = true;
      });
      document
        .querySelectorAll<HTMLElement>('.shopify-section-group-header-group')
        .forEach((section) => {
          section.style.zIndex = '50';
        });
      desktopMenu.hidden = true;
      shopifySection.setAttribute('data-open', '');
      results.hidden = false;
      node.hidden = false;
      repaint(container);
      container.setAttribute('data-active', 'true');
      searchInput.focus();
      showOverlay();
    }, 0);

    const scrollableContainers = node.querySelectorAll<HTMLElement>('[data-scrollable]');
    scrollLock.lock([...scrollableContainers]);
  };
  openSearchModal();
  openSearch.forEach((button) => {
    button.addEventListener(
      'click',
      () => {
        openSearchModal();
      },
      { passive: true }
    );
  });

  document.addEventListener('open:predictive', () => {});

  const attachListeners = () => {
    const menuItems = node.querySelectorAll<HTMLElement>('[data-menu-item]');
    const pages = node.querySelectorAll<HTMLElement>('[data-page]');
    menuItems.forEach((item) => {
      item.addEventListener('click', () => {
        menuItems.forEach((menuItem) => menuItem.removeAttribute('data-current'));
        item.setAttribute('data-current', '');
        pages.forEach((page) => page.removeAttribute('data-current'));

        node
          .querySelector(`[data-page="${item.getAttribute('data-menu-item')}"]`)
          .setAttribute('data-current', '');
      });
    });

    const scrollableContainers = node.querySelectorAll<HTMLElement>('[data-scrollable]');
    scrollLock.lock([...scrollableContainers]);

    document.dispatchEvent(new Event('app:remount'));
  };

  let step = 1;
  let currentProgress = 0;
  let interval: ReturnType<typeof setInterval>;
  let progress = 0;
  const progressBar = node.querySelector<HTMLElement>('.predictive-search__progress');

  const handleSearchInput = async () => {
    if (searchInput.value.trim().length <= 0) {
      fakeSearchInput.value = '';
      clear(results);
      return;
    }
    currentProgress = 0;
    progress = 0;
    fakeSearchInput.value = searchInput.value;
    progressBar.style.width = '0%';
    progressBar.setAttribute('data-active', 'true');
    progressBar.setAttribute('aria-valuenow', `0`);
    interval = setInterval(() => {
      currentProgress += step;
      progress = Math.round((Math.atan(currentProgress) / (Math.PI / 2)) * 100 * 1000) / 1000;
      progressBar.style.width = `${progress}%`;
      progressBar.setAttribute('aria-valuenow', `${progress}`);
      if (progress >= 100) {
        clearInterval(interval);
      } else if (progress >= 70) {
        step = 0.1;
      }
    }, 100);

    await fetch(
      `/search/suggest?q=${searchInput.value.trim()}&sections=${node.getAttribute(
        'data-section'
      )}&resources[options][fields]=title,product_type,variants.title,variants.sku,body`
    )
      .then((response) => response.json())
      .then((data) => {
        const resultsMarkup = new DOMParser()
          .parseFromString(data[node.getAttribute('data-section')], 'text/html')
          .querySelector('[data-results]').innerHTML;
        results.innerHTML = resultsMarkup;
        attachListeners();

        progressBar.style.width = `100%`;
        progressBar.setAttribute('aria-valuenow', `100`);
        clearInterval(interval);

        setTimeout(() => {
          progressBar.style.width = '0%';
          progressBar.setAttribute('aria-valuenow', `0`);
        }, 600);

        setTimeout(() => {
          progressBar.setAttribute('data-active', 'false');
        }, 300);
      });
  };

  searchInput.addEventListener('input', debounce(handleSearchInput, 300));

  const closePredictiveSearch = () => {
    scrollLock.clearBodyLocks();
    container.setAttribute('data-active', 'false');
    results.hidden = true;
    if (window.innerWidth <= 1024) {
      const mobileNavigationDrawer = document.querySelector<HTMLElement>(
        '[data-drawer="navigation-drawer"]'
      );
      if (mobileNavigationDrawer.classList.contains('drawer--active')) {
        setTimeout(() => {
          document.dispatchEvent(new Event('open:mobile:drawer'));
        }, 0);
      }
    }
    transitionEnd(
      searchInput.parentElement,
      () => {
        shopifySection.removeAttribute('data-open');
        node.hidden = true;
        document
          .querySelectorAll<HTMLElement>('.shopify-section-group-header-group')
          .forEach((section) => {
            section.style.zIndex = window.innerWidth <= 1024 ? '50' : '40';
          });
        openSearch.forEach((element) => {
          element.parentElement.hidden = false;
        });
        desktopMenu.hidden = false;
      },
      { once: true }
    );

    hideOverlay();
  };

  closeButton.forEach((button) => {
    button.addEventListener('click', () => closePredictiveSearch());
  });

  document.addEventListener('close:predictive', () => closePredictiveSearch());

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closePredictiveSearch();
    }
  });

  document.addEventListener('click', (event: MouseEvent | TouchEvent): void => {
    if (!(event.target instanceof Node)) {
      return;
    }
    if (!node.contains(event.target) && container.getAttribute('data-active') === 'true') {
      event.stopPropagation();
      closePredictiveSearch();
    }
  });
};

export default Component;
