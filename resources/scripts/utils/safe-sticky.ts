class SafeSticky {
  resizeObserver: ResizeObserver;

  element: HTMLElement;

  initialTop: number;

  lastKnownY: number;

  currentTop: number;

  constructor(element: HTMLElement) {
    this.element = element;
    this.initialTop = 0;
    this.lastKnownY = 0;
    this.currentTop = 0;
    this.resizeObserver = new ResizeObserver(this.recalculateStyles.bind(this));
    this.resizeObserver.observe(this.element);
    window.addEventListener('scroll', this.checkPosition.bind(this));
  }

  recalculateStyles() {
    this.element.style.removeProperty('top');
    const computedStyles = getComputedStyle(this.element);

    this.initialTop = parseInt(computedStyles.top, 10);
    this.checkPosition();
  }

  checkPosition() {
    const bounds = this.element.getBoundingClientRect();
    const maxTop = bounds.top + window.scrollY - this.element.offsetTop + this.initialTop;
    const minTop = this.element.clientHeight - window.innerHeight;

    if (window.scrollY < this.lastKnownY) {
      this.currentTop -= window.scrollY - this.lastKnownY;
    } else {
      this.currentTop += this.lastKnownY - window.scrollY;
    }

    this.currentTop = Math.min(Math.max(this.currentTop, -minTop), maxTop, this.initialTop);
    this.lastKnownY = window.scrollY;
    this.element.style.top = `${this.currentTop}px`;
  }
}

export default (element: HTMLElement) => new SafeSticky(element);
