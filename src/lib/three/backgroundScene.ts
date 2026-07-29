// Escena Three.js del fondo global — ver .claude/rules-threejs.md.
// Solo se importa dinámicamente cuando el usuario no pidió reduced-motion,
// así el bundle de three.js nunca se descarga para quien no lo va a ver.
import * as THREE from 'three';

export interface BackgroundScene {
  pause: () => void;
  resume: () => void;
  dispose: () => void;
}

interface PointField {
  points: THREE.Points;
  geometry: THREE.BufferGeometry;
  material: THREE.PointsMaterial;
}

function readTokenColor(varName: string, fallback: string): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return new THREE.Color(raw || fallback).getHex();
}

function createPointField(count: number, spread: number, color: number, size: number): PointField {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color,
    size,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  return { points: new THREE.Points(geometry, material), geometry, material };
}

export function createBackgroundScene(canvas: HTMLCanvasElement): BackgroundScene {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 24;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const cyan = createPointField(600, 40, readTokenColor('--color-neon-cyan', '#45e3b0'), 0.12);
  const green = createPointField(400, 50, readTokenColor('--color-neon-green', '#1affd5'), 0.1);
  scene.add(cyan.points, green.points);

  let running = true;
  let frameId: number | null = null;

  function tick(): void {
    if (!running) return;
    cyan.points.rotation.y += 0.0006;
    cyan.points.rotation.x += 0.0002;
    green.points.rotation.y -= 0.0004;
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(tick);
  }

  function handleResize(): void {
    const { innerWidth, innerHeight } = window;
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  }
  window.addEventListener('resize', handleResize);

  frameId = requestAnimationFrame(tick);

  function pause(): void {
    running = false;
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
  }

  function resume(): void {
    if (running) return;
    running = true;
    frameId = requestAnimationFrame(tick);
  }

  function dispose(): void {
    pause();
    window.removeEventListener('resize', handleResize);
    [cyan, green].forEach(({ geometry, material }) => {
      geometry.dispose();
      material.dispose();
    });
    renderer.dispose();
  }

  return { pause, resume, dispose };
}
