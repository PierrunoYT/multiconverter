export interface ConversionJob {
  id: string;
  file: File;
  outputFormat: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: Blob;
  error?: string;
}

export const SUPPORTED_FORMATS = {
  input: ['text/plain', 'text/csv', 'application/json', 'text/html', 'text/css', 'text/javascript', 'application/xml', 'text/xml'],
  output: ['txt', 'csv', 'json', 'html', 'css', 'js', 'xml']
};