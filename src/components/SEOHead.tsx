import React, { useEffect } from 'react';
import { SEO_DATA } from '../data/seoData';

interface SEOHeadProps {
  toolId?: string | null;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ toolId }) => {
  useEffect(() => {
    const seoInfo = toolId ? SEO_DATA[toolId] : null;

    const title = seoInfo
      ? seoInfo.seoTitle
      : 'UbahPDF - Konverter & Editor Dokumen PDF Gratis, Cepat & Aman';
    const description = seoInfo
      ? seoInfo.seoDescription
      : 'Konversi, gabungkan, pisahkan, kompres, dan edit dokumen PDF, Word, dan Gambar di UbahPDF secara gratis, cepat, dan 100% aman langsung di browser Anda.';
    const canonicalUrl = toolId
      ? `https://ubahpdf.my.id/${toolId}`
      : 'https://ubahpdf.my.id/';

    // Update document title
    document.title = title;

    // Helper to set or update meta tag
    const setMetaTag = (selector: string, attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMetaTag('meta[name="description"]', 'name', 'description', description);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:url"]', 'name', 'twitter:url', canonicalUrl);

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Update JSON-LD WebSite or WebPage structured data
    let jsonLdScript = document.getElementById('dynamic-json-ld');
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'dynamic-json-ld';
      jsonLdScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(jsonLdScript);
    }

    if (seoInfo) {
      jsonLdScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'name': seoInfo.seoTitle,
        'description': seoInfo.seoDescription,
        'url': canonicalUrl,
        'isPartOf': {
          '@type': 'WebSite',
          'name': 'UbahPDF',
          'url': 'https://ubahpdf.my.id/'
        }
      });
    } else {
      jsonLdScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'UbahPDF',
        'alternateName': ['Ubah PDF', 'UbahPDF Online', 'UbahPDF.my.id'],
        'url': 'https://ubahpdf.my.id/'
      });
    }
  }, [toolId]);

  return null;
};
