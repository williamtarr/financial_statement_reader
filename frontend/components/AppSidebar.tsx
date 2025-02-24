'use client';

import { TocNavigation } from './TocNavigation';
import { Card } from './ui/card';
import { Sidebar } from './ui/sidebar';

interface AppSidebarProps {
  currentPage?: number;
  onPageSelect?: (page: number) => void;
}

export function AppSidebar({ currentPage = 1, onPageSelect }: AppSidebarProps) {
  return (
    <Sidebar>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Table of Contents</h2>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {onPageSelect && (
            <TocNavigation onPageSelect={onPageSelect} currentPage={currentPage} />
          )}
        </div>
      </div>
    </Sidebar>
  );
} 