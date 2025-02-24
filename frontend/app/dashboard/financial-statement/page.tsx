'use client';

import { useState, useEffect } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { FileUpload } from "@/components/FileUpload"
import { AppSidebar } from "@/components/app-sidebar"

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if document was previously loaded
    const savedPdfUrl = localStorage.getItem('pdfUrl');
    if (savedPdfUrl) {
      setIsDocumentLoaded(true);
      // No need to simulate loading for cached document
      setIsLoading(false);
    }
  }, []);

  const handleFileUpload = async () => {
    if (!isDocumentLoaded) {
      setIsLoading(true);
      // Simulate loading time only for new uploads
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);
      setIsDocumentLoaded(true);
    }
  };

  const handleFileRemove = () => {
    setIsDocumentLoaded(false);
    setIsLoading(false);
    setCurrentPage(1);
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar 
        currentPage={currentPage} 
        onPageSelect={setCurrentPage}
        isDocumentLoaded={isDocumentLoaded}
        isLoading={isLoading}
      />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Financial Statement Reader</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col p-4">
          <div className="w-full">
            <h1 className="text-2xl font-bold mb-6">Financial Statement Reader</h1>
            <p className="text-gray-600 mb-8">
              Upload your financial statement PDF to view and navigate through its contents.
            </p>
            <FileUpload 
              onPageSelect={setCurrentPage} 
              onFileUpload={handleFileUpload}
              onFileRemove={handleFileRemove}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}