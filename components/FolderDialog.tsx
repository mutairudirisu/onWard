"use client";

import { FormEvent } from "react";
import { DraggableModal } from "@/components/DraggableModal";
import { useWorkspace } from "@/lib/workspace-context";

export function FolderDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { createFolder, activeWorkspace } = useWorkspace();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    if (!name) return;
    await createFolder(name);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <DraggableModal isOpen={isOpen} onClose={onClose} ariaLabel="Create Folder">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
              {activeWorkspace?.name || "WORKSPACE"} / NEW FOLDER
            </p>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Create folder
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-lg font-bold text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          >
            ×
          </button>
        </div>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          Folder name
          <input
            name="name"
            placeholder="e.g. Q4 Sprint Deliverables"
            autoFocus
            required
            maxLength={60}
            className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
          />
        </label>

        <div className="mt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-xl border border-zinc-200 px-4 text-xs font-bold text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-11 flex-1 rounded-xl bg-[#d3f36b] text-sm font-bold text-[#283618] shadow-md shadow-[#718d3725] transition hover:bg-[#c4e65d] active:scale-[0.98]"
          >
            Create folder
          </button>
        </div>
      </form>
    </DraggableModal>
  );
}
