import { DEMO_SIMULATION, DEMO_INVOICE, DEMO_DASHBOARD } from "./demo-data";

const API_URL = import.meta.env.VITE_API_URL || "";

async function tryFetch<T>(url: string, options: RequestInit, fallback: T): Promise<T> {
  if (!API_URL) return fallback;
  try {
    const res = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
    if (!res.ok) throw new Error(`${res.status}`);
    return await res.json();
  } catch {
    return fallback;
  }
}

export async function runSimulation(metric: string, pricePerUnit: number) {
  return tryFetch(
    "/pricing/recommend",
    {
      method: "POST",
      body: JSON.stringify({
        costs: {
          llm_cost_monthly: 280,
          infrastructure_cost_monthly: 40,
          embedding_cost_monthly: 60,
        },
        customer_segment: "startup",
      }),
    },
    {
      ...DEMO_SIMULATION,
      revenue: pricePerUnit * DEMO_SIMULATION.monthlyVolume,
      margin: Math.round(
        ((pricePerUnit * DEMO_SIMULATION.monthlyVolume - DEMO_SIMULATION.aiCost) /
          (pricePerUnit * DEMO_SIMULATION.monthlyVolume)) *
          100
      ),
    }
  );
}

export async function getInvoicePreview(customerId: string, productId: string) {
  return tryFetch(
    "/billing/invoices/preview",
    {
      method: "POST",
      body: JSON.stringify({
        customer_id: customerId,
        product_id: productId,
        period_start: "2026-02-01T00:00:00Z",
        period_end: "2026-02-11T00:00:00Z",
      }),
    },
    DEMO_INVOICE
  );
}

export async function getDashboardMetrics() {
  return tryFetch("/billing/dashboard", { method: "GET" }, DEMO_DASHBOARD);
}
