"use client";

import { useMemo, useState } from "react";
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

  // Live formatted timestamp matching: "26 October 1:48 PM"
  const nowStr = useMemo(() => {
    const now = new Date();
    const dayMonth = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long" }).format(now);
    const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).format(now);
    return `${dayMonth} ${time}`;
  }, []);

  const totalChars = title.length + details.length;

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

  function handleSaveAndExit() {
    const finalTitle = title.trim() || (details.trim().slice(0, 40) || "Untitled Note");
    void saveTask({
      ...note,
      title: finalTitle,
      details: details.trim() || null,
    });
    onClose();
  }

  function insertMindMap() {
    const template = `\n🧠 Mind Map Outline:\n• Central Idea\n  ├─ Branch 1: Key Focus\n  └─ Branch 2: Action Steps\n`;
    const nextDetails = details ? `${details}\n${template}` : template;
    setDetails(nextDetails);
    pushHistory(title, nextDetails);
  }

  function insertChecklist() {
    const next = `${details ? `${details}\n` : ""}- [ ] `;
    setDetails(next);
    pushHistory(title, next);
  }

  function insertTextFormat() {
    const next = `${details ? `${details}\n` : ""}# `;
    setDetails(next);
    pushHistory(title, next);
  }

  function insertImagePlaceholder() {
    const next = `${details ? `${details}\n` : ""}[📷 Photo attachment]`;
    setDetails(next);
    pushHistory(title, next);
  }

  function insertDrawPlaceholder() {
    const next = `${details ? `${details}\n` : ""}[✏️ Sketch note]`;
    setDetails(next);
    pushHistory(title, next);
  }

  function handleSpeech() {
    const SpeechRecognitionConst =
      typeof window === "undefined"
        ? undefined
        : (window as Window & { SpeechRecognition?: VoiceRecognitionConstructor; webkitSpeechRecognition?: VoiceRecognitionConstructor }).SpeechRecognition ||
          (window as Window & { webkitSpeechRecognition?: VoiceRecognitionConstructor }).webkitSpeechRecognition;
    if (!SpeechRecognitionConst) return;
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

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100">
      {/* Top Navigation Bar */}
      <header className="flex h-14 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
        <button
          type="button"
          onClick={handleSaveAndExit}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-700 transition hover:bg-zinc-100 active:scale-95 dark:text-zinc-300 dark:hover:bg-zinc-800"
          aria-label="Back to notes"
        >
          <Icon name="backArrow" size={20} />
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyIndex === 0}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-30 dark:text-zinc-300 dark:hover:bg-zinc-800"
            aria-label="Undo"
          >
            <Icon name="undo" size={20} />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-30 dark:text-zinc-300 dark:hover:bg-zinc-800"
            aria-label="Redo"
          >
            <Icon name="redo" size={20} />
          </button>
          <button
            type="button"
            onClick={handleSaveAndExit}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-emerald-600 transition hover:bg-emerald-50 active:scale-95 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
            aria-label="Save note"
          >
            <Icon name="check" size={22} />
          </button>
        </div>
      </header>

      {/* Note Editor Body Content */}
      <div className="flex flex-1 flex-col overflow-y-auto px-6 py-5">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full border-0 bg-transparent text-2xl font-bold tracking-tight text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-600"
        />

        <div className="mt-2 text-xs font-medium text-zinc-400 dark:text-zinc-500">
          {nowStr} | {totalChars} characters
        </div>

        <button
          type="button"
          onClick={insertMindMap}
          className="mt-3.5 inline-flex w-fit items-center gap-1.5 rounded-full border border-[#b8e85e] bg-[#f4ffe0] px-3.5 py-1.5 text-xs font-semibold text-[#496612] shadow-sm transition hover:bg-[#ebfbc7] active:scale-95 dark:border-[#496612] dark:bg-[#1f280a] dark:text-[#d3f36b]"
        >
          <Icon name="mindmap" size={15} />
          <span>Create a mind map</span>
        </button>

        <textarea
          placeholder="Start typing"
          value={details}
          onChange={(e) => handleDetailsChange(e.target.value)}
          autoFocus
          className="mt-4 flex-1 resize-none border-0 bg-transparent text-base leading-relaxed text-zinc-800 outline-none placeholder:text-zinc-400 dark:text-zinc-200 dark:placeholder:text-zinc-600"
        />
      </div>

      {/* Bottom Tool Bar */}
      <footer className="flex h-14 items-center justify-around border-t border-zinc-200 px-4 dark:border-zinc-800">
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
          onClick={insertDrawPlaceholder}
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
          onClick={insertTextFormat}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-zinc-100 active:scale-95 dark:text-zinc-400 dark:hover:bg-zinc-800"
          aria-label="Heading format"
        >
          <Icon name="textFormat" size={22} />
        </button>
      </footer>
    </div>
  );
}
