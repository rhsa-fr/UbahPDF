export const BASE_URL = (import.meta.env.VITE_BASE_URL as string) || 'https://ubahpdf.my.id';

export const ROUTES = {
  HOME: '/',
  GUIDES: '/panduan',
  BLOG_LIST: '/panduan',
  GUIDE_DETAIL: (slug: string) => `/panduan/${encodeURIComponent(slug)}`,
  BLOG_POST: (slug: string) => `/panduan/${encodeURIComponent(slug)}`,
  TOOL: (toolId: string) => `/${encodeURIComponent(toolId)}`,
} as const;
