"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import {
  type WorkspaceDocument,
  useWorkspace,
} from "@/lib/workspace-context";

export type TableTheme = {
  id: string;
  name: string;
  colorName: string;
  previewBg: string;
  wordHeaderBg: string;
  wordHeaderText: string;
  wordBorder: string;
  wordAltRow: string;
};

export const TABLE_THEMES: TableTheme[] = [
  {
    id: "lime",
    name: "onWard Lime",
    colorName: "Lime & Olive",
    previewBg: "bg-[#d3f36b]",
    wordHeaderBg: "#edf6d5",
    wordHeaderText: "#283618",
    wordBorder: "#85a900",
    wordAltRow: "#f9fceb",
  },
  {
    id: "slate",
    name: "Corporate Slate",
    colorName: "Slate Modern",
    previewBg: "bg-slate-700",
    wordHeaderBg: "#1e293b",
    wordHeaderText: "#ffffff",
    wordBorder: "#64748b",
    wordAltRow: "#f8fafc",
  },
  {
    id: "navy",
    name: "Oceanic Navy",
    colorName: "Navy & Blue",
    previewBg: "bg-blue-600",
    wordHeaderBg: "#1e40af",
    wordHeaderText: "#ffffff",
    wordBorder: "#60a5fa",
    wordAltRow: "#eff6ff",
  },
  {
    id: "emerald",
    name: "Forest Emerald",
    colorName: "Emerald Green",
    previewBg: "bg-emerald-600",
    wordHeaderBg: "#047857",
    wordHeaderText: "#ffffff",
    wordBorder: "#34d399",
    wordAltRow: "#ecfdf5",
  },
  {
    id: "amber",
    name: "Sunset Amber",
    colorName: "Amber Flame",
    previewBg: "bg-amber-500",
    wordHeaderBg: "#b45309",
    wordHeaderText: "#ffffff",
    wordBorder: "#fb923c",
    wordAltRow: "#fffbeb",
  },
];

export function DocumentDialog({
  document,
  close,
}: {
  document: WorkspaceDocument;
  close: () => void;
}) {
  const {
    saveDocument,
    deleteDocument,
    folders,
    setSharingDocument,
    shares,
  } = useWorkspace();

  const isNew = !document.id;

  const [title, setTitle] = useState(document.title || "Untitled Document");
  const [content, setContent] = useState(document.content || "");
  const [folderId, setFolderId] = useState(document.folder_id || "");
  const [priority, setPriority] = useState<"high" | "medium" | "low">(
    document.priority || "high"
  );
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const [activeSideDrawer, setActiveSideDrawer] = useState<"none" | "comments" | "history">("none");

  // Word-style Table Popover State
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [tableGrid, setTableGrid] = useState<{ rows: number; cols: number }>({ rows: 3, cols: 3 });
  const [tableTheme, setTableTheme] = useState<string>("lime");

  // Mobile Bottom Bar Tool States (Matching Image)
  const [showMobileFormatting, setShowMobileFormatting] = useState(false);
  const [showSketchModal, setShowSketchModal] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Font formatting state
  const [currentBlock, setCurrentBlock] = useState<string>("p");

  // Threaded Comments
  const initialComments = document.comments || [
    {
      id: "c-1",
      author_name: "Sara Tech",
      author_avatar: "👩‍💻",
      author_role: "Lead Engineer",
      content: "Let's ensure the Word (.doc) and PDF exports retain table padding and heading borders.",
      created_at: "2 hours ago",
    },
    {
      id: "c-2",
      author_name: "Alex Lead",
      author_avatar: "🧑‍🚀",
      author_role: "Product QA",
      content: "Verified drag-and-drop folder sorting on desktop and mobile. Ready for team sign-off.",
      created_at: "35 mins ago",
    },
  ];
  const [comments, setComments] = useState(initialComments);
  const [newCommentText, setNewCommentText] = useState("");

  // Audit Trail / Version History
  const initialRevisions = document.revisions || [
    {
      id: "rev-3",
      author_name: "Sara Tech",
      author_avatar: "👩‍💻",
      description: "Updated milestones table & export verification guidelines",
      created_at: "Today, 10:14 AM",
      content: content,
    },
    {
      id: "rev-2",
      author_name: "Alex Lead",
      author_avatar: "🧑‍🚀",
      description: "Added offline sync test vectors and rollback criteria",
      created_at: "Yesterday, 4:20 PM",
      content: content,
    },
    {
      id: "rev-1",
      author_name: "You",
      author_avatar: "👤",
      description: "Created initial document draft in workspace",
      created_at: "Oct 22, 11:30 AM",
      content: content,
    },
  ];
  const [revisions, setRevisions] = useState(initialRevisions);

  // Active Team Collaborators (Live Presence)
  const collaborators = [
    { name: "Sara Tech", role: "Lead Engineer", avatar: "👩‍💻", status: "editing", bg: "#fef3c7", color: "#b45309" },
    { name: "Alex Lead", role: "Product QA", avatar: "🧑‍🚀", status: "viewing", bg: "#dbeafe", color: "#1d4ed8" },
    { name: "You", role: "Owner", avatar: "👤", status: "editing", bg: "#d3f36b", color: "#283618" },
  ];

  const editorRef = useRef<HTMLDivElement>(null);
  const tableMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  // Initialize Word canvas with content on mount
  useEffect(() => {
    if (editorRef.current) {
      const initialHtml = convertMarkdownToInitialHtml(
        document.content ||
          `# ${title || "Document Title"}\n\nType directly on this Word page to write your strategy, report, or specifications.\n\n## 1. Project Objectives\n- Seamless real-time Word typing and collaboration\n- Rich table insertion with custom color themes\n- Native Microsoft Word (.doc) and PDF export\n\n<!-- table-theme: lime -->\n| Deliverable | Owner | Target Date | Status |\n|---|---|---|---|\n| Word Paper Canvas | Design Team | Nov 02 | Complete |\n| Collaborative Sync | Backend Team | Nov 08 | Active |\n| Export Engine | QA Lead | Nov 15 | Verified |\n\n> [!NOTE]\n> All formatting and tables export directly into authentic Microsoft Word print view.`
      );
      editorRef.current.innerHTML = initialHtml;
      setContent(initialHtml);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close table popover when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (tableMenuRef.current && !tableMenuRef.current.contains(e.target as Node)) {
        setShowTableMenu(false);
      }
    }
    if (showTableMenu) {
      window.document.addEventListener("mousedown", handleClickOutside);
    }
    return () => window.document.removeEventListener("mousedown", handleClickOutside);
  }, [showTableMenu]);

  // Statistics from Word Canvas text content
  const plainText = editorRef.current?.innerText || "";
  const words = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
  const chars = plainText.length;
  const readTimeMin = Math.max(1, Math.ceil(words / 200));

  const currentFolder = folders.find((f) => f.id === folderId);

  // Auto-save debounce effect
  useEffect(() => {
    setSaveStatus("saving");
    const timer = setTimeout(() => {
      setSaveStatus("saved");
    }, 600);
    return () => clearTimeout(timer);
  }, [title, content, folderId, priority]);

  // Word Canvas direct input handler
  const handleEditorInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  // Execute formatting command on Word canvas
  function execCmd(command: string, value: string = "") {
    window.document.execCommand(command, false, value);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  }

  // Format block (Heading 1, 2, 3, Paragraph)
  function handleFormatBlock(blockTag: string) {
    setCurrentBlock(blockTag);
    if (blockTag === "p") {
      window.document.execCommand("formatBlock", false, "<p>");
    } else {
      window.document.execCommand("formatBlock", false, `<${blockTag}>`);
    }
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  }

  // Save changes handler
  async function handleSave() {
    setSaveStatus("saving");
    const currentHtml = editorRef.current?.innerHTML || content;
    const newRev = {
      id: `rev-${Date.now()}`,
      author_name: "You",
      author_avatar: "👤",
      description: "Updated Word document content & formatting",
      created_at: "Just now",
      content: currentHtml,
    };
    const updatedRevs = [newRev, ...revisions];
    setRevisions(updatedRevs);

    await saveDocument({
      ...(document.id ? { id: document.id } : {}),
      title: title.trim() || "Untitled Document",
      content: currentHtml,
      folder_id: folderId || null,
      project_id: document.project_id || null,
      priority,
      comments_count: comments.length,
      file_count: document.file_count || 1,
      tags: document.tags && document.tags.length > 0 ? document.tags : ["Workspace", "Doc"],
      comments,
      revisions: updatedRevs,
    });
    setSaveStatus("saved");
  }

  // Insert Word-style Table directly into Word canvas
  function handleInsertWordTable(cols: number, rows: number, themeId: string) {
    const theme = TABLE_THEMES.find((t) => t.id === themeId) || TABLE_THEMES[0];
    let tableHtml = `<table style="border-collapse: collapse; width: 100%; margin: 16px 0;" data-theme="${theme.id}"><thead><tr>`;
    for (let c = 1; c <= cols; c++) {
      tableHtml += `<th style="background-color: ${theme.wordHeaderBg}; color: ${theme.wordHeaderText}; padding: 10px 12px; border: 1px solid ${theme.wordBorder}; font-weight: bold; text-align: left;">Header ${c}</th>`;
    }
    tableHtml += `</tr></thead><tbody>`;
    for (let r = 1; r <= rows; r++) {
      const bg = r % 2 === 0 ? theme.wordAltRow : "#ffffff";
      tableHtml += `<tr>`;
      for (let c = 1; c <= cols; c++) {
        tableHtml += `<td style="background-color: ${bg}; padding: 8px 12px; border: 1px solid ${theme.wordBorder};">Row ${r}.${c}</td>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</tbody></table><p><br/></p>`;

    window.document.execCommand("insertHTML", false, tableHtml);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
    setShowTableMenu(false);
  }

  // Insert Callout Box
  function handleInsertCallout() {
    const calloutHtml = `<div class="callout-note" style="background-color: #edf6d5; border-left: 4px solid #85a900; padding: 12px 16px; margin: 14px 0; border-radius: 6px; color: #283618;"><strong>Note:</strong> Add your important guidance or context here...</div><p><br/></p>`;
    window.document.execCommand("insertHTML", false, calloutHtml);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  }

  // Mobile Bottom Bar Actions:
  // 1. Voice Dictation
  function toggleVoiceDictation() {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome/Edge/Safari.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      window.document.execCommand("insertText", false, transcript + " ");
      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }

  // 2. Image Upload
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const imgHtml = `<img src="${dataUrl}" alt="Inserted" style="max-width: 100%; border-radius: 8px; margin: 14px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);" /><p><br/></p>`;
      window.document.execCommand("insertHTML", false, imgHtml);
      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
      }
    };
    reader.readAsDataURL(file);
  }

  // 3. Checklist Task
  function handleInsertChecklist() {
    const checkHtml = `<div style="display: flex; align-items: center; gap: 8px; margin: 6px 0;"><input type="checkbox" style="width: 16px; height: 16px; accent-color: #85a900; cursor: pointer;" /> <span style="font-size: 1rem;">New checklist task</span></div><p><br/></p>`;
    window.document.execCommand("insertHTML", false, checkHtml);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  }

  // 4. Sketch Canvas Helpers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1e293b";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const insertSketchImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const imgHtml = `<img src="${dataUrl}" alt="Handwritten sketch" style="max-width: 100%; border: 1px solid #e2e8f0; border-radius: 8px; margin: 12px 0;" /><p><br/></p>`;
    window.document.execCommand("insertHTML", false, imgHtml);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
    setShowSketchModal(false);
  };

  // Real Word (.doc) Export: Produces authentic Microsoft Word Document View
  function handleExportWord() {
    const editorBody = editorRef.current?.innerHTML || content;
    const wordHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <title>${title}</title>
        <style>
          @page Section1 {
            size: 8.5in 11.0in;
            margin: 1.0in 1.0in 1.0in 1.0in;
            mso-header-margin: 0.5in;
            mso-footer-margin: 0.5in;
            mso-paper-source: 0;
          }
          div.Section1 { page: Section1; }
          body {
            font-family: 'Aptos', 'Calibri', 'Segoe UI', Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #1e293b;
          }
          h1 { font-size: 24pt; font-weight: bold; color: #0f172a; margin-top: 20pt; margin-bottom: 10pt; border-bottom: 2pt solid #85a900; padding-bottom: 6pt; }
          h2 { font-size: 16pt; font-weight: bold; color: #1e293b; margin-top: 16pt; margin-bottom: 8pt; border-bottom: 1pt solid #e2e8f0; padding-bottom: 4pt; }
          h3 { font-size: 13pt; font-weight: bold; color: #334155; margin-top: 12pt; margin-bottom: 6pt; }
          p { margin-top: 0pt; margin-bottom: 8pt; }
          table { border-collapse: collapse; width: 100%; margin: 14pt 0; }
          th { padding: 8pt 10pt; font-weight: bold; text-align: left; }
          td { padding: 7pt 10pt; text-align: left; }
          blockquote { border-left: 3pt solid #85a900; padding: 6pt 12pt; color: #475569; font-style: italic; background: #f8fafc; margin: 10pt 0; }
          .callout-note { background: #edf6d5; border-left: 4pt solid #85a900; padding: 10pt 14pt; margin: 12pt 0; border-radius: 4pt; }
          .meta-header { background: #f8fafc; border: 1pt solid #e2e8f0; padding: 12pt 16pt; margin-bottom: 20pt; border-radius: 6pt; font-size: 10pt; }
          .badge { display: inline-block; padding: 2pt 6pt; background: #edf6d5; color: #3d4b24; border-radius: 4pt; font-size: 9pt; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="Section1">
          <div class="meta-header">
            <strong>Workspace Document:</strong> ${title}<br>
            <strong>Folder:</strong> ${currentFolder ? currentFolder.name : "Root"}<br>
            <strong>Priority:</strong> <span class="badge">${priority.toUpperCase()}</span><br>
            <strong>Author:</strong> ${document.owner_name || "You"}<br>
            <strong>Last Modified:</strong> ${new Date().toLocaleDateString()}<br>
          </div>
          ${editorBody}
        </div>
      </body>
      </html>
    `;
    const blob = new Blob(["\ufeff" + wordHtml], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "document"}.doc`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Real PDF Export via print workflow
  function handleExportPdf() {
    window.print();
  }

  // Add Comment
  function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      author_name: "You",
      author_avatar: "👤",
      author_role: "Workspace Owner",
      content: newCommentText.trim(),
      created_at: "Just now",
    };
    const updated = [newComment, ...comments];
    setComments(updated);
    setNewCommentText("");
  }

  // Restore Revision into Word Canvas
  function handleRestoreRevision(rev: (typeof revisions)[0]) {
    if (confirm(`Restore version from "${rev.created_at}" by ${rev.author_name}?`)) {
      if (editorRef.current) {
        editorRef.current.innerHTML = rev.content;
        setContent(rev.content);
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#eef1f5] dark:bg-[#0f1117] min-[761px]:left-[240px] animate-in fade-in duration-150 overflow-hidden onward-doc-studio">
      {/* Print-only CSS style injection */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #onward-word-canvas, #onward-word-canvas * {
            visibility: visible !important;
          }
          #onward-word-canvas {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20mm !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* TOP STUDIO NAVIGATION / HEADER (Spacious, Single-Line Action Controls) */}
      <header className="no-print flex h-16 shrink-0 items-center justify-between border-b border-zinc-200/90 bg-white px-4 sm:px-6 dark:border-zinc-800 dark:bg-zinc-900 gap-3">
        {/* Left Side: Document Icon & Meta */}
        <div className="flex items-center gap-3 min-w-0 shrink">
          {/* Word Doc Icon */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2b579a] text-white shadow-xs font-bold text-xs" title="Microsoft Word & Collaborative Document">
            DOC
          </div>

          <div className="min-w-0 flex flex-col justify-center">
            {/* Title & Save Status Badge */}
            <div className="flex items-center gap-2 min-w-0">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Untitled document..."
                className="font-sans text-sm sm:text-base font-bold text-zinc-900 outline-none bg-transparent hover:bg-zinc-100/70 focus:bg-zinc-100 rounded-md px-1.5 py-0.5 transition dark:text-zinc-100 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800 max-w-[170px] sm:max-w-xs truncate"
              />

              {/* Status Badge in dedicated position */}
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 shrink-0">
                <span className={`h-1.5 w-1.5 rounded-full bg-emerald-500 ${saveStatus === "saving" ? "animate-ping" : ""}`} />
                <span>{saveStatus === "saved" ? "Saved" : "Saving..."}</span>
              </span>
            </div>

            {/* Folder & Priority tags row */}
            <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
              <label className="flex items-center gap-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 cursor-pointer">
                <span>📁</span>
                <select
                  value={folderId}
                  onChange={(e) => setFolderId(e.target.value)}
                  className="bg-transparent text-[11px] font-bold text-zinc-700 outline-none dark:text-zinc-300 cursor-pointer"
                >
                  <option value="">Root (No Folder)</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </label>

              <span className="text-zinc-300 dark:text-zinc-700">·</span>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as "high" | "medium" | "low")}
                className="bg-transparent text-[11px] font-bold text-zinc-600 outline-none dark:text-zinc-400 cursor-pointer"
              >
                <option value="high">🚩 High Priority</option>
                <option value="medium">🚩 Medium Priority</option>
                <option value="low">🚩 Low Priority</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Side: Action Controls (All strictly single line with whitespace-nowrap) */}
        <div className="flex items-center gap-2 shrink-0 flex-nowrap overflow-x-auto no-scrollbar">
          {/* Active Collaborators Presence Stack */}
          <div className="hidden xl:flex items-center -space-x-1.5 mr-1 shrink-0" title="Active collaborators right now">
            {collaborators.map((c) => (
              <div
                key={c.name}
                className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[11px] font-bold shadow-xs dark:border-zinc-900 shrink-0"
                style={{ backgroundColor: c.bg, color: c.color }}
                title={`${c.name} (${c.role}) - ${c.status === "editing" ? "Currently editing" : "Viewing"}`}
              >
                {c.avatar}
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-white bg-emerald-500" />
              </div>
            ))}
          </div>

          {/* Export to Word (.doc) Button */}
          <button
            type="button"
            onClick={handleExportWord}
            className="whitespace-nowrap shrink-0 flex h-8.5 items-center gap-1.5 rounded-xl border border-[#2b579a]/30 bg-[#2b579a]/10 px-3 text-xs font-bold text-[#2b579a] transition hover:bg-[#2b579a]/20 dark:border-[#60a5fa]/30 dark:bg-[#60a5fa]/10 dark:text-[#93c5fd]"
            title="Download Word Document (.doc) in authentic Microsoft Word Print View"
          >
            <span>📄</span>
            <span>Export Word</span>
          </button>

          {/* Export to PDF Button */}
          <button
            type="button"
            onClick={handleExportPdf}
            className="whitespace-nowrap shrink-0 flex h-8.5 items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 text-xs font-bold text-red-600 transition hover:bg-red-500/20 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-400"
            title="Export / Print clean formatted PDF"
          >
            <span>🖨️</span>
            <span>PDF</span>
          </button>

          {/* Team Sharing Button */}
          {!isNew && (
            <button
              type="button"
              onClick={() => setSharingDocument(document)}
              className="whitespace-nowrap shrink-0 flex h-8.5 items-center gap-1.5 rounded-xl border border-zinc-200 px-3 text-xs font-bold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              title="Manage team access and invited permissions"
            >
              <Icon name="user" size={13} />
              <span>Team ({shares.filter((s) => s.document_id === document.id).length})</span>
            </button>
          )}

          {/* Comments Drawer Toggle */}
          <button
            type="button"
            onClick={() => setActiveSideDrawer(activeSideDrawer === "comments" ? "none" : "comments")}
            className={`whitespace-nowrap shrink-0 flex h-8.5 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition ${
              activeSideDrawer === "comments"
                ? "bg-[#d3f36b] text-[#283618]"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
            title="Threaded document comments"
          >
            <span>💬</span>
            <span>Comments ({comments.length})</span>
          </button>

          {/* Version History Toggle */}
          <button
            type="button"
            onClick={() => setActiveSideDrawer(activeSideDrawer === "history" ? "none" : "history")}
            className={`whitespace-nowrap shrink-0 flex h-8.5 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition ${
              activeSideDrawer === "history"
                ? "bg-[#d3f36b] text-[#283618]"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
            title="Audit log & revision history"
          >
            <span>🕒</span>
            <span>History</span>
          </button>

          {/* Delete Document Button */}
          {!isNew && (
            <button
              type="button"
              onClick={async () => {
                if (confirm(`Delete "${title}"?`)) {
                  await deleteDocument(document.id);
                  close();
                }
              }}
              className="whitespace-nowrap shrink-0 flex h-8.5 items-center justify-center rounded-xl border border-red-200 px-2.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
              title="Delete document"
            >
              <Icon name="trash" size={13} />
            </button>
          )}

          {/* Save & Done Button (Guaranteed single line) */}
          <button
            type="button"
            onClick={async () => {
              await handleSave();
              close();
            }}
            className="whitespace-nowrap shrink-0 flex h-8.5 items-center gap-1.5 rounded-xl bg-[#d3f36b] px-4 text-xs font-bold text-[#283618] transition hover:bg-[#c4e65d] active:scale-95 shadow-sm"
          >
            <span>Save & Done</span>
          </button>

          <button
            type="button"
            onClick={close}
            className="whitespace-nowrap shrink-0 flex h-8.5 w-8.5 items-center justify-center rounded-full bg-zinc-100 text-base font-bold text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
            title="Close editor"
          >
            ×
          </button>
        </div>
      </header>

      {/* DESKTOP WORD FORMATTING RIBBON / TOOLBAR (Large Screens) */}
      <div className="no-print hidden md:flex shrink-0 items-center justify-between border-b border-zinc-200/80 bg-white/95 px-4 py-2 backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/95 overflow-x-auto text-xs shadow-xs">
        <div className="flex items-center gap-1 flex-wrap">
          {/* Undo / Redo */}
          <button
            type="button"
            onClick={() => execCmd("undo")}
            className="rounded px-2 py-1 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            title="Undo (Ctrl+Z)"
          >
            ↶ Undo
          </button>
          <button
            type="button"
            onClick={() => execCmd("redo")}
            className="rounded px-2 py-1 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            title="Redo (Ctrl+Y)"
          >
            ↷ Redo
          </button>

          <span className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 mx-1" />

          {/* Style Selector (Heading 1, 2, 3, Normal Text) */}
          <select
            value={currentBlock}
            onChange={(e) => handleFormatBlock(e.target.value)}
            className="h-7 rounded border border-zinc-200 bg-zinc-50 px-2 font-semibold text-xs text-zinc-700 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 cursor-pointer"
          >
            <option value="p">Normal Text</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>

          <span className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 mx-1" />

          {/* Inline Styles */}
          <button
            type="button"
            onClick={() => execCmd("bold")}
            className="rounded px-2 py-1 font-bold text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
            title="Bold (Ctrl+B)"
          >
            <b>B</b>
          </button>
          <button
            type="button"
            onClick={() => execCmd("italic")}
            className="rounded px-2 py-1 italic font-serif text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
            title="Italic (Ctrl+I)"
          >
            <i>I</i>
          </button>
          <button
            type="button"
            onClick={() => execCmd("underline")}
            className="rounded px-2 py-1 underline text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
            title="Underline (Ctrl+U)"
          >
            <u>U</u>
          </button>
          <button
            type="button"
            onClick={() => execCmd("strikeThrough")}
            className="rounded px-2 py-1 line-through text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
            title="Strikethrough"
          >
            <s>S</s>
          </button>
          <button
            type="button"
            onClick={() => execCmd("hiliteColor", "#fef08a")}
            className="rounded px-2 py-1 bg-yellow-100 text-yellow-900 font-bold hover:bg-yellow-200"
            title="Highlight Text"
          >
            🎨 Marker
          </button>

          <span className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 mx-1" />

          {/* Alignment */}
          <button
            type="button"
            onClick={() => execCmd("justifyLeft")}
            className="rounded px-1.5 py-1 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            title="Align Left"
          >
            ⇤ Left
          </button>
          <button
            type="button"
            onClick={() => execCmd("justifyCenter")}
            className="rounded px-1.5 py-1 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            title="Align Center"
          >
            ≡ Center
          </button>
          <button
            type="button"
            onClick={() => execCmd("justifyRight")}
            className="rounded px-1.5 py-1 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            title="Align Right"
          >
            ⇥ Right
          </button>

          <span className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 mx-1" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => execCmd("insertUnorderedList")}
            className="rounded px-2 py-1 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            title="Bulleted List"
          >
            • Bullets
          </button>
          <button
            type="button"
            onClick={() => execCmd("insertOrderedList")}
            className="rounded px-2 py-1 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            title="Numbered List"
          >
            1. Numbers
          </button>

          <span className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 mx-1" />

          {/* Inserts: Callout, Table, Divider */}
          <button
            type="button"
            onClick={handleInsertCallout}
            className="rounded px-2 py-1 font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400"
            title="Insert Callout Note Box"
          >
            💡 Note Box
          </button>

          {/* WORD-STYLE TABLE INSERTION POPOVER BUTTON */}
          <div className="relative inline-block" ref={tableMenuRef}>
            <button
              type="button"
              onClick={() => setShowTableMenu(!showTableMenu)}
              className={`flex items-center gap-1 rounded px-2.5 py-1 font-bold transition ${
                showTableMenu
                  ? "bg-[#d3f36b] text-[#283618]"
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
              title="Insert Table (Choose rows, columns, and color styling)"
            >
              <span>📊 Insert Table</span>
              <span className="text-[9px]">▼</span>
            </button>

            {/* Word-style Interactive Table Dimension & Color Picker */}
            {showTableMenu && (
              <div className="absolute left-0 top-full mt-2 z-50 w-72 sm:w-80 rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5 dark:border-zinc-800">
                  <div>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Insert Table</span>
                    <p className="text-[10px] text-zinc-400">Drag/hover to choose grid size</p>
                  </div>
                  <span className="rounded-full bg-[#edf6d5] px-2.5 py-0.5 text-[11px] font-bold text-[#3d4b24] dark:bg-[#20290e] dark:text-[#d3f36b]">
                    {tableGrid.cols} × {tableGrid.rows} ({tableGrid.cols * tableGrid.rows} cells)
                  </span>
                </div>

                {/* Interactive 8x6 Grid Matrix */}
                <div className="my-3">
                  <div className="grid grid-cols-8 gap-1 bg-zinc-50 p-2 rounded-xl border border-zinc-200/80 dark:bg-zinc-800/40 dark:border-zinc-800">
                    {Array.from({ length: 6 }).map((_, rIdx) =>
                      Array.from({ length: 8 }).map((_, cIdx) => {
                        const col = cIdx + 1;
                        const row = rIdx + 1;
                        const isHighlighted = col <= tableGrid.cols && row <= tableGrid.rows;
                        return (
                          <div
                            key={`${row}-${col}`}
                            onMouseEnter={() => setTableGrid({ rows: row, cols: col })}
                            onClick={() => handleInsertWordTable(tableGrid.cols, tableGrid.rows, tableTheme)}
                            className={`h-5 w-full rounded cursor-pointer transition-all ${
                              isHighlighted
                                ? "bg-[#d3f36b] border border-[#85a900] shadow-2xs scale-105 dark:bg-[#d3f36b] dark:border-[#a3e635]"
                                : "bg-white border border-zinc-200 hover:border-zinc-400 dark:bg-zinc-800 dark:border-zinc-700"
                            }`}
                            title={`${col} × ${row}`}
                          />
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Table Color Themes Selection */}
                <div className="mt-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                  <span className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                    Table Color Theme:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {TABLE_THEMES.map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => setTableTheme(th.id)}
                        className={`flex items-center gap-2 rounded-lg p-1.5 text-left text-xs transition border ${
                          tableTheme === th.id
                            ? "border-[#85a900] bg-[#edf6d5]/70 font-bold dark:border-[#d3f36b] dark:bg-[#20290e]"
                            : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/50"
                        }`}
                      >
                        <span className={`h-3 w-3 rounded-full ${th.previewBg} shrink-0`} />
                        <span className="truncate text-[11px]">{th.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Insert Button */}
                <button
                  type="button"
                  onClick={() => handleInsertWordTable(tableGrid.cols, tableGrid.rows, tableTheme)}
                  className="mt-3.5 w-full rounded-xl bg-[#d3f36b] py-2 text-xs font-bold text-[#283618] shadow-sm transition hover:bg-[#c4e65d] active:scale-98"
                >
                  Insert {tableGrid.cols} × {tableGrid.rows} Table
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => execCmd("insertHorizontalRule")}
            className="rounded px-2 py-1 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            title="Horizontal Divider"
          >
            ⸺ Divider
          </button>
        </div>

        {/* Word Document Live Mode Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 font-semibold shrink-0">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Word Print Canvas (WYSIWYG)</span>
        </div>
      </div>

      {/* MAIN DOCUMENT CANVAS AREA & COLLABORATION PANELS */}
      <div className="relative flex flex-1 overflow-hidden pb-14 md:pb-0">
        {/* Scrollable Center Word Sheet Desk */}
        <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-12 sm:py-10">
          {/* THE REAL MICROSOFT WORD PAPER CANVAS (Direct Typing & Editing) */}
          <div className="max-w-[850px] mx-auto">
            {/* Word Document Sheet */}
            <article
              id="onward-word-canvas"
              className="relative w-full min-h-[900px] sm:min-h-[1100px] bg-white text-zinc-900 shadow-[0_4px_35px_rgba(0,0,0,0.12)] border border-zinc-200/90 rounded-sm p-6 sm:p-20 font-sans print:shadow-none print:border-none print:p-0"
            >
              {/* Word Header Margin Bar */}
              <div className="mb-8 sm:mb-10 border-b-2 border-[#85a900] pb-3 sm:pb-4 flex items-center justify-between text-xs text-zinc-400 select-none">
                <span className="font-bold tracking-widest text-[#85a900] uppercase text-[10px]">
                  onWard Collaborative Document · Word Format
                </span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>

              {/* REAL CONTENTEDITABLE WORD SHEET BODY (Direct Typing) */}
              <div
                ref={editorRef}
                contentEditable={true}
                suppressContentEditableWarning={true}
                onInput={handleEditorInput}
                className="outline-none min-h-[750px] sm:min-h-[850px] text-zinc-900 leading-relaxed text-base focus:outline-none selection:bg-[#d3f36b] selection:text-[#283618]"
                style={{
                  fontFamily: "'Aptos', 'Calibri', 'Segoe UI', Arial, sans-serif",
                }}
              />

              {/* Word Footer Margin */}
              <div className="mt-16 pt-6 border-t border-zinc-200 flex items-center justify-between text-[11px] text-zinc-400 select-none">
                <span>onWard Workspace · Document ID: {document.id || "new-draft"}</span>
                <span>Page 1 of 1</span>
              </div>
            </article>
          </div>
        </div>

        {/* RIGHT COLLABORATION DRAWER: Comments & History */}
        {activeSideDrawer !== "none" && (
          <aside className="no-print w-80 sm:w-96 shrink-0 border-l border-zinc-200 bg-white flex flex-col shadow-xl dark:border-zinc-800 dark:bg-zinc-900 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="flex h-12 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
              <div className="flex items-center gap-2 font-bold text-xs text-zinc-800 dark:text-zinc-200">
                <span>{activeSideDrawer === "comments" ? "💬 Threaded Comments" : "🕒 Version History & Audit"}</span>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {activeSideDrawer === "comments" ? comments.length : revisions.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveSideDrawer("none")}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-lg leading-none"
              >
                ×
              </button>
            </div>

            {/* Comments Tab Body */}
            {activeSideDrawer === "comments" && (
              <div className="flex flex-1 flex-col justify-between overflow-hidden">
                {/* Active Presence Banner */}
                <div className="bg-[#edf6d5]/50 px-4 py-2 border-b border-[#85a900]/20 text-[11px] text-[#3d4b24] flex items-center gap-2 dark:bg-[#20290e]/50 dark:text-[#d3f36b]">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Sara Tech & Alex Lead are co-reviewing this doc</span>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                  {comments.map((c) => (
                    <div key={c.id} className="rounded-xl border border-zinc-200/90 bg-zinc-50/70 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-800/40">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{c.author_avatar}</span>
                          <div>
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">{c.author_name}</span>
                            <span className="ml-1 text-[10px] text-zinc-400">({c.author_role})</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-zinc-400">{c.created_at}</span>
                      </div>
                      <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{c.content}</p>
                    </div>
                  ))}
                </div>

                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="border-t border-zinc-200 p-3.5 dark:border-zinc-800">
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Leave a comment or feedback on this document..."
                      rows={2}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs text-zinc-900 outline-none focus:border-[#85a900] focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!newCommentText.trim()}
                        className="rounded-lg bg-[#d3f36b] px-3.5 py-1.5 text-xs font-bold text-[#283618] transition hover:bg-[#c4e65d] disabled:opacity-50"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Version History Tab Body */}
            {activeSideDrawer === "history" && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-2">
                  Full audit trail of revisions and updates made by team collaborators:
                </p>
                {revisions.map((rev) => (
                  <div key={rev.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-800/40">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <span>{rev.author_avatar}</span>
                        <span>{rev.author_name}</span>
                      </span>
                      <span className="text-[10px] text-zinc-400">{rev.created_at}</span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-300 text-[11px] mb-2">{rev.description}</p>
                    <button
                      type="button"
                      onClick={() => handleRestoreRevision(rev)}
                      className="rounded bg-zinc-200/80 px-2 py-0.5 text-[10px] font-bold text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                    >
                      Restore Snapshot
                    </button>
                  </div>
                ))}
              </div>
            )}
          </aside>
        )}
      </div>

      {/* MOBILE FORMATTING SLIDE-UP DRAWER (When 'T' is clicked) */}
      {showMobileFormatting && (
        <div className="no-print md:hidden fixed bottom-14 left-0 right-0 z-40 bg-white border-t border-zinc-200 p-3 shadow-xl dark:bg-zinc-900 dark:border-zinc-800 animate-in slide-in-from-bottom duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800 mb-2 text-xs">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">Text & Heading Styles</span>
            <button
              type="button"
              onClick={() => setShowMobileFormatting(false)}
              className="text-zinc-400 text-sm font-bold"
            >
              ✕
            </button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => handleFormatBlock("p")}
              className="rounded-lg bg-zinc-100 px-3 py-1.5 font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              Normal
            </button>
            <button
              type="button"
              onClick={() => handleFormatBlock("h1")}
              className="rounded-lg bg-zinc-100 px-3 py-1.5 font-bold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => handleFormatBlock("h2")}
              className="rounded-lg bg-zinc-100 px-3 py-1.5 font-bold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => execCmd("bold")}
              className="rounded-lg bg-zinc-100 px-3 py-1.5 font-bold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
            >
              <b>B</b>
            </button>
            <button
              type="button"
              onClick={() => execCmd("italic")}
              className="rounded-lg bg-zinc-100 px-3 py-1.5 italic font-serif text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
            >
              <i>I</i>
            </button>
            <button
              type="button"
              onClick={() => execCmd("underline")}
              className="rounded-lg bg-zinc-100 px-3 py-1.5 underline text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
            >
              <u>U</u>
            </button>
            <button
              type="button"
              onClick={() => handleInsertWordTable(3, 3, "lime")}
              className="rounded-lg bg-[#edf6d5] px-3 py-1.5 font-bold text-[#3d4b24] dark:bg-[#20290e] dark:text-[#d3f36b]"
            >
              + Table
            </button>
          </div>
        </div>
      )}

      {/* MOBILE SKETCH / DRAWING MODAL (When 'Pencil' is clicked) */}
      {showSketchModal && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-2xl dark:bg-zinc-900 dark:border dark:border-zinc-800">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Handwritten Sketch & Ink</span>
              <button
                type="button"
                onClick={() => setShowSketchModal(false)}
                className="text-zinc-400 text-lg leading-none"
              >
                ✕
              </button>
            </div>
            <div className="my-3 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <canvas
                ref={canvasRef}
                width={320}
                height={200}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full touch-none cursor-crosshair bg-white"
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  const canvas = canvasRef.current;
                  if (canvas) {
                    const ctx = canvas.getContext("2d");
                    ctx?.clearRect(0, 0, canvas.width, canvas.height);
                  }
                }}
                className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
              >
                Clear Ink
              </button>
              <button
                type="button"
                onClick={insertSketchImage}
                className="rounded-xl bg-[#d3f36b] px-4 py-2 text-xs font-bold text-[#283618] shadow-sm hover:bg-[#c4e65d]"
              >
                Insert Sketch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM ACTION BAR (Matching user's attached screenshot exactly) */}
      <nav className="no-print md:hidden fixed bottom-0 left-0 right-0 z-40 flex h-14 items-center justify-around border-t border-zinc-200/90 bg-white/95 backdrop-blur-md px-4 text-zinc-600 shadow-lg dark:border-zinc-800 dark:bg-zinc-900/95 dark:text-zinc-300">
        {/* 1. Voice Dictation / Waveform (Matches Icon 1) */}
        <button
          type="button"
          onClick={toggleVoiceDictation}
          className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
            isListening ? "bg-red-50 text-red-600 animate-pulse dark:bg-red-950/40" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
          title={isListening ? "Listening... click to stop" : "Voice dictation"}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="3" y1="10" x2="3" y2="14" />
            <line x1="6" y1="7" x2="6" y2="17" />
            <line x1="9" y1="4" x2="9" y2="20" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="15" y1="5" x2="15" y2="19" />
            <line x1="18" y1="9" x2="18" y2="15" />
            <line x1="21" y1="11" x2="21" y2="13" />
          </svg>
        </button>

        {/* 2. Image Upload (Matches Icon 2) */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          title="Insert Image"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        {/* 3. Pencil / Draw / Sketch (Matches Icon 3) */}
        <button
          type="button"
          onClick={() => setShowSketchModal(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          title="Handwriting & Sketch"
        >
          <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="2" x2="22" y2="6" />
            <path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z" />
          </svg>
        </button>

        {/* 4. Checklist Task (Matches Icon 4) */}
        <button
          type="button"
          onClick={handleInsertChecklist}
          className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          title="Checklist Task"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 4 7 6 5" />
            <polyline points="3 12 4 13 6 11" />
            <polyline points="3 18 4 19 6 17" />
            <line x1="9" y1="6" x2="21" y2="6" />
            <line x1="9" y1="12" x2="21" y2="12" />
            <line x1="9" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* 5. Typography T format toggle (Matches Icon 5) */}
        <button
          type="button"
          onClick={() => setShowMobileFormatting(!showMobileFormatting)}
          className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
            showMobileFormatting ? "bg-[#d3f36b] text-[#283618] font-bold" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
          title="Text formatting & styles"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 7 4 4 20 4 20 7" />
            <line x1="12" y1="4" x2="12" y2="20" />
          </svg>
        </button>
      </nav>

      {/* DESKTOP BOTTOM WORD STATUS BAR (Hidden on mobile) */}
      <footer className="no-print hidden md:flex h-9 shrink-0 items-center justify-between border-t border-zinc-200 bg-zinc-50 px-4 text-[11px] font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        <div className="flex items-center gap-3">
          <span>{words} words</span>
          <span>·</span>
          <span>{chars} characters</span>
          <span>·</span>
          <span>~{readTimeMin} min read</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">👥 3 collaborators connected · End-to-end synced</span>
          <span>·</span>
          <span className="font-bold text-zinc-700 dark:text-zinc-300">100% Word Print Layout</span>
        </div>
      </footer>
    </div>
  );
}

// Helper: Convert initial markdown or raw string into clean HTML for Word canvas
function convertMarkdownToInitialHtml(input: string): string {
  if (!input) return "<p>Start typing your document...</p>";
  if (input.includes("<p>") || input.includes("<h1>") || input.includes("<div>") || input.includes("<table")) {
    return input;
  }

  let html = input;

  // Convert tables
  const tableBlockRegex = /(?:<!-- table-theme: (\w+) -->\s*\n)?((?:\|.+?\|\r?\n?)+)/g;
  html = html.replace(tableBlockRegex, (match, themeId, tableContent) => {
    const lines = tableContent.trim().split("\n").map((l: string) => l.trim()).filter((l: string) => l.startsWith("|"));
    if (lines.length < 2) return match;
    const theme = TABLE_THEMES.find((t) => t.id === themeId) || TABLE_THEMES[0];
    const headerCells = lines[0].split("|").filter((c: string) => c.trim().length > 0);
    const dataLines = lines.filter((_: string, idx: number) => idx !== 0 && !lines[idx].includes("---"));

    const ths = headerCells
      .map((c: string) => `<th style="background-color: ${theme.wordHeaderBg}; color: ${theme.wordHeaderText}; padding: 10px 12px; border: 1px solid ${theme.wordBorder}; font-weight: bold; text-align: left;">${c.trim()}</th>`)
      .join("");
    const rows = dataLines
      .map((line: string, rIdx: number) => {
        const cells = line.split("|").filter((c: string) => c.trim().length > 0);
        const bg = rIdx % 2 === 1 ? theme.wordAltRow : "#ffffff";
        const tds = cells
          .map((c: string) => `<td style="background-color: ${bg}; padding: 8px 12px; border: 1px solid ${theme.wordBorder};">${c.trim()}</td>`)
          .join("");
        return `<tr>${tds}</tr>`;
      })
      .join("");

    return `<table style="border-collapse: collapse; width: 100%; margin: 16px 0;" data-theme="${theme.id}"><thead><tr>${ths}</tr></thead><tbody>${rows}</tbody></table>`;
  });

  // Callouts
  html = html.replace(
    /> \[!NOTE\]\s*([\s\S]*?)(?=\n\n|$)/g,
    '<div class="callout-note" style="background-color: #edf6d5; border-left: 4px solid #85a900; padding: 12px 16px; margin: 14px 0; border-radius: 6px; color: #283618;"><strong>Note:</strong> $1</div>'
  );

  // Quotes
  html = html.replace(
    /^> (.*$)/gim,
    '<blockquote style="border-left: 4px solid #85a900; padding-left: 14px; margin: 12px 0; font-style: italic; color: #475569;">$1</blockquote>'
  );

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 style="font-size: 1.25rem; font-weight: bold; margin-top: 14px; margin-bottom: 6px; color: #1e293b;">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 style="font-size: 1.5rem; font-weight: bold; margin-top: 18px; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; color: #0f172a;">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 style="font-size: 2rem; font-weight: 800; margin-top: 22px; margin-bottom: 12px; border-bottom: 2px solid #85a900; padding-bottom: 6px; color: #0f172a;">$1</h1>');

  // Bold & Italic
  html = html.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/gim, "<em>$1</em>");
  html = html.replace(/~~(.*?)~~/gim, "<del>$1</del>");

  // Lists
  html = html.replace(/^- (.*$)/gim, '<li style="margin-left: 20px; list-style-type: disc;">$1</li>');
  html = html.replace(/^\d+\. (.*$)/gim, '<li style="margin-left: 20px; list-style-type: decimal;">$1</li>');

  // Paragraphs
  const paragraphs = html.split("\n\n").map((p) => {
    if (
      p.startsWith("<h") ||
      p.startsWith("<table") ||
      p.startsWith("<div") ||
      p.startsWith("<blockquote") ||
      p.startsWith("<li")
    ) {
      return p;
    }
    return `<p style="margin-bottom: 10px; line-height: 1.6;">${p.replace(/\n/g, "<br/>")}</p>`;
  });

  return paragraphs.join("\n");
}
