import type { ComponentType } from '@spinnakernordic/micro-components';
import clear from '@utils/clear';

const Component: ComponentType = async (node) => {
  const config = JSON.parse(node.querySelector('[data-stores]').innerHTML);
  const { stores } = config;
  let storeFilter = '';

  const countryInput = node.querySelector<HTMLSelectElement>('[data-country]');
  const cityTextInput = node.querySelector<HTMLInputElement>('[data-city]');
  const filterButtons = node.querySelectorAll<HTMLElement>('[data-filter]');
  const storeView = node.querySelector<HTMLElement>('[data-store-view]');

  const regionNames = new Intl.DisplayNames([window.Shopify.locale], { type: 'region' });
  const allUniqueCountries = [
    ...new Set(
      stores
        .flatMap((entry) => (entry.country_code ? entry.country_code.trim() : null))
        .filter((n) => n)
    ),
  ].sort((a: string, b: string) => regionNames.of(a).localeCompare(regionNames.of(b)));

  const renderCountries = () => {
    clear(countryInput.querySelector('optgroup'));
    allUniqueCountries.forEach((country_code: string) => {
      countryInput.querySelector('optgroup').insertAdjacentHTML(
        'beforeend',
        `
        <option value="${country_code}" ${
          country_code.toLocaleLowerCase() === window.Shopify.country.toLocaleLowerCase()
            ? 'selected'
            : ''
        }>${regionNames.of(country_code)}</option>
      `
      );
    });
  };

  const renderFilteredView = ({
    country,
    searchTerms,
    filter,
  }: {
    filter: string;
    country: string;
    searchTerms: string;
  }) => {
    let filteredStores = [];

    if (country === 'global') {
      allUniqueCountries.forEach((uniqueCountry) => {
        filteredStores.push({
          country_code: uniqueCountry,
          stores: stores.filter((store) => store.country_code === uniqueCountry),
        });
      });
    } else {
      filteredStores = [
        { country_code: country, stores: stores.filter((store) => store.country_code === country) },
      ];
    }

    if (searchTerms !== '') {
      filteredStores = [];

      if (country === 'global') {
        allUniqueCountries.forEach((uniqueCountry) => {
          filteredStores.push({
            country_code: uniqueCountry,
            stores: stores.filter((store) => {
              if (store.country_code === uniqueCountry)
                return (
                  store.zipcode?.toLowerCase().startsWith(searchTerms.toLowerCase()) ||
                  store.city?.toLowerCase().startsWith(searchTerms.toLowerCase())
                );
              return false;
            }),
          });
        });
      } else {
        filteredStores.push({
          country_code: country,
          stores: stores.filter((store) => {
            if (store.country_code === country)
              return (
                store.zipcode?.toLowerCase().startsWith(searchTerms.toLowerCase()) ||
                store.city?.toLowerCase().startsWith(searchTerms.toLowerCase())
              );
            return false;
          }),
        });
      }
    }

    if (filter !== '') {
      switch (filter) {
        case 'online':
          filteredStores.forEach((filteredStore) => {
            filteredStore.stores = filteredStore.stores.filter((store) => store.website);
          });
          break;
        case 'offline':
          filteredStores.forEach((filteredStore) => {
            filteredStore.stores = filteredStore.stores.filter((store) => store.address);
          });
          break;
        default:
          break;
      }
    }

    clear(storeView);
    filteredStores.forEach((store) => {
      if (store.stores.length <= 0) return;

      const storeHTML = document.createElement('div');

      storeHTML.insertAdjacentHTML(
        'beforeend',
        `
          <div class="flex items-center gap-2 sticky top-[var(--sticky-offset,0)] bg-primary-bg py-4">
            <img src="//cdn.shopify.com/static/images/flags/${store.country_code.toLowerCase()}.svg?width=32" width="32" height="24">
            <p>
              ${regionNames.of(store.country_code)}
              <span class="text-sm text-accent-1">${
                store.stores.length > 1
                  ? theme.strings.storeFinder.storesCount.replace(
                      '{{ count }}',
                      store.stores.length
                    )
                  : theme.strings.storeFinder.storeCount.replace('{{ count }}', store.stores.length)
              }</span>
            </p>
          </div>
        `
      );

      let storesHTML = '';
      store.stores.forEach((entry) => {
        const { company = '', address = '', zipcode = '', city = '', website = '' } = entry;
        storesHTML += `
          <li class="rounded border border-accent-2-bg p-6">
              <h3 class="h5 min-h-[3.12rem] font-bold line-clamp-2">${company}</h3>
              <div class="flex justify-between">
                <a
                  href="https://maps.google.com?daddr=${address} ${zipcode} ${city}"
                  target="_blank"
                >
                  ${address}
                  <br>
                  ${zipcode} ${city}
                </a>
  
                <div class="grid grid-rows-2 items-center justify-center gap-2">
                  <div class="h-6 w-6">
                    <a
                      href="https://maps.google.com?daddr=${address} ${zipcode} ${city}"
                      target="_blank"
                      class="block text-accent-2"
                    >
                    ${theme.icons.locationPin}
                    </a>
                  </div>
                  <div class="h-6 w-6">
                  ${
                    website !== ''
                      ? `
                    <a
                      href="${website}"
                      target="_blank"
                      class="block text-accent-2"
                    >
                      ${theme.icons.arrowFromSquare}
                    </a>
                  `
                      : ''
                  }
                  </div>
                </div>
              </div>
            </li>
        `;
      });

      storeHTML.insertAdjacentHTML(
        'beforeend',
        `<ul class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">${storesHTML}</ul>`
      );
      storeView.insertAdjacentElement('beforeend', storeHTML);
    });

    if (storeView.childNodes.length <= 0) {
      storeView.insertAdjacentHTML(
        'beforeend',
        `<p>${theme.strings.storeFinder.noStoresFound}</p>`
      );
    }
  };

  const setFilter = (filterOption) => {
    filterButtons.forEach((filterButton) =>
      filterButton.classList.remove('store-finder__filter--active')
    );

    if (filterOption !== storeFilter) {
      storeFilter = filterOption;
    } else {
      storeFilter = '';
    }

    renderFilteredView({
      country: countryInput.value,
      searchTerms: cityTextInput.value,
      filter: storeFilter,
    });

    if (storeFilter === '') return;

    node
      .querySelector<HTMLElement>(`[data-filter="${filterOption}"]`)
      ?.classList.add('store-finder__filter--active');
  };

  const bindEventListeners = () => {
    countryInput.addEventListener('input', () => {
      renderFilteredView({
        country: countryInput.value,
        searchTerms: cityTextInput.value,
        filter: storeFilter,
      });
    });

    cityTextInput.addEventListener('input', () => {
      renderFilteredView({
        country: countryInput.value,
        searchTerms: cityTextInput.value,
        filter: storeFilter,
      });
    });

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        setFilter(button.getAttribute('data-filter'));
      });
    });
  };

  const initializeFilters = () => {
    renderCountries();
    bindEventListeners();
  };

  initializeFilters();
};

export default Component;
