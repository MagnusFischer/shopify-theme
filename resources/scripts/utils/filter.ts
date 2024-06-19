import { debounce } from 'lodash-es';

class Filter {
  filterData: any[];

  sectionID: string;

  latestHTML: null | Document;

  filterCategories: NodeListOf<HTMLElement>;

  totalFilterCounters: NodeListOf<HTMLElement>;

  constructor(sectionID: string) {
    this.filterData = [];
    this.sectionID = sectionID;
    this.latestHTML = null;
    this.filterCategories = document.querySelectorAll<HTMLElement>('[data-filter-category]');
    this.totalFilterCounters = document.querySelectorAll<HTMLElement>('[data-filter-total]');
    this.addEventListeners();

    document
      .querySelectorAll<HTMLInputElement>('input[type="radio"]')
      .forEach((radio) => radio.addEventListener('input', (event) => this.onFormSubmit(event)));
  }

  addEventListeners() {
    const checkboxInputs = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    const rangeInputs = document.querySelectorAll<HTMLInputElement>('input[type="range"]');
    const textInputs = document.querySelectorAll<HTMLInputElement>('input[type="text"]');
    const removeFilterButtons =
      document.querySelectorAll<HTMLButtonElement>('[data-remove-filter]');

    checkboxInputs.forEach((checkbox) =>
      checkbox.addEventListener('input', (event) => this.onFormSubmit(event))
    );
    rangeInputs.forEach((range) =>
      range.addEventListener('change', (event) => this.onFormSubmit(event))
    );
    textInputs.forEach((text) =>
      text.addEventListener(
        'input',
        debounce((event) => this.onFormSubmit(event), 500)
      )
    );
    removeFilterButtons.forEach((removeButton) => {
      removeButton.addEventListener('click', (event) => {
        const targetElement = event.currentTarget as HTMLElement;
        const url =
          targetElement.dataset.removeFilter.indexOf('?') === -1
            ? ''
            : targetElement.dataset.removeFilter.slice(
                targetElement.dataset.removeFilter.indexOf('?') + 1
              );
        this.renderPage(url);
      });
    });

    document.dispatchEvent(new Event('app:remount'));
  }

  renderProductsCount() {
    const resultsCounters = document.querySelectorAll<HTMLElement>('[data-total-results]');

    for (let i = 0; i < resultsCounters.length; i += 1) {
      const counter = resultsCounters[i];
      counter.innerHTML = this.latestHTML.querySelector(`[data-total-results]`).innerHTML;
    }
  }

  renderFilters() {
    this.filterCategories.forEach((currentFilterCategory) => {
      const currentFilterList =
        currentFilterCategory.querySelector<HTMLElement>('[data-filter-list]');
      const filterID = currentFilterCategory.dataset.filterCategory;
      const newFilterCategory = this.latestHTML.querySelector(
        `[data-filter-category="${filterID}"]`
      );
      const newFilterList = newFilterCategory.querySelector('[data-filter-list]');
      const counterElement = currentFilterCategory.querySelector(`[data-count]`);

      currentFilterList.innerHTML = newFilterList.innerHTML;
      counterElement?.replaceWith(newFilterCategory.querySelector(`[data-count]`));
    });

    const newTotal = this.latestHTML.querySelector('[data-filter-total]');

    this.totalFilterCounters.forEach((totalFilterCount) => {
      totalFilterCount.replaceWith(newTotal);
    });

    this.totalFilterCounters = document.querySelectorAll<HTMLElement>('[data-filter-total]');

    document
      .querySelector('[data-active-filters]')
      .replaceWith(this.latestHTML.querySelector('[data-active-filters]'));
  }

  renderProductGridContainer() {
    document.querySelector('[data-product-grid]').innerHTML =
      this.latestHTML.querySelector('[data-product-grid]').innerHTML;
    document.dispatchEvent(new Event('collection:updated'));
  }

  renderPage(filterParams: string) {
    const url = `${window.location.pathname}?section_id=${this.sectionID}&${filterParams}`;
    const filterDataUrl = (element) => element.url === url;

    if (this.filterData.some(filterDataUrl)) {
      this.getFromCache(filterDataUrl);
    } else {
      this.getFromFetch(url);
    }

    window.history.pushState(
      { filterParams },
      '',
      `${window.location.pathname}${filterParams && '?'.concat(filterParams)}`
    );
  }

  getFromFetch(url: string) {
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        const html = responseText;
        this.latestHTML = new DOMParser().parseFromString(html, 'text/html');
        this.filterData = [...this.filterData, { html, url }];
        this.renderProductGridContainer();
        this.renderFilters();
        this.renderProductsCount();
        this.addEventListeners();
      });
  }

  getFromCache(filterDataUrl) {
    const { html } = this.filterData.find(filterDataUrl);
    this.latestHTML = new DOMParser().parseFromString(html, 'text/html');
    this.renderProductGridContainer();
    this.renderFilters();
    this.renderProductsCount();
    this.addEventListeners();
  }

  onFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target.closest('form') as HTMLFormElement);
    const filterParams = new URLSearchParams(formData as any).toString();
    this.renderPage(filterParams);
  }
}

export default (sectionID: string) => new Filter(sectionID);
