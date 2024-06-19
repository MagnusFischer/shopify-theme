import type { ComponentType } from '@spinnakernordic/micro-components';
import countrySelector from '@utils/country-selector';

const Component: ComponentType = (node) => {
  countrySelector('NewAddressCountry', 'NewAddressProvince', {
    hideElement: 'NewAddressProvinceContainer',
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

          document
            .querySelector('[data-drawer-content]')
            .replaceWith(updatedAddresses.querySelector('[data-drawer-content]'));

          document.dispatchEvent(new Event('customer:address:created'));
        });
    });
  });

  document.addEventListener('customer:address:closed', () => {
    node.hidden = true;
  });
};

export default Component;
