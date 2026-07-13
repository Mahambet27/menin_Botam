"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { memories, type Memory } from "@/lib/loveConfig";
import { useIsMobile } from "@/lib/useIsMobile";
import BlackHoleCore from "./BlackHoleCore";
import GalaxyDisk from "./GalaxyDisk";
import MemoryPresentationModal from "./MemoryPresentationModal";
import OrbitNeonTexts from "./OrbitNeonTexts";
import OrbitPhotoBubbles from "./OrbitPhotoBubbles";
import ParticleHeartAbove from "./ParticleHeartAbove";
import SceneControls from "./SceneControls";
import StarField from "./StarField";

type GalaxyGallerySceneProps = {
  paused: boolean;
  onTogglePaused: () => void;
};

function CameraRig({ isMobile }: { isMobile: boolean }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, isMobile ? 6.2 : 5.5, isMobile ? 13.5 : 11.5);
    camera.lookAt(0, 1.15, 0);
  }, [camera, isMobile]);

  return null;
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 4.6, 2]} color="#ff55bd" intensity={3.2} distance={11} />
      <pointLight position={[-5, 3, 4]} color="#6ad7ff" intensity={1.35} distance={13} />
      <pointLight position={[4.5, 1.6, -4]} color="#ffd06f" intensity={1.6} distance={10} />
    </>
  );
}

export default function GalaxyGalleryScene({ paused, onTogglePaused }: GalaxyGallerySceneProps) {
  const isMobile = useIsMobile();
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [ready, setReady] = useState(false);
  const isModalOpen = Boolean(selectedMemory);

  return (
    <section className="gallery-scene" aria-label="Galaxy Gallery">
      <Canvas
        className="gallery-canvas"
        dpr={[1, 1.6]}
        camera={{ position: [0, isMobile ? 6.2 : 5.5, isMobile ? 13.5 : 11.5], fov: isMobile ? 52 : 46 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color("#000000"), 1);
          setReady(true);
        }}
      >
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 12, 29]} />
        <CameraRig isMobile={isMobile} />
        <SceneLights />
        <StarField isMobile={isMobile} paused={paused} />
        <GalaxyDisk isMobile={isMobile} paused={paused} />
        <BlackHoleCore isMobile={isMobile} paused={paused} />
        <ParticleHeartAbove isMobile={isMobile} paused={paused} />
        <OrbitPhotoBubbles
          memories={memories}
          isMobile={isMobile}
          paused={paused}
          isModalOpen={isModalOpen}
          onSelect={setSelectedMemory}
        />
        <OrbitNeonTexts isMobile={isMobile} paused={paused} />
        <OrbitControls
          enablePan
          enableZoom
          screenSpacePanning
          minDistance={isMobile ? 2.4 : 1.9}
          maxDistance={isMobile ? 48 : 44}
          minPolarAngle={0.12}
          maxPolarAngle={2.45}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.48}
          zoomSpeed={0.72}
          panSpeed={0.72}
          autoRotate={false}
          target={[0, 1.15, 0]}
        />
      </Canvas>

      {!ready && (
        <div className="canvas-loading" aria-hidden="true">
          <span />
        </div>
      )}
      <SceneControls paused={paused} onTogglePaused={onTogglePaused} />
      <MemoryPresentationModal memory={selectedMemory} onClose={() => setSelectedMemory(null)} />
    </section>
  );
}
