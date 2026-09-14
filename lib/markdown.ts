import { Marked, type Tokens } from 'marked';
import { codeToHtml } from 'shiki';

export type Heading = { id: string; text: string };

type CodeToken = Tokens.Code & { html?: string };

const THEME = 'min-light';

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-');

const highlight = (code: string, lang: string) =>
  codeToHtml(code, { lang, theme: THEME }).catch(() =>
    codeToHtml(code, { lang: 'text', theme: THEME }),
  );

const strip = (html: string) => html.replace(/<[^>]+>/g, '');

export async function render(
  body: string,
): Promise<{ html: string; headings: Heading[] }> {
  const headings: Heading[] = [];
  const md = new Marked({
    gfm: true,
    async: true,
    async walkTokens(token) {
      if (token.type === 'code') {
        const t = token as CodeToken;
        t.html = await highlight(t.text, t.lang || 'text');
      }
    },
    renderer: {
      heading({ tokens, depth }) {
        const inner = this.parser.parseInline(tokens);
        const text = strip(inner);
        const id = slugify(text);
        if (depth === 2) headings.push({ id, text });
        return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
      },
      code(token) {
        return `${(token as CodeToken).html ?? ''}\n`;
      },
      image({ href, text }) {
        return `<figure><img src="${href}" alt="${text}" loading="lazy" /><figcaption>${text}</figcaption></figure>\n`;
      },
      link({ href, tokens }) {
        const external = /^https?:\/\//.test(href);
        const rel = external ? ' target="_blank" rel="noreferrer"' : '';
        return `<a href="${href}"${rel}>${this.parser.parseInline(tokens)}</a>`;
      },
    },
  });
  const html = await md.parse(body);
  return { html, headings };
}
