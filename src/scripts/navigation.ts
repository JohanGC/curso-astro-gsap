import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { lenis } from '@/scripts/smooth-scroll';

gsap.registerPlugin(ScrollTrigger);

export function initNavigation(root: ParentNode = document) {
    const menu = root.querySelector<HTMLElement>('[data-menu]');
    const toggle = root.querySelector<HTMLButtonElement>('[data-menu-toggle]');
    const topButton = root.querySelector<HTMLButtonElement>('[data-top]');
    if (!menu || !toggle || !topButton) return () => {};

    let lockCount = 0;
    const lockScroll = () => { lockCount += 1; lenis.stop(); };
    const unlockScroll = () => {
        lockCount = Math.max(0, lockCount - 1);
        if (lockCount === 0) lenis.start();
    };

    let menuOpen = false;
    const setMenu = (open: boolean) => {
        if (menuOpen === open) return;
        menuOpen = open;
        toggle.setAttribute('aria-expanded', String(open));
        menu.hidden = !open;
        if (open) lockScroll(); else unlockScroll();
    };

    const onToggle = () => setMenu(!menuOpen);
    const onMenuClick = (event: Event) => {
        const target = event.target;
        if (target instanceof HTMLAnchorElement && target.hash) setMenu(false);
    };
    const onKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') setMenu(false);
    };

    toggle.addEventListener('click', onToggle);
    menu.addEventListener('click', onMenuClick);
    document.addEventListener('keydown', onKey);

    const triggers: ScrollTrigger[] = [];
    root.querySelectorAll<HTMLElement>('[data-seccion]').forEach((section) => {
        const id = section.id;
        if (!id) return;
        triggers.push(ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            onToggle: (self) => {
                root.querySelectorAll<HTMLElement>('[data-enlace]').forEach((link) => {
                    const active = link.dataset.enlace === id && self.isActive;
                    link.classList.toggle('activo', active);
                    if (active) link.setAttribute('aria-current', 'location');
                    else link.removeAttribute('aria-current');
                });
            }
        }));
    });

    let topVisible = false;
    const updateTop = ({ progress }: { progress: number }) => {
        const visible = progress >= 0.5;
        if (visible === topVisible) return;
        topVisible = visible;
        gsap.to(topButton, { autoAlpha: visible ? 1 : 0, duration: 0.2, overwrite: true});
        topButton.style.pointerEvents = visible ? 'auto' : 'none';
    };
    lenis.on('scroll', updateTop);
    gsap.set(topButton, { autoAlpha: 0 });
    topButton.style.pointerEvents = 'none';

    const onTop = () => lenis.scrollTo(0, { duration: 1.2 });
    topButton.addEventListener('click', onTop);

    return () => {
        if (menuOpen) unlockScroll();
        toggle.removeEventListener('çlick', onToggle);
        menu.removeEventListener('çlick', onToggle);
        document.removeEventListener('çlick', onToggle);
        topButton.removeEventListener('çlick', onToggle);
        lenis.off('scroll', updateTop);
        triggers.forEach((trigger) => trigger.kill());
        gsap.killTweensOf(topButton);
    };
}