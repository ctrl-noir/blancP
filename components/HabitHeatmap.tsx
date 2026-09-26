// HabitHeatmap.tsx
//
// Plug-and-play habit consistency heat maps.
// - Renders ONE heat map card per habit, each with its own color + legend.
// - Click any day to log minutes spent for that habit.
// - "+ Habit" (top right) adds a new tracked habit card.
// - Each card has a ⋯ menu to rename, recolor, or delete that habit.
// - Persists to localStorage by default; pass onChange/onHabitsChange to sync.
//
// Requires Tailwind CSS. No other deps.

import { useEffect, useMemo, useRef, useState } from "react";
import { getIntensityShades, PRESET_COLORS } from "../utils/color";
import { Plus } from "lucide-react";

export interface Habit {
  id: string;
  name: string;
  color: string; // hex
}

// "YYYY-MM-DD" -> { habitId: minutesLogged }
export type HeatmapData = Record<string, Record<string, number>>;

export interface HabitHeatmapProps {
  /** Unique key for this instance — used for localStorage persistence. */
  storageId: string;
  /** Habits shown when no saved state exists yet. */
  initialHabits?: Habit[];
  /** Calendar year to render. Defaults to the current year. */
  year?: number;
  /** Show the "+ Habit" button that lets users add a new habit + pick its color. Default true. */
  allowAddHabit?: boolean;
  /** Allow renaming/recoloring/deleting habits via the card ⋯ menu. Default true. */
  allowEditHabit?: boolean;
  /** Heading shown above the grid. */
  title?: string;
  /** Subtext shown under the heading. */
  description?: string;
  /** Called with the full data map whenever a day is logged or cleared. */
  onChange?: (data: HeatmapData) => void;
  /** Called whenever the habit list changes. */
  onHabitsChange?: (habits: Habit[]) => void;
  className?: string;
}

const DEFAULT_HABITS: Habit[] = [
  { id: "habit-1", name: "Habit", color: "#3fbf74" },
];

const LEVEL_DESCRIPTIONS = [
  "No time logged — this square will stay blank.",
  "Light touch — a few minutes counts.",
  "Solid effort for the day.",
  "Strong session — above your usual.",
  "Deep, sustained effort.",
  "Maximum intensity — best of the year.",
];

function minutesToLevel(min: number): number {
  if (!min || min <= 0) return 0;
  if (min <= 20) return 1;
  if (min <= 45) return 2;
  if (min <= 75) return 3;
  if (min <= 120) return 4;
  return 5;
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "habit"
  );
}

function usePersistentState<T>(key: string, initial: T): [T, (v: T) => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  const setAndPersist = (v: T) => {
    setState(v);
    try {
      window.localStorage.setItem(key, JSON.stringify(v));
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  };

  return [state, setAndPersist];
}

export default function HabitHeatmap({
  storageId,
  initialHabits = DEFAULT_HABITS,
  year = new Date().getFullYear(),
  allowAddHabit = true,
  allowEditHabit = true,
  title = "habitHeatMaps",
  description = "Each square represents a day of the year. Darker shades mean more time logged.",
  onChange,
  onHabitsChange,
  className = "",
}: HabitHeatmapProps) {
  const [habits, setHabits] = usePersistentState<Habit[]>(
    `${storageId}:habits`,
    initialHabits
  );
  const [data, setData] = usePersistentState<HeatmapData>(
    `${storageId}:data`,
    {}
  );

  // Modal state
  const [modal, setModal] = useState<{
    day: Date;
    habitId: string;
    minutes: number;
  } | null>(null);

  // Add-habit popover
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const addPopoverRef = useRef<HTMLDivElement>(null);

  // Edit-habit popover (rename/recolor). Only one card open at a time.
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);

  // Delete confirmation (inline in the ⋯ menu)
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!addOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (
        addPopoverRef.current &&
        !addPopoverRef.current.contains(e.target as Node)
      ) {
        setAddOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [addOpen]);

  useEffect(() => {
    onChange?.(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    onHabitsChange?.(habits);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habits]);

  // Days + month labels are the same for every card — compute once.
  const days = useMemo(() => {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    const startDow = (start.getDay() + 6) % 7; // 0 = Monday
    const list: { date: Date | null; key: string }[] = [];
    for (let i = 0; i < startDow; i++)
      list.push({ date: null, key: `pad-${i}` });
    const d = new Date(start);
    while (d <= end) {
      list.push({ date: new Date(d), key: dateKey(d) });
      d.setDate(d.getDate() + 1);
    }
    return list;
  }, [year]);

  const totalCols = Math.ceil(days.length / 7);

  const monthLabels = useMemo(() => {
    const names = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const labels: { col: number; name: string }[] = [];
    const seen = new Set<number>();
    days.forEach((d, i) => {
      if (!d.date) return;
      const m = d.date.getMonth();
      if (!seen.has(m) && d.date.getDate() <= 7) {
        seen.add(m);
        labels.push({ col: Math.floor(i / 7), name: names[m] });
      }
    });
    return labels;
  }, [days]);

  function levelForDay(habitId: string, key: string) {
    const min = data[key]?.[habitId] ?? 0;
    return minutesToLevel(min);
  }

  function openModal(day: Date, habitId: string) {
    const key = dateKey(day);
    setModal({
      day,
      habitId,
      minutes: data[key]?.[habitId] ?? 0,
    });
  }

  function saveEntry() {
    if (!modal) return;
    const key = dateKey(modal.day);
    const next: HeatmapData = { ...data, [key]: { ...(data[key] ?? {}) } };
    if (modal.minutes > 0) {
      next[key][modal.habitId] = modal.minutes;
    } else {
      delete next[key][modal.habitId];
      if (Object.keys(next[key]).length === 0) delete next[key];
    }
    setData(next);
    setModal(null);
  }

  function clearEntry() {
    if (!modal) return;
    const key = dateKey(modal.day);
    if (!data[key]) return setModal(null);
    const next: HeatmapData = { ...data, [key]: { ...data[key] } };
    delete next[key][modal.habitId];
    if (Object.keys(next[key]).length === 0) delete next[key];
    setData(next);
    setModal(null);
  }

  function addHabit() {
    const name = newName.trim();
    if (!name) return;
    const id = `${slugify(name)}-${Date.now().toString(36)}`;
    setHabits([...habits, { id, name, color: newColor }]);
    setNewName("");
    setNewColor(PRESET_COLORS[(habits.length + 1) % PRESET_COLORS.length]);
    setAddOpen(false);
  }

  /* ----------------------------- edit handlers ----------------------------- */

  function renameHabit(id: string, name: string) {
    const clean = name.trim();
    if (!clean) return;
    setHabits(habits.map((h) => (h.id === id ? { ...h, name: clean } : h)));
  }

  function recolorHabit(id: string, color: string) {
    setHabits(habits.map((h) => (h.id === id ? { ...h, color } : h)));
  }

  function deleteHabit(id: string) {
    // Remove the habit definition.
    setHabits(habits.filter((h) => h.id !== id));

    // Also strip its logged data so a future habit with the same id
    // doesn't inherit the old history.
    const next: HeatmapData = {};
    for (const [day, entry] of Object.entries(data)) {
      if (id in entry) {
        const { [id]: _removed, ...rest } = entry;
        if (Object.keys(rest).length > 0) next[day] = rest;
      } else {
        next[day] = entry;
      }
    }
    setData(next);

    if (editingHabitId === id) setEditingHabitId(null);
    setConfirmingDeleteId(null);
  }

  return (
    <div className={`p-3 w-full text-[#eef0f0] ${className}`}>
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-[#8b9098]">{description}</p>
        </div>

        {allowAddHabit && (
          <div className="relative shrink-0">
            <button
              onClick={() => setAddOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-[#1d1e22] px-3 py-1.5 text-xs font-medium text-[#eef0f0] hover:border-white/25"
            >
              <Plus className="text-base leading-none"></Plus> <span className="font-semibold">Habit</span>
            </button>

            {addOpen && (
              <div
                ref={addPopoverRef}
                className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-white/10 bg-[#17181c] p-4 shadow-xl"
              >
                <label className="mb-1 block text-xs text-[#8b9098]">
                  Habit name
                </label>
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addHabit()}
                  placeholder="e.g. Meditate"
                  className="mb-3 w-full rounded-lg border border-white/10 bg-[#101113] px-3 py-2 text-sm text-[#eef0f0] outline-none focus:border-white/30"
                />

                <label className="mb-1.5 block text-xs text-[#8b9098]">
                  Color
                </label>
                <ColorPicker value={newColor} onChange={setNewColor} />

                <button
                  onClick={addHabit}
                  disabled={!newName.trim()}
                  className="mt-3 w-full rounded-lg py-2 text-sm font-semibold text-black/80 disabled:opacity-40"
                  style={{ background: newColor }}
                >
                  Add habit
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* One card per habit */}
      <div className="flex flex-col gap-5">
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            year={year}
            days={days}
            totalCols={totalCols}
            monthLabels={monthLabels}
            levelForDay={(key) => levelForDay(habit.id, key)}
            onDayClick={(day) => openModal(day, habit.id)}
            editable={allowEditHabit}
            editing={editingHabitId === habit.id}
            onOpenEdit={() => {
              setConfirmingDeleteId(null);
              setEditingHabitId(habit.id);
            }}
            onCloseEdit={() => setEditingHabitId(null)}
            onRename={(name) => renameHabit(habit.id, name)}
            onRecolor={(color) => recolorHabit(habit.id, color)}
            confirmingDelete={confirmingDeleteId === habit.id}
            onRequestDelete={() => {
              setEditingHabitId(null);
              setConfirmingDeleteId(habit.id);
            }}
            onCancelDelete={() => setConfirmingDeleteId(null)}
            onConfirmDelete={() => deleteHabit(habit.id)}
          />
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <LogModal
          habit={habits.find((h) => h.id === modal.habitId)!}
          day={modal.day}
          minutes={modal.minutes}
          onMinutesChange={(m) =>
            setModal((prev) => (prev ? { ...prev, minutes: m } : prev))
          }
          onCancel={() => setModal(null)}
          onClear={clearEntry}
          onSave={saveEntry}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  ColorPicker — shared preset swatches + native input                        */
/* -------------------------------------------------------------------------- */

function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {PRESET_COLORS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className="h-6 w-6 rounded-full"
          style={{
            background: c,
            boxShadow: value === c ? `0 0 0 2px ${c}` : "none",
          }}
          aria-label={c}
        />
      ))}
      <label className="relative flex h-6 w-6 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-white/25 text-[10px] text-[#8b9098]">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        ⌾
      </label>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  HabitCard — one heat map for one habit                                    */
/* -------------------------------------------------------------------------- */

interface HabitCardProps {
  habit: Habit;
  year: number;
  days: { date: Date | null; key: string }[];
  totalCols: number;
  monthLabels: { col: number; name: string }[];
  levelForDay: (key: string) => number;
  onDayClick: (day: Date) => void;
  editable: boolean;
  editing: boolean;
  onOpenEdit: () => void;
  onCloseEdit: () => void;
  onRename: (name: string) => void;
  onRecolor: (color: string) => void;
  confirmingDelete: boolean;
  onRequestDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}

function HabitCard({
  habit,
  year,
  days,
  totalCols,
  monthLabels,
  levelForDay,
  onDayClick,
  editable,
  editing,
  onOpenEdit,
  onCloseEdit,
  onRename,
  onRecolor,
  confirmingDelete,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}: HabitCardProps) {
  const shades = getIntensityShades(habit.color);

  // local menu state
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    function onDoc(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  // Edit-mode draft state
  const [draftName, setDraftName] = useState(habit.name);
  const [draftColor, setDraftColor] = useState(habit.color);

  // Sync drafts when the habit changes from outside, or when edit opens.
  useEffect(() => {
    if (editing) {
      setDraftName(habit.name);
      setDraftColor(habit.color);
    }
  }, [editing, habit.name, habit.color]);

  function saveEdits() {
    const clean = draftName.trim();
    if (clean && clean !== habit.name) onRename(clean);
    if (draftColor !== habit.color) onRecolor(draftColor);
    onCloseEdit();
  }

  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#131417] p-6">
      {/* Card header */}
      <div className="mb-4 flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: habit.color }}
        />
        <h2 className="text-base font-semibold tracking-tight">{habit.name}</h2>
        <span className="text-xs text-[#8b9098]">{year}</span>

        {editable && (
          <div ref={menuRef} className="relative ml-auto">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-[#8b9098] hover:bg-white/5 hover:text-[#eef0f0]"
              aria-label="Habit options"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              {/* three dots */}
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <circle cx="4" cy="10" r="1.6" />
                <circle cx="10" cy="10" r="1.6" />
                <circle cx="16" cy="10" r="1.6" />
              </svg>
            </button>

            {menuOpen && !editing && !confirmingDelete && (
              <div
                role="menu"
                className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-xl border border-white/10 bg-[#17181c] py-1 shadow-xl"
              >
                <MenuItem
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenEdit();
                  }}
                >
                  Rename & color
                </MenuItem>
                <MenuItem
                  danger
                  onClick={() => {
                    setMenuOpen(false);
                    onRequestDelete();
                  }}
                >
                  Delete
                </MenuItem>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Inline edit panel */}
      {editing && (
        <div className="mb-4 rounded-xl border border-white/10 bg-[#101113] p-3">
          <label className="mb-1 block text-[11px] text-[#8b9098]">Name</label>
          <input
            autoFocus
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdits();
              if (e.key === "Escape") onCloseEdit();
            }}
            className="mb-3 w-full rounded-lg border border-white/10 bg-[#0d0e10] px-3 py-2 text-sm text-[#eef0f0] outline-none focus:border-white/30"
          />

          <label className="mb-1.5 block text-[11px] text-[#8b9098]">
            Color
          </label>
          <ColorPicker value={draftColor} onChange={setDraftColor} />

          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={onCloseEdit}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-[#eef0f0]"
            >
              Cancel
            </button>
            <button
              onClick={saveEdits}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-black/85"
              style={{ background: draftColor }}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Inline delete confirmation */}
      {confirmingDelete && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-red-400/30 bg-red-500/5 p-3">
          <p className="text-xs text-red-200">
            Delete <span className="font-semibold">{habit.name}</span> and all
            its logged days?
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              onClick={onCancelDelete}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-[#eef0f0]"
            >
              Cancel
            </button>
            <button
              onClick={onConfirmDelete}
              className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="overflow-x-auto pb-1">
        {/* Month labels */}
        <div
          className="mb-2 grid gap-1 pl-7 text-[11px] text-[#8b9098]"
          style={{
            gridTemplateColumns: `repeat(${totalCols}, minmax(12px, 1fr))`,
            minWidth: 780,
          }}
        >
          {monthLabels.map((m) => (
            <div key={m.name} style={{ gridColumn: `${m.col + 1} / span 4` }}>
              {m.name}
            </div>
          ))}
        </div>

        <div className="flex" style={{ minWidth: 780 }}>
          {/* Weekday labels */}
          <div className="mr-1 grid w-6 grid-rows-7 gap-1 text-[10px] text-[#8b9098]">
            <span />
            <span className="flex items-center">Mon</span>
            <span />
            <span className="flex items-center">Wed</span>
            <span />
            <span className="flex items-center">Fri</span>
            <span />
          </div>

          {/* Day cells */}
          <div
            className="grid flex-1 grid-flow-col grid-rows-7 gap-1"
            style={{
              gridTemplateColumns: `repeat(${totalCols}, minmax(12px, 1fr))`,
            }}
          >
            {days.map((d) =>
              d.date ? (
                <button
                  key={d.key}
                  onClick={() => onDayClick(d.date as Date)}
                  title={`${d.date.toDateString()} — click to log`}
                  className="aspect-square rounded-[3px] transition-transform hover:z-10 hover:scale-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#34d17f]"
                  style={{ background: shades[levelForDay(d.key)] }}
                />
              ) : (
                <div key={d.key} className="invisible" />
              )
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-2 text-xs text-[#8b9098]">
        <span>Less</span>
        <div className="flex gap-[3px]">
          {shades.map((c, i) => (
            <div
              key={i}
              className="h-[13px] w-[13px] rounded-[3px]"
              style={{ background: c }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

function MenuItem({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      role="menuitem"
      type="button"
      onClick={onClick}
      className={`block w-full px-3 py-2 text-left text-xs hover:bg-white/5 ${
        danger ? "text-red-400 hover:bg-red-500/10" : "text-[#eef0f0]"
      }`}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  LogModal — log minutes for one habit on one day                           */
/* -------------------------------------------------------------------------- */

interface LogModalProps {
  habit: Habit;
  day: Date;
  minutes: number;
  onMinutesChange: (m: number) => void;
  onCancel: () => void;
  onClear: () => void;
  onSave: () => void;
}

function LogModal({
  habit,
  day,
  minutes,
  onMinutesChange,
  onCancel,
  onClear,
  onSave,
}: LogModalProps) {
  const level = minutesToLevel(minutes);
  const shades = getIntensityShades(habit.color);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5 backdrop-blur-[2px]"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#17181c] p-5 text-[#eef0f0]">
        <div className="mb-3 flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: habit.color }}
          />
          <span className="text-xs font-medium text-[#8b9098]">
            {habit.name}
          </span>
        </div>

        <p className="mb-0.5 text-xs text-[#8b9098]">
          {day.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p className="mb-4 text-[17px] font-semibold">Log this day</p>

        <div className="mb-4">
          <div className="mb-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-semibold tabular-nums">
              {minutes >= 180 ? "180+ min" : `${minutes} min`}
            </span>
            <span className="text-[11.5px] text-[#8b9098]">time spent</span>
          </div>
          <input
            type="range"
            min={0}
            max={180}
            step={5}
            value={minutes}
            onChange={(e) => onMinutesChange(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: habit.color }}
          />
        </div>

        <div className="mb-5 flex items-center gap-3 rounded-xl border border-white/10 bg-[#101113] p-3">
          <div
            className="h-[30px] w-[30px] shrink-0 rounded-md"
            style={{ background: shades[level] }}
          />
          <p className="text-[12.5px] leading-snug text-[#8b9098]">
            {LEVEL_DESCRIPTIONS[level]}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClear}
            className="w-11 shrink-0 rounded-lg border border-red-400/30 text-red-400"
            title="Clear this day"
          >
            ✕
          </button>
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-black/85"
            style={{ background: habit.color }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}