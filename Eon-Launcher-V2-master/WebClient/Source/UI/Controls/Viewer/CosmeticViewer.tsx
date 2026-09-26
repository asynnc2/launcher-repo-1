import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, useGLTF } from "@react-three/drei";
import * as THREE from "three";

export type CosmeticKind = "skin" | "emote" | "other";

interface CosmeticViewerProps {
  Kind: CosmeticKind;
  RarityColor?: string;
  /**
   * Optional path/URL to a real .glb/.gltf model. If provided, this loads and
   * displays that model instead of the placeholder mannequin below. Leave
   * unset to fall back to the stylized placeholder - this project doesn't
   * ship any real cosmetic 3D assets, so nothing loads here unless a caller
   * supplies one of their own.
   */
  ModelUrl?: string;
}

// --- Placeholder mannequin -------------------------------------------------
// A simple stylized humanoid built from primitives, matching the white-
// silhouette look already used elsewhere in the shop for items without full
// art. Stands in until/unless a real model is supplied via ModelUrl.

function Mannequin({ Kind, Color }: { Kind: CosmeticKind; Color: string }) {
  const GroupRef = useRef<THREE.Group>(null);
  const Material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: Color, roughness: 0.45, metalness: 0.1 }),
    [Color],
  );

  useFrame((State) => {
    if (!GroupRef.current) return;
    const T = State.clock.getElapsedTime();

    if (Kind === "emote") {
      // Small procedural "dance" bounce - not a real emote animation, just a
      // placeholder so the emote category doesn't look identical to a skin.
      GroupRef.current.position.y = Math.sin(T * 4) * 0.06;
      GroupRef.current.rotation.y = Math.sin(T * 1.5) * 0.25;
    } else {
      GroupRef.current.position.y = Math.sin(T * 1.2) * 0.015;
    }
  });

  return (
    <group ref={GroupRef} position={[0, -1, 0]}>
      {/* Head */}
      <mesh position={[0, 1.72, 0]} material={Material} castShadow>
        <sphereGeometry args={[0.16, 24, 24]} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 1.24, 0]} material={Material} castShadow>
        <capsuleGeometry args={[0.19, 0.5, 8, 16]} />
      </mesh>
      {/* Hips */}
      <mesh position={[0, 0.85, 0]} material={Material} castShadow>
        <capsuleGeometry args={[0.17, 0.12, 8, 16]} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.32, 1.28, 0]} rotation={[0, 0, 0.18]} material={Material} castShadow>
        <capsuleGeometry args={[0.07, 0.55, 8, 16]} />
      </mesh>
      <mesh position={[0.32, 1.28, 0]} rotation={[0, 0, -0.18]} material={Material} castShadow>
        <capsuleGeometry args={[0.07, 0.55, 8, 16]} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.11, 0.34, 0]} material={Material} castShadow>
        <capsuleGeometry args={[0.085, 0.62, 8, 16]} />
      </mesh>
      <mesh position={[0.11, 0.34, 0]} material={Material} castShadow>
        <capsuleGeometry args={[0.085, 0.62, 8, 16]} />
      </mesh>
    </group>
  );
}

// --- Real model loader (used only when ModelUrl is supplied) --------------

function LoadedModel({ Url }: { Url: string }) {
  const { scene } = useGLTF(Url);
  return <primitive object={scene} position={[0, -1, 0]} />;
}

// --- Scene wrapper ----------------------------------------------------------

function Scene({ Kind, RarityColor, ModelUrl }: CosmeticViewerProps) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} castShadow />
      <directionalLight position={[-4, 2, -3]} intensity={0.35} />

      <Suspense fallback={<Mannequin Kind={Kind} Color={RarityColor ?? "#e2e2e2"} />}>
        {ModelUrl ? <LoadedModel Url={ModelUrl} /> : <Mannequin Kind={Kind} Color={RarityColor ?? "#e2e2e2"} />}
      </Suspense>

      <ContactShadows position={[0, -1, 0]} opacity={0.45} scale={3} blur={2.4} far={1.5} />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.12}
        rotateSpeed={0.6}
        zoomSpeed={0.7}
        minDistance={1.4}
        maxDistance={4.5}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.85}
        autoRotate
        autoRotateSpeed={0.8}
        target={[0, 0.35, 0]}
      />
    </>
  );
}

export function CosmeticViewer({ Kind, RarityColor, ModelUrl }: CosmeticViewerProps) {
  return (
    <div className="cosmetic-viewer">
      <Canvas
        shadows
        camera={{ position: [0, 0.6, 2.6], fov: 40 }}
        onPointerDown={(Event) => Event.stopPropagation()}
        onWheel={(Event) => Event.stopPropagation()}
      >
        <Scene Kind={Kind} RarityColor={RarityColor} ModelUrl={ModelUrl} />
      </Canvas>
      <span className="cosmetic-viewer-hint">Drag to rotate &middot; Scroll to zoom</span>
    </div>
  );
}