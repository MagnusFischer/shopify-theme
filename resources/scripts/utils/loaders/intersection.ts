import type { ComponentLoaderType } from '@spinnakernordic/micro-components';

const Loader: ComponentLoaderType = ({ node }, load) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          load();
        }
      });
    },
    { rootMargin: node.dataset.rootMargin }
  );

  observer.observe(node);

  return () => {
    observer.disconnect();
  };
};

export default Loader;
