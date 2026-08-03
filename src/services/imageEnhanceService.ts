/**
 * Document Image Enhancement Service (CamScanner-like magic color and B&W filters)
 * Cleans paper background, removes shadows, and sharpens text to look brand new!
 */

export interface EnhanceOptions {
  filterMode: 'magic-color' | 'bw-clean' | 'grayscale' | 'original';
  brightness?: number; // -50 to 50
  contrast?: number; // -50 to 50
}

/**
 * Apply scan enhancement filter to an image File or DataURL using HTML5 Canvas
 */
export async function enhanceDocumentImage(
  imageSrc: string | File,
  options: EnhanceOptions
): Promise<string> {
  const { filterMode, brightness = 0, contrast = 0 } = options;

  // Load image onto Image element
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    if (typeof imageSrc === 'string') {
      img.src = imageSrc;
    } else {
      const reader = new FileReader();
      reader.onload = () => (img.src = reader.result as string);
      reader.readAsDataURL(imageSrc);
    }
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  canvas.width = img.width;
  canvas.height = img.height;

  // Draw original image
  ctx.drawImage(img, 0, 0);

  if (filterMode === 'original' && brightness === 0 && contrast === 0) {
    return canvas.toDataURL('image/jpeg', 0.95);
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Contrast factor calculation
  const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Apply basic brightness adjustment
    r = Math.min(255, Math.max(0, r + brightness));
    g = Math.min(255, Math.max(0, g + brightness));
    b = Math.min(255, Math.max(0, b + brightness));

    // Apply basic contrast adjustment
    r = Math.min(255, Math.max(0, contrastFactor * (r - 128) + 128));
    g = Math.min(255, Math.max(0, contrastFactor * (g - 128) + 128));
    b = Math.min(255, Math.max(0, contrastFactor * (b - 128) + 128));

    // Calculate luminance
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    if (filterMode === 'bw-clean') {
      // High-contrast B&W Binarization (Pure white paper background #FFFFFF, sharp black text #000000)
      const threshold = 160;
      const finalVal = luminance > threshold ? 255 : Math.max(0, luminance * 0.5);
      data[i] = finalVal;
      data[i + 1] = finalVal;
      data[i + 2] = finalVal;
    } else if (filterMode === 'magic-color') {
      // Magic Color (Magic Clean): Whitens paper background tint, boosts text vibrancy & contrast
      if (luminance > 140) {
        // Whiten grey/yellow paper background
        const boost = Math.min(255, (luminance - 140) * 1.8 + luminance);
        data[i] = Math.min(255, r * 0.4 + boost * 0.6);
        data[i + 1] = Math.min(255, g * 0.4 + boost * 0.6);
        data[i + 2] = Math.min(255, b * 0.4 + boost * 0.6);
      } else {
        // Darken text lines for crisp readability
        data[i] = Math.max(0, r * 0.75);
        data[i + 1] = Math.max(0, g * 0.75);
        data[i + 2] = Math.max(0, b * 0.75);
      }
    } else if (filterMode === 'grayscale') {
      // Clean Grayscale
      const gray = luminance > 160 ? 255 : luminance * 0.8;
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    } else {
      data[i] = r;
      data[i + 1] = g;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.95);
}

export interface Point2D {
  x: number;
  y: number;
}

/**
 * Perform 4-corner perspective transform (warp & straighten document)
 */
export async function warpPerspective(
  imageSrc: string | File,
  corners: [Point2D, Point2D, Point2D, Point2D]
): Promise<string> {
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    if (typeof imageSrc === 'string') {
      img.src = imageSrc;
    } else {
      const reader = new FileReader();
      reader.onload = () => (img.src = reader.result as string);
      reader.readAsDataURL(imageSrc);
    }
  });

  const [p0, p1, p2, p3] = corners;

  const widthA = Math.hypot(p1.x - p0.x, p1.y - p0.y);
  const widthB = Math.hypot(p2.x - p3.x, p2.y - p3.y);
  const targetWidth = Math.round(Math.max(widthA, widthB)) || 800;

  const heightA = Math.hypot(p3.x - p0.x, p3.y - p0.y);
  const heightB = Math.hypot(p2.x - p1.x, p2.y - p1.y);
  const targetHeight = Math.round(Math.max(heightA, heightB)) || 1100;

  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = img.width;
  srcCanvas.height = img.height;
  const srcCtx = srcCanvas.getContext('2d');
  if (!srcCtx) throw new Error('Canvas context failed');
  srcCtx.drawImage(img, 0, 0);

  const srcData = srcCtx.getImageData(0, 0, img.width, img.height);

  const dstCanvas = document.createElement('canvas');
  dstCanvas.width = targetWidth;
  dstCanvas.height = targetHeight;
  const dstCtx = dstCanvas.getContext('2d');
  if (!dstCtx) throw new Error('Canvas context failed');

  const dstData = dstCtx.createImageData(targetWidth, targetHeight);

  for (let v = 0; v < targetHeight; v++) {
    const vRatio = v / (targetHeight - 1 || 1);
    for (let u = 0; u < targetWidth; u++) {
      const uRatio = u / (targetWidth - 1 || 1);

      const topX = p0.x + uRatio * (p1.x - p0.x);
      const topY = p0.y + uRatio * (p1.y - p0.y);

      const botX = p3.x + uRatio * (p2.x - p3.x);
      const botY = p3.y + uRatio * (p2.y - p3.y);

      const srcX = Math.round(topX + vRatio * (botX - topX));
      const srcY = Math.round(topY + vRatio * (botY - topY));

      const dstIdx = (v * targetWidth + u) * 4;

      if (srcX >= 0 && srcX < img.width && srcY >= 0 && srcY < img.height) {
        const srcIdx = (srcY * img.width + srcX) * 4;
        dstData.data[dstIdx] = srcData.data[srcIdx];
        dstData.data[dstIdx + 1] = srcData.data[srcIdx + 1];
        dstData.data[dstIdx + 2] = srcData.data[srcIdx + 2];
        dstData.data[dstIdx + 3] = srcData.data[srcIdx + 3];
      }
    }
  }

  dstCtx.putImageData(dstData, 0, 0);
  return dstCanvas.toDataURL('image/jpeg', 0.95);
}
