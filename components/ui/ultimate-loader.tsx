'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

// ================================
// VARIANT 1: GOLDEN POT WITH COINS RAIN
// ================================
export function GoldenPotLoader() {
  const [coins, setCoins] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCoins((prev) => [...prev, Math.random()]);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-gold-900 overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold-400/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: -20,
            }}
            animate={{
              y: window.innerHeight + 20,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Glowing Aura */}
        <motion.div
          className="absolute inset-0 -m-32"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="absolute inset-0 bg-gradient-radial from-gold-400/50 via-transparent to-transparent blur-3xl" />
        </motion.div>

        {/* Golden Pot */}
        <motion.div
          className="relative w-48 h-48 mx-auto mb-8"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Pot Glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-gold-300 to-gold-600 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />

          {/* Pot */}
          <div className="relative w-full h-full">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-gold-400 via-gold-500 to-gold-700 rounded-[40%] shadow-2xl"
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            >
              {/* Shine Effect */}
              <motion.div
                className="absolute top-6 left-6 w-16 h-16 bg-white/40 rounded-full blur-xl"
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />

              {/* Currency Symbol */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  className="text-6xl font-bold text-emerald-900"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  ₹
                </motion.span>
              </div>
            </motion.div>
          </div>

          {/* Falling Coins */}
          {coins.slice(-15).map((coin, index) => (
            <motion.div
              key={index}
              className="absolute top-0 left-1/2 w-8 h-8 bg-gradient-to-br from-gold-300 to-gold-600 rounded-full shadow-lg"
              initial={{
                x: (Math.random() - 0.5) * 100,
                y: -50,
                rotate: 0,
                scale: 0,
              }}
              animate={{
                y: 300,
                rotate: 360 * 3,
                scale: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2,
                ease: 'easeIn',
              }}
            >
              <span className="absolute inset-0 flex items-center justify-center text-xs text-emerald-900 font-bold">
                ₹
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          className="text-5xl font-heading font-bold text-white mb-4"
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          Quikkred
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-xl text-gold-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Trust. Grow. Shine.
        </motion.p>

        {/* Loading Dots */}
        <div className="flex gap-3 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-4 h-4 bg-gold-400 rounded-full shadow-lg"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ================================
// VARIANT 2: 3D ROTATING CUBE WITH PARTICLES
// ================================
export function CubeLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative">
        {/* 3D Cube */}
        <motion.div
          className="relative w-32 h-32"
          style={{
            transformStyle: 'preserve-3d',
          }}
          animate={{
            rotateX: 360,
            rotateY: 360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {/* Cube Faces */}
          {[
            { transform: 'translateZ(64px)', bg: 'from-emerald-600 to-emerald-700' },
            { transform: 'rotateY(90deg) translateZ(64px)', bg: 'from-gold-600 to-gold-700' },
            { transform: 'rotateY(180deg) translateZ(64px)', bg: 'from-royal-600 to-royal-700' },
            { transform: 'rotateY(-90deg) translateZ(64px)', bg: 'from-emerald-700 to-emerald-800' },
            { transform: 'rotateX(90deg) translateZ(64px)', bg: 'from-gold-700 to-gold-800' },
            { transform: 'rotateX(-90deg) translateZ(64px)', bg: 'from-royal-700 to-royal-800' },
          ].map((face, i) => (
            <div
              key={i}
              className={`absolute w-32 h-32 bg-gradient-to-br ${face.bg} border-2 border-white/20 flex items-center justify-center text-white text-4xl font-bold shadow-2xl`}
              style={{
                transform: face.transform,
                backfaceVisibility: 'hidden',
              }}
            >
              ₹
            </div>
          ))}
        </motion.div>

        {/* Loading Text */}
        <motion.p
          className="text-white text-2xl font-bold mt-16 text-center"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          Loading Experience...
        </motion.p>
      </div>
    </div>
  );
}

// ================================
// VARIANT 3: RIPPLE EFFECT WITH LOGO
// ================================
export function RippleLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-emerald-950 via-emerald-900 to-gold-950">
      <div className="relative">
        {/* Multiple Ripples */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border-4 border-emerald-400/30 rounded-full"
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: 3,
              opacity: 0,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeOut',
            }}
            style={{
              width: '200px',
              height: '200px',
              left: '50%',
              top: '50%',
              marginLeft: '-100px',
              marginTop: '-100px',
            }}
          />
        ))}

        {/* Center Logo */}
        <motion.div
          className="relative w-48 h-48 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center shadow-2xl"
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 0 40px rgba(16, 185, 129, 0.5)',
              '0 0 80px rgba(16, 185, 129, 0.8)',
              '0 0 40px rgba(16, 185, 129, 0.5)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <motion.span
            className="text-7xl font-bold text-gold-300"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            ₹
          </motion.span>
        </motion.div>

        {/* Loading Bar */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-64">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 via-gold-500 to-emerald-500"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
          <p className="text-white text-center mt-2 text-sm">Loading your financial future...</p>
        </div>
      </div>
    </div>
  );
}

// ================================
// VARIANT 4: MORPHING SHAPES
// ================================
export function MorphingLoader() {
  const shapes = ['circle', 'square', 'triangle', 'hexagon'];
  const [currentShape, setCurrentShape] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShape((prev) => (prev + 1) % shapes.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900 via-emerald-900 to-blue-900">
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentShape}
            className="w-48 h-48 bg-gradient-to-br from-emerald-400 to-gold-500 shadow-2xl flex items-center justify-center"
            initial={{ scale: 0, rotate: 0 }}
            animate={{
              scale: 1,
              rotate: 360,
              borderRadius:
                currentShape === 0
                  ? '50%'
                  : currentShape === 1
                  ? '10%'
                  : currentShape === 2
                  ? '0%'
                  : '20%',
            }}
            exit={{ scale: 0, rotate: 720 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-6xl font-bold text-white">₹</span>
          </motion.div>
        </AnimatePresence>

        <motion.p
          className="text-white text-2xl font-bold mt-12 text-center"
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          {shapes[currentShape].toUpperCase()}
        </motion.p>
      </div>
    </div>
  );
}

// ================================
// VARIANT 5: DNA HELIX LOADER
// ================================
export function DNALoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-cyan-950 via-emerald-950 to-purple-950">
      <div className="relative w-64 h-96">
        {/* DNA Strands */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-0 right-0 flex justify-between"
            style={{
              top: `${i * 20}px`,
            }}
            animate={{
              rotateY: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.1,
            }}
          >
            <div className="w-8 h-8 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50" />
            <div className="w-8 h-8 bg-gold-500 rounded-full shadow-lg shadow-gold-500/50" />
          </motion.div>
        ))}

        {/* Center Glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-emerald-500/20 via-gold-500/20 to-emerald-500/20 blur-xl"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-white text-xl font-bold">Quikkred</p>
          <p className="text-emerald-400 text-sm">Processing...</p>
        </div>
      </div>
    </div>
  );
}

// ================================
// VARIANT 6: QUANTUM FIELD
// ================================
export function QuantumLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden">
      {/* Quantum Particles */}
      <div className="absolute inset-0">
        {[...Array(200)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400 rounded-full"
            style={{
              left: `${50 + Math.cos((i * 2 * Math.PI) / 200) * 40}%`,
              top: `${50 + Math.sin((i * 2 * Math.PI) / 200) * 40}%`,
            }}
            animate={{
              scale: [0, 2, 0],
              opacity: [0, 1, 0],
              left: `${50 + Math.cos((i * 2 * Math.PI) / 200) * 45}%`,
              top: `${50 + Math.sin((i * 2 * Math.PI) / 200) * 45}%`,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: (i * 0.05) % 3,
            }}
          />
        ))}
      </div>

      {/* Center Core */}
      <motion.div
        className="relative w-64 h-64"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border-2 border-emerald-500/30 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
              rotate: i * 120,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1,
            }}
            style={{
              transformOrigin: 'center',
            }}
          />
        ))}

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-gold-500 rounded-full flex items-center justify-center"
            animate={{
              boxShadow: [
                '0 0 20px rgba(16, 185, 129, 0.5)',
                '0 0 60px rgba(16, 185, 129, 1)',
                '0 0 20px rgba(16, 185, 129, 0.5)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <span className="text-5xl font-bold text-white">₹</span>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center">
        <motion.p
          className="text-white text-2xl font-bold mb-2"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          QUANTUM LOADING
        </motion.p>
        <p className="text-emerald-400">Initializing secure connection...</p>
      </div>
    </div>
  );
}

// ================================
// VARIANT 7: HYPER-REALISTIC PROFESSIONAL VAULT LOADER - Quikkred
// ================================
// ================================
// PROFESSIONAL WEALTH VAULT - Quikkred (Wealth Delivery Theme)
// ================================
export function GatewayVaultLoader() {
  const [vaultOpen, setVaultOpen] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [lockRotation, setLockRotation] = useState(0);
  const [stage, setStage] = useState<'init' | 'auth' | 'unlock' | 'open' | 'ready'>('init');

  useEffect(() => {
    const sequence = async () => {
      // Initial delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setStage('auth');

      // Authentication phase
      await new Promise(resolve => setTimeout(resolve, 1200));
      setStage('unlock');
      setUnlocking(true);

      // Realistic lock rotation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUnlocking(false);
      setStage('open');
      setVaultOpen(true);

      // Door fully open
      await new Promise(resolve => setTimeout(resolve, 2500));
      setStage('ready');
    };
    sequence();
  }, []);

  // Continuous lock rotation during unlock
  useEffect(() => {
    if (!unlocking) return;
    const interval = setInterval(() => {
      setLockRotation(prev => prev + 3);
    }, 16);
    return () => clearInterval(interval);
  }, [unlocking]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black">
      {/* Professional dark background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950" />

      {/* Subtle golden ambient light */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse 800px 600px at 50% 40%, rgba(217,168,84,0.15), transparent)',
        }}
      />

      {/* Main vault structure */}
      <div className="relative" style={{ perspective: '1500px' }}>

        {/* Vault door assembly - 600x600px professional size */}
        <div className="relative w-[600px] h-[600px]">

          {/* Steel frame with gold accents */}
          <div className="absolute inset-0 rounded-lg"
            style={{
              background: 'linear-gradient(145deg, #2d2d30 0%, #1e1e20 50%, #2d2d30 100%)',
              boxShadow: `
                inset 0 2px 4px rgba(255,255,255,0.1),
                inset 0 -2px 4px rgba(0,0,0,0.8),
                0 20px 60px rgba(0,0,0,0.6),
                0 0 40px rgba(217,168,84,0.1)
              `,
              border: '2px solid #3a3a3d',
            }}
          >
            {/* Gold chrome trim */}
            <div className="absolute inset-4 rounded"
              style={{
                background: 'linear-gradient(to right, #d9a854 0%, #f4d9a0 50%, #d9a854 100%)',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3), inset 0 -1px 2px rgba(0,0,0,0.4)',
                opacity: 0.8,
              }}
            />
          </div>

          {/* Left door */}
          <motion.div
            className="absolute left-0 top-0 w-1/2 h-full origin-left"
            initial={{ rotateY: 0, x: 0 }}
            animate={{
              rotateY: vaultOpen ? -95 : 0,
              x: vaultOpen ? -15 : 0,
            }}
            transition={{
              duration: 2.5,
              ease: [0.32, 0.72, 0, 1],
            }}
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="w-full h-full rounded-l-lg overflow-hidden"
              style={{
                background: 'linear-gradient(to right, #27272a 0%, #3f3f46 30%, #27272a 100%)',
                boxShadow: `
                  inset 20px 0 40px rgba(0,0,0,0.4),
                  inset -5px 0 20px rgba(255,255,255,0.05),
                  -15px 0 40px rgba(0,0,0,0.3)
                `,
                border: '1px solid #18181b',
                borderRight: 'none',
              }}
            >
              {/* Brushed steel texture */}
              <div className="absolute inset-0 opacity-20"
                style={{
                  background: `repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 1px,
                    rgba(255,255,255,0.03) 1px,
                    rgba(255,255,255,0.03) 2px
                  )`,
                }}
              />

              {/* Reinforcement panels */}
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="absolute left-6 right-6 h-[22%] bg-zinc-800/40 rounded border"
                  style={{
                    top: `${15 + i * 28}%`,
                    borderColor: 'rgba(217,168,84,0.3)',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5), 0 0 10px rgba(217,168,84,0.1)',
                  }}
                />
              ))}

              {/* Gold rivets/bolts */}
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: i % 2 === 0 ? '12px' : 'calc(100% - 20px)',
                    top: `${8 + Math.floor(i / 2) * 12}%`,
                    background: 'radial-gradient(circle, #d9a854 40%, #b8860b)',
                    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4), 0 1px 2px rgba(0,0,0,0.6), 0 0 4px rgba(217,168,84,0.3)',
                  }}
                />
              ))}

              {/* Combination lock with gold accent */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32">
                {/* Lock housing */}
                <div className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, #3f3f46 0%, #27272a 70%)',
                    boxShadow: `
                      0 4px 12px rgba(0,0,0,0.4),
                      inset 0 2px 4px rgba(255,255,255,0.1),
                      inset 0 -2px 4px rgba(0,0,0,0.4),
                      0 0 20px rgba(217,168,84,0.2)
                    `,
                  }}
                />

                {/* Gold chrome ring */}
                <div className="absolute inset-2 rounded-full"
                  style={{
                    background: 'conic-gradient(from 0deg, #d9a854, #f4d9a0, #d9a854, #b8860b, #d9a854)',
                    boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.4), inset 0 -2px 3px rgba(0,0,0,0.6)',
                  }}
                />

                {/* Dial face */}
                <motion.div
                  className="absolute inset-4 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
                    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8)',
                  }}
                  animate={{
                    rotate: unlocking ? lockRotation : 0,
                  }}
                  transition={{
                    duration: 0.05,
                    ease: 'linear',
                  }}
                >
                  {/* Dial numbers in gold */}
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute font-mono text-xs font-bold"
                      style={{
                        transform: `rotate(${i * 30}deg) translateY(-32px)`,
                        color: '#d9a854',
                      }}
                    >
                      <span style={{ transform: `rotate(-${i * 30}deg)`, display: 'block' }}>
                        {i === 0 ? 12 : i}
                      </span>
                    </div>
                  ))}

                  {/* Gold center indicator */}
                  <div className="w-1 h-10 rounded-full shadow-lg"
                    style={{
                      background: 'linear-gradient(to bottom, #f4d9a0, #d9a854)',
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right door - mirror of left */}
          <motion.div
            className="absolute right-0 top-0 w-1/2 h-full origin-right"
            initial={{ rotateY: 0, x: 0 }}
            animate={{
              rotateY: vaultOpen ? 95 : 0,
              x: vaultOpen ? 15 : 0,
            }}
            transition={{
              duration: 2.5,
              ease: [0.32, 0.72, 0, 1],
            }}
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="w-full h-full rounded-r-lg overflow-hidden"
              style={{
                background: 'linear-gradient(to left, #27272a 0%, #3f3f46 30%, #27272a 100%)',
                boxShadow: `
                  inset -20px 0 40px rgba(0,0,0,0.4),
                  inset 5px 0 20px rgba(255,255,255,0.05),
                  15px 0 40px rgba(0,0,0,0.3)
                `,
                border: '1px solid #18181b',
                borderLeft: 'none',
              }}
            >
              <div className="absolute inset-0 opacity-20"
                style={{
                  background: `repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 1px,
                    rgba(255,255,255,0.03) 1px,
                    rgba(255,255,255,0.03) 2px
                  )`,
                }}
              />

              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="absolute left-6 right-6 h-[22%] bg-zinc-800/40 rounded border"
                  style={{
                    top: `${15 + i * 28}%`,
                    borderColor: 'rgba(217,168,84,0.3)',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5), 0 0 10px rgba(217,168,84,0.1)',
                  }}
                />
              ))}

              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    right: i % 2 === 0 ? '12px' : 'calc(100% - 20px)',
                    top: `${8 + Math.floor(i / 2) * 12}%`,
                    background: 'radial-gradient(circle, #d9a854 40%, #b8860b)',
                    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4), 0 1px 2px rgba(0,0,0,0.6), 0 0 4px rgba(217,168,84,0.3)',
                  }}
                />
              ))}

              <div className="absolute left-8 top-1/2 -translate-y-1/2 w-32 h-32">
                <div className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, #3f3f46 0%, #27272a 70%)',
                    boxShadow: `
                      0 4px 12px rgba(0,0,0,0.4),
                      inset 0 2px 4px rgba(255,255,255,0.1),
                      inset 0 -2px 4px rgba(0,0,0,0.4),
                      0 0 20px rgba(217,168,84,0.2)
                    `,
                  }}
                />

                <div className="absolute inset-2 rounded-full"
                  style={{
                    background: 'conic-gradient(from 0deg, #d9a854, #f4d9a0, #d9a854, #b8860b, #d9a854)',
                    boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.4), inset 0 -2px 3px rgba(0,0,0,0.6)',
                  }}
                />

                <motion.div
                  className="absolute inset-4 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
                    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8)',
                  }}
                  animate={{
                    rotate: unlocking ? -lockRotation : 0,
                  }}
                  transition={{
                    duration: 0.05,
                    ease: 'linear',
                  }}
                >
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute font-mono text-xs font-bold"
                      style={{
                        transform: `rotate(${i * 30}deg) translateY(-32px)`,
                        color: '#d9a854',
                      }}
                    >
                      <span style={{ transform: `rotate(-${i * 30}deg)`, display: 'block' }}>
                        {i === 0 ? 12 : i}
                      </span>
                    </div>
                  ))}

                  <div className="w-1 h-10 rounded-full shadow-lg"
                    style={{
                      background: 'linear-gradient(to bottom, #f4d9a0, #d9a854)',
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Inner vault content - WEALTH THEME */}
          <AnimatePresence>
            {vaultOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                {/* Golden interior light */}
                <div className="absolute w-96 h-96 rounded-full blur-3xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(217,168,84,0.15), transparent)',
                  }}
                />

                {/* Wealth content */}
                <div className="relative text-center">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="space-y-6"
                  >
                    {/* Logo - replacing diamond */}
                    <motion.div
                      className="mb-6 flex justify-center"
                      animate={{
                        scale: [1, 1.05, 1],
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <div className="relative rounded-3xl overflow-hidden bg-white/10 backdrop-blur-xl p-6 shadow-2xl">
                        <Image
                          src="/logo 2.png"
                          alt="Quikkred Logo"
                          width={400}
                          height={120}
                          className="w-auto h-32 object-contain"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-gold-400/10 rounded-3xl pointer-events-none" />
                      </div>
                    </motion.div>

                    {/* Floating currency symbols - representing wealth delivery */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-full flex justify-center gap-12">
                      {['₹', '$', '€'].map((symbol, i) => (
                        <motion.span
                          key={symbol}
                          className="text-3xl font-bold"
                          style={{
                            color: '#d9a854',
                            textShadow: '0 0 20px rgba(217,168,84,0.5)',
                          }}
                          animate={{
                            y: [0, -15, 0],
                            opacity: [0.4, 1, 0.4],
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: "easeInOut"
                          }}
                        >
                          {symbol}
                        </motion.span>
                      ))}
                    </div>

                    {/* Brand name - professional typography */}
                    <h2 className="text-5xl font-light tracking-wider text-zinc-100 mb-2">
                      Quikkred
                    </h2>

                    {/* WEALTH-FOCUSED TAGLINE */}
                    <p className="text-sm tracking-wide uppercase"
                      style={{
                        color: '#d9a854',
                        textShadow: '0 0 10px rgba(217,168,84,0.3)',
                      }}
                    >
                      Delivering Wealth & Prosperity
                    </p>

                    {/* Subtitle emphasizing wealth provision */}
                    <p className="text-zinc-400 text-xs tracking-wide">
                      Your Trusted Wealth Partner
                    </p>

                    {/* Gold underline */}
                    <div className="w-32 h-px mx-auto mt-4"
                      style={{
                        background: 'linear-gradient(to right, transparent, rgba(217,168,84,0.6), transparent)',
                        boxShadow: '0 0 8px rgba(217,168,84,0.3)',
                      }}
                    />

                    {/* Wealth indicators - subtle professional touch */}
                    <motion.div
                      className="flex justify-center gap-6 mt-6 text-xs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2, duration: 1 }}
                    >
                      {['Wealth Growth', 'Asset Protection', 'Financial Freedom'].map((text) => (
                        <span key={text} className="text-zinc-500 tracking-wide">
                          {text}
                        </span>
                      ))}
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Professional status bar */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div className="bg-zinc-900/80 backdrop-blur-sm rounded px-6 py-3 border border-zinc-800">
          <div className="flex items-center gap-3">
            {/* Status indicator with gold accent */}
            <div className="w-2 h-2 rounded-full"
              style={{
                background: stage === 'ready' ? '#d9a854' : '#6b7280',
                boxShadow: stage === 'ready' ? '0 0 8px rgba(217,168,84,0.6)' : 'none',
              }}
            />

            {/* Status text */}
            <span className="text-zinc-400 text-sm font-medium">
              {stage === 'init' && 'Initializing wealth vault...'}
              {stage === 'auth' && 'Authenticating access...'}
              {stage === 'unlock' && 'Unlocking prosperity gateway...'}
              {stage === 'open' && 'Accessing your wealth...'}
              {stage === 'ready' && 'Welcome to your wealth journey'}
            </span>
          </div>
        </div>
      </div>

      {/* Professional security badge with gold accent */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        <div className="bg-zinc-900/60 backdrop-blur-sm rounded-full px-5 py-2 border"
          style={{
            borderColor: 'rgba(217,168,84,0.3)',
          }}
        >
          <div className="flex items-center gap-2">
            <div className="text-sm" style={{ color: '#d9a854' }}>🔒</div>
            <span className="text-xs font-medium tracking-wide" style={{ color: '#d9a854' }}>
              WEALTH PROTECTION ENABLED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================================
// VARIANT 8: TRUST SHIELD LOADER
// ================================
export function TrustShieldLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-950 via-emerald-950 to-blue-950 overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0">
        {[...Array(80)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            animate={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      {/* Main Shield */}
      <div className="relative">
        {/* Rotating Rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border-2 border-emerald-500/30 rounded-full"
            style={{
              width: 300 + i * 50,
              height: 300 + i * 50,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              rotate: i % 2 === 0 ? 360 : -360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 8 + i * 2, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity },
            }}
          />
        ))}

        {/* Shield Body */}
        <motion.div
          className="relative w-64 h-72"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          {/* Shield Shape */}
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl">
            <defs>
              <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <motion.path
              d="M50 10 L90 25 L90 60 Q90 100 50 110 Q10 100 10 60 L10 25 Z"
              fill="url(#shieldGradient)"
              stroke="#d97706"
              strokeWidth="2"
              filter="url(#glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </svg>

          {/* Shield Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <svg className="w-24 h-24 text-gold-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
              </svg>
            </motion.div>
          </div>

          {/* Checkmark Animation */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Trust Text */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-center w-96">
          <motion.h3
            className="text-2xl font-bold text-white mb-2"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Secured & Trusted
          </motion.h3>
          <p className="text-emerald-300">Your financial security is our priority</p>
        </div>
      </div>
    </div>
  );
}

// ================================
// VARIANT 9: WEALTH PORTAL LOADER
// ================================
export function WealthPortalLoader() {
  const currencies = ['₹', '$', '€', '£', '¥'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-emerald-950 overflow-hidden">
      {/* Starfield Background */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Portal Container */}
      <div className="relative w-96 h-96">
        {/* Portal Rings */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border-2 rounded-full"
            style={{
              width: 400 - i * 60,
              height: 400 - i * 60,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              borderColor: i % 2 === 0 ? '#10b981' : '#d97706',
              borderStyle: 'dashed',
            }}
            animate={{
              rotate: i % 2 === 0 ? 360 : -360,
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              rotate: { duration: 10 - i, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity },
              opacity: { duration: 2, repeat: Infinity },
            }}
          />
        ))}

        {/* Portal Center Glow */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-radial from-emerald-400 via-purple-500 to-transparent rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.9, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        {/* Currency Symbols Orbiting */}
        {currencies.map((symbol, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 w-16 h-16 -ml-8 -mt-8"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.4,
            }}
            style={{
              transformOrigin: `50% ${120 + i * 20}px`,
            }}
          >
            <motion.div
              className="w-full h-full bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg"
              animate={{
                rotate: -360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity },
              }}
            >
              {symbol}
            </motion.div>
          </motion.div>
        ))}

        {/* Center Portal Icon */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-emerald-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl"
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              '0 0 40px rgba(16,185,129,0.5)',
              '0 0 80px rgba(16,185,129,0.8)',
              '0 0 40px rgba(16,185,129,0.5)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Text */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center">
        <motion.h3
          className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-gold-400 mb-2"
          animate={{
            backgroundPosition: ['0%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          Entering Wealth Portal
        </motion.h3>
        <p className="text-purple-300 text-lg">Your journey to financial freedom begins</p>
      </div>
    </div>
  );
}

// ================================
// VARIANT 10: ULTIMATE COMBINED LOADER
// ================================
export function UltimateLoader({ variant = 'golden-pot' }: { variant?: string }) {
  const loaders = {
    'golden-pot': GoldenPotLoader,
    'cube': CubeLoader,
    'ripple': RippleLoader,
    'morphing': MorphingLoader,
    'dna': DNALoader,
    'quantum': QuantumLoader,
    'gateway-vault': GatewayVaultLoader,
    'trust-shield': TrustShieldLoader,
    'wealth-portal': WealthPortalLoader,
  };

  const LoaderComponent = loaders[variant as keyof typeof loaders] || GoldenPotLoader;

  return <LoaderComponent />;
}

// Demo Component to showcase all loaders
export function LoaderShowcase() {
  const [currentLoader, setCurrentLoader] = useState(0);
  const loaderVariants = ['golden-pot', 'cube', 'ripple', 'morphing', 'dna', 'quantum', 'gateway-vault', 'trust-shield', 'wealth-portal'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLoader((prev) => (prev + 1) % loaderVariants.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return <UltimateLoader variant={loaderVariants[currentLoader]} />;
}
