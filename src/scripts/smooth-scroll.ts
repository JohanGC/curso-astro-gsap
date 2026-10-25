import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const lenis = new Lenis ({
    lerp: 0.1, autoRaf: false,
    smoothWheel: true,
});

//1) cada vez que Lenis mueve el scroll, ScrollTrigger se actualiza
lenis.on('scroll', ScrollTrigger.update);

//2) el ticket de GSAP impulsa a Lenis (GSAP da segundos, Lenis espera milisegundos)
gsap.ticker.add((time) => lenis.raf(time * 1000));

//3) evita saltos cuando la pestaña se relentiza
gsap.ticker.lagSmoothing(0);


// function raf(time: number) {
//     lenis.raf(time);
//     requestAnimationFrame(raf);
// }

// requestAnimationFrame(raf);