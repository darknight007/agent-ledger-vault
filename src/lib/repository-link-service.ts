import { supabase } from "@/integrations/supabase/client";

/**
 * Saves a repository link to the waitlist table.
 * 
 * @param link - The repository link URL to save
 * @throws Error with descriptive message if validation fails or database operation fails
 * 
 * @example
 * await saveRepositoryLink("https://github.com/user/repo");
 */
export async function saveRepositoryLink(link: string): Promise<void> {
  // Validate input is not empty or whitespace-only
  if (!link || !link.trim()) {
    throw new Error("Please enter a repository link");
  }

  const trimmedLink = link.trim();

  try {
    const { error } = await supabase
      .from("waitlist")
      .insert({
        repo_link: trimmedLink,
      });

    if (error) {
      throw new Error(`Failed to submit repository link: ${error.message}`);
    }
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error("Failed to submit repository link. Please try again.");
  }
}
