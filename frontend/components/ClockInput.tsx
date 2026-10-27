"use client";

import { useState, useEffect, useId } from "react";
import { Icon } from "@/components/Icon";

type ClockInputProps = {
  value?: string;
  onChange?: (val: string) => void;
  name?: string;
  id?: string;
};

// Helper: parse string like "07:45 am", "07:45 am · team meeting", "14:30", etc.
function parseTimeString(raw: string): { hour: number; minute: number; period: "am" | "pm" } {
  if (!raw) {
    const now = new Date();
    // Default to next nearest 30 mins
    const m = Math.ceil(now.getMinutes() / 30) * 30;
    now.setMinutes(m);
    let h = now.getHours();
    const period: "am" | "pm" = h >= 12 ? "pm" : "am";
    h = h % 12 || 12;
    return { hour: h, minute: now.getMinutes() % 60, period };
  }

  // Look for hh:mm (am|pm)
  const match12 = raw.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
  if (match12) {
    let h = parseInt(match12[1], 10);
    const m = parseInt(match12[2], 10);
    const p = match12[3].toLowerCase() as "am" | "pm";
    if (h > 12) h = h % 12 || 12;
    return { hour: Math.max(1, Math.min(12, h)), minute: Math.max(0, Math.min(59, m)), period: p };
  }

  // Look for 24h hh:mm
  const match24 = raw.match(/(\d{1,2}):(\d{2})/);
  if (match24) {
    const rawH = parseInt(match24[1], 10);
    const m = parseInt(match24[2], 10);
    const p: "am" | "pm" = rawH >= 12 ? "pm" : "am";
    const h = rawH % 12 || 12;
    return { hour: h, minute: Math.max(0, Math.min(59, m)), period: p };
  }

  return { hour: 9, minute: 0, period: "am" };
}

function format12(hour: number, minute: number, period: "am" | "pm"): string {
  const hStr = String(hour).padStart(2, "0");
  const mStr = String(minute).padStart(2, "0");
  return `${hStr}:${mStr} ${period}`;
}

function to24h(hour: number, minute: number, period: "am" | "pm"): string {
  let h = hour % 12;
  if (period === "pm") h += 12;
  return `${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function ClockInput({ value = "", onChange, name, id }: ClockInputProps) {
  const defaultId = useId();
  const inputId = id || defaultId;
  const initial = parseTimeString(value);

  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);
  const [period, setPeriod] = useState<"am" | "pm">(initial.period);
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  useEffect(() => {
    if (value) {
      const parsed = parseTimeString(value);
      setHour(parsed.hour);
      setMinute(parsed.minute);
      setPeriod(parsed.period);
    }
  }, [value]);

  const updateTime = (h: number, m: number, p: "am" | "pm") => {
    setHour(h);
    setMinute(m);
    setPeriod(p);
    const formatted = format12(h, m, p);
    onChange?.(formatted);
  };

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value; // "HH:MM"
    if (!val) return;
    const [hStr, mStr] = val.split(":");
    const hRaw = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    const p: "am" | "pm" = hRaw >= 12 ? "pm" : "am";
    const h = hRaw % 12 || 12;
    updateTime(h, m, p);
  };

  const adjustHour = (delta: number) => {
    let next = hour + delta;
    if (next > 12) next = 1;
    if (next < 1) next = 12;
    updateTime(next, minute, period);
  };

  const adjustMinute = (delta: number) => {
    let next = minute + delta;
    if (next >= 60) next = 0;
    if (next < 0) next = 55;
    updateTime(hour, next, period);
  };

  const applyPreset = (h: number, m: number, p: "am" | "pm") => {
    updateTime(h, m, p);
  };

  const applyRelativeMinutes = (mins: number) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + mins);
    let h = now.getHours();
    const p: "am" | "pm" = h >= 12 ? "pm" : "am";
    h = h % 12 || 12;
    updateTime(h, now.getMinutes(), p);
  };

  const formattedValue = format12(hour, minute, period);
  const nativeValue = to24h(hour, minute, period);

  return (
    <div className="flex flex-col gap-2.5">
      {/* Hidden input for form data */}
      {name && <input type="hidden" name={name} value={formattedValue} />}

      {/* Clock Display Card */}
      <div className="relative flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-2.5 shadow-xs transition focus-within:border-[#85a900] focus-within:ring-2 focus-within:ring-[#85a900]/20 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex items-center gap-3">
          {/* Clock Icon & Native Time Picker Trigger */}
          <label
            htmlFor={inputId}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-[#edf6d5] text-[#3d4b24] transition hover:scale-105 active:scale-95 dark:bg-[#20290e] dark:text-[#d3f36b]"
            title="Click to open clock picker"
          >
            <Icon name="alarm" size={20} />
          </label>

          {/* Large Clock Display */}
          <div className="flex items-center gap-1 font-mono text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {/* Hour Dial */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => adjustHour(1)}
                className="text-[10px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                aria-label="Increment hour"
              >
                ▲
              </button>
              <span className="w-7 text-center">{String(hour).padStart(2, "0")}</span>
              <button
                type="button"
                onClick={() => adjustHour(-1)}
                className="text-[10px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                aria-label="Decrement hour"
              >
                ▼
              </button>
            </div>

            <span className="animate-pulse text-[#85a900]">:</span>

            {/* Minute Dial */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => adjustMinute(5)}
                className="text-[10px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                aria-label="Increment minute"
              >
                ▲
              </button>
              <span className="w-7 text-center">{String(minute).padStart(2, "0")}</span>
              <button
                type="button"
                onClick={() => adjustMinute(-5)}
                className="text-[10px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                aria-label="Decrement minute"
              >
                ▼
              </button>
            </div>
          </div>
        </div>

        {/* AM / PM Toggle and native input */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-zinc-200 bg-zinc-100 p-0.5 dark:border-zinc-700 dark:bg-zinc-900">
            <button
              type="button"
              onClick={() => updateTime(hour, minute, "am")}
              className={`rounded-md px-2 py-1 text-xs font-bold transition ${
                period === "am"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              AM
            </button>
            <button
              type="button"
              onClick={() => updateTime(hour, minute, "pm")}
              className={`rounded-md px-2 py-1 text-xs font-bold transition ${
                period === "pm"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              PM
            </button>
          </div>

          {/* Native HTML5 Clock Input for system clock wheel / picker */}
          <div className="relative">
            <input
              id={inputId}
              type="time"
              value={nativeValue}
              onChange={handleNativeChange}
              className="sr-only"
              aria-label="Select clock time"
            />
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById(inputId) as (HTMLInputElement & { showPicker?: () => void }) | null;
                if (el) {
                  try {
                    if (typeof el.showPicker === "function") {
                      el.showPicker();
                    } else {
                      el.focus();
                    }
                  } catch {
                    setIsCustomOpen(!isCustomOpen);
                  }
                }
              }}
              className="flex h-8 items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-2 text-[11px] font-semibold text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              title="Open time dial"
            >
              <Icon name="clock" size={13} />
              <span>Dial</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Clock Presets */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-bold text-zinc-400 uppercase">Quick:</span>
        <button
          type="button"
          onClick={() => applyPreset(8, 0, "am")}
          className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-zinc-700 transition hover:border-[#85a900] hover:bg-[#edf6d5]/50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-[#d3f36b]"
        >
          08:00 AM
        </button>
        <button
          type="button"
          onClick={() => applyPreset(12, 0, "pm")}
          className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-zinc-700 transition hover:border-[#85a900] hover:bg-[#edf6d5]/50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-[#d3f36b]"
        >
          12:00 PM
        </button>
        <button
          type="button"
          onClick={() => applyPreset(3, 30, "pm")}
          className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-zinc-700 transition hover:border-[#85a900] hover:bg-[#edf6d5]/50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-[#d3f36b]"
        >
          03:30 PM
        </button>
        <button
          type="button"
          onClick={() => applyPreset(6, 0, "pm")}
          className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-zinc-700 transition hover:border-[#85a900] hover:bg-[#edf6d5]/50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-[#d3f36b]"
        >
          06:00 PM
        </button>
        <button
          type="button"
          onClick={() => applyRelativeMinutes(30)}
          className="rounded-lg border border-[#85a900]/30 bg-[#edf6d5] px-2 py-1 text-[11px] font-semibold text-[#3d4b24] transition hover:bg-[#e4f0c0] dark:border-[#d3f36b]/30 dark:bg-[#20290e] dark:text-[#d3f36b]"
        >
          +30 mins
        </button>
        <button
          type="button"
          onClick={() => applyRelativeMinutes(60)}
          className="rounded-lg border border-[#85a900]/30 bg-[#edf6d5] px-2 py-1 text-[11px] font-semibold text-[#3d4b24] transition hover:bg-[#e4f0c0] dark:border-[#d3f36b]/30 dark:bg-[#20290e] dark:text-[#d3f36b]"
        >
          +1 hour
        </button>
      </div>
    </div>
  );
}
