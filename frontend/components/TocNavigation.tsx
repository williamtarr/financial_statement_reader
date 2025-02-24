'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Table2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TocItem {
  title: string;
  page: number;
}

interface TocSection {
  title: string;
  items: TocItem[];
}

// Pages that contain tables
const PAGES_WITH_TABLES = new Set([
  55,57,58,59,60,61,62,63,64,65,67,74,75,76,77,78,79,82,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,108
]);

// Organize items into sections
const tocSections: TocSection[] = [
  {
    title: "Preliminary",
    items: [
      { title: "Cover", page: 1 },
      { title: "Table of Contents", page: 3 },
    ]
  },
  {
    title: "Part I",
    items: [
      { title: "Item 1. Business", page: 6 },
      { title: "Item 1A. Risk Factors", page: 10 },
      { title: "Item 1B. Unresolved Staff Comments", page: 49 },
      { title: "Item 1C. Cybersecurity", page: 49 },
      { title: "Item 2. Properties", page: 50 },
      { title: "Item 3. Legal Proceedings", page: 51 },
      { title: "Item 4. Mine Safety Disclosures", page: 52 },
    ]
  },
  {
    title: "Part II",
    items: [
      { title: "Item 5. Market for Registrant's Common Equity", page: 53 },
      { title: "Item 6. [Reserved]", page: 54 },
      { title: "Item 7. Management's Discussion and Analysis", page: 54 },
      { title: "Item 7A. Quantitative and Qualitative Disclosures", page: 69 },
      { title: "Item 8. Financial Statements and Supplementary Data", page: 71 },
      { title: "Item 9. Changes in and Disagreements With Accountants", page: 109 },
      { title: "Item 9A. Controls and Procedures", page: 109 },
      { title: "Item 9B. Other Information", page: 110 },
      { title: "Item 9C. Disclosure Regarding Foreign Jurisdictions", page: 110 },
    ]
  },
  {
    title: "Part III",
    items: [
      { title: "Item 10. Directors, Executive Officers and Corporate Governance", page: 111 },
      { title: "Item 11. Executive Compensation", page: 111 },
      { title: "Item 12. Security Ownership", page: 111 },
      { title: "Item 13. Certain Relationships and Related Transactions", page: 111 },
      { title: "Item 14. Principal Accountant Fees and Services", page: 111 },
    ]
  },
  {
    title: "Part IV",
    items: [
      { title: "Item 15. Exhibits and Financial Statement Schedules", page: 112 },
      { title: "Item 16. Form 10-K Summary", page: 114 },
      { title: "Signatures", page: 115 },
    ]
  }
];

interface TocNavigationProps {
  onPageSelect: (page: number) => void;
  currentPage: number;
}

export function TocNavigation({ onPageSelect, currentPage }: TocNavigationProps) {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "Preliminary": true,
    "Part I": true,
    "Part II": true,
    "Part III": true,
    "Part IV": true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Check if a range of pages contains any tables
  const hasTablesInRange = (startPage: number, endPage: number) => {
    for (let page = startPage; page <= endPage; page++) {
      if (PAGES_WITH_TABLES.has(page)) {
        return true;
      }
    }
    return false;
  };

  // Get the page range for an item (from its page to the next item's page - 1)
  const getItemPageRange = (section: TocSection, itemIndex: number) => {
    const currentPage = section.items[itemIndex].page;
    const nextItem = section.items[itemIndex + 1];
    const nextSection = tocSections[tocSections.findIndex(s => s.title === section.title) + 1];
    
    let endPage;
    if (nextItem) {
      endPage = nextItem.page - 1;
    } else if (nextSection && nextSection.items.length > 0) {
      endPage = nextSection.items[0].page - 1;
    } else {
      endPage = 115; // Last page of the document
    }
    
    return { startPage: currentPage, endPage };
  };

  // Get the first and last pages containing tables within a range
  const getTablePageRange = (startPage: number, endPage: number) => {
    let firstTablePage = endPage;
    let lastTablePage = startPage;
    
    for (let page = startPage; page <= endPage; page++) {
      if (PAGES_WITH_TABLES.has(page)) {
        firstTablePage = Math.min(firstTablePage, page);
        lastTablePage = Math.max(lastTablePage, page);
      }
    }
    
    return { firstTablePage, lastTablePage };
  };

  const handleTableClick = (startPage: number, endPage: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const { firstTablePage, lastTablePage } = getTablePageRange(startPage, endPage);
    router.push(`/dashboard/financial-statement/tables?start=${firstTablePage}&end=${lastTablePage}`);
  };

  return (
    <div className="space-y-2">
      {tocSections.map((section) => (
        <div key={section.title} className="space-y-1">
          <button
            onClick={() => toggleSection(section.title)}
            className="w-full flex items-center justify-between p-2 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span>{section.title}</span>
            {expandedSections[section.title] ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {expandedSections[section.title] && (
            <div className="ml-2 space-y-1">
              {section.items.map((item, index) => {
                const { startPage, endPage } = getItemPageRange(section, index);
                const containsTables = hasTablesInRange(startPage, endPage);
                
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <div
                      className={`flex-1 p-2 cursor-pointer rounded-lg transition-colors ${
                        currentPage === item.page
                          ? 'bg-blue-100 text-blue-900'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => onPageSelect(item.page)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{item.title}</span>
                        <span className="text-xs text-gray-500">p.{item.page}</span>
                      </div>
                    </div>
                    {containsTables && (
                      <div 
                        className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 cursor-pointer hover:bg-yellow-200 transition-colors"
                        onClick={(e) => handleTableClick(startPage, endPage, e)}
                        title={`View tables in pages ${startPage}-${endPage}`}
                      >
                        <Table2 className="h-4 w-4 text-yellow-600" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 