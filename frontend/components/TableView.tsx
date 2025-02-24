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
import { ChevronDown, ChevronRight } from "lucide-react";

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

export function TableView({ pageNumber, tableData }: TableViewProps) {
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({});

  const toggleTable = (tableTitle: string) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableTitle]: !prev[tableTitle]
    }));
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Page {pageNumber}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(tableData).map(([tableTitle, tableContent]) => {
          const years = Object.keys(tableContent);
          const metrics = Object.keys(tableContent[years[0]]);
          const isExpanded = expandedTables[tableTitle] ?? false;

          return (
            <Collapsible
              key={tableTitle}
              open={isExpanded}
              onOpenChange={() => toggleTable(tableTitle)}
            >
              <CollapsibleTrigger className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100 transition-colors">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 mr-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-2" />
                )}
                <span className="font-medium">{tableTitle}</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
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
                              {tableContent[year][metric]}
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