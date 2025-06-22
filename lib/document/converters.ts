export const convertDocument = async (file: File, outputFormat: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        const content = reader.result as string;
        let convertedContent: string;
        
        switch (outputFormat) {
          case 'json':
            // Convert CSV to JSON
            if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
              const lines = content.trim().split('\n');
              const headers = lines[0].split(',').map(h => h.trim());
              const jsonData = lines.slice(1).map(line => {
                const values = line.split(',').map(v => v.trim());
                const obj: any = {};
                headers.forEach((header, index) => {
                  obj[header] = values[index] || '';
                });
                return obj;
              });
              convertedContent = JSON.stringify(jsonData, null, 2);
            } else {
              // Convert plain text to JSON
              convertedContent = JSON.stringify({ content: content }, null, 2);
            }
            break;
            
          case 'csv':
            // Convert JSON to CSV or keep as CSV
            if (file.type === 'application/json' || file.name.endsWith('.json')) {
              try {
                const data = JSON.parse(content);
                if (Array.isArray(data) && data.length > 0) {
                  const headers = Object.keys(data[0]);
                  const csvLines = [headers.join(',')];
                  data.forEach(item => {
                    const values = headers.map(header => item[header] || '');
                    csvLines.push(values.join(','));
                  });
                  convertedContent = csvLines.join('\n');
                } else {
                  convertedContent = 'data\n' + JSON.stringify(data);
                }
              } catch {
                convertedContent = 'content\n' + content;
              }
            } else {
              convertedContent = content;
            }
            break;
            
          case 'html':
            convertedContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Converted Document</title>
</head>
<body>
    <pre>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body>
</html>`;
            break;
            
          default:
            convertedContent = content;
            break;
        }
        
        const mimeType = outputFormat === 'json' ? 'application/json' :
                        outputFormat === 'html' ? 'text/html' :
                        outputFormat === 'css' ? 'text/css' :
                        outputFormat === 'js' ? 'text/javascript' :
                        outputFormat === 'xml' ? 'application/xml' :
                        'text/plain';
        
        const blob = new Blob([convertedContent], { type: mimeType });
        resolve(blob);
      } catch (error) {
        reject(new Error(error instanceof Error ? error.message : 'Failed to convert document'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
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