class Menu {
  button: HTMLElement;

  menu: HTMLElement;

  container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.button = this.container.querySelector<HTMLElement>('[data-toggle]');
    this.menu = this.container.querySelector<HTMLElement>('[data-menu]');
    this.button.addEventListener('click', () => this.toggle());
  }

  toggle() {
    if (this.button.getAttribute('data-toggle') === 'true') {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.button.setAttribute('data-toggle', 'true');
    setTimeout(() => {
      document.addEventListener('click', this.clickEvent);
      document.addEventListener('keydown', this.keydownEvent);
    }, 0);
  }

  close() {
    this.button.setAttribute('data-toggle', 'false');
    document.removeEventListener('click', this.clickEvent);
    document.removeEventListener('keydown', this.keydownEvent);
  }

  clickEvent = (event: MouseEvent | TouchEvent): void => {
    if (!(event.target instanceof Node)) {
      return;
    }

    if (!this.menu.contains(event.target)) {
      this.close();
    }
  };

  keydownEvent = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.close();
    }
  };
}

export default (container: HTMLElement) => new Menu(container);
