import { supabase } from "@/integrations/supabase/client";
import { getUtmParams } from "@/lib/utm";

interface WaitlistInsertError {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}

export interface WaitlistSignupInput {
  name: string;
  email: string;
  phone?: string | null;
}

const isMissingOptionalColumnError = (error: WaitlistInsertError) => {
  const msg = `${error.message ?? ""} ${error.details ?? ""} ${error.hint ?? ""}`.toLowerCase();
  return (
    error.code === "PGRST204" ||
    (msg.includes("column") &&
      (msg.includes("utm_source") ||
        msg.includes("utm_medium") ||
        msg.includes("utm_campaign") ||
        msg.includes("utm_content") ||
        msg.includes("utm_term")))
  );
};

export async function addToWaitlist(input: WaitlistSignupInput): Promise<void> {
  const basePayload = {
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
  };

  const utm = getUtmParams();
  const payloadWithUtm = {
    ...basePayload,
    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,
    utm_content: utm.utm_content,
    utm_term: utm.utm_term,
  };

  const { error } = await supabase.from("waitlist").insert([payloadWithUtm]);
  if (!error) return;

  if (isMissingOptionalColumnError(error)) {
    const fallback = await supabase.from("waitlist").insert([basePayload]);
    if (!fallback.error) return;
    throw new Error(fallback.error.message || "Failed to add to the waitlist");
  }

  throw new Error(error.message || "Failed to add to the waitlist");
}
