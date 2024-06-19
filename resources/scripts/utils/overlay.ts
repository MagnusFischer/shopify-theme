import transitionEnd from '@utils/transition-end';

class Overlay {
  private readonly element: HTMLDivElement;

  private readonly classes: { active: string };

  private isActive: boolean;

  constructor() {
    this.classes = {
      active: 'overlay--active',
    };
    this.isActive = false;

    this.element = document.createElement('div');
    this.element.hidden = true;
    this.element.classList.add('overlay');

    document.body.appendChild(this.element);

    this.toggle = this.toggle.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  toggle(): void {
    if (this.element.classList.contains(this.classes.active)) {
      this.hide();
    } else {
      this.show();
    }
  }

  show(index: number | null = null): void {
    if (this.isActive) {
      return;
    }

    this.isActive = true;
    this.element.hidden = false;

    if (index !== null) {
      this.element.style.zIndex = index.toString();
    }

    this.element.classList.add(this.classes.active);
  }

  hide(): void {
    if (!this.isActive) {
      return;
    }

    this.isActive = false;

    this.element.classList.remove(this.classes.active);

    transitionEnd(
      this.element,
      () => {
        if (!this.isActive) {
          this.element.hidden = true;
          this.element.style.zIndex = '';
        }
      },
      { once: true }
    );
  }
}

const overlay = new Overlay();

export const { show, hide } = overlay;
