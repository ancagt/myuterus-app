import { useEffect } from 'react';

export type CursorDesign = 'stars' | 'hearts' | 'flowers' | 'none';

export default function CursorTrail({ design }: { design: CursorDesign }) {
  useEffect(() => {
    if (design === 'none') return;

    const activeParticles = new Set<HTMLSpanElement>();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');
    let lastParticleAt = 0;

    function onPointerMove(event: PointerEvent) {
      if (!finePointer.matches || reducedMotion.matches || event.pointerType === 'touch') return;
      if (event.timeStamp - lastParticleAt < 55 || activeParticles.size >= 18) return;
      lastParticleAt = event.timeStamp;

      const particle = document.createElement('span');
      particle.className = `cursor-particle cursor-particle--${design}`;
      particle.textContent = design === 'hearts' ? '♥' : design === 'flowers' ? '✿' : '✦';
      particle.setAttribute('aria-hidden', 'true');
      particle.style.left = `${event.clientX + (Math.random() - 0.5) * 24}px`;
      particle.style.top = `${event.clientY + (Math.random() - 0.5) * 24}px`;
      particle.style.setProperty('--particle-drift', `${(Math.random() - 0.5) * 30}px`);
      particle.style.fontSize = `${10 + Math.random() * 8}px`;

      activeParticles.add(particle);
      document.body.appendChild(particle);
      particle.addEventListener('animationend', () => {
        particle.remove();
        activeParticles.delete(particle);
      }, { once: true });
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      activeParticles.forEach((particle) => particle.remove());
      activeParticles.clear();
    };
  }, [design]);

  return null;
}