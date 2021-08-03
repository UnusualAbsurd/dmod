/* eslint-disable no-param-reassign */
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

const markdown = MarkdownIt({
  html: true,
  breaks: true,
  xhtmlOut: true,
  langPrefix: 'dmodlg-',
});

export default class MarkDown {
  constructor(public text: string) {}

  render() {
    const safe = this._processHtml(this.text);
    const content = this._escapeMarkdown(safe);
    return markdown.render(content);
  }

  _processHtml(dirty: string) {
    const clean = sanitizeHtml(dirty, {
      allowedTags: ['b', 'i', 'em', 'strong', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'u', 'hr', 'br', 'code', 'pre', 'section', 'ul', 'small', 'a'],
      allowedAttributes: {
        '*': ['style'],
        a: ['href', 'role', 'data-to', 'linking'],
      },
      transformTags: {
        a(tagName, attribs) {
          return {
            attribs: {
              'data-to': attribs.href,
              role: 'button',
            },
            tagName: 'a',
          };
        },
      },
      allowedStyles: {
        '*': {
          color: [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
          'font-size': [/^\d+(?:px|em|%)$/],
        },
        a: {
          role: [/^button$/],
          'data-to': [/^https:\/\/.*$/],
          href: [/^https:\/\/.*$/],
        },
      },
      parser: {
        lowerCaseTags: true,
      },
    });

    return clean;
  }

  _escapeMarkdown(str: string): string {
    // eslint-disable-next-line no-useless-escape
    return str.replace(/!?\[.*\]\(.*\)/g, _ => _.replace(/[\[\]]/g, __ => `\\${__}`).replace(/[\(\)]/g, ___ => `\\${___}`));
  }
}
