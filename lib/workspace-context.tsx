"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useTasks } from "@/lib/task-context";

export type WorkspaceRole = "owner" | "editor" | "viewer";

export type Workspace = {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
};

export type WorkspaceMember = {
  id: string;
  workspace_id: string;
  email: string;
  name: string;
  role: WorkspaceRole;
  status: "active" | "pending";
};

export type WorkspaceFolder = {
  id: string;
  workspace_id: string;
  name: string;
  created_at: string;
};

export type WorkspaceProject = {
  id: string;
  workspace_id: string;
  folder_id: string | null;
  title: string;
  description: string;
  status: "planned" | "in_progress" | "completed" | "on_hold";
  due_date: string;
  created_at: string;
};

export type DocumentShare = {
  id: string;
  document_id: string;
  email: string;
  permission: "viewer" | "editor";
  granted_at: string;
};

export type WorkspaceDocument = {
  id: string;
  workspace_id: string;
  folder_id: string | null;
  project_id: string | null;
  title: string;
  content: string;
  updated_at: string;
  owner_id: string;
  owner_name: string;
  is_shared: boolean;
};

export type ReportType = "weekly" | "project_update" | "meeting" | "activity" | "general";

export type ReportSection = {
  id: string;
  title: string;
  content: string;
};

export type WorkspaceReport = {
  id: string;
  workspace_id: string;
  project_id: string | null;
  title: string;
  report_type: ReportType;
  reporting_period: string;
  sections: ReportSection[];
  source_record_ids: string[];
  status: "draft" | "published";
  updated_at: string;
};

function demoWorkspaces(): Workspace[] {
  return [
    {
      id: "ws-1",
      name: "OnWard Engineering",
      description: "Core platform development, product roadmap, and technical reports.",
      owner_id: "demo-user",
      created_at: "2026-10-01",
    },
    {
      id: "ws-2",
      name: "Q4 Product Strategy",
      description: "Cross-functional planning, user research, and quarterly milestones.",
      owner_id: "demo-user",
      created_at: "2026-10-10",
    },
  ];
}

function demoMembers(): WorkspaceMember[] {
  return [
    { id: "m-1", workspace_id: "ws-1", email: "you@example.com", name: "You (Owner)", role: "owner", status: "active" },
    { id: "m-2", workspace_id: "ws-1", email: "sara.tech@company.com", name: "Sara Tech", role: "editor", status: "active" },
    { id: "m-3", workspace_id: "ws-1", email: "alex.qa@company.com", name: "Alex Lead", role: "viewer", status: "active" },
    { id: "m-4", workspace_id: "ws-2", email: "you@example.com", name: "You (Owner)", role: "owner", status: "active" },
    { id: "m-5", workspace_id: "ws-2", email: "elena.design@company.com", name: "Elena Designer", role: "editor", status: "pending" },
  ];
}

function demoFolders(): WorkspaceFolder[] {
  return [
    { id: "f-1", workspace_id: "ws-1", name: "Sprint Reports", created_at: "2026-10-05" },
    { id: "f-2", workspace_id: "ws-1", name: "Architecture Specs", created_at: "2026-10-08" },
    { id: "f-3", workspace_id: "ws-2", name: "Quarterly Reviews", created_at: "2026-10-12" },
  ];
}

function demoProjects(): WorkspaceProject[] {
  return [
    {
      id: "wp-1",
      workspace_id: "ws-1",
      folder_id: "f-1",
      title: "PWA Offline Synchronization Engine",
      description: "Build robust offline-first background queue with optimistic UI rollback.",
      status: "in_progress",
      due_date: "2026-11-15",
      created_at: "2026-10-10",
    },
    {
      id: "wp-2",
      workspace_id: "ws-1",
      folder_id: "f-2",
      title: "Row Level Security Audit",
      description: "Verify tenant isolation and explicit owner validation across all endpoints.",
      status: "completed",
      due_date: "2026-10-24",
      created_at: "2026-10-14",
    },
    {
      id: "wp-3",
      workspace_id: "ws-2",
      folder_id: "f-3",
      title: "Multi-workspace Role Permissions",
      description: "Implement Viewer/Editor/Owner access controls with sharing revocation.",
      status: "in_progress",
      due_date: "2026-11-30",
      created_at: "2026-10-18",
    },
  ];
}

function demoDocuments(): WorkspaceDocument[] {
  return [
    {
      id: "doc-1",
      workspace_id: "ws-1",
      folder_id: "f-2",
      project_id: "wp-2",
      title: "Database Isolation & Security Policies",
      content: "# Database Isolation & Security Policies\n\nAll personal logs and workspace artifacts are strictly isolated using Supabase Row Level Security (RLS).\n\n## Core Rules\n1. Authenticated users can only read records belonging to their assigned workspaces.\n2. Revocation removes access immediately.\n3. Zero service-role keys are exposed to client bundles.",
      updated_at: "2026-10-25",
      owner_id: "demo-user",
      owner_name: "You",
      is_shared: true,
    },
    {
      id: "doc-2",
      workspace_id: "ws-1",
      folder_id: "f-1",
      project_id: "wp-1",
      title: "Offline Client Sync Specification",
      content: "# Offline Client Sync Specification\n\nDefines client cache invalidation and pointer velocity threshold for bottom sheet dismissal.",
      updated_at: "2026-10-22",
      owner_id: "demo-user",
      owner_name: "You",
      is_shared: false,
    },
  ];
}

function demoShares(): DocumentShare[] {
  return [
    {
      id: "ds-1",
      document_id: "doc-1",
      email: "sara.tech@company.com",
      permission: "editor",
      granted_at: "2026-10-25",
    },
    {
      id: "ds-2",
      document_id: "doc-1",
      email: "alex.qa@company.com",
      permission: "viewer",
      granted_at: "2026-10-25",
    },
  ];
}

function demoReports(): WorkspaceReport[] {
  return [
    {
      id: "rep-1",
      workspace_id: "ws-1",
      project_id: "wp-1",
      title: "Sprint 42 Weekly Engineering Report",
      report_type: "weekly",
      reporting_period: "Oct 20 - Oct 26, 2026",
      status: "published",
      updated_at: "2026-10-26",
      source_record_ids: ["log-1", "achieve-1"],
      sections: [
        {
          id: "sec-1",
          title: "Executive Summary",
          content: "Sprint 42 concluded with 100% test coverage and delivery of the 3-section workspace architecture ahead of schedule.",
        },
        {
          id: "sec-2",
          title: "Key Completed Work & Outcomes",
          content: "• Implemented context-aware speed dial and mobile navigation.\n• Audited database schema and formulated strict RLS security boundaries.\n• Reduced query latency by 45% using layered caching.",
        },
        {
          id: "sec-3",
          title: "Risks & Next Sprint Priorities",
          content: "Focus on document sharing revocation unit tests and DOCX export formatting.",
        },
      ],
    },
  ];
}

type WorkspaceContextType = {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  setActiveWorkspaceId: (id: string) => void;
  createWorkspace: (name: string, description: string) => Promise<Workspace>;
  updateWorkspace: (workspace: Workspace) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;

  members: WorkspaceMember[];
  inviteMember: (email: string, role: WorkspaceRole) => Promise<void>;
  updateMemberRole: (memberId: string, role: WorkspaceRole) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;

  folders: WorkspaceFolder[];
  createFolder: (name: string) => Promise<WorkspaceFolder>;
  deleteFolder: (folderId: string) => Promise<void>;

  projects: WorkspaceProject[];
  createProject: (project: Omit<WorkspaceProject, "id" | "workspace_id" | "created_at">) => Promise<WorkspaceProject>;
  updateProject: (project: WorkspaceProject) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  documents: WorkspaceDocument[];
  saveDocument: (doc: Omit<WorkspaceDocument, "id" | "workspace_id" | "updated_at" | "owner_id" | "owner_name" | "is_shared"> & { id?: string }) => Promise<WorkspaceDocument>;
  deleteDocument: (id: string) => Promise<void>;

  shares: DocumentShare[];
  shareDocument: (documentId: string, email: string, permission: "viewer" | "editor") => Promise<void>;
  revokeShare: (shareId: string) => Promise<void>;
  updateSharePermission: (shareId: string, permission: "viewer" | "editor") => Promise<void>;

  reports: WorkspaceReport[];
  saveReport: (report: Omit<WorkspaceReport, "id" | "workspace_id" | "updated_at"> & { id?: string }) => Promise<WorkspaceReport>;
  deleteReport: (id: string) => Promise<void>;

  // Dialog Controls
  editingDocument: WorkspaceDocument | null;
  setEditingDocument: (doc: WorkspaceDocument | null) => void;
  openCreateDocument: () => void;

  editingReport: WorkspaceReport | null;
  setEditingReport: (report: WorkspaceReport | null) => void;
  openCreateReport: (initialType?: ReportType, sourceRecords?: string[]) => void;

  exportingReport: WorkspaceReport | null;
  setExportingReport: (report: WorkspaceReport | null) => void;

  sharingDocument: WorkspaceDocument | null;
  setSharingDocument: (doc: WorkspaceDocument | null) => void;

  editingProject: WorkspaceProject | null;
  setEditingProject: (project: WorkspaceProject | null) => void;
  openCreateProject: () => void;

  folderModalOpen: boolean;
  setFolderModalOpen: (open: boolean) => void;

  workspaceModalOpen: boolean;
  setWorkspaceModalOpen: (open: boolean) => void;

  inspectingRecords: { title: string; recordIds: string[]; type: "tasks" | "achievements" | "worklogs" | "projects" } | null;
  setInspectingRecords: (data: { title: string; recordIds: string[]; type: "tasks" | "achievements" | "worklogs" | "projects" } | null) => void;
};

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { setNotice, user } = useTasks();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceIdState] = useState<string>("");
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [folders, setFolders] = useState<WorkspaceFolder[]>([]);
  const [projects, setProjects] = useState<WorkspaceProject[]>([]);
  const [documents, setDocuments] = useState<WorkspaceDocument[]>([]);
  const [shares, setShares] = useState<DocumentShare[]>([]);
  const [reports, setReports] = useState<WorkspaceReport[]>([]);

  // Modals & Drawers
  const [editingDocument, setEditingDocument] = useState<WorkspaceDocument | null>(null);
  const [editingReport, setEditingReport] = useState<WorkspaceReport | null>(null);
  const [exportingReport, setExportingReport] = useState<WorkspaceReport | null>(null);
  const [sharingDocument, setSharingDocument] = useState<WorkspaceDocument | null>(null);
  const [editingProject, setEditingProject] = useState<WorkspaceProject | null>(null);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
  const [inspectingRecords, setInspectingRecords] = useState<{
    title: string;
    recordIds: string[];
    type: "tasks" | "achievements" | "worklogs" | "projects";
  } | null>(null);

  // Load from local storage with fallback demo data
  useEffect(() => {
    const loadState = <T,>(key: string, fallback: T[]): T[] => {
      const saved = localStorage.getItem(`onward-${key}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return fallback;
        }
      }
      return fallback;
    };

    const ws = loadState("workspaces", demoWorkspaces());
    setWorkspaces(ws);
    setActiveWorkspaceIdState(ws[0]?.id || "");
    setMembers(loadState("members", demoMembers()));
    setFolders(loadState("folders", demoFolders()));
    setProjects(loadState("projects", demoProjects()));
    setDocuments(loadState("documents", demoDocuments()));
    setShares(loadState("shares", demoShares()));
    setReports(loadState("reports", demoReports()));
  }, []);

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0] || null;

  function setActiveWorkspaceId(id: string) {
    setActiveWorkspaceIdState(id);
    localStorage.setItem("onward-active-ws", id);
  }

  // Workspaces CRUD
  async function createWorkspace(name: string, description: string): Promise<Workspace> {
    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      owner_id: user?.id || "demo-user",
      created_at: new Date().toISOString().split("T")[0],
    };
    const updated = [...workspaces, newWs];
    setWorkspaces(updated);
    setActiveWorkspaceIdState(newWs.id);
    localStorage.setItem("onward-workspaces", JSON.stringify(updated));

    // Add owner membership
    const ownerMember: WorkspaceMember = {
      id: `m-${Date.now()}`,
      workspace_id: newWs.id,
      email: user?.email || "you@example.com",
      name: user?.user_metadata?.full_name || "You (Owner)",
      role: "owner",
      status: "active",
    };
    const updatedMembers = [...members, ownerMember];
    setMembers(updatedMembers);
    localStorage.setItem("onward-members", JSON.stringify(updatedMembers));

    setNotice(`Workspace "${newWs.name}" created.`);
    return newWs;
  }

  async function updateWorkspace(workspace: Workspace) {
    const updated = workspaces.map((w) => (w.id === workspace.id ? workspace : w));
    setWorkspaces(updated);
    localStorage.setItem("onward-workspaces", JSON.stringify(updated));
    setNotice("Workspace updated.");
  }

  async function deleteWorkspace(id: string) {
    if (workspaces.length <= 1) {
      setNotice("Cannot delete the only workspace.");
      return;
    }
    const updated = workspaces.filter((w) => w.id !== id);
    setWorkspaces(updated);
    setActiveWorkspaceIdState(updated[0].id);
    localStorage.setItem("onward-workspaces", JSON.stringify(updated));
    setNotice("Workspace removed.");
  }

  // Members
  async function inviteMember(email: string, role: WorkspaceRole) {
    if (!activeWorkspace) return;
    const cleanEmail = email.trim().toLowerCase();
    if (members.some((m) => m.workspace_id === activeWorkspace.id && m.email.toLowerCase() === cleanEmail)) {
      setNotice("This user is already a member of this workspace.");
      return;
    }
    const newMember: WorkspaceMember = {
      id: `m-${Date.now()}`,
      workspace_id: activeWorkspace.id,
      email: cleanEmail,
      name: cleanEmail.split("@")[0],
      role,
      status: "pending",
    };
    const updated = [...members, newMember];
    setMembers(updated);
    localStorage.setItem("onward-members", JSON.stringify(updated));
    setNotice(`Invitation sent to ${cleanEmail} as ${role}.`);
  }

  async function updateMemberRole(memberId: string, role: WorkspaceRole) {
    const updated = members.map((m) => (m.id === memberId ? { ...m, role } : m));
    setMembers(updated);
    localStorage.setItem("onward-members", JSON.stringify(updated));
    setNotice("Member permissions updated.");
  }

  async function removeMember(memberId: string) {
    const updated = members.filter((m) => m.id !== memberId);
    setMembers(updated);
    localStorage.setItem("onward-members", JSON.stringify(updated));
    setNotice("Member access revoked.");
  }

  // Folders
  async function createFolder(name: string): Promise<WorkspaceFolder> {
    const wsId = activeWorkspace?.id || workspaces[0]?.id || "ws-1";
    const newFolder: WorkspaceFolder = {
      id: `f-${Date.now()}`,
      workspace_id: wsId,
      name: name.trim(),
      created_at: new Date().toISOString().split("T")[0],
    };
    const updated = [...folders, newFolder];
    setFolders(updated);
    localStorage.setItem("onward-folders", JSON.stringify(updated));
    setNotice(`Folder "${newFolder.name}" created.`);
    return newFolder;
  }

  async function deleteFolder(folderId: string) {
    const updated = folders.filter((f) => f.id !== folderId);
    setFolders(updated);
    localStorage.setItem("onward-folders", JSON.stringify(updated));
    setNotice("Folder deleted.");
  }

  // Projects
  async function createProject(
    projectData: Omit<WorkspaceProject, "id" | "workspace_id" | "created_at">
  ): Promise<WorkspaceProject> {
    const wsId = activeWorkspace?.id || workspaces[0]?.id || "ws-1";
    const newProj: WorkspaceProject = {
      ...projectData,
      id: `wp-${Date.now()}`,
      workspace_id: wsId,
      created_at: new Date().toISOString().split("T")[0],
    };
    const updated = [newProj, ...projects];
    setProjects(updated);
    localStorage.setItem("onward-projects", JSON.stringify(updated));
    setNotice(`Project "${newProj.title}" created.`);
    return newProj;
  }

  async function updateProject(project: WorkspaceProject) {
    const updated = projects.map((p) => (p.id === project.id ? project : p));
    setProjects(updated);
    localStorage.setItem("onward-projects", JSON.stringify(updated));
    setNotice("Project updated.");
  }

  async function deleteProject(id: string) {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    localStorage.setItem("onward-projects", JSON.stringify(updated));
    setNotice("Project deleted.");
  }

  // Documents
  async function saveDocument(
    docData: Omit<WorkspaceDocument, "id" | "workspace_id" | "updated_at" | "owner_id" | "owner_name" | "is_shared"> & { id?: string }
  ): Promise<WorkspaceDocument> {
    const wsId = activeWorkspace?.id || workspaces[0]?.id || "ws-1";
    const now = new Date().toISOString().split("T")[0];
    const isNew = !docData.id;
    const docId = docData.id || `doc-${Date.now()}`;

    const existing = documents.find((d) => d.id === docId);
    const newDoc: WorkspaceDocument = {
      ...docData,
      id: docId,
      workspace_id: wsId,
      updated_at: now,
      owner_id: existing?.owner_id || user?.id || "demo-user",
      owner_name: existing?.owner_name || user?.user_metadata?.full_name || "You",
      is_shared: existing?.is_shared || false,
    };

    const updated = isNew
      ? [newDoc, ...documents]
      : documents.map((d) => (d.id === docId ? newDoc : d));
    setDocuments(updated);
    localStorage.setItem("onward-documents", JSON.stringify(updated));
    setNotice(`Document "${newDoc.title}" saved.`);
    return newDoc;
  }

  async function deleteDocument(id: string) {
    const updated = documents.filter((d) => d.id !== id);
    setDocuments(updated);
    localStorage.setItem("onward-documents", JSON.stringify(updated));
    setNotice("Document deleted.");
  }

  // Shares
  async function shareDocument(documentId: string, email: string, permission: "viewer" | "editor") {
    const cleanEmail = email.trim().toLowerCase();
    const existingShare = shares.find((s) => s.document_id === documentId && s.email === cleanEmail);
    let updated: DocumentShare[];

    if (existingShare) {
      updated = shares.map((s) => (s.id === existingShare.id ? { ...s, permission } : s));
    } else {
      const newShare: DocumentShare = {
        id: `ds-${Date.now()}`,
        document_id: documentId,
        email: cleanEmail,
        permission,
        granted_at: new Date().toISOString().split("T")[0],
      };
      updated = [...shares, newShare];
    }

    setShares(updated);
    localStorage.setItem("onward-shares", JSON.stringify(updated));

    // Mark doc as shared
    const updatedDocs = documents.map((d) => (d.id === documentId ? { ...d, is_shared: true } : d));
    setDocuments(updatedDocs);
    localStorage.setItem("onward-documents", JSON.stringify(updatedDocs));

    setNotice(`Access granted to ${cleanEmail} (${permission}).`);
  }

  async function revokeShare(shareId: string) {
    const share = shares.find((s) => s.id === shareId);
    if (!share) return;
    const updated = shares.filter((s) => s.id !== shareId);
    setShares(updated);
    localStorage.setItem("onward-shares", JSON.stringify(updated));

    // If no more shares for doc, set is_shared = false
    const remaining = updated.filter((s) => s.document_id === share.document_id);
    if (!remaining.length) {
      const updatedDocs = documents.map((d) =>
        d.id === share.document_id ? { ...d, is_shared: false } : d
      );
      setDocuments(updatedDocs);
      localStorage.setItem("onward-documents", JSON.stringify(updatedDocs));
    }

    setNotice(`Revoked access for ${share.email}.`);
  }

  async function updateSharePermission(shareId: string, permission: "viewer" | "editor") {
    const updated = shares.map((s) => (s.id === shareId ? { ...s, permission } : s));
    setShares(updated);
    localStorage.setItem("onward-shares", JSON.stringify(updated));
    setNotice("Share permission updated.");
  }

  // Reports
  async function saveReport(
    reportData: Omit<WorkspaceReport, "id" | "workspace_id" | "updated_at"> & { id?: string }
  ): Promise<WorkspaceReport> {
    const wsId = activeWorkspace?.id || workspaces[0]?.id || "ws-1";
    const now = new Date().toISOString().split("T")[0];
    const isNew = !reportData.id;
    const reportId = reportData.id || `rep-${Date.now()}`;

    const newReport: WorkspaceReport = {
      ...reportData,
      id: reportId,
      workspace_id: wsId,
      updated_at: now,
    };

    const updated = isNew
      ? [newReport, ...reports]
      : reports.map((r) => (r.id === reportId ? newReport : r));
    setReports(updated);
    localStorage.setItem("onward-reports", JSON.stringify(updated));
    setNotice(`Report "${newReport.title}" saved.`);
    return newReport;
  }

  async function deleteReport(id: string) {
    const updated = reports.filter((r) => r.id !== id);
    setReports(updated);
    localStorage.setItem("onward-reports", JSON.stringify(updated));
    setNotice("Report deleted.");
  }

  function openCreateDocument() {
    setEditingDocument({
      id: "",
      workspace_id: activeWorkspace?.id || "ws-1",
      folder_id: null,
      project_id: null,
      title: "",
      content: "",
      updated_at: new Date().toISOString().split("T")[0],
      owner_id: user?.id || "demo-user",
      owner_name: user?.user_metadata?.full_name || "You",
      is_shared: false,
    });
  }

  function openCreateReport(initialType: ReportType = "weekly", sourceRecords: string[] = []) {
    const defaultSections: Record<ReportType, ReportSection[]> = {
      weekly: [
        { id: "1", title: "Executive Summary", content: "Highlights of key outcomes and deliveries for this period." },
        { id: "2", title: "Deliverables Completed", content: "Key tasks and milestones moved across the finish line." },
        { id: "3", title: "Risks & Blockers", content: "Current challenges and mitigation steps." },
      ],
      project_update: [
        { id: "1", title: "Project Overview", content: "High level status, scope, and target milestone alignment." },
        { id: "2", title: "Milestones Completed", content: "Progress metrics, completed tests, and architectural changes." },
        { id: "3", title: "Next Phase Roadmap", content: "Upcoming deliverables and team assignments." },
      ],
      meeting: [
        { id: "1", title: "Agenda & Attendees", content: "Topics discussed and participants." },
        { id: "2", title: "Decisions Agreed", content: "Clear architectural and project choices made." },
        { id: "3", title: "Action Items", content: "Direct assignments with due dates." },
      ],
      activity: [
        { id: "1", title: "Activity Summary", content: "Overview of actions performed over the interval." },
        { id: "2", title: "Operational Impact", content: "Results, latency/bandwidth gains, or customer feedback." },
      ],
      general: [
        { id: "1", title: "Report Overview", content: "Context and objectives." },
        { id: "2", title: "Findings & Details", content: "Core observations and verified data." },
        { id: "3", title: "Recommendations", content: "Suggested path forward." },
      ],
    };

    setEditingReport({
      id: "",
      workspace_id: activeWorkspace?.id || "ws-1",
      project_id: null,
      title: "",
      report_type: initialType,
      reporting_period: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      sections: defaultSections[initialType],
      source_record_ids: sourceRecords,
      status: "draft",
      updated_at: new Date().toISOString().split("T")[0],
    });
  }

  function openCreateProject() {
    setEditingProject({
      id: "",
      workspace_id: activeWorkspace?.id || "ws-1",
      folder_id: null,
      title: "",
      description: "",
      status: "in_progress",
      due_date: new Date().toISOString().split("T")[0],
      created_at: new Date().toISOString().split("T")[0],
    });
  }

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspace,
        setActiveWorkspaceId,
        createWorkspace,
        updateWorkspace,
        deleteWorkspace,

        members,
        inviteMember,
        updateMemberRole,
        removeMember,

        folders,
        createFolder,
        deleteFolder,

        projects,
        createProject,
        updateProject,
        deleteProject,

        documents,
        saveDocument,
        deleteDocument,

        shares,
        shareDocument,
        revokeShare,
        updateSharePermission,

        reports,
        saveReport,
        deleteReport,

        editingDocument,
        setEditingDocument,
        openCreateDocument,

        editingReport,
        setEditingReport,
        openCreateReport,

        exportingReport,
        setExportingReport,

        sharingDocument,
        setSharingDocument,

        editingProject,
        setEditingProject,
        openCreateProject,

        folderModalOpen,
        setFolderModalOpen,

        workspaceModalOpen,
        setWorkspaceModalOpen,

        inspectingRecords,
        setInspectingRecords,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within a WorkspaceProvider");
  return ctx;
}
