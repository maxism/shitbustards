import { describe, expect, it } from 'vitest';

import { sanitizeEpisodeHtml } from '@/lib/sanitize-html';

describe('sanitizeEpisodeHtml', () => {
  it('keeps allowed formatting tags', () => {
    expect(sanitizeEpisodeHtml('<p>Hi <strong>there</strong><br/></p>')).toBe(
      '<p>Hi <strong>there</strong><br></p>',
    );
  });

  it('removes script and style blocks with their content', () => {
    const out = sanitizeEpisodeHtml(
      '<p>a</p><script>alert(1)</script><style>p{}</style>',
    );
    expect(out).toBe('<p>a</p>');
  });

  it('strips disallowed tags but keeps their text', () => {
    expect(
      sanitizeEpisodeHtml('<div><img src=x onerror=alert(1)>text</div>'),
    ).toBe('text');
  });

  it('drops links with unsafe protocols', () => {
    expect(sanitizeEpisodeHtml('<a href="javascript:alert(1)">x</a>')).toBe(
      'x</a>',
    );
  });

  it('hardens safe links and drops other attributes', () => {
    expect(
      sanitizeEpisodeHtml(
        '<a href="https://e.com/?a=1&b=2" onclick="x()">l</a>',
      ),
    ).toBe(
      '<a href="https://e.com/?a=1&amp;b=2" rel="noopener noreferrer" target="_blank">l</a>',
    );
  });
});
