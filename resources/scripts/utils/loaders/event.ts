import type { ComponentLoaderType } from '@spinnakernordic/micro-components';

const Loader: ComponentLoaderType = ({ node, emitter }, load) => {
  const events = node.dataset.loadEvent.split(' ');

  events.forEach((event) => {
    emitter.on(event, load);
  });

  return () => {
    events.forEach((event) => {
      emitter.off(event, load);
    });
  };
};

export default Loader;
