"use client";

import { FormEvent, useState } from "react";
import { DraggableModal } from "@/components/DraggableModal";
import { useWorkspace, type WorkspaceDocument } from "@/lib/workspace-context";

export function DocumentShareDialog({
  document,
  close,
}: {
  document: WorkspaceDocument;
  close: () => void;
}) {
  const { shares, shareDocument, revokeShare, updateSharePermission, members, activeWorkspace } =
    useWorkspace();

  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<"viewer" | "editor">("viewer");

  const documentShares = shares.filter((s) => s.document_id === document.id);

  async function handleGrant(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    await shareDocument(document.id, email.trim(), permission);
    setEmail("");
  }

  // Suggest workspace members who don't have access yet
  const availableMembers = activeWorkspace
    ? members.filter(
        (m) =>
          m.workspace_id === activeWorkspace.id &&
          !documentShares.some((s) => s.email.toLowerCase() === m.email.toLowerCase())
      )
    : [];

  return (
    <DraggableModal isOpen={true} onClose={close} ariaLabel="Share Document">
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
              DOCUMENT SHARING & PERMISSIONS
            </p>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {document.title || "Untitled Document"}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-lg font-bold text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          >
            ×
          </button>
        </div>

        {/* Ownership & Private status info */}
        <div className="flex items-center justify-between rounded-2xl bg-zinc-50 p-3.5 text-xs dark:bg-zinc-800/60">
          <div>
            <b className="block font-bold text-zinc-800 dark:text-zinc-200">
              Owner: {document.owner_name}
            </b>
            <span className="text-zinc-400">
              {document.is_shared
                ? `Shared with ${documentShares.length} collaborator${documentShares.length === 1 ? "" : "s"}`
                : "Private (only accessible by you and workspace owner)"}
            </span>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
              document.is_shared
                ? "bg-[#edf6d5] text-[#3d4b24] dark:bg-[#20290e] dark:text-[#d3f36b]"
                : "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"
            }`}
          >
            {document.is_shared ? "Shared" : "Private"}
          </span>
        </div>

        {/* Grant access form */}
        <form onSubmit={handleGrant} className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            Grant access to user or email:
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="collaborator@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10 flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-xs outline-none focus:border-[#85a900] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value as "viewer" | "editor")}
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-2.5 text-xs outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="viewer">Viewer (Read only)</option>
              <option value="editor">Editor (Can edit)</option>
            </select>
            <button
              type="submit"
              className="h-10 rounded-xl bg-[#d3f36b] px-4 text-xs font-bold text-[#283618] transition hover:bg-[#c4e65d]"
            >
              Share
            </button>
          </div>
        </form>

        {/* Quick add from workspace members */}
        {availableMembers.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-zinc-400">Quick add:</span>
            {availableMembers.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setEmail(m.email)}
                className="rounded-lg bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
              >
                + {m.email}
              </button>
            ))}
          </div>
        )}

        {/* Active shares list with revocation controls */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-zinc-500">
            Collaborators with granted access:
          </span>

          {documentShares.length ? (
            <div className="flex max-h-48 flex-col gap-2 overflow-y-auto">
              {documentShares.map((share) => (
                <div
                  key={share.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-200 p-3 text-xs dark:border-zinc-800"
                >
                  <div>
                    <b className="block text-zinc-900 dark:text-zinc-100">{share.email}</b>
                    <span className="text-[11px] text-zinc-400">
                      Granted {share.granted_at}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={share.permission}
                      onChange={(e) =>
                        updateSharePermission(share.id, e.target.value as "viewer" | "editor")
                      }
                      className="rounded-lg border border-zinc-200 bg-transparent px-2 py-1 text-xs font-medium dark:border-zinc-700"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => revokeShare(share.id)}
                      className="rounded-lg px-2 py-1 font-bold text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40"
                      title="Revoke access immediately"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-200 p-4 text-center text-xs text-zinc-400 dark:border-zinc-800">
              No individual shares yet. This document is private to you and the workspace owner.
            </div>
          )}
        </div>

        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={close}
            className="h-10 rounded-xl bg-zinc-100 px-5 text-xs font-bold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200"
          >
            Done
          </button>
        </div>
      </div>
    </DraggableModal>
  );
}
