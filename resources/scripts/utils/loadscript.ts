const queue: { [key: string]: HTMLScriptElement } = {};
const loaded: { [key: string]: HTMLScriptElement } = {};

export default (source: string, attributes?: { [key: string]: string }) =>
  new Promise<HTMLScriptElement>((resolve, reject) => {
    const isLoaded = Object.prototype.hasOwnProperty.call(loaded, source);
    const isQueued = Object.prototype.hasOwnProperty.call(queue, source);

    if (isLoaded) {
      resolve(loaded[source]);

      return;
    }

    if (isQueued) {
      queue[source].addEventListener(
        'load',
        (event) => {
          resolve(event.target as HTMLScriptElement);
        },
        { once: true }
      );

      return;
    }

    const script = document.createElement('script');
    script.src = source;
    script.async = true;

    if (attributes) {
      Object.entries(attributes).forEach((property) => {
        const [attribute, value] = property;

        script.setAttribute(attribute, value);
      });
    }

    script.onload = () => {
      resolve(script);

      loaded[source] = script;
      delete queue[source];
    };

    script.onerror = (event) => {
      reject(event);

      delete queue[source];
    };

    queue[source] = script;
    document.head.appendChild(script);
  });
