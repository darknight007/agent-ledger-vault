"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface RepositoryLinkInputProps {
  onSubmit: (link: string) => Promise<void>;
  isSubmitting: boolean;
  placeholder?: string;
}

export function RepositoryLinkInput({
  onSubmit,
  isSubmitting,
  placeholder = "Share repo link to analyze tech costs and setup optimum pricing model",
}: RepositoryLinkInputProps) {
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input is not empty or whitespace-only
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter a repository link",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSubmit(input.trim());
      toast({
        title: "Success",
        description: "Repository link submitted successfully!",
      });
      setInput("");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to submit repository link. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isSubmitting) {
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:gap-2">
      <Input
        type="text"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSubmitting}
        className="flex-1"
      />
      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
