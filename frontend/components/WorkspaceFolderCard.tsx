"use client";

import { useState } from "react";
import { type WorkspaceFolder, type WorkspaceDocument, type WorkspaceProject, useWorkspace } from "@/lib/workspace-context";

// Curated artistic fluid marble palettes matching Image 1
const MARBLE_THEMES = [
  {
    id: "azure-flame",
    // Top-left folder from user's image: oceanic blue, coral crimson, cream fluid swirls
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #2b5876 25%, #e06d53 60%, #f4e8da 85%, #d9534f 100%)",
    glow: "rgba(224, 109, 83, 0.25)",
  },
  {
    id: "amber-ember",
    // Top-right folder from user's image: fiery ember, magma & obsidian fluid
    gradient: "linear-gradient(135deg, #2b1103 0%, #7c2d12 30%, #ea580c 65%, #fde047 88%, #c2410c 100%)",
    glow: "rgba(234, 88, 12, 0.25)",
  },
  {
    id: "obsidian-crimson",
    // Bottom-left dark mode folder from user's image: molten red magma on deep obsidian
    gradient: "linear-gradient(135deg, #180504 0%, #450a0a 35%, #b91c1c 70%, #f87171 90%, #7f1d1d 100%)",
    glow: "rgba(185, 28, 28, 0.3)",
  },
  {
    id: "emerald-nebula",
    // OnWard lime & deep jade fluid
    gradient: "linear-gradient(135deg, #092611 0%, #166534 30%, #84cc16 65%, #bef264 90%, #4d7c0f 100%)",
    glow: "rgba(132, 204, 22, 0.25)",
  },
  {
    id: "cosmic-violet",
    // Purple & neon magenta fluid
    gradient: "linear-gradient(135deg, #1f0b38 0%, #581c87 35%, #c026d3 70%, #f472b6 90%, #7e22ce 100%)",
    glow: "rgba(192, 38, 211, 0.25)",
  },
];

export function WorkspaceFolderCard({
  folder,
  documents,
  projects,
  isSelected,
  onSelect,
  index = 0,
}: {
  folder: WorkspaceFolder;
  documents: WorkspaceDocument[];
  projects: WorkspaceProject[];
  isSelected: boolean;
  onSelect: () => void;
  index?: number;
}) {
  const { moveDocumentToFolder, saveDocument, openCreateDocument } = useWorkspace();
  const [isDragOver, setIsDragOver] = useState(false);

  const folderDocs = documents.filter((d) => d.folder_id === folder.id);
  const folderProjects = projects.filter((p) => p.folder_id === folder.id);
  const totalItems = folderDocs.length + folderProjects.length;

  const theme = MARBLE_THEMES[index % MARBLE_THEMES.length];

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only turn off if leaving card entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    // 1. Internal Document Move
    const internalDocId = e.dataTransfer.getData("application/onward-doc-id");
    if (internalDocId) {
      await moveDocumentToFolder(internalDocId, folder.id);
      return;
    }

    // 2. Real OS Files Dragged In
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const file = e.dataTransfer.files[i];
        let content = `# ${file.name}\n\nImported file (${(file.size / 1024).toFixed(1)} KB)`;
        try {
          if (file.type.startsWith("text/") || file.name.endsWith(".md") || file.name.endsWith(".txt")) {
            content = await file.text();
          }
        } catch {
          // Keep default content
        }

        await saveDocument({
          title: file.name.replace(/\.[^/.]+$/, ""),
          content,
          folder_id: folder.id,
          project_id: null,
          priority: "medium",
          tags: ["Imported", "Attachment"],
          file_count: 1,
          comments_count: 0,
        });
      }
    }
  };

  // Preview card titles
  const topCardTitle = folderDocs[0]?.title || (folderProjects[0]?.title) || "Curriculum";
  const secondCardTitle = folderDocs[1]?.title || "Resume";

  return (
    <div
      onClick={onSelect}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group relative flex h-[162px] sm:h-[190px] w-full cursor-pointer flex-col justify-end transition-all duration-300 select-none ${
        isDragOver
          ? "scale-[1.04] ring-4 ring-[#85a900] ring-offset-4 ring-offset-zinc-50 dark:ring-offset-zinc-950"
          : isSelected
          ? "scale-[1.02] ring-2 ring-[#85a900]"
          : "hover:-translate-y-1"
      }`}
    >
      {/* 1. BACK FOLDER PLATE WITH ASYMMETRIC TAB & FLUID MARBLE ARTWORK */}
      <div
        className="absolute inset-0 overflow-hidden rounded-[22px] sm:rounded-[26px] shadow-md transition-all duration-300 group-hover:shadow-xl"
        style={{
          background: theme.gradient,
        }}
      >
        {/* Organic Marble Texture Overlay */}
        <div
          className="absolute inset-0 opacity-45 mix-blend-overlay"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.8) 0%, transparent 40%),
                              radial-gradient(circle at 80% 20%, rgba(0,0,0,0.6) 0%, transparent 45%),
                              radial-gradient(circle at 50% 80%, rgba(255,255,255,0.4) 0%, transparent 50%)`,
          }}
        />

        {/* Top-Right Tab Step Cutout (Classic Folder Profile from Image 1) */}
        <div
          className="absolute top-0 right-0 h-8 sm:h-9 w-[56%] rounded-bl-[14px] sm:rounded-bl-[16px] bg-white/20 backdrop-blur-[1px] dark:bg-black/25"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.25)",
            borderLeft: "1px solid rgba(255,255,255,0.25)",
          }}
        />

        {/* Tab Accent Pill */}
        <div className="absolute top-2 right-2.5 sm:top-2.5 sm:right-3.5 flex items-center gap-1 rounded-full bg-black/35 px-1.5 py-0.5 sm:px-2 sm:py-0.5 text-[8px] sm:text-[9px] font-bold text-white backdrop-blur-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-[#d3f36b]" />
          <span>{totalItems} files</span>
        </div>
      </div>

      {/* 2. PEEKING DOCUMENT CARDS (Animated 3D Stack from Image 1) */}
      <div className="pointer-events-none absolute inset-x-2.5 sm:inset-x-4 top-2 sm:top-2.5 z-10 flex justify-center">
        {/* Back Card (Tilted Left) */}
        <div
          className={`absolute h-20 sm:h-24 w-[76%] rounded-t-lg sm:rounded-t-xl bg-white/70 p-2 sm:p-2.5 shadow-xs backdrop-blur-xs transition-all duration-300 dark:bg-zinc-800/70 ${
            isDragOver
              ? "-translate-y-8 sm:-translate-y-9 -rotate-8 opacity-100"
              : "translate-y-0 -rotate-4 group-hover:-translate-y-5 sm:group-hover:-translate-y-6 group-hover:-rotate-7 opacity-85"
          }`}
          style={{ border: "1px solid rgba(255,255,255,0.5)" }}
        >
          <div className="h-1 sm:h-1.5 w-1/3 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        </div>

        {/* Middle Card (Slightly Offset) */}
        <div
          className={`absolute h-20 sm:h-24 w-[82%] rounded-t-lg sm:rounded-t-xl bg-white/85 p-2 sm:p-2.5 shadow-xs backdrop-blur-xs transition-all duration-300 dark:bg-zinc-800/85 ${
            isDragOver
              ? "-translate-y-7 sm:-translate-y-8 rotate-1 opacity-100"
              : "translate-y-1 sm:translate-y-1.5 rotate-2 group-hover:-translate-y-4 sm:group-hover:-translate-y-5 group-hover:rotate-2 opacity-95"
          }`}
          style={{ border: "1px solid rgba(255,255,255,0.6)" }}
        >
          <div className="flex items-center justify-between">
            <span className="truncate text-[8px] sm:text-[9px] font-bold text-zinc-500 dark:text-zinc-400">
              {secondCardTitle}
            </span>
          </div>
        </div>

        {/* Front Peeking Card (Showing Title & Mini Content Lines) */}
        <div
          className={`relative h-20 sm:h-24 w-[88%] rounded-t-lg sm:rounded-t-xl bg-white p-2 sm:p-2.5 shadow-sm transition-all duration-300 dark:bg-zinc-900 ${
            isDragOver
              ? "-translate-y-6 sm:-translate-y-7 rotate-4"
              : "translate-y-2.5 sm:translate-y-3.5 rotate-3 group-hover:-translate-y-3 sm:group-hover:-translate-y-4 group-hover:rotate-4"
          }`}
          style={{
            border: "1px solid rgba(255,255,255,0.85)",
            boxShadow: "0 -3px 14px rgba(0,0,0,0.07)",
          }}
        >
          <div className="flex items-center justify-between border-b border-zinc-100 pb-0.5 sm:pb-1 dark:border-zinc-800">
            <span className="truncate text-[9px] sm:text-[10px] font-bold text-zinc-800 dark:text-zinc-200">
              {topCardTitle}
            </span>
            <span className="text-[7px] sm:text-[8px] font-semibold text-zinc-400">DOC</span>
          </div>
          {/* Simulated Document Lines */}
          <div className="mt-1 space-y-0.5 sm:space-y-1">
            <div className="h-0.5 sm:h-1 w-full rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-0.5 sm:h-1 w-4/5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-0.5 sm:h-1 w-3/5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          </div>
        </div>
      </div>

      {/* 3. FRONT FROSTED GLASS POCKET (Translucent Frosted Pocket from Image 1) */}
      <div
        className="relative z-20 flex h-[96px] sm:h-[116px] w-full items-end justify-between rounded-[18px] sm:rounded-[22px] p-3 sm:p-4.5 transition-all duration-200"
        style={{
          background: "linear-gradient(145deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.68) 100%)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255, 255, 255, 0.8)",
          boxShadow: isDragOver
            ? "0 14px 34px rgba(133, 169, 0, 0.35)"
            : "0 8px 24px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Dark Mode Fallback Gradient Layer */}
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-[18px] sm:rounded-[22px] bg-white/70 dark:bg-zinc-900/85" />

        {/* Folder Details */}
        <div className="min-w-0 flex-1 pr-2 sm:pr-3">
          <h3 className="truncate font-sans text-xs sm:text-base font-bold sm:font-extrabold tracking-tight text-zinc-900 dark:text-white">
            {folder.name}
          </h3>
          <p className="mt-0.5 text-[10px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 truncate">
            {isDragOver ? (
              <span className="font-bold text-[#6a8700] dark:text-[#d3f36b]">Drop file</span>
            ) : totalItems === 0 ? (
              "Empty folder"
            ) : (
              `${totalItems} item${totalItems === 1 ? "" : "s"}`
            )}
          </p>
        </div>

        {/* Action Button: Black Pill with crisp pure WHITE '+' icon */}
        <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={openCreateDocument}
            aria-label={`Add document to ${folder.name}`}
            className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-[9px] sm:rounded-[12px] bg-[#111315] text-white shadow-md transition-all duration-150 hover:scale-105 active:scale-95"
            style={{ backgroundColor: "#111315", color: "#ffffff" }}
            title="Create new file in this folder"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ stroke: "#ffffff", color: "#ffffff", display: "block" }}
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" stroke="#ffffff" strokeWidth="2.8" />
              <line x1="5" y1="12" x2="19" y2="12" stroke="#ffffff" strokeWidth="2.8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
