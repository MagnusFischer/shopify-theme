import addToCartEvent, { checkoutStartedEvent } from 'utils/tracking';

class Cart {
  lineItemsElement: HTMLElement;

  cartCounters: NodeListOf<HTMLElement>;

  cartTotals: HTMLElement;

  container: HTMLElement;

  form: HTMLFormElement;

  termsInput: HTMLInputElement | null;

  termsPopup: HTMLElement;

  termsOverlay: HTMLElement;

  section: string;

  constructor(element: HTMLElement, section: string) {
    this.container = element;
    this.section = section;
    this.form = this.container.querySelector<HTMLFormElement>('form');
    this.termsInput = this.container.querySelector<HTMLInputElement>('input[name="terms"]');
    this.termsPopup = this.container.querySelector<HTMLElement>('[data-terms-popup]');
    this.termsOverlay = this.container.querySelector<HTMLElement>('[data-terms-overlay]');
    this.cartCounters = document.querySelectorAll<HTMLElement>('[data-cart-count]');
    this.cartTotals = element.querySelector<HTMLElement>('[data-cart-total]');
    this.lineItemsElement = element.querySelector<HTMLElement>('[data-line-items]');
    this.bindListeners();
  }

  bindListeners() {
    document.addEventListener('cart:quantity:changed', (event: CustomEvent) =>
      this.onQuantityChanged(event)
    );
    document.addEventListener('cart:add:variant', (event: CustomEvent) => this.addVariant(event));
    this.form.addEventListener('submit', (event: Event) => this.onSubmit(event));

    document.addEventListener('cart:terms:open', () => this.showTerms());

    if (this.termsPopup !== null) {
      this.termsOverlay.addEventListener('click', () => this.declineTerms());
      this.termsPopup
        .querySelector('[data-terms-decline]')
        .addEventListener('click', () => this.declineTerms());
      this.termsPopup
        .querySelector('[data-terms-accept]')
        .addEventListener('click', () => this.acceptTerms());
    }
  }

  async onQuantityChanged(event: CustomEvent) {
    event.detail.element.setAttribute('aria-busy', true);

    if (event.detail.quantity > 0) {
      await this.updateCartQuantity(event.detail);
      return;
    }
    this.updateCartQuantity(event.detail, true);
  }

  async updateCartQuantity(lineItem, remove = false) {
    this.form.querySelector('button[type="submit"]').setAttribute('disabled', 'true');
    await fetch(`${Shopify.routes.root}cart/change.js`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: lineItem.variant,
        quantity: remove ? 0 : lineItem.quantity,
        sections: this.section,
      }),
    })
      .then((res) => {
        if (res.status === 422) {
          this.form.querySelector('button[type="submit"]').removeAttribute('disabled');
          document.dispatchEvent(
            new CustomEvent('cart:error', {
              detail: { error: 'too many items', variant: lineItem.variant },
            })
          );
          throw new Error('Too many items');
        }
        return res.json();
      })
      .then((data) => {
        const updatedDrawerContent = new DOMParser().parseFromString(
          data.sections[this.section],
          'text/html'
        );

        this.cartCounters.forEach((counter) => {
          counter.innerHTML = data.item_count;
        });

        if (!remove) {
          const newLineItem = updatedDrawerContent.querySelector(
            `li[data-key="${lineItem.variant}"]`
          );
          lineItem.element.replaceWith(newLineItem);
          document.dispatchEvent(new Event('app:remount'));
        } else {
          lineItem.element.remove();
        }

        this.cartTotals.replaceWith(updatedDrawerContent.querySelector('[data-cart-total]'));
        this.cartTotals = this.container.querySelector<HTMLElement>('[data-cart-total]');

        const cartObject = JSON.parse(
          updatedDrawerContent.querySelector<HTMLScriptElement>('[data-cart-json]').innerText
        );
        window.theme.cart = cartObject;

        document.dispatchEvent(new CustomEvent('cart:updated', { detail: data }));
        this.form.querySelector('button[type="submit"]').removeAttribute('disabled');

        this.container.setAttribute(
          'data-empty',
          window.theme.cart.items.length <= 0 ? 'true' : 'false'
        );
      })
      .catch((error) => console.error(error));
  }

  async addVariant(event: CustomEvent) {
    this.container.setAttribute('data-empty', 'false');

    this.lineItemsElement.insertAdjacentHTML(
      'afterbegin',
      `
      <li
        data-placeholder
        class="cart-drawer__line-item flex flex-wrap border-b border-neutral-100 py-5 last:border-b-0 last:pb-0 animate-horizon-pulse"
      >
        <div class="mr-3 w-20 flex-shrink-0">
          <div class="aspect-w-1 aspect-h-1 bg-neutral-100"></div>
        </div>

      <div class="flex w-full flex-1 flex-col justify-between">
        <div class="flex flex-col gap-1">
          <div class="w-2/3 h-4 bg-neutral-100"></div>
          <div class="w-1/5 h-3 bg-neutral-100"></div>
        </div>

        <div class="flex items-end justify-between pt-2">
          <div class="flex gap-0.5">
            <div class="w-9 h-9 bg-neutral-100"></div>
            <div class="w-9 h-9"></div>
            <div class="w-9 h-9 bg-neutral-100"></div>
          </div>
          <div class="w-1/6 h-4 bg-neutral-100"></div>
        </div>
      </div>
    </li>
    `
    );

    await fetch(`${Shopify.routes.root}cart/add.js`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            id: event.detail.id,
            quantity: event.detail.quantity,
          },
        ],
        sections: this.section,
      }),
    })
      .then((res) => {
        if (res.status === 422) {
          throw new Error('Too many items');
        }
        return res.json();
      })
      .then((data) => {
        const updatedDrawerContent = new DOMParser().parseFromString(
          data.sections[this.section],
          'text/html'
        );
        this.lineItemsElement.innerHTML =
          updatedDrawerContent.querySelector('[data-line-items]').innerHTML;

        this.cartCounters.forEach((counter) => {
          const currentCount = parseInt(counter.innerHTML, 10);
          counter.innerHTML = `${currentCount + parseInt(event.detail.quantity, 10)}`;
        });

        this.cartTotals.replaceWith(updatedDrawerContent.querySelector('[data-cart-total]'));
        this.cartTotals = this.container.querySelector<HTMLElement>('[data-cart-total]');

        const cartObject = JSON.parse(
          updatedDrawerContent.querySelector<HTMLScriptElement>('[data-cart-json]').innerText
        );
        window.theme.cart = cartObject;

        document.dispatchEvent(new CustomEvent('cart:updated', { detail: cartObject }));
        document.dispatchEvent(new Event('app:remount'));
        this.container.setAttribute(
          'data-empty',
          window.theme.cart.items.length <= 0 ? 'true' : 'false'
        );

        addToCartEvent(data.items);
      })
      .catch((err) => this.fetchCart());
  }

  async fetchCart() {
    await fetch(`${Shopify.routes.root}cart.js`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sections: this.section,
      }),
    })
      .then((res) => {
        this.lineItemsElement.querySelector('[data-placeholder]')?.remove();
        return res.text();
      })
      .then((data) => {
        const updatedDrawerContent = new DOMParser().parseFromString(data, 'text/html');
        this.lineItemsElement.innerHTML =
          updatedDrawerContent.querySelector('[data-line-items]').innerHTML;

        this.cartCounters.forEach((counter) => {
          counter.innerText = parseInt(
            updatedDrawerContent.querySelector<HTMLElement>('[data-cart-count]').innerText,
            10
          ).toString();
        });

        this.cartTotals.replaceWith(updatedDrawerContent.querySelector('[data-cart-total]'));
        this.cartTotals = this.container.querySelector<HTMLElement>('[data-cart-total]');

        const cartObject = JSON.parse(
          updatedDrawerContent.querySelector<HTMLScriptElement>('[data-cart-json]').innerText
        );
        window.theme.cart = cartObject;

        this.container.setAttribute(
          'data-empty',
          window.theme.cart.items.length <= 0 ? 'true' : 'false'
        );

        document.dispatchEvent(new CustomEvent('cart:updated', { detail: cartObject }));
        document.dispatchEvent(new Event('app:remount'));
      });
  }

  showTerms() {
    this.termsPopup.style.transform = 'translateY(0)';
    this.termsOverlay.setAttribute('data-active', 'true');
  }

  declineTerms() {
    this.termsOverlay.removeAttribute('data-active');
    this.termsPopup.style.transform = 'translateY(100%)';
  }

  acceptTerms() {
    this.termsInput.checked = true;
    checkoutStartedEvent();
    window.location.href = '/checkout';
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.termsInput !== null) {
      if (this.termsInput.checked) {
        checkoutStartedEvent();
        window.location.href = '/checkout';
      } else {
        this.showTerms();
      }
    } else {
      checkoutStartedEvent();
      window.location.href = '/checkout';
    }
  }
}

export default (element: HTMLElement, section: string) => new Cart(element, section);
