"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import FlyThrough from "./FlyThrough";
import GalaxyGalleryScene from "./GalaxyGalleryScene";
import StartScreen from "./StartScreen";

type Step = "start" | "fly" | "gallery";

export default function LoveExperience() {
  const [step, setStep] = useState<Step>("start");
  const [paused, setPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const audio = new Audio("/music/love.mp3");
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const startMusic = async () => {
    try {
      await audioRef.current?.play();
    } catch {
      // Missing files or blocked playback should never surface in the UI.
    }
  };

  const handleStart = () => {
    void startMusic();
    setStep("fly");
    timers.current.push(window.setTimeout(() => setStep("gallery"), 4000));
  };

  const togglePaused = () => {
    setPaused((current) => {
      const next = !current;
      const audio = audioRef.current;

      if (audio) {
        if (next) {
          audio.pause();
        } else {
          void audio.play().catch(() => undefined);
        }
      }

      return next;
    });
  };

  return (
    <main className="love-root">
      <AnimatePresence mode="wait">
        {step === "start" && (
          <motion.div
            key="start"
            className="experience-stage"
            initial={{ opacity: 0, scale: 0.96, filter: "blur(14px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.84, filter: "blur(18px)" }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            <StartScreen onStart={handleStart} />
          </motion.div>
        )}

        {step === "fly" && (
          <motion.div
            key="fly"
            className="experience-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(18px)" }}
            transition={{ duration: 0.45 }}
          >
            <FlyThrough />
          </motion.div>
        )}

        {step === "gallery" && (
          <motion.div
            key="gallery"
            className="experience-stage"
            initial={{ opacity: 0, scale: 1.08, filter: "blur(18px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <GalaxyGalleryScene paused={paused} onTogglePaused={togglePaused} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
