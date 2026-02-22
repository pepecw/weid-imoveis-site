import { useEffect } from 'react';

// Global scroll reveal - called once at app level
export function useScrollReveal() {
    useEffect(() => {
        const reveal = () => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                        }
                    });
                },
                { threshold: 0.05, rootMargin: '50px 0px -20px 0px' }
            );

            const elements = document.querySelectorAll(
                '.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible)'
            );
            elements.forEach(el => observer.observe(el));

            // Re-observe on mutations
            const mutationObs = new MutationObserver(() => {
                const newEls = document.querySelectorAll(
                    '.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible)'
                );
                newEls.forEach(el => observer.observe(el));
            });

            mutationObs.observe(document.body, { childList: true, subtree: true });

            return () => {
                observer.disconnect();
                mutationObs.disconnect();
            };
        };

        // Small delay for initial DOM paint
        const timer = setTimeout(reveal, 200);
        return () => clearTimeout(timer);
    }, []);
}
