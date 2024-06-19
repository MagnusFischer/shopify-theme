import './styles/app.css';
import '@vendor/scrollbar-width';

import { App } from '@spinnakernordic/micro-components';

import storeSwitcher from '@components/shop-switcher';

import intersectionLoader from '@utils/loaders/intersection';
import elementInteraction from '@utils/loaders/element-interaction';
import loadEvent from '@utils/loaders/event';

const app = new App({
  'predictive-search': [
    elementInteraction,
    () =>
      import(/* webpackChunkName: "component-predictive-search" */ '@components/predictive-search'),
  ],

  'store-picker': [
    elementInteraction,
    () => import(/* webpackChunkName: "component-store-picker" */ '@components/store-picker'),
  ],

  'quick-buy': [
    intersectionLoader,
    () => import(/* webpackChunkName: "component-quick-buy" */ '@components/quick-buy'),
  ],

  // Components
  navigation: [
    intersectionLoader,
    () => import(/* webpackChunkName: "component-navigation" */ '@components/navigation'),
  ],

  'navigation-drawer': [
    elementInteraction,
    () =>
      import(/* webpackChunkName: "component-navigation-drawer" */ '@components/navigation-drawer'),
  ],

  'shop-switcher': storeSwitcher,

  announcement: [
    intersectionLoader,
    () => import(/* webpackChunkName: "component-announcement" */ '@components/announcement'),
  ],

  'featured-collection': [
    intersectionLoader,
    () =>
      import(
        /* webpackChunkName: "component-featured-collection" */ '@components/featured-collection'
      ),
  ],

  'text-with-icons': [
    intersectionLoader,
    () => import(/* webpackChunkName: "component-text-with-icons" */ '@components/text-with-icons'),
  ],

  video: [
    intersectionLoader,
    () => import(/* webpackChunkName: "component-video" */ '@components/video'),
  ],

  product: [
    intersectionLoader,
    () => import(/* webpackChunkName: "product-main" */ 'pages/product/main'),
  ],

  'related-products': [
    intersectionLoader,
    () => import(/* webpackChunkName: "related-products" */ 'pages/product/related-products'),
  ],

  'product-quantity': [
    intersectionLoader,
    () => import(/* webpackChunkName: "product-quantity" */ 'pages/product/quantity'),
  ],

  'product-media': [
    intersectionLoader,
    () => import(/* webpackChunkName: "product-media" */ 'pages/product/media'),
  ],

  'product-inventory': [
    intersectionLoader,
    () => import(/* webpackChunkName: "product-inventory" */ 'pages/product/inventory'),
  ],

  accordion: [
    intersectionLoader,
    () => import(/* webpackChunkName: "accordion" */ '@components/accordion'),
  ],

  'product-variations': [
    intersectionLoader,
    () => import(/* webpackChunkName: "product-variations" */ 'pages/product/variations'),
  ],

  'product-sticky-atc': [
    intersectionLoader,
    () => import(/* webpackChunkName: "product-sticky-atc" */ 'pages/product/sticky-atc'),
  ],

  'cart-page': [
    intersectionLoader,
    () => import(/* webpackChunkName: "cart-page" */ '@pages/cart/main'),
  ],

  'cart-drawer': [
    intersectionLoader,
    () => import(/* webpackChunkName: "cart-drawer" */ '@pages/cart/cart-drawer'),
  ],

  'cart-quantity': [
    intersectionLoader,
    () => import(/* webpackChunkName: "cart-quantity" */ '@pages/cart/line-item-quantity'),
  ],

  'cart-remove': [
    intersectionLoader,
    () => import(/* webpackChunkName: "cart-remove" */ '@pages/cart/line-item-remove'),
  ],

  'cart-shipping-bar': [
    intersectionLoader,
    () => import(/* webpackChunkName: "cart-shipping-bar" */ '@pages/cart/shipping-bar'),
  ],

  'cart-note': [
    intersectionLoader,
    () => import(/* webpackChunkName: "cart-note" */ '@pages/cart/order-note'),
  ],

  collection: [
    intersectionLoader,
    () => import(/* webpackChunkName: "collection-main" */ '@pages/collection/main'),
  ],

  slideshow: [
    intersectionLoader,
    () => import(/* webpackChunkName: "slideshow" */ '@components/slideshow'),
  ],

  address: [
    intersectionLoader,
    () => import(/* webpackChunkName: "address" */ '@pages/customer/address'),
  ],

  'address-overview': [
    intersectionLoader,
    () => import(/* webpackChunkName: "address-overview" */ '@pages/customer/address-overview'),
  ],

  'address-edit': [
    intersectionLoader,
    () => import(/* webpackChunkName: "address-edit" */ '@pages/customer/edit-address'),
  ],
  'address-create': [
    intersectionLoader,
    () => import(/* webpackChunkName: "address-create" */ '@pages/customer/create-address'),
  ],

  'account-orders': [
    intersectionLoader,
    () => import(/* webpackChunkName: "account-orders" */ '@pages/customer/orders'),
  ],

  drawer: [intersectionLoader, () => import(/* webpackChunkName: "drawer" */ '@components/drawer')],

  testimonials: [
    intersectionLoader,
    () => import(/* webpackChunkName: "testimonials" */ '@components/testimonials'),
  ],

  'range-slider': [
    intersectionLoader,
    () => import(/* webpackChunkName: "range-slider" */ '@components/range-slider'),
  ],

  'article-toc': [
    intersectionLoader,
    () =>
      import(
        /* webpackChunkName: "article-table-of-contents" */ '@pages/article/table-of-contents'
      ),
  ],

  countdown: [
    intersectionLoader,
    () => import(/* webpackChunkName: "countdown" */ '@components/countdown'),
  ],

  giftcard: [
    intersectionLoader,
    () => import(/* webpackChunkName: "giftcard" */ '@components/giftcard'),
  ],

  'store-locator': [
    intersectionLoader,
    () => import(/* webpackChunkName: "store-locator" */ '@components/store-locator'),
  ],

  'back-in-stock': [
    [elementInteraction, loadEvent],
    () => import(/* webpackChunkName: "back-in-stock" */ '@components/back-in-stock'),
  ],
  'contact-popup': [
    intersectionLoader,
    () => import(/* webpackChunkName: "contact-popup" */ '@components/contact-popup'),
  ],
});

app.mount();

document.addEventListener('app:remount', () => app.mount());
document.addEventListener('shopify:section:load', () => app.mount());
