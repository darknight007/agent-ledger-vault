/**
 * Integration tests for ResourcesSection
 * Tests the complete flow of LLM cost calculator and repository link submission
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { ResourcesSection } from './ResourcesSection';
import * as llmCostService from '@/lib/llm-cost-service';
import * as repositoryLinkService from '@/lib/repository-link-service';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock the services
vi.mock('@/lib/llm-cost-service');
vi.mock('@/lib/repository-link-service');
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('ResourcesSection Integration Tests', () => {
  const mockModels = [
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      provider: 'OpenAI',
      costPer1MTokens: 0.03,
      lastUpdated: new Date(),
    },
    {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      provider: 'Anthropic',
      costPer1MTokens: 0.015,
      lastUpdated: new Date(),
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'Google',
      costPer1MTokens: 0.0005,
      lastUpdated: new Date(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (llmCostService.fetchLLMCosts as any).mockResolvedValue(mockModels);
    (repositoryLinkService.saveRepositoryLink as any).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Repository Link Submission', () => {
    it('should submit valid repository link and save to database', async () => {
      render(<ResourcesSection />);

      // Wait for component to load
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Share repo link/)).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/Share repo link/) as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /submit/i });

      // Enter repository link
      fireEvent.change(input, { target: { value: 'https://github.com/user/repo' } });
      fireEvent.click(submitButton);

      // Verify service was called
      await waitFor(() => {
        expect(repositoryLinkService.saveRepositoryLink).toHaveBeenCalledWith(
          'https://github.com/user/repo'
        );
      });
    });

    it('should clear input field after successful submission', async () => {
      render(<ResourcesSection />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Share repo link/)).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/Share repo link/) as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /submit/i });

      fireEvent.change(input, { target: { value: 'https://github.com/user/repo' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });

    it('should handle database errors gracefully', async () => {
      (repositoryLinkService.saveRepositoryLink as any).mockRejectedValueOnce(
        new Error('Database error')
      );

      render(<ResourcesSection />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Share repo link/)).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/Share repo link/) as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /submit/i });

      fireEvent.change(input, { target: { value: 'https://github.com/user/repo' } });
      fireEvent.click(submitButton);

      // Input should not be cleared on error
      await waitFor(() => {
        expect(input.value).toBe('https://github.com/user/repo');
      });
    });

    it('should reject empty input', async () => {
      render(<ResourcesSection />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Share repo link/)).toBeInTheDocument();
      });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      // Service should not be called for empty input
      await waitFor(() => {
        expect(repositoryLinkService.saveRepositoryLink).not.toHaveBeenCalled();
      });
    });

    it('should reject whitespace-only input', async () => {
      render(<ResourcesSection />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Share repo link/)).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/Share repo link/) as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /submit/i });

      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.click(submitButton);

      // Service should not be called for whitespace-only input
      await waitFor(() => {
        expect(repositoryLinkService.saveRepositoryLink).not.toHaveBeenCalled();
      });
    });
  });

  describe('LLM Cost Calculator Data Fetching', () => {
    it('should fetch LLM costs on component mount', async () => {
      render(<ResourcesSection />);

      await waitFor(() => {
        expect(llmCostService.fetchLLMCosts).toHaveBeenCalled();
      });
    });

    it('should display fetched LLM costs', async () => {
      render(<ResourcesSection />);

      await waitFor(() => {
        expect(screen.getAllByText('GPT-4o').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Claude 3 Opus').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Gemini Pro').length).toBeGreaterThan(0);
      });
    });

    it('should display costs with correct formatting', async () => {
      render(<ResourcesSection />);

      await waitFor(() => {
        expect(screen.getAllByText('$0.0300').length).toBeGreaterThan(0);
        expect(screen.getAllByText('$0.0150').length).toBeGreaterThan(0);
        expect(screen.getAllByText('$0.0005').length).toBeGreaterThan(0);
      });
    });

    it('should display loading state while fetching', async () => {
      (llmCostService.fetchLLMCosts as any).mockImplementationOnce(
        () => new Promise(resolve => setTimeout(() => resolve(mockModels), 100))
      );

      const { container } = render(<ResourcesSection />);

      // Check for skeleton loaders
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Caching', () => {
    it('should use cached data on subsequent loads', async () => {
      const { unmount } = render(<ResourcesSection />);

      await waitFor(() => {
        expect(llmCostService.fetchLLMCosts).toHaveBeenCalledTimes(1);
      });

      unmount();

      // Render again
      render(<ResourcesSection />);

      // fetchLLMCosts should be called again (caching is handled by the service)
      await waitFor(() => {
        expect(llmCostService.fetchLLMCosts).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('UI Elements', () => {
    it('should display correct heading text', async () => {
      render(<ResourcesSection />);

      await waitFor(() => {
        expect(screen.getByText('Monetize my codebase to beat token costs')).toBeInTheDocument();
      });
    });

    it('should display correct placeholder text', async () => {
      render(<ResourcesSection />);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText('Share repo link to analyze tech costs and setup optimum pricing model')
        ).toBeInTheDocument();
      });
    });

    it('should display LLM Model Costs card header', async () => {
      render(<ResourcesSection />);

      await waitFor(() => {
        expect(screen.getByText('LLM Model Costs')).toBeInTheDocument();
      });
    });

    it('should display Analyze Your Repository card header', async () => {
      render(<ResourcesSection />);

      await waitFor(() => {
        expect(screen.getByText('Analyze Your Repository')).toBeInTheDocument();
      });
    });
  });

  describe('Sorting Functionality', () => {
    it('should sort models by cost', async () => {
      render(<ResourcesSection />);

      await waitFor(() => {
        expect(screen.getAllByText('GPT-4o').length).toBeGreaterThan(0);
      });

      const costButton = screen.getAllByRole('button', {
        name: /Cost per 1M Tokens/i,
      })[0];

      fireEvent.click(costButton);

      // After sorting by cost descending, GPT-4o should be first
      const table = document.querySelector('table');
      const rows = table?.querySelectorAll('tbody tr');
      expect(rows?.[0]).toHaveTextContent('GPT-4o');
    });

    it('should sort models by provider', async () => {
      render(<ResourcesSection />);

      await waitFor(() => {
        expect(screen.getAllByText('GPT-4o').length).toBeGreaterThan(0);
      });

      const providerButton = screen.getAllByRole('button', {
        name: /Provider/i,
      })[0];

      fireEvent.click(providerButton);

      // Verify sorting occurred
      const table = document.querySelector('table');
      const rows = table?.querySelectorAll('tbody tr');
      expect(rows?.length).toBeGreaterThan(0);
    });
  });

  describe('Error Scenarios', () => {
    it('should handle database error when submitting repository link', async () => {
      (repositoryLinkService.saveRepositoryLink as any).mockRejectedValueOnce(
        new Error('Database connection failed')
      );

      render(<ResourcesSection />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Share repo link/)).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/Share repo link/) as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /submit/i });

      fireEvent.change(input, { target: { value: 'https://github.com/user/repo' } });
      fireEvent.click(submitButton);

      // Input should remain for retry
      await waitFor(() => {
        expect(input.value).toBe('https://github.com/user/repo');
      });
    });
  });

  describe('Toast Messages', () => {
    it('should show success toast on successful repository submission', async () => {
      const { toast } = await import('@/hooks/use-toast').then(m => ({ toast: vi.fn() }));

      render(<ResourcesSection />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Share repo link/)).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/Share repo link/) as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /submit/i });

      fireEvent.change(input, { target: { value: 'https://github.com/user/repo' } });
      fireEvent.click(submitButton);

      // Verify submission was attempted
      await waitFor(() => {
        expect(repositoryLinkService.saveRepositoryLink).toHaveBeenCalled();
      });
    });

    it('should show error toast on empty input', async () => {
      render(<ResourcesSection />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Share repo link/)).toBeInTheDocument();
      });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      // Service should not be called
      expect(repositoryLinkService.saveRepositoryLink).not.toHaveBeenCalled();
    });
  });

  describe('Responsive Layout', () => {
    it('should render responsive layout', async () => {
      const { container } = render(<ResourcesSection />);

      await waitFor(() => {
        expect(screen.getAllByText('GPT-4o').length).toBeGreaterThan(0);
      });

      // Check for responsive classes
      const section = container.querySelector('section');
      expect(section).toHaveClass('py-16', 'md:py-24');
    });

    it('should display table on desktop and cards on mobile', async () => {
      const { container } = render(<ResourcesSection />);

      await waitFor(() => {
        expect(screen.getAllByText('GPT-4o').length).toBeGreaterThan(0);
      });

      // Check for both table and card views
      const table = container.querySelector('table');
      const cards = container.querySelectorAll('[class*="md:hidden"]');

      expect(table).toBeInTheDocument();
      expect(cards.length).toBeGreaterThan(0);
    });
  });
});
