'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { Card } from "@/components/ui/card";

interface FileUploadProps {
  onFileUpload?: (data: any) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [excelData, setExcelData] = useState<any>(null);
  const [fileName, setFileName] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        setExcelData(jsonData);
        if (onFileUpload) {
          onFileUpload(jsonData);
        }
      } catch (error) {
        console.error('Error processing file:', error);
      }
    };
    reader.readAsBinaryString(file);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={`p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {isDragActive
              ? 'Drop the Excel file here'
              : 'Drag and drop an Excel file here, or click to select one'}
          </p>
          {fileName && (
            <p className="mt-2 text-sm text-blue-600">Selected file: {fileName}</p>
          )}
        </div>
      </div>

      {excelData && (
        <Card className="p-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody>
              {excelData.map((row: any[], rowIndex: number) => (
                <tr key={rowIndex} className={rowIndex === 0 ? 'bg-gray-50' : ''}>
                  {row.map((cell: any, cellIndex: number) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-2 text-sm text-gray-900 border"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
} 