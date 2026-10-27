"use client";

import { useState } from "react";
import { DraggableModal } from "@/components/DraggableModal";
import { Icon } from "@/components/Icon";
import { useTasks } from "@/lib/task-context";
import type { WorkspaceReport } from "@/lib/workspace-context";

export function ReportExportModal({
  report,
  close,
}: {
  report: WorkspaceReport;
  close: () => void;
}) {
  const { setNotice } = useTasks();
  const [exportFormat, setExportFormat] = useState<"pdf" | "docx" | "csv">("pdf");

  function handleExport() {
    try {
      if (exportFormat === "pdf") {
        // Trigger clean formatted print-to-PDF
        const printWindow = window.open("", "_blank");
        if (!printWindow) {
          throw new Error("Popup blocked by browser. Please allow popups for PDF export.");
        }
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${report.title}</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #111; padding: 40px; max-width: 800px; margin: auto; }
                h1 { font-size: 26px; margin-bottom: 4px; color: #1c2e0b; }
                .meta { font-size: 13px; color: #666; margin-bottom: 24px; border-bottom: 2px solid #d3f36b; padding-bottom: 12px; }
                .section { margin-bottom: 24px; }
                .section h2 { font-size: 18px; color: #2e4a10; border-bottom: 1px solid #eee; padding-bottom: 6px; }
                .section p { font-size: 14px; white-space: pre-wrap; }
                footer { margin-top: 40px; font-size: 11px; color: #999; text-align: center; }
              </style>
            </head>
            <body>
              <h1>${report.title}</h1>
              <div class="meta">
                <b>Reporting Period:</b> ${report.reporting_period} | <b>Type:</b> ${report.report_type.toUpperCase()} | <b>Generated onWard:</b> ${new Date().toLocaleDateString()}
              </div>
              ${report.sections
                .map(
                  (s) => `
                <div class="section">
                  <h2>${s.title}</h2>
                  <p>${s.content}</p>
                </div>
              `
                )
                .join("")}
              <footer>Generated from verified records by onWard Workspace</footer>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 300);
        setNotice("PDF print/export dialog opened.");
      } else if (exportFormat === "docx") {
        // Format as formatted Word / Markdown document blob
        let docContent = `# ${report.title}\n\n`;
        docContent += `**Reporting Period:** ${report.reporting_period}\n`;
        docContent += `**Report Type:** ${report.report_type.toUpperCase()}\n`;
        docContent += `**Export Date:** ${new Date().toISOString().split("T")[0]}\n\n---\n\n`;

        report.sections.forEach((sec) => {
          docContent += `## ${sec.title}\n\n${sec.content}\n\n`;
        });

        docContent += `\n---\n*Exported from onWard Workspace*\n`;

        const blob = new Blob([docContent], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${report.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setNotice("DOCX formatted file downloaded.");
      } else if (exportFormat === "csv") {
        // Generate CSV table
        const rows = [
          ["Report Title", report.title],
          ["Reporting Period", report.reporting_period],
          ["Report Type", report.report_type],
          ["Status", report.status],
          ["Exported At", new Date().toISOString()],
          [],
          ["Section Number", "Section Title", "Content"],
        ];

        report.sections.forEach((sec, idx) => {
          rows.push([
            String(idx + 1),
            sec.title,
            `"${sec.content.replace(/"/g, '""')}"`,
          ]);
        });

        const csvContent = rows.map((e) => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${report.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setNotice("CSV data file downloaded.");
      }
      close();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Export failed. Please check browser permissions.";
      setNotice(msg);
    }
  }

  return (
    <DraggableModal isOpen={true} onClose={close} ariaLabel="Report Export Preview">
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
              REPORT EXPORT & PREVIEW
            </p>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {report.title}
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

        {/* Format Selector: PDF, DOCX, CSV */}
        <div className="flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
          <button
            type="button"
            onClick={() => setExportFormat("pdf")}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
              exportFormat === "pdf"
                ? "bg-[#d3f36b] text-[#283618] shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            PDF Document
          </button>
          <button
            type="button"
            onClick={() => setExportFormat("docx")}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
              exportFormat === "docx"
                ? "bg-[#d3f36b] text-[#283618] shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            DOCX / Word
          </button>
          <button
            type="button"
            onClick={() => setExportFormat("csv")}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
              exportFormat === "csv"
                ? "bg-[#d3f36b] text-[#283618] shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            CSV Data
          </button>
        </div>

        {/* Report Preview */}
        <div className="flex max-h-72 flex-col gap-3 overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-4 shadow-inner dark:border-zinc-800 dark:bg-zinc-900">
          <div className="border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <h3 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
              {report.title}
            </h3>
            <span className="text-xs text-zinc-400">
              Period: {report.reporting_period} · Type: {report.report_type.toUpperCase()}
            </span>
          </div>

          {report.sections.map((s, idx) => (
            <div key={s.id} className="flex flex-col gap-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#85a900]">
                {idx + 1}. {s.title}
              </h4>
              <p className="text-xs leading-relaxed text-zinc-700 whitespace-pre-wrap dark:text-zinc-300">
                {s.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={close}
            className="h-11 rounded-xl border border-zinc-200 px-5 text-xs font-bold text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#d3f36b] text-sm font-bold text-[#283618] shadow-md shadow-[#718d3725] transition hover:bg-[#c4e65d] active:scale-[0.98]"
          >
            <Icon name="share" size={16} />
            <span>Download {exportFormat.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </DraggableModal>
  );
}
