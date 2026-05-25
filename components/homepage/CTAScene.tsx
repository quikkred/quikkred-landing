"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Gold-themed Three.js backdrop for the FinancialCTA section.
 * Bookends the page with the same money/coin motif used in step 3:
 *   - floating ₹ coins drifting slowly across the canvas
 *   - a soft gold halo behind the CTA card
 *   - emerald dust particles to tie back to the brand
 * Stays low-contrast and behind the card; mouse parallax adds gentle depth.
 */
export default function CTAScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Lights so coins read with depth
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(3, 5, 4);
    scene.add(dir);

    // Rupee coin texture (gold disc with ₹)
    const coinCanvas = document.createElement("canvas");
    coinCanvas.width = coinCanvas.height = 256;
    {
      const ctx = coinCanvas.getContext("2d")!;
      const grad = ctx.createRadialGradient(128, 128, 30, 128, 128, 128);
      grad.addColorStop(0, "#fde68a");
      grad.addColorStop(0.5, "#f59e0b");
      grad.addColorStop(1, "#b45309");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(128, 128, 124, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.8)";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(128, 128, 110, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#7c2d12";
      ctx.font = "bold 160px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("₹", 128, 138);
    }
    const coinTex = new THREE.CanvasTexture(coinCanvas);
    const coinFaceMat = new THREE.MeshStandardMaterial({
      map: coinTex,
      metalness: 0.75,
      roughness: 0.3,
      transparent: true,
      opacity: 0.95,
    });
    const coinEdgeMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      metalness: 0.85,
      roughness: 0.25,
    });

    const COIN_COUNT = 10;
    type Coin = {
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      floatSpeed: number;
      driftSpeed: number;
      spin: number;
      tilt: number;
      offset: number;
    };
    const coins: Coin[] = [];
    const coinGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.08, 32, 1);
    for (let i = 0; i < COIN_COUNT; i++) {
      const mesh = new THREE.Mesh(coinGeo, [coinEdgeMat, coinFaceMat, coinFaceMat] as any);
      const x = (Math.random() - 0.5) * 11;
      const y = (Math.random() - 0.5) * 6;
      const z = -1 - Math.random() * 4;
      mesh.position.set(x, y, z);
      coins.push({
        mesh,
        basePos: new THREE.Vector3(x, y, z),
        floatSpeed: 0.3 + Math.random() * 0.4,
        driftSpeed: 0.2 + Math.random() * 0.25,
        spin: 0.4 + Math.random() * 0.6,
        tilt: (Math.random() - 0.5) * 1.4,
        offset: Math.random() * Math.PI * 2,
      });
      scene.add(mesh);
    }

    // Soft gold halo behind the CTA card
    const haloCanvas = document.createElement("canvas");
    haloCanvas.width = haloCanvas.height = 256;
    {
      const ctx = haloCanvas.getContext("2d")!;
      const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      g.addColorStop(0, "rgba(253,230,138,0.55)");
      g.addColorStop(0.5, "rgba(245,158,11,0.18)");
      g.addColorStop(1, "rgba(245,158,11,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 256);
    }
    const haloTex = new THREE.CanvasTexture(haloCanvas);
    const haloMat = new THREE.SpriteMaterial({
      map: haloTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.6,
    });
    const halo = new THREE.Sprite(haloMat);
    halo.scale.set(11, 7, 1);
    halo.position.set(0, 0, -2);
    scene.add(halo);

    // Emerald dust (ties back to brand)
    const DUST = 160;
    const dustPositions = new Float32Array(DUST * 3);
    for (let i = 0; i < DUST; i++) {
      dustPositions[i * 3 + 0] = (Math.random() - 0.5) * 18;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      dustPositions[i * 3 + 2] = -3 - Math.random() * 6;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(dustPositions, 3)
    );
    const dustCanvas = document.createElement("canvas");
    dustCanvas.width = dustCanvas.height = 64;
    {
      const ctx = dustCanvas.getContext("2d")!;
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.5, "rgba(81,201,175,0.5)");
      g.addColorStop(1, "rgba(37,177,129,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
    }
    const dustTex = new THREE.CanvasTexture(dustCanvas);
    const dustMat = new THREE.PointsMaterial({
      size: 0.08,
      map: dustTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.55,
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
      const dt = Math.min(clock.getDelta() + 0.0001, 0.05);
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      coins.forEach((c, i) => {
        // Lazy float + drift
        c.mesh.position.x =
          c.basePos.x + Math.sin(t * c.driftSpeed + c.offset) * 0.6;
        c.mesh.position.y =
          c.basePos.y + Math.sin(t * c.floatSpeed + c.offset * 1.3) * 0.4;
        c.mesh.rotation.x = Math.PI / 2 + Math.sin(t * 0.6 + i) * 0.2 + c.tilt;
        c.mesh.rotation.y += c.spin * dt;
      });

      haloMat.opacity = 0.55 + Math.sin(t * 1.1) * 0.07;

      // Dust gentle motion
      dust.rotation.y = t * 0.02;
      dust.rotation.x = Math.sin(t * 0.08) * 0.05;

      camera.position.x = mouse.x * 0.6;
      camera.position.y = -mouse.y * 0.4;
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
      coinGeo.dispose();
      coinFaceMat.dispose();
      coinEdgeMat.dispose();
      coinTex.dispose();
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
