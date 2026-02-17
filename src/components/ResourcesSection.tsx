"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LLMCostCalculator } from "@/components/LLMCostCalculator";
import { RepositoryLinkInput } from "@/components/RepositoryLinkInput";
import { fetchLLMCosts } from "@/lib/llm-cost-service";
import { saveRepositoryLink } from "@/lib/repository-link-service";
import { LLMModel } from "@/lib/llm-cost-types";

interface ResourcesSectionProps {
  // No required props - self-contained
}

export function ResourcesSection({}: ResourcesSectionProps) {
  const [models, setModels] = useState<LLMModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch LLM costs on component mount
  useEffect(() => {
    const loadLLMCosts = async () => {
      try {
        setIsLoading(true);
        setError(undefined);
        const costs = await fetchLLMCosts();
        setModels(costs);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unable to load LLM costs. Please refresh the page.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadLLMCosts();
  }, []);

  // Handle repository link submission
  const handleRepositorySubmit = async (link: string) => {
    setIsSubmitting(true);
    try {
      await saveRepositoryLink(link);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Monetize my codebase to beat token costs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compare LLM model costs and analyze your repository's tech stack
          </p>
        </div>

        {/* #TODO: LLM Model Costs section disabled - pricing data needs verification
            Currently commented out until accurate pricing data is available
            See: TOKEN_COSTS_DISABLED.md for details
        
        {/* LLM Cost Calculator */}
        {/* <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>LLM Model Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <LLMCostCalculator
                models={models}
                isLoading={isLoading}
                error={error}
              />
            </CardContent>
          </Card>
        </div> */}
        {/* END #TODO: LLM Model Costs section */}

        {/* Repository Link Input */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Analyze Your Repository</CardTitle>
            </CardHeader>
            <CardContent>
              <RepositoryLinkInput
                onSubmit={handleRepositorySubmit}
                isSubmitting={isSubmitting}
                placeholder="Share repo link to analyze tech costs and setup optimum pricing model"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
