export function renderMarkdown(markdown: string, containerClass = 'markdown-content'): string {
  if (!markdown?.trim()) {
    return '';
  }

  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const html: string[] = [`<div class="${containerClass}">`];
  let paragraph: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  const listItems: string[] = [];
  const headingIds = new Map<string, number>();

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p class="markdown-paragraph">${formatInline(paragraph.join(' '))}</p>`);
      paragraph = [];
    }
  };

  const flushList = () => {
    if (listType && listItems.length) {
      html.push(
        `<${listType} class="markdown-list markdown-list--${listType}">${listItems.map((item) => `<li class="markdown-list-item">${item}</li>`).join('')}</${listType}>`,
      );
      listItems.length = 0;
      listType = null;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = headingMatch[1].length;
      const rawText = headingMatch[2].trim();
      const content = formatInline(rawText);
      const headingClass =
        level === 1
          ? 'markdown-heading markdown-heading--1'
          : level === 2
            ? 'markdown-heading markdown-heading--2'
            : 'markdown-heading markdown-heading--3';
      const id = generateHeadingId(rawText, headingIds);
      html.push(`<h${level} id="${id}" class="${headingClass}">${content}</h${level}>`);
      continue;
    }

    if (trimmed.startsWith('>')) {
      flushParagraph();
      flushList();
      const content = formatInline(trimmed.replace(/^>\s?/, '').trim());
      html.push(`<blockquote class="markdown-blockquote">${content}</blockquote>`);
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph();
      listType = 'ul';
      listItems.push(formatInline(trimmed.replace(/^[-*]\s+/, '')));
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph();
      listType = 'ol';
      listItems.push(formatInline(trimmed.replace(/^\d+\.\s+/, '')));
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  html.push('</div>');

  return html.join('');
}

function formatInline(text: string): string {
  const escaped = escapeHtml(text);

  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m: string, label: string, url: string) => {
      const safeUrl = sanitizeUrl(url);
      return `<a href="${safeUrl}" target="_blank" rel="noreferrer">${label}</a>`;
    });
}

function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  if (/^(https?:\/\/|mailto:)/i.test(trimmed)) return trimmed;
  if (/^\/[a-z0-9]/i.test(trimmed)) return trimmed;
  return '';
}

// `generateMarkdownToc` removed — TOC generation is no longer used by legal pages.

function generateHeadingId(text: string, headingIds: Map<string, number>): string {
  const baseId = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  const count = headingIds.get(baseId) ?? 0;
  headingIds.set(baseId, count + 1);

  return count === 0 ? baseId : `${baseId}-${count}`;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
