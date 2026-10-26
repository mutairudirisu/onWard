"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { BackButton } from "@/components/BackButton";
import { useWorkspace } from "@/lib/workspace-context";

export default function WorkspacePage() {
  const {
    workspaces,
    activeWorkspace,
    folders,
    projects,
    documents,
    reports,
    openCreateDocument,
    openCreateReport,
    openCreateProject,
    setFolderModalOpen,
    setWorkspaceModalOpen,
    setEditingDocument,
    setEditingReport,
    setExportingReport,
    setSharingDocument,
    setEditingProject,
  } = useWorkspace();

  const [activeTab, setActiveTab] = useState<"all" | "documents" | "reports" | "projects" | "folders">("all");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const currentWorkspace = activeWorkspace || workspaces[0];

  const filteredDocs = documents.filter((d) =>
    selectedFolderId ? d.folder_id === selectedFolderId : true
  );

  const filteredReports = reports.filter((r) =>
    currentWorkspace ? r.workspace_id === currentWorkspace.id : true
  );

  const filteredProjects = projects.filter((p) =>
    selectedFolderId ? p.folder_id === selectedFolderId : true
  );

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
              {currentWorkspace?.name || "Professional Hub"}
            </h1>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {currentWorkspace?.description || "Organize work, create reports, collaborate, and share documents."}
            </p>
          </div>
        </div>

        <div className="clean-screen-actions">
          <button
            type="button"
            onClick={openCreateDocument}
            className="flex h-10 items-center gap-1.5 rounded-xl border border-zinc-200 px-3 text-xs font-bold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <Icon name="fileText" size={15} />
            <span className="hidden sm:inline">New Doc</span>
          </button>
          <button
            type="button"
            onClick={() => openCreateReport("weekly")}
            className="flex h-10 items-center gap-1.5 rounded-xl bg-[#d3f36b] px-3.5 text-xs font-bold text-[#283618] shadow-sm transition hover:bg-[#c4e65d] active:scale-95"
          >
            <Icon name="chart" size={15} />
            <span>Create Report</span>
          </button>
        </div>
      </header>

      {/* Navigation Filter Tabs */}
      <div className="mb-6 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
        <button
          type="button"
          onClick={() => {
            setActiveTab("all");
            setSelectedFolderId(null);
          }}
          className={`whitespace-nowrap rounded-full px-3.5 py-1.5 transition ${
            activeTab === "all"
              ? "bg-[#d3f36b] text-[#283618] shadow-sm"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          All Activity
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("documents")}
          className={`whitespace-nowrap rounded-full px-3.5 py-1.5 transition ${
            activeTab === "documents"
              ? "bg-[#d3f36b] text-[#283618] shadow-sm"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          Documents ({documents.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("reports")}
          className={`whitespace-nowrap rounded-full px-3.5 py-1.5 transition ${
            activeTab === "reports"
              ? "bg-[#d3f36b] text-[#283618] shadow-sm"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          Reports ({reports.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("projects")}
          className={`whitespace-nowrap rounded-full px-3.5 py-1.5 transition ${
            activeTab === "projects"
              ? "bg-[#d3f36b] text-[#283618] shadow-sm"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          Projects ({projects.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("folders")}
          className={`whitespace-nowrap rounded-full px-3.5 py-1.5 transition ${
            activeTab === "folders"
              ? "bg-[#d3f36b] text-[#283618] shadow-sm"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          Folders ({folders.length})
        </button>
      </div>

      {/* Active Folder Filter Chip */}
      {selectedFolderId && (
        <div className="mb-4 flex items-center justify-between rounded-xl bg-zinc-100 px-3.5 py-2 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          <div className="flex items-center gap-2">
            <Icon name="folder" size={14} />
            <span>
              Filtered by folder:{" "}
              <b>{folders.find((f) => f.id === selectedFolderId)?.name || "Selected folder"}</b>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedFolderId(null)}
            className="text-[11px] font-bold text-red-500 hover:underline"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Main Content Areas */}

      {/* 1. Documents List */}
      {(activeTab === "all" || activeTab === "documents") && (
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">
              Recent Documents ({filteredDocs.length})
            </h2>
            <button
              type="button"
              onClick={openCreateDocument}
              className="text-xs font-bold text-[#85a900] hover:underline"
            >
              + New Document
            </button>
          </div>

          {filteredDocs.length ? (
            <div className="flex flex-col gap-2.5">
              {filteredDocs.map((doc) => (
                <article
                  key={doc.id}
                  onClick={() => setEditingDocument(doc)}
                  className="group flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
                      <Icon name="fileText" size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {doc.title}
                      </h3>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-400">
                        <span>Updated {doc.updated_at}</span>
                        <span>· Owner: {doc.owner_name}</span>
                        {doc.folder_id && (
                          <span>
                            · 📁 {folders.find((f) => f.id === doc.folder_id)?.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setSharingDocument(doc)}
                      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                        doc.is_shared
                          ? "bg-[#edf6d5] text-[#3d4b24] hover:bg-[#e2f1be] dark:bg-[#20290e] dark:text-[#d3f36b]"
                          : "border border-zinc-200 text-zinc-500 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400"
                      }`}
                      title="Manage permissions & sharing"
                    >
                      <Icon name="share" size={12} />
                      <span>{doc.is_shared ? "Shared" : "Private"}</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-200 p-8 text-center text-xs text-zinc-400 dark:border-zinc-800">
              No documents created in this workspace yet. Click &quot;New Doc&quot; to draft professional documents and share with editors or viewers.
            </div>
          )}
        </section>
      )}

      {/* 2. Professional Reports */}
      {(activeTab === "all" || activeTab === "reports") && (
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">
              Reports & Briefs ({filteredReports.length})
            </h2>
            <button
              type="button"
              onClick={() => openCreateReport("weekly")}
              className="text-xs font-bold text-[#85a900] hover:underline"
            >
              + Create Report
            </button>
          </div>

          {filteredReports.length ? (
            <div className="flex flex-col gap-2.5">
              {filteredReports.map((rep) => (
                <article
                  key={rep.id}
                  onClick={() => setEditingReport(rep)}
                  className="group flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf6d5] text-[#3d4b24] dark:bg-[#20290e] dark:text-[#d3f36b]">
                      <Icon name="chart" size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {rep.title}
                      </h3>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-400">
                        <span>Period: {rep.reporting_period}</span>
                        <span>· {rep.sections.length} sections</span>
                        <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                          {rep.report_type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setExportingReport(rep)}
                      className="flex items-center gap-1 rounded-xl bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200"
                      title="Export report to PDF, DOCX, or CSV"
                    >
                      <Icon name="share" size={13} />
                      <span>Export</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-200 p-8 text-center text-xs text-zinc-400 dark:border-zinc-800">
              No reports compiled yet. Use report templates or compile real work logs & achievements into verified weekly briefs.
            </div>
          )}
        </section>
      )}

      {/* 3. Projects */}
      {(activeTab === "all" || activeTab === "projects") && (
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">
              Projects ({filteredProjects.length})
            </h2>
            <button
              type="button"
              onClick={openCreateProject}
              className="text-xs font-bold text-[#85a900] hover:underline"
            >
              + New Project
            </button>
          </div>

          {filteredProjects.length ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {filteredProjects.map((p) => (
                <article
                  key={p.id}
                  onClick={() => setEditingProject(p)}
                  className="flex cursor-pointer flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-sm transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                        {p.status.replace("_", " ").toUpperCase()}
                      </span>
                      <span className="text-xs text-zinc-400">Due {p.due_date}</span>
                    </div>
                    <h3 className="mt-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {p.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                      {p.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-200 p-8 text-center text-xs text-zinc-400 dark:border-zinc-800">
              No projects in this view.
            </div>
          )}
        </section>
      )}

      {/* 4. Folders */}
      {(activeTab === "all" || activeTab === "folders") && (
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">
              Folders ({folders.length})
            </h2>
            <button
              type="button"
              onClick={() => setFolderModalOpen(true)}
              className="text-xs font-bold text-[#85a900] hover:underline"
            >
              + New Folder
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {folders.map((f) => {
              const docCount = documents.filter((d) => d.folder_id === f.id).length;
              const projCount = projects.filter((p) => p.folder_id === f.id).length;
              const isSelected = selectedFolderId === f.id;

              return (
                <div
                  key={f.id}
                  onClick={() => {
                    setSelectedFolderId(isSelected ? null : f.id);
                    setActiveTab("all");
                  }}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 transition ${
                    isSelected
                      ? "border-[#85a900] bg-[#f4ffe0] dark:bg-[#1a2208]"
                      : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
                  }`}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                    <Icon name="folder" size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {f.name}
                    </h4>
                    <span className="text-[11px] text-zinc-400">
                      {docCount} docs · {projCount} projects
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
