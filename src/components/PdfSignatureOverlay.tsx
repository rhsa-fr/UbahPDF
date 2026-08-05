import React, { useRef, useState, useEffect } from 'react';
import { Move } from 'lucide-react';
import type { PdfPageThumbnail } from '../types';

interface PdfSignatureOverlayProps {
  thumbnail?: PdfPageThumbnail;
  signatureDataUrl: string;
  onPositionChange: (pos: { xPercent: number; yPercent: number; widthPercent: number }) => void;
}

export const PdfSignatureOverlay: React.FC<PdfSignatureOverlayProps> = ({
  thumbnail,
  signatureDataUrl,
  onPositionChange,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [posX, setPosX] = useState(55); // Default ~55% left
  const [posY, setPosY] = useState(70); // Default ~70% top
  const [widthPercent, setWidthPercent] = useState(25); // Default 25% width
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Update parent options when position changes
  useEffect(() => {
    onPositionChange({
      xPercent: posX,
      yPercent: posY,
      widthPercent: widthPercent,
    });
  }, [posX, posY, widthPercent, onPositionChange]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    const deltaXPercent = (deltaX / rect.width) * 100;
    const deltaYPercent = (deltaY / rect.height) * 100;

    setPosX((prevX) => Math.max(0, Math.min(100 - widthPercent, prevX + deltaXPercent)));
    setPosY((prevY) => Math.max(0, Math.min(85, prevY + deltaYPercent)));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  if (!thumbnail) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Move className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>Posisi Tanda Tangan (Geser Kotak di Bawah)</span>
        </label>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Ukuran:</span>
          <input
            type="range"
            min="10"
            max="60"
            value={widthPercent}
            onChange={(e) => setWidthPercent(parseInt(e.target.value))}
            className="w-24 accent-emerald-600 cursor-pointer"
          />
          <span className="font-mono text-slate-700 font-bold w-8">{widthPercent}%</span>
        </div>
      </div>

      <p className="text-[11px] text-slate-500">
        💡 Sentuh & geser kotak tanda tangan di atas gambar dokumen ke posisi persis yang diinginkan (misal di atas garis nama).
      </p>

      {/* PDF Page Container */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative w-full max-w-lg mx-auto bg-slate-200 rounded-xl overflow-hidden shadow-md border-2 border-slate-300 select-none touch-none"
      >
        {/* PDF Page Image */}
        <img
          src={thumbnail.dataUrl}
          alt={`Halaman ${thumbnail.pageNumber}`}
          className="w-full h-auto block pointer-events-none"
        />

        {/* Draggable Signature Overlay Box */}
        <div
          onPointerDown={handlePointerDown}
          style={{
            left: `${posX}%`,
            top: `${posY}%`,
            width: `${widthPercent}%`,
          }}
          className={`absolute cursor-grab active:cursor-grabbing border-2 border-dashed border-emerald-500 bg-emerald-500/10 rounded-lg p-1 transition-shadow ${
            isDragging ? 'shadow-2xl ring-4 ring-emerald-400/40 border-emerald-600 scale-105' : 'hover:border-emerald-600'
          }`}
        >
          <img
            src={signatureDataUrl}
            alt="Tanda tangan"
            className="w-full h-auto object-contain pointer-events-none drop-shadow-sm"
          />
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap">
            Geser TTD
          </div>
        </div>
      </div>
    </div>
  );
};
