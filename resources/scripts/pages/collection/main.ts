import { ComponentType } from '@spinnakernordic/micro-components';
import filter from '@utils/filter';
import menu from '@utils/menu';

const Component: ComponentType = (node) => {
  const filterMenus = node.querySelectorAll<HTMLButtonElement>('[data-filter-menu]');
  filterMenus.forEach((filterMenu) => menu(filterMenu));

  filter(node.querySelector<HTMLElement>('[data-product-grid]').dataset.sectionId);

  const setScrollTop = () => {
    const productGrid = node.querySelector<HTMLElement>('[data-product-grid]');
    const productGridPosition = productGrid.getBoundingClientRect();
    const filterHeight = node
      .querySelector('[data-component="filter"]')
      .getBoundingClientRect().height;
    const navigationHeight = parseInt(
      document.documentElement.style.getPropertyValue('--navigation-height'),
      10
    );
    productGrid.style.scrollMarginTop = `${filterHeight + navigationHeight}px`;
    if (filterHeight + navigationHeight > productGridPosition.top) {
      productGrid.scrollIntoView();
    }
  };

  const bindPagination = () => {
    const productGridElement = node.querySelector('[data-products]');
    const paginationElement = node.querySelector('[data-pagination]');
    const paginateNextButton = node.querySelector<HTMLAnchorElement>('[data-paginate-next]');

    paginateNextButton?.addEventListener('click', async (e) => {
      e.preventDefault();

      paginateNextButton.innerHTML = `<span>${window.theme.strings.collection.pagination.loading}</span>`;

      const fetchURL = new URL(paginateNextButton.href);
      fetchURL.searchParams.append('sections', node.id);

      const data = await fetch(
        `${window.location.pathname}?${fetchURL.searchParams.toString()}`
      ).then((res) => res.json());

      const section = document.createElement('div');
      section.insertAdjacentHTML('beforeend', data[node.id]);

      const productGridHTML = section.querySelector('[data-products]').innerHTML;
      productGridElement.insertAdjacentHTML('beforeend', productGridHTML);

      const paginationHTML = section.querySelector('[data-pagination]').innerHTML;
      paginationElement.innerHTML = paginationHTML;

      fetchURL.searchParams.delete('sections');
      window.history.pushState({}, '', fetchURL);
      bindPagination();

      document.dispatchEvent(new Event('app:remount'));
    });
  };

  bindPagination();

  document.addEventListener('collection:updated', () => {
    bindPagination();
    setScrollTop();
  });
};

export default Component;
