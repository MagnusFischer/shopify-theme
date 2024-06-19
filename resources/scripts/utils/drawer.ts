import Openable from '@utils/openable';

class Drawer extends Openable {
  constructor(element: string | HTMLElement) {
    super(element);

    this.classes = {
      active: 'drawer--active',
    };
  }
}

export default (element: string | HTMLElement): Drawer => new Drawer(element);
