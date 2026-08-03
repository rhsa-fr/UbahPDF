import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Upload, Check, Trash2, Plus } from 'lucide-react';

interface CameraScannerProps {
  onPhotosCaptured: (files: File[]) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ onPhotosCaptured }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedImages, setCapturedImages] = useState<{ id: string; file: File; preview: string }[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Initialize camera stream
  const startCamera = async (mode: 'environment' | 'user' = 'environment') => {
    try {
      setCameraError(null);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError('Gagal mengakses kamera langsung. Anda tetap dapat mengambil foto via kamera HP atau galeri di bawah ini.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  // Capture photo from live video stream
  const capturePhotoFromVideo = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `scan_page_${capturedImages.length + 1}.jpg`, {
        type: 'image/jpeg',
      });
      const preview = URL.createObjectURL(blob);

      const newPhoto = {
        id: Math.random().toString(36).substring(2, 9),
        file,
        preview,
      };

      setCapturedImages((prev) => [...prev, newPhoto]);
    }, 'image/jpeg', 0.95);
  };

  // Handle native camera input capture (for mobile phones)
  const handleNativeFilesAdded = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    const newPhotos = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      preview: URL.createObjectURL(file),
    }));

    setCapturedImages((prev) => [...prev, ...newPhotos]);
  };

  const removeCapturedPhoto = (id: string) => {
    setCapturedImages((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleCameraFacing = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const handleFinishCapture = () => {
    if (capturedImages.length > 0) {
      onPhotosCaptured(capturedImages.map((p) => p.file));
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Live Camera Viewfinder Box */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-[4/3] max-h-[380px] flex items-center justify-center shadow-2xl">
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center p-6 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/20">
              <Camera className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-bold text-white">Kamera HP / Perangkat</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              {cameraError || 'Tekan tombol di bawah untuk menyalakan kamera HP atau upload dari galeri.'}
            </p>
          </div>
        )}

        {/* Viewfinder Bounding Guide Frame */}
        {cameraActive && (
          <div className="absolute inset-6 border-2 border-dashed border-cyan-400/60 rounded-xl pointer-events-none flex items-center justify-center">
            <span className="text-[11px] font-bold text-cyan-300 bg-slate-950/80 px-3 py-1 rounded-full border border-cyan-500/30">
              Posisikan Dokumen Kertas di Dalam Kotak Ini
            </span>
          </div>
        )}

        {/* Top Camera Controls Overlay */}
        {cameraActive && (
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              onClick={toggleCameraFacing}
              className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md text-white border border-slate-700 hover:bg-slate-800 transition-colors"
              title="Ganti Kamera Front/Back"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Camera Action Buttons & Native Inputs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Shutter Capture Button */}
          {cameraActive ? (
            <button
              onClick={capturePhotoFromVideo}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>Foto Dokumen</span>
            </button>
          ) : (
            <button
              onClick={() => startCamera(facingMode)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 transition-all"
            >
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>Buka Kamera Kamera HP</span>
            </button>
          )}

          {/* Native Mobile Camera File Input Button */}
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Kamera HP Native</span>
          </button>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleNativeFilesAdded}
            className="hidden"
          />

          {/* Gallery Upload Input */}
          <button
            onClick={() => galleryInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Pilih dari Galeri</span>
          </button>
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleNativeFilesAdded}
            className="hidden"
          />
        </div>

        {/* Process Captured Photos Trigger */}
        {capturedImages.length > 0 && (
          <button
            onClick={handleFinishCapture}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Proses {capturedImages.length} Halaman Foto</span>
          </button>
        )}
      </div>

      {/* Captured Pages Strip */}
      {capturedImages.length > 0 && (
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">
              Hasil Foto ({capturedImages.length} Halaman)
            </span>
            <button
              onClick={() => setCapturedImages([])}
              className="text-rose-400 hover:underline"
            >
              Hapus Semua Foto
            </button>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {capturedImages.map((imgObj, idx) => (
              <div
                key={imgObj.id}
                className="relative group w-20 h-24 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shrink-0"
              >
                <img
                  src={imgObj.preview}
                  alt={`Halaman ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 left-1 bg-slate-950/80 text-[10px] font-bold text-white px-1.5 py-0.5 rounded">
                  {idx + 1}
                </div>
                <button
                  onClick={() => removeCapturedPhoto(imgObj.id)}
                  className="absolute top-1 right-1 p-1 rounded bg-slate-950/80 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
