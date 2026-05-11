"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Morphing iridescent blob + wireframe shell + floating crystal shards.
 * Uses a custom vertex shader with 3D simplex noise for organic deformation,
 * and a fragment shader with fresnel + iridescent gradient through brand colors.
 */
export default function LoginScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ---------- GLSL: 3D simplex noise (Ashima Arts, MIT) ----------
    const noiseGLSL = `
      vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
      float snoise(vec3 v){
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute( permute( permute(
                  i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
      }
    `;

    // ---------- Morphing blob (high-poly icosahedron) ----------
    const blobGeometry = new THREE.IcosahedronGeometry(1.8, 64);
    const blobUniforms = {
      uTime: { value: 0 },
      uIntensity: { value: 0.45 },
      uColorA: { value: new THREE.Color("#25B181") },
      uColorB: { value: new THREE.Color("#51C9AF") },
      uColorC: { value: new THREE.Color("#2B63B5") },
      uColorD: { value: new THREE.Color("#a78bfa") },
    };

    const blobMaterial = new THREE.ShaderMaterial({
      uniforms: blobUniforms,
      transparent: true,
      vertexShader: `
        uniform float uTime;
        uniform float uIntensity;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vDisplacement;
        ${noiseGLSL}
        void main() {
          float n1 = snoise(position * 1.2 + uTime * 0.35);
          float n2 = snoise(position * 2.5 - uTime * 0.25);
          float displacement = n1 * 0.6 + n2 * 0.3;
          vec3 newPos = position + normal * displacement * uIntensity;
          vDisplacement = displacement;
          vPosition = newPos;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uColorC;
        uniform vec3 uColorD;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vDisplacement;
        void main() {
          float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.5);
          float t1 = 0.5 + 0.5 * sin(uTime * 0.6 + vPosition.y * 1.2);
          float t2 = 0.5 + 0.5 * cos(uTime * 0.4 + vPosition.x * 1.5);
          vec3 baseA = mix(uColorA, uColorB, t1);
          vec3 baseB = mix(uColorC, uColorD, t2);
          vec3 color = mix(baseA, baseB, fresnel);
          // Edge glow
          color += fresnel * 0.6;
          // Displacement-tinted highlights
          color += vec3(0.15, 0.35, 0.25) * smoothstep(0.2, 0.8, vDisplacement);
          float alpha = 0.55 + fresnel * 0.45;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const blob = new THREE.Mesh(blobGeometry, blobMaterial);
    scene.add(blob);

    // ---------- Wireframe shell (slightly larger, same displacement) ----------
    const shellGeometry = new THREE.IcosahedronGeometry(1.95, 24);
    const shellMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 0.5 },
        uColor: { value: new THREE.Color("#34d399") },
      },
      transparent: true,
      wireframe: true,
      vertexShader: `
        uniform float uTime;
        uniform float uIntensity;
        ${noiseGLSL}
        void main() {
          float n1 = snoise(position * 1.0 + uTime * 0.3);
          float n2 = snoise(position * 2.0 - uTime * 0.22);
          float displacement = n1 * 0.55 + n2 * 0.3;
          vec3 newPos = position + normal * displacement * uIntensity;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        void main() {
          gl_FragColor = vec4(uColor, 0.18);
        }
      `,
    });
    const shell = new THREE.Mesh(shellGeometry, shellMaterial);
    scene.add(shell);

    // ---------- Floating crystal shards ----------
    type Shard = {
      mesh: THREE.Mesh;
      orbitRadius: number;
      orbitSpeed: number;
      orbitOffset: number;
      tilt: number;
      spin: THREE.Vector3;
    };
    const shards: Shard[] = [];
    const SHARD_COUNT = 14;
    const shardGeometries = [
      new THREE.TetrahedronGeometry(0.22),
      new THREE.OctahedronGeometry(0.18),
      new THREE.IcosahedronGeometry(0.16, 0),
    ];
    const shardPalette = [0x25b181, 0x51c9af, 0x34d399, 0xa78bfa, 0x2b63b5];
    for (let i = 0; i < SHARD_COUNT; i++) {
      const geo = shardGeometries[i % shardGeometries.length];
      const mat = new THREE.MeshBasicMaterial({
        color: shardPalette[i % shardPalette.length],
        wireframe: true,
        transparent: true,
        opacity: 0.7,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const orbitRadius = 2.8 + Math.random() * 2.4;
      const orbitSpeed = 0.15 + Math.random() * 0.25;
      const orbitOffset = Math.random() * Math.PI * 2;
      const tilt = (Math.random() - 0.5) * 1.6;
      shards.push({
        mesh,
        orbitRadius,
        orbitSpeed,
        orbitOffset,
        tilt,
        spin: new THREE.Vector3(
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5
        ),
      });
      scene.add(mesh);
    }

    // ---------- Background dust particles ----------
    const DUST_COUNT = 250;
    const dustPositions = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      const r = 5 + Math.random() * 8;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      dustPositions[i * 3 + 0] = r * Math.sin(p) * Math.cos(t);
      dustPositions[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      dustPositions[i * 3 + 2] = r * Math.cos(p) - 3;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));

    const dustCanvas = document.createElement("canvas");
    dustCanvas.width = dustCanvas.height = 64;
    const dctx = dustCanvas.getContext("2d");
    if (dctx) {
      const g = dctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.5, "rgba(81,201,175,0.5)");
      g.addColorStop(1, "rgba(37,177,129,0)");
      dctx.fillStyle = g;
      dctx.fillRect(0, 0, 64, 64);
    }
    const dustTexture = new THREE.CanvasTexture(dustCanvas);
    const dustMaterial = new THREE.PointsMaterial({
      size: 0.09,
      map: dustTexture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: 0xffffff,
      opacity: 0.7,
    });
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dust);

    // ---------- Mouse parallax ----------
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let frameId = 0;
    const animate = () => {
      const t = clock.getElapsedTime();
      blobUniforms.uTime.value = t;
      shellMaterial.uniforms.uTime.value = t;

      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      blob.rotation.y = t * 0.18;
      blob.rotation.x = Math.sin(t * 0.25) * 0.25;
      shell.rotation.y = -t * 0.12;
      shell.rotation.x = Math.cos(t * 0.2) * 0.2;

      shards.forEach((s, i) => {
        const angle = t * s.orbitSpeed + s.orbitOffset;
        s.mesh.position.x = Math.cos(angle) * s.orbitRadius;
        s.mesh.position.z = Math.sin(angle) * s.orbitRadius - 1;
        s.mesh.position.y = Math.sin(t * 0.4 + i) * 0.6 + s.tilt;
        s.mesh.rotation.x += s.spin.x * 0.01;
        s.mesh.rotation.y += s.spin.y * 0.01;
        s.mesh.rotation.z += s.spin.z * 0.01;
      });

      dust.rotation.y = t * 0.025;
      dust.rotation.x = Math.sin(t * 0.1) * 0.1;

      camera.position.x = mouse.x * 0.8;
      camera.position.y = -mouse.y * 0.5;
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
      blobGeometry.dispose();
      blobMaterial.dispose();
      shellGeometry.dispose();
      shellMaterial.dispose();
      shards.forEach((s) => {
        (s.mesh.material as THREE.Material).dispose();
      });
      shardGeometries.forEach((g) => g.dispose());
      dustGeometry.dispose();
      dustMaterial.dispose();
      dustTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
    />
  );
}
