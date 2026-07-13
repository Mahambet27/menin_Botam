"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { createSoftParticleMaterial } from "@/lib/softParticleMaterial";

type GalaxyDiskProps = {
  isMobile: boolean;
  paused: boolean;
};

type DiskLayerProps = {
  count: number;
  minRadius: number;
  maxRadius: number;
  speed: number;
  size: number;
  opacity: number;
  colorStops: [string, string, string];
  paused: boolean;
};

function createDiskGeometry(count: number, minRadius: number, maxRadius: number, colorStops: [string, string, string]) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const arms = 5;
  const spiralFactor = 1.04;
  const inner = new THREE.Color(colorStops[0]);
  const mid = new THREE.Color(colorStops[1]);
  const outer = new THREE.Color(colorStops[2]);
  const color = new THREE.Color();

  for (let index = 0; index < count; index += 1) {
    const radiusT = Math.random();
    const radius = minRadius + Math.pow(radiusT, 0.76) * (maxRadius - minRadius);
    const normalizedRadius = radius / 14.5;
    const onArm = Math.random() < 0.86;
    const arm = index % arms;
    const armAngle = (arm / arms) * Math.PI * 2;
    const armNoise = THREE.MathUtils.randFloatSpread(THREE.MathUtils.lerp(0.06, 0.38, normalizedRadius));
    const interArmAngle = Math.random() * Math.PI * 2;
    const angle = onArm ? armAngle + radius * spiralFactor + armNoise : interArmAngle + radius * 0.38;
    const width = onArm ? 0.018 + normalizedRadius * 0.055 : 0.16 + normalizedRadius * 0.08;
    const sideScatter = THREE.MathUtils.randFloatSpread(width);

    positions[index * 3] = Math.cos(angle) * radius + Math.cos(angle + Math.PI / 2) * sideScatter;
    positions[index * 3 + 1] = THREE.MathUtils.randFloatSpread(0.055);
    positions[index * 3 + 2] = Math.sin(angle) * radius + Math.sin(angle + Math.PI / 2) * sideScatter;

    if (radiusT < 0.48) {
      color.copy(inner).lerp(mid, radiusT / 0.48);
    } else {
      color.copy(mid).lerp(outer, (radiusT - 0.48) / 0.52);
    }

    const dim = onArm ? 1 : 0.42;
    colors[index * 3] = color.r * dim;
    colors[index * 3 + 1] = color.g * dim;
    colors[index * 3 + 2] = color.b * dim;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.computeBoundingSphere();
  return geometry;
}

function DiskLayer({ count, minRadius, maxRadius, speed, size, opacity, colorStops, paused }: DiskLayerProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => createDiskGeometry(count, minRadius, maxRadius, colorStops), [colorStops, count, maxRadius, minRadius]);
  const material = useMemo(() => createSoftParticleMaterial(size, opacity), [opacity, size]);

  useFrame((_, delta) => {
    if (pointsRef.current && !paused) {
      pointsRef.current.rotation.y += delta * speed;
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uOpacity.value = paused ? opacity * 0.72 : opacity;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled>
      <primitive ref={materialRef} object={material} attach="material" />
    </points>
  );
}

export default function GalaxyDisk({ isMobile, paused }: GalaxyDiskProps) {
  return (
    <group>
      <DiskLayer
        count={isMobile ? 28000 : 50000}
        minRadius={0.55}
        maxRadius={2.4}
        speed={0.16}
        size={0.017}
        opacity={0.96}
        colorStops={["#fff8ec", "#ffd36a", "#ff34ba"]}
        paused={paused}
      />
      <DiskLayer
        count={isMobile ? 24000 : 45000}
        minRadius={2.4}
        maxRadius={6.5}
        speed={0.045}
        size={0.015}
        opacity={0.82}
        colorStops={["#ffae54", "#ff42c6", "#8b5cff"]}
        paused={paused}
      />
      <DiskLayer
        count={isMobile ? 30000 : 56000}
        minRadius={6.5}
        maxRadius={14.5}
        speed={0.012}
        size={0.011}
        opacity={0.68}
        colorStops={["#4f2db6", "#173a96", "#45cfff"]}
        paused={paused}
      />
    </group>
  );
}
