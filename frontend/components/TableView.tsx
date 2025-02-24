'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronRight, Edit2, RotateCcw, Calculator, Check, X, Search } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";

interface TableData {
  [key: string]: {
    [year: string]: {
      [metric: string]: string | number;
    };
  };
}

interface TableViewProps {
  pageNumber: number;
  tableData: TableData;
  onNumberClick?: (value: string, pageNumber: number, tableTitle: string, metric: string, year: string) => void;
  getNumberHighlight?: (value: string) => string | null;
  getNumberChanges?: (value: string) => { hasChanges: boolean; changeType: 'increase' | 'decrease' | null } | null;
}

interface VerificationResult {
  isCorrect: boolean;
  discrepancies: {
    year: string;
    expected: number;
    calculated: number;
    metric: string;
  }[];
}

const parseNumber = (value: string | number): number => {
  if (typeof value === 'number') return value;
  
  // Remove commas and $ signs
  let cleanValue = value.replace(/,|\$/g, '');
  
  // Check if it's a percentage
  if (cleanValue.includes('%')) {
    cleanValue = cleanValue.replace('%', '');
    // If the number is in brackets, it's negative
    if (cleanValue.startsWith('(') && cleanValue.endsWith(')')) {
      cleanValue = cleanValue.slice(1, -1);
      return -parseFloat(cleanValue) / 100;
    }
    return parseFloat(cleanValue) / 100;
  }
  
  // If the number is in brackets, it's negative
  if (cleanValue.startsWith('(') && cleanValue.endsWith(')')) {
    cleanValue = cleanValue.slice(1, -1);
    return -parseFloat(cleanValue);
  }
  
  // Handle regular numbers
  return parseFloat(cleanValue);
};

export function TableView({ pageNumber, tableData, onNumberClick, getNumberHighlight, getNumberChanges }: TableViewProps) {
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({});
  const [editingTables, setEditingTables] = useState<Record<string, boolean>>({});
  const [modifiedData, setModifiedData] = useState<TableData>(tableData);
  const [originalData] = useState<TableData>(tableData);
  const [verificationResults, setVerificationResults] = useState<Record<string, VerificationResult>>({});
  const [verifyingTables, setVerifyingTables] = useState<Record<string, boolean>>({});

  // Auto-expand tables that contain matching numbers
  useEffect(() => {
    if (getNumberHighlight) {
      const tablesToExpand: Record<string, boolean> = {};
      
      Object.entries(tableData).forEach(([tableTitle, data]) => {
        // Check if this table contains any matching numbers
        const hasMatch = Object.entries(data).some(([year, yearData]) =>
          Object.entries(yearData).some(([metric, value]) => getNumberHighlight(value.toString()))
        );
        
        if (hasMatch) {
          tablesToExpand[tableTitle] = true;
        }
      });
      
      setExpandedTables(prev => ({
        ...prev,
        ...tablesToExpand
      }));
    }
  }, [getNumberHighlight, tableData]);

  const hasTotal = (tableTitle: string, data: any): boolean => {
    const years = Object.keys(data);
    if (years.length === 0) return false;
    
    const metrics = Object.keys(data[years[0]]);
    return metrics.some(metric => 
      metric.startsWith('Total') || 
      metric === 'Free Cash Flow' ||
      metric === 'Contribution Profit' ||
      metric === 'Adjusted EBITDA' ||
      metric.startsWith('Adjusted')
    );
  };

  const verifyTotals = async (tableTitle: string, data: any) => {
    setVerifyingTables(prev => ({ ...prev, [tableTitle]: true }));
    
    try {
      // Simulate some processing time
      await new Promise(resolve => setTimeout(resolve, 800));

      const years = Object.keys(data);
      const metrics = Object.keys(data[years[0]]);
      const result: VerificationResult = {
        isCorrect: true,
        discrepancies: []
      };

      years.forEach(year => {
        const yearData = data[year];
        
        metrics.forEach(metric => {
          if (metric.startsWith('Total') || 
              metric === 'Free Cash Flow' ||
              metric === 'Contribution Profit' ||
              metric === 'Adjusted EBITDA' ||
              metric.startsWith('Adjusted')) {
            
            let expectedTotal = parseNumber(yearData[metric]);
            let calculatedTotal = 0;
            let componentsToSum: string[] = [];

            if (metric === 'Total costs and expenses') {
              componentsToSum = [
                'Cost of revenue (exclusive of depreciation and amortization)',
                'Sales and marketing',
                'Research and development',
                'General and administrative',
                'Depreciation and amortization',
                'Restructuring charges'
              ];
            } else if (metric === 'Free Cash Flow') {
              calculatedTotal = parseNumber(yearData['Net Cash Provided by Operating Activities']) -
                              parseNumber(yearData['Purchases of Property and Equipment']) -
                              parseNumber(yearData['Capitalized Software and Website Development Costs']);
            } else if (metric === 'Total stock-based compensation expense') {
              componentsToSum = [
                'Cost of revenue (exclusive of depreciation and amortization)',
                'Sales and marketing',
                'Research and development',
                'General and administrative',
                'Restructuring charges'
              ];
            } else if (metric === 'Total depreciation and amortization') {
              componentsToSum = [
                'Cost of revenue',
                'Sales and marketing',
                'Research and development',
                'General and administrative'
              ];
            } else if (metric === 'Total Current Assets') {
              componentsToSum = [
                'Cash and Cash Equivalents',
                'Restricted Cash',
                'Short-Term Marketable Securities',
                'Funds Held at Payment Processors',
                'Accounts Receivable, Net',
                'Prepaid Expenses and Other Current Assets'
              ];
            } else if (metric === 'Total Current Liabilities') {
              componentsToSum = [
                'Accounts Payable',
                'Current Operating Lease Liabilities',
                'Accrued Expenses and Other Current Liabilities'
              ];
            } else if (metric === 'Total Liabilities') {
              componentsToSum = [
                'Total Current Liabilities',
                'Non-Current Operating Lease Liabilities',
                'Other Liabilities'
              ];
            } else if (metric === 'Total Assets') {
              componentsToSum = [
                'Total Current Assets',
                'Long-Term Marketable Securities',
                'Operating Lease Right-of-Use Assets',
                'Property and Equipment, Net',
                'Intangible Assets, Net',
                'Goodwill',
                'Other Assets'
              ];
            } else if (metric === "Total Stockholders' Equity") {
              componentsToSum = [
                'Additional Paid-in Capital',
                'Accumulated Other Comprehensive Income (Loss)',
                'Accumulated Deficit'
              ];
            }

            if (componentsToSum.length > 0) {
              calculatedTotal = componentsToSum.reduce((sum, component) => {
                if (yearData[component]) {
                  return sum + parseNumber(yearData[component]);
                }
                return sum;
              }, 0);
            }

            if (componentsToSum.length > 0 || metric === 'Free Cash Flow') {
              const difference = Math.abs(calculatedTotal - expectedTotal);
              if (difference > 0.01) {
                result.isCorrect = false;
                result.discrepancies.push({
                  year,
                  expected: expectedTotal,
                  calculated: calculatedTotal,
                  metric
                });
              }
            }
          }
        });
      });

      setVerificationResults(prev => ({
        ...prev,
        [tableTitle]: result
      }));
    } finally {
      setVerifyingTables(prev => ({ ...prev, [tableTitle]: false }));
    }
  };

  const toggleTable = (tableTitle: string) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableTitle]: !prev[tableTitle]
    }));
  };

  const toggleEditing = (tableTitle: string) => {
    if (!editingTables[tableTitle]) {
      if (!modifiedData[tableTitle]) {
        setModifiedData(prev => ({
          ...prev,
          [tableTitle]: JSON.parse(JSON.stringify(tableData[tableTitle]))
        }));
      }
    }
    setEditingTables(prev => ({
      ...prev,
      [tableTitle]: !prev[tableTitle]
    }));
  };

  const handleValueChange = (
    tableTitle: string,
    year: string,
    metric: string,
    value: string
  ) => {
    setModifiedData(prev => ({
      ...prev,
      [tableTitle]: {
        ...prev[tableTitle],
        [year]: {
          ...prev[tableTitle][year],
          [metric]: value
        }
      }
    }));
    // Clear verification results when data changes
    setVerificationResults(prev => {
      const newResults = { ...prev };
      delete newResults[tableTitle];
      return newResults;
    });
  };

  const revertTable = (tableTitle: string) => {
    setModifiedData(prev => {
      const newData = { ...prev };
      delete newData[tableTitle];
      return newData;
    });
    setEditingTables(prev => ({
      ...prev,
      [tableTitle]: false
    }));
    // Clear verification results
    setVerificationResults(prev => {
      const newResults = { ...prev };
      delete newResults[tableTitle];
      return newResults;
    });
  };

  const getCurrentData = (tableTitle: string) => {
    return modifiedData[tableTitle] || tableData[tableTitle];
  };

  const formatNumber = (value: string | number): string => {
    if (typeof value === 'number') return value.toString();
    
    // Handle empty or non-numeric values
    if (!value || value === 'N/A' || value === '—') return '';
    
    // Remove commas and $ signs
    let cleanValue = value.toString().replace(/,|\$/g, '');
    
    // Handle percentages
    if (cleanValue.includes('%')) {
      cleanValue = cleanValue.replace('%', '');
      // Handle negative percentages in brackets
      if (cleanValue.startsWith('(') && cleanValue.endsWith(')')) {
        cleanValue = '-' + cleanValue.slice(1, -1);
      }
      return (parseFloat(cleanValue) / 100).toString();
    }
    
    // Handle numbers in brackets (negative values)
    if (cleanValue.startsWith('(') && cleanValue.endsWith(')')) {
      cleanValue = '-' + cleanValue.slice(1, -1);
    }
    
    try {
      const num = parseFloat(cleanValue);
      // Check if it's a valid number
      if (isNaN(num)) return '';
      return num.toString();
    } catch {
      return '';
    }
  };

  const isMatchingValue = (value: string | number, targetValue: string): boolean => {
    const formattedValue = formatNumber(value);
    const formattedTarget = formatNumber(targetValue);
    
    // Don't match non-numeric values
    if (!formattedValue || !formattedTarget) return false;
    
    try {
      // Compare as numbers to handle different formats
      const valueNum = parseFloat(formattedValue);
      const targetNum = parseFloat(formattedTarget);
      
      // Check if the numbers are equal (using small epsilon for floating point comparison)
      return Math.abs(valueNum - targetNum) < 0.000001;
    } catch {
      return false;
    }
  };

  const getHighlightClasses = (value: string | number) => {
    if (!getNumberHighlight) return 'hover:bg-gray-100';
    
    const formattedValue = formatNumber(value);
    if (!formattedValue) return 'hover:bg-gray-100';
    
    const color = getNumberHighlight(formattedValue);
    if (!color) return 'hover:bg-gray-100';

    // Check for changes in the group
    const changes = getNumberChanges?.(formattedValue);
    if (changes?.hasChanges) {
      const changeClass = changes.changeType === 'increase' ? 'border-green-500' : 'border-red-500';
      return `bg-${color}-100 hover:bg-${color}-200 cursor-pointer transition-colors group border-2 ${changeClass}`;
    }
    
    return `bg-${color}-100 hover:bg-${color}-200 cursor-pointer transition-colors group`;
  };

  const handleNumberClick = (value: string | number, tableTitle: string, metric: string, year: string) => {
    if (onNumberClick) {
      const formattedValue = formatNumber(value);
      if (formattedValue) {
        onNumberClick(formattedValue, pageNumber, tableTitle, metric, year);
      }
    }
  };

  return (
    <Card className={`mb-4 ${Object.values(expandedTables).some(v => v) ? 'ring-1 ring-blue-200' : ''}`}>
      {Object.entries(tableData).map(([tableTitle, data]) => {
        const showVerify = hasTotal(tableTitle, data);
        const verificationResult = verificationResults[tableTitle];
        const currentData = modifiedData[tableTitle] || data;
        
        // Check if this table contains any matching numbers
        const hasMatch = Object.entries(data).some(([year, yearData]) =>
          Object.entries(yearData).some(([metric, value]) => getNumberHighlight?.(value.toString()))
        );

        return (
          <Collapsible
            key={tableTitle}
            open={expandedTables[tableTitle]}
            onOpenChange={(isOpen) => {
              setExpandedTables(prev => ({
                ...prev,
                [tableTitle]: isOpen
              }));
            }}
          >
            <div className={`flex items-center justify-between p-4 border-b ${hasMatch ? 'bg-gray-50' : ''}`}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex-1 flex items-center justify-between hover:bg-transparent p-0 h-auto"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="text-sm font-medium whitespace-nowrap">Page {pageNumber}</div>
                    <div className="text-lg font-semibold truncate">{tableTitle}</div>
                    {hasMatch && (
                      <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        Contains connected numbers
                      </div>
                    )}
                  </div>
                  {expandedTables[tableTitle] ? (
                    <ChevronDown className="h-4 w-4 ml-2 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 ml-2 shrink-0" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleEditing(tableTitle);
                  }}
                  className="shrink-0"
                >
                  {editingTables[tableTitle] ? (
                    <>
                      <RotateCcw className="h-4 w-4 mr-1" />
                      <span className="whitespace-nowrap">Revert Changes</span>
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4 mr-1" />
                      <span className="whitespace-nowrap">Edit Table</span>
                    </>
                  )}
                </Button>
                {showVerify && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      verifyTotals(tableTitle, currentData);
                    }}
                    disabled={verifyingTables[tableTitle]}
                    className="shrink-0"
                  >
                    {verifyingTables[tableTitle] ? (
                      <>
                        <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        <span className="whitespace-nowrap">Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Calculator className="h-4 w-4 mr-1" />
                        <span className="whitespace-nowrap">Verify Totals</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
            <CollapsibleContent>
              <div className="px-4 py-2">
                {verificationResult && (
                  <Alert className={`mb-4 ${verificationResult.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex items-center gap-2">
                      {verificationResult.isCorrect ? (
                        <>
                          <Check className="h-4 w-4 text-green-600 shrink-0" />
                          <AlertDescription className="text-green-600">
                            All totals are correct
                          </AlertDescription>
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 text-red-600 shrink-0" />
                          <AlertDescription className="text-red-600">
                            Found discrepancies in totals:
                            {verificationResult.discrepancies.map((d, i) => (
                              <div key={i} className="mt-1">
                                {d.metric} (Year {d.year}): Expected {d.expected.toFixed(2)} but calculated {d.calculated.toFixed(2)}
                              </div>
                            ))}
                          </AlertDescription>
                        </>
                      )}
                    </div>
                  </Alert>
                )}
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-3 font-medium whitespace-nowrap sticky left-0 bg-gray-50">Metric</th>
                        {Object.keys(data).map(year => (
                          <th key={year} className="text-right p-3 font-medium whitespace-nowrap">{year}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(data[Object.keys(data)[0]]).map(([metric]) => (
                        <tr key={metric} className="border-b last:border-0">
                          <td className={`p-3 sticky left-0 ${metric === '' ? 'font-semibold bg-gray-50' : 'bg-white'}`}>
                            {metric === '' ? 'Section Header' : metric}
                          </td>
                          {Object.keys(data).map(year => {
                            const value = currentData[year][metric];
                            return editingTables[tableTitle] ? (
                              <td key={year} className="p-3">
                                <Input
                                  type="text"
                                  value={value}
                                  onChange={(e) => handleValueChange(tableTitle, year, metric, e.target.value)}
                                  className="text-right w-full"
                                />
                              </td>
                            ) : (
                              <td
                                key={year}
                                onClick={() => handleNumberClick(value, tableTitle, metric, year)}
                                className={`text-right p-3 whitespace-nowrap cursor-pointer transition-colors
                                  ${metric === '' ? 'font-semibold bg-gray-50' : ''}
                                  ${getHighlightClasses(value)}
                                  ${typeof value === 'string' && value.startsWith('$') ? 'font-mono' : ''}`}
                              >
                                <div className="flex items-center justify-end gap-1">
                                  <span>{value}</span>
                                  {typeof value !== 'string' || (value.startsWith('$') || value.includes('%')) && (
                                    <Search className="h-3 w-3 opacity-0 group-hover:opacity-50" />
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </Card>
  );
} 