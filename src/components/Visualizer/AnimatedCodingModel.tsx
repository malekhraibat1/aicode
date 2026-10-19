import React, { useRef, useEffect, useState } from 'react';
import { 
  Code2, 
  Terminal, 
  Cpu, 
  Sparkles, 
  Zap, 
  Layers, 
  Play, 
  Maximize2, 
  Minimize2,
  Activity,
  Braces,
  Binary
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  size: number;
  alpha: number;
  color: string;
  depth: number;
}

export const AnimatedCodingModel: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, isGenerating, selectedModel } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<'syntax' | 'matrix' | 'hologram'>('syntax');
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [typedLineIndex, setTypedLineIndex] = useState(0);
  const [typedCharIndex, setTypedCharIndex] = useState(0);

  const codeSnippets = [
    'const swarm = new NeuralModelSwarm({ engines: ["DeepSeek-R1", "Qwen-Coder"] });',
    'await swarm.orchestrate({ task: "Compile Real-time Sandbox App", optimizeAST: true });',
    'export async function executeCrossModelHandoff(context: ExecutionPayload) {',
    '  const tokenStream = await qwenKernel.generateInteractiveComponents(context);',
    '  return renderLiveSandboxVirtualDOM(tokenStream, { hotReload: true, fps: 60 });',
    '} // Neural Architecture Synced with Zero Context Loss 🚀'
  ];

  // Mouse interaction
  const mouseRef = useRef({ x: -1000, y: -1000, isHovered: false });

  // Code symbols and tokens for particle generation
  const tokens = ['const', '=>', '{ }', '</>', 'async', 'await', 'import', 'function', 'return', '0101', '0xFA', 'AST', 'git', 'diff', 'TS', 'UI'];
  const colors = ['#6366f1', '#06b6d4', '#10b981', '#a855f7', '#38bdf8', '#f43f5e'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = isExpanded ? 240 : 120);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = isExpanded ? 240 : 120;
    };

    window.addEventListener('resize', handleResize);

    // Initialize particles
    const particleCount = isExpanded ? 55 : 30;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        char: tokens[Math.floor(Math.random() * tokens.length)],
        size: Math.floor(Math.random() * 4) + 10,
        alpha: Math.random() * 0.6 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        depth: Math.random() * 2 + 0.5,
      });
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Background Cyber grid
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 28;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Render connectors (neural syntax nodes)
      if (mode === 'syntax' || mode === 'hologram') {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 85) {
              const alpha = (1 - dist / 85) * 0.25;
              ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();

              // Pulse particle on the line
              if (frame % 3 === 0) {
                const pulseRatio = (frame % 60) / 60;
                const px = particles[i].x + (particles[j].x - particles[i].x) * pulseRatio;
                const py = particles[i].y + (particles[j].y - particles[i].y) * pulseRatio;
                ctx.fillStyle = 'rgba(99, 102, 241, 0.6)';
                ctx.fillRect(px - 1, py - 1, 2, 2);
              }
            }
          }
        }
      }

      // Update and draw code particles
      particles.forEach((p, idx) => {
        p.x += p.vx * (isGenerating ? 2.2 : 1);
        p.y += p.vy * (isGenerating ? 2.2 : 1);

        // Wrap around borders
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Mouse repelling/attraction effect
        if (mouseRef.current.isHovered) {
          const mdx = p.x - mouseRef.current.x;
          const mdy = p.y - mouseRef.current.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 100) {
            const angle = Math.atan2(mdy, mdx);
            p.x += Math.cos(angle) * 2;
            p.y += Math.sin(angle) * 2;
          }
        }

        // Draw particle
        ctx.save();
        ctx.font = `${p.size}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fillText(p.char, p.x, p.y);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mode, isExpanded, isGenerating]);

  // Animated Code Typing Effect
  useEffect(() => {
    const currentText = codeSnippets[typedLineIndex];
    if (typedCharIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setTypedCharIndex(prev => prev + 1);
      }, isGenerating ? 25 : 45);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setTypedCharIndex(0);
        setTypedLineIndex(prev => (prev + 1) % codeSnippets.length);
      }, 1600);
      return () => clearTimeout(timeout);
    }
  }, [typedCharIndex, typedLineIndex, isGenerating]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isHovered: true,
      };
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current.isHovered = false;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-3xl overflow-hidden border border-indigo-500/30 dark:border-indigo-500/20 bg-gradient-to-br from-slate-950 via-indigo-950/60 to-slate-950 shadow-2xl transition-all duration-300"
    >
      {/* Background Neon Glow Orbs */}
      <div className="absolute -top-16 -start-16 w-48 h-48 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -end-16 w-48 h-48 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none"></div>

      {/* Top HUD Controls Bar */}
      <div className="relative z-10 px-4 py-2.5 border-b border-indigo-500/20 bg-slate-950/70 backdrop-blur-md flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 font-mono text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>AI NEURAL ENGINE</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span>MODEL:</span>
            <strong className="text-cyan-400 font-bold">{selectedModel.name}</strong>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Activity className="w-3 h-3" />
              {isGenerating ? 'GENERATING CODE...' : 'STANDBY 60 FPS'}
            </span>
          </div>
        </div>

        {/* View Mode Pills & Minimize/Maximize */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono font-bold">
            <button
              onClick={() => setMode('syntax')}
              className={`px-2 py-0.5 rounded transition ${mode === 'syntax' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              SYNTAX
            </button>
            <button
              onClick={() => setMode('matrix')}
              className={`px-2 py-0.5 rounded transition ${mode === 'matrix' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              MATRIX
            </button>
            <button
              onClick={() => setMode('hologram')}
              className={`px-2 py-0.5 rounded transition ${mode === 'hologram' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              QUANTUM
            </button>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title={isExpanded ? 'تصغير النموذج' : 'تكبير النموذج'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Canvas Interactive Simulation */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full block cursor-crosshair"
          style={{ height: isExpanded ? '220px' : '110px' }}
        />

        {/* Floating Holographic Terminal Overlay */}
        <div className="absolute inset-x-3 bottom-3 p-3 rounded-2xl bg-slate-950/80 border border-indigo-500/30 backdrop-blur-md shadow-2xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-6 h-6 rounded-lg bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shrink-0">
              <Terminal className="w-3.5 h-3.5" />
            </div>

            <div className="font-mono text-slate-200 text-[11px] truncate">
              <span className="text-indigo-400 font-bold">$ </span>
              <span>{codeSnippets[typedLineIndex].slice(0, typedCharIndex)}</span>
              <span className="inline-block w-1.5 h-3.5 ms-1 bg-cyan-400 animate-pulse align-middle"></span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 shrink-0 text-[10px] font-mono text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-300">
              AST::OPTIMIZED
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400">
              HOT_RELOAD
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
