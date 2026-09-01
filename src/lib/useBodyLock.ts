import { useEffect } from "react";

/**
 * Lock background scrolling while `locked` is true.
 * Uses the position:fixed technique so it also works in iOS Safari,
 * and restores the previous scroll position on unlock.
 */
export function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const scrollY = window.scrollY;
    const b = document.body.style;
    const prev = {
      position: b.position,
      top: b.top,
      left: b.left,
      right: b.right,
      width: b.width,
      overflow: b.overflow,
    };
    b.position = "fixed";
    b.top = `-${scrollY}px`;
    b.left = "0";
    b.right = "0";
    b.width = "100%";
    b.overflow = "hidden";
    return () => {
      Object.assign(b, prev);
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}
