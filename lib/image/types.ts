export interface ConversionJob {
  id: string;
  file: File;
  outputFormat: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: Blob;
  error?: string;
}

export const SUPPORTED_FORMATS = {
  input: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff', 'image/svg+xml'],
  output: ['jpeg', 'png', 'webp', 'gif', 'bmp']
};