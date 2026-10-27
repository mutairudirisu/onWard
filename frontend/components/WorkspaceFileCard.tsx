"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import {
  type WorkspaceDocument,
  type WorkspaceFolder,
  MEMBER_PROFILES,
  useWorkspace,
} from "@/lib/workspace-context";

export function WorkspaceFileCard({
  doc,
  folders,
  onOpen,
}: {
  doc: WorkspaceDocument;
  folders: WorkspaceFolder[];
  onOpen: () => void;
}) {
  const { shares, setSharingDocument } = useWorkspace();
  const [isDragging, setIsDragging] = useState(false);

  // Find invited team members for this specific document
  const docShares = shares.filter((s) => s.document_id === doc.id);
  const invitedMembers = docShares.map((s) => {
    const profile = MEMBER_PROFILES[s.email] || {
      name: s.email.split("@")[0],
      email: s.email,
      avatar: "👤",
      role: s.permission === "editor" ? "Editor" : "Viewer",
      bg: "#f4f4f5",
      color: "#27272a",
    };
    return { ...profile, permission: s.permission };
  });

  const folder = doc.folder_id ? folders.find((f) => f.id === doc.folder_id) : null;
  const priority = doc.priority || "high";
  const tags = doc.tags && doc.tags.length > 0 ? doc.tags : ["Research", "Product", "Content"];
  const fileCount = doc.file_count ?? 2;
  const commentsCount = doc.comments_count ?? 3;

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData("application/onward-doc-id", doc.id);
    e.dataTransfer.setData("text/plain", doc.title);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <article
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onOpen}
      className={`group relative flex cursor-grab flex-col justify-between rounded-[22px] border border-zinc-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg active:cursor-grabbing dark:border-zinc-800 dark:bg-zinc-900 ${
        isDragging ? "opacity-50 scale-95 ring-2 ring-[#85a900]" : ""
      }`}
    >
      <div>
        {/* Top Header: Priority Badge & Meta Info (Matching Image 2) */}
        <div className="flex items-center justify-between gap-2">
          {/* Priority Pill */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
              priority === "high"
                ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                : priority === "medium"
                ? "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
            }`}
          >
            <span>🚩</span>
            <span className="capitalize">{priority}</span>
          </span>

          {/* Date & Files Count */}
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <span>{doc.updated_at}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <span>📎</span>
              <span>{fileCount} files</span>
            </span>
            {folder && (
              <span className="hidden sm:inline rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                📁 {folder.name}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-3 font-sans text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#6a8700] dark:group-hover:text-[#d3f36b] transition-colors">
          {doc.title}
        </h3>

        {/* Tags / Category Chips (Matching Image 2) */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Dotted Divider Line (Matching Image 2) */}
      <div className="my-3.5 border-t border-dashed border-zinc-200 dark:border-zinc-800" />

      {/* Bottom Row: Team Invited Avatars & Card Actions (Matching Image 2) */}
      <div className="flex items-center justify-between">
        {/* Team Invited Avatars Stack */}
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center -space-x-2">
            {invitedMembers.length > 0 ? (
              invitedMembers.map((m, idx) => (
                <div
                  key={m.email}
                  className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-xs font-bold shadow-xs transition-transform hover:z-30 hover:scale-115 dark:border-zinc-900"
                  style={{
                    backgroundColor: m.bg,
                    color: m.color,
                    zIndex: 10 - idx,
                  }}
                  title={`${m.name} (${m.permission || m.role})`}
                >
                  {m.avatar ? (
                    <span className="text-xs leading-none">{m.avatar}</span>
                  ) : (
                    <span>{m.name.slice(0, 1).toUpperCase()}</span>
                  )}
                </div>
              ))
            ) : (
              <span className="text-[11px] font-medium text-zinc-400">Private</span>
            )}

            {/* Quick Invite Button */}
            <button
              type="button"
              onClick={() => setSharingDocument(doc)}
              className="relative z-0 flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-zinc-300 bg-zinc-50 text-xs font-bold text-zinc-500 transition hover:border-[#85a900] hover:bg-[#edf6d5] hover:text-[#3d4b24] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-[#c4f843] dark:hover:text-[#d3f36b]"
              title="Invite team members to this file"
            >
              +
            </button>
          </div>

          {invitedMembers.length > 0 && (
            <span className="text-[11px] font-medium text-zinc-400">
              {invitedMembers.length} invited
            </span>
          )}
        </div>

        {/* Right Actions: Expand / Details (Matching Image 2) & Comments */}
        <div className="flex items-center gap-2.5 text-zinc-400">
          {/* Comments Count */}
          <div className="flex items-center gap-1 text-xs font-semibold">
            <Icon name="message" size={14} />
            <span>{commentsCount}</span>
          </div>

          {/* Diagonal Expand Button from Image 2 */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            title="Open and edit file"
          >
            <Icon name="maximize" size={15} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </article>
  );
}
