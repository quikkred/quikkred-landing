"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Subtle emerald Three.js backdrop for the hero.
 * Lives behind copy/form, so it stays low-contrast: a slowly rotating
 * wireframe icosahedron + drifting particle dust + a soft glow disc.
 * Tuned NOT to fight the foreground; mouse parallax adds depth.
 */
export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Wireframe icosahedron — sits a bit to the right, slowly tumbles
    const icoGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x25b181,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    ico.position.set(2.2, 0.4, 0);
    scene.add(ico);

    // Inner glowing solid (slightly smaller, darker, low alpha)
    const innerGeo = new THREE.IcosahedronGeometry(1.2, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x51c9af,
      transparent: true,
      opacity: 0.08,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    inner.position.copy(ico.position);
    scene.add(inner);

    // Soft halo sprite behind the ico
    const haloCanvas = document.createElement("canvas");
    haloCanvas.width = haloCanvas.height = 256;
    {
      const ctx = haloCanvas.getContext("2d")!;
      const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      g.addColorStop(0, "rgba(81,201,175,0.7)");
      g.addColorStop(0.5, "rgba(37,177,129,0.2)");
      g.addColorStop(1, "rgba(37,177,129,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 256);
    }
    const haloTex = new THREE.CanvasTexture(haloCanvas);
    const haloMat = new THREE.SpriteMaterial({
      map: haloTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.7,
    });
    const halo = new THREE.Sprite(haloMat);
    halo.scale.set(7, 7, 1);
    halo.position.set(2.2, 0.4, -1);
    scene.add(halo);

    // Drifting particle dust
    const DUST = 220;
    const positions = new Float32Array(DUST * 3);
    const speeds = new Float32Array(DUST);
    const phases = new Float32Array(DUST);
    for (let i = 0; i < DUST; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = -2 - Math.random() * 6;
      speeds[i] = 0.25 + Math.random() * 0.55;
      phases[i] = Math.random() * Math.PI * 2;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const spriteCanvas = document.createElement("canvas");
    spriteCanvas.width = spriteCanvas.height = 64;
    {
      const ctx = spriteCanvas.getContext("2d")!;
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.5, "rgba(81,201,175,0.5)");
      g.addColorStop(1, "rgba(37,177,129,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
    }
    const dustTex = new THREE.CanvasTexture(spriteCanvas);
    const dustMat = new THREE.PointsMaterial({
      size: 0.085,
      map: dustTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.6,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // Mouse parallax
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      if (!mountRef.current) return;
      width = mountRef.current.clientWidth;
      height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let frameId = 0;
    const animate = () => {
      const t = clock.getElapsedTime();
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      ico.rotation.x = t * 0.18;
      ico.rotation.y = t * 0.22;
      inner.rotation.x = -t * 0.12;
      inner.rotation.y = -t * 0.14;
      halo.material.opacity = 0.55 + Math.sin(t * 1.2) * 0.08;

      // Drift dust in slow upward+sideways breeze
      const arr = dustGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < DUST; i++) {
        const idx = i * 3;
        arr[idx + 1] += Math.sin(t * speeds[i] + phases[i]) * 0.002;
        arr[idx + 0] += Math.cos(t * speeds[i] * 0.6 + phases[i]) * 0.0015;
      }
      dustGeo.attributes.position.needsUpdate = true;
      dust.rotation.y = t * 0.02;

      camera.position.x = mouse.x * 0.5;
      camera.position.y = -mouse.y * 0.3;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      icoGeo.dispose();
      icoMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      haloMat.dispose();
      haloTex.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      dustTex.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0"
    />
  );
}
