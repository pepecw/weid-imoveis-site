import { useEffect, useRef } from 'react';

export function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const dot = dotRef.current;
        const ring = ringRef.current;
        if (!dot || !ring) return;

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;
        let animFrame: number;

        const updateCursor = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        };

        const animateRing = () => {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';
            animFrame = requestAnimationFrame(animateRing);
        };

        const handleHoverIn = () => ring.classList.add('hovered');
        const handleHoverOut = () => ring.classList.remove('hovered');

        const hoverEls = document.querySelectorAll('a, button, .cursor-pointer, .property-card, .quiz-option, .testimonial-card');
        hoverEls.forEach(el => {
            el.addEventListener('mouseenter', handleHoverIn);
            el.addEventListener('mouseleave', handleHoverOut);
        });

        window.addEventListener('mousemove', updateCursor);
        animFrame = requestAnimationFrame(animateRing);

        return () => {
            window.removeEventListener('mousemove', updateCursor);
            cancelAnimationFrame(animFrame);
        };
    }, []);

    return (
        <>
            <div ref={dotRef} className="cursor-dot" />
            <div ref={ringRef} className="cursor-ring" />
        </>
    );
}
