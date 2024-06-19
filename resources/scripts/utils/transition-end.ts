export default (
  element: HTMLElement,
  callback: CallableFunction,
  options: boolean | AddEventListenerOptions = false
): void => {
  const hasDuration =
    parseFloat(getComputedStyle(element).getPropertyValue('transition-duration') || '0') !== 0;

  if (hasDuration) {
    element.addEventListener(
      'transitionend',
      (event) => {
        callback(event);
      },
      options
    );
  } else {
    callback();
  }
};
