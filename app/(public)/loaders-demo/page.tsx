'use client';

import { useState } from 'react';
import {
  GoldenPotLoader,
  CubeLoader,
  RippleLoader,
  MorphingLoader,
  DNALoader,
  QuantumLoader,
  GatewayVaultLoader,
  TrustShieldLoader,
  WealthPortalLoader,
} from '@/components/ui/ultimate-loader';
import { X } from 'lucide-react';

export default function LoadersDemoPage() {
  const [activeLoader, setActiveLoader] = useState<string | null>(null);

  const loaders = [
    {
      id: 'golden-pot',
      name: '🏺 Golden Pot with Coins Rain',
      description: 'Mesmerizing golden pot with falling coins and glowing effects',
      component: GoldenPotLoader,
      color: 'from-gold-500 to-gold-600',
    },
    {
      id: 'cube',
      name: '📦 3D Rotating Cube',
      description: '3D cube with particle effects and smooth rotation',
      component: CubeLoader,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      id: 'ripple',
      name: '🌊 Ripple Effect',
      description: 'Concentric ripples with pulsing center logo',
      component: RippleLoader,
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      id: 'morphing',
      name: '🔄 Morphing Shapes',
      description: 'Shape-shifting loader that morphs between geometric forms',
      component: MorphingLoader,
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'dna',
      name: '🧬 DNA Helix',
      description: 'Double helix DNA strand with rotating particles',
      component: DNALoader,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'quantum',
      name: '⚛️ Quantum Field',
      description: 'Quantum particle field with orbital rings',
      component: QuantumLoader,
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      id: 'gateway-vault',
      name: '🏦 Gateway Vault',
      description: 'Opening vault doors revealing light - Gateway to wealth',
      component: GatewayVaultLoader,
      color: 'from-gray-700 to-gold-600',
    },
    {
      id: 'trust-shield',
      name: '🛡️ Trust Shield',
      description: 'Rotating security shield - Your financial security',
      component: TrustShieldLoader,
      color: 'from-blue-600 to-emerald-600',
    },
    {
      id: 'wealth-portal',
      name: '🌀 Wealth Portal',
      description: 'Glowing portal gateway with currency symbols - Journey to freedom',
      component: WealthPortalLoader,
      color: 'from-purple-600 to-emerald-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-heading font-bold text-white mb-4">
            🎨 Ultimate Loading Screens
          </h1>
          <p className="text-2xl text-emerald-300 mb-8">
            9 Mind-blowing, Interactive & Super Creative Loaders
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Click on any loader card below to experience the full-screen loading animation. Each loader is
            crafted with advanced animations, particle effects, and stunning visual effects.
          </p>
        </div>

        {/* Loaders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {loaders.map((loader, index) => (
            <div
              key={loader.id}
              className="group cursor-pointer hover:scale-105 transition-all duration-300 bg-gray-800/50 border-2 border-gray-700 hover:border-emerald-500 overflow-hidden rounded-lg"
              onClick={() => setActiveLoader(loader.id)}
            >
              <div className="p-6">
                {/* Preview Box */}
                <div
                  className={`w-full h-48 bg-gradient-to-br ${loader.color} rounded-xl mb-4 flex items-center justify-center relative overflow-hidden group-hover:shadow-2xl transition-shadow`}
                >
                  <div className="absolute inset-0 bg-black/20" />
                  <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform">
                    {loader.name.split(' ')[0]}
                  </span>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                    <span className="text-white font-bold">Click to Preview</span>
                  </div>
                </div>

                {/* Info */}
                <h3 className="text-xl font-bold text-white mb-2">{loader.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{loader.description}</p>

                <button className="w-full bg-transparent border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Launch Loader
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="bg-gray-800/50 rounded-2xl p-8 border-2 border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">✨ Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🎭', title: 'Framer Motion', desc: 'Smooth 60fps animations' },
              { icon: '🌈', title: 'Gradient Effects', desc: 'Beautiful color transitions' },
              { icon: '✨', title: 'Particle Systems', desc: 'Dynamic particle effects' },
              { icon: '🔄', title: '3D Transforms', desc: 'Real 3D rotation effects' },
              { icon: '💫', title: 'Glow Effects', desc: 'Stunning shadow and glow' },
              { icon: '🎨', title: 'Customizable', desc: 'Easy to modify colors' },
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="text-4xl">{feature.icon}</div>
                <div>
                  <h3 className="text-white font-bold mb-1">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Guide */}
        <div className="mt-12 bg-emerald-900/20 rounded-2xl p-8 border-2 border-emerald-700">
          <h2 className="text-3xl font-bold text-white mb-4">📖 How to Use</h2>
          <div className="space-y-4 text-gray-300">
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code className="text-emerald-400">{`import { GoldenPotLoader } from '@/components/ui/ultimate-loader';

// Use in your component
export default function MyPage() {
  return (
    <div>
      <GoldenPotLoader />
    </div>
  );
}`}</code>
            </pre>
            <p className="text-sm">
              Each loader is a standalone component that you can import and use anywhere in your app. All loaders
              are full-screen by default and include beautiful animations powered by Framer Motion.
            </p>
          </div>
        </div>
      </div>

      {/* Active Loader Overlay */}
      {activeLoader && (
        <div className="fixed inset-0 z-[100]">
          {/* Close Button */}
          <button
            onClick={() => setActiveLoader(null)}
            className="absolute top-8 right-8 z-[110] w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Render Active Loader */}
          {loaders.map((loader) => {
            if (loader.id === activeLoader) {
              const LoaderComponent = loader.component;
              return <LoaderComponent key={loader.id} />;
            }
            return null;
          })}

          {/* Instructions */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[110] text-center">
            <p className="text-white/80 text-sm bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full">
              Press ESC or click the ✕ button to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
