import { ComponentType } from '@spinnakernordic/micro-components';
import Cart from '@utils/cart';

const Component: ComponentType = async (node) => {
  Cart(node, node.getAttribute('data-section'));
};

export default Component;
