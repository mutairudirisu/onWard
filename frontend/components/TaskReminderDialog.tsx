"use client";

import { useState } from "react";
import { DraggableModal } from "@/components/DraggableModal";
import { ClockInput } from "@/components/ClockInput";
import { Icon } from "@/components/Icon";
import { useTasks, type Task, todayKey } from "@/lib/task-context";

export function TaskReminderDialog({
  task,
  close,
  onComplete,
}: {
  task?: Task | null;
  close: () => void;
  onComplete?: (task: Task) => void;
}) {
  const { tasks, saveTask, setNotice } = useTasks();
  const availableTasks = tasks.filter((t) => t.plan_type === "task");

  const [selectedTaskId, setSelectedTaskId] = useState<string>(() => {
    if (task?.id) return task.id;
    return availableTasks[0]?.id || "new";
  });

  const [newTaskTitle, setNewTaskTitle] = useState("");

  const targetTask = availableTasks.find((t) => t.id === selectedTaskId);

  // Extract initial reminder time and notes from targeted task details
  const extractReminder = (details: string | null) => {
    if (!details) return { time: "08:30 am", note: "" };
    const match = details.match(/^(\d{1,2}:\d{2}\s*(?:am|pm)?)(?:\s*·\s*(.*))?$/i);
    if (match) {
      return { time: match[1].trim(), note: (match[2] || "").trim() };
    }
    return { time: "08:30 am", note: details };
  };

  const initialParsed = extractReminder(targetTask?.details || null);
  const [clockTime, setClockTime] = useState(initialParsed.time);
  const [reminderDate, setReminderDate] = useState(targetTask?.due_date || todayKey());
  const [reminderNote, setReminderNote] = useState(initialParsed.note);

  // Handle task target switch
  const handleSelectTask = (id: string) => {
    setSelectedTaskId(id);
    if (id !== "new") {
      const found = availableTasks.find((t) => t.id === id);
      if (found) {
        const parsed = extractReminder(found.details);
        setClockTime(parsed.time);
        setReminderNote(parsed.note);
        setReminderDate(found.due_date || todayKey());
      }
    }
  };

  const handleSaveReminder = async () => {
    const formattedDetails = clockTime
      ? reminderNote.trim()
        ? `${clockTime} · ${reminderNote.trim()}`
        : clockTime
      : reminderNote.trim() || null;

    if (selectedTaskId === "new") {
      const title = newTaskTitle.trim();
      if (!title) return;
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title,
        plan_type: "task",
        details: formattedDetails,
        category: "Personal",
        due_date: reminderDate || todayKey(),
        completed: false,
        archived: false,
        favorite: false,
        position: tasks.length,
      };
      await saveTask(newTask);
      setNotice(`Task created with reminder at ${clockTime}`);
    } else if (targetTask) {
      const updated: Task = {
        ...targetTask,
        details: formattedDetails,
        due_date: reminderDate || targetTask.due_date,
      };
      await saveTask(updated);
      setNotice(`Reminder for "${targetTask.title}" set to ${clockTime}`);
    }

    // Request notification permission if available
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      void Notification.requestPermission();
    }

    close();
  };

  const handleClearReminder = async () => {
    if (!targetTask) return;
    const updated: Task = {
      ...targetTask,
      details: reminderNote.trim() || null,
    };
    await saveTask(updated);
    setNotice(`Reminder removed from "${targetTask.title}"`);
    close();
  };

  return (
    <DraggableModal isOpen={true} onClose={close} ariaLabel="Target Task & Set Reminder">
      <div className="flex flex-col gap-4 pt-1">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-[#85a900] uppercase">
              <Icon name="alarm" size={13} />
              <span>Target Task & Schedule</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Set Task Reminder
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-lg font-bold text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* 1. Target Task Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
            Target Task
          </label>
          <select
            value={selectedTaskId}
            onChange={(e) => handleSelectTask(e.target.value)}
            className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white focus:ring-2 focus:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
          >
            {availableTasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} {t.details ? `(Current: ${t.details})` : `(${t.category})`}
              </option>
            ))}
            <option value="new">+ Target a new task...</option>
          </select>

          {/* If creating a new task to target */}
          {selectedTaskId === "new" && (
            <input
              type="text"
              placeholder="What task needs a reminder?"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              autoFocus
              className="mt-1 h-11 rounded-xl border border-[#85a900]/40 bg-white px-3.5 text-sm font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:ring-2 focus:ring-[#85a900]/20 dark:border-[#85a900]/40 dark:bg-zinc-800 dark:text-zinc-100"
            />
          )}

          {/* Currently Targeted Task Card summary */}
          {targetTask && (
            <div className="mt-1 flex items-center justify-between rounded-xl bg-zinc-100/70 px-3 py-2 text-xs dark:bg-zinc-800/60">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                Category: <b className="text-zinc-900 dark:text-zinc-100">{targetTask.category}</b>
              </span>
              <span className="rounded-md bg-[#edf6d5] px-2 py-0.5 text-[10px] font-bold text-[#3d4b24] dark:bg-[#20290e] dark:text-[#d3f36b]">
                {targetTask.completed ? "Completed" : "In progress"}
              </span>
            </div>
          )}
        </div>

        {/* 2. Clock Input for Reminder Time */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
            Reminder Clock Time
          </label>
          <ClockInput
            value={clockTime}
            onChange={(val) => setClockTime(val)}
            id="reminder-clock-picker"
          />
        </div>

        {/* 3. Date Selection & Context */}
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
            Reminder Date
            <input
              type="date"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-xs font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
            Context Note (Optional)
            <input
              type="text"
              placeholder="e.g. Bring notes"
              value={reminderNote}
              onChange={(e) => setReminderNote(e.target.value)}
              maxLength={120}
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-xs font-medium text-zinc-900 outline-none transition focus:border-[#85a900] focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </label>
        </div>

        {/* 4. Action Buttons */}
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {targetTask?.details && (
              <button
                type="button"
                onClick={handleClearReminder}
                className="h-11 rounded-xl border border-zinc-200 px-3 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                title="Remove reminder time from this task"
              >
                Clear reminder
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveReminder}
              className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#d3f36b] text-sm font-bold text-[#283618] shadow-md shadow-[#718d3725] transition hover:bg-[#c4e65d] active:scale-[0.98]"
            >
              <Icon name="alarm" size={16} />
              <span>Set Task Reminder</span>
            </button>
          </div>

          {targetTask && onComplete && !targetTask.completed && (
            <button
              type="button"
              onClick={() => {
                onComplete(targetTask);
                close();
              }}
              className="h-9 w-full rounded-xl border border-zinc-200 text-xs font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              Mark task as completed
            </button>
          )}
        </div>
      </div>
    </DraggableModal>
  );
}
