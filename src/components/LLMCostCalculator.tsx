"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown, AlertCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LLMModel } from "@/lib/llm-cost-types";
import { PricingComparisonModal } from "./PricingComparisonModal";

interface LLMCostCalculatorProps {
  models: LLMModel[];
  isLoading: boolean;
  error?: string;
}

type SortField = "cost" | "provider" | "name";
type SortOrder = "asc" | "desc";

export function LLMCostCalculator({
  models,
  isLoading,
  error,
}: LLMCostCalculatorProps) {
  const [sortField, setSortField] = useState<SortField>("cost");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [showComparison, setShowComparison] = useState(false);

  const sortedModels = useMemo(() => {
    const sorted = [...models].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "cost":
          aValue = a.costPer1MTokens;
          bValue = b.costPer1MTokens;
          break;
        case "provider":
          aValue = a.provider;
          bValue = b.provider;
          break;
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return sorted;
  }, [models, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const SortButton = ({
    field,
    label,
  }: {
    field: SortField;
    label: string;
  }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-2 font-semibold text-sm hover:text-primary transition-colors"
    >
      {label}
      {sortField === field && (
        <ArrowUpDown
          className={`h-4 w-4 transition-transform ${
            sortOrder === "desc" ? "rotate-180" : ""
          }`}
        />
      )}
    </button>
  );

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // No models state
  if (!models || models.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No LLM models available at this time.</AlertDescription>
      </Alert>
    );
  }

  // Desktop table view
  return (
    <div className="space-y-6">
      {/* #TODO: Token costs data needs verification from official sources
          Currently disabled until accurate pricing data is available
          See: OPENROUTER_INTEGRATION.md for details
      
      {/* Compare Button */}
      {/* <div className="flex justify-end">
        <Button
          onClick={() => setShowComparison(true)}
          className="gap-2"
          variant="outline"
        >
          <TrendingUp className="h-4 w-4" />
          Compare with Real-Time Pricing
        </Button>
      </div> */}

      {/* Table for desktop */}
      {/* <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">
                <SortButton field="name" label="Model Name" />
              </th>
              <th className="text-left py-3 px-4">
                <SortButton field="provider" label="Provider" />
              </th>
              <th className="text-right py-3 px-4">
                <SortButton field="cost" label="Cost per 1M Tokens" />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedModels.map((model) => (
              <tr
                key={model.id}
                className="border-b hover:bg-muted/50 transition-colors"
              >
                <td className="py-3 px-4 font-medium">{model.name}</td>
                <td className="py-3 px-4 text-muted-foreground">
                  {model.provider}
                </td>
                <td className="py-3 px-4 text-right font-semibold">
                  ${model.costPer1MTokens.toFixed(4)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      {/* Card view for mobile */}
      {/* <div className="md:hidden grid grid-cols-1 gap-4">
        {sortedModels.map((model) => (
          <Card key={model.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{model.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Provider:</span>
                <span className="text-sm font-medium">{model.provider}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Cost per 1M Tokens:
                </span>
                <span className="text-sm font-semibold">
                  ${model.costPer1MTokens.toFixed(4)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div> */}

      {/* Sort controls for mobile */}
      {/* <div className="md:hidden flex gap-2 flex-wrap">
        <Button
          variant={sortField === "name" ? "default" : "outline"}
          size="sm"
          onClick={() => handleSort("name")}
        >
          Sort by Name
        </Button>
        <Button
          variant={sortField === "provider" ? "default" : "outline"}
          size="sm"
          onClick={() => handleSort("provider")}
        >
          Sort by Provider
        </Button>
        <Button
          variant={sortField === "cost" ? "default" : "outline"}
          size="sm"
          onClick={() => handleSort("cost")}
        >
          Sort by Cost
        </Button>
      </div> */}

      {/* Pricing Comparison Modal */}
      {/* <PricingComparisonModal
        open={showComparison}
        onOpenChange={setShowComparison}
      /> */}
      {/* END #TODO: Token costs section */}
    </div>
  );
}
