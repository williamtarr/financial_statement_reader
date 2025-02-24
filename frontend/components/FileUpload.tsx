'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface FileUploadProps {
  onFileUpload?: () => Promise<void>;
  onPageSelect?: (page: number) => void;
  onFileRemove?: () => void;
}

export function FileUpload({ onFileUpload, onPageSelect, onFileRemove }: FileUploadProps) {
  const [showPDF, setShowPDF] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    // Load saved PDF data from localStorage
    const savedPdfData = localStorage.getItem('pdfData');
    if (savedPdfData && !initialLoadDone.current) {
      try {
        const byteCharacters = atob(savedPdfData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setShowPDF(true);
        initialLoadDone.current = true;
        // Call onFileUpload without the loading animation
        onFileUpload?.();
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    }

    // Cleanup function to revoke object URL
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [onFileUpload]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    // Read file as base64 and store in localStorage
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      const base64Content = base64Data.split(',')[1];
      localStorage.setItem('pdfData', base64Content);
      
      // Create blob URL for display
      const blob = new Blob([file], { type: 'application/pdf' });
      const fileUrl = URL.createObjectURL(blob);
      setPdfUrl(fileUrl);
      
      if (onFileUpload) {
        await onFileUpload();
      }
      
      setShowPDF(true);
    };
    reader.readAsDataURL(file);
  }, [onFileUpload]);

  const handleRemoveFile = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setShowPDF(false);
    setPdfUrl('');
    localStorage.removeItem('pdfData');
    initialLoadDone.current = false;
    onFileRemove?.();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (onPageSelect) {
      onPageSelect(page);
    }
    if (iframeRef.current) {
      const pageHash = `#page=${page}`;
      iframeRef.current.src = `${pdfUrl}${pageHash}`;
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  if (!showPDF) {
    return (
      <div
        {...getRootProps()}
        className={`p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {isDragActive
              ? 'Drop the PDF file here'
              : 'Drag and drop a PDF file here, or click to select one'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleRemoveFile}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Remove Document
        </Button>
      </div>
      <div className="h-[calc(100vh-250px)]">
        <Card className="h-full p-4">
          <iframe
            ref={iframeRef}
            src={`${pdfUrl}#page=${currentPage}`}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          ></iframe>
        </Card>
      </div>
    </div>
  );
} 