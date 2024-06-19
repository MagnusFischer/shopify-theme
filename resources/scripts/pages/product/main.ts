import { ComponentType } from '@spinnakernordic/micro-components';
import formatMoney from '@utils/format-money';
import Product from '@ts/Shopify/objects/Product';
import safeSticky from '@utils/safe-sticky';
import addToCartEvent from 'utils/tracking';

const Component: ComponentType = (node, { emitter }) => {
  const data: Product = JSON.parse(node.querySelector('[data-product-json]').textContent);
  const inventory = JSON.parse(node.querySelector('[data-product-inventory]').textContent);
  const price = node.querySelector<HTMLElement>('[data-price]');
  const compareAtPrice = node.querySelector<HTMLElement>('[data-compare-at-price]');
  const addToCart = node.querySelector<HTMLButtonElement>('[data-add-to-cart]');
  const addToCartButtons = document.querySelectorAll<HTMLButtonElement>(
    '[data-add-to-cart-button]'
  );
  const backInStockButton = node.querySelector<HTMLButtonElement>('[data-load="back-in-stock"]');
  let selectedVariant = 0;

  safeSticky(node.querySelector<HTMLElement>('[data-product-info]'));
  const updateAddToCartButton = (variant) => {
    const variantInventory = inventory[variant.id];
    const cartVariantQuantity = window.theme.cart.items
      .filter((lineItemVariant) => lineItemVariant.id === variant.id)
      .reduce((acc, cur) => acc + cur.quantity, 0);

    addToCartButtons.forEach((button) => {
      if (variant) {
        backInStockButton?.setAttribute('data-back-in-stock-variant', variant.id);
        if (
          cartVariantQuantity >= variantInventory.quantity &&
          variantInventory.policy === 'deny' &&
          cartVariantQuantity !== 0
        ) {
          const buttonText = theme.strings.product.form.all_variants_in_cart.replace(
            '{{ variant }}',
            variant.title
          );
          button.innerHTML = `<span>${buttonText}</span>`;
          button.disabled = true;
          if (backInStockButton !== null && button.getAttribute('back-in-stock') === 'sold_out') {
            backInStockButton.hidden = true;
          }
          button.removeAttribute('data-back-in-stock-variant');
        } else if (variant.available) {
          if (backInStockButton !== null && button.getAttribute('back-in-stock') === 'sold_out') {
            backInStockButton.hidden = true;
          }
          button.innerHTML = `<span>${theme.strings.product.form.addToCart}</span>`;
          button.disabled = false;
          button.removeAttribute('data-back-in-stock-variant');
        } else if (button.hasAttribute('back-in-stock')) {
          if (button.getAttribute('back-in-stock') === 'sold_out') {
            if (button.getAttribute('back-in-stock-behavior') === 'replace') {
              button.innerHTML = `<span>${theme.strings.backInStock.getNotifiedButtonLabel}</span>`;
              button.disabled = false;
              button.setAttribute('data-back-in-stock-variant', variant.id);
            } else {
              backInStockButton.hidden = false;
              button.innerHTML = `<span>${theme.strings.product.form.soldOut}</span>`;
              button.disabled = true;
              button.removeAttribute('data-back-in-stock-variant');
            }
          } else {
            backInStockButton.hidden = false;

            button.innerHTML = `<span>${theme.strings.product.form.soldOut}</span>`;
            button.disabled = true;
            button.removeAttribute('data-back-in-stock-variant');
          }
        } else {
          button.innerHTML = `<span>${theme.strings.product.form.soldOut}</span>`;
          button.disabled = true;
          button.removeAttribute('data-back-in-stock-variant');
        }
      } else {
        button.innerHTML = `<span>${theme.strings.product.form.unavailable}</span>`;
        button.disabled = true;
        button.removeAttribute('data-back-in-stock-variant');
      }
    });
  };

  const updateProductInfo = (variant) => {
    selectedVariant = variant;
    price.textContent = `${formatMoney(variant.price)}`;

    if (variant.compare_at_price > variant.price) {
      compareAtPrice.hidden = false;
      compareAtPrice.innerHTML = `${formatMoney(variant.compare_at_price)}`;
    } else {
      compareAtPrice.hidden = true;
    }

    updateAddToCartButton(variant);
  };

  const initOptions = async () => {
    const { default: OptionSelector } = await import(
      /* webpackChunkName: "option-selector" */ '@utils/option-selector'
    );

    addToCart.addEventListener('click', (event) => {
      event.preventDefault();
      const productForm = node.querySelector<HTMLFormElement>('form.shopify-product-form');
      const formData = new FormData(productForm);

      if (addToCart.hasAttribute('data-back-in-stock-variant')) {
        emitter.emit('load:back-in-stock');
        return;
      }

      if (theme.cart_type === 'page') {
        const findCurrentVariant = data.variants.find(
          (variant) => variant.id === parseInt(`${formData.get('id')}`, 10)
        );
        addToCartEvent([
          {
            ...findCurrentVariant,
            quantity: formData.has('quantity') ? formData.get('quantity') : 1,
          },
        ]);
        productForm.submit();
        return;
      }

      document.dispatchEvent(new Event('cart-drawer:open'));

      const variant = {
        id: formData.get('id'),
        quantity: formData.has('quantity') ? formData.get('quantity') : 1,
      };
      document.dispatchEvent(new CustomEvent('cart:add:variant', { detail: variant }));
    });

    const callback = async (variant) => {
      const { default: uniq } = await import(/* webpackChunkName: "lodash" */ 'lodash-es/uniq');
      const variantsAvailableArray = data.variants.map((entry) => entry.available);
      const variantsOption1Array = data.variants.map((entry) => entry.option1);
      const variantsOption2Array = data.variants.map((entry) => entry.option2);
      const variantsOption3Array = data.variants.map((entry) => entry.option3);
      document.dispatchEvent(new CustomEvent('product:variant:changed', { detail: variant }));

      data.options.forEach((option, index) => {
        const optionValues = uniq(data.variants.map((entry) => entry[`option${index + 1}`]));

        optionValues.forEach((value) => {
          let optionDisabled = true;

          variantsOption1Array.forEach((option1Name, i) => {
            switch (index + 1) {
              case 1:
                if (variantsOption1Array[i] === value && variantsAvailableArray[i]) {
                  optionDisabled = false;
                }
                break;
              case 2:
                if (
                  option1Name === variant.option1 &&
                  variantsOption2Array[i] === value &&
                  variantsAvailableArray[i]
                ) {
                  optionDisabled = false;
                }
                break;
              case 3:
                if (
                  option1Name === variant.option1 &&
                  variantsOption2Array[i] === variant.option2 &&
                  variantsOption3Array[i] === value &&
                  variantsAvailableArray[i]
                ) {
                  optionDisabled = false;
                }
                break;
              default:
                optionDisabled = true;
                break;
            }
          });

          const swatch = node.querySelector(`[data-variant="${value}"]`);
          swatch?.setAttribute('data-disabled', `${optionDisabled}`);
        });
      });

      updateProductInfo(variant);
    };

    const selector = OptionSelector(`#product-${data.id}`, {
      data,
      onVariantSelected: callback,
      showSelectors: false,
    });

    const productOptions = node.querySelectorAll<HTMLElement>('[data-option]');
    productOptions.forEach((option) => {
      const variants = option.querySelectorAll<HTMLElement>('[data-variant]');
      variants.forEach((variant) => {
        variant.addEventListener('click', (e) => {
          e.preventDefault();
          selector.setOption(parseInt(variant.dataset.index, 10), variant.dataset.variant);
          variants.forEach((element) => element.removeAttribute('data-selected'));
          variant.setAttribute('data-selected', '');
        });
      });
    });
  };

  document.addEventListener('cart:updated', () => {
    updateProductInfo(selectedVariant);
  });

  initOptions();
};

export default Component;
