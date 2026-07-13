"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { createSoftParticleMaterial } from "@/lib/softParticleMaterial";

type StarFieldProps = {
  isMobile: boolean;
  paused?: boolean;
};

export default function StarField({ isMobile, paused = false }: StarFieldProps) {
  const starsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const count = isMobile ? 7000 : 12000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [new THREE.Color("#ffffff"), new THREE.Color("#ffc1df"), new THREE.Color("#8d6cff"), new THREE.Color("#4ccfff")];

    for (let index = 0; index < count; index += 1) {
      const radius = 10 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
      positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[index * 3 + 2] = radius * Math.cos(phi);

      const color = palette[index % palette.length];
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return starGeometry;
  }, [isMobile]);

  const material = useMemo(() => createSoftParticleMaterial(0.018, 0.5), []);

  useFrame(({ clock }) => {
    if (starsRef.current && !paused) {
      starsRef.current.rotation.y = clock.elapsedTime * 0.008;
      starsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.08) * 0.035;
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uOpacity.value = 0.42 + Math.sin(clock.elapsedTime * 0.8) * 0.08;
    }
  });

  return (
    <points ref={starsRef} geometry={geometry}>
      <primitive ref={materialRef} object={material} attach="material" />
    </points>
  );
}
