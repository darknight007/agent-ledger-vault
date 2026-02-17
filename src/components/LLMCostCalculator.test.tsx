import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LLMCostCalculator } from "./LLMCostCalculator";
import { LLMModel } from "@/lib/llm-cost-types";

describe("LLMCostCalculator", () => {
  const mockModels: LLMModel[] = [
    {
      id: "gpt-4o",
      name: "GPT-4o",
      provider: "OpenAI",
      costPer1MTokens: 0.03,
      lastUpdated: new Date(),
    },
    {
      id: "claude-3-opus",
      name: "Claude 3 Opus",
      provider: "Anthropic",
      costPer1MTokens: 0.015,
      lastUpdated: new Date(),
    },
    {
      id: "gemini-pro",
      name: "Gemini Pro",
      provider: "Google",
      costPer1MTokens: 0.0005,
      lastUpdated: new Date(),
    },
  ];

  describe("data display", () => {
    it("should display all models with their costs", () => {
      const { container } = render(
        <LLMCostCalculator models={mockModels} isLoading={false} />
      );

      const table = container.querySelector("table");
      mockModels.forEach((model) => {
        const rows = table?.querySelectorAll("tbody tr");
        let found = false;
        rows?.forEach((row) => {
          if (row.textContent?.includes(model.name)) {
            found = true;
          }
        });
        expect(found).toBe(true);
      });
    });

    it("should format costs with 4 decimal places", () => {
      render(
        <LLMCostCalculator models={mockModels} isLoading={false} />
      );

      expect(screen.getAllByText("$0.0300").length).toBeGreaterThan(0);
      expect(screen.getAllByText("$0.0150").length).toBeGreaterThan(0);
      expect(screen.getAllByText("$0.0005").length).toBeGreaterThan(0);
    });
  });

  describe("loading state", () => {
    it("should display skeleton loaders when loading", () => {
      const { container } = render(
        <LLMCostCalculator models={[]} isLoading={true} />
      );

      const skeletons = container.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it("should not display models when loading", () => {
      render(
        <LLMCostCalculator models={mockModels} isLoading={true} />
      );

      expect(screen.queryByText("GPT-4o")).not.toBeInTheDocument();
    });
  });

  describe("error state", () => {
    it("should display error message when error prop is provided", () => {
      const errorMessage = "Failed to load LLM costs";
      render(
        <LLMCostCalculator
          models={[]}
          isLoading={false}
          error={errorMessage}
        />
      );

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it("should not display models when error is present", () => {
      render(
        <LLMCostCalculator
          models={mockModels}
          isLoading={false}
          error="Error loading"
        />
      );

      expect(screen.queryByText("GPT-4o")).not.toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("should display fallback message when no models available", () => {
      render(
        <LLMCostCalculator models={[]} isLoading={false} />
      );

      expect(
        screen.getByText("No LLM models available at this time.")
      ).toBeInTheDocument();
    });
  });

  describe("sorting functionality", () => {
    it("should sort by cost ascending by default", () => {
      const { container } = render(
        <LLMCostCalculator models={mockModels} isLoading={false} />
      );

      const table = container.querySelector("table");
      const rows = table?.querySelectorAll("tbody tr");
      expect(rows?.[0]).toHaveTextContent("Gemini Pro");
      expect(rows?.[1]).toHaveTextContent("Claude 3 Opus");
      expect(rows?.[2]).toHaveTextContent("GPT-4o");
    });

    it("should toggle sort order when clicking same column header", () => {
      const { container } = render(
        <LLMCostCalculator models={mockModels} isLoading={false} />
      );

      const costButton = screen.getAllByRole("button", {
        name: /Cost per 1M Tokens/i,
      })[0];
      fireEvent.click(costButton);

      const table = container.querySelector("table");
      const rows = table?.querySelectorAll("tbody tr");
      expect(rows?.[0]).toHaveTextContent("GPT-4o");
      expect(rows?.[1]).toHaveTextContent("Claude 3 Opus");
      expect(rows?.[2]).toHaveTextContent("Gemini Pro");
    });

    it("should sort by provider when clicking provider header", () => {
      const { container } = render(
        <LLMCostCalculator models={mockModels} isLoading={false} />
      );

      const providerButton = screen.getAllByRole("button", {
        name: /Provider/i,
      })[0];
      fireEvent.click(providerButton);

      const table = container.querySelector("table");
      const rows = table?.querySelectorAll("tbody tr");
      expect(rows?.[0]).toHaveTextContent("Anthropic");
      expect(rows?.[1]).toHaveTextContent("Google");
      expect(rows?.[2]).toHaveTextContent("OpenAI");
    });

    it("should sort by name when clicking name header", () => {
      const { container } = render(
        <LLMCostCalculator models={mockModels} isLoading={false} />
      );

      const nameButton = screen.getAllByRole("button", {
        name: /Model Name/i,
      })[0];
      fireEvent.click(nameButton);

      const table = container.querySelector("table");
      const rows = table?.querySelectorAll("tbody tr");
      expect(rows?.[0]).toHaveTextContent("Claude 3 Opus");
      expect(rows?.[1]).toHaveTextContent("Gemini Pro");
      expect(rows?.[2]).toHaveTextContent("GPT-4o");
    });
  });

  describe("responsive layout", () => {
    it("should render table on desktop view", () => {
      const { container } = render(
        <LLMCostCalculator models={mockModels} isLoading={false} />
      );

      const table = container.querySelector("table");
      expect(table).toBeInTheDocument();
    });

    it("should render cards on mobile view", () => {
      const { container } = render(
        <LLMCostCalculator models={mockModels} isLoading={false} />
      );

      const cards = container.querySelectorAll('[class*="md:hidden"]');
      expect(cards.length).toBeGreaterThan(0);
    });
  });
});
