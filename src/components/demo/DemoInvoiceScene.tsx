import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { DEMO_INVOICE } from "@/lib/demo-data";
import { FileText, CheckCircle } from "lucide-react";

interface Props {
  isActive: boolean;
  autoplay: boolean;
}

export const DemoInvoiceScene = ({ isActive, autoplay }: Props) => {
  const [showHeader, setShowHeader] = useState(false);
  const [showLineItems, setShowLineItems] = useState(false);
  const [showTotal, setShowTotal] = useState(false);
  const [showPaid, setShowPaid] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setShowHeader(false);
      setShowLineItems(false);
      setShowTotal(false);
      setShowPaid(false);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setShowHeader(true), autoplay ? 500 : 0));
    timers.push(setTimeout(() => setShowLineItems(true), autoplay ? 2000 : 0));
    timers.push(setTimeout(() => setShowTotal(true), autoplay ? 4000 : 0));
    timers.push(setTimeout(() => setShowPaid(true), autoplay ? 6000 : 0));

    return () => timers.forEach(clearTimeout);
  }, [isActive, autoplay]);

  return (
    <div className="flex items-center justify-center h-full px-8">
      <div className="max-w-lg w-full">
        <Card className="bg-[hsl(220,60%,10%)] border-[hsl(220,50%,18%)] overflow-hidden">
          {/* Invoice Header */}
          <div className={`p-6 border-b border-[hsl(220,50%,18%)] transition-opacity duration-500 ${showHeader ? "opacity-100" : "opacity-0"}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-5 w-5 text-[hsl(158,64%,52%)]" />
                  <span className="text-lg font-semibold text-white" style={{ fontFamily: "'Space Grotesk', system-ui" }}>
                    {DEMO_INVOICE.id}
                  </span>
                </div>
                <p className="text-sm text-[hsl(220,10%,55%)]">{DEMO_INVOICE.customer}</p>
                <p className="text-xs text-[hsl(220,10%,40%)] mt-1">{DEMO_INVOICE.date}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {/* Stripe test mode badge */}
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Test Mode
                </span>
                {showPaid && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[hsl(158,64%,52%,0.12)] text-[hsl(158,64%,52%)] text-xs font-medium animate-[fadeIn_0.4s_ease-in]">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Paid
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className={`px-6 py-4 transition-opacity duration-500 ${showLineItems ? "opacity-100" : "opacity-0"}`}>
            <div className="text-[10px] text-[hsl(220,10%,45%)] uppercase tracking-wider grid grid-cols-4 gap-2 pb-2 border-b border-[hsl(220,50%,16%)]">
              <span className="col-span-1">Description</span>
              <span className="text-right">Qty</span>
              <span className="text-right">Unit Price</span>
              <span className="text-right">Total</span>
            </div>
            {DEMO_INVOICE.lineItems.map((item, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 py-3 text-sm">
                <span className="col-span-1 text-white">{item.description}</span>
                <span className="text-right text-[hsl(220,10%,65%)]">{item.quantity}</span>
                <span className="text-right text-[hsl(220,10%,65%)]">${item.unitPrice.toFixed(2)}</span>
                <span className="text-right text-white font-medium">${item.total.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className={`px-6 py-4 border-t border-[hsl(220,50%,18%)] transition-opacity duration-500 ${showTotal ? "opacity-100" : "opacity-0"}`}>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[hsl(220,10%,65%)]">Total</span>
              <span className="text-2xl font-bold text-[hsl(158,64%,52%)]" style={{ fontFamily: "'Space Grotesk', system-ui" }}>
                ${DEMO_INVOICE.total.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-[hsl(220,10%,40%)] mt-2">
              {DEMO_INVOICE.lineItems[0].quantity} resolutions x ${DEMO_INVOICE.lineItems[0].unitPrice.toFixed(2)} per resolution
            </p>
          </div>
        </Card>

        {showPaid && (
          <p className="text-center text-sm text-[hsl(220,10%,55%)] mt-4 animate-[fadeIn_0.4s_ease-in]">
            No custom billing logic. No spreadsheets. Automatic.
          </p>
        )}
      </div>
    </div>
  );
};
