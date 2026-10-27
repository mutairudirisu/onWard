"use client";

import { useTasks } from "@/lib/task-context";
import { useWorkspace } from "@/lib/workspace-context";
import { TaskDialog } from "@/components/TaskDialog";
import { NoteEditor } from "@/components/NoteEditor";
import { TaskReminderDialog } from "@/components/TaskReminderDialog";
import { AchievementDialog } from "@/components/AchievementDialog";
import { WorkLogDialog } from "@/components/WorkLogDialog";
import { SummaryGeneratorDialog } from "@/components/SummaryGeneratorDialog";
import { WorkspaceDialog } from "@/components/WorkspaceDialog";
import { FolderDialog } from "@/components/FolderDialog";
import { ProjectDialog } from "@/components/ProjectDialog";
import { DocumentDialog } from "@/components/DocumentDialog";
import { DocumentShareDialog } from "@/components/DocumentShareDialog";
import { ReportDialog } from "@/components/ReportDialog";
import { ReportExportModal } from "@/components/ReportExportModal";
import { RecordDetailsDrawer } from "@/components/RecordDetailsDrawer";

export function ModalManager() {
  const {
    editingTask,
    setEditingTask,
    editingNote,
    setEditingNote,
    editingAchievement,
    setEditingAchievement,
    editingWorkLog,
    setEditingWorkLog,
    activeReminderTask,
    setActiveReminderTask,
    summaryModalOpen,
    setSummaryModalOpen,
    summaryType,
    toggle,
    notice,
    setNotice,
  } = useTasks();

  const {
    workspaceModalOpen,
    setWorkspaceModalOpen,
    folderModalOpen,
    setFolderModalOpen,
    editingProject,
    setEditingProject,
    editingDocument,
    setEditingDocument,
    sharingDocument,
    setSharingDocument,
    editingReport,
    setEditingReport,
    exportingReport,
    setExportingReport,
    inspectingRecords,
    setInspectingRecords,
  } = useWorkspace();

  return (
    <>
      {/* Personal Dialogs */}
      {editingTask && (
        <TaskDialog task={editingTask} close={() => setEditingTask(null)} />
      )}
      {editingNote && (
        <NoteEditor note={editingNote} onClose={() => setEditingNote(null)} />
      )}
      {editingAchievement && (
        <AchievementDialog
          achievement={editingAchievement}
          close={() => setEditingAchievement(null)}
        />
      )}
      {editingWorkLog && (
        <WorkLogDialog
          workLog={editingWorkLog}
          close={() => setEditingWorkLog(null)}
        />
      )}
      {summaryModalOpen && (
        <SummaryGeneratorDialog
          isOpen={summaryModalOpen}
          onClose={() => setSummaryModalOpen(false)}
          initialType={summaryType}
        />
      )}
      {activeReminderTask && (
        <TaskReminderDialog
          task={activeReminderTask}
          close={() => setActiveReminderTask(null)}
          onComplete={toggle}
        />
      )}

      {/* Workspace Dialogs */}
      {workspaceModalOpen && (
        <WorkspaceDialog
          isOpen={workspaceModalOpen}
          onClose={() => setWorkspaceModalOpen(false)}
        />
      )}
      {folderModalOpen && (
        <FolderDialog
          isOpen={folderModalOpen}
          onClose={() => setFolderModalOpen(false)}
        />
      )}
      {editingProject && (
        <ProjectDialog
          project={editingProject}
          close={() => setEditingProject(null)}
        />
      )}
      {editingDocument && (
        <DocumentDialog
          document={editingDocument}
          close={() => setEditingDocument(null)}
        />
      )}
      {sharingDocument && (
        <DocumentShareDialog
          document={sharingDocument}
          close={() => setSharingDocument(null)}
        />
      )}
      {editingReport && (
        <ReportDialog
          report={editingReport}
          close={() => setEditingReport(null)}
        />
      )}
      {exportingReport && (
        <ReportExportModal
          report={exportingReport}
          close={() => setExportingReport(null)}
        />
      )}
      {inspectingRecords && (
        <RecordDetailsDrawer
          data={inspectingRecords}
          close={() => setInspectingRecords(null)}
        />
      )}

      {/* Global Notification Toast */}
      {notice && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 rounded-2xl border border-[#b8e85e] bg-[#f4ffe0] px-4 py-3 text-xs font-semibold text-[#496612] shadow-xl dark:border-[#496612] dark:bg-[#1a2208] dark:text-[#d3f36b]">
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            className="text-base font-bold leading-none hover:opacity-75"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
