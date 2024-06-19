import type { ComponentType } from '@spinnakernordic/micro-components';
import Drawer from '@utils/modal';

const Component: ComponentType = async (node, { emitter }) => {
  const drawer = Drawer(node);
  const form = node.querySelector('form');
  const variantSelect = node.querySelector<HTMLSelectElement>('[data-variants]');
  const closeButton = node.querySelector<HTMLButtonElement>('[data-close]');

  closeButton.addEventListener('click', () => drawer.close());

  const toggles = document.querySelectorAll<HTMLElement>('[data-load="back-in-stock"]');
  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => drawer.open());
  });

  emitter.on('load:back-in-stock', () => {
    drawer.open();
  });

  drawer.on('open', () => {
    const currentVariantID = document
      .querySelector<HTMLElement>('[data-back-in-stock-variant]')
      ?.getAttribute('data-back-in-stock-variant');

    if (variantSelect.querySelector(`[value="${currentVariantID}"]`) === null) return;

    variantSelect.value = currentVariantID;
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const backInStockURL = `https://a.klaviyo.com/client/back-in-stock-subscriptions/?company_id=${theme.klaviyo.publicApiKey}`;

    const dataJSON = JSON.stringify({
      data: {
        type: 'back-in-stock-subscription',
        attributes: {
          profile: {
            data: {
              type: 'profile',
              attributes: {
                email: data.get('email'),
              },
            },
          },
          channels: ['EMAIL'],
        },
        relationships: {
          variant: {
            data: {
              type: 'catalog-variant',
              id: `$shopify:::$default:::${data.get('variant')}`,
            },
          },
        },
      },
    });

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        revision: '2023-07-15',
        'content-type': 'application/json',
      },
      body: dataJSON,
    };

    await fetch(backInStockURL, options)
      .then((res) => {
        if (res.status === 202) {
          form.setAttribute('data-completed', 'true');
        } else {
          alert('something went wrong, try again later.');
        }
      })
      .catch((err) => console.error(err));
  });

  drawer.on('closed', () => form.setAttribute('data-completed', 'false'));

  drawer.open();
};

export default Component;
