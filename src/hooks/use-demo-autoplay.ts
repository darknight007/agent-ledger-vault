import { useState, useEffect, useCallback, useRef } from "react";

// Timings per scene in ms, matching voiceover script
const SCENE_DURATIONS = [
  8000,  // Scene 0: Hook (0:00–0:08)
  12000, // Scene 1: Problem (0:08–0:20)
  20000, // Scene 2: Pricing Sandbox (0:20–0:40)
  15000, // Scene 3: Deploy (0:40–0:55)
  15000, // Scene 4: Invoice (0:55–1:10)
  10000, // Scene 5: Dashboard (1:10–1:20)
  10000, // Scene 6: Close (1:20–1:30)
];

const TOTAL_SCENES = SCENE_DURATIONS.length;

interface UseDemoAutoplayOptions {
  initialAutoplay?: boolean;
  onSceneChange?: (scene: number) => void;
}

export function useDemoAutoplay({
  initialAutoplay = false,
  onSceneChange,
}: UseDemoAutoplayOptions = {}) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(initialAutoplay);
  const [sceneElapsed, setSceneElapsed] = useState(0);
  const onSceneChangeRef = useRef(onSceneChange);
  onSceneChangeRef.current = onSceneChange;
  const timerRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  const goToScene = useCallback((scene: number) => {
    const clamped = Math.max(0, Math.min(scene, TOTAL_SCENES - 1));
    setCurrentScene(clamped);
    setSceneElapsed(0);
    startTimeRef.current = performance.now();
    onSceneChangeRef.current?.(clamped);
  }, []);

  const next = useCallback(() => {
    setCurrentScene((prev) => {
      const n = Math.min(prev + 1, TOTAL_SCENES - 1);
      if (n !== prev) {
        setSceneElapsed(0);
        startTimeRef.current = performance.now();
        onSceneChangeRef.current?.(n);
      }
      if (n === TOTAL_SCENES - 1) setIsPlaying(false);
      return n;
    });
  }, []);

  const prev = useCallback(() => {
    setCurrentScene((p) => {
      const n = Math.max(p - 1, 0);
      if (n !== p) {
        setSceneElapsed(0);
        startTimeRef.current = performance.now();
        onSceneChangeRef.current?.(n);
      }
      return n;
    });
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((p) => {
      if (!p) startTimeRef.current = performance.now() - sceneElapsed;
      return !p;
    });
  }, [sceneElapsed]);

  const restart = useCallback(() => {
    setCurrentScene(0);
    setSceneElapsed(0);
    setIsPlaying(true);
    startTimeRef.current = performance.now();
    onSceneChangeRef.current?.(0);
  }, []);

  // Auto-advance timer
  useEffect(() => {
    if (!isPlaying) return;

    startTimeRef.current = performance.now() - sceneElapsed;

    const tick = () => {
      const elapsed = performance.now() - startTimeRef.current;
      setSceneElapsed(elapsed);

      if (elapsed >= SCENE_DURATIONS[currentScene]) {
        next();
      } else {
        timerRef.current = requestAnimationFrame(tick);
      }
    };

    timerRef.current = requestAnimationFrame(tick);

    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [isPlaying, currentScene, next]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        restart();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev, togglePlay, restart]);

  const sceneDuration = SCENE_DURATIONS[currentScene];
  const sceneProgress = Math.min(sceneElapsed / sceneDuration, 1);
  const totalElapsed = SCENE_DURATIONS.slice(0, currentScene).reduce((a, b) => a + b, 0) + sceneElapsed;
  const totalDuration = SCENE_DURATIONS.reduce((a, b) => a + b, 0);
  const totalProgress = Math.min(totalElapsed / totalDuration, 1);

  return {
    currentScene,
    isPlaying,
    sceneProgress,
    totalProgress,
    totalScenes: TOTAL_SCENES,
    next,
    prev,
    goToScene,
    togglePlay,
    restart,
  };
}
