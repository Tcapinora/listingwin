"use client";

import { CalendarDays, GripVertical, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useListing } from "@/components/ListingProvider";

const eventTypes = [
  "Photography",
  "Signboard",
  "Launch",
  "Open home",
  "Auction",
  "Follow-up",
  "Other",
];

const eventColours: Record<string, string> = {
  Photography: "bg-violet-100 text-violet-800 ring-violet-200",
  Signboard: "bg-slate-200 text-slate-800 ring-slate-300",
  Launch: "bg-blue-100 text-blue-800 ring-blue-200",
  "Open home": "bg-emerald-100 text-emerald-800 ring-emerald-200",
  Auction: "bg-red-100 text-red-800 ring-red-200",
  "Follow-up": "bg-amber-100 text-amber-800 ring-amber-200",
  Other: "bg-gray-100 text-gray-700 ring-gray-200",
};

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

export function SaleCalendar() {
  const today = new Date();
  const { listing, setListing } = useListing();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(
    toDateKey(today.getFullYear(), today.getMonth(), today.getDate()),
  );
  const [title, setTitle] = useState("");
  const [type, setType] = useState(eventTypes[0]);
  const days = useMemo(() => makeCalendarDays(year, month), [month, year]);
  const eventsForSelectedDate = listing.saleCalendarEvents.filter(
    (event) => event.date === selectedDate,
  );

  const addEvent = () => {
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return;
    }

    setListing((current) => ({
      ...current,
      saleCalendarEvents: [
        ...current.saleCalendarEvents,
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          date: selectedDate,
          title: cleanTitle,
          type,
        },
      ],
    }));
    setTitle("");
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
  };

  return (
    <section className="mt-8 rounded-3xl border border-blue-100 bg-white p-6 shadow-card lg:p-8">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
            <CalendarDays size={16} />
            Sale calendar
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">
            Important dates for this campaign.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Pick any month and year, then click a date to add photography,
            launch, open home, auction, or seller follow-up milestones.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {eventTypes.map((eventType) => (
              <button
                key={eventType}
                type="button"
                draggable
                onDragStart={(event) =>
                  event.dataTransfer.setData("text/plain", eventType)
                }
                onClick={() => {
                  setType(eventType);
                  setTitle(eventType);
                }}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ring-1 ${eventColours[eventType]}`}
                title={`Drag ${eventType} onto a date`}
              >
                <GripVertical size={13} />
                {eventType}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={month}
            onChange={(event) => setMonth(Number(event.target.value))}
            className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-950 outline-none"
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
            className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-950 outline-none"
          />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div>
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
                return <div key={`empty-${index}`} className="min-h-20" />;
              }

              const dateKey = toDateKey(year, month, day);
              const dayEvents = listing.saleCalendarEvents.filter(
                (event) => event.date === dateKey,
              );
              const selected = selectedDate === dateKey;

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => setSelectedDate(dateKey)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    const eventType = event.dataTransfer.getData("text/plain");

                    if (eventType) {
                      setSelectedDate(dateKey);
                      addEventToDate(dateKey, eventType);
                    }
                  }}
                  className={`min-h-20 rounded-2xl border p-2 text-left transition ${
                    selected
                      ? "border-blue-700 bg-blue-700 text-white shadow-card"
                      : "border-blue-100 bg-blue-50/60 text-slate-800 hover:border-blue-300 hover:bg-white"
                  }`}
                >
                  <span className="text-sm font-semibold">{day}</span>
                  {dayEvents.length ? (
                    <div className="mt-2 space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`truncate rounded-full px-2 py-1 text-[11px] font-semibold ring-1 ${
                            selected
                              ? "bg-white/18 text-white"
                              : eventColours[event.type] || eventColours.Other
                          }`}
                        >
                          {event.type}
                        </div>
                      ))}
                      {dayEvents.length > 2 ? (
                        <div className="text-[11px] font-semibold">
                          +{dayEvents.length - 2} more
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <aside className="rounded-3xl bg-blue-950 p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
            Selected date
          </p>
          <h3 className="mt-2 text-2xl font-semibold">{selectedDate}</h3>

          <div className="mt-5 grid gap-3">
            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-blue-950 outline-none"
            >
              {eventTypes.map((eventType) => (
                <option key={eventType}>{eventType}</option>
              ))}
            </select>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Add note, e.g. First open home 10am"
              className="rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-blue-950 outline-none"
            />
            <button
              type="button"
              onClick={addEvent}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-900"
            >
              <Plus size={16} />
              Add date
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {eventsForSelectedDate.length ? (
              eventsForSelectedDate.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start justify-between gap-3 rounded-2xl bg-white/10 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold">{event.type}</p>
                    <p className="mt-1 text-sm leading-5 text-blue-100">
                      {event.title}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEvent(event.id)}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-blue-100"
                    aria-label="Remove date"
                    title="Remove date"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            ) : (
              <p className="rounded-2xl bg-white/10 p-4 text-sm leading-6 text-blue-100">
                No milestones added for this date yet.
              </p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
