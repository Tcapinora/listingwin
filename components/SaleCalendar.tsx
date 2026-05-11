"use client";

import {
  CalendarDays,
  Clock3,
  Contact,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useListing } from "@/components/ListingProvider";
import type { SaleCalendarEvent } from "@/lib/types";

const eventTypes = [
  "Styling",
  "Trades",
  "Photography",
  "Signboard",
  "Launch",
  "Open home",
  "Auction",
  "Follow-up",
  "Other",
];

const eventColours: Record<string, string> = {
  Styling: "bg-pink-100 text-pink-800 ring-pink-200",
  Trades: "bg-orange-100 text-orange-800 ring-orange-200",
  Photography: "bg-violet-100 text-violet-800 ring-violet-200",
  Signboard: "bg-slate-200 text-slate-800 ring-slate-300",
  Launch: "bg-blue-100 text-blue-800 ring-blue-200",
  "Open home": "bg-emerald-100 text-emerald-800 ring-emerald-200",
  Auction: "bg-red-100 text-red-800 ring-red-200",
  "Follow-up": "bg-amber-100 text-amber-800 ring-amber-200",
  Other: "bg-gray-100 text-gray-700 ring-gray-200",
};

const calendarTabs = ["Styling", "Trades"] as const;

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type CalendarDraft = {
  time: string;
  title: string;
  supplier: string;
  contact: string;
  notes: string;
  taskDetails: string;
};

const emptyDraft: CalendarDraft = {
  time: "",
  title: "",
  supplier: "",
  contact: "",
  notes: "",
  taskDetails: "",
};

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
    2,
    "0",
  )}`;
}

function makeCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingEmptyDays = (firstDay.getDay() + 6) % 7;

  return [
    ...Array.from({ length: leadingEmptyDays }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
}

function formatTime(value?: string) {
  if (!value) {
    return "";
  }

  const [hour, minute] = value.split(":");
  const date = new Date();
  date.setHours(Number(hour), Number(minute), 0, 0);

  return date.toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function SaleCalendar({
  standalone = false,
}: {
  standalone?: boolean;
}) {
  const today = new Date();
  const { listing, setListing } = useListing();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(
    toDateKey(today.getFullYear(), today.getMonth(), today.getDate()),
  );
  const [activeType, setActiveType] = useState<(typeof calendarTabs)[number]>(
    "Styling",
  );
  const [draft, setDraft] = useState<CalendarDraft>(emptyDraft);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const days = useMemo(() => makeCalendarDays(year, month), [month, year]);
  const eventsForSelectedDate = listing.saleCalendarEvents
    .filter((event) => event.date === selectedDate)
    .sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99"));
  const selectedEvent =
    listing.saleCalendarEvents.find((event) => event.id === selectedEventId) ||
    eventsForSelectedDate[0] ||
    null;

  const addEvent = () => {
    const cleanTitle =
      draft.title.trim() || `${activeType} appointment`.trim();

    setListing((current) => ({
      ...current,
      saleCalendarEvents: [
        ...current.saleCalendarEvents,
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          date: selectedDate,
          title: cleanTitle,
          type: activeType,
          time: draft.time,
          notes: draft.notes.trim(),
          supplier: draft.supplier.trim(),
          contact: draft.contact.trim(),
          taskDetails: draft.taskDetails.trim(),
        },
      ],
    }));
    setDraft(emptyDraft);
    setSelectedEventId(null);
  };

  const addEventToDate = (date: string, eventType: string) => {
    setListing((current) => ({
      ...current,
      saleCalendarEvents: [
        ...current.saleCalendarEvents,
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          date,
          title: eventType,
          type: eventType,
        },
      ],
    }));
  };

  const removeEvent = (id: string) => {
    setListing((current) => ({
      ...current,
      saleCalendarEvents: current.saleCalendarEvents.filter(
        (event) => event.id !== id,
      ),
    }));

    if (selectedEventId === id) {
      setSelectedEventId(null);
    }
  };

  const selectDate = (dateKey: string) => {
    setSelectedDate(dateKey);
    setSelectedEventId(null);
  };

  const selectEntry = (event: SaleCalendarEvent) => {
    setSelectedDate(event.date);
    setSelectedEventId(event.id);
    if (event.type === "Styling" || event.type === "Trades") {
      setActiveType(event.type);
    }
  };

  return (
    <section
      className={`rounded-[2rem] border border-blue-100 bg-white p-4 shadow-card sm:p-6 lg:p-8 ${
        standalone ? "" : "mt-8"
      }`}
    >
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
            <CalendarDays size={16} />
            {standalone ? "Calendar workspace" : "Sale calendar"}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            Plan the campaign dates clearly.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Select a date, choose Styling or Trades, add the time, supplier,
            contact details, notes, and task information. The same calendar can
            also hold photography, open home, launch, auction, and follow-up
            tasks.
          </p>
          <div className="mt-4 -mx-1 flex gap-2 overflow-x-auto px-1 pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0">
            {eventTypes.map((eventType) => (
              <button
                key={eventType}
                type="button"
                draggable
                onDragStart={(event) =>
                  event.dataTransfer.setData("text/plain", eventType)
                }
                onClick={() => {
                  if (eventType === "Styling" || eventType === "Trades") {
                    setActiveType(eventType);
                  }
                  setDraft((current) => ({
                    ...current,
                    title: eventType,
                  }));
                }}
                className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ring-1 ${eventColours[eventType]}`}
                title={`Drag ${eventType} onto a date`}
              >
                <GripVertical size={13} />
                {eventType}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
          <select
            value={month}
            onChange={(event) => setMonth(Number(event.target.value))}
            className="min-h-12 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-950 outline-none"
          >
            {monthNames.map((name, index) => (
              <option key={name} value={index}>
                {name}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={year}
            onChange={(event) =>
              setYear(Number(event.target.value) || today.getFullYear())
            }
            min={1900}
            max={2200}
            className="min-h-12 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-950 outline-none"
          />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
        <div className="overflow-x-auto pb-3">
          <div className="min-w-[680px]">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            {weekDays.map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="min-h-24" />;
              }

              const dateKey = toDateKey(year, month, day);
              const dayEvents = listing.saleCalendarEvents.filter(
                (event) => event.date === dateKey,
              );
              const selected = selectedDate === dateKey;

              return (
                <div
                  key={dateKey}
                  role="button"
                  tabIndex={0}
                  onClick={() => selectDate(dateKey)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      selectDate(dateKey);
                    }
                  }}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    const eventType = event.dataTransfer.getData("text/plain");

                    if (eventType) {
                      selectDate(dateKey);
                      addEventToDate(dateKey, eventType);
                    }
                  }}
                  className={`min-h-24 rounded-2xl border p-2 text-left transition ${
                    selected
                      ? "border-blue-700 bg-blue-700 text-white shadow-card"
                      : "border-blue-100 bg-blue-50/60 text-slate-800 hover:border-blue-300 hover:bg-white"
                  }`}
                >
                  <span className="text-sm font-semibold">{day}</span>
                  {dayEvents.length ? (
                    <div className="mt-2 space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <button
                          key={event.id}
                          type="button"
                          onClick={(clickEvent) => {
                            clickEvent.stopPropagation();
                            selectEntry(event);
                          }}
                          className={`block w-full truncate rounded-full px-2 py-1 text-left text-[11px] font-semibold ring-1 ${
                            selected
                              ? "bg-white/18 text-white ring-white/20"
                              : eventColours[event.type] || eventColours.Other
                          }`}
                          title={`${event.type}: ${event.title}`}
                        >
                          {event.time ? `${formatTime(event.time)} ` : ""}
                          {event.type}
                        </button>
                      ))}
                      {dayEvents.length > 3 ? (
                        <div className="text-[11px] font-semibold">
                          +{dayEvents.length - 3} more
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
          </div>
        </div>

        <aside className="rounded-[2rem] bg-blue-950 p-4 text-white sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
            Selected date
          </p>
          <h3 className="mt-2 text-2xl font-semibold">{selectedDate}</h3>

          <div className="mt-5 grid grid-cols-2 gap-2 rounded-full bg-white/10 p-1">
            {calendarTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveType(tab)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeType === tab
                    ? "bg-white text-blue-950"
                    : "text-blue-100 hover:bg-white/10"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-3">
            <div className="grid gap-3 sm:grid-cols-[0.7fr_1.3fr] xl:grid-cols-1">
              <label>
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-blue-200">
                  Time
                </span>
                <input
                  type="time"
                  value={draft.time}
                  onChange={(event) =>
                    setDraft({ ...draft, time: event.target.value })
                  }
                  className="min-h-12 w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-blue-950 outline-none"
                />
              </label>
              <label>
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-blue-200">
                  Task
                </span>
                <input
                  value={draft.title}
                  onChange={(event) =>
                    setDraft({ ...draft, title: event.target.value })
                  }
                  placeholder={
                    activeType === "Styling"
                      ? "Styling consultation"
                      : "Painter quote"
                  }
                  className="min-h-12 w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-blue-950 outline-none"
                />
              </label>
            </div>
            <input
              value={draft.supplier}
              onChange={(event) =>
                setDraft({ ...draft, supplier: event.target.value })
              }
              placeholder="Supplier or business name"
              className="min-h-12 rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-blue-950 outline-none"
            />
            <input
              value={draft.contact}
              onChange={(event) =>
                setDraft({ ...draft, contact: event.target.value })
              }
              placeholder="Contact name, phone, or email"
              className="min-h-12 rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-blue-950 outline-none"
            />
            <textarea
              value={draft.taskDetails}
              onChange={(event) =>
                setDraft({ ...draft, taskDetails: event.target.value })
              }
              placeholder="Task details"
              rows={3}
              className="rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-blue-950 outline-none"
            />
            <textarea
              value={draft.notes}
              onChange={(event) =>
                setDraft({ ...draft, notes: event.target.value })
              }
              placeholder="Agent notes"
              rows={3}
              className="rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-blue-950 outline-none"
            />
            <button
              type="button"
              onClick={addEvent}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-900"
            >
              <Plus size={16} />
              Save to date
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {eventsForSelectedDate.length ? (
              eventsForSelectedDate.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => selectEntry(event)}
                  className={`flex w-full items-start justify-between gap-3 rounded-2xl p-4 text-left transition ${
                    selectedEvent?.id === event.id
                      ? "bg-white text-blue-950"
                      : "bg-white/10 text-white hover:bg-white/15"
                  }`}
                >
                  <span>
                    <span className="block text-sm font-semibold">
                      {event.type}
                    </span>
                    <span
                      className={`mt-1 flex items-center gap-2 text-sm leading-5 ${
                        selectedEvent?.id === event.id
                          ? "text-slate-600"
                          : "text-blue-100"
                      }`}
                    >
                      {event.time ? (
                        <>
                          <Clock3 size={14} />
                          {formatTime(event.time)}
                        </>
                      ) : null}
                      {event.title}
                    </span>
                  </span>
                  <span
                    onClick={(clickEvent) => {
                      clickEvent.stopPropagation();
                      removeEvent(event.id);
                    }}
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                      selectedEvent?.id === event.id
                        ? "bg-blue-50 text-blue-800"
                        : "bg-white/10 text-blue-100"
                    }`}
                    aria-label="Remove date"
                    title="Remove date"
                    role="button"
                    tabIndex={0}
                  >
                    <Trash2 size={14} />
                  </span>
                </button>
              ))
            ) : (
              <p className="rounded-2xl bg-white/10 p-4 text-sm leading-6 text-blue-100">
                No tasks added for this date yet.
              </p>
            )}
          </div>

          {selectedEvent ? (
            <div className="mt-6 rounded-3xl bg-white p-5 text-blue-950">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                Entry details
              </p>
              <h4 className="mt-3 text-xl font-semibold">
                {selectedEvent.title}
              </h4>
              <div className="mt-4 grid gap-3 text-sm">
                <div className="rounded-2xl bg-blue-50 p-3">
                  <span className="font-semibold">Date:</span>{" "}
                  {selectedEvent.date}
                </div>
                <div className="rounded-2xl bg-blue-50 p-3">
                  <span className="font-semibold">Time:</span>{" "}
                  {formatTime(selectedEvent.time) || "Not set"}
                </div>
                <div className="rounded-2xl bg-blue-50 p-3">
                  <span className="font-semibold">Category:</span>{" "}
                  {selectedEvent.type}
                </div>
                {selectedEvent.supplier ? (
                  <div className="rounded-2xl bg-blue-50 p-3">
                    <span className="font-semibold">Supplier:</span>{" "}
                    {selectedEvent.supplier}
                  </div>
                ) : null}
                {selectedEvent.contact ? (
                  <div className="rounded-2xl bg-blue-50 p-3">
                    <span className="inline-flex items-center gap-2 font-semibold">
                      <Contact size={14} />
                      Contact:
                    </span>{" "}
                    {selectedEvent.contact}
                  </div>
                ) : null}
                {selectedEvent.taskDetails ? (
                  <div className="rounded-2xl bg-blue-50 p-3">
                    <span className="font-semibold">Task details:</span>
                    <p className="mt-1 leading-6">{selectedEvent.taskDetails}</p>
                  </div>
                ) : null}
                {selectedEvent.notes ? (
                  <div className="rounded-2xl bg-blue-50 p-3">
                    <span className="font-semibold">Notes:</span>
                    <p className="mt-1 leading-6">{selectedEvent.notes}</p>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
