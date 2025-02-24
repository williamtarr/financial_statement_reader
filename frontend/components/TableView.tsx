'use client';

import { useState } from 'react';
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
import { ChevronDown, ChevronRight, Edit2, RotateCcw, Calculator, Check, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
}

interface VerificationResult {
  isCorrect: boolean;
  discrepancies: {
    year: string;
    expected: number;
    calculated: number;
  }[];
}

export function TableView({ pageNumber, tableData }: TableViewProps) {
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({});
  const [editingTables, setEditingTables] = useState<Record<string, boolean>>({});
  const [modifiedData, setModifiedData] = useState<TableData>({});
  const [originalData] = useState<TableData>(tableData);
  const [verificationResults, setVerificationResults] = useState<Record<string, VerificationResult>>({});

  const hasTotal = (tableTitle: string, data: any) => {
    const metrics = Object.keys(data[Object.keys(data)[0]]);
    return metrics.some(metric => 
      metric.toLowerCase().includes('total') || 
      metric.toLowerCase().includes('adjusted') ||
      metric === 'Free Cash Flow' ||
      metric === 'Contribution Profit' ||
      metric === 'Adjusted EBITDA'
    );
  };

  const parseNumber = (value: string | number): number => {
    if (typeof value === 'number') return value;
    // Remove $ and , and convert percentages
    const cleanValue = value.replace(/[$,]/g, '');
    if (cleanValue === 'N/A' || cleanValue === '—') return 0;
    if (cleanValue.includes('%')) {
      return parseFloat(cleanValue) / 100;
    }
    return parseFloat(cleanValue.replace(/[()]/g, '')) * (value.includes('(') ? -1 : 1);
  };

  const verifyTotals = (tableTitle: string, data: any) => {
    const years = Object.keys(data);
    const metrics = Object.keys(data[years[0]]);
    const result: VerificationResult = {
      isCorrect: true,
      discrepancies: []
    };

    years.forEach(year => {
      const yearData = data[year];
      
      // Check for different types of totals
      metrics.forEach(metric => {
        if (metric.startsWith('Total') || 
            metric === 'Free Cash Flow' ||
            metric === 'Contribution Profit' ||
            metric === 'Adjusted EBITDA' ||
            metric.startsWith('Adjusted')) {
          
          let expectedTotal = parseNumber(yearData[metric]);
          let calculatedTotal = 0;
          let componentsToSum: string[] = [];

          // Determine which items to sum based on the total type
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
          }

          if (componentsToSum.length > 0) {
            calculatedTotal = componentsToSum.reduce((sum, component) => {
              if (yearData[component]) {
                return sum + parseNumber(yearData[component]);
              }
              return sum;
            }, 0);
          }

          // Compare totals if we have components to sum
          if (componentsToSum.length > 0 || metric === 'Free Cash Flow') {
            const difference = Math.abs(calculatedTotal - expectedTotal);
            if (difference > 0.01) { // Allow for small rounding differences
              result.isCorrect = false;
              result.discrepancies.push({
                year,
                expected: expectedTotal,
                calculated: calculatedTotal
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

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Page {pageNumber}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(tableData).map(([tableTitle, tableContent]) => {
          const currentData = getCurrentData(tableTitle);
          const years = Object.keys(currentData);
          const metrics = Object.keys(currentData[years[0]]);
          const isExpanded = expandedTables[tableTitle] ?? false;
          const isEditing = editingTables[tableTitle] ?? false;
          const isModified = modifiedData[tableTitle] !== undefined;
          const showVerify = hasTotal(tableTitle, currentData);
          const verificationResult = verificationResults[tableTitle];

          return (
            <Collapsible
              key={tableTitle}
              open={isExpanded}
              onOpenChange={() => toggleTable(tableTitle)}
            >
              <div className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <CollapsibleTrigger className="flex items-center flex-1">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 mr-2" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-2" />
                  )}
                  <span className="font-medium">{tableTitle}</span>
                </CollapsibleTrigger>
                <div className="flex gap-2">
                  {showVerify && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        verifyTotals(tableTitle, currentData);
                      }}
                    >
                      <Calculator className="h-4 w-4 mr-1" />
                      Verify Totals
                    </Button>
                  )}
                  <Button
                    variant={isEditing ? "secondary" : "outline"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleEditing(tableTitle);
                    }}
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    {isEditing ? "Done" : "Edit"}
                  </Button>
                  {isModified && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        revertTable(tableTitle);
                      }}
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Revert
                    </Button>
                  )}
                </div>
              </div>
              <CollapsibleContent className="pt-2">
                {verificationResult && (
                  <Alert className={`mb-4 ${verificationResult.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex items-center gap-2">
                      {verificationResult.isCorrect ? (
                        <>
                          <Check className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-600">
                            All totals are correct
                          </AlertDescription>
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-600">
                            Found discrepancies in totals:
                            {verificationResult.discrepancies.map((d, i) => (
                              <div key={i} className="mt-1">
                                Year {d.year}: Expected {d.expected.toFixed(2)} but calculated {d.calculated.toFixed(2)}
                              </div>
                            ))}
                          </AlertDescription>
                        </>
                      )}
                    </div>
                  </Alert>
                )}
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Metric</TableHead>
                        {years.map(year => (
                          <TableHead key={year}>{year}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {metrics.map(metric => (
                        <TableRow key={metric}>
                          <TableCell className="font-medium">{metric}</TableCell>
                          {years.map(year => (
                            <TableCell key={year}>
                              {isEditing ? (
                                <Input
                                  value={currentData[year][metric]}
                                  onChange={(e) => handleValueChange(
                                    tableTitle,
                                    year,
                                    metric,
                                    e.target.value
                                  )}
                                  className="h-8 w-32"
                                />
                              ) : (
                                currentData[year][metric]
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </CardContent>
    </Card>
  );
} 