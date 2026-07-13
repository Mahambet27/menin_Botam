"use client";

import { Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { neonTexts, type NeonText } from "@/lib/loveConfig";

type OrbitNeonTextsProps = {
  paused: boolean;
  isMobile: boolean;
};

function NeonTextItem({ item, isMobile }: { item: NeonText; isMobile: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const radius = item.radius * (isMobile ? 0.78 : 1);
  const x = Math.cos(item.angle) * radius;
  const z = Math.sin(item.angle) * radius;

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = item.y + Math.sin(clock.elapsedTime * 0.9 + item.angle) * 0.045;
      ref.current.lookAt(camera.position);
    }
  });

  return (
    <group ref={ref} position={[x, item.y, z]}>
      <Text
        fontSize={item.size * (isMobile ? 0.58 : 0.78)}
        color="#ff72df"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.012}
        outlineColor="#ffd6ff"
        material-toneMapped={false}
      >
        {item.text}
      </Text>
    </group>
  );
}

export default function OrbitNeonTexts({ paused, isMobile }: OrbitNeonTextsProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && !paused) {
      groupRef.current.rotation.y += delta * 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      {neonTexts.map((item) => (
        <NeonTextItem key={item.text} item={item} isMobile={isMobile} />
      ))}
    </group>
  );
}
