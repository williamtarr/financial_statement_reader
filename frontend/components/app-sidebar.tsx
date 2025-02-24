"use client"

import * as React from "react"
import { Command, Home, FileText } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { TocNavigation } from "./TocNavigation"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  }
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentPage?: number;
  onPageSelect?: (page: number) => void;
  isDocumentLoaded?: boolean;
  isLoading?: boolean;
}

export function AppSidebar({ 
  currentPage = 1, 
  onPageSelect, 
  isDocumentLoaded = false,
  isLoading = false,
  ...props 
}: AppSidebarProps) {
  const { setOpen } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    {
      title: "Home",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "Financial Statement",
      icon: FileText,
      href: "/dashboard/financial-statement",
    }
  ]

  const renderSidebarContent = () => {
    if (pathname !== "/dashboard/financial-statement") {
      return (
        <div className="p-4">
          <h2 className="text-sm font-medium mb-2">Welcome to Financial Reader</h2>
          <p className="text-sm text-gray-500">
            Navigate to Financial Statement to view and analyze financial documents.
          </p>
        </div>
      )
    }

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-4" />
          <p className="text-sm text-gray-500">Loading document...</p>
        </div>
      )
    }

    if (!isDocumentLoaded) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4">
          <FileText className="h-8 w-8 text-gray-400 mb-4" />
          <p className="text-sm text-gray-500">Upload a document to view its contents</p>
        </div>
      )
    }

    return (
      <div className="p-2">
        {onPageSelect && <TocNavigation onPageSelect={onPageSelect} currentPage={currentPage} />}
      </div>
    )
  }

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      {/* First sidebar - Icon bar */}
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="/dashboard">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Financial Reader</span>
                    <span className="truncate text-xs">Dashboard</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        router.push(item.href)
                        setOpen(true)
                      }}
                      isActive={pathname === item.href}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>

      {/* Second sidebar - Table of Contents */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">
              {pathname === "/dashboard/financial-statement" ? "Table of Contents" : "Dashboard"}
            </div>
          </div>
          {pathname === "/dashboard/financial-statement" && isDocumentLoaded && (
            <SidebarInput placeholder="Search in document..." />
          )}
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {renderSidebarContent()}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}
