"use client";

import { loveConfig } from "@/lib/loveConfig";

type StartScreenProps = {
  onStart: () => void;
};

export default function StartScreen({ onStart }: StartScreenProps) {
  const requestFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      // Fullscreen is optional.
    }
  };

  return (
    <section className="start-screen" aria-label="Galaxy Gallery start">
      <button className="scene-control scene-control-left" type="button" onClick={requestFullscreen} aria-label="Fullscreen">
        ⛶
      </button>
      <div className="start-stars" aria-hidden="true" />
      <article className="start-card">
        <h1 className="start-title">{loveConfig.title}</h1>
        <div className="start-image" aria-hidden="true">
          <div className="start-heart">♡</div>
        </div>
        <p className="start-subtitle">{loveConfig.subtitle}</p>
        <button className="start-button" type="button" onClick={onStart}>
          {loveConfig.startButton}
        </button>
      </article>
    </section>
  );
}
