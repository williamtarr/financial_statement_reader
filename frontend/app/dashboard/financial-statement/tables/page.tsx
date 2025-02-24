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
import { ArrowLeft, RefreshCw, X } from "lucide-react";
import { TableView } from "@/components/TableView";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

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
  },
  58: {
    "Consolidated Statements of Operations (as a percentage of revenue)": {
      "2022": {
        "Revenue": "100%",
        "Cost of revenue (exclusive of depreciation and amortization)": "54%",
        "Sales and marketing": "26%",
        "Research and development": "13%",
        "General and administrative": "17%",
        "Depreciation and amortization": "6%",
        "Restructuring charges": "1%",
        "Total costs and expenses": "117%",
        "Loss from operations": "(17%)",
        "Interest income, net": "1%",
        "Other expense, net": "(5%)",
        "Income (loss) before income taxes": "(21%)",
        "Provision for (benefit from) income taxes": "0%",
        "Net income (loss) including redeemable non-controlling interests": "(21%)",
        "Less: Net loss attributable to redeemable non-controlling interests": "0%",
        "Net income (loss) attributable to DoorDash, Inc. common stockholders": "(21%)"
      },
      "2023": {
        "Revenue": "100%",
        "Cost of revenue (exclusive of depreciation and amortization)": "53%",
        "Sales and marketing": "22%",
        "Research and development": "12%",
        "General and administrative": "14%",
        "Depreciation and amortization": "6%",
        "Restructuring charges": "0%",
        "Total costs and expenses": "107%",
        "Loss from operations": "(7%)",
        "Interest income, net": "2%",
        "Other expense, net": "(1%)",
        "Income (loss) before income taxes": "(6%)",
        "Provision for (benefit from) income taxes": "0%",
        "Net income (loss) including redeemable non-controlling interests": "(6%)",
        "Less: Net loss attributable to redeemable non-controlling interests": "0%",
        "Net income (loss) attributable to DoorDash, Inc. common stockholders": "(6%)"
      },
      "2024": {
        "Revenue": "100%",
        "Cost of revenue (exclusive of depreciation and amortization)": "52%",
        "Sales and marketing": "19%",
        "Research and development": "11%",
        "General and administrative": "14%",
        "Depreciation and amortization": "5%",
        "Restructuring charges": "0%",
        "Total costs and expenses": "101%",
        "Loss from operations": "(1%)",
        "Interest income, net": "2%",
        "Other expense, net": "0%",
        "Income (loss) before income taxes": "1%",
        "Provision for (benefit from) income taxes": "0%",
        "Net income (loss) including redeemable non-controlling interests": "1%",
        "Less: Net loss attributable to redeemable non-controlling interests": "0%",
        "Net income (loss) attributable to DoorDash, Inc. common stockholders": "1%"
      }
    },
    "Revenue Comparison": {
      "2022": {
        "Revenue": "$6,583"
      },
      "2023": {
        "Revenue": "$8,635"
      },
      "2024": {
        "Revenue": "$10,722",
        "$ Change": "$2,087",
        "% Change": "24%"
      }
    }
  },
  59: {
    "Cost of Revenue Comparison": {
      "2022": {
        "Cost of Revenue": "$3,588"
      },
      "2023": {
        "Cost of Revenue": "$4,589"
      },
      "2024": {
        "Cost of Revenue": "$5,542",
        "$ Change": "$953",
        "% Change": "21%"
      }
    },
    "Sales and Marketing Comparison": {
      "2022": {
        "Sales and Marketing": "$1,682"
      },
      "2023": {
        "Sales and Marketing": "$1,876"
      },
      "2024": {
        "Sales and Marketing": "$2,037",
        "$ Change": "$161",
        "% Change": "9%"
      }
    },
    "Research and Development Comparison": {
      "2022": {
        "Research and Development": "$829"
      },
      "2023": {
        "Research and Development": "$1,003"
      },
      "2024": {
        "Research and Development": "$1,168",
        "$ Change": "$165",
        "% Change": "16%"
      }
    }
  },
  60: {
    "General and Administrative Comparison": {
      "2022": {
        "General and Administrative": "$1,147"
      },
      "2023": {
        "General and Administrative": "$1,235"
      },
      "2024": {
        "General and Administrative": "$1,452",
        "$ Change": "$217",
        "% Change": "18%"
      }
    },
    "Depreciation and Amortization Comparison": {
      "2022": {
        "Depreciation and Amortization": "$369"
      },
      "2023": {
        "Depreciation and Amortization": "$509"
      },
      "2024": {
        "Depreciation and Amortization": "$561",
        "$ Change": "$52",
        "% Change": "10%"
      }
    },
    "Restructuring Charges Comparison": {
      "2022": {
        "Restructuring Charges": "$92"
      },
      "2023": {
        "Restructuring Charges": "$2"
      },
      "2024": {
        "Restructuring Charges": "$0",
        "$ Change": "($2)",
        "% Change": "*Not meaningful*"
      }
    },
    "Interest Income Comparison": {
      "2022": {
        "Interest Income, Net": "$30"
      },
      "2023": {
        "Interest Income, Net": "$152"
      },
      "2024": {
        "Interest Income, Net": "$199",
        "$ Change": "$47",
        "% Change": "31%"
      }
    },
    "Other Expense Comparison": {
      "2022": {
        "Other Expense, Net": "($305)"
      },
      "2023": {
        "Other Expense, Net": "($107)"
      },
      "2024": {
        "Other Expense, Net": "($5)",
        "$ Change": "$102",
        "% Change": "(95%)"
      }
    }
  },
  61: {
    "Provision for Income Taxes Comparison": {
      "2022": {
        "Provision for (Benefit from) Income Taxes": "($31)"
      },
      "2023": {
        "Provision for (Benefit from) Income Taxes": "$31"
      },
      "2024": {
        "Provision for (Benefit from) Income Taxes": "$39",
        "$ Change": "$8",
        "% Change": "*Not meaningful*"
      }
    }
  },
  62: {
    "Adjusted Cost of Revenue": {
      "2022": {
        "Cost of Revenue (exclusive of depreciation and amortization)": "$3,588",
        "Stock-Based Compensation & Payroll Tax Expense": "($103)",
        "Allocated Overhead": "($32)",
        "Inventory Write-Off Related to Restructuring": "($2)",
        "Adjusted Cost of Revenue": "$3,451"
      },
      "2023": {
        "Cost of Revenue (exclusive of depreciation and amortization)": "$4,589",
        "Stock-Based Compensation & Payroll Tax Expense": "($140)",
        "Allocated Overhead": "($32)",
        "Inventory Write-Off Related to Restructuring": "N/A",
        "Adjusted Cost of Revenue": "$4,417"
      },
      "2024": {
        "Cost of Revenue (exclusive of depreciation and amortization)": "$5,542",
        "Stock-Based Compensation & Payroll Tax Expense": "($153)",
        "Allocated Overhead": "($35)",
        "Inventory Write-Off Related to Restructuring": "N/A",
        "Adjusted Cost of Revenue": "$5,354"
      }
    },
    "Adjusted Sales and Marketing Expense": {
      "2022": {
        "Sales and Marketing": "$1,682",
        "Stock-Based Compensation & Payroll Tax Expense": "($98)",
        "Allocated Overhead": "($19)",
        "Adjusted Sales and Marketing Expense": "$1,565"
      },
      "2023": {
        "Sales and Marketing": "$1,876",
        "Stock-Based Compensation & Payroll Tax Expense": "($119)",
        "Allocated Overhead": "($21)",
        "Adjusted Sales and Marketing Expense": "$1,736"
      },
      "2024": {
        "Sales and Marketing": "$2,037",
        "Stock-Based Compensation & Payroll Tax Expense": "($118)",
        "Allocated Overhead": "($25)",
        "Adjusted Sales and Marketing Expense": "$1,894"
      }
    }
  },
  63: {
    "Adjusted Research and Development Expense": {
      "2022": {
        "Research and Development": "$829",
        "Stock-Based Compensation & Payroll Tax Expense": "($366)",
        "Allocated Overhead": "($16)",
        "Adjusted Research and Development Expense": "$447"
      },
      "2023": {
        "Research and Development": "$1,003",
        "Stock-Based Compensation & Payroll Tax Expense": "($470)",
        "Allocated Overhead": "($16)",
        "Adjusted Research and Development Expense": "$517"
      },
      "2024": {
        "Research and Development": "$1,168",
        "Stock-Based Compensation & Payroll Tax Expense": "($507)",
        "Allocated Overhead": "($23)",
        "Adjusted Research and Development Expense": "$638"
      }
    },
    "Adjusted General and Administrative Expense": {
      "2022": {
        "General and Administrative": "$1,147",
        "Stock-Based Compensation & Payroll Tax Expense": "($313)",
        "Legal, Tax, and Regulatory Settlements": "($72)",
        "Transaction-Related Costs": "($68)",
        "Office Lease Impairment Expenses": "($2)",
        "Allocated Overhead": "$67",
        "Adjusted General and Administrative Expense": "$759"
      },
      "2023": {
        "General and Administrative": "$1,235",
        "Stock-Based Compensation & Payroll Tax Expense": "($365)",
        "Legal, Tax, and Regulatory Settlements": "($162)",
        "Transaction-Related Costs": "($2)",
        "Office Lease Impairment Expenses": "N/A",
        "Allocated Overhead": "$69",
        "Adjusted General and Administrative Expense": "$775"
      },
      "2024": {
        "General and Administrative": "$1,452",
        "Stock-Based Compensation & Payroll Tax Expense": "($329)",
        "Legal, Tax, and Regulatory Settlements": "($180)",
        "Transaction-Related Costs": "($7)",
        "Office Lease Impairment Expenses": "($83)",
        "Allocated Overhead": "$83",
        "Adjusted General and Administrative Expense": "$936"
      }
    }
  },
  64: {
    "Contribution Profit": {
      "2022": {
        "Revenue": "$6,583",
        "Cost of Revenue (exclusive of depreciation and amortization)": "($3,588)",
        "Depreciation and Amortization Related to Cost of Revenue": "($171)",
        "Gross Profit": "$2,824",
        "Gross Margin": "42.9%",
        "Sales and Marketing": "($1,682)",
        "Contribution Profit": "$1,567",
        "Contribution Margin": "23.8%"
      },
      "2023": {
        "Revenue": "$8,635",
        "Cost of Revenue (exclusive of depreciation and amortization)": "($4,589)",
        "Depreciation and Amortization Related to Cost of Revenue": "($186)",
        "Gross Profit": "$3,860",
        "Gross Margin": "44.7%",
        "Sales and Marketing": "($1,876)",
        "Contribution Profit": "$2,482",
        "Contribution Margin": "28.7%"
      },
      "2024": {
        "Revenue": "$10,722",
        "Cost of Revenue (exclusive of depreciation and amortization)": "($5,542)",
        "Depreciation and Amortization Related to Cost of Revenue": "($201)",
        "Gross Profit": "$4,979",
        "Gross Margin": "46.4%",
        "Sales and Marketing": "($2,037)",
        "Contribution Profit": "$3,474",
        "Contribution Margin": "32.4%"
      }
    },
    "Adjusted Gross Profit": {
      "2022": {
        "Gross Profit": "$2,824",
        "Depreciation and Amortization Related to Cost of Revenue": "$171",
        "Stock-Based Compensation & Payroll Tax Expense": "$103",
        "Allocated Overhead": "$32",
        "Inventory Write-Off Related to Restructuring": "$2",
        "Adjusted Gross Profit": "$3,132",
        "Adjusted Gross Margin": "47.6%"
      },
      "2023": {
        "Gross Profit": "$3,860",
        "Depreciation and Amortization Related to Cost of Revenue": "$186",
        "Stock-Based Compensation & Payroll Tax Expense": "$140",
        "Allocated Overhead": "$32",
        "Inventory Write-Off Related to Restructuring": "N/A",
        "Adjusted Gross Profit": "$4,218",
        "Adjusted Gross Margin": "48.8%"
      },
      "2024": {
        "Gross Profit": "$4,979",
        "Depreciation and Amortization Related to Cost of Revenue": "$201",
        "Stock-Based Compensation & Payroll Tax Expense": "$153",
        "Allocated Overhead": "$35",
        "Inventory Write-Off Related to Restructuring": "N/A",
        "Adjusted Gross Profit": "$5,368",
        "Adjusted Gross Margin": "50.1%"
      }
    }
  },
  65: {
    "Net Income and Adjusted EBITDA": {
      "2022": {
        "Net Income (Loss) Attributable to DoorDash, Inc. Common Stockholders": "($1,365)",
        "Net Loss Attributable to Redeemable Non-Controlling Interests": "($3)",
        "Net Income (Loss) Including Redeemable Non-Controlling Interests": "($1,368)",
        "Certain Legal, Tax, and Regulatory Settlements, Reserves, and Expenses": "$72",
        "Transaction-Related Costs": "$68",
        "Office Lease Impairment Expenses": "$2",
        "Restructuring Charges": "$92",
        "Inventory Write-Off Related to Restructuring": "$2",
        "Provision for (Benefit from) Income Taxes": "($31)",
        "Interest Income, Net": "($30)",
        "Other Expense, Net": "$305",
        "Stock-Based Compensation Expense and Certain Payroll Tax Expense": "$880",
        "Depreciation and Amortization Expense": "$369",
        "Adjusted EBITDA": "$361"
      },
      "2023": {
        "Net Income (Loss) Attributable to DoorDash, Inc. Common Stockholders": "($558)",
        "Net Loss Attributable to Redeemable Non-Controlling Interests": "($7)",
        "Net Income (Loss) Including Redeemable Non-Controlling Interests": "($565)",
        "Certain Legal, Tax, and Regulatory Settlements, Reserves, and Expenses": "$162",
        "Transaction-Related Costs": "$2",
        "Office Lease Impairment Expenses": "N/A",
        "Restructuring Charges": "$2",
        "Inventory Write-Off Related to Restructuring": "N/A",
        "Provision for (Benefit from) Income Taxes": "$31",
        "Interest Income, Net": "($152)",
        "Other Expense, Net": "$107",
        "Stock-Based Compensation Expense and Certain Payroll Tax Expense": "$1,094",
        "Depreciation and Amortization Expense": "$509",
        "Adjusted EBITDA": "$1,190"
      },
      "2024": {
        "Net Income (Loss) Attributable to DoorDash, Inc. Common Stockholders": "$123",
        "Net Loss Attributable to Redeemable Non-Controlling Interests": "N/A",
        "Net Income (Loss) Including Redeemable Non-Controlling Interests": "$117",
        "Certain Legal, Tax, and Regulatory Settlements, Reserves, and Expenses": "$180",
        "Transaction-Related Costs": "N/A",
        "Office Lease Impairment Expenses": "($83)",
        "Restructuring Charges": "N/A",
        "Inventory Write-Off Related to Restructuring": "N/A",
        "Provision for (Benefit from) Income Taxes": "$39",
        "Interest Income, Net": "($199)",
        "Other Expense, Net": "N/A",
        "Stock-Based Compensation Expense and Certain Payroll Tax Expense": "$1,107",
        "Depreciation and Amortization Expense": "$561",
        "Adjusted EBITDA": "$1,900"
      }
    },
    "Free Cash Flow": {
      "2022": {
        "Net Cash Provided by Operating Activities": "$367",
        "Purchases of Property and Equipment": "($176)",
        "Capitalized Software and Website Development Costs": "($170)",
        "Free Cash Flow": "$21"
      },
      "2023": {
        "Net Cash Provided by Operating Activities": "$1,673",
        "Purchases of Property and Equipment": "($123)",
        "Capitalized Software and Website Development Costs": "($201)",
        "Free Cash Flow": "$1,349"
      },
      "2024": {
        "Net Cash Provided by Operating Activities": "$2,132",
        "Purchases of Property and Equipment": "($104)",
        "Capitalized Software and Website Development Costs": "($226)",
        "Free Cash Flow": "$1,802"
      }
    }
  },
  67: {
    "Cash Flow Summary": {
      "2022": {
        "Net Cash Provided by Operating Activities": "$367",
        "Net Cash Used in Investing Activities": "($300)",
        "Net Cash Used in Financing Activities": "($375)",
        "Foreign Currency Effect on Cash, Cash Equivalents, and Restricted Cash": "($10)",
        "Net Increase (Decrease) in Cash, Cash Equivalents, and Restricted Cash": "($318)"
      },
      "2023": {
        "Net Cash Provided by Operating Activities": "$1,673",
        "Net Cash Used in Investing Activities": "($342)",
        "Net Cash Used in Financing Activities": "($752)",
        "Foreign Currency Effect on Cash, Cash Equivalents, and Restricted Cash": "$5",
        "Net Increase (Decrease) in Cash, Cash Equivalents, and Restricted Cash": "$584"
      },
      "2024": {
        "Net Cash Provided by Operating Activities": "$2,132",
        "Net Cash Used in Investing Activities": "($444)",
        "Net Cash Used in Financing Activities": "($204)",
        "Foreign Currency Effect on Cash, Cash Equivalents, and Restricted Cash": "($35)",
        "Net Increase (Decrease) in Cash, Cash Equivalents, and Restricted Cash": "$1,449"
      }
    }
  },
  74: {
    "Balance Sheet - Assets": {
      "2023": {
        "Current Assets": "",
        "Cash and Cash Equivalents": "$2,656",
        "Restricted Cash": "$105",
        "Short-Term Marketable Securities": "$1,422",
        "Funds Held at Payment Processors": "$356",
        "Accounts Receivable, Net": "$533",
        "Prepaid Expenses and Other Current Assets": "$525",
        "Total Current Assets": "$5,597",
        "Long-Term Assets": "",
        "Long-Term Marketable Securities": "$583",
        "Operating Lease Right-of-Use Assets": "$436",
        "Property and Equipment, Net": "$712",
        "Intangible Assets, Net": "$659",
        "Goodwill": "$2,432",
        "Other Assets": "$420",
        "Total Assets": "$10,839"
      },
      "2024": {
        "Current Assets": "",
        "Cash and Cash Equivalents": "$4,019",
        "Restricted Cash": "$190",
        "Short-Term Marketable Securities": "$1,322",
        "Funds Held at Payment Processors": "$436",
        "Accounts Receivable, Net": "$732",
        "Prepaid Expenses and Other Current Assets": "$687",
        "Total Current Assets": "$7,386",
        "Long-Term Assets": "",
        "Long-Term Marketable Securities": "$835",
        "Operating Lease Right-of-Use Assets": "$389",
        "Property and Equipment, Net": "$778",
        "Intangible Assets, Net": "$510",
        "Goodwill": "$2,315",
        "Other Assets": "$632",
        "Total Assets": "$12,845"
      }
    },
    "Balance Sheet - Liabilities and Stockholders' Equity": {
      "2023": {
        "Current Liabilities": "",
        "Accounts Payable": "$216",
        "Current Operating Lease Liabilities": "$68",
        "Accrued Expenses and Other Current Liabilities": "$3,126",
        "Total Current Liabilities": "$3,410",
        "Non-Current Liabilities": "",
        "Non-Current Operating Lease Liabilities": "$454",
        "Other Liabilities": "$162",
        "Total Liabilities": "$4,026",
        "Redeemable Non-Controlling Interests": "$7",
        "Stockholders' Equity": "",
        "Additional Paid-in Capital": "$11,887",
        "Accumulated Other Comprehensive Income (Loss)": "$73",
        "Accumulated Deficit": "($5,154)",
        "Total Stockholders' Equity": "$6,806",
        "Total Liabilities and Stockholders' Equity": "$10,839"
      },
      "2024": {
        "Current Liabilities": "",
        "Accounts Payable": "$321",
        "Current Operating Lease Liabilities": "$68",
        "Accrued Expenses and Other Current Liabilities": "$4,049",
        "Total Current Liabilities": "$4,438",
        "Non-Current Liabilities": "",
        "Non-Current Operating Lease Liabilities": "$468",
        "Other Liabilities": "$129",
        "Total Liabilities": "$5,035",
        "Redeemable Non-Controlling Interests": "$0",
        "Stockholders' Equity": "",
        "Additional Paid-in Capital": "$13,165",
        "Accumulated Other Comprehensive Income (Loss)": "($107)",
        "Accumulated Deficit": "($5,255)",
        "Total Stockholders' Equity": "$7,803",
        "Total Liabilities and Stockholders' Equity": "$12,845"
      }
    }
  }
};

interface NumberConnection {
  value: string;
  connections: {
    pageNumber: number;
    tableTitle: string;
    metric: string;
    year: string;
  }[];
  changes?: {
    hasChanges: boolean;
    changeType: 'increase' | 'decrease' | null;
  };
}

interface NumberGroup {
  id: string;
  numbers: NumberConnection[];
  color: string;
}

export default function TablesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [key, setKey] = useState(0);
  const startPage = parseInt(searchParams.get('start') || '1');
  const endPage = parseInt(searchParams.get('end') || '1');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [numberGroups, setNumberGroups] = useState<NumberGroup[]>([]);

  // Array of colors for different groups
  const groupColors = [
    'blue',
    'green',
    'purple',
    'orange',
    'pink',
    'teal',
    'indigo',
    'rose'
  ];

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

  const handleNumberClick = (
    value: string,
    pageNumber: number,
    tableTitle: string,
    metric: string,
    year: string
  ) => {
    // Find matching numbers across all tables
    const matchingNumbers = findMatchingNumbers(value);
    
    if (selectedGroup) {
      // Add to existing group
      setNumberGroups(prev => prev.map(group => {
        if (group.id === selectedGroup) {
          // Check if this number or any matching number is already in the group
          const existingNumberIndex = group.numbers.findIndex(n => 
            matchingNumbers.some(match => match.value === n.value)
          );

          if (existingNumberIndex >= 0) {
            // Add all new matching numbers to the existing number's connections
            const updatedNumbers = [...group.numbers];
            const existingNumber = updatedNumbers[existingNumberIndex];
            
            matchingNumbers.forEach(match => {
              match.connections.forEach(conn => {
                const connectionExists = existingNumber.connections.some(c => 
                  c.pageNumber === conn.pageNumber && 
                  c.tableTitle === conn.tableTitle && 
                  c.metric === conn.metric && 
                  c.year === conn.year
                );
                
                if (!connectionExists) {
                  existingNumber.connections.push(conn);
                }
              });
            });
            
            return { ...group, numbers: updatedNumbers };
          } else {
            // Add all matching numbers as a new entry in the group
            return { 
              ...group, 
              numbers: [...group.numbers, ...matchingNumbers]
            };
          }
        }
        return group;
      }));
    } else {
      // Create new group with all matching numbers
      const newGroup: NumberGroup = {
        id: Math.random().toString(36).substr(2, 9),
        numbers: matchingNumbers,
        color: groupColors[numberGroups.length % groupColors.length]
      };
      setNumberGroups(prev => [...prev, newGroup]);
      setSelectedGroup(newGroup.id);
    }
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

  const findMatchingNumbers = (value: string) => {
    const matches: NumberConnection[] = [];
    const seenValues = new Set<string>();
    const targetValue = formatNumber(value);
    
    // Don't process empty or invalid numbers
    if (!targetValue) return matches;

    // Helper function to check if a value matches and hasn't been processed
    const shouldAddMatch = (val: string | number) => {
      const formattedVal = formatNumber(val);
      if (!formattedVal || seenValues.has(formattedVal)) return false;
      
      try {
        const num1 = parseFloat(formattedVal);
        const num2 = parseFloat(targetValue);
        return Math.abs(num1 - num2) < 0.000001;
      } catch {
        return false;
      }
    };

    // Search through all tables for matching numbers
    Object.entries(TABLE_DATA).forEach(([page, tables]) => {
      const typedTables = tables as Record<string, Record<string, Record<string, string | number>>>;
      Object.entries(typedTables).forEach(([tableTitle, data]) => {
        Object.entries(data).forEach(([year, metrics]) => {
          Object.entries(metrics).forEach(([metric, val]) => {
            if (shouldAddMatch(val)) {
              const formattedVal = formatNumber(val);
              seenValues.add(formattedVal);
              
              // Check for changes in the value across years
              const changes = detectChanges(formattedVal, tableTitle, metric, data);
              
              matches.push({
                value: formattedVal,
                connections: [{
                  pageNumber: parseInt(page),
                  tableTitle,
                  metric,
                  year
                }],
                changes
              });
            }
          });
        });
      });
    });

    return matches;
  };

  const detectChanges = (value: string, tableTitle: string, metric: string, data: Record<string, Record<string, string | number>>): { hasChanges: boolean; changeType: 'increase' | 'decrease' | null } | undefined => {
    const years = Object.keys(data).sort();
    if (years.length < 2) return undefined;

    const currentYear = years[years.length - 1];
    const previousYear = years[years.length - 2];

    const currentValue = parseFloat(formatNumber(data[currentYear][metric]));
    const previousValue = parseFloat(formatNumber(data[previousYear][metric]));

    if (isNaN(currentValue) || isNaN(previousValue)) return undefined;

    return {
      hasChanges: currentValue !== previousValue,
      changeType: currentValue > previousValue ? 'increase' : 'decrease'
    };
  };

  const getNumberHighlight = (value: string): string | null => {
    const formattedValue = formatNumber(value);
    if (!formattedValue) return null;
    
    for (const group of numberGroups) {
      if (group.numbers.some(n => {
        try {
          const num1 = parseFloat(n.value);
          const num2 = parseFloat(formattedValue);
          return Math.abs(num1 - num2) < 0.000001;
        } catch {
          return false;
        }
      })) {
        return group.color;
      }
    }
    return null;
  };

  const getNumberChanges = (value: string) => {
    const formattedValue = formatNumber(value);
    if (!formattedValue) return null;
    
    for (const group of numberGroups) {
      const matchingNumber = group.numbers.find(n => {
        try {
          const num1 = parseFloat(n.value);
          const num2 = parseFloat(formattedValue);
          return Math.abs(num1 - num2) < 0.000001;
        } catch {
          return false;
        }
      });
      
      if (matchingNumber?.changes) {
        return matchingNumber.changes;
      }
    }
    return null;
  };

  const removeFromGroup = (groupId: string, value: string, connection: any) => {
    setNumberGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        const updatedNumbers = group.numbers.map(n => {
          if (n.value === value) {
            const updatedConnections = n.connections.filter(c => 
              !(c.pageNumber === connection.pageNumber && 
                c.tableTitle === connection.tableTitle && 
                c.metric === connection.metric && 
                c.year === connection.year)
            );
            return updatedConnections.length > 0 
              ? { ...n, connections: updatedConnections }
              : null;
          }
          return n;
        }).filter(Boolean) as NumberConnection[];

        return updatedNumbers.length > 0 
          ? { ...group, numbers: updatedNumbers }
          : null;
      }
      return group;
    }).filter(Boolean) as NumberGroup[]);
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
              <BreadcrumbPage>All Financial Tables</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* PDF Viewer */}
        <ResizablePanel defaultSize={55} minSize={30}>
          <div className="h-full p-4">
            <Card className="h-[calc(100vh-120px)]">
              <iframe
                key={key}
                src={`${pdfUrl}#page=${startPage}`}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              />
            </Card>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Tables and Connections */}
        <ResizablePanel defaultSize={45} minSize={20}>
          <div className="h-full border-l bg-gray-50">
            <div className="p-4">
              {numberGroups.length > 0 && (
                <Card className="mb-4">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Number Groups</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedGroup(null)}
                        className={!selectedGroup ? 'bg-gray-100' : ''}
                      >
                        Clear Selection
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {numberGroups.map((group) => (
                        <div
                          key={group.id}
                          className={`p-3 rounded-lg border ${
                            selectedGroup === group.id ? 'ring-2' : ''
                          } ring-${group.color}-500`}
                          onClick={() => setSelectedGroup(group.id)}
                        >
                          {group.numbers.map((number, nIdx) => (
                            <div key={nIdx} className="mb-2">
                              <div className="font-medium text-sm mb-1">
                                Value: <span className="font-mono">{number.value}</span>
                              </div>
                              <div className="space-y-1">
                                {number.connections.map((conn, cIdx) => (
                                  <div
                                    key={cIdx}
                                    className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
                                  >
                                    <div>
                                      <div className="font-medium">{conn.tableTitle}</div>
                                      <div className="text-gray-600">
                                        Page {conn.pageNumber} • {conn.metric} • {conn.year}
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeFromGroup(group.id, number.value, conn);
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Tables</h2>
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
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="pr-4">
                  {Object.entries(TABLE_DATA)
                    .sort(([pageA], [pageB]) => parseInt(pageA) - parseInt(pageB))
                    .map(([page, data]) => (
                      <TableView
                        key={page}
                        pageNumber={parseInt(page)}
                        tableData={data}
                        onNumberClick={handleNumberClick}
                        getNumberHighlight={getNumberHighlight}
                        getNumberChanges={getNumberChanges}
                      />
                    ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
} 