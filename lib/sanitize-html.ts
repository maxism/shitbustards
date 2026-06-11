const ALLOWED_TAGS = new Set([
  'p',
  'br',
  'a',
  'strong',
  'b',
  'em',
  'i',
  'ul',
  'ol',
  'li',
  'h2',
  'h3',
  'h4',
  'blockquote',
]);

function safeHref(raw: string): string | null {
  const href = raw.trim();
  if (/^https?:\/\//i.test(href) || /^mailto:/i.test(href)) return href;
  return null;
}

/** Strip unsafe markup from RSS episode descriptions before rendering. */
export function sanitizeEpisodeHtml(html: string): string {
  let s = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '');

  s = s.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tag: string) => {
    const t = tag.toLowerCase();
    if (!ALLOWED_TAGS.has(t)) return '';

    if (match.startsWith('</')) return `</${t}>`;
    if (t === 'br') return '<br>';

    if (t === 'a') {
      const hrefMatch = match.match(
        /href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i,
      );
      const href = safeHref(
        hrefMatch?.[1] ?? hrefMatch?.[2] ?? hrefMatch?.[3] ?? '',
      );
      if (!href) return '';
      const escaped = href
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;');
      return `<a href="${escaped}" rel="noopener noreferrer" target="_blank">`;
    }

    return `<${t}>`;
  });

  return s.replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
}
