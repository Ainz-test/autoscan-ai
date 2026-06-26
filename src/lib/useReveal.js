import { useEffect, useRef, useState } from "react";

// Reveals an element on scroll into view, with an optional stagger delay.
export function useReveal(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const t = setTimeout(() => setVisible(true), delay);
          obs.disconnect();
          return () => clearTimeout(t);
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return [ref, visible];
}
