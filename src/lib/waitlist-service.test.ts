import { beforeEach, describe, expect, it, vi } from "vitest";
import { addToWaitlist } from "./waitlist-service";
import { supabase } from "@/integrations/supabase/client";
import { getUtmParams } from "@/lib/utm";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

vi.mock("@/lib/utm", () => ({
  getUtmParams: vi.fn(),
}));

describe("addToWaitlist", () => {
  const mockInsert = vi.fn();
  const mockFrom = vi.fn(() => ({ insert: mockInsert }));

  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.from as unknown as ReturnType<typeof vi.fn>).mockImplementation(mockFrom);
    (getUtmParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "spring",
      utm_content: null,
      utm_term: null,
    });
  });

  it("inserts with UTM fields when the schema supports them", async () => {
    mockInsert.mockResolvedValueOnce({ error: null });

    await expect(
      addToWaitlist({
        name: "Jane Smith",
        email: "jane@example.com",
        phone: null,
      })
    ).resolves.toBeUndefined();

    expect(mockFrom).toHaveBeenCalledWith("waitlist");
    expect(mockInsert).toHaveBeenCalledTimes(1);
    expect(mockInsert).toHaveBeenCalledWith([
      {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: null,
        utm_source: "google",
        utm_medium: "cpc",
        utm_campaign: "spring",
        utm_content: null,
        utm_term: null,
      },
    ]);
  });

  it("retries without UTM fields when optional UTM columns are missing", async () => {
    mockInsert
      .mockResolvedValueOnce({
        error: {
          code: "PGRST204",
          message: "Could not find the 'utm_source' column of 'waitlist'",
          details: null,
          hint: null,
        },
      })
      .mockResolvedValueOnce({ error: null });

    await expect(
      addToWaitlist({
        name: "Jane Smith",
        email: "jane@example.com",
      })
    ).resolves.toBeUndefined();

    expect(mockInsert).toHaveBeenCalledTimes(2);
    expect(mockInsert).toHaveBeenNthCalledWith(2, [
      {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: null,
      },
    ]);
  });

  it("throws backend error when insert fails for other reasons", async () => {
    mockInsert.mockResolvedValueOnce({
      error: {
        code: "23505",
        message: "duplicate key value violates unique constraint",
        details: null,
        hint: null,
      },
    });

    await expect(
      addToWaitlist({
        name: "Jane Smith",
        email: "jane@example.com",
      })
    ).rejects.toThrow("duplicate key value violates unique constraint");
  });
});
