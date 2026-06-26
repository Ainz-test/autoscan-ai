import { useReveal } from "../lib/useReveal";

// Wraps children in a scroll-triggered fade/slide reveal.
export function Reveal({ delay = 0, className = "", style, children, as: Tag = "div" }) {
  const [ref, visible] = useReveal(delay);
  return (
    <Tag ref={ref} className={`reveal${visible ? " in" : ""} ${className}`} style={style}>
      {children}
    </Tag>
  );
}
