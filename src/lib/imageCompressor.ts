/**
 * Compress an image File or DataURL using HTML5 Canvas.
 * Returns a lightweight JPEG data URL (~50KB-120KB) that renders instantly
 * and fits easily within browser localStorage.
 */
export function compressImageFile(
  file: File, 
  maxWidth = 800, 
  maxHeight = 800, 
  quality = 0.82
): Promise<string> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve('');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        resolve('');
        return;
      }

      // SVG files can be used directly as base64 or data URLs without canvas rasterization
      if (file.type.includes('svg')) {
        resolve(dataUrl);
        return;
      }

      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Fill white background for transparent PNG conversion to JPEG
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(dataUrl);
        }
      };

      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    };

    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}
