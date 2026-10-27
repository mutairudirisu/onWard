"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { BackButton } from "@/components/BackButton";
import { useWorkspace } from "@/lib/workspace-context";
import { WorkspaceFolderCard } from "@/components/WorkspaceFolderCard";
import { WorkspaceFileCard } from "@/components/WorkspaceFileCard";

export default function WorkspacePage() {
  const {
    workspaces,
    activeWorkspace,
    folders,
    projects,
    documents,
    openCreateDocument,
    setFolderModalOpen,
    setWorkspaceModalOpen,
    setEditingDocument,
    moveDocumentToFolder,
  } = useWorkspace();

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const currentWorkspace = activeWorkspace || workspaces[0];

  const filteredDocs = documents.filter((d) =>
    selectedFolderId ? d.folder_id === selectedFolderId : true
  );

  const selectedFolder = selectedFolderId
    ? folders.find((f) => f.id === selectedFolderId)
    : null;

  return (
    <div className="clean-screen">
      {/* Workspace Header */}
      <header className="clean-screen-header">
        <div className="flex items-start gap-2">
          <BackButton href="/" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                Workspace
              </span>
              <button
                type="button"
                onClick={() => setWorkspaceModalOpen(true)}
                className="flex items-center gap-1 rounded-full bg-[#edf6d5] px-2.5 py-0.5 text-[10px] font-bold text-[#3d4b24] hover:bg-[#e2f1be] dark:bg-[#20290e] dark:text-[#d3f36b]"
              >
                <span>Switch / Invite</span>
                <Icon name="chevron" size={10} />
              </button>
            </div>
            <h1 className="clean-screen-title">
              {currentWorkspace?.name || "OnWard Engineering"}
            </h1>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {currentWorkspace?.description ||
                "Collaborate on documents, organize by folders, and export to Word & PDF."}
            </p>
          </div>
        </div>

        <div className="clean-screen-actions">
          {/* Work Logs quick button in Workspace */}
          <Link
            href="/work-logs"
            className="flex h-10 items-center gap-1.5 rounded-xl border border-zinc-200 px-3.5 text-xs font-bold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            title="Team & Personal Work Logs"
          >
            <Icon name="bookOpen" size={15} />
            <span className="hidden sm:inline">Work Logs</span>
          </Link>

          <button
            type="button"
            onClick={openCreateDocument}
            className="flex h-10 items-center gap-1.5 rounded-xl bg-[#d3f36b] px-3.5 text-xs font-bold text-[#283618] shadow-sm transition hover:bg-[#c4e65d] active:scale-95"
          >
            <Icon name="fileText" size={15} />
            <span>New Document</span>
          </button>
        </div>
      </header>

      {/* Workspace Navigation Pills */}
      <div className="mb-6 flex items-center gap-1.5 overflow-x-auto py-1 text-xs font-bold no-scrollbar">
        <Link
          href="/workspace"
          className="whitespace-nowrap rounded-full bg-[#d3f36b] px-3.5 py-1.5 font-bold text-[#283618] shadow-sm transition"
        >
          📁 Docs & Folders
        </Link>
        <Link
          href="/work-logs"
          className="whitespace-nowrap rounded-full bg-zinc-100 px-3.5 py-1.5 text-zinc-600 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
        >
          ⏱️ Work Logs
        </Link>
      </div>

      {/* Active Folder Filter Banner */}
      {selectedFolder && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
          }}
          onDrop={async (e) => {
            e.preventDefault();
            const docId = e.dataTransfer.getData("application/onward-doc-id");
            if (docId) await moveDocumentToFolder(docId, null);
          }}
          className="mb-6 flex items-center justify-between rounded-2xl border-2 border-dashed border-[#85a900]/40 bg-[#edf6d5]/40 px-4 py-2.5 text-xs text-[#3d4b24] transition dark:border-[#d3f36b]/30 dark:bg-[#20290e]/40 dark:text-[#d3f36b]"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">📁</span>
            <span>
              Showing documents inside <b>&quot;{selectedFolder.name}&quot;</b> ({filteredDocs.length} items)
            </span>
            <span className="hidden sm:inline text-[11px] text-zinc-500 dark:text-zinc-400">
              · Drag files here to move them out of folder
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedFolderId(null)}
            className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-red-600 shadow-xs hover:bg-white dark:bg-zinc-900 dark:text-red-400"
          >
            Show All Documents
          </button>
        </div>
      )}

      {/* 1. WORKSPACE FOLDERS SECTION (Matching Screenshot) */}
      <section className="mb-9">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">
              WORKSPACE FOLDERS ({folders.length})
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Drag and drop files onto any folder to organize them
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFolderModalOpen(true)}
            className="group flex items-center gap-1.5 rounded-full border border-[#85a900]/25 bg-[#edf6d5] px-3.5 py-1.5 text-xs font-bold text-[#3d4b24] shadow-xs transition-all duration-150 hover:border-[#85a900]/50 hover:bg-[#e2f1bd] hover:shadow-sm active:scale-95 dark:border-[#d3f36b]/20 dark:bg-[#20290e] dark:text-[#d3f36b] dark:hover:bg-[#2a3713]"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#85a900] text-white transition-transform group-hover:scale-110 dark:bg-[#d3f36b] dark:text-[#20290e]">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </span>
            <span>New Folder</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4.5 lg:grid-cols-3">
          {folders.map((f, idx) => (
            <WorkspaceFolderCard
              key={f.id}
              folder={f}
              documents={documents}
              projects={projects}
              isSelected={selectedFolderId === f.id}
              onSelect={() => {
                setSelectedFolderId(selectedFolderId === f.id ? null : f.id);
              }}
              index={idx}
            />
          ))}
        </div>
      </section>

      {/* 2. CARD FILES & DOCUMENTS SECTION (Matching Screenshot) */}
      <section className="mb-9">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">
              CARD FILES & DOCUMENTS ({filteredDocs.length})
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Drag files to folders above · Click to edit or manage team access
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateDocument}
            className="group flex items-center gap-1.5 rounded-full border border-[#85a900]/25 bg-[#edf6d5] px-3.5 py-1.5 text-xs font-bold text-[#3d4b24] shadow-xs transition-all duration-150 hover:border-[#85a900]/50 hover:bg-[#e2f1bd] hover:shadow-sm active:scale-95 dark:border-[#d3f36b]/20 dark:bg-[#20290e] dark:text-[#d3f36b] dark:hover:bg-[#2a3713]"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#85a900] text-white transition-transform group-hover:scale-110 dark:bg-[#d3f36b] dark:text-[#20290e]">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </span>
            <span>New Document</span>
          </button>
        </div>

        {filteredDocs.length ? (
          <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocs.map((doc) => (
              <WorkspaceFileCard
                key={doc.id}
                doc={doc}
                folders={folders}
                onOpen={() => setEditingDocument(doc)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-200 p-8 text-center text-xs text-zinc-400 dark:border-zinc-800">
            No documents in this view. Click &quot;+ New Document&quot; or drag files into a folder above.
          </div>
        )}
      </section>
    </div>
  );
}
