export default interface Theme {
  cart: any;
  cart_type: 'drawer' | 'page';
  moneyFormat: string;
  strings: {
    product: {
      form: {
        addToCart: string;
        soldOut: string;
        unavailable: string;
        all_variants_in_cart: string;
        selectOption: string;
      };
    };
    collection: {
      pagination: {
        loading: string;
      };
    };
    cart: {
      shipping: {
        threshold_remaining: string;
        threshold_reached: string;
      };
      errors: {
        exceeded_inventory_limit: string;
      };
    };
    accessibility: {
      slideshow: {
        load_slide: string;
        of: string;
      };
    };
    storeFinder: {
      storesCount: string;
      storeCount: string;
      noStoresFound: string;
    };
    backInStock: {
      getNotifiedButtonLabel: string;
    };
  };
  klaviyo: {
    publicApiKey: string;
  };
  free_shipping_threshold: number;
  icons: {
    chevronRight: string;
    arrowFromSquare: string;
    locationPin: string;
  };
}
