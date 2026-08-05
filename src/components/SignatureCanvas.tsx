import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Upload, RefreshCw } from 'lucide-react';

interface SignatureCanvasProps {
  onSaveSignature: (dataUrl: string) => void;
  savedDataUrl?: string;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  onSaveSignature,
  savedDataUrl,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTab, setActiveTab] = useState<'draw' | 'upload'>('draw');
  const [hasDrawn, setHasDrawn] = useState(false);
  const [penColor, setPenColor] = useState('#0f172a'); // Dark navy/black default
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize Canvas
  useEffect(() => {
    if (activeTab === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = penColor;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [activeTab, penColor]);

  // Mouse & Touch Drawing Handlers
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    setHasDrawn(true);
    draw(e);
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      setIsDrawing(false);
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onSaveSignature(dataUrl);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleClear = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
      }
      setHasDrawn(false);
      onSaveSignature('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          onSaveSignature(dataUrl);
          setHasDrawn(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Tanda Tangan Digital
        </label>
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('draw')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'draw'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Gambar
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'upload'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upload Gambar
          </button>
        </div>
      </div>

      {activeTab === 'draw' ? (
        <div className="space-y-3">
          <div className="relative bg-white rounded-xl border-2 border-dashed border-slate-300 overflow-hidden shadow-inner">
            <canvas
              ref={canvasRef}
              width={500}
              height={180}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onMouseMove={draw}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={draw}
              className="w-full h-44 touch-none cursor-crosshair"
            />
            {!hasDrawn && !savedDataUrl && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs font-medium">
                Goreskan tanda tangan Anda di sini (Mouse / Layar Sentuh)
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Tinta:</span>
              {['#0f172a', '#1e40af', '#dc2626'].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setPenColor(color)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    penColor === color ? 'scale-110 border-emerald-500' : 'border-white'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-rose-600 hover:border-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Bersihkan</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center bg-white rounded-xl border-2 border-dashed border-slate-300 space-y-3">
          <input
            ref={imageInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleImageUpload}
            className="hidden"
          />
          {savedDataUrl ? (
            <div className="space-y-3">
              <img
                src={savedDataUrl}
                alt="Signature preview"
                className="max-h-28 mx-auto object-contain border p-2 rounded-lg bg-slate-50"
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Ganti Gambar Tanda Tangan</span>
              </button>
            </div>
          ) : (
            <div
              onClick={() => imageInputRef.current?.click()}
              className="cursor-pointer space-y-2 select-none"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                Pilih gambar tanda tangan (PNG / JPG)
              </p>
              <p className="text-[11px] text-slate-400">
                Direkomendasikan berkas PNG berlatar transparan
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
