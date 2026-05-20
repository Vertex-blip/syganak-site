import React, { useRef, useState, useEffect } from 'react';

const GalleryCarousel = ({ items = [] }) => {
  const scrollerRef = useRef(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      setCanScrollPrev(el.scrollLeft > 10);
      setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [items]);

  const scroll = (dir = 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const offset = Math.round(el.clientWidth * 0.8) * dir;
    el.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          ref={scrollerRef}
          className="no-scrollbar flex gap-4 overflow-x-auto px-1 py-2 scroll-smooth touch-pan-x snap-x snap-mandatory"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {items.map((item) => (
            <div key={item.id} className="snap-center min-w-[220px] sm:min-w-[300px] md:min-w-[360px] lg:min-w-[420px] relative overflow-hidden rounded-2xl bg-slate-50 shadow-md">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent-gold">{item.category}</p>
                <h3 className="mt-2 text-lg font-serif font-bold text-primary-dark">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => scroll(-1)}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg transition-opacity ${canScrollPrev ? 'opacity-100' : 'opacity-40'}`}
        aria-label="Prev"
      >
        ‹
      </button>

      <button
        type="button"
        onClick={() => scroll(1)}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg transition-opacity ${canScrollNext ? 'opacity-100' : 'opacity-40'}`}
        aria-label="Next"
      >
        ›
      </button>
    </div>
  );
};

export default GalleryCarousel;
