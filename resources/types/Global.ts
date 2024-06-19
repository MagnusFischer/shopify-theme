import Shopify from '@ts/Shopify/Shopify';
import Theme from '@ts/Theme';

declare global {
  const Shopify: Shopify;
  const theme: Theme;
  interface Window {
    Shopify: Shopify;
    theme: Theme;
    dataLayer: any[];
  }
}
