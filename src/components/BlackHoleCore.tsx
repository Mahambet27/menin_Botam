"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { createSoftParticleMaterial } from "@/lib/softParticleMaterial";

type BlackHoleCoreProps = {
  isMobile: boolean;
  paused: boolean;
};

function AccretionParticles({ isMobile, paused }: BlackHoleCoreProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const particleData = useMemo(() => {
    const count = isMobile ? 24000 : 45000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const state = new Float32Array(count * 4);
    const palette = [new THREE.Color("#fff9ee"), new THREE.Color("#ffd36a"), new THREE.Color("#ff8a3d"), new THREE.Color("#ff4fc3")];

    for (let index = 0; index < count; index += 1) {
      const radius = 0.35 + Math.random() * 2.05;
      const angle = Math.random() * Math.PI * 2;
      const radiusT = (radius - 0.35) / 2.05;
      const speed = THREE.MathUtils.lerp(0.32, 0.12, radiusT);
      const y = THREE.MathUtils.randFloatSpread(0.045);
      state[index * 4] = radius;
      state[index * 4 + 1] = angle;
      state[index * 4 + 2] = speed;
      state[index * 4 + 3] = y;

      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = y;
      positions[index * 3 + 2] = Math.sin(angle) * radius * 0.8;

      const color = palette[index % palette.length];
      const hot = 1 + Math.max(0, 1.15 - radius) * 0.5;
      colors[index * 3] = Math.min(color.r * hot, 1);
      colors[index * 3 + 1] = Math.min(color.g * hot, 1);
      colors[index * 3 + 2] = Math.min(color.b * hot, 1);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return { geometry, state };
  }, [isMobile]);
  const material = useMemo(() => createSoftParticleMaterial(isMobile ? 0.018 : 0.015, 0.92), [isMobile]);

  useFrame(({ clock }) => {
    const attr = particleData.geometry.getAttribute("position") as THREE.BufferAttribute;
    const elapsed = clock.elapsedTime;

    if (!paused) {
      for (let index = 0; index < attr.count; index += 1) {
        const radius = particleData.state[index * 4];
        const baseAngle = particleData.state[index * 4 + 1];
        const speed = particleData.state[index * 4 + 2];
        const y = particleData.state[index * 4 + 3];
        const angle = baseAngle + elapsed * speed;
        attr.setXYZ(index, Math.cos(angle) * radius, y, Math.sin(angle) * radius * 0.78);
      }
      attr.needsUpdate = true;
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uOpacity.value = paused ? 0.58 : 0.88 + Math.sin(elapsed * 3.4) * 0.06;
    }
  });

  return (
    <points ref={pointsRef} geometry={particleData.geometry} frustumCulled={false}>
      <primitive ref={materialRef} object={material} attach="material" />
    </points>
  );
}

export default function BlackHoleCore({ isMobile, paused }: BlackHoleCoreProps) {
  const ringsRef = useRef<THREE.Group>(null);
  const orbitRingsRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringSpeeds = useMemo(() => [0.34, -0.27, 0.2, -0.14, 0.09, -0.06], []);
  const orbitSpeeds = useMemo(() => [0.13, -0.09, 0.06, -0.045, 0.032, -0.026], []);

  useFrame(({ clock }) => {
    if (ringsRef.current && !paused) {
      ringsRef.current.children.forEach((child, index) => {
        child.rotation.z = clock.elapsedTime * ringSpeeds[index];
      });
    }

    if (orbitRingsRef.current && !paused) {
      orbitRingsRef.current.children.forEach((child, index) => {
        child.rotation.z = clock.elapsedTime * orbitSpeeds[index];
      });
    }

    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 2.2) * 0.05);
    }
  });

  return (
    <group position={[0, 0.12, 0]}>
      <AccretionParticles isMobile={isMobile} paused={paused} />

      <group ref={ringsRef} rotation={[Math.PI / 2, 0, 0]}>
        {[
          [0.75, 0.018, "#fff8ee", 0.76],
          [1.05, 0.015, "#ffd36a", 0.64],
          [1.35, 0.012, "#ff8a3d", 0.5],
          [1.75, 0.01, "#ff4fc3", 0.4],
          [2.15, 0.008, "#8d55ff", 0.3],
          [2.42, 0.007, "#5fcfff", 0.22],
        ].map(([radius, tube, color, opacity]) => (
          <mesh key={`${radius}-${color}`}>
            <torusGeometry args={[radius as number, tube as number, 12, 220]} />
            <meshStandardMaterial
              color={color as string}
              emissive={color as string}
              emissiveIntensity={1.15}
              transparent
              opacity={opacity as number}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      <group ref={orbitRingsRef}>
        {[
          [1.25, 0.005, "#ff55bd", 0.38, 0.18],
          [1.8, 0.0045, "#ffd36a", 0.28, -0.12],
          [2.4, 0.004, "#8d55ff", 0.24, 0.28],
          [3.1, 0.0035, "#ff55bd", 0.18, -0.22],
          [3.8, 0.003, "#5fcfff", 0.14, 0.12],
        ].map(([radius, tube, color, opacity, tilt]) => (
          <mesh key={`orbit-${radius}`} rotation={[Math.PI / 2 + (tilt as number), 0, 0]}>
            <torusGeometry args={[radius as number, tube as number, 8, 220]} />
            <meshBasicMaterial color={color as string} transparent opacity={opacity as number} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        ))}
      </group>

      <mesh ref={glowRef}>
        <sphereGeometry args={[2.15, 48, 48]} />
        <meshBasicMaterial color="#ff55bd" transparent opacity={0.045} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.52, 64, 64]} />
        <meshStandardMaterial color="#000000" emissive="#000000" roughness={1} metalness={0} />
      </mesh>
      <pointLight color="#ff8a3d" intensity={2.8} distance={5} />
      <pointLight position={[0, 1.1, 0]} color="#ff55bd" intensity={1.8} distance={7} />
    </group>
  );
}
