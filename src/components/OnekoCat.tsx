import React, { useEffect, useRef } from 'react';

/**
 * OnekoCat - Cleaned & Corrected Version
 * - Directional alignment fixed (no more running backwards)
 * - Removed all legacy/messy comments
 * - Synchronized 100ms update loop
 */
const OnekoCat: React.FC = () => {
  const nekoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const nekoEl = nekoRef.current;
    if (!nekoEl) return;

    // Official Oneko Sprite Sheet
    const GIF_URL = 'https://raw.githubusercontent.com/adryd325/oneko.js/main/oneko.gif';

    nekoEl.style.backgroundImage = `url(${GIF_URL})`;
    nekoEl.style.backgroundSize = 'auto';

    Object.assign(nekoEl.style, {
      position: 'fixed',
      width: '32px',
      height: '32px',
      imageRendering: 'pixelated',
      zIndex: '2147483647',
      pointerEvents: 'none',
      display: 'block',
      visibility: 'visible',
    });

    // SPRITE COORDINATE MAPPING (Verified for Forward Movement)
    const spriteSets: Record<string, [number, number][]> = {
      idle: [[-3, -3]],
      alert: [[-7, -3]],
      scratchSelf: [[-5, 0], [-6, 0], [-7, 0]],
      scratchWallN: [[0, 0], [0, -1]],
      scratchWallS: [[-7, -1], [-6, -2]],
      scratchWallE: [[-2, -2], [-2, -3]],
      scratchWallW: [[-4, 0], [-4, -1]],
      tired: [[-3, -2]],
      sleeping: [[-2, 0], [-2, -1]],
      N: [[-1, -2], [-1, -3]],
      NE: [[0, -2], [0, -3]],
      E: [[-3, 0], [-3, -1]],
      SE: [[-5, -1], [-5, -2]],
      S: [[-6, -3], [-7, -2]],
      SW: [[-5, -3], [-6, -1]],
      W: [[-4, -2], [-4, -3]],
      NW: [[-1, 0], [-1, -1]],
    };

    let nekoPosX = window.innerWidth / 2;
    let nekoPosY = window.innerHeight / 2;
    let mousePosX = nekoPosX;
    let mousePosY = nekoPosY;

    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation: string | null = null;
    let idleAnimationFrame = 0;
    const nekoSpeed = 12;

    const setSprite = (name: string, frame: number) => {
      const set = spriteSets[name];
      if (!set) return;
      const sprite = set[frame % set.length];
      nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
    };

    const resetIdleAnimation = () => {
      idleAnimation = null;
      idleAnimationFrame = 0;
    };

    const idle = () => {
      idleTime += 1;
      if (idleTime > 10 && Math.floor(Math.random() * 200) === 0 && idleAnimation == null) {
        const avail: string[] = ['sleeping', 'scratchSelf'];
        if (nekoPosX < 32) avail.push('scratchWallW');
        if (nekoPosY < 32) avail.push('scratchWallN');
        if (nekoPosX > window.innerWidth - 32) avail.push('scratchWallE');
        if (nekoPosY > window.innerHeight - 32) avail.push('scratchWallS');
        idleAnimation = avail[Math.floor(Math.random() * avail.length)];
      }

      switch (idleAnimation) {
        case 'sleeping':
          if (idleAnimationFrame < 8) { setSprite('tired', 0); break; }
          setSprite('sleeping', Math.floor(idleAnimationFrame / 4));
          if (idleAnimationFrame > 192) resetIdleAnimation();
          break;
        default:
          if (idleAnimation && spriteSets[idleAnimation]) {
            setSprite(idleAnimation, idleAnimationFrame);
            if (idleAnimationFrame > 9) resetIdleAnimation();
          } else {
            setSprite('idle', 0);
          }
          break;
      }
      idleAnimationFrame += 1;
    };

    const frame = () => {
      frameCount += 1;
      const diffX = nekoPosX - mousePosX;
      const diffY = nekoPosY - mousePosY;
      const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

      if (distance < nekoSpeed || distance < 48) {
        idle();
      } else {
        idleAnimation = null;
        idleAnimationFrame = 0;
        if (idleTime > 1) {
          setSprite('alert', 0);
          idleTime = Math.min(idleTime, 7);
          idleTime -= 1;
        } else {
          idleTime = 0;
          let dir = '';
          if (diffY / distance > 0.5) dir += 'N';
          if (diffY / distance < -0.5) dir += 'S';
          if (diffX / distance > 0.5) dir += 'W';
          if (diffX / distance < -0.5) dir += 'E';
          setSprite(dir || 'idle', frameCount);
          nekoPosX -= (diffX / distance) * nekoSpeed;
          nekoPosY -= (diffY / distance) * nekoSpeed;
          nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
          nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);
        }
      }
      nekoEl.style.left = `${nekoPosX - 16}px`;
      nekoEl.style.top = `${nekoPosY - 16}px`;
    };

    const onMouseMove = (e: MouseEvent) => {
      mousePosX = e.clientX;
      mousePosY = e.clientY;
    };
    document.addEventListener('mousemove', onMouseMove);

    let lastTimestamp: number | null = null;
    let rafId: number;

    const loop = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      if (timestamp - lastTimestamp >= 100) {
        lastTimestamp = timestamp;
        frame();
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <div id="oneko-cat" ref={nekoRef} />;
};

export default OnekoCat;