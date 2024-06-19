import { hide as hideOverlay, show as showOverlay } from '@utils/overlay';
import transitionEnd from '@utils/transition-end';
import repaint from '@utils/repaint';

type Events = 'open' | 'opened' | 'close' | 'closed';

export default class {
  private isActive: boolean;

  private readonly container: HTMLElement;

  protected classes: { active: string };

  constructor(element: string | HTMLElement) {
    this.container = typeof element === 'string' ? document.querySelector(element) : element;

    if (!(this.container instanceof HTMLElement)) {
      throw new TypeError(
        typeof element === 'string'
          ? `Could not find element matching selector: ${element}`
          : `HTMLElement was not passed to constructor. Instead ${element} was passed`
      );
    }

    this.isActive = false;
    this.container.hidden = true;

    this.clickEvent = this.clickEvent.bind(this);
    this.keydownEvent = this.keydownEvent.bind(this);
    this.addEventListeners = this.addEventListeners.bind(this);
  }

  private addEventListeners(): void {
    document.addEventListener('touchstart', this.clickEvent);
    document.addEventListener('click', this.clickEvent);
    document.addEventListener('keydown', this.keydownEvent);
  }

  private removeEventListeners(): void {
    document.removeEventListener('touchstart', this.clickEvent);
    document.removeEventListener('click', this.clickEvent);
    document.removeEventListener('keydown', this.keydownEvent);
  }

  private clickEvent(event: MouseEvent | TouchEvent): void {
    if (!(event.target instanceof Node)) {
      return;
    }

    if (!this.container.contains(event.target)) {
      event.stopPropagation();

      this.close();
    }
  }

  private keydownEvent(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close();
    }
  }

  toggle(): void {
    if (this.isActive) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    if (this.isActive) {
      return;
    }

    this.dispatchEvent('open');
    this.isActive = true;

    this.container.hidden = false;
    repaint(this.container);

    this.container.classList.add(this.classes.active);

    setTimeout(() => {
      this.addEventListeners();
    }, 0);

    transitionEnd(
      this.container,
      () => {
        if (this.isActive) {
          this.dispatchEvent('opened');
        }
      },
      { once: true }
    );

    showOverlay();
  }

  close(): void {
    if (!this.isActive) {
      return;
    }

    this.dispatchEvent('close');
    this.removeEventListeners();
    this.isActive = false;

    this.container.classList.remove(this.classes.active);

    transitionEnd(
      this.container,
      () => {
        if (!this.isActive) {
          this.container.hidden = true;
          this.dispatchEvent('closed');
        }
      },
      { once: true }
    );

    hideOverlay();
  }

  private dispatchEvent(type: Events): void {
    const event = new Event(type);

    this.container.dispatchEvent(event);
  }

  on(type: Events, callback: CallableFunction, options?: boolean | AddEventListenerOptions): void {
    this.container.addEventListener(type, (event) => callback(event), options);
  }
}
