import type { ComponentType } from '@spinnakernordic/micro-components';

const Component: ComponentType = (node) => {
  const fromSlider = node.querySelector<HTMLInputElement>('[data-from-range]');
  const toSlider = node.querySelector<HTMLInputElement>('[data-to-range]');
  const fromInput = node.querySelector<HTMLInputElement>('[data-from-input]');
  const toInput = node.querySelector<HTMLInputElement>('[data-to-input]');

  const fillSlider = () => {
    const rangeDistance = parseInt(toSlider.max, 10) - parseInt(toSlider.min, 10);
    const fromPosition = parseInt(fromSlider.value, 10) - parseInt(toSlider.min, 10);
    const toPosition = parseInt(toSlider.value, 10) - parseInt(toSlider.min, 10);
    toSlider.style.background = `linear-gradient(
      to right,
      rgb(var(--secondary-bg)) 0%,
      rgb(var(--secondary-bg)) ${(fromPosition / rangeDistance) * 100}%,
      rgb(var(--accent-button-text-hover)) ${(fromPosition / rangeDistance) * 100}%,
      rgb(var(--accent-button-text-hover)) ${(toPosition / rangeDistance) * 100}%,
      rgb(var(--secondary-bg)) ${(toPosition / rangeDistance) * 100}%,
      rgb(var(--secondary-bg)) 100%)`;
  };

  const setToggleAccessible = (currentTarget: HTMLInputElement) => {
    if (Number(currentTarget.value) <= 0) {
      toSlider.style.zIndex = '2';
    } else {
      toSlider.style.zIndex = '0';
    }
  };

  const getParsed = (currentFrom: HTMLInputElement, currentTo: HTMLInputElement) => {
    const from = parseInt(currentFrom.value, 10);
    const to = parseInt(currentTo.value, 10);
    return [from, to];
  };

  const controlFromInput = () => {
    const [from, to] = getParsed(fromInput, toInput);

    if (from > to) {
      fromSlider.value = `${to}`;
      fromInput.value = `${to}`;
    } else {
      fromSlider.value = `${from}`;
    }

    fillSlider();
  };

  const controlToInput = () => {
    const [from, to] = getParsed(fromInput, toInput);

    if (from <= to) {
      toSlider.value = `${to}`;
      toInput.value = `${to}`;
    } else {
      toInput.value = `${from}`;
    }

    fillSlider();
    setToggleAccessible(toInput);
  };

  const controlFromSlider = () => {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider();
    if (from > to) {
      fromSlider.value = `${to}`;
      fromInput.value = `${to}`;
    } else {
      fromInput.value = `${from}`;
    }
  };

  const controlToSlider = () => {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider();
    setToggleAccessible(toSlider);
    if (from <= to) {
      toSlider.value = `${to}`;
      toInput.value = `${to}`;
    } else {
      toInput.value = `${from}`;
      toSlider.value = `${from}`;
    }
  };

  fromSlider.addEventListener('input', () => controlFromSlider());
  toSlider.addEventListener('input', () => controlToSlider());
  fromInput.addEventListener('input', () => controlFromInput());
  toInput.addEventListener('input', () => controlToInput());

  fillSlider();
  setToggleAccessible(toSlider);
};

export default Component;
