"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Memory } from "@/lib/loveConfig";

type MemoryPresentationModalProps = {
  memory: Memory | null;
  onClose: () => void;
};

export default function MemoryPresentationModal({ memory, onClose }: MemoryPresentationModalProps) {
  const [hasImage, setHasImage] = useState(true);

  useEffect(() => {
    setHasImage(true);
  }, [memory?.id, memory?.image]);

  useEffect(() => {
    if (!memory) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [memory, onClose]);

  return (
    <AnimatePresence>
      {memory && (
        <motion.div
          className="memory-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button className="memory-modal-backdrop" type="button" onClick={onClose} aria-label="Close memory" />
          <motion.article
            className="memory-modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="memory-title"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.24 }}
          >
            <button className="memory-close" type="button" onClick={onClose} aria-label="Close">
              &times;
            </button>
            <div className="memory-image">
              {hasImage ? (
                <img
                  src={memory.image}
                  alt={memory.title}
                  className="memory-modal-image"
                  onError={() => setHasImage(false)}
                />
              ) : (
                <span className="memory-image-fallback">{"\u2661"}</span>
              )}
            </div>
            <div className="memory-copy">
              <p className="micro-label">memory</p>
              <h2 id="memory-title">{memory.title}</h2>
              <p>{memory.text}</p>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
