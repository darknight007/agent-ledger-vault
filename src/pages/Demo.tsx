import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useDemoAutoplay } from "@/hooks/use-demo-autoplay";
import { DemoHookScene } from "@/components/demo/DemoHookScene";
import { DemoProblemScene } from "@/components/demo/DemoProblemScene";
import { DemoPricingSandboxScene } from "@/components/demo/DemoPricingSandboxScene";
import { DemoDeployScene } from "@/components/demo/DemoDeployScene";
import { DemoInvoiceScene } from "@/components/demo/DemoInvoiceScene";
import { DemoDashboardScene } from "@/components/demo/DemoDashboardScene";
import { DemoCloseScene } from "@/components/demo/DemoCloseScene";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Maximize,
  RotateCcw,
} from "lucide-react";

const Demo = () => {
  const [searchParams] = useSearchParams();
  const initialAutoplay = searchParams.get("autoplay") === "true";

  const {
    currentScene,
    isPlaying,
    totalProgress,
    totalScenes,
    next,
    prev,
    togglePlay,
    restart,
  } = useDemoAutoplay({ initialAutoplay });

  // Force dark mode on demo page
  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  const scenes = useMemo(
    () => [
      <DemoHookScene key="hook" isActive={currentScene === 0} />,
      <DemoProblemScene key="problem" isActive={currentScene === 1} />,
      <DemoPricingSandboxScene key="sandbox" isActive={currentScene === 2} autoplay={isPlaying || initialAutoplay} />,
      <DemoDeployScene key="deploy" isActive={currentScene === 3} autoplay={isPlaying || initialAutoplay} />,
      <DemoInvoiceScene key="invoice" isActive={currentScene === 4} autoplay={isPlaying || initialAutoplay} />,
      <DemoDashboardScene key="dashboard" isActive={currentScene === 5} />,
      <DemoCloseScene key="close" isActive={currentScene === 6} />,
    ],
    [currentScene, isPlaying, initialAutoplay]
  );

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[hsl(220,70%,6%)] overflow-hidden"
      style={{ cursor: isPlaying ? "none" : "default" }}
    >
      {/* Scene Container */}
      <div className="relative w-full h-full">
        {scenes.map((scene, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-all duration-700 ease-in-out"
            style={{
              opacity: currentScene === i ? 1 : 0,
              transform: currentScene === i ? "scale(1)" : "scale(0.98)",
              pointerEvents: currentScene === i ? "auto" : "none",
            }}
          >
            {scene}
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-[hsl(220,50%,12%)]">
        <div
          className="h-full bg-[hsl(158,64%,52%)] transition-all duration-300"
          style={{ width: `${totalProgress * 100}%` }}
        />
      </div>

      {/* Controls Overlay */}
      <div
        className={`fixed bottom-4 right-4 flex items-center gap-2 transition-opacity duration-500 ${
          isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
        }`}
      >
        <div className="flex items-center gap-1 bg-[hsl(220,60%,8%,0.9)] border border-[hsl(220,50%,18%)] rounded-lg px-2 py-1.5 backdrop-blur-sm">
          <button
            onClick={prev}
            className="p-1.5 text-[hsl(220,10%,55%)] hover:text-white transition-colors"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            onClick={togglePlay}
            className="p-1.5 text-[hsl(158,64%,52%)] hover:text-[hsl(158,64%,65%)] transition-colors"
            title="Play/Pause (P)"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>

          <button
            onClick={next}
            className="p-1.5 text-[hsl(220,10%,55%)] hover:text-white transition-colors"
            title="Next (Right Arrow / Space)"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <span className="text-xs text-[hsl(220,10%,45%)] px-2 tabular-nums">
            {currentScene + 1}/{totalScenes}
          </span>

          <div className="w-px h-4 bg-[hsl(220,50%,18%)]" />

          <button
            onClick={restart}
            className="p-1.5 text-[hsl(220,10%,55%)] hover:text-white transition-colors"
            title="Restart (R)"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={handleFullscreen}
            className="p-1.5 text-[hsl(220,10%,55%)] hover:text-white transition-colors"
            title="Fullscreen (F)"
          >
            <Maximize className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Keyboard hints (shown only in manual mode, fades after 5s) */}
      {!isPlaying && currentScene === 0 && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 text-[10px] text-[hsl(220,10%,35%)] flex gap-4 animate-[fadeIn_1s_ease-in]">
          <span>Space / Arrow → Next</span>
          <span>P → Auto-play</span>
          <span>F → Fullscreen</span>
        </div>
      )}

      {/* Custom keyframe styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Demo;
