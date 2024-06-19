import type { ComponentType } from '@spinnakernordic/micro-components';
import countrySelector from '@utils/country-selector';

const Component: ComponentType = (node) => {
  const select = node.querySelector<HTMLElement>('[data-address-country-select]');
  const { formId } = select.dataset;
  countrySelector(`AddressCountry_${formId}`, `AddressProvince_${formId}`, {
    hideElement: `AddressProvinceContainer_${formId}`,
  });

  const form = node.querySelector('form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    fetch(form.getAttribute('action'), {
      method: 'post',
      body: new FormData(form),
    }).then(() => {
      fetch(`${window.Shopify.routes.root}?section_id=address-overview`)
        .then((res) => res.text())
        .then((data) => {
          const updatedAddresses = new DOMParser().parseFromString(data, 'text/html');

          document
            .querySelector('[data-address-overview]')
            .replaceWith(updatedAddresses.querySelector('[data-address-overview]'));

          node.hidden = true;

          document.dispatchEvent(new Event('customer:address:edited'));
        });
    });
  });

  document.addEventListener('customer:address:closed', () => {
    node.hidden = true;
  });
};

export default Component;
