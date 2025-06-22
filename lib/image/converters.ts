export const convertImage = async (file: File, outputFormat: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const mimeType = outputFormat === 'jpeg' ? 'image/jpeg' : 
                      outputFormat === 'png' ? 'image/png' :
                      outputFormat === 'webp' ? 'image/webp' :
                      outputFormat === 'gif' ? 'image/gif' :
                      outputFormat === 'bmp' ? 'image/bmp' : 'image/png';
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert image'));
        }
      }, mimeType, 0.9);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const downloadFile = (job: { file: File; result?: Blob; outputFormat: string }) => {
  if (!job.result) return;

  const url = URL.createObjectURL(job.result);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${job.file.name.split('.')[0]}.${job.outputFormat}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};