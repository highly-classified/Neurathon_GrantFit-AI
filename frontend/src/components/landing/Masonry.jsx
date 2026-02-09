import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './Masonry.css';

gsap.registerPlugin(ScrollTrigger);

const useMedia = (queries, values, defaultValue) => {
    const match = () => values[queries.findIndex(q => matchMedia(q).matches)] ?? defaultValue;
    const [value, setValue] = useState(match);

    useEffect(() => {
        const handler = () => setValue(match);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);

    return value;
};

const useMeasure = () => {
    const ref = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        if (!ref.current) return;
        const ro = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setSize({ width, height });
        });
        ro.observe(ref.current);
        return () => ro.disconnect();
    }, []);

    return [ref, size];
};

const Masonry = ({
    items,
    ease = 'power3.out',
    duration = 0.6,
    stagger = 0.05,
    animateFrom = 'bottom',
    scaleOnHover = true,
    hoverScale = 1.02, // Slighly less aggressive scale
    blurToFocus = false, // Disable blur by default as it might be distracting for text
    colorShiftOnHover = false
}) => {
    // Determine number of columns based on screen width
    // Adjusted breakpoints for FeatureCards
    const columns = useMedia(
        ['(min-width: 1024px)', '(min-width: 768px)'],
        [3, 2],
        1
    );

    const [containerRef, { width }] = useMeasure();

    // Calculate grid positions
    const grid = useMemo(() => {
        if (!width) return [];

        const colHeights = new Array(columns).fill(0);
        const columnWidth = width / columns;

        // We want to center the grid if possible, but standard masonry fills left-to-right based on height.
        // The user has a specific layout in mind: 
        // Left col: Top, Bottom
        // Center col: Tall center card
        // Right col: Top, Bottom
        // This naturally happens with a greedy Masonry algorithm if items are ordered correctly by height and appearance.
        // However, standard Masonry fills the *shortest* column.

        // Let's stick to the standard greedy masonry for robustness across screen sizes.
        // The user can order items to influence placement.

        return items.map(child => {
            const col = colHeights.indexOf(Math.min(...colHeights));
            const x = columnWidth * col;
            const height = child.height; // Use full height
            const y = colHeights[col];

            colHeights[col] += height;

            return { ...child, x, y, w: columnWidth, h: height };
        });
    }, [columns, items, width]);

    // Calculate container height to prevent overlap with following sections
    const containerHeight = useMemo(() => {
        if (!width || items.length === 0) return 0;
        // We need to re-calculate logic to find max height, 
        // easiest is to replicate the fill logic or just trace the max of colHeights from the grid calculation if we had access.
        // Since we don't return colHeights from the grid memo, let's recalculate quickly or just use the max y + h from grid items.
        if (grid.length === 0) return 0;
        return Math.max(...grid.map(i => i.y + i.h));
    }, [grid, width, items]);


    const hasMounted = useRef(false);

    useLayoutEffect(() => {
        // Refresh ScrollTrigger or GSAP logic if needed
        // Simple entry animation
        if (!grid.length) return;

        // Clean up previous ScrollTriggers to prevent duplicates/memory leaks on re-renders
        ScrollTrigger.getAll().forEach(t => t.kill());

        grid.forEach((item, index) => {
            const selector = `[data-key="${item.id}"]`;
            const animationProps = {
                x: item.x,
                y: item.y,
                width: item.w,
                height: item.h,
                opacity: 1,
                filter: 'blur(0px)'
            };

            if (!hasMounted.current) {
                // Use a standard offset for "float up" rather than window height
                // ensuring it looks like it's coming from just below
                let initialY = item.y + 100;

                // If user really wants them to fly in from far bottom, can use this:
                // but usually for scroll trigger, a smaller offset feels better as "floating into view"
                if (animateFrom === 'bottom') initialY = item.y + 150;

                gsap.fromTo(selector,
                    {
                        x: item.x,
                        y: initialY,
                        width: item.w,
                        height: item.h,
                        opacity: 0,
                        filter: blurToFocus ? 'blur(10px)' : 'none'
                    },
                    {
                        ...animationProps,
                        duration: 1, // Slower entry
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: selector,
                            start: "top 85%", // Start animation when top of card hits 85% viewport height
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            } else {
                gsap.to(selector, {
                    ...animationProps,
                    duration: duration,
                    ease: ease
                });
            }
        });

        hasMounted.current = true;

        return () => {
            // Cleanup on unmount/re-render
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [grid, stagger, animateFrom, blurToFocus, duration, ease]);

    // Hover effects
    const handleMouseEnter = (e, item) => {
        if (!scaleOnHover) return;
        const selector = `[data-key="${item.id}"] .feature-card-inner`;
        // We target the inner card to avoid messing up the absolute positioning layout of the wrapper

        gsap.to(selector, {
            scale: hoverScale,
            duration: 0.3,
            ease: 'power2.out'
        });
    };

    const handleMouseLeave = (e, item) => {
        if (!scaleOnHover) return;
        const selector = `[data-key="${item.id}"] .feature-card-inner`;

        gsap.to(selector, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    };

    return (
        <div ref={containerRef} className="list" style={{ height: containerHeight }}>
            {grid.map(item => (
                <div
                    key={item.id}
                    data-key={item.id}
                    className="item-wrapper"
                    onMouseEnter={e => handleMouseEnter(e, item)}
                    onMouseLeave={e => handleMouseLeave(e, item)}
                >
                    {/* Render the component passed in content */}
                    <div className="feature-card-inner" style={{ width: '100%', height: '100%' }}>
                        {item.content}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Masonry;
