'use client';

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
import { AppSidebar } from "@/components/app-sidebar"
import { Card } from "@/components/ui/card"
import { FileText } from "lucide-react"
import Link from "next/link"

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col p-4">
          <div className="w-full">
            <h1 className="text-2xl font-bold mb-6">Welcome to Financial Reader</h1>
            <p className="text-gray-600 mb-8">
              Access and analyze financial statements with ease.
            </p>
            <div className="grid gap-4">
              <Link href="/dashboard/financial-statement">
                <Card className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Financial Statement Reader</h2>
                      <p className="text-sm text-gray-500">
                        Upload and navigate through financial statements with table of contents support
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
