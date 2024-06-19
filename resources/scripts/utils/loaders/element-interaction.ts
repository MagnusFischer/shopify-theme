import type { ComponentLoaderType } from '@spinnakernordic/micro-components';

const Loader: ComponentLoaderType = ({ node }, load) => {
  const targets = document.querySelectorAll<HTMLElement>(
    `[data-load="${node.dataset.loadTarget}"]`
  );
  const options = <AddEventListenerOptions>{
    passive: true,
    once: true,
  };

  const disconnectors: CallableFunction[] = [];

  targets.forEach((target) => {
    const event = target.dataset.event || 'click';

    target.addEventListener(event, load, options);

    disconnectors.push(() => {
      target.removeEventListener(event, load, options);
    });
  });

  return () => {
    disconnectors.forEach((disconnect) => {
      disconnect();
    });
  };
};

export default Loader;
