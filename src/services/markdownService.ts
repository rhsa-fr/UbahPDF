import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { readFileAsArrayBuffer } from './fileUtils';

/**
 * Text item extracted from PDF with positional & font metadata
 */
interface PdfTextItem {
  str: string;
  height: number;
  y: number;
  x: number;
}

/**
 * A line of text grouped by Y-coordinate proximity
 */
interface TextLine {
  text: string;
  fontSize: number;
  y: number;
}

/**
 * Convert PDF file to Markdown string using heuristic heading/list detection.
 * Works only for digital text PDFs (not scanned/image PDFs).
 */
export async function pdfToMarkdown(file: File): Promise<string> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const allPages: string[] = [];

  for (let pageIdx = 1; pageIdx <= pdfDoc.numPages; pageIdx++) {
    const page = await pdfDoc.getPage(pageIdx);
    const textContent = await page.getTextContent();

    // Extract text items with font size and position
    const items: PdfTextItem[] = textContent.items
      .filter((item: any) => item.str && item.str.trim().length > 0)
      .map((item: any) => ({
        str: item.str,
        height: item.height || Math.abs(item.transform?.[3] || 12),
        y: item.transform?.[5] || 0,
        x: item.transform?.[4] || 0,
      }));

    if (items.length === 0) continue;

    // Group items into lines by Y-coordinate proximity (within 3px)
    const lines = groupIntoLines(items);

    // Compute median font size (body text baseline)
    const fontSizes = lines.map((l) => l.fontSize).sort((a, b) => a - b);
    const medianFontSize = fontSizes[Math.floor(fontSizes.length / 2)] || 12;

    // Convert lines to Markdown
    const markdownLines = linesToMarkdown(lines, medianFontSize);
    allPages.push(markdownLines);
  }

  return allPages.join('\n\n---\n\n');
}

/**
 * Group text items into lines based on Y-coordinate proximity
 */
function groupIntoLines(items: PdfTextItem[]): TextLine[] {
  // Sort by Y descending (PDF coordinates: origin bottom-left), then X ascending
  const sorted = [...items].sort((a, b) => {
    const yDiff = b.y - a.y;
    if (Math.abs(yDiff) > 3) return yDiff;
    return a.x - b.x;
  });

  const lines: TextLine[] = [];
  let currentLine: PdfTextItem[] = [];
  let currentY = sorted[0]?.y ?? 0;

  for (const item of sorted) {
    if (Math.abs(item.y - currentY) > 3) {
      // New line
      if (currentLine.length > 0) {
        lines.push(buildLine(currentLine));
      }
      currentLine = [item];
      currentY = item.y;
    } else {
      currentLine.push(item);
    }
  }

  if (currentLine.length > 0) {
    lines.push(buildLine(currentLine));
  }

  return lines;
}

function buildLine(items: PdfTextItem[]): TextLine {
  // Sort by X to ensure left-to-right order
  const sorted = [...items].sort((a, b) => a.x - b.x);
  const text = sorted.map((it) => it.str).join(' ').replace(/\s+/g, ' ').trim();
  // Use max font size in line (heading detection)
  const fontSize = Math.max(...sorted.map((it) => it.height));
  const y = sorted[0].y;
  return { text, fontSize, y };
}

/**
 * Convert grouped text lines to Markdown using font-size heuristics
 */
function linesToMarkdown(lines: TextLine[], bodyFontSize: number): string {
  const result: string[] = [];
  const bulletPattern = /^[\u2022\u25E6\u2023•◦‣\-\*]\s*/;
  const numberedPattern = /^(\d+)[.)]\s+/;

  for (const line of lines) {
    const { text, fontSize } = line;
    if (!text) continue;

    const ratio = fontSize / bodyFontSize;

    // Heading detection by font size ratio
    if (ratio >= 1.6) {
      result.push(`# ${text}`);
    } else if (ratio >= 1.35) {
      result.push(`## ${text}`);
    } else if (ratio >= 1.15) {
      result.push(`### ${text}`);
    } else if (bulletPattern.test(text)) {
      // Bullet list
      result.push(`- ${text.replace(bulletPattern, '')}`);
    } else if (numberedPattern.test(text)) {
      // Numbered list
      const match = text.match(numberedPattern)!;
      result.push(`${match[1]}. ${text.replace(numberedPattern, '')}`);
    } else {
      // Regular paragraph text
      result.push(text);
    }
  }

  // Merge consecutive non-heading, non-list lines into paragraphs
  return mergeIntoParagraphs(result);
}

/**
 * Merge consecutive body lines into paragraphs separated by blank lines.
 * Keep headings and list items as standalone.
 */
function mergeIntoParagraphs(lines: string[]): string {
  const output: string[] = [];
  let paragraphBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      output.push(paragraphBuffer.join(' '));
      paragraphBuffer = [];
    }
  };

  for (const line of lines) {
    const isSpecial = line.startsWith('#') || line.startsWith('- ') || /^\d+\.\s/.test(line);

    if (isSpecial) {
      flushParagraph();
      output.push('');
      output.push(line);
      output.push('');
    } else {
      paragraphBuffer.push(line);
    }
  }

  flushParagraph();

  // Clean up multiple blank lines
  return output
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// -------------------------------------------------------------------
// DOCX to Markdown (via Mammoth HTML → Markdown conversion)
// -------------------------------------------------------------------

/**
 * Convert DOCX file to Markdown using Mammoth's semantic HTML output.
 * Mammoth produces clean HTML with proper heading, list, table tags.
 */
export async function docxToMarkdown(file: File): Promise<string> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const html = result.value;
  return htmlToMarkdown(html);
}

/**
 * Convert clean HTML string (from Mammoth) to Markdown.
 * Handles: h1-h6, p, strong, em, ul/ol/li, table, a, br, img, code, pre, blockquote.
 */
function htmlToMarkdown(html: string): string {
  // Use DOMParser for reliable HTML parsing
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const root = doc.body.querySelector('div') || doc.body;

  return processNode(root).trim().replace(/\n{3,}/g, '\n\n');
}

function processNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || '';
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return '';

  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();
  const children = Array.from(el.childNodes).map(processNode).join('');

  switch (tag) {
    case 'h1':
      return `\n\n# ${children.trim()}\n\n`;
    case 'h2':
      return `\n\n## ${children.trim()}\n\n`;
    case 'h3':
      return `\n\n### ${children.trim()}\n\n`;
    case 'h4':
      return `\n\n#### ${children.trim()}\n\n`;
    case 'h5':
      return `\n\n##### ${children.trim()}\n\n`;
    case 'h6':
      return `\n\n###### ${children.trim()}\n\n`;
    case 'p':
      return `\n\n${children.trim()}\n\n`;
    case 'br':
      return '\n';
    case 'strong':
    case 'b':
      return `**${children}**`;
    case 'em':
    case 'i':
      return `*${children}*`;
    case 'u':
      return children; // Markdown has no native underline
    case 'code':
      return `\`${children}\``;
    case 'pre':
      return `\n\n\`\`\`\n${el.textContent || ''}\n\`\`\`\n\n`;
    case 'blockquote':
      return `\n\n${children.trim().split('\n').map((l) => `> ${l}`).join('\n')}\n\n`;
    case 'a': {
      const href = el.getAttribute('href') || '';
      return `[${children}](${href})`;
    }
    case 'img': {
      const src = el.getAttribute('src') || '';
      const alt = el.getAttribute('alt') || 'image';
      return `![${alt}](${src})`;
    }
    case 'ul':
      return `\n${processListItems(el, 'ul')}\n`;
    case 'ol':
      return `\n${processListItems(el, 'ol')}\n`;
    case 'li':
      return children; // Handled by processListItems
    case 'table':
      return `\n\n${processTable(el)}\n\n`;
    case 'div':
    case 'span':
    case 'section':
    case 'article':
    case 'main':
    case 'header':
    case 'footer':
      return children;
    case 'sup':
      return children;
    case 'sub':
      return children;
    default:
      return children;
  }
}

function processListItems(listEl: HTMLElement, type: 'ul' | 'ol'): string {
  const items = Array.from(listEl.children).filter(
    (c) => c.tagName.toLowerCase() === 'li'
  );

  return items
    .map((item, idx) => {
      const content = processNode(item).trim();
      const prefix = type === 'ul' ? '-' : `${idx + 1}.`;
      return `${prefix} ${content}`;
    })
    .join('\n');
}

function processTable(tableEl: HTMLElement): string {
  const rows = Array.from(tableEl.querySelectorAll('tr'));
  if (rows.length === 0) return '';

  const matrix: string[][] = [];

  for (const row of rows) {
    const cells = Array.from(row.querySelectorAll('th, td'));
    matrix.push(cells.map((c) => processNode(c).trim().replace(/\|/g, '\\|')));
  }

  // Normalize column count
  const maxCols = Math.max(...matrix.map((r) => r.length));
  const normalized = matrix.map((r) => {
    while (r.length < maxCols) r.push('');
    return r;
  });

  if (normalized.length === 0) return '';

  const header = `| ${normalized[0].join(' | ')} |`;
  const separator = `| ${normalized[0].map(() => '---').join(' | ')} |`;
  const bodyRows = normalized
    .slice(1)
    .map((r) => `| ${r.join(' | ')} |`)
    .join('\n');

  return `${header}\n${separator}\n${bodyRows}`;
}
