"use client";

type SceneControlsProps = {
  paused: boolean;
  onTogglePaused: () => void;
};

export default function SceneControls({ paused, onTogglePaused }: SceneControlsProps) {
  const requestFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Fullscreen is optional.
    }
  };

  return (
    <>
      <button className="scene-control scene-control-left" type="button" onClick={requestFullscreen} aria-label="Fullscreen">
        ⛶
      </button>
      <button className="scene-control scene-control-right" type="button" onClick={onTogglePaused} aria-label={paused ? "Play" : "Pause"}>
        {paused ? "▶" : "Ⅱ"}
      </button>
    </>
  );
}
