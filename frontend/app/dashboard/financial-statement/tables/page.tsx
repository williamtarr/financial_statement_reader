'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { TableView } from "@/components/TableView";
import { ScrollArea } from "@/components/ui/scroll-area";

// This will be replaced with your complete table data
const TABLE_DATA: Record<number, any> = {
  55: {
    "Financial and Operational Highlights": {
      "2022": {
        "Total Orders": 1736,
        "Total Orders Y/Y Growth": "25%",
        "Marketplace GOV": "$53,414",
        "Marketplace GOV Y/Y Growth": "27%",
        "Revenue": "$6,583",
        "Revenue Y/Y Growth": "35%",
        "Net Revenue Margin": "12.3%",
        "GAAP Gross Profit": "$2,824",
        "GAAP Gross Profit as a % of Marketplace GOV": "5.3%",
        "Contribution Profit": "$1,567",
        "Contribution Profit as a % of Marketplace GOV": "2.9%",
        "GAAP Net Income (Loss) Attributable to DoorDash, Inc. Common Stockholders": "($1,365)",
        "GAAP Net Income (Loss) as a % of Marketplace GOV": "(2.6%)",
        "Adjusted EBITDA": "$361",
        "Adjusted EBITDA as a % of Marketplace GOV": "0.7%",
        "Weighted-Average Diluted Shares Outstanding": 371
      },
      "2023": {
        "Total Orders": 2161,
        "Total Orders Y/Y Growth": "24%",
        "Marketplace GOV": "$66,771",
        "Marketplace GOV Y/Y Growth": "25%",
        "Revenue": "$8,635",
        "Revenue Y/Y Growth": "31%",
        "Net Revenue Margin": "12.9%",
        "GAAP Gross Profit": "$3,860",
        "GAAP Gross Profit as a % of Marketplace GOV": "5.8%",
        "Contribution Profit": "$2,482",
        "Contribution Profit as a % of Marketplace GOV": "3.7%",
        "GAAP Net Income (Loss) Attributable to DoorDash, Inc. Common Stockholders": "($558)",
        "GAAP Net Income (Loss) as a % of Marketplace GOV": "(0.8%)",
        "Adjusted EBITDA": "$1,190",
        "Adjusted EBITDA as a % of Marketplace GOV": "1.8%",
        "Weighted-Average Diluted Shares Outstanding": 393
      },
      "2024": {
        "Total Orders": 2583,
        "Total Orders Y/Y Growth": "20%",
        "Marketplace GOV": "$80,231",
        "Marketplace GOV Y/Y Growth": "20%",
        "Revenue": "$10,722",
        "Revenue Y/Y Growth": "24%",
        "Net Revenue Margin": "13.4%",
        "GAAP Gross Profit": "$4,979",
        "GAAP Gross Profit as a % of Marketplace GOV": "6.2%",
        "Contribution Profit": "$3,474",
        "Contribution Profit as a % of Marketplace GOV": "4.3%",
        "GAAP Net Income (Loss) Attributable to DoorDash, Inc. Common Stockholders": "$123",
        "GAAP Net Income (Loss) as a % of Marketplace GOV": "0.2%",
        "Adjusted EBITDA": "$1,900",
        "Adjusted EBITDA as a % of Marketplace GOV": "2.4%",
        "Weighted-Average Diluted Shares Outstanding": 430
      }
    }
  },
  57: {
    "Consolidated Statements of Operations": {
      "2022": {
        "Revenue": "$6,583",
        "Cost of revenue (exclusive of depreciation and amortization)": "$3,588",
        "Sales and marketing": "$1,682",
        "Research and development": "$829",
        "General and administrative": "$1,147",
        "Depreciation and amortization": "$369",
        "Restructuring charges": "$92",
        "Total costs and expenses": "$7,707",
        "Loss from operations": "($1,124)",
        "Interest income, net": "$30",
        "Other expense, net": "($305)",
        "Income (loss) before income taxes": "($1,399)",
        "Provision for (benefit from) income taxes": "($31)",
        "Net income (loss) including redeemable non-controlling interests": "($1,368)",
        "Less: Net loss attributable to redeemable non-controlling interests": "($3)",
        "Net income (loss) attributable to DoorDash, Inc. common stockholders": "($1,365)"
      },
      "2023": {
        "Revenue": "$8,635",
        "Cost of revenue (exclusive of depreciation and amortization)": "$4,589",
        "Sales and marketing": "$1,876",
        "Research and development": "$1,003",
        "General and administrative": "$1,235",
        "Depreciation and amortization": "$509",
        "Restructuring charges": "$2",
        "Total costs and expenses": "$9,214",
        "Loss from operations": "($579)",
        "Interest income, net": "$152",
        "Other expense, net": "($107)",
        "Income (loss) before income taxes": "($534)",
        "Provision for (benefit from) income taxes": "$31",
        "Net income (loss) including redeemable non-controlling interests": "($565)",
        "Less: Net loss attributable to redeemable non-controlling interests": "($7)",
        "Net income (loss) attributable to DoorDash, Inc. common stockholders": "($558)"
      },
      "2024": {
        "Revenue": "$10,722",
        "Cost of revenue (exclusive of depreciation and amortization)": "$5,542",
        "Sales and marketing": "$2,037",
        "Research and development": "$1,168",
        "General and administrative": "$1,452",
        "Depreciation and amortization": "$561",
        "Restructuring charges": "$0",
        "Total costs and expenses": "$10,760",
        "Loss from operations": "($38)",
        "Interest income, net": "$199",
        "Other expense, net": "($5)",
        "Income (loss) before income taxes": "$156",
        "Provision for (benefit from) income taxes": "$39",
        "Net income (loss) including redeemable non-controlling interests": "$117",
        "Less: Net loss attributable to redeemable non-controlling interests": "($6)",
        "Net income (loss) attributable to DoorDash, Inc. common stockholders": "$123"
      }
    },
    "Stock-Based Compensation Expense": {
      "2022": {
        "Cost of revenue (exclusive of depreciation and amortization)": "$102",
        "Sales and marketing": "$98",
        "Research and development": "$365",
        "General and administrative": "$313",
        "Restructuring charges": "$11",
        "Total stock-based compensation expense": "$889"
      },
      "2023": {
        "Cost of revenue (exclusive of depreciation and amortization)": "$139",
        "Sales and marketing": "$119",
        "Research and development": "$466",
        "General and administrative": "$364",
        "Restructuring charges": "—",
        "Total stock-based compensation expense": "$1,088"
      },
      "2024": {
        "Cost of revenue (exclusive of depreciation and amortization)": "$151",
        "Sales and marketing": "$117",
        "Research and development": "$505",
        "General and administrative": "$326",
        "Restructuring charges": "—",
        "Total stock-based compensation expense": "$1,099"
      }
    },
    "Depreciation and Amortization": {
      "2022": {
        "Cost of revenue": "$171",
        "Sales and marketing": "$81",
        "Research and development": "$104",
        "General and administrative": "$13",
        "Total depreciation and amortization": "$369"
      },
      "2023": {
        "Cost of revenue": "$186",
        "Sales and marketing": "$125",
        "Research and development": "$185",
        "General and administrative": "$13",
        "Total depreciation and amortization": "$509"
      },
      "2024": {
        "Cost of revenue": "$201",
        "Sales and marketing": "$119",
        "Research and development": "$222",
        "General and administrative": "$19",
        "Total depreciation and amortization": "$561"
      }
    }
  }
};

export default function TablesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [key, setKey] = useState(0);
  const startPage = parseInt(searchParams.get('start') || '1');
  const endPage = parseInt(searchParams.get('end') || '1');

  useEffect(() => {
    const loadPdf = () => {
      const savedPdfData = localStorage.getItem('pdfData');
      if (savedPdfData) {
        try {
          // Convert base64 back to blob and create URL
          const byteCharacters = atob(savedPdfData);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
        } catch (error) {
          console.error('Error loading PDF:', error);
          router.push('/dashboard/financial-statement');
        }
      } else {
        router.push('/dashboard/financial-statement');
      }
    };

    loadPdf();

    // Cleanup function to revoke object URL
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [router]);

  const handleRefresh = () => {
    // Revoke old URL
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    
    // Reload PDF data and create new URL
    const savedPdfData = localStorage.getItem('pdfData');
    if (savedPdfData) {
      try {
        const byteCharacters = atob(savedPdfData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const newUrl = URL.createObjectURL(blob);
        setPdfUrl(newUrl);
        setKey(prev => prev + 1);
      } catch (error) {
        console.error('Error refreshing PDF:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-background sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b p-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard/financial-statement')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Full Document
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center gap-2"
            title="Refresh PDF View"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Document
          </Button>
        </div>
        <Separator
          orientation="vertical"
          className="mx-2 h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/financial-statement">Financial Statement</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Tables (Pages {startPage}-{endPage})</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex-1 flex">
        {/* PDF Viewer */}
        <div className="flex-1 p-4">
          <Card className="h-[calc(100vh-120px)]">
            <iframe
              key={key} // Add key to force refresh when it changes
              src={`${pdfUrl}#page=${startPage}`}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          </Card>
        </div>

        {/* Table Data Sidebar */}
        <div className="w-[600px] border-l bg-gray-50">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Tables</h2>
            <ScrollArea className="h-[calc(100vh-180px)]">
              {Object.entries(TABLE_DATA)
                .filter(([page]) => {
                  const pageNum = parseInt(page);
                  return pageNum >= startPage && pageNum <= endPage;
                })
                .map(([page, data]) => (
                  <TableView
                    key={page}
                    pageNumber={parseInt(page)}
                    tableData={data}
                  />
                ))}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
} 