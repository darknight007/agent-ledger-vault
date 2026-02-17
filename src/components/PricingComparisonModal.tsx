/**
 * Pricing Comparison Modal
 * Displays real-time pricing data from official model provider sites
 * Shows top 10 models ranked by SWE benchmark performance
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, AlertCircle, TrendingUp, Zap } from 'lucide-react';
import {
  fetchRealtimePricing,
  RealtimePricingData,
} from '@/lib/realtime-pricing-service';

interface PricingComparisonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PricingComparisonModal({
  open,
  onOpenChange,
}: PricingComparisonModalProps) {
  const [pricingData, setPricingData] = useState<RealtimePricingData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'cost' | 'provider'>('cost');

  useEffect(() => {
    if (!open) return;

    const loadPricing = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchRealtimePricing();
        setPricingData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch pricing data'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadPricing();
  }, [open]);

  const sortedData = [...pricingData].sort((a, b) => {
    if (sortBy === 'cost') {
      return a.costPer1MTokens - b.costPer1MTokens;
    }
    return a.provider.localeCompare(b.provider);
  });

  const getProviderColor = (provider: string): string => {
    const colors: Record<string, string> = {
      OpenAI: 'bg-green-100 text-green-800',
      Anthropic: 'bg-orange-100 text-orange-800',
      Google: 'bg-blue-100 text-blue-800',
      'Meta (via Together AI)': 'bg-purple-100 text-purple-800',
      'Mistral AI': 'bg-red-100 text-red-800',
      xAI: 'bg-yellow-100 text-yellow-800',
      'Alibaba (via Together AI)': 'bg-pink-100 text-pink-800',
      Deepseek: 'bg-indigo-100 text-indigo-800',
    };
    return colors[provider] || 'bg-gray-100 text-gray-800';
  };

  const getProviderLink = (provider: string): string => {
    const links: Record<string, string> = {
      OpenAI: 'https://openai.com/pricing',
      Anthropic: 'https://www.anthropic.com/pricing',
      Google: 'https://ai.google.dev/pricing',
      'Meta (via Together AI)': 'https://www.together.ai/pricing',
      'Mistral AI': 'https://mistral.ai/pricing',
      xAI: 'https://x.ai/pricing',
      'Alibaba (via Together AI)': 'https://www.together.ai/pricing',
      Deepseek: 'https://platform.deepseek.com/pricing',
    };
    return links[provider] || '#';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Real-Time LLM Pricing Comparison
          </DialogTitle>
          <DialogDescription>
            Top 10 models ranked by SWE benchmark performance with current pricing
            from official provider sites
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin">
              <Zap className="h-8 w-8 text-accent" />
            </div>
            <span className="ml-3 text-muted-foreground">
              Fetching real-time pricing...
            </span>
          </div>
        ) : (
          <>
            <Tabs defaultValue="table" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="cards">Card View</TabsTrigger>
              </TabsList>

              <TabsContent value="table" className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={sortBy === 'cost' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('cost')}
                  >
                    Sort by Cost
                  </Button>
                  <Button
                    variant={sortBy === 'provider' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('provider')}
                  >
                    Sort by Provider
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold">
                          Model
                        </th>
                        <th className="text-left py-3 px-4 font-semibold">
                          Provider
                        </th>
                        <th className="text-right py-3 px-4 font-semibold">
                          Input Cost
                        </th>
                        <th className="text-right py-3 px-4 font-semibold">
                          Output Cost
                        </th>
                        <th className="text-right py-3 px-4 font-semibold">
                          Avg Cost
                        </th>
                        <th className="text-center py-3 px-4 font-semibold">
                          Link
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedData.map((model, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-border hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-3 px-4 font-medium">{model.model}</td>
                          <td className="py-3 px-4">
                            <Badge className={getProviderColor(model.provider)}>
                              {model.provider}
                            </Badge>
                          </td>
                          <td className="text-right py-3 px-4">
                            ${model.inputCostPer1MTokens.toFixed(4)}/1M
                          </td>
                          <td className="text-right py-3 px-4">
                            ${model.outputCostPer1MTokens.toFixed(4)}/1M
                          </td>
                          <td className="text-right py-3 px-4 font-semibold">
                            ${model.costPer1MTokens.toFixed(4)}/1M
                          </td>
                          <td className="text-center py-3 px-4">
                            <a
                              href={getProviderLink(model.provider)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="cards" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedData.map((model, idx) => (
                    <Card key={idx} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {model.model}
                            </CardTitle>
                            <Badge
                              className={`mt-2 ${getProviderColor(model.provider)}`}
                            >
                              {model.provider}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs text-muted-foreground">
                              Input Cost
                            </div>
                            <div className="font-semibold">
                              ${model.inputCostPer1MTokens.toFixed(4)}/1M
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">
                              Output Cost
                            </div>
                            <div className="font-semibold">
                              ${model.outputCostPer1MTokens.toFixed(4)}/1M
                            </div>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-border">
                          <div className="text-xs text-muted-foreground mb-1">
                            Average Cost
                          </div>
                          <div className="text-xl font-bold text-accent">
                            ${model.costPer1MTokens.toFixed(4)}/1M
                          </div>
                        </div>
                        <a
                          href={getProviderLink(model.provider)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors mt-2"
                        >
                          View Official Pricing
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Pricing data is fetched from OpenRouter API in real-time. Last updated:{' '}
                {pricingData[0]?.lastUpdated.toLocaleString() || 'N/A'}
              </AlertDescription>
            </Alert>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PricingComparisonModal;
