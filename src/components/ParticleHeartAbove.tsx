"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { createHeartContourData, createHeartParticleData } from "@/lib/heartMath";
import { createSoftParticleMaterial } from "@/lib/softParticleMaterial";

type ParticleHeartAboveProps = {
  isMobile: boolean;
  paused: boolean;
};

function HeartBeam() {
  const geometry = useMemo(() => {
    const count = 90;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const t = index / (count - 1);
      positions[index * 3] = THREE.MathUtils.randFloatSpread(0.08 * (1 - t));
      positions[index * 3 + 1] = THREE.MathUtils.lerp(-0.58, -2.75, t);
      positions[index * 3 + 2] = THREE.MathUtils.randFloatSpread(0.08 * (1 - t));
      colors[index * 3] = 1;
      colors[index * 3 + 1] = THREE.MathUtils.lerp(0.95, 0.25, t);
      colors[index * 3 + 2] = THREE.MathUtils.lerp(1, 0.75, t);
    }

    const beamGeometry = new THREE.BufferGeometry();
    beamGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    beamGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return beamGeometry;
  }, []);
  const material = useMemo(() => createSoftParticleMaterial(0.11, 0.58), []);

  return (
    <points geometry={geometry}>
      <primitive object={material} attach="material" />
    </points>
  );
}

export default function ParticleHeartAbove({ isMobile, paused }: ParticleHeartAboveProps) {
  const groupRef = useRef<THREE.Group>(null);
  const mainMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const contourMaterialRef = useRef<THREE.ShaderMaterial>(null);

  const { fillGeometry, contourGeometry } = useMemo(() => {
    const fill = createHeartParticleData(isMobile ? 3200 : 5600);
    const contour = createHeartContourData(isMobile ? 1300 : 1900);

    const fillGeometry = new THREE.BufferGeometry();
    fillGeometry.setAttribute("position", new THREE.BufferAttribute(fill.positions, 3));
    fillGeometry.setAttribute("color", new THREE.BufferAttribute(fill.colors, 3));

    const contourGeometry = new THREE.BufferGeometry();
    contourGeometry.setAttribute("position", new THREE.BufferAttribute(contour.positions, 3));
    contourGeometry.setAttribute("color", new THREE.BufferAttribute(contour.colors, 3));

    return { fillGeometry, contourGeometry };
  }, [isMobile]);

  const fillMaterial = useMemo(() => createSoftParticleMaterial(isMobile ? 0.16 : 0.13, 0.86), [isMobile]);
  const contourMaterial = useMemo(() => createSoftParticleMaterial(isMobile ? 0.23 : 0.19, 0.95), [isMobile]);

  useFrame(({ clock, camera }) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const baseScale = isMobile ? 1.08 : 1.32;
    const pulse = 1 + Math.sin(clock.elapsedTime * 2) * (paused ? 0.006 : 0.025);
    group.scale.setScalar(baseScale * pulse);
    group.position.set(0, 3.2, 0);
    group.lookAt(camera.position.x, camera.position.y, camera.position.z);

    if (mainMaterialRef.current) {
      mainMaterialRef.current.uniforms.uOpacity.value = 0.78 + Math.sin(clock.elapsedTime * 3.2) * 0.1;
      mainMaterialRef.current.uniforms.uSize.value = (isMobile ? 0.16 : 0.13) + Math.sin(clock.elapsedTime * 4.2) * 0.008;
    }

    if (contourMaterialRef.current) {
      contourMaterialRef.current.uniforms.uOpacity.value = 0.9 + Math.sin(clock.elapsedTime * 2.4) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 3.2, 0]}>
      <points geometry={fillGeometry}>
        <primitive ref={mainMaterialRef} object={fillMaterial} attach="material" />
      </points>
      <points geometry={contourGeometry}>
        <primitive ref={contourMaterialRef} object={contourMaterial} attach="material" />
      </points>
      <mesh position={[0, -0.58, 0]}>
        <sphereGeometry args={[0.055, 24, 24]} />
        <meshBasicMaterial color="#fff4ff" transparent opacity={0.92} blending={THREE.AdditiveBlending} />
      </mesh>
      <HeartBeam />
      <pointLight position={[0, -0.58, 0]} color="#ff55d6" intensity={2.4} distance={5} />
    </group>
  );
}
