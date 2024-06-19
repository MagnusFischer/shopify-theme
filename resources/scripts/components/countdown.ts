import type { ComponentType } from '@spinnakernordic/micro-components';

const Component: ComponentType = async (node) => {
  const daysHTML = node.querySelector<HTMLElement>('[data-type="days"]');
  const hoursHTML = node.querySelector<HTMLElement>('[data-type="hours"]');
  const minutesHTML = node.querySelector<HTMLElement>('[data-type="minutes"]');
  const secondsHTML = node.querySelector<HTMLElement>('[data-type="seconds"]');

  let startDate = Date.parse(node.getAttribute('data-date'));
  console.log(startDate);
  const endDate = Date.parse(
    node.querySelector<HTMLElement>('[data-end]').getAttribute('datetime')
  );
  const daysInMs = 1000 * 60 * 60 * 24;
  const hoursInMs = daysInMs / 24;
  const minutesInMs = hoursInMs / 60;
  const secondsInMs = minutesInMs / 60;
  let counterInterval;

  const formatDigits = (number: number) => {
    let newNumber = number.toString();
    if (number < 10) newNumber = `0${newNumber}`;
    return newNumber;
  };

  const convertTime = (timeInMs: number) => {
    let totalMS = timeInMs;
    const days = formatDigits(parseInt((totalMS / daysInMs).toString(), 10));
    totalMS -= parseInt(days, 10) * daysInMs;
    const hours = formatDigits(parseInt((totalMS / hoursInMs).toString(), 10));
    totalMS -= parseInt(hours, 10) * hoursInMs;
    const minutes = formatDigits(parseInt((totalMS / minutesInMs).toString(), 10));
    totalMS -= parseInt(minutes, 10) * minutesInMs;
    const seconds = formatDigits(parseInt((totalMS / secondsInMs).toString(), 10));

    return {
      days: days.split(''),
      hours: hours.split(''),
      minutes: minutes.split(''),
      seconds: seconds.split(''),
    };
  };

  const animate = (digit, newDigit) => {
    digit.style.transform = 'translateY(-4px)';
    digit.style.opacity = '0';
    digit.style.transition = 'all 300ms ease';

    setTimeout(() => {
      digit.style.transition = 'all 300ms ease';
      digit.style.opacity = '1';
      digit.style.transform = 'translateY(0px)';
      digit.textContent = newDigit;
    }, 150);
  };

  const render = (time) => {
    daysHTML.querySelectorAll('[data-digit]').forEach((digit, index) => {
      const currentDigit = digit.querySelector('span');
      if (currentDigit.textContent === time.days[index]) return;

      animate(currentDigit, time.minutes[index]);
    });
    hoursHTML.querySelectorAll('[data-digit]').forEach((digit, index) => {
      const currentDigit = digit.querySelector('span');
      if (currentDigit.textContent === time.hours[index]) return;

      animate(currentDigit, time.minutes[index]);
    });
    minutesHTML.querySelectorAll('[data-digit]').forEach((digit, index) => {
      const currentDigit = digit.querySelector('span');
      if (currentDigit.textContent === time.minutes[index]) return;

      animate(currentDigit, time.minutes[index]);
    });
    secondsHTML.querySelectorAll('[data-digit]').forEach((digit, index) => {
      const currentDigit = digit.querySelector('span');
      if (currentDigit.textContent === time.seconds[index]) return;

      animate(currentDigit, time.seconds[index]);
    });
  };

  const stopTimer = () => {
    clearInterval(counterInterval);
  };

  const onComplete = () => {
    render({
      days: ['0', '0'],
      hours: ['0', '0'],
      minutes: ['0', '0'],
      seconds: ['0', '0'],
    });
  };

  const update = () => {
    const timeDiff = endDate - startDate;
    const timeRemaining = convertTime(timeDiff);

    if (timeDiff <= 0) {
      stopTimer();
      onComplete();
    }

    render(timeRemaining);
    startDate += secondsInMs;
  };

  if (Number.isNaN(endDate)) {
    onComplete();
    return;
  }

  if (endDate <= startDate) {
    onComplete();
    return;
  }

  counterInterval = setInterval(update, 1000);
  update();
};

export default Component;
