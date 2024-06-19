const isEmpty = (value) =>
  value == null || (typeof value === 'string' && value.trim().length === 0);

const getProductVariant = (variant, index = false) => ({
  ...(index !== false && {
    index,
  }),
  item_id: variant.sku || variant.id,
  item_name: variant.product_title || variant.name,
  quantity: variant.quantity,
  price: variant.final_line_price / 100 || variant.price / 100,
  ...(!isEmpty(variant.vendor) && {
    item_brand: variant.vendor,
  }),
  ...(!isEmpty(variant.product_type) && {
    item_category: variant.product_type,
  }),
  ...(!isEmpty(variant.title) && {
    item_variant: variant.title,
  }),
});

const getItemsFromCartLineItems = (cartLineItems) => {
  const items = [];
  cartLineItems.forEach((item, index) => {
    const lineItem = getProductVariant(item, index + 1);
    items.push(lineItem);
  });
  return items;
};

export const viewCartEvent = () => {
  window.dataLayer = window.dataLayer || [];
  const data = {
    event: 'view_cart',
    ecommerce: {
      currency: Shopify.currency.active,
      value: window.theme.cart.total_price / 100,
      items: getItemsFromCartLineItems(window.theme.cart.items),
    },
  };
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push(data);
};

export const checkoutStartedEvent = () => {
  window.dataLayer = window.dataLayer || [];
  const data = {
    event: 'begin_checkout',
    ecommerce: {
      currency: Shopify.currency.active,
      value: window.theme.cart.total_price / 100,
      items: getItemsFromCartLineItems(window.theme.cart.items),
    },
  };
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push(data);
};

export default (line_items) => {
  window.dataLayer = window.dataLayer || [];
  const data = {
    event: 'add_to_cart',
    ecommerce: {
      currency: Shopify.currency.active,
      value: window.theme.cart.total_price / 100,
      items: getItemsFromCartLineItems(line_items),
    },
  };
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push(data);
};
