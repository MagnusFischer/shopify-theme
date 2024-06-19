import Openable from '@utils/openable';

class Modal extends Openable {
  constructor(element: string | HTMLElement) {
    super(element);

    this.classes = {
      active: 'modal--active',
    };
  }
}

export default (element: string | HTMLElement): Modal => new Modal(element);
