export interface ConversionJob {
  id: string;
  file: File;
  outputFormat: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: Blob;
  error?: string;
}

export const SUPPORTED_FORMATS = {
  input: ['application/json', 'application/xml', 'text/xml', 'text/csv', 'text/yaml', 'text/x-yaml', 'application/x-yaml'],
  output: ['json', 'xml', 'csv', 'yaml']
};