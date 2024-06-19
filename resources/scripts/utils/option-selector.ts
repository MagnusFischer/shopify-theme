import addClass from '@utils/add-class';
import Product from '@ts/Shopify/objects/Product';
import Variant from '@ts/Shopify/objects/Variant';

type Config = {
  data: Product;
  onVariantSelected(variant: Variant | null): void;
  selectFirstAvailableVariant?: Boolean;
  showLabels?: Boolean;
  showSelectors?: Boolean;
  showSingleOptions?: Boolean;
  updateHistory?: Boolean;
  elements?: {
    wrapperClass?: string | string[] | null;
    wrapperElement?: string;
    selectClass?: string | string[] | null;
    labelClass?: string | string[] | null;
  };
};

class OptionSelector {
  public readonly select: HTMLSelectElement;

  public readonly selects: HTMLSelectElement[];

  public readonly config: Config;

  private readonly selectedOptions: {
    option1?: string;
    option2?: string;
    option3?: string;
  };

  constructor(element: string | HTMLSelectElement, config: Config) {
    this.select = typeof element === 'string' ? document.querySelector(element) : element;
    this.selects = [];

    this.selectedOptions = {};
    this.config = {
      selectFirstAvailableVariant: true,
      showLabels: true,
      showSelectors: true,
      showSingleOptions: false,
      updateHistory: true,
      ...config,
      elements: {
        wrapperElement: 'div',
        ...(config.elements ? config.elements : {}),
      },
    };

    if (!(this.select instanceof HTMLSelectElement)) {
      if (typeof element === 'string') {
        if (this.select === null) {
          throw new TypeError(`Could not find element matching selector: ${element}`);
        } else {
          throw new TypeError(
            `Selector matching: ${element}, found ${this.select} instead of HTMLSelectElement`
          );
        }
      } else {
        throw new TypeError(
          `HTMLSelectElement was not passed to constructor. Instead ${element} was passed`
        );
      }
    }

    this.setInitialSelectedOptions();
    this.createSelectors();
  }

  setOption(index: number, value: string) {
    const select = this.selects[index];

    if (!select) {
      throw new Error(`Index: "${index}" is not in range`);
    }

    select.value = value;
    select.dispatchEvent(new Event('change'));
  }

  private setInitialSelectedOptions(): void {
    const variant = this.findSelectedVariant();

    if (variant) {
      variant.options.forEach((option, index) => {
        this.selectedOptions[`option${index + 1}`] = option;
      });

      this.selectVariant(this.selectedOptions);
    } else {
      this.config.data.options.forEach((_, index) => {
        this.selectedOptions[`option${index + 1}`] = null;
      });
    }
  }

  private async createSelectors(): Promise<void> {
    const { default: uniq } = await import(/* webpackChunkName: "lodash" */ 'lodash-es/uniq');

    this.select.hidden = true;

    const currentVariant = this.findSelectedVariant();
    const { variants, options, id } = this.config.data;
    const { showLabels, showSelectors, showSingleOptions } = this.config;
    const { selectClass, wrapperElement, wrapperClass, labelClass } = this.config.elements;

    options.forEach((option, index) => {
      const optionKey = `option${index + 1}`;
      const wrapper = document.createElement(wrapperElement);
      const select = document.createElement('select');

      select.id = `product-${id}-${optionKey}`;
      const optionValues: Product['options'] = uniq(variants.map((variant) => variant[optionKey]));

      wrapper.hidden = !showSelectors || (showSingleOptions === false && optionValues.length === 1);
      if (wrapperClass) addClass(wrapper, wrapperClass);
      if (selectClass) addClass(select, selectClass);

      if (showLabels) {
        const label = document.createElement('label');
        label.htmlFor = select.id;
        label.textContent = option;

        if (labelClass) addClass(label, labelClass);

        wrapper.insertAdjacentElement('afterbegin', label);
      }

      if (currentVariant === null) {
        select.insertAdjacentHTML(
          'beforeend',
          `<option value="" disabled selected>${theme.strings.product.form.selectOption.replace(
            '{{ option }}',
            option.toLocaleLowerCase()
          )}</option>`
        );
      }

      optionValues.forEach((value) => {
        select.insertAdjacentHTML(
          'beforeend',
          currentVariant
            ? `<option value="${value}" ${
                currentVariant.options[index] === value ? 'selected' : ''
              }>${value}</option>`
            : `<option value="${value}">${value}</option>`
        );
      });

      select.addEventListener('change', () => {
        this.selectedOptions[optionKey] = select.value;
        this.selectVariant(this.selectedOptions);
      });

      wrapper.insertAdjacentElement('beforeend', select);
      this.select.insertAdjacentElement('beforebegin', wrapper);

      this.selects.push(select);
    });
  }

  private selectVariant(options: {}): void {
    const { updateHistory } = this.config;

    const variant = this.findVariantByOptions(options);

    if (updateHistory) {
      OptionSelector.updateHistory(variant);
    }

    this.config.onVariantSelected(variant ?? null);

    if (variant) {
      this.select.value = variant.id.toString();
      this.select.dispatchEvent(new Event('change'));
    }
  }

  private findSelectedVariant(): Variant | null {
    let variant: Variant = null;
    const { data, selectFirstAvailableVariant } = this.config;
    const params = new URLSearchParams(window.location.search);

    if (params.has('variant')) {
      variant = this.findVariantByID(parseInt(params.get('variant'), 10));
    }

    if (selectFirstAvailableVariant && variant === null) {
      variant = data.variants.find((item) => item.available) ?? data.variants[0];
    }

    return variant;
  }

  private findVariantByID(id: number): Variant | null {
    const { variants } = this.config.data;

    return variants.find((variant) => variant.id === id) || null;
  }

  private findVariantByOptions(options: {}): Variant | null {
    const { variants } = this.config.data;
    const compare = JSON.stringify(Object.values(options));

    return variants.find((variant) => JSON.stringify(variant.options) === compare) || null;
  }

  static updateHistory(variant: Variant | null): void {
    const params = new URLSearchParams(window.location.search);

    if (variant) {
      params.set('variant', variant.id.toString());
    } else {
      params.delete('variant');
    }

    const queryString = params.toString();
    window.history.replaceState(
      null,
      null,
      queryString ? `?${queryString}` : window.location.pathname
    );
  }
}

export default (element: string | HTMLSelectElement, config: Config) =>
  new OptionSelector(element, config);
