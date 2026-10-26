"use client";

import { FormEvent, useState } from "react";
import { DraggableModal } from "@/components/DraggableModal";
import { Icon } from "@/components/Icon";
import { useWorkspace, type WorkspaceRole } from "@/lib/workspace-context";

export function WorkspaceDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    workspaces,
    activeWorkspace,
    setActiveWorkspaceId,
    createWorkspace,
    members,
    inviteMember,
    updateMemberRole,
    removeMember,
  } = useWorkspace();

  const [tab, setTab] = useState<"switch" | "create" | "members">("switch");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<WorkspaceRole>("editor");

  const currentMembers = activeWorkspace
    ? members.filter((m) => m.workspace_id === activeWorkspace.id)
    : [];

  async function handleCreateWorkspace(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    if (!name) return;
    const desc = String(data.get("description") || "").trim();
    await createWorkspace(name, desc);
    setTab("switch");
  }

  async function handleInvite(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    await inviteMember(inviteEmail, inviteRole);
    setInviteEmail("");
  }

  if (!isOpen) return null;

  return (
    <DraggableModal isOpen={isOpen} onClose={onClose} ariaLabel="Workspace Management">
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
              WORKSPACE MANAGEMENT
            </p>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {activeWorkspace ? activeWorkspace.name : "Your Workspaces"}
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

        {/* Tab switcher */}
        <div className="flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
          <button
            type="button"
            onClick={() => setTab("switch")}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
              tab === "switch"
                ? "bg-[#d3f36b] text-[#283618] shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            My Workspaces ({workspaces.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("members")}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
              tab === "members"
                ? "bg-[#d3f36b] text-[#283618] shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            Members ({currentMembers.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("create")}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
              tab === "create"
                ? "bg-[#d3f36b] text-[#283618] shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            + Create New
          </button>
        </div>

        {/* Switch tab */}
        {tab === "switch" && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-zinc-500">
              Select an authorized workspace:
            </span>
            <div className="flex max-h-56 flex-col gap-2 overflow-y-auto">
              {workspaces.map((ws) => {
                const isActive = activeWorkspace?.id === ws.id;
                return (
                  <div
                    key={ws.id}
                    onClick={() => {
                      setActiveWorkspaceId(ws.id);
                      onClose();
                    }}
                    className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition ${
                      isActive
                        ? "border-[#b8e85e] bg-[#f4ffe0] dark:border-[#496612] dark:bg-[#1a2208]"
                        : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/60"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          {ws.name}
                        </h4>
                        {isActive && (
                          <span className="rounded-full bg-[#d3f36b] px-2 py-0.5 text-[10px] font-bold text-[#283618]">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {ws.description || "Professional team workspace"}
                      </p>
                    </div>
                    <Icon name="chevron" size={16} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Members tab */}
        {tab === "members" && (
          <div className="flex flex-col gap-3">
            <form onSubmit={handleInvite} className="flex gap-2">
              <input
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
                className="h-10 flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-xs outline-none focus:border-[#85a900] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as WorkspaceRole)}
                className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-2 text-xs outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
              <button
                type="submit"
                className="h-10 rounded-xl bg-[#d3f36b] px-3.5 text-xs font-bold text-[#283618] hover:bg-[#c4e65d]"
              >
                Invite
              </button>
            </form>

            <span className="text-xs font-semibold text-zinc-500">
              Authorized collaborators in {activeWorkspace?.name}:
            </span>
            <div className="flex max-h-48 flex-col gap-2 overflow-y-auto">
              {currentMembers.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-200 p-3 text-xs dark:border-zinc-800"
                >
                  <div>
                    <b className="block text-zinc-900 dark:text-zinc-100">{m.name}</b>
                    <span className="text-zinc-400">{m.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {m.role === "owner" ? (
                      <span className="rounded bg-zinc-100 px-2 py-0.5 font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                        Owner
                      </span>
                    ) : (
                      <>
                        <select
                          value={m.role}
                          onChange={(e) => updateMemberRole(m.id, e.target.value as WorkspaceRole)}
                          className="rounded border border-zinc-200 bg-transparent px-1.5 py-0.5 text-xs dark:border-zinc-700"
                        >
                          <option value="editor">Editor</option>
                          <option value="viewer">Viewer</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => removeMember(m.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Revoke access"
                        >
                          Revoke
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create tab */}
        {tab === "create" && (
          <form onSubmit={handleCreateWorkspace} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Workspace name
              <input
                name="name"
                placeholder="e.g. Mobile Engineering Team"
                required
                maxLength={80}
                className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-xs outline-none focus:border-[#85a900] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Description (optional)
              <textarea
                name="description"
                placeholder="Brief purpose of this workspace"
                rows={2}
                className="rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs outline-none focus:border-[#85a900] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </label>
            <button
              type="submit"
              className="mt-2 h-11 rounded-xl bg-[#d3f36b] text-xs font-bold text-[#283618] hover:bg-[#c4e65d]"
            >
              Create workspace
            </button>
          </form>
        )}
      </div>
    </DraggableModal>
  );
}
