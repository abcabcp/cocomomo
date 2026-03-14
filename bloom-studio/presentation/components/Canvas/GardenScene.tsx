'use client';

import { Environment, Loader, OrbitControls, Sky } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, useCallback, useEffect, useRef } from 'react';

import * as THREE from 'three';
import { BrushConfig, PlacedObject } from '../../../core/types/garden.types';
import { GhostObject } from './GhostObject';
import { Ground } from './Ground';
import { PlacedObjects } from './PlacedObjects';

interface SceneContentProps {
  brush: BrushConfig;
  placedObjects: PlacedObject[];
  selectedIds: string[];
  onGroundClick: (point: THREE.Vector3) => void;
  onGroundDragStart: () => void;
  onGroundDragMove: (point: THREE.Vector3) => void;
  onGroundDragEnd: () => void;
  onSelectObject: (id: string, multi: boolean) => void;
  onDeselect: () => void;
  onRendererReady: (renderer: THREE.WebGLRenderer) => void;
}

function getSkyConfig(hour: number) {
  if (hour >= 5 && hour < 8) {
    const t = (hour - 5) / 3;
    return {
      sunPosition: [Math.sin(t * 0.4), Math.sin(t * 0.4) * 0.25, -1] as [number, number, number],
      turbidity: 4, rayleigh: 3, mieCoefficient: 0.012, mieDirectionalG: 0.88,
      fogColor: '#e8c4d8', fogNear: 30, fogFar: 100,
      ambientIntensity: 0.4, sunIntensity: 0.8, envPreset: 'dawn' as const,
    };
  }
  if (hour >= 8 && hour < 11) {
    return {
      sunPosition: [1, 0.6, 0] as [number, number, number],
      turbidity: 6, rayleigh: 1.5, mieCoefficient: 0.005, mieDirectionalG: 0.8,
      fogColor: '#c8dfe8', fogNear: 40, fogFar: 120,
      ambientIntensity: 0.7, sunIntensity: 1.4, envPreset: 'park' as const,
    };
  }
  if (hour >= 11 && hour < 16) {
    return {
      sunPosition: [0, 1, 0] as [number, number, number],
      turbidity: 8, rayleigh: 1, mieCoefficient: 0.003, mieDirectionalG: 0.75,
      fogColor: '#cce0f0', fogNear: 50, fogFar: 140,
      ambientIntensity: 0.9, sunIntensity: 1.8, envPreset: 'park' as const,
    };
  }
  if (hour >= 16 && hour < 20) {
    const t = (hour - 16) / 4;
    return {
      sunPosition: [Math.cos(t * Math.PI), Math.sin((1 - t) * 0.5) * 0.3, 0.5] as [number, number, number],
      turbidity: 10, rayleigh: 4, mieCoefficient: 0.02, mieDirectionalG: 0.92,
      fogColor: '#e8a87c', fogNear: 25, fogFar: 80,
      ambientIntensity: 0.5, sunIntensity: 1.0, envPreset: 'sunset' as const,
    };
  }
  // Night (0-5, 20-24)
  return {
    sunPosition: [0, -1, 0] as [number, number, number],
    turbidity: 20, rayleigh: 0.5, mieCoefficient: 0.001, mieDirectionalG: 0.7,
    fogColor: '#0a0f1a', fogNear: 15, fogFar: 60,
    ambientIntensity: 0.15, sunIntensity: 0.1, envPreset: 'night' as const,
  };
}

function DynamicSky() {
  const hour = new Date().getHours() + new Date().getMinutes() / 60;
  const sky = getSkyConfig(hour);

  return (
    <>
      <color attach="background" args={[sky.fogColor]} />
      <fog attach="fog" args={[sky.fogColor, sky.fogNear, sky.fogFar]} />
      <ambientLight intensity={sky.ambientIntensity} />
      <directionalLight
        position={sky.sunPosition}
        intensity={sky.sunIntensity}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={100}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />
      <Suspense fallback={null}>
        <Sky
          distance={450000}
          sunPosition={sky.sunPosition}
          turbidity={sky.turbidity}
          rayleigh={sky.rayleigh}
          mieCoefficient={sky.mieCoefficient}
          mieDirectionalG={sky.mieDirectionalG}
        />
        <Environment preset={sky.envPreset} />
      </Suspense>
    </>
  );
}

function RendererCapture({ onReady }: { onReady: (r: THREE.WebGLRenderer) => void }) {
  const { gl } = useThree();
  useEffect(() => { onReady(gl); }, [gl, onReady]);
  return null;
}

function useGroundPointer() {
  const { camera, gl } = useThree();
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const raycaster = useRef(new THREE.Raycaster());
  const pointer = useRef(new THREE.Vector2());
  const target = useRef(new THREE.Vector3());
  const cameraRef = useRef(camera);
  const glRef = useRef(gl);

  useEffect(() => { cameraRef.current = camera; }, [camera]);
  useEffect(() => { glRef.current = gl; }, [gl]);

  const getPoint = useCallback((e: PointerEvent): THREE.Vector3 | null => {
    const rect = glRef.current.domElement.getBoundingClientRect();
    pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.current.setFromCamera(pointer.current, cameraRef.current);
    const hit = raycaster.current.ray.intersectPlane(plane.current, target.current);
    return hit ? target.current.clone() : null;
  }, []);

  return { getPoint };
}

function CanvasPointerHandler({
  brush,
  onGroundClick,
  onGroundDragStart,
  onGroundDragMove,
  onGroundDragEnd,
  onDeselect,
}: {
  brush: BrushConfig;
  onGroundClick: (p: THREE.Vector3) => void;
  onGroundDragStart: () => void;
  onGroundDragMove: (p: THREE.Vector3) => void;
  onGroundDragEnd: () => void;
  onDeselect: () => void;
}) {
  const { gl } = useThree();
  const { getPoint } = useGroundPointer();
  const isDown = useRef(false);
  const hasDragged = useRef(false);
  const isLeftButton = useRef(false);

  const brushRef = useRef(brush);
  const cbRef = useRef({ onGroundClick, onGroundDragStart, onGroundDragMove, onGroundDragEnd, onDeselect, getPoint });

  useEffect(() => { brushRef.current = brush; }, [brush]);
  useEffect(() => {
    cbRef.current = { onGroundClick, onGroundDragStart, onGroundDragMove, onGroundDragEnd, onDeselect, getPoint };
  }, [onGroundClick, onGroundDragStart, onGroundDragMove, onGroundDragEnd, onDeselect, getPoint]);

  useEffect(() => {
    const canvas = gl.domElement;
    const downPos = { x: 0, y: 0 };
    const DRAG_PX = 5;

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      isLeftButton.current = true;
      isDown.current = true;
      hasDragged.current = false;
      downPos.x = e.clientX;
      downPos.y = e.clientY;
      if (brushRef.current.type) cbRef.current.onGroundDragStart();
    };

    const onMove = (e: PointerEvent) => {
      if (!isDown.current || !isLeftButton.current || !brushRef.current.type) return;
      const dx = e.clientX - downPos.x;
      const dy = e.clientY - downPos.y;
      if (!hasDragged.current && Math.sqrt(dx * dx + dy * dy) < DRAG_PX) return;
      hasDragged.current = true;
      const pt = cbRef.current.getPoint(e);
      if (pt) cbRef.current.onGroundDragMove(pt);
    };

    const onUp = (e: PointerEvent) => {
      if (!isDown.current || !isLeftButton.current || e.button !== 0) return;
      if (brushRef.current.type) {
        cbRef.current.onGroundDragEnd();
        if (!hasDragged.current) {
          const pt = cbRef.current.getPoint(e);
          if (pt) cbRef.current.onGroundClick(pt);
        }
      } else {
        cbRef.current.onDeselect();
      }
      isDown.current = false;
      hasDragged.current = false;
      isLeftButton.current = false;
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    return () => {
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
    };
  }, [gl]);

  return null;
}

function SceneContent({
  brush,
  placedObjects,
  selectedIds,
  onGroundClick,
  onGroundDragStart,
  onGroundDragMove,
  onGroundDragEnd,
  onSelectObject,
  onDeselect,
  onRendererReady,
}: SceneContentProps) {
  const groundRef = useRef<THREE.Mesh>(null);
  const hour = new Date().getHours() + new Date().getMinutes() / 60;
  const sky = getSkyConfig(hour);

  return (
    <>
      <RendererCapture onReady={onRendererReady} />

      <CanvasPointerHandler
        brush={brush}
        onGroundClick={onGroundClick}
        onGroundDragStart={onGroundDragStart}
        onGroundDragMove={onGroundDragMove}
        onGroundDragEnd={onGroundDragEnd}
        onDeselect={onDeselect}
      />

      <DynamicSky />

      <Ground groundRef={groundRef} skyColor={sky.fogColor} />

      <GhostObject brush={brush} />

      <Suspense fallback={null}>
        <PlacedObjects
          objects={placedObjects}
          selectedIds={selectedIds}
          onSelect={onSelectObject}
        />
      </Suspense>

      <OrbitControls
        enableRotate={!brush.type}
        enablePan
        enableZoom
        minDistance={3}
        maxDistance={80}
        maxPolarAngle={Math.PI / 2.1}
        target={[0, 1.2, 0]}
      />
    </>
  );
}

interface GardenSceneProps {
  brush: BrushConfig;
  placedObjects: PlacedObject[];
  selectedIds: string[];
  onGroundClick: (point: THREE.Vector3) => void;
  onGroundDragStart: () => void;
  onGroundDragMove: (point: THREE.Vector3) => void;
  onGroundDragEnd: () => void;
  onSelectObject: (id: string, multi: boolean) => void;
  onDeselect: () => void;
  onRendererReady: (renderer: THREE.WebGLRenderer) => void;
}

export function GardenScene(props: GardenSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [14, 5.5, 14], fov: 50 }}
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
        }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
          props.onRendererReady(gl);
        }}
      >
        <SceneContent {...props} />
      </Canvas>
      <Loader />
    </div>
  );
}
