"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

/**
 * Scroll-driven cinematic scene for the 3-step onboarding.
 * Each scroll segment is a distinct themed vignette:
 *   0–33%  Apply   → floating documents swirl around a green portal ring
 *   33–66% Verify  → a hexagonal shield assembles from shards
 *   66–100% Money  → gold rupee coins shower from above, big ₹ in the back
 * Camera dollies + rotates between vignettes; a glowing ring persists,
 * shifting color across the journey. Background is a soft star field.
 */
export default function StepsScene({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Soft lights so the gold/metallic-ish materials read well
    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(4, 6, 5);
    scene.add(dir);
    const fill = new THREE.PointLight(0x51c9af, 0.7, 30);
    fill.position.set(-4, -2, 4);
    scene.add(fill);

    // -------------------------------------------------------
    // PERSISTENT PORTAL RING (color shifts across whole scroll)
    // -------------------------------------------------------
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    const innerRingGeo = new THREE.TorusGeometry(2.2, 0.045, 32, 220);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x25b181,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    ringGroup.add(innerRing);

    const outerRingGeo = new THREE.TorusGeometry(2.65, 0.02, 16, 220);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x51c9af,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = Math.PI / 2;
    ringGroup.add(outerRing);

    // Glow disc behind the ring
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = glowCanvas.height = 256;
    {
      const ctx = glowCanvas.getContext("2d")!;
      const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      g.addColorStop(0, "rgba(81,201,175,0.9)");
      g.addColorStop(0.4, "rgba(37,177,129,0.35)");
      g.addColorStop(1, "rgba(37,177,129,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 256);
    }
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    const glowMat = new THREE.SpriteMaterial({
      map: glowTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glow = new THREE.Sprite(glowMat);
    glow.scale.set(8, 8, 1);
    glow.position.z = -0.5;
    scene.add(glow);

    // -------------------------------------------------------
    // VIGNETTE 1 — DOCUMENTS (papers fluttering around the ring)
    // -------------------------------------------------------
    const docsGroup = new THREE.Group();
    scene.add(docsGroup);

    const DOC_COUNT = 12;
    type Doc = {
      mesh: THREE.Mesh;
      orbitR: number;
      orbitSpeed: number;
      orbitOffset: number;
      tilt: number;
      flutter: number;
    };
    const docs: Doc[] = [];
    const docGeo = new THREE.PlaneGeometry(0.7, 0.95, 1, 1);
    // Paper line texture
    const paperCanvas = document.createElement("canvas");
    paperCanvas.width = 128;
    paperCanvas.height = 180;
    {
      const ctx = paperCanvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 128, 180);
      ctx.fillStyle = "#25B181";
      ctx.fillRect(10, 14, 60, 8);
      ctx.fillStyle = "#9ca3af";
      for (let i = 0; i < 8; i++) {
        ctx.fillRect(10, 36 + i * 14, 108 - (i % 2) * 24, 4);
      }
      ctx.strokeStyle = "#25B181";
      ctx.lineWidth = 3;
      ctx.strokeRect(2, 2, 124, 176);
    }
    const paperTex = new THREE.CanvasTexture(paperCanvas);
    const docMat = new THREE.MeshBasicMaterial({
      map: paperTex,
      side: THREE.DoubleSide,
      transparent: true,
    });
    for (let i = 0; i < DOC_COUNT; i++) {
      const m = new THREE.Mesh(docGeo, docMat);
      const orbitR = 1.6 + Math.random() * 2.2;
      const orbitSpeed = 0.25 + Math.random() * 0.4;
      const orbitOffset = (i / DOC_COUNT) * Math.PI * 2;
      docs.push({
        mesh: m,
        orbitR,
        orbitSpeed,
        orbitOffset,
        tilt: (Math.random() - 0.5) * 1.2,
        flutter: Math.random() * Math.PI * 2,
      });
      docsGroup.add(m);
    }

    // -------------------------------------------------------
    // VIGNETTE 2 — AUTH PORTAL
    // Three concentric tech rings spinning on independent axes around a
    // glowing crystal core. Radar pulses expand outward, biometric dots
    // orbit on tilted ellipses, and a scanner beam sweeps the whole stack.
    // -------------------------------------------------------
    const authGroup = new THREE.Group();
    scene.add(authGroup);

    // 3 concentric rings on independent axes
    const authRingGeos: THREE.TorusGeometry[] = [];
    const authRingMats: THREE.MeshBasicMaterial[] = [];
    const authRings: THREE.Mesh[] = [];
    const authRingPalette = [0x51c9af, 0x2b63b5, 0x34d399];
    for (let i = 0; i < 3; i++) {
      const geo = new THREE.TorusGeometry(0.95 + i * 0.42, 0.018 + i * 0.006, 16, 220);
      const mat = new THREE.MeshBasicMaterial({
        color: authRingPalette[i],
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(geo, mat);
      if (i === 0) mesh.rotation.x = Math.PI / 2;
      else if (i === 1) mesh.rotation.y = Math.PI / 2;
      authRingGeos.push(geo);
      authRingMats.push(mat);
      authRings.push(mesh);
      authGroup.add(mesh);
    }

    // Crystal core (glowing octahedron)
    const coreGeo = new THREE.OctahedronGeometry(0.38, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x2b63b5,
      emissive: 0x51c9af,
      emissiveIntensity: 1.2,
      metalness: 0.6,
      roughness: 0.2,
      transparent: true,
      opacity: 0.95,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    authGroup.add(core);

    // Wireframe shell around the core
    const coreWireGeo = new THREE.OctahedronGeometry(0.46, 0);
    const coreWireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const coreWire = new THREE.Mesh(coreWireGeo, coreWireMat);
    authGroup.add(coreWire);

    // Radar pulse rings (expand and fade)
    const PULSE_COUNT = 4;
    const pulseRingGeo = new THREE.TorusGeometry(0.5, 0.012, 8, 96);
    const pulseRingMats: THREE.MeshBasicMaterial[] = [];
    const pulseRings: THREE.Mesh[] = [];
    for (let i = 0; i < PULSE_COUNT; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0x51c9af,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const m = new THREE.Mesh(pulseRingGeo, mat);
      m.rotation.x = Math.PI / 2;
      pulseRingMats.push(mat);
      pulseRings.push(m);
      authGroup.add(m);
    }

    // Orbiting biometric data dots
    const BIO_COUNT = 18;
    type BioDot = {
      mesh: THREE.Mesh;
      orbitR: number;
      orbitSpeed: number;
      axis: THREE.Vector3;
      offset: number;
    };
    const bioDots: BioDot[] = [];
    const bioGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const bioMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    for (let i = 0; i < BIO_COUNT; i++) {
      const m = new THREE.Mesh(bioGeo, bioMat);
      const axis = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();
      bioDots.push({
        mesh: m,
        orbitR: 0.75 + Math.random() * 1.05,
        orbitSpeed: 0.55 + Math.random() * 0.7,
        axis,
        offset: Math.random() * Math.PI * 2,
      });
      authGroup.add(m);
    }

    // Vertical scanner beam sweep
    const scannerGeo = new THREE.PlaneGeometry(2.8, 0.07);
    const scannerMat = new THREE.MeshBasicMaterial({
      color: 0x51c9af,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const scanner = new THREE.Mesh(scannerGeo, scannerMat);
    authGroup.add(scanner);

    // -------------------------------------------------------
    // VIGNETTE 3 — COINS (gold rupee coins falling)
    // -------------------------------------------------------
    const coinsGroup = new THREE.Group();
    scene.add(coinsGroup);

    // Build a rupee coin texture (gold disc with ₹ glyph)
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
      metalness: 0.7,
      roughness: 0.35,
      transparent: true,
    });
    const coinEdgeMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      metalness: 0.85,
      roughness: 0.3,
    });

    const COIN_COUNT = 16;
    type Coin = {
      mesh: THREE.Mesh;
      speed: number;
      spin: number;
      startY: number;
      x: number;
      z: number;
      offset: number;
    };
    const coins: Coin[] = [];
    const coinGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.08, 32, 1);
    for (let i = 0; i < COIN_COUNT; i++) {
      const mesh = new THREE.Mesh(coinGeo, [
        coinEdgeMat,
        coinFaceMat,
        coinFaceMat,
      ] as any);
      // Default cylinder has materials [side, top, bottom] when array passed
      // (renders fine because face mat is double-sided)
      mesh.rotation.z = Math.PI / 2;
      const x = (Math.random() - 0.5) * 8;
      const z = -1 - Math.random() * 4;
      coins.push({
        mesh,
        speed: 1.2 + Math.random() * 1.6,
        spin: (Math.random() - 0.5) * 4,
        startY: 4 + Math.random() * 6,
        x,
        z,
        offset: Math.random() * Math.PI * 2,
      });
      mesh.position.set(x, 6, z);
      coinsGroup.add(mesh);
    }

    // Big back ₹ that fades in for vignette 3 (Sprite using the coin glyph)
    const bigRupeeCanvas = document.createElement("canvas");
    bigRupeeCanvas.width = bigRupeeCanvas.height = 512;
    {
      const ctx = bigRupeeCanvas.getContext("2d")!;
      ctx.clearRect(0, 0, 512, 512);
      const g = ctx.createLinearGradient(0, 0, 0, 512);
      g.addColorStop(0, "#fde68a");
      g.addColorStop(1, "#b45309");
      ctx.fillStyle = g;
      ctx.font = "bold 420px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("₹", 256, 286);
    }
    const bigRupeeTex = new THREE.CanvasTexture(bigRupeeCanvas);
    const bigRupeeMat = new THREE.SpriteMaterial({
      map: bigRupeeTex,
      transparent: true,
      opacity: 0,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });
    const bigRupee = new THREE.Sprite(bigRupeeMat);
    bigRupee.scale.set(5, 5, 1);
    bigRupee.position.set(0, 0, -2);
    coinsGroup.add(bigRupee);

    // -------------------------------------------------------
    // STAR-FIELD BACKDROP (always present)
    // -------------------------------------------------------
    const STAR_COUNT = 350;
    const starPositions = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      const r = 6 + Math.random() * 12;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3 + 0] = r * Math.sin(p) * Math.cos(t);
      starPositions[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      starPositions[i * 3 + 2] = r * Math.cos(p) - 4;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starCanvas = document.createElement("canvas");
    starCanvas.width = starCanvas.height = 64;
    {
      const ctx = starCanvas.getContext("2d")!;
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.5, "rgba(255,255,255,0.4)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
    }
    const starTex = new THREE.CanvasTexture(starCanvas);
    const starMat = new THREE.PointsMaterial({
      size: 0.07,
      map: starTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // -------------------------------------------------------
    // HELPERS
    // -------------------------------------------------------
    const smoothstep = (a: number, b: number, x: number) => {
      const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };
    const segActive = (p: number, start: number, peak: number, end: number) => {
      // 0 outside, ramps to 1 around peak
      if (p < start || p > end) return 0;
      return p < peak
        ? smoothstep(start, peak, p)
        : 1 - smoothstep(peak, end, p);
    };
    const setOpacityRecursive = (
      obj: THREE.Object3D,
      opacity: number,
      baseOpacity = 1
    ) => {
      obj.traverse((c) => {
        const mesh = c as THREE.Mesh;
        if (mesh.material) {
          const mats = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];
          mats.forEach((m) => {
            const mm = m as THREE.Material & { opacity?: number };
            mm.transparent = true;
            mm.opacity = opacity * baseOpacity;
          });
        }
      });
    };

    // Color stops for the persistent ring across the journey
    const ringColorStops = [
      new THREE.Color("#25B181"), // emerald
      new THREE.Color("#34d399"), // mint
      new THREE.Color("#2B63B5"), // brand blue
      new THREE.Color("#f59e0b"), // gold
    ];
    const lerpRing = (p: number) => {
      const t = p * (ringColorStops.length - 1);
      const i = Math.floor(t);
      const f = t - i;
      const a = ringColorStops[Math.min(i, ringColorStops.length - 1)];
      const b = ringColorStops[Math.min(i + 1, ringColorStops.length - 1)];
      return a.clone().lerp(b, f);
    };

    // -------------------------------------------------------
    // RESIZE
    // -------------------------------------------------------
    const onResize = () => {
      if (!mountRef.current) return;
      width = mountRef.current.clientWidth;
      height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    // -------------------------------------------------------
    // RENDER LOOP
    // -------------------------------------------------------
    const clock = new THREE.Clock();
    const tmpV = new THREE.Vector3();
    let frameId = 0;
    const animate = () => {
      const t = clock.getElapsedTime();
      const dt = Math.min(clock.getDelta() + 0.0001, 0.05);
      const p = Math.max(0, Math.min(1, progress.get()));

      // Ring spin + color
      const ringColor = lerpRing(p);
      innerRing.rotation.z = t * 0.4;
      innerRing.rotation.x = Math.sin(t * 0.3) * 0.15;
      outerRing.rotation.z = -t * 0.25;
      innerRingMat.color.copy(ringColor);
      outerRingMat.color.copy(ringColor).lerp(new THREE.Color(0xffffff), 0.3);
      const ringScale = 1 + Math.sin(t * 1.5) * 0.02 + p * 0.15;
      ringGroup.scale.setScalar(ringScale);
      glowMat.color.copy(ringColor).lerp(new THREE.Color(0xffffff), 0.2);
      glowMat.opacity = 0.55 + Math.sin(t * 2) * 0.05;

      // Vignette weights (peak at step center)
      const wDocs = segActive(p, 0.0, 0.16, 0.4);
      const wShield = segActive(p, 0.3, 0.5, 0.7);
      const wCoins = segActive(p, 0.6, 0.84, 1.01);

      // ---- Documents ----
      docs.forEach((d, i) => {
        const angle = t * d.orbitSpeed + d.orbitOffset;
        const radius = d.orbitR * (1 + wDocs * 0.1);
        d.mesh.position.set(
          Math.cos(angle) * radius,
          Math.sin(t * 1.2 + d.flutter) * 0.6 + d.tilt,
          Math.sin(angle) * radius * 0.6 - 0.5
        );
        d.mesh.rotation.x = Math.sin(t * 1.5 + i) * 0.4;
        d.mesh.rotation.y = angle + Math.PI / 2;
        d.mesh.rotation.z = Math.sin(t + i) * 0.2;
      });
      docMat.opacity = wDocs * 0.95;

      // ---- Auth portal (Verify) ----
      authRings.forEach((r, i) => {
        r.rotation.x += dt * (0.45 + i * 0.22);
        r.rotation.y += dt * (0.28 + i * 0.16);
        r.rotation.z += dt * (0.12 + i * 0.06);
        authRingMats[i].opacity = wShield * 0.9;
      });
      core.rotation.x = t * 0.7;
      core.rotation.y = t * 0.5;
      coreWire.rotation.x = -t * 0.32;
      coreWire.rotation.y = -t * 0.5;
      const corePulse = 0.55 + wShield * 0.55 + Math.sin(t * 2.4) * 0.06;
      core.scale.setScalar(corePulse);
      coreWire.scale.setScalar(corePulse * 1.05);
      coreMat.opacity = wShield * 0.95;
      coreWireMat.opacity = wShield * 0.55;
      coreMat.emissiveIntensity = 0.7 + Math.sin(t * 3) * 0.4 + wShield * 0.4;

      // Radar pulses — each one expands and fades on its own phase
      for (let i = 0; i < PULSE_COUNT; i++) {
        const phase = ((t * 0.6 + i * 0.5) % 2);
        const s = 0.4 + phase * 3.2;
        pulseRings[i].scale.setScalar(s);
        pulseRingMats[i].opacity = wShield * Math.max(0, 1 - phase / 2) * 0.7;
        pulseRingMats[i].color.copy(ringColor);
      }

      // Biometric dots orbit on tilted axes
      bioDots.forEach((b, i) => {
        const angle = t * b.orbitSpeed + b.offset;
        tmpV.set(Math.cos(angle) * b.orbitR, 0, Math.sin(angle) * b.orbitR);
        tmpV.applyAxisAngle(b.axis, t * 0.25 + i);
        b.mesh.position.copy(tmpV);
        b.mesh.scale.setScalar(wShield * (0.9 + 0.2 * Math.sin(t * 4 + i)));
      });
      bioMat.opacity = wShield * 0.95;

      // Scanner beam sweeps vertically, fading at top/bottom edges
      const sweepY = ((t * 0.5) % 2.6) - 1.3;
      scanner.position.y = sweepY;
      scannerMat.opacity =
        wShield * Math.max(0, 1 - Math.abs(sweepY) / 1.4) * 0.85;
      scannerMat.color.copy(ringColor).lerp(new THREE.Color(0xffffff), 0.4);

      authGroup.rotation.y = t * 0.05 + (p - 0.5) * 0.4;

      // ---- Coin tornado (Money) ----
      // Each coin rises along a helix path; near the top, radius pinches in
      // (vortex neck), then it loops back to the base. Coins spin on their
      // own axes and tilt to face along the spiral direction.
      coins.forEach((c, i) => {
        const phase = (t * c.speed * 0.45 + c.offset) % 8;
        const lifeT = phase / 8;
        const angle = phase * 1.8 + i * 0.45;
        const y = -3 + phase * 0.95;
        const baseR = 1.6 + Math.sin(t * 0.8 + i) * 0.25;
        const neck = 1 - Math.pow(lifeT, 1.6) * 0.6;
        const radius = baseR * neck;
        c.mesh.position.set(
          Math.cos(angle) * radius,
          y,
          Math.sin(angle) * radius - 1
        );
        c.mesh.rotation.x = Math.PI / 2;
        c.mesh.rotation.y = angle + Math.PI / 2;
        c.mesh.rotation.z += c.spin * dt;
        const fadeIn = smoothstep(0, 0.08, lifeT);
        const fadeOut = 1 - smoothstep(0.85, 1, lifeT);
        const a = wCoins * fadeIn * fadeOut;
        const mat0 = (c.mesh.material as any)[0] as THREE.MeshStandardMaterial;
        const mat1 = (c.mesh.material as any)[1] as THREE.MeshStandardMaterial;
        mat0.opacity = a;
        mat1.opacity = a;
        mat0.transparent = true;
        mat1.transparent = true;
      });
      // Pulsing rupee at the vortex eye
      const rupeePulse = 0.5 + Math.sin(t * 1.5) * 0.06;
      bigRupee.scale.setScalar(5 * (rupeePulse + 0.5));
      bigRupeeMat.opacity = wCoins * 0.55;
      coinsGroup.rotation.y = t * 0.12;

      // Stars
      stars.rotation.y = t * 0.02;
      stars.rotation.x = Math.sin(t * 0.05) * 0.05;

      // Cinematic camera move across the journey
      // Apply: looking head-on at ring
      // Verify: arc above and to the right
      // Money: pull back and tilt down so coins shower in front
      const camPath = (k: number) => {
        // Linear interp between 3 anchor positions
        const A = new THREE.Vector3(0, 0, 10);
        const B = new THREE.Vector3(2.2, 1.0, 8.5);
        const C = new THREE.Vector3(0, -0.6, 11);
        if (k < 0.5) {
          const f = k / 0.5;
          return A.clone().lerp(B, f);
        }
        const f = (k - 0.5) / 0.5;
        return B.clone().lerp(C, f);
      };
      const target = camPath(p);
      camera.position.lerp(target, 0.06);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      // dispose
      innerRingGeo.dispose();
      innerRingMat.dispose();
      outerRingGeo.dispose();
      outerRingMat.dispose();
      docGeo.dispose();
      docMat.dispose();
      paperTex.dispose();
      authRingGeos.forEach((g) => g.dispose());
      authRingMats.forEach((m) => m.dispose());
      coreGeo.dispose();
      coreMat.dispose();
      coreWireGeo.dispose();
      coreWireMat.dispose();
      pulseRingGeo.dispose();
      pulseRingMats.forEach((m) => m.dispose());
      bioGeo.dispose();
      bioMat.dispose();
      scannerGeo.dispose();
      scannerMat.dispose();
      coinGeo.dispose();
      coinFaceMat.dispose();
      coinEdgeMat.dispose();
      coinTex.dispose();
      bigRupeeMat.dispose();
      bigRupeeTex.dispose();
      starGeo.dispose();
      starMat.dispose();
      starTex.dispose();
      glowMat.dispose();
      glowTex.dispose();
      renderer.dispose();
    };
  }, [progress]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
    />
  );
}
