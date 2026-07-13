"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { createSoftParticleMaterial } from "@/lib/softParticleMaterial";
import { useIsMobile } from "@/lib/useIsMobile";

const FLY_DURATION = 4;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function ParticleTunnel({ isMobile }: { isMobile: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const base = useMemo(() => {
    const count = isMobile ? 8500 : 14000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 4);
    const palette = [
      new THREE.Color("#ff4fc3"),
      new THREE.Color("#ffd66f"),
      new THREE.Color("#65d6ff"),
      new THREE.Color("#a36cff"),
      new THREE.Color("#ffffff"),
    ];

    for (let index = 0; index < count; index += 1) {
      const z = -54 + Math.random() * 74;
      const tunnelT = (z + 54) / 74;
      const radius = 0.65 + (1 - tunnelT) * 7.8 + Math.random() * 2.3;
      const angle = Math.random() * Math.PI * 2 + z * 0.16;
      seeds[index * 4] = radius;
      seeds[index * 4 + 1] = angle;
      seeds[index * 4 + 2] = z;
      seeds[index * 4 + 3] = Math.random();

      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = Math.sin(angle) * radius;
      positions[index * 3 + 2] = z;

      const color = palette[index % palette.length];
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    return { geometry, seeds };
  }, [isMobile]);

  const material = useMemo(() => createSoftParticleMaterial(isMobile ? 0.09 : 0.075, 0.84), [isMobile]);

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    const position = base.geometry.getAttribute("position") as THREE.BufferAttribute;
    const elapsed = clock.getElapsedTime();
    const progress = Math.min(elapsed / FLY_DURATION, 1);
    const eased = easeInOutCubic(progress);

    for (let index = 0; index < position.count; index += 1) {
      const radius = base.seeds[index * 4] * (1 - eased * 0.35);
      const angle = base.seeds[index * 4 + 1] + eased * 8 + base.seeds[index * 4 + 2] * 0.018;
      let z = base.seeds[index * 4 + 2] + eased * 35;

      if (z > 14) {
        z -= 72;
      }

      position.setXYZ(index, Math.cos(angle) * radius, Math.sin(angle) * radius, z);
    }

    position.needsUpdate = true;

    if (points) {
      points.rotation.z = elapsed * 0.08;
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uOpacity.value = 0.72 + Math.sin(elapsed * 5) * 0.1;
      materialRef.current.uniforms.uSize.value = (isMobile ? 0.08 : 0.065) + eased * (isMobile ? 0.045 : 0.035);
    }
  });

  return (
    <points ref={pointsRef} geometry={base.geometry}>
      <primitive ref={materialRef} object={material} attach="material" />
    </points>
  );
}

function FlyCamera() {
  const { camera } = useThree();

  useFrame(({ clock }) => {
    const progress = Math.min(clock.getElapsedTime() / FLY_DURATION, 1);
    const eased = easeInOutCubic(progress);
    camera.position.z = THREE.MathUtils.lerp(18, 3.5, eased);

    if ("fov" in camera) {
      camera.fov = THREE.MathUtils.lerp(60, 42, eased);
      camera.updateProjectionMatrix();
    }

    camera.lookAt(0, 0, 0);
  });

  return null;
}

function FlyCore() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const progress = Math.min(clock.getElapsedTime() / FLY_DURATION, 1);
    if (groupRef.current) {
      groupRef.current.rotation.z = clock.getElapsedTime() * 1.2;
      groupRef.current.scale.setScalar(0.72 + progress * 1.35);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      <mesh>
        <sphereGeometry args={[0.44, 48, 48]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.86, 0.035, 16, 180]} />
        <meshBasicMaterial color="#ffcf78" transparent opacity={0.75} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh rotation={[Math.PI / 2.15, 0, 0.2]}>
        <torusGeometry args={[1.12, 0.018, 12, 180]} />
        <meshBasicMaterial color="#ff4fc3" transparent opacity={0.45} blending={THREE.AdditiveBlending} />
      </mesh>
      <pointLight color="#ff55bd" intensity={4} distance={10} />
    </group>
  );
}

export default function FlyThrough() {
  const isMobile = useIsMobile();

  return (
    <section className="fly-through" aria-label="Полет через частицы">
      <Canvas dpr={[1, 1.6]} camera={{ position: [0, 0, 18], fov: 60 }} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={["#000000"]} />
        <FlyCamera />
        <ParticleTunnel isMobile={isMobile} />
        <FlyCore />
      </Canvas>
    </section>
  );
}
