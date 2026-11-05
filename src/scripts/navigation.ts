import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { lenis } from '@/scripts/smooth-scroll';
import { bloquearScroll, liberarScroll } from './scroll-lock';

gsap.registerPlugin(ScrollTrigger);

export function iniciarNav(): () => void {
    const limpiezas: Array<() => void> = [];

    /*1. SCROLL SPY*/
    const secciones = gsap.utils.toArray<HTMLElement>('[data-seccion]');
    const triggers = secciones.map((seccion) => 
    ScrollTrigger.create ({
        trigger: seccion,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
            const enlace = document.querySelector<HTMLElement>(`[data-enlace='${seccion.id}']`);
            if (enlace) enlace.dataset.activo = String(self.isActive);
        },
    }));
    
    limpiezas.push(() => triggers.forEach((t) => t.kill()));

    /*2. BOTÓN VOLVER ARRIBA*/
    const arriba = document.querySelector<HTMLElement>('[data-arriba]');
    if (arriba) {
        gsap.set(arriba, { autoAlpha: 0, y: 20 });
        let visible = false;

        const alScroll = ({ progress }: { progress: number }) => {
            const mostrar = progress > 0.5;
            if (mostrar === visible) return;
            visible = mostrar;
            gsap.to(arriba, { autoAlpha: mostrar ? 1 : 0, y: mostrar ? 0 : 20, duration: 0.3, overwrite: 'auto' });
        };

        const alClic = () => lenis.scrollTo(0, { duration: 1.5 });

        lenis.on('scroll', alScroll);
        arriba.addEventListener('click', alClic);
        limpiezas.push(() => {
            lenis.off('scroll', alScroll);
            arriba.removeEventListener('click', alClic);
        });
    }

    /*3. MENÚ MÓVIL */
    const botonMenu = document.querySelector<HTMLElement>('[data-menu-boton]');
    const menu = document.querySelector<HTMLElement>('[data-menu]');
    if (botonMenu && menu) {
        let abierto = false;

        const cambiar = (estado: boolean) => {
            if (estado === abierto) return;
            abierto = estado;
            botonMenu.setAttribute('aria-expanded', String(abierto));
            if (abierto) bloquearScroll();
            else liberarScroll();
            gsap.to(menu, { autoAlpha: abierto ? 1 : 0, duration: 0.3, overtwrite: 'auto' });
        };

        const alBoton = () => cambiar(!abierto);
        const alEnlace = () => cambiar(false);
const enlaces = menu.querySelectorAll('a');

        botonMenu.addEventListener('click', alBoton);
        enlaces.forEach((a) => a.addEventListener('click', alEnlace));

        limpiezas.push(() => {
            if (abierto) liberarScroll();
            botonMenu.removeEventListener('click', alBoton);
            enlaces.forEach((a) => a.removeEventListener('click', alEnlace));
        });
    }

    return () => limpiezas.forEach((fn) => fn());
};


// export function initNavigation(root: ParentNode = document) {
//     const menu = root.querySelector<HTMLElement>('[data-menu]');
//     const toggle = root.querySelector<HTMLButtonElement>('[data-menu-toggle]');
//     const topButton = root.querySelector<HTMLButtonElement>('[data-top]');
//     if (!menu || !toggle || !topButton) return () => {};

//     let lockCount = 0;
//     const lockScroll = () => { lockCount += 1; lenis.stop(); };
//     const unlockScroll = () => {
//         lockCount = Math.max(0, lockCount - 1);
//         if (lockCount === 0) lenis.start();
//     };

//     let menuOpen = false;
//     const setMenu = (open: boolean) => {
//         if (menuOpen === open) return;
//         menuOpen = open;
//         toggle.setAttribute('aria-expanded', String(open));
//         menu.hidden = !open;
//         if (open) lockScroll(); else unlockScroll();
//     };

//     const onToggle = () => setMenu(!menuOpen);
//     const onMenuClick = (event: Event) => {
//         const target = event.target;
//         if (target instanceof HTMLAnchorElement && target.hash) setMenu(false);
//     };
//     const onKey = (event: KeyboardEvent) => {
//         if (event.key === 'Escape') setMenu(false);
//     };

//     toggle.addEventListener('click', onToggle);
//     menu.addEventListener('click', onMenuClick);
//     document.addEventListener('keydown', onKey);

//     const triggers: ScrollTrigger[] = [];
//     root.querySelectorAll<HTMLElement>('[data-seccion]').forEach((section) => {
//         const id = section.id;
//         if (!id) return;
//         triggers.push(ScrollTrigger.create({
//             trigger: section,
//             start: 'top center',
//             end: 'bottom center',
//             onToggle: (self) => {
//                 root.querySelectorAll<HTMLElement>('[data-enlace]').forEach((link) => {
//                     const active = link.dataset.enlace === id && self.isActive;
//                     link.classList.toggle('activo', active);
//                     if (active) link.setAttribute('aria-current', 'location');
//                     else link.removeAttribute('aria-current');
//                 });
//             }
//         }));
//     });

//     let topVisible = false;
//     const updateTop = ({ progress }: { progress: number }) => {
//         const visible = progress >= 0.5;
//         if (visible === topVisible) return;
//         topVisible = visible;
//         gsap.to(topButton, { autoAlpha: visible ? 1 : 0, duration: 0.2, overwrite: true});
//         topButton.style.pointerEvents = visible ? 'auto' : 'none';
//     };
//     lenis.on('scroll', updateTop);
//     gsap.set(topButton, { autoAlpha: 0 });
//     topButton.style.pointerEvents = 'none';

//     const onTop = () => lenis.scrollTo(0, { duration: 1.2 });
//     topButton.addEventListener('click', onTop);

//     return () => {
//         if (menuOpen) unlockScroll();
//         toggle.removeEventListener('çlick', onToggle);
//         menu.removeEventListener('çlick', onToggle);
//         document.removeEventListener('çlick', onToggle);
//         topButton.removeEventListener('çlick', onToggle);
//         lenis.off('scroll', updateTop);
//         triggers.forEach((trigger) => trigger.kill());
//         gsap.killTweensOf(topButton);
//     };
// }