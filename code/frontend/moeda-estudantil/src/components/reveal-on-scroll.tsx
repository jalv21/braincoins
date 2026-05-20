import { useEffect, useRef, useState, type ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

interface RevealOnScrollProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  once?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
}

const directionToTranslate: Record<Direction, string> = {
  up: "translate3d(0, 24px, 0)",
  down: "translate3d(0, -24px, 0)",
  left: "translate3d(24px, 0, 0)",
  right: "translate3d(-24px, 0, 0)",
  none: "translate3d(0, 0, 0)",
};

export function RevealOnScroll({
  children,
  direction = "up",
  delay = 0,
  threshold = 0.1,
  rootMargin = "0px 0px -60px 0px",
  className = "",
  once = true,
  as: Tag = "div",
}: RevealOnScrollProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  const style: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? "translate3d(0, 0, 0)" : directionToTranslate[direction],
    transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
    willChange: "opacity, transform",
  };

  const TagComponent = Tag as React.ElementType;
  return (
    <TagComponent ref={ref as React.Ref<HTMLElement>} className={className} style={style}>
      {children}
    </TagComponent>
  );
}

interface StaggerProps {
  children: ReactNode;
  delay?: number;
  step?: number;
  className?: string;
}

export function Stagger({ children, delay = 0, step = 80, className = "" }: StaggerProps) {
  const items = Array.isArray(children) ? children : [children];
  return (
    <>
      {items.map((child, i) => (
        <RevealOnScroll key={i} delay={delay + i * step} className={className}>
          {child}
        </RevealOnScroll>
      ))}
    </>
  );
}
