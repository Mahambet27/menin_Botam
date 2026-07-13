"use client";

import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from "react";
import * as THREE from "three";
import { type Memory } from "@/lib/loveConfig";

type BubbleProps = {
  memory: Memory;
  paused: boolean;
  isMobile: boolean;
  onSelect: (memory: Memory) => void;
};

function PhotoBubble({ memory, paused, isMobile, onSelect }: BubbleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hasImage, setHasImage] = useState(true);
  const { camera } = useThree();

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const angle = memory.angle + clock.elapsedTime * memory.speed * (paused ? 0.02 : 0.26);
    const mobileScale = isMobile ? 0.74 : 1;
    const radius = memory.radius * mobileScale;
    group.position.set(
      Math.cos(angle) * radius,
      memory.y * (isMobile ? 0.82 : 1) + Math.sin(angle * 1.25) * 0.22,
      Math.sin(angle) * radius,
    );
    group.lookAt(camera.position);
  });

  const size = Math.round((isMobile ? 44 : 62) * memory.size);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect(memory);
  };

  const stopScenePointer = (event: PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  return (
    <group ref={groupRef}>
      <Html
        className="photo-bubble-wrap photo-bubble-html"
        transform
        center
        occlude={false}
        distanceFactor={isMobile ? 8.4 : 7.2}
        zIndexRange={[80, 0]}
        style={{ pointerEvents: "auto" }}
      >
        <button
          className="photo-bubble"
          style={{ "--bubble-size": `${size}px` } as CSSProperties}
          type="button"
          onPointerDown={stopScenePointer}
          onPointerUp={stopScenePointer}
          onClick={handleOpen}
          aria-label={memory.title}
        >
          {hasImage ? (
            <img src={memory.image} alt={memory.title} onError={() => setHasImage(false)} />
          ) : (
            <span className="photo-bubble-fallback">{"\u2661"}</span>
          )}
        </button>
      </Html>
    </group>
  );
}

type OrbitPhotoBubblesProps = {
  memories: Memory[];
  paused: boolean;
  isMobile: boolean;
  isModalOpen: boolean;
  onSelect: (memory: Memory) => void;
};

export default function OrbitPhotoBubbles({ memories, paused, isMobile, isModalOpen, onSelect }: OrbitPhotoBubblesProps) {
  if (isModalOpen) {
    return null;
  }

  return (
    <group>
      {memories.map((memory) => (
        <PhotoBubble key={memory.id} memory={memory} paused={paused} isMobile={isMobile} onSelect={onSelect} />
      ))}
    </group>
  );
}
