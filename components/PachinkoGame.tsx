'use client';

import { useEffect, useRef, useState } from 'react';
import * as Matter from 'matter-js';
import { ChevronsDown } from 'lucide-react';
import { motion, animate } from 'motion/react';

export default function PachinkoGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  const [round, setRound] = useState(1);
  const [target, setTarget] = useState(50);
  const [displayedTarget, setDisplayedTarget] = useState(50);
  const displayedTargetRef = useRef(50);
  const [gold, setGold] = useState(0);
  const [marbles, setMarbles] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [showBanner, setShowBanner] = useState<{round: number, target: number} | null>({round: 1, target: 50});

  // Mutable state for physics callbacks to avoid stale closures
  const stateRef = useRef({
    round: 1,
    target: 50,
    gold: 0,
    marbles: 5,
    activeMarbles: 0,
    gameOver: false,
  });
  const gyroGravityXRef = useRef(0);
  const gyroEnabledRef = useRef(false);

  const enableGyro = async () => {
    if (gyroEnabledRef.current) return;
    
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const gamma = event.gamma;
      if (gamma !== null) {
        let gravityX = gamma / 30;
        gravityX = Math.max(-1.5, Math.min(1.5, gravityX));
        gyroGravityXRef.current = gravityX;
      }
    };

    if (typeof window !== 'undefined' && (window as any).DeviceOrientationEvent?.requestPermission) {
      try {
        const permission = await (window as any).DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
          gyroEnabledRef.current = true;
        }
      } catch (error) {
        console.error("Gyro permission error:", error);
      }
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
      gyroEnabledRef.current = true;
    }
  };

  useEffect(() => {
    stateRef.current = {
      round,
      target,
      gold,
      marbles,
      activeMarbles: stateRef.current.activeMarbles,
      gameOver,
    };
  }, [round, target, gold, marbles, gameOver]);

  function checkGameState() {
    const state = stateRef.current;
    if (state.gameOver) return;

    if (state.marbles === 0 && state.activeMarbles === 0) {
      if (state.gold >= state.target) {
        const nextRound = state.round + 1;
        const nextTarget = 50 * nextRound + state.target;
        setRound(nextRound);
        setTarget(nextTarget);
        setMarbles(5);
        setShowBanner({round: nextRound, target: nextTarget});
        state.round = nextRound;
        state.target = nextTarget;
        state.marbles = 5;
      } else {
        setGameOver(true);
        state.gameOver = true;
      }
    }
  }

  useEffect(() => {
    if (displayedTargetRef.current === target) return;
    
    if (displayedTargetRef.current > target) {
      const controls = animate(displayedTargetRef.current, target, {
        duration: 0,
        onUpdate: (value) => {
          const rounded = Math.round(value);
          displayedTargetRef.current = rounded;
          setDisplayedTarget(rounded);
        }
      });
      return () => controls.stop();
    }

    const controls = animate(displayedTargetRef.current, target, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (value) => {
        const rounded = Math.round(value);
        displayedTargetRef.current = rounded;
        setDisplayedTarget(rounded);
      }
    });
    
    return () => controls.stop();
  }, [target]);

  // Removed the redundant useEffect for deviceorientation here.

  useEffect(() => {
    if (!containerRef.current) return;

    const engine = Matter.Engine.create();
    // 掉落速度减少20% (默认 gravity.y 是 1)
    engine.gravity.y = 0.8;
    engine.gravity.x = 0; // Disable global horizontal gravity
    engineRef.current = engine;
    const world = engine.world;

    const render = Matter.Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio || 1,
      },
    });
    renderRef.current = render;

    const width = render.options.width!;
    const height = render.options.height!;

    // Boundaries
    const wallOptions = { isStatic: true, render: { fillStyle: '#1c1917' } };
    Matter.Composite.add(world, [
      Matter.Bodies.rectangle(width / 2, height + 10, width, 20, { ...wallOptions, label: 'floor' }),
      Matter.Bodies.rectangle(-10, height / 2, 20, height, wallOptions),
      Matter.Bodies.rectangle(width + 10, height / 2, 20, height, wallOptions),
    ]);

    // Golden Gates (Added before pegs so they render behind)
    const gateValues = [5, 10, 15, 15, 10, 5];
    const gates = [];
    const rows = 5;
    const spacingY = height / 8;
    const startY = height * 0.3;
    const spacingX = width / 6;
    const gateY = startY + 4 * spacingY;
    
    for (let i = 0; i < 6; i++) {
      const gateWidth = spacingX * 0.8;
      const gateHeight = 16;
      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40" viewBox="0 0 100 40"><rect width="100" height="40" fill="rgba(234, 179, 8, 0.3)" stroke="#ca8a04" stroke-width="4" rx="4"/><text x="50" y="28" font-family="sans-serif" font-size="24" font-weight="900" fill="#fef08a" text-anchor="middle">+${gateValues[i]}</text></svg>`;
      const encodedSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

      gates.push(Matter.Bodies.rectangle(
        spacingX * (i + 0.5),
        gateY,
        gateWidth,
        gateHeight,
        {
          isStatic: true,
          isSensor: true,
          label: `gate_${gateValues[i]}`,
          render: {
            sprite: {
              texture: encodedSvg,
              xScale: gateWidth / 100,
              yScale: gateHeight / 40,
            }
          }
        }
      ));
    }
    Matter.Composite.add(world, gates);

    // Pegs
    const pegSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><defs><linearGradient id="cyanPeg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#a5f3fc" /><stop offset="50%" stop-color="#06b6d4" /><stop offset="100%" stop-color="#164e63" /></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect x="6" y="6" width="20" height="20" rx="4" fill="url(#cyanPeg)" stroke="#22d3ee" stroke-width="1.5" filter="url(#glow)"/></svg>`;
    const pegSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(pegSvgString)}`;

    const pegOptions = {
      isStatic: true,
      angle: Math.PI / 4,
      chamfer: { radius: 4 },
      render: {
        sprite: {
          texture: pegSvg,
          xScale: 1,
          yScale: 1,
        }
      },
      label: 'peg',
    };
    const pegs = [];
    
    for (let row = 0; row < rows; row++) {
      const cols = row % 2 === 0 ? 5 : 4;
      const offsetX = row % 2 === 0 ? spacingX : spacingX * 1.5;
      for (let col = 0; col < cols; col++) {
        pegs.push(Matter.Bodies.rectangle(offsetX + col * spacingX, startY + row * spacingY, 20, 20, pegOptions));
      }
    }
    Matter.Composite.add(world, pegs);

    // Deferred modifications
    const bodiesToRemove: Matter.Body[] = [];
    const bodiesToAdd: Matter.Body[] = [];

    const brickSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 16"><defs><linearGradient id="goldBrick" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fef08a" /><stop offset="50%" stop-color="#eab308" /><stop offset="100%" stop-color="#a16207" /></linearGradient></defs><rect width="24" height="16" rx="2" fill="url(#goldBrick)" stroke="#854d0e" stroke-width="1"/><rect x="2" y="2" width="20" height="12" rx="1" fill="none" stroke="#ca8a04" stroke-width="1"/></svg>`;
    const brickSvg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(brickSvgString)}`;

    const handleCollision = (event: Matter.IEventCollision<Matter.Engine>) => {
      try {
        let newGold = 0;
        let activeMarblesChanged = false;

        event.pairs.forEach((pair) => {
          const { bodyA, bodyB } = pair;
          const isMarbleA = bodyA.label === 'marble';
          const isMarbleB = bodyB.label === 'marble';
          const isPegA = bodyA.label === 'peg';
          const isPegB = bodyB.label === 'peg';
          const isFloorA = bodyA.label === 'floor';
          const isFloorB = bodyB.label === 'floor';
          const isGateA = bodyA.label.startsWith('gate_');
          const isGateB = bodyB.label.startsWith('gate_');

          if ((isMarbleA && isPegB) || (isMarbleB && isPegA)) {
            const peg = isPegA ? bodyA : bodyB;
            const marble = isMarbleA ? bodyA : bodyB;
            
            if (!bodiesToRemove.includes(marble)) {
              // 碰到菱形弹射点的弹性增加±10%的浮动（每一档为2%）
              // -5 到 5 的随机整数，乘以 0.02
              const step = Math.floor(Math.random() * 11) - 5;
              marble.restitution = 0.6 + (step * 0.02);

              // Spawn bricks
              for (let i = 0; i < 3; i++) {
                const brick = Matter.Bodies.rectangle(peg.position.x, peg.position.y, 12, 8, {
                  label: 'brick',
                  render: {
                    sprite: {
                      texture: brickSvg,
                      xScale: 0.5,
                      yScale: 0.5,
                    }
                  },
                  friction: 0.1,
                  restitution: 0.2,
                });
                Matter.Body.setVelocity(brick, {
                  x: (Math.random() - 0.5) * 6,
                  y: -Math.random() * 4 - 2,
                });
                bodiesToAdd.push(brick);
              }
              newGold += 5;
            }
          }

          if ((isMarbleA && isGateB) || (isMarbleB && isGateA)) {
            const marble = isMarbleA ? bodyA : bodyB;
            const gate = isGateA ? bodyA : bodyB;
            
            if (!bodiesToRemove.includes(marble)) {
              bodiesToRemove.push(marble);
              stateRef.current.activeMarbles = Math.max(0, stateRef.current.activeMarbles - 1);
              activeMarblesChanged = true;
              
              const amount = parseInt(gate.label.split('_')[1], 10);
              newGold += amount;
              
              for (let i = 0; i < amount; i++) {
                const brick = Matter.Bodies.rectangle(marble.position.x, marble.position.y, 12, 8, {
                  label: 'brick',
                  render: {
                    sprite: {
                      texture: brickSvg,
                      xScale: 0.5,
                      yScale: 0.5,
                    }
                  },
                  friction: 0.1,
                  restitution: 0.2,
                });
                Matter.Body.setVelocity(brick, {
                  x: (Math.random() - 0.5) * 8,
                  y: -Math.random() * 5 - 2,
                });
                bodiesToAdd.push(brick);
              }
            }
          }

          if ((isMarbleA && isFloorB) || (isMarbleB && isFloorA)) {
            const marble = isMarbleA ? bodyA : bodyB;
            if (!bodiesToRemove.includes(marble)) {
              bodiesToRemove.push(marble);
              stateRef.current.activeMarbles = Math.max(0, stateRef.current.activeMarbles - 1);
              activeMarblesChanged = true;
            }
          }
        });

        if (newGold > 0) {
          setGold((g) => g + newGold);
          stateRef.current.gold += newGold;
        }
        
        if (newGold > 0 || activeMarblesChanged) {
          checkGameState();
        }
      } catch (err) {
        console.error(err);
      }
    };

    const handleAfterUpdate = () => {
      try {
        if (bodiesToRemove.length > 0) {
          Matter.Composite.remove(world, bodiesToRemove);
          bodiesToRemove.length = 0;
        }
        if (bodiesToAdd.length > 0) {
          Matter.Composite.add(world, bodiesToAdd);
          bodiesToAdd.length = 0;
        }
        
        const bricks = Matter.Composite.allBodies(world).filter((b) => b.label === 'brick');
        // Apply gyroscope force to bricks
        bricks.forEach(brick => {
          Matter.Body.applyForce(brick, brick.position, { x: gyroGravityXRef.current * 0.005, y: 0 });
        });
        
        if (bricks.length > 520) {
          Matter.Composite.remove(world, bricks.slice(0, bricks.length - 520));
        }
      } catch (err) {
        console.error(err);
      }
    };

    Matter.Events.on(engine, 'collisionStart', handleCollision);
    Matter.Events.on(engine, 'afterUpdate', handleAfterUpdate);

    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      if (render.canvas) render.canvas.remove();
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
      Matter.Events.off(engine, 'collisionStart', handleCollision);
      Matter.Events.off(engine, 'afterUpdate', handleAfterUpdate);
    };
  }, []);

  const handleDrop = async (e: React.MouseEvent<HTMLDivElement>) => {
    // Request gyro permission on first interaction (iOS 13+)
    await enableGyro();

    const state = stateRef.current;
    if (state.marbles <= 0 || state.gameOver || !engineRef.current || !renderRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width;
    const physicsX = relativeX * renderRef.current.options.width!;

    setMarbles((m) => m - 1);
    state.marbles -= 1;
    state.activeMarbles += 1;

    // 金币 SVG Data URI
    const coinSvg = `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22gold%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23fef08a%22%20%2F%3E%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23eab308%22%20%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23a16207%22%20%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%2211%22%20fill%3D%22url(%23gold)%22%20stroke%3D%22%23854d0e%22%20stroke-width%3D%221%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%228%22%20fill%3D%22none%22%20stroke%3D%22%23ca8a04%22%20stroke-width%3D%221%22%2F%3E%3Ctext%20x%3D%2212%22%20y%3D%2216.5%22%20font-family%3D%22sans-serif%22%20font-size%3D%2212%22%20font-weight%3D%22900%22%20fill%3D%22%23854d0e%22%20text-anchor%3D%22middle%22%3E%24%3C%2Ftext%3E%3C%2Fsvg%3E`;

    const marble = Matter.Bodies.circle(physicsX, 20, 12, {
      label: 'marble',
      render: {
        sprite: {
          texture: coinSvg,
          xScale: 1,
          yScale: 1,
        }
      },
      restitution: 0.6,
      friction: 0.001,
      density: 0.05,
    });
    Matter.Composite.add(engineRef.current.world, marble);
  };

  const restartGame = () => {
    setRound(1);
    setTarget(50);
    setDisplayedTarget(50);
    displayedTargetRef.current = 50;
    setGold(0);
    setMarbles(5);
    setGameOver(false);
    setShowBanner({round: 1, target: 50});
    stateRef.current = { round: 1, target: 50, gold: 0, marbles: 5, activeMarbles: 0, gameOver: false };

    if (engineRef.current) {
      const world = engineRef.current.world;
      const bodiesToRemove = Matter.Composite.allBodies(world).filter(
        (b) => b.label === 'marble' || b.label === 'brick'
      );
      Matter.Composite.remove(world, bodiesToRemove);
    }
  };

  return (
    <div className="relative w-full h-full max-w-md mx-auto bg-stone-900 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-x-4 border-yellow-600/30 flex flex-col">
      {/* Physics Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 [&>canvas]:w-full [&>canvas]:h-full [&>canvas]:object-cover" />

      {/* Top Section Overlay (Contains Stats and Drop Prompt) */}
      <div
        className="absolute top-0 left-0 w-full h-[25%] cursor-pointer z-10 flex flex-col items-center justify-start pt-6 px-4 bg-gradient-to-b from-black/90 via-black/60 to-transparent"
        onClick={handleDrop}
      >
        {/* Stats */}
        <div className="flex justify-between items-start w-full text-white drop-shadow-lg pl-14 sm:pl-0">
          <div>
            <div className="text-xs text-stone-400 font-bold">当前轮次</div>
            <div className="text-2xl font-black text-yellow-500">{round}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-stone-400 font-bold">金砖收集</div>
            <div className="text-3xl font-black text-yellow-400">
              {gold} <span className="text-sm text-stone-400">/ {displayedTarget}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-stone-400 font-bold">剩余弹珠</div>
            <div className="text-2xl font-black text-cyan-400">{marbles}</div>
          </div>
        </div>

        {/* Drop Prompt */}
        <motion.div
          animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex flex-col items-center text-yellow-500 mt-4 pointer-events-none"
        >
          <ChevronsDown className="w-8 h-8" />
          <span className="font-bold tracking-widest text-xs drop-shadow-md">点击投入弹珠</span>
        </motion.div>
      </div>

      {/* Round Banner */}
      {showBanner !== null && (
        <motion.div
          key={`${showBanner.round}-${showBanner.target}`}
          animate={{ 
            scale: [0.8, 1, 1, 1.2], 
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: 2, times: [0, 0.15, 0.85, 1], ease: "easeInOut" }}
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          onAnimationComplete={() => setShowBanner(null)}
        >
          <div className="bg-gradient-to-r from-transparent via-yellow-600/90 to-transparent w-full py-6 text-center backdrop-blur-sm border-y-2 border-yellow-400/50 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
            <motion.h2 
              animate={{ letterSpacing: ["0.1em", "0.3em", "0.3em", "0.5em"] }}
              transition={{ duration: 2, times: [0, 0.15, 0.85, 1] }}
              className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 to-yellow-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            >
              第 {showBanner.round} 轮
            </motion.h2>
            <p className="text-yellow-200 font-bold mt-2 text-xl drop-shadow-md">目标: {showBanner.target} 金砖</p>
          </div>
        </motion.div>
      )}

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm">
          <h2 className="text-5xl font-black text-red-500 mb-2 drop-shadow-lg">游戏结束</h2>
          <p className="text-stone-300 mb-8 text-lg">最终收集金砖: <span className="text-yellow-400 font-bold">{gold}</span></p>
          <button
            onClick={restartGame}
            className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-stone-900 font-black rounded-full hover:from-yellow-500 hover:to-yellow-400 active:scale-95 transition-all shadow-lg shadow-yellow-600/20"
          >
            重新开始
          </button>
        </div>
      )}
    </div>
  );
}
