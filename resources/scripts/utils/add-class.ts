export default (node: Element, classes: string | string[]): void => {
  if (Array.isArray(classes)) {
    return node.classList.add(...classes);
  }

  return node.classList.add(classes);
};
