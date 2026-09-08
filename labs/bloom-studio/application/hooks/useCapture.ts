'use client';

import { useCallback, useRef } from 'react';
import * as THREE from 'three';

export function useCapture() {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const setRenderer = useCallback((renderer: THREE.WebGLRenderer) => {
    rendererRef.current = renderer;
  }, []);

  const capture = useCallback(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    const dataUrl = renderer.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `bloom-garden-${Date.now()}.png`;
    link.click();
  }, []);

  return { setRenderer, capture };
}
