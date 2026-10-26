"use client";

import React, { useEffect, useRef, useState } from "react";

export function DraggableModal({
  isOpen,
  onClose,
  children,
  className = "",
  ariaLabel = "Dialog",
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    startYRef.current = e.clientY;
    currentYRef.current = e.clientY;
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    currentYRef.current = e.clientY;
    const delta = e.clientY - startYRef.current;
    if (delta > 0) {
      setTranslateY(delta);
    } else {
      setTranslateY(delta * 0.15);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    const delta = currentYRef.current - startYRef.current;
    if (delta > 75) {
      onClose();
      setTranslateY(0);
    } else {
      setTranslateY(0);
    }
  };

  return (
    <div
      className="draggable-modal-backdrop fixed inset-0 z-50 flex items-end justify-center p-0 md:items-center md:p-6 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`draggable-modal-sheet relative w-full max-w-lg rounded-t-[28px] rounded-b-none border border-b-0 md:rounded-[24px] md:border-b border-zinc-200 bg-white px-6 pb-8 pt-3 md:pt-6 shadow-2xl transition-transform dark:border-zinc-800 dark:bg-zinc-900 ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        style={{
          transform: translateY !== 0 ? `translateY(${translateY}px)` : undefined,
          transition: isDragging ? "none" : "transform 0.26s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Top Drag Handle for Drag-to-Dropdown gesture on mobile */}
        <div
          className="flex h-7 w-full cursor-grab items-center justify-center touch-none select-none active:cursor-grabbing md:hidden"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          role="button"
          tabIndex={0}
          aria-label="Drag down to close"
        >
          <div className="h-1.5 w-11 rounded-full bg-zinc-300 transition-colors hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600" />
        </div>

        {children}
      </div>
    </div>
  );
}
