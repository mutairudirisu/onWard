"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/Icon";

export function BackButton({
  href = "/",
  label,
  className = "",
}: {
  href?: string;
  label?: string;
  className?: string;
}) {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    // If the window has history, navigate back smoothly
    if (typeof window !== "undefined" && window.history.length > 1) {
      e.preventDefault();
      router.back();
    }
  };

  return (
    <Link
      href={href}
      onClick={handleBack}
      className={`subpage-back-btn inline-flex items-center gap-1.5 rounded-xl text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 active:scale-95 ${
        label ? "px-2.5 py-1.5 text-xs font-bold" : "h-9 w-9 justify-center -ml-1.5"
      } ${className}`}
      aria-label={label || "Go back"}
      title={label || "Go back"}
    >
      <Icon name="chevronLeft" size={20} />
      {label && <span>{label}</span>}
    </Link>
  );
}
