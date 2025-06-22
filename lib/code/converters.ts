export const convertCode = async (file: File, outputFormat: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        const content = reader.result as string;
        let convertedContent: string;
        
        // Parse input based on file type
        let data: any;
        const fileName = file.name.toLowerCase();
        
        if (fileName.endsWith('.json') || file.type === 'application/json') {
          data = JSON.parse(content);
        } else if (fileName.endsWith('.csv') || file.type === 'text/csv') {
          // Simple CSV parser
          const lines = content.trim().split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          data = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim());
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = values[index] || '';
            });
            return obj;
          });
        } else if (fileName.endsWith('.xml') || file.type === 'application/xml' || file.type === 'text/xml') {
          // Simple XML to object conversion (basic implementation)
          data = { xml: content };
        } else if (fileName.endsWith('.yaml') || fileName.endsWith('.yml')) {
          // Simple YAML parser (basic implementation)
          const lines = content.trim().split('\n');
          data = {};
          lines.forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
              data[key.trim()] = valueParts.join(':').trim();
            }
          });
        } else {
          throw new Error('Unsupported input format');
        }
        
        // Convert to output format
        switch (outputFormat) {
          case 'json':
            convertedContent = JSON.stringify(data, null, 2);
            break;
            
          case 'csv':
            if (Array.isArray(data)) {
              const headers = Object.keys(data[0] || {});
              const csvLines = [headers.join(',')];
              data.forEach(item => {
                const values = headers.map(header => item[header] || '');
                csvLines.push(values.join(','));
              });
              convertedContent = csvLines.join('\n');
            } else {
              // Convert object to CSV
              const entries = Object.entries(data);
              convertedContent = 'Key,Value\n' + entries.map(([k, v]) => `${k},${v}`).join('\n');
            }
            break;
            
          case 'xml':
            const convertToXml = (obj: unknown, rootName = 'root'): string => {
              if (typeof obj === 'string') return obj;
              if (typeof obj !== 'object' || obj === null) return String(obj);
              
              let xml = `<${rootName}>`;
              if (Array.isArray(obj)) {
                obj.forEach((item, index) => {
                  xml += convertToXml(item, 'item');
                });
              } else {
                Object.entries(obj).forEach(([key, value]) => {
                  xml += `<${key}>${convertToXml(value, key)}</${key}>`;
                });
              }
              xml += `</${rootName}>`;
              return xml;
            };
            convertedContent = convertToXml(data, 'root');
            break;
            
          case 'yaml':
            const convertToYaml = (obj: unknown, indent = 0): string => {
              const spaces = '  '.repeat(indent);
              if (typeof obj === 'string') return obj;
              if (typeof obj !== 'object' || obj === null) return String(obj);
              
              let yaml = '';
              if (Array.isArray(obj)) {
                obj.forEach(item => {
                  yaml += `${spaces}- ${convertToYaml(item, indent + 1)}\n`;
                });
              } else {
                Object.entries(obj).forEach(([key, value]) => {
                  if (typeof value === 'object' && value !== null) {
                    yaml += `${spaces}${key}:\n${convertToYaml(value, indent + 1)}`;
                  } else {
                    yaml += `${spaces}${key}: ${convertToYaml(value, indent)}\n`;
                  }
                });
              }
              return yaml;
            };
            convertedContent = convertToYaml(data);
            break;
            
          default:
            throw new Error(`Unsupported output format: ${outputFormat}`);
        }
        
        const blob = new Blob([convertedContent], { 
          type: outputFormat === 'json' ? 'application/json' : 'text/plain' 
        });
        resolve(blob);
      } catch (error) {
        reject(new Error(error instanceof Error ? error.message : 'Failed to convert file'));
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