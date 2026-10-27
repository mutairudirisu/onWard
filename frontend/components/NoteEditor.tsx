"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { useTasks, type Task } from "@/lib/task-context";

type VoiceResultEvent = { results: ArrayLike<{ [index: number]: { transcript: string } }> };
type VoiceRecognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: VoiceResultEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};
type VoiceRecognitionConstructor = new () => VoiceRecognition;

export function NoteEditor({
  note,
  onClose,
}: {
  note: Task;
  onClose: () => void;
}) {
  const { saveTask } = useTasks();
  const [title, setTitle] = useState(note.title);
  const [details, setDetails] = useState(note.details || "");
  const [history, setHistory] = useState<{ title: string; details: string }[]>([
    { title: note.title, details: note.details || "" },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "editing">("saved");

  // Sketch modal state
  const [isSketchModalOpen, setIsSketchModalOpen] = useState(false);
  const [penColor, setPenColor] = useState<string>("#25282b");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  // File upload input ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Live formatted timestamp matching: "27 October 2:08 PM"
  const nowStr = useMemo(() => {
    const now = new Date();
    const dayMonth = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long" }).format(now);
    const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).format(now);
    return `${dayMonth} ${time}`;
  }, []);

  const totalChars = title.length + details.length;
  const wordCount = details.trim() ? details.trim().split(/\s+/).length : 0;

  // Auto-save debounce effect indicator
  useEffect(() => {
    setSaveStatus("editing");
    const timer = setTimeout(() => {
      setSaveStatus("saved");
    }, 800);
    return () => clearTimeout(timer);
  }, [title, details]);

  // Push state to undo/redo history
  function pushHistory(newTitle: string, newDetails: string) {
    const updated = history.slice(0, historyIndex + 1);
    updated.push({ title: newTitle, details: newDetails });
    setHistory(updated);
    setHistoryIndex(updated.length - 1);
  }

  function handleTitleChange(val: string) {
    setTitle(val);
    pushHistory(val, details);
  }

  function handleDetailsChange(val: string) {
    setDetails(val);
    pushHistory(title, val);
  }

  function handleUndo() {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setTitle(prev.title);
      setDetails(prev.details);
    }
  }

  function handleRedo() {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setTitle(next.title);
      setDetails(next.details);
    }
  }

  async function handleSaveAndExit() {
    const finalTitle = title.trim() || (details.trim().slice(0, 40) || "Untitled Note");
    await saveTask({
      ...note,
      title: finalTitle,
      details: details.trim() || null,
    });
    onClose();
  }

  const handleSaveAndExitRef = useRef(handleSaveAndExit);
  handleSaveAndExitRef.current = handleSaveAndExit;
  const handleUndoRef = useRef(handleUndo);
  handleUndoRef.current = handleUndo;
  const handleRedoRef = useRef(handleRedo);
  handleRedoRef.current = handleRedo;

  // Keyboard shortcuts (Escape to save & close, Ctrl+Z undo, Ctrl+Y redo, Ctrl+S save)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        void handleSaveAndExitRef.current();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void handleSaveAndExitRef.current();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndoRef.current();
      } else if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "z")
      ) {
        e.preventDefault();
        handleRedoRef.current();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Insert helpers
  function insertMindMap() {
    const template = `\n🧠 Mind Map Outline:\n• Central Idea\n  ├─ Branch 1: Key Focus\n  └─ Branch 2: Action Steps\n`;
    const nextDetails = details ? `${details}\n${template}` : template;
    setDetails(nextDetails);
    pushHistory(title, nextDetails);
    textareaRef.current?.focus();
  }

  function insertChecklist() {
    const next = `${details ? `${details}\n` : ""}- [ ] `;
    setDetails(next);
    pushHistory(title, next);
    textareaRef.current?.focus();
  }

  function insertHeading(level: 1 | 2) {
    const prefix = level === 1 ? "# " : "## ";
    const next = `${details ? `${details}\n` : ""}${prefix}`;
    setDetails(next);
    pushHistory(title, next);
    textareaRef.current?.focus();
  }

  function insertBullet() {
    const next = `${details ? `${details}\n` : ""}• `;
    setDetails(next);
    pushHistory(title, next);
    textareaRef.current?.focus();
  }

  function insertNumberedList() {
    const next = `${details ? `${details}\n` : ""}1. `;
    setDetails(next);
    pushHistory(title, next);
    textareaRef.current?.focus();
  }

  function insertBold() {
    const next = `${details ? `${details} ` : ""}**bold text** `;
    setDetails(next);
    pushHistory(title, next);
    textareaRef.current?.focus();
  }

  function insertQuote() {
    const next = `${details ? `${details}\n` : ""}> `;
    setDetails(next);
    pushHistory(title, next);
    textareaRef.current?.focus();
  }

  function insertImagePlaceholder() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      const next = `${details ? `${details}\n` : ""}[📷 Photo attachment]`;
      setDetails(next);
      pushHistory(title, next);
    }
  }

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const label = `[📷 Photo: ${file.name}]`;
    const next = `${details ? `${details}\n` : ""}${label}\n`;
    setDetails(next);
    pushHistory(title, next);
    e.target.value = "";
  }

  function openSketchPad() {
    setIsSketchModalOpen(true);
  }

  function handleSpeech() {
    const SpeechRecognitionConst =
      typeof window === "undefined"
        ? undefined
        : (
            window as Window & {
              SpeechRecognition?: VoiceRecognitionConstructor;
              webkitSpeechRecognition?: VoiceRecognitionConstructor;
            }
          ).SpeechRecognition ||
          (window as Window & { webkitSpeechRecognition?: VoiceRecognitionConstructor })
            .webkitSpeechRecognition;

    if (!SpeechRecognitionConst) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionConst();
    recognition.lang = navigator.language || "en-US";
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      if (transcript) {
        const next = details ? `${details} ${transcript}` : transcript;
        setDetails(next);
        pushHistory(title, next);
      }
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    setIsListening(true);
    recognition.start();
  }

  const handleCopyNote = async () => {
    const textToCopy = `${title ? `${title}\n\n` : ""}${details}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch {
      // ignore
    }
  };

  // Sketch Drawing Functions
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
    ctx.strokeStyle = penColor;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSketchToNote = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const sketchTag = `\n[✏️ Sketch drawing · ${timeStr}]\n`;
    const next = `${details ? `${details}\n` : ""}${sketchTag}`;
    setDetails(next);
    pushHistory(title, next);
    setIsSketchModalOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#f8faf7] text-zinc-900 transition-colors dark:bg-[#0c0e12] dark:text-zinc-100 min-[761px]:left-[240px] shadow-2xl overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Note Editor"
    >
      {/* Hidden file input for photo attachments */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelected}
      />

      {/* ========================================================
          TOP NAVIGATION HEADER (Mobile + Desktop Responsive)
          ======================================================== */}
      <header className="flex h-14 md:h-16 items-center justify-between border-b border-zinc-200/90 bg-white/95 px-4 sm:px-6 md:px-8 backdrop-blur-md dark:border-zinc-800/90 dark:bg-zinc-900/95 shrink-0">
        {/* Left: Back / Exit */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSaveAndExit}
            className="flex h-9 w-9 md:h-10 md:w-auto md:px-3 items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-100 active:scale-95 dark:border-zinc-750 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            aria-label="Back to notes"
            title="Back to notes (Esc)"
          >
            <Icon name="backArrow" size={18} />
            <span className="hidden md:inline text-xs font-semibold">Notes</span>
          </button>

          {/* Desktop Breadcrumb Tag */}
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            Personal Note
          </span>
        </div>

        {/* Center: Live Save Status (Visible on desktop) */}
        <div className="hidden md:flex items-center gap-2">
          {saveStatus === "editing" ? (
            <span className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Saved
            </span>
          )}
        </div>

        {/* Right: Actions (Undo, Redo, Copy, Save/Done) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyIndex === 0}
            className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-30 dark:text-zinc-300 dark:hover:bg-zinc-800"
            aria-label="Undo"
            title="Undo (Ctrl+Z)"
          >
            <Icon name="undo" size={19} />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-30 dark:text-zinc-300 dark:hover:bg-zinc-800"
            aria-label="Redo"
            title="Redo (Ctrl+Y)"
          >
            <Icon name="redo" size={19} />
          </button>

          {/* Desktop Copy Note button */}
          <button
            type="button"
            onClick={handleCopyNote}
            className="hidden md:flex h-10 items-center gap-1.5 rounded-xl border border-zinc-200 px-3 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            title="Copy note text to clipboard"
          >
            <Icon name="copy" size={15} />
            <span>{copyFeedback ? "Copied!" : "Copy"}</span>
          </button>

          {/* Primary Done / Save Button */}
          <button
            type="button"
            onClick={handleSaveAndExit}
            className="flex h-9 md:h-10 items-center gap-1.5 rounded-xl bg-[#d3f36b] px-3 md:px-4 text-xs font-bold text-[#283618] shadow-sm transition hover:bg-[#c4e65d] active:scale-95"
            aria-label="Save and close note"
          >
            <Icon name="check" size={18} />
            <span className="hidden sm:inline">Done</span>
          </button>
        </div>
      </header>

      {/* ========================================================
          DESKTOP FORMATTING RIBBON (Only on md: and larger screens)
          Conveniently placed directly above the writing canvas
          ======================================================== */}
      <div className="hidden md:flex items-center justify-between border-b border-zinc-200/90 bg-white/70 px-6 sm:px-8 py-2 text-xs backdrop-blur-xs dark:border-zinc-800/90 dark:bg-zinc-900/60 shrink-0">
        <div className="flex flex-wrap items-center gap-1">
          {/* Headings */}
          <button
            type="button"
            onClick={() => insertHeading(1)}
            className="flex h-7 items-center rounded-lg px-2 text-xs font-bold text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            title="Heading 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => insertHeading(2)}
            className="flex h-7 items-center rounded-lg px-2 text-xs font-bold text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            title="Heading 2"
          >
            H2
          </button>

          <span className="mx-1 h-4 w-px bg-zinc-200 dark:bg-zinc-750" />

          {/* Inline Styles */}
          <button
            type="button"
            onClick={insertBold}
            className="flex h-7 items-center rounded-lg px-2 text-xs font-bold text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            title="Bold text"
          >
            <b>B</b>
          </button>
          <button
            type="button"
            onClick={insertQuote}
            className="flex h-7 items-center rounded-lg px-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            title="Blockquote"
          >
            Quote
          </button>

          <span className="mx-1 h-4 w-px bg-zinc-200 dark:bg-zinc-750" />

          {/* Lists */}
          <button
            type="button"
            onClick={insertChecklist}
            className="flex h-7 items-center gap-1 rounded-lg px-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            title="Insert checklist item"
          >
            <Icon name="checklist" size={14} />
            <span>Checklist</span>
          </button>
          <button
            type="button"
            onClick={insertBullet}
            className="flex h-7 items-center gap-1 rounded-lg px-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            title="Bullet list"
          >
            <Icon name="list" size={14} />
            <span>Bullet</span>
          </button>
          <button
            type="button"
            onClick={insertNumberedList}
            className="flex h-7 items-center gap-1 rounded-lg px-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            title="Numbered list"
          >
            <span>1. List</span>
          </button>

          <span className="mx-1 h-4 w-px bg-zinc-200 dark:bg-zinc-750" />

          {/* Rich Elements */}
          <button
            type="button"
            onClick={insertMindMap}
            className="flex h-7 items-center gap-1.5 rounded-lg bg-[#edf6d5] px-2.5 text-xs font-bold text-[#354516] transition hover:bg-[#e2f1be] active:scale-95 dark:bg-[#1f280a] dark:text-[#d3f36b]"
            title="Generate Mind Map outline"
          >
            <Icon name="mindmap" size={13} />
            <span>Mind Map</span>
          </button>

          <button
            type="button"
            onClick={insertImagePlaceholder}
            className="flex h-7 items-center gap-1 rounded-lg px-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            title="Attach image"
          >
            <Icon name="image" size={14} />
            <span>Image</span>
          </button>

          <button
            type="button"
            onClick={openSketchPad}
            className="flex h-7 items-center gap-1 rounded-lg px-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            title="Open sketch drawing pad"
          >
            <Icon name="draw" size={14} />
            <span>Sketch</span>
          </button>

          <button
            type="button"
            onClick={handleSpeech}
            className={`flex h-7 items-center gap-1 rounded-lg px-2 text-xs font-medium transition ${
              isListening
                ? "bg-red-50 text-red-600 animate-pulse font-bold dark:bg-red-950/40"
                : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
            title="Speech to text dictation"
          >
            <Icon name="waveform" size={14} />
            <span>{isListening ? "Listening..." : "Dictate"}</span>
          </button>
        </div>

        {/* Right word count */}
        <div className="text-[11px] font-medium text-zinc-400">
          {wordCount} words · {totalChars} chars
        </div>
      </div>

      {/* ========================================================
          NOTE EDITOR BODY / WRITING CANVAS
          On Desktop: Centered notebook paper card with comfortable margins
          On Mobile: Edge-to-edge transparent canvas
          ======================================================== */}
      <div className="flex-1 overflow-y-auto px-4 py-4 md:py-6 lg:py-8">
        <div className="mx-auto w-full max-w-3xl xl:max-w-4xl flex-1 flex flex-col">
          {/* Desktop elevated paper canvas */}
          <div className="flex-1 flex flex-col rounded-2xl md:border md:border-zinc-200/90 md:bg-white p-2 sm:p-4 md:p-10 lg:p-12 md:shadow-xs dark:md:border-zinc-800/90 dark:md:bg-zinc-900 transition-all">
            {/* Title Input */}
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full border-0 bg-transparent text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-600"
            />

            {/* Note Metadata & Quick Mindmap Action */}
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3 dark:border-zinc-800/80">
              <div className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                {nowStr} | {totalChars} characters
              </div>

              {/* Mind map pill (matching mobile and desktop convenience) */}
              <button
                type="button"
                onClick={insertMindMap}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#b8e85e] bg-[#f4ffe0] px-3.5 py-1 text-xs font-semibold text-[#496612] shadow-xs transition hover:bg-[#ebfbc7] active:scale-95 dark:border-[#496612] dark:bg-[#1f280a] dark:text-[#d3f36b]"
              >
                <Icon name="mindmap" size={14} />
                <span>Create a mind map</span>
              </button>
            </div>

            {/* Note Textarea Content */}
            <textarea
              ref={textareaRef}
              placeholder="Start typing your note here..."
              value={details}
              onChange={(e) => handleDetailsChange(e.target.value)}
              autoFocus
              className="mt-4 flex-1 min-h-[360px] md:min-h-[460px] resize-none border-0 bg-transparent text-base sm:text-[16.5px] leading-relaxed text-zinc-800 outline-none placeholder:text-zinc-400 dark:text-zinc-200 dark:placeholder:text-zinc-600"
            />
          </div>
        </div>
      </div>

      {/* ========================================================
          MOBILE BOTTOM TOOLBAR (Hidden on larger screens md:)
          Matches the exact design in the mobile reference screenshot
          ======================================================== */}
      <footer className="md:hidden flex h-14 items-center justify-around border-t border-zinc-200/90 bg-white px-4 dark:border-zinc-800/90 dark:bg-zinc-950 shrink-0">
        <button
          type="button"
          onClick={handleSpeech}
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-zinc-100 active:scale-95 dark:text-zinc-400 dark:hover:bg-zinc-800 ${
            isListening ? "animate-pulse text-red-500" : ""
          }`}
          aria-label="Voice input"
        >
          <Icon name="waveform" size={22} />
        </button>
        <button
          type="button"
          onClick={insertImagePlaceholder}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-zinc-100 active:scale-95 dark:text-zinc-400 dark:hover:bg-zinc-800"
          aria-label="Insert image"
        >
          <Icon name="image" size={22} />
        </button>
        <button
          type="button"
          onClick={openSketchPad}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-zinc-100 active:scale-95 dark:text-zinc-400 dark:hover:bg-zinc-800"
          aria-label="Drawing note"
        >
          <Icon name="draw" size={22} />
        </button>
        <button
          type="button"
          onClick={insertChecklist}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-zinc-100 active:scale-95 dark:text-zinc-400 dark:hover:bg-zinc-800"
          aria-label="Insert checklist"
        >
          <Icon name="checklist" size={22} />
        </button>
        <button
          type="button"
          onClick={() => insertHeading(1)}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-zinc-100 active:scale-95 dark:text-zinc-400 dark:hover:bg-zinc-800"
          aria-label="Heading format"
        >
          <Icon name="textFormat" size={22} />
        </button>
      </footer>

      {/* ========================================================
          SKETCH NOTE DRAWING MODAL
          Allows drawing directly with finger or mouse stylus
          ======================================================== */}
      {isSketchModalOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsSketchModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Icon name="draw" size={17} />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Quick Sketch Pad
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSketchModalOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
              >
                ✕
              </button>
            </div>

            {/* Color selection */}
            <div className="my-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500">Select Ink Color:</span>
              <div className="flex items-center gap-2">
                {[
                  { color: "#25282b", label: "Charcoal" },
                  { color: "#85a900", label: "Lime" },
                  { color: "#2563eb", label: "Blue" },
                  { color: "#dc2626", label: "Red" },
                ].map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => setPenColor(c.color)}
                    style={{ backgroundColor: c.color }}
                    className={`h-6 w-6 rounded-full transition-transform active:scale-95 ${
                      penColor === c.color ? "ring-2 ring-offset-2 ring-zinc-500 scale-110" : ""
                    }`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {/* Canvas Box */}
            <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 touch-none dark:border-zinc-700 dark:bg-zinc-950">
              <canvas
                ref={canvasRef}
                width={480}
                height={260}
                className="w-full h-[260px] cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>

            {/* Modal Actions */}
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={clearCanvas}
                className="h-9 rounded-xl border border-zinc-200 px-3.5 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Clear Canvas
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSketchModalOpen(false)}
                  className="h-9 rounded-xl border border-zinc-200 px-3.5 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveSketchToNote}
                  className="flex h-9 items-center gap-1.5 rounded-xl bg-[#d3f36b] px-4 text-xs font-bold text-[#283618] shadow-sm transition hover:bg-[#c4e65d] active:scale-95"
                >
                  <span>Insert Sketch</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
