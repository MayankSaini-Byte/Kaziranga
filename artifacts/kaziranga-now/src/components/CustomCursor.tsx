import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    let mx = -100, my = -100;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${mx}px, ${my}px)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${mx}px, ${my}px)`;
      }
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const onHoverIn = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest("[data-testid]")
      ) {
        setHovering(true);
      }
    };
    const onHoverOut = () => setHovering(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onHoverIn);
    document.addEventListener("mouseout", onHoverOut);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onHoverIn);
      document.removeEventListener("mouseout", onHoverOut);
    };
  }, []);

  return (
    <>
      {/* Main cursor dot — rhino-green */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none select-none"
        style={{ willChange: "transform" }}
        aria-hidden="true"
      >
        <div
          style={{
            width: clicking ? 10 : hovering ? 8 : 12,
            height: clicking ? 10 : hovering ? 8 : 12,
            borderRadius: "50%",
            background: clicking ? "#4a9a3a" : "#1e5631",
            transform: "translate(-50%, -50%)",
            transition: "width 0.15s, height 0.15s, background 0.15s",
            boxShadow: "0 0 8px rgba(30,86,49,0.4)",
          }}
        />
      </div>

      {/* Trailing ring */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none select-none"
        style={{ willChange: "transform", transition: "transform 0.12s cubic-bezier(0.22,1,0.36,1)" }}
        aria-hidden="true"
      >
        <div
          style={{
            width: hovering ? 48 : 36,
            height: hovering ? 48 : 36,
            borderRadius: "50%",
            border: `2px solid ${clicking ? "rgba(74,154,58,0.5)" : "rgba(30,86,49,0.25)"}`,
            transform: "translate(-50%, -50%)",
            transition: "width 0.25s cubic-bezier(0.22,1,0.36,1), height 0.25s cubic-bezier(0.22,1,0.36,1), border-color 0.15s",
            background: hovering ? "rgba(30,86,49,0.06)" : "transparent",
          }}
        />
      </div>
    </>
  );
}
