import type { ComponentType } from '@spinnakernordic/micro-components';
import Modal from '@utils/modal';

const Component: ComponentType = async (node) => {
  const { metaStores } = JSON.parse(
    node.querySelector<HTMLElement>('[data-meta-stores]').innerHTML
  );
  const modal = Modal(node);

  const openStorePicker = node.querySelector<HTMLElement>('[data-load="store-picker"]');
  openStorePicker.addEventListener('click', () => modal.close());

  const showPopup = (currentStore, suggestionStore) => {
    const currentStoreElement = node.querySelector<HTMLLIElement>('[data-current]');
    const suggestionStoreElement = node.querySelector<HTMLLIElement>('[data-suggestion]');
    const regionNames = new Intl.DisplayNames([window.Shopify.locale], { type: 'region' });

    currentStoreElement.insertAdjacentHTML(
      'beforeend',
      `
      <button data-close class="grid place-items-center">
        <img 
          src="//cdn.shopify.com/static/images/flags/${currentStore.country_code.toLowerCase()}.svg?width=120" 
          srcset="//cdn.shopify.com/static/images/flags/${currentStore.country_code.toLowerCase()}.svg?width=120" 
          width="120" 
          height="90" 
          loading="lazy"
        >
        <p class="mt-3 font-bold">${regionNames.of(currentStore.country_code)}</p>
      </button>
    `
    );

    suggestionStoreElement.insertAdjacentHTML(
      'beforeend',
      `
      <a href="${suggestionStore.url}" class="grid place-items-center">
        <img 
          src="//cdn.shopify.com/static/images/flags/${suggestionStore.country_code.toLowerCase()}.svg?width=120"
          srcset="//cdn.shopify.com/static/images/flags/${suggestionStore.country_code.toLowerCase()}.svg?width=120" 
          width="120" 
          height="90" 
          loading="lazy"
        >
        <p class="mt-3 font-bold">${regionNames.of(suggestionStore.country_code)}</p>
      </a>
    `
    );

    currentStoreElement
      .querySelector('[data-close]')
      .addEventListener('click', () => modal.close());

    modal.open();
  };

  const getLocaleData = async () => {
    const request = await fetch(
      `${window.Shopify.routes.root}browsing_context_suggestions.json` +
        `?country[enabled]=true` +
        `&country[exclude]=${window.Shopify.country}`
    ).then((r) => r.json());

    return request;
  };

  const getLocalization = async () => {
    const {
      detected_values: {
        country: { handle: visitorCountryISO },
      },
    } = await getLocaleData();

    const { country: currentCountryIso } = window.Shopify;
    const internationalStore = metaStores.find((store) => store.primary);
    const currentStore = metaStores.find((store) => store.country_code === currentCountryIso);
    const storeSuggestion = metaStores.find((store) => store.country_code === visitorCountryISO);
    window.sessionStorage.setItem('shop-switcher', 'true');

    if (currentStore === undefined) return;

    if (storeSuggestion !== undefined) {
      // We found a shop that matches the visitors country
      if (storeSuggestion.country_code !== currentCountryIso) {
        showPopup(currentStore, storeSuggestion);
      }
    } else if (currentStore !== internationalStore) {
      // Check if visitor is on the international store
      showPopup(currentStore, internationalStore);
    }
  };

  if (!window.sessionStorage.getItem('shop-switcher')) {
    getLocalization();
  }
};

export default Component;
