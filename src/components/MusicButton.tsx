"use client";

import { useEffect, useRef, useState } from "react";
import { loveConfig } from "@/lib/loveConfig";

type MusicButtonProps = {
  unlocked: boolean;
  onUnlock: () => void;
};

export default function MusicButton({ unlocked, onUnlock }: MusicButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    const audio = new Audio(loveConfig.musicSrc);
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;

    const markUnavailable = () => {
      setIsAvailable(false);
      setIsPlaying(false);
    };

    audio.addEventListener("error", markUnavailable);
    audio.load();

    return () => {
      audio.pause();
      audio.removeEventListener("error", markUnavailable);
      audioRef.current = null;
    };
  }, []);

  const toggleMusic = async () => {
    onUnlock();

    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        return;
      }

      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsAvailable(false);
      setIsPlaying(false);
    }
  };

  if (!isAvailable) {
    return null;
  }

  return (
    <button
      className={`music-button ${isPlaying ? "is-playing" : ""}`}
      type="button"
      onClick={toggleMusic}
      aria-label={isPlaying ? "Выключить музыку" : "Включить музыку"}
      title={unlocked ? "Музыка" : "Музыка включится после клика"}
    >
      {isPlaying ? "Ⅱ" : "♪"}
    </button>
  );
}
