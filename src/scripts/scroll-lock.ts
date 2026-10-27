import { lenis } from '@/scripts/smooth-scroll';

let bloqueos = 0;

export function bloquearScroll() {
    bloqueos += 1;
    lenis.stop();
}

export function liberarScroll() {
    bloqueos = Math.max(0, bloqueos -1);
    if (bloqueos === 0) lenis.start();
}