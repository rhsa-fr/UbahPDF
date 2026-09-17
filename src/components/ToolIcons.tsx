import React, { memo } from 'react';
import type { ToolId } from '../types';

interface ToolIconProps {
  toolId: ToolId | string;
  className?: string;
  size?: number;
}

export const ToolIcon: React.FC<ToolIconProps> = memo(({ toolId, className = '', size = 44 }) => {
  const svgProps = {
    width: size,
    height: size,
    viewBox: '0 0 48 48',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    className,
    'aria-hidden': true,
    focusable: false,
  };

  switch (toolId) {
    // ── 1. GABUNGKAN PDF (Merge) ──────────────────────────────
    // Dua kartu merah/coral bertumpuk diagonal dengan panah saling mendekat
    case 'merge-pdf':
      return (
        <svg {...svgProps}>
          {/* Back document */}
          <rect x="6" y="6" width="22" height="22" rx="4.5" fill="#f87171" fillOpacity="0.35" />
          {/* Front document */}
          <rect x="20" y="20" width="22" height="22" rx="4.5" fill="#ef4444" />
          {/* Arrow top-left pointing down-right */}
          <path d="M14 14L20 20M20 20H15M20 20V15" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Arrow bottom-right pointing up-left */}
          <path d="M34 34L28 28M28 28H33M28 28V33" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── 2. PISAHKAN PDF (Split) ──────────────────────────────
    // Dua kartu oranye bertumpuk diagonal dengan panah saling menjauh
    case 'split-pdf':
      return (
        <svg {...svgProps}>
          {/* Back document */}
          <rect x="6" y="6" width="22" height="22" rx="4.5" fill="#fb923c" fillOpacity="0.35" />
          {/* Front document */}
          <rect x="20" y="20" width="22" height="22" rx="4.5" fill="#f97316" />
          {/* Arrow top-left pointing outward */}
          <path d="M19 19L13 13M13 13H18M13 13V18" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Arrow bottom-right pointing outward */}
          <path d="M29 29L35 35M35 35H30M35 35V30" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── 3. KOMPRES PDF (Compress) ─────────────────────────────
    // Empat kotak hijau kecil dengan 4 panah mengarah ke tengah
    case 'compress-pdf':
      return (
        <svg {...svgProps}>
          {/* 4 Corner Tiles */}
          <rect x="8" y="8" width="13" height="13" rx="3" fill="#10b981" />
          <rect x="27" y="8" width="13" height="13" rx="3" fill="#10b981" />
          <rect x="8" y="27" width="13" height="13" rx="3" fill="#10b981" />
          <rect x="27" y="27" width="13" height="13" rx="3" fill="#10b981" />
          {/* Arrows pointing to center */}
          <path d="M11.5 11.5L17.5 17.5M17.5 17.5H13.5M17.5 17.5V13.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M36.5 11.5L30.5 17.5M30.5 17.5H34.5M30.5 17.5V13.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11.5 36.5L17.5 30.5M17.5 30.5H13.5M17.5 30.5V34.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M36.5 36.5L30.5 30.5M30.5 30.5H34.5M30.5 30.5V34.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── 4. PDF KE WORD ────────────────────────────────────────
    // Dokumen latar abu/merah muda + dokumen depan biru berhuruf 'W'
    case 'pdf-to-word':
      return (
        <svg {...svgProps}>
          {/* Back document (PDF) */}
          <rect x="7" y="7" width="22" height="22" rx="4.5" fill="#dbeafe" />
          <path d="M13 13L19 19M19 19H14.5M19 19V14.5" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          {/* Front document (Word) */}
          <rect x="19" y="19" width="22" height="22" rx="4.5" fill="#2563eb" />
          <text x="30" y="35" fill="#ffffff" fontSize="13" fontWeight="800" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif">
            W
          </text>
        </svg>
      );

    // ── 5. WORD KE PDF ────────────────────────────────────────
    // Dokumen latar biru 'W' + dokumen depan merah PDF
    case 'word-to-pdf':
      return (
        <svg {...svgProps}>
          {/* Back document (Word) */}
          <rect x="7" y="7" width="22" height="22" rx="4.5" fill="#dbeafe" />
          <text x="18" y="23" fill="#2563eb" fontSize="13" fontWeight="800" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif">
            W
          </text>
          {/* Front document (PDF) */}
          <rect x="19" y="19" width="22" height="22" rx="4.5" fill="#ef4444" />
          <path d="M35 35L29 29M29 29H33.5M29 29V33.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── 6. JPG/PNG KE PDF (Image to PDF) ──────────────────────
    // Kartu foto pemandangan di belakang + kartu PDF di depan
    case 'image-to-pdf':
      return (
        <svg {...svgProps}>
          {/* Back document (Image) */}
          <rect x="7" y="7" width="22" height="22" rx="4.5" fill="#e0e7ff" />
          <circle cx="14" cy="14" r="2.5" fill="#6366f1" />
          <path d="M10 24L15 19L23 26H9L10 24Z" fill="#6366f1" />
          {/* Front document (PDF) */}
          <rect x="19" y="19" width="22" height="22" rx="4.5" fill="#ef4444" />
          <path d="M35 35L29 29M29 29H33.5M29 29V33.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── 7. PDF KE JPG/PNG (PDF to Image) ──────────────────────
    // Kartu PDF di belakang + kartu foto pemandangan di depan
    case 'pdf-to-image':
      return (
        <svg {...svgProps}>
          {/* Back document (PDF) */}
          <rect x="7" y="7" width="22" height="22" rx="4.5" fill="#fee2e2" />
          <path d="M13 13L19 19M19 19H14.5M19 19V14.5" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          {/* Front document (Image) */}
          <rect x="19" y="19" width="22" height="22" rx="4.5" fill="#8b5cf6" />
          <circle cx="26" cy="26" r="2.5" fill="#ffffff" />
          <path d="M22 36L27 31L35 38H21L22 36Z" fill="#ffffff" />
        </svg>
      );

    // ── 8. NOMOR HALAMAN PDF ──────────────────────────────────
    // Kartu dengan badge angka 123
    case 'page-numbers':
      return (
        <svg {...svgProps}>
          <rect x="9" y="6" width="30" height="36" rx="5" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="1.5" />
          <rect x="14" y="12" width="20" height="2.5" rx="1" fill="#8b5cf6" fillOpacity="0.4" />
          <rect x="14" y="18" width="16" height="2.5" rx="1" fill="#8b5cf6" fillOpacity="0.4" />
          <rect x="14" y="24" width="12" height="2.5" rx="1" fill="#8b5cf6" fillOpacity="0.4" />
          {/* Number badge bottom right */}
          <rect x="22" y="28" width="18" height="15" rx="3.5" fill="#8b5cf6" />
          <text x="31" y="39.5" fill="#ffffff" fontSize="9.5" fontWeight="800" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif">
            123
          </text>
        </svg>
      );

    // ── 9. PUTAR PDF (Rotate) ─────────────────────────────────
    // Dokumen dengan panah melingkar 90°
    case 'rotate-pdf':
      return (
        <svg {...svgProps}>
          <rect x="11" y="11" width="26" height="26" rx="5" fill="#d1fae5" />
          <rect x="15" y="15" width="18" height="18" rx="3.5" fill="#10b981" />
          {/* Rotate circular arrow */}
          <path d="M24 8C31 8 37 13 38 20M38 20V14M38 20H32" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24 40C17 40 11 35 10 28M10 28V34M10 28H16" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── 10. WATERMARK PDF ─────────────────────────────────────
    // Dokumen dengan cap stempel 'CONFIDENTIAL'
    case 'watermark-pdf':
      return (
        <svg {...svgProps}>
          <rect x="8" y="6" width="32" height="36" rx="5" fill="#fce7f3" stroke="#fbcfe8" strokeWidth="1.5" />
          <rect x="14" y="13" width="20" height="2.5" rx="1" fill="#ec4899" fillOpacity="0.3" />
          <rect x="14" y="19" width="15" height="2.5" rx="1" fill="#ec4899" fillOpacity="0.3" />
          {/* Stamp banner */}
          <g transform="rotate(-20 24 28)">
            <rect x="10" y="24" width="28" height="10" rx="2" fill="#ec4899" />
            <text x="24" y="31.5" fill="#ffffff" fontSize="7" fontWeight="900" textAnchor="middle" letterSpacing="0.5" fontFamily="system-ui, -apple-system, sans-serif">
              CAP
            </text>
          </g>
        </svg>
      );

    // ── 11. URUTKAN HALAMAN (Reorder) ─────────────────────────
    // Kartu-kartu bertingkat dengan panah atas bawah
    case 'reorder-pdf':
      return (
        <svg {...svgProps}>
          <rect x="7" y="12" width="24" height="28" rx="4" fill="#e0e7ff" stroke="#c7d2fe" strokeWidth="1.2" />
          <rect x="17" y="8" width="24" height="28" rx="4" fill="#6366f1" />
          {/* Swap arrows */}
          <path d="M26 16V28M26 16L23 19M26 16L29 19" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M32 28V16M32 28L29 25M32 28L35 25" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── 12. TANDA TANGANI PDF (Sign) ──────────────────────────
    // Dokumen dengan garis tanda tangan dan pena kaligrafi
    case 'sign-pdf':
      return (
        <svg {...svgProps}>
          <rect x="8" y="6" width="32" height="36" rx="5" fill="#d1fae5" stroke="#a7f3d0" strokeWidth="1.5" />
          {/* Signature stroke */}
          <path d="M14 31C16 28 18 27 20 28C22 29 23 32 25 30C27 28 29 28 32 30" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
          {/* Pen / Quill icon */}
          <circle cx="33" cy="15" r="8" fill="#10b981" />
          <path d="M30 18L35 13M36 12L34 11L30 15V18H33L37 14L36 12Z" fill="#ffffff" />
        </svg>
      );

    // ── 13. HAPUS HALAMAN (Delete Pages) ──────────────────────
    // Dokumen merah dengan tanda silang
    case 'delete-pages':
      return (
        <svg {...svgProps}>
          <rect x="8" y="6" width="32" height="36" rx="5" fill="#fee2e2" stroke="#fecaca" strokeWidth="1.5" />
          {/* Document lines */}
          <rect x="14" y="13" width="20" height="2.5" rx="1" fill="#ef4444" fillOpacity="0.3" />
          <rect x="14" y="19" width="14" height="2.5" rx="1" fill="#ef4444" fillOpacity="0.3" />
          {/* Delete badge */}
          <circle cx="31" cy="31" r="9" fill="#ef4444" />
          <path d="M27 27L35 35M35 27L27 35" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    // ── 14. LINDUNGI PDF (Protect) ────────────────────────────
    // Dokumen ungu dengan gembok terkunci
    case 'protect-pdf':
      return (
        <svg {...svgProps}>
          <rect x="8" y="6" width="32" height="36" rx="5" fill="#ede9fe" stroke="#ddd6fe" strokeWidth="1.5" />
          {/* Lock badge */}
          <circle cx="24" cy="27" r="11" fill="#8b5cf6" />
          <rect x="19.5" y="25" width="9" height="7.5" rx="1.5" fill="#ffffff" />
          <path d="M21.5 25V22C21.5 20.6 22.6 19.5 24 19.5C25.4 19.5 26.5 20.6 26.5 22V25" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    // ── 15. BUKA KUNCI PDF (Unlock) ───────────────────────────
    // Dokumen hijau dengan gembok terbuka
    case 'unlock-pdf':
      return (
        <svg {...svgProps}>
          <rect x="8" y="6" width="32" height="36" rx="5" fill="#d1fae5" stroke="#a7f3d0" strokeWidth="1.5" />
          {/* Unlocked badge */}
          <circle cx="24" cy="27" r="11" fill="#10b981" />
          <rect x="19.5" y="25" width="9" height="7.5" rx="1.5" fill="#ffffff" />
          <path d="M21.5 22C21.5 20.6 22.6 19.5 24 19.5C25.4 19.5 26.5 20.6 26.5 22" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    // ── 16. UBAH UKURAN HALAMAN (Resize) ──────────────────────
    // Dokumen dengan panah diagonal skala 4 arah
    case 'resize-pdf':
      return (
        <svg {...svgProps}>
          <rect x="8" y="6" width="32" height="36" rx="5" fill="#e0e7ff" stroke="#c7d2fe" strokeWidth="1.5" />
          <rect x="13" y="11" width="22" height="26" rx="3" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* Expand arrows */}
          <path d="M19 19L14 14M14 14H18M14 14V18" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M29 29L34 34M34 34H30M34 34V30" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── 17. EKSTRAK GAMBAR DARI PDF (Extract Images) ──────────
    // Kartu PDF dengan foto terlempar keluar
    case 'extract-images':
      return (
        <svg {...svgProps}>
          <rect x="7" y="10" width="26" height="30" rx="4.5" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="1.5" />
          {/* Extracted photo popping out */}
          <rect x="19" y="8" width="22" height="22" rx="4.5" fill="#0284c7" />
          <circle cx="25" cy="14" r="2" fill="#ffffff" />
          <path d="M22 25L26 21L33 27H20L22 25Z" fill="#ffffff" />
          <path d="M15 22L11 26M11 26H14.5M11 26V22.5" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── 18. PDF HITAM PUTIH (Grayscale) ───────────────────────
    // Dokumen setengah hitam pekat setengah putih abu
    case 'grayscale-pdf':
      return (
        <svg {...svgProps}>
          <rect x="9" y="7" width="30" height="34" rx="5" fill="#f4f4f5" stroke="#d4d4d8" strokeWidth="1.5" />
          {/* Half circle contrast badge */}
          <circle cx="24" cy="24" r="11" fill="#27272a" />
          <path d="M24 13C30.0751 13 35 17.9249 35 24C35 30.0751 30.0751 35 24 35V13Z" fill="#ffffff" />
          <circle cx="24" cy="24" r="11" stroke="#52525b" strokeWidth="1.5" />
        </svg>
      );

    // ── 19. EXCEL KE PDF ──────────────────────────────────────
    // Kartu hijau 'X' di belakang + kartu merah PDF di depan
    case 'excel-to-pdf':
      return (
        <svg {...svgProps}>
          {/* Back document (Excel) */}
          <rect x="7" y="7" width="22" height="22" rx="4.5" fill="#dcfce7" />
          <text x="18" y="23" fill="#16a34a" fontSize="13" fontWeight="800" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif">
            X
          </text>
          {/* Front document (PDF) */}
          <rect x="19" y="19" width="22" height="22" rx="4.5" fill="#ef4444" />
          <path d="M35 35L29 29M29 29H33.5M29 29V33.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── 20. PDF KE MARKDOWN ───────────────────────────────────
    // Dokumen merah PDF + dokumen biru gelap berhuruf 'M↓'
    case 'pdf-to-markdown':
      return (
        <svg {...svgProps}>
          <rect x="7" y="7" width="22" height="22" rx="4.5" fill="#fee2e2" />
          <path d="M13 13L19 19M19 19H14.5M19 19V14.5" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="19" y="19" width="22" height="22" rx="4.5" fill="#0284c7" />
          <text x="30" y="34" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif">
            M↓
          </text>
        </svg>
      );

    // ── 21. WORD KE MARKDOWN ──────────────────────────────────
    // Dokumen biru Word + dokumen cyan berhuruf 'M↓'
    case 'word-to-markdown':
      return (
        <svg {...svgProps}>
          <rect x="7" y="7" width="22" height="22" rx="4.5" fill="#dbeafe" />
          <text x="18" y="23" fill="#2563eb" fontSize="13" fontWeight="800" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif">
            W
          </text>
          <rect x="19" y="19" width="22" height="22" rx="4.5" fill="#0284c7" />
          <text x="30" y="34" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif">
            M↓
          </text>
        </svg>
      );

    // ── DEFAULT FALLBACK ──────────────────────────────────────
    default:
      return (
        <svg {...svgProps}>
          <rect x="10" y="6" width="28" height="36" rx="5" fill="#e0e7ff" />
          <rect x="15" y="13" width="18" height="2.5" rx="1" fill="#4f46e5" fillOpacity="0.4" />
          <rect x="15" y="19" width="14" height="2.5" rx="1" fill="#4f46e5" fillOpacity="0.4" />
        </svg>
      );
  }
}) as React.FC<ToolIconProps>;
