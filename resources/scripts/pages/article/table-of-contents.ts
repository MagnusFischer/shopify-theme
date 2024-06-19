import { ComponentType } from '@spinnakernordic/micro-components';
import clear from '@utils/clear';

const stringToSlug = (string) =>
  string
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const Component: ComponentType = async (node) => {
  const articleContent = document.querySelector<HTMLElement>('[data-toc-content]');

  clear(node);

  const headings = articleContent.querySelectorAll<HTMLElement>('h2');
  headings.forEach((heading) => {
    heading.id = stringToSlug(heading.innerHTML);

    node.insertAdjacentHTML(
      'beforeend',
      `
      <li>
        <a href="#${stringToSlug(heading.innerHTML)}">
          <span>${window.theme.icons.chevronRight}</span>
          ${heading.innerHTML}
        </a>
      </li>
    `
    );
  });
};

export default Component;
