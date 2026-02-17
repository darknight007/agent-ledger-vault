import { useTypewriter } from "@/hooks/use-typewriter";

interface Props {
  isActive: boolean;
}

export const DemoHookScene = ({ isActive }: Props) => {
  const { displayed, isComplete } = useTypewriter({
    text: "AI agents generate events. Nobody knows how to charge for them.",
    speed: 45,
    delay: 600,
    enabled: isActive,
  });

  return (
    <div className="flex items-center justify-center h-full px-8">
      <div className="max-w-4xl text-center">
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
        >
          <span className="text-white">{displayed}</span>
          {!isComplete && (
            <span className="inline-block w-[3px] h-[1em] bg-[hsl(158,64%,52%)] ml-1 align-middle animate-pulse" />
          )}
        </h1>
        {isComplete && (
          <p className="mt-8 text-lg text-[hsl(220,10%,55%)] animate-[fadeIn_0.6s_ease-in]">
            Existing billing systems are built for seats and subscriptions. Not outcomes.
          </p>
        )}
      </div>
    </div>
  );
};
