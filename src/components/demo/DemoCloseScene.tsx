import { useTypewriter } from "@/hooks/use-typewriter";

interface Props {
  isActive: boolean;
}

export const DemoCloseScene = ({ isActive }: Props) => {
  const { displayed, isComplete } = useTypewriter({
    text: "We turn AI work into revenue — automatically.",
    speed: 35,
    delay: 1500,
    enabled: isActive,
  });

  return (
    <div className="flex items-center justify-center h-full px-8">
      <div className="text-center max-w-3xl">
        {/* Logo */}
        <div className="mb-8">
          <h1
            className="text-5xl md:text-7xl font-bold"
            style={{
              fontFamily: "'Space Grotesk', system-ui",
              background: "linear-gradient(135deg, hsl(158, 64%, 52%) 0%, hsl(158, 64%, 72%) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: isActive ? "drop-shadow(0 0 40px hsl(158, 64%, 52%, 0.4))" : "none",
              transition: "filter 1s ease-in",
            }}
          >
            AskScrooge
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-[hsl(220,10%,55%)] leading-relaxed mb-6">
          AI businesses shouldn't guess how to charge for intelligence.
        </p>

        <p
          className="text-xl md:text-2xl text-white font-medium leading-relaxed"
          style={{ fontFamily: "'Space Grotesk', system-ui" }}
        >
          {displayed}
          {!isComplete && (
            <span className="inline-block w-[2px] h-[1em] bg-[hsl(158,64%,52%)] ml-0.5 align-middle animate-pulse" />
          )}
        </p>

        {isComplete && (
          <div className="mt-10 animate-[fadeIn_1s_ease-in]">
            <p className="text-sm text-[hsl(220,10%,40%)]">
              askscrooge.ai
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
