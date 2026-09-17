import { useEffect } from 'react';

export interface SeoMetaOptions {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown> | null;
  jsonLdId?: string;
}

export function useSeoMeta({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  jsonLd,
  jsonLdId = 'dynamic-json-ld',
}: SeoMetaOptions): void {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    interface TagSnapshot {
      selector: string;
      attrName: string;
      attrValue: string;
      content: string;
      previousContent: string | null;
      created: boolean;
      element: Element;
    }

    const setOrCreateMeta = (
      selector: string,
      attrName: string,
      attrValue: string,
      content: string
    ): TagSnapshot => {
      let el = document.querySelector(selector);
      let created = false;
      const previousContent = el?.getAttribute('content') ?? null;

      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
        created = true;
      }
      el.setAttribute('content', content);

      return {
        selector,
        attrName,
        attrValue,
        content,
        previousContent,
        created,
        element: el,
      };
    };

    const snapshots: TagSnapshot[] = [
      setOrCreateMeta('meta[name="description"]', 'name', 'description', description),
      setOrCreateMeta('meta[property="og:title"]', 'property', 'og:title', title),
      setOrCreateMeta('meta[property="og:description"]', 'property', 'og:description', description),
      setOrCreateMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl),
      setOrCreateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title),
      setOrCreateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description),
      setOrCreateMeta('meta[name="twitter:url"]', 'name', 'twitter:url', canonicalUrl),
    ];

    if (keywords && keywords.length > 0) {
      snapshots.push(
        setOrCreateMeta('meta[name="keywords"]', 'name', 'keywords', keywords.join(', '))
      );
    }

    if (ogImage) {
      snapshots.push(setOrCreateMeta('meta[property="og:image"]', 'property', 'og:image', ogImage));
      snapshots.push(setOrCreateMeta('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage));
    }

    // Canonical link handling
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    let canonicalCreated = false;
    const prevCanonical = canonicalEl?.getAttribute('href') ?? null;

    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
      canonicalCreated = true;
    }
    canonicalEl.setAttribute('href', canonicalUrl);

    // JSON-LD handling
    let scriptEl = document.getElementById(jsonLdId);
    let scriptCreated = false;

    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = jsonLdId;
        scriptEl.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptEl);
        scriptCreated = true;
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    }

    // Cleanup: restore previous states to prevent meta leakage across routes
    return () => {
      document.title = prevTitle;

      snapshots.forEach((snap) => {
        if (snap.created) {
          snap.element.remove();
        } else if (snap.previousContent !== null) {
          snap.element.setAttribute('content', snap.previousContent);
        } else {
          snap.element.remove();
        }
      });

      if (canonicalCreated) {
        canonicalEl?.remove();
      } else if (canonicalEl && prevCanonical !== null) {
        canonicalEl.setAttribute('href', prevCanonical);
      }

      if (scriptCreated && scriptEl) {
        scriptEl.remove();
      }
    };
  }, [title, description, keywords, canonicalUrl, ogImage, jsonLd, jsonLdId]);
}
