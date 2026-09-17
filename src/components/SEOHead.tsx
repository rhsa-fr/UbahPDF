import React, { useMemo } from 'react';
import { SEO_DATA } from '../data/seoData';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { BASE_URL, ROUTES } from '../config/routes';

interface SEOHeadProps {
  toolId?: string | null;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ toolId }) => {
  const seoInfo = toolId ? SEO_DATA[toolId] : null;

  const title = seoInfo
    ? seoInfo.seoTitle
    : 'UbahPDF - Konverter & Editor Dokumen PDF Gratis, Cepat & Aman';
  const description = seoInfo
    ? seoInfo.seoDescription
    : 'Konversi, gabungkan, pisahkan, kompres, dan edit dokumen PDF, Word, dan Gambar di UbahPDF secara gratis, cepat, dan 100% aman langsung di browser Anda.';
  const canonicalUrl = toolId
    ? `${BASE_URL}${ROUTES.TOOL(toolId)}`
    : `${BASE_URL}${ROUTES.HOME}`;

  const keywords = seoInfo ? seoInfo.keywords : undefined;

  // Only inject structured data for specific tools (WebPage); root WebSite/WebApplication is statically in index.html
  const jsonLd = useMemo(() => {
    if (!seoInfo) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: seoInfo.seoTitle,
      description: seoInfo.seoDescription,
      url: canonicalUrl,
      isPartOf: {
        '@type': 'WebSite',
        name: 'UbahPDF',
        url: `${BASE_URL}/`,
      },
    };
  }, [seoInfo, canonicalUrl]);

  useSeoMeta({
    title,
    description,
    keywords,
    canonicalUrl,
    jsonLd,
    jsonLdId: 'tool-page-json-ld',
  });

  return null;
};
