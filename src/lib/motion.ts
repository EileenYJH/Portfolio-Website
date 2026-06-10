import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function motionOK(): boolean {
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function initMotion(): void {
  if (!motionOK()) return;

  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    try {
      const split = SplitText.create(el, { type: 'lines,words', linesClass: 'split-line' });
      gsap.from(split.words, {
        yPercent: 115,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.035,
        scrollTrigger: { trigger: el, start: 'top 86%', once: true },
      });
    } catch {
      el.style.visibility = 'visible';
    }
  });

  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 36,
      autoAlpha: 0,
      duration: 0.9,
      ease: 'power2.out',
      delay: Number(el.dataset.revealDelay ?? 0),
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

export { gsap, ScrollTrigger };
