import type { SaleCalendarEvent } from "@/lib/types";

type CalendarPdfInput = {
  address: string;
  agentName: string;
  agencyName: string;
  month: number;
  year: number;
  events: SaleCalendarEvent[];
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

function cleanText(value: string) {
  return value
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .trim();
}

function truncate(value: string, maxLength: number) {
  const clean = cleanText(value);
  return clean.length > maxLength ? `${clean.slice(0, maxLength - 3)}...` : clean;
}

function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
    2,
    "0",
  )}`;
}

function formatTime(value?: string) {
  if (!value) return "";
  const [hour, minute] = value.split(":");
  const date = new Date();
  date.setHours(Number(hour), Number(minute), 0, 0);

  return date.toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function text(
  value: string,
  x: number,
  y: number,
  size = 10,
  color = "0.12 0.16 0.29",
) {
  return `BT /F1 ${size} Tf ${color} rg ${x} ${y} Td (${cleanText(value)}) Tj ET\n`;
}

function rect(
  x: number,
  y: number,
  width: number,
  height: number,
  fill = "1 1 1",
  stroke = "0.82 0.87 0.92",
) {
  return `q ${fill} rg ${stroke} RG ${x} ${y} ${width} ${height} re B Q\n`;
}

function filledRect(x: number, y: number, width: number, height: number, fill: string) {
  return `q ${fill} rg ${x} ${y} ${width} ${height} re f Q\n`;
}

function makePdf(objects: string[]) {
  const header = "%PDF-1.4\n";
  let body = "";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(header.length + body.length);
    body += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = header.length + body.length;
  const xref = [
    "xref",
    `0 ${objects.length + 1}`,
    "0000000000 65535 f ",
    ...offsets
      .slice(1)
      .map((offset) => `${String(offset).padStart(10, "0")} 00000 n `),
    "trailer",
    `<< /Size ${objects.length + 1} /Root 1 0 R >>`,
    "startxref",
    String(xrefOffset),
    "%%EOF",
  ].join("\n");

  return Buffer.from(`${header}${body}${xref}`, "binary");
}

export function createCalendarPdf(input: CalendarPdfInput) {
  const width = 842;
  const height = 595;
  const monthLabel = `${monthNames[input.month]} ${input.year}`;
  const daysInMonth = new Date(input.year, input.month + 1, 0).getDate();
  const leadingEmptyDays =
    (new Date(input.year, input.month, 1).getDay() + 6) % 7;
  const calendarDays = [
    ...Array.from({ length: leadingEmptyDays }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  while (calendarDays.length < 42) {
    calendarDays.push(null);
  }

  const eventMap = input.events.reduce<Record<string, SaleCalendarEvent[]>>(
    (map, event) => {
      map[event.date] = [...(map[event.date] || []), event];
      return map;
    },
    {},
  );
  const monthPrefix = `${input.year}-${String(input.month + 1).padStart(2, "0")}`;
  const monthEvents = input.events
    .filter((event) => event.date.startsWith(monthPrefix))
    .sort((a, b) =>
      `${a.date} ${a.time || "99:99"}`.localeCompare(
        `${b.date} ${b.time || "99:99"}`,
      ),
    );

  let content = "";
  content += filledRect(0, 0, width, height, "0.95 0.96 0.98");
  content += rect(30, 35, 782, 525, "1 1 1", "0.84 0.88 0.94");
  content += text("PROPOSED CALENDAR OF SALE", 56, 520, 9, "0.21 0.39 0.88");
  content += text(monthLabel, 56, 492, 28, "0.04 0.16 0.29");
  content += text(truncate(input.address || "Property address", 56), 56, 470, 11, "0.36 0.44 0.56");
  content += text(
    `Prepared by ${truncate(input.agentName || "Agent", 24)}${input.agencyName ? ` | ${truncate(input.agencyName, 28)}` : ""}`,
    56,
    452,
    9,
    "0.42 0.50 0.62",
  );

  const gridX = 56;
  const gridTop = 410;
  const cellWidth = 68;
  const cellHeight = 50;

  weekDays.forEach((day, index) => {
    content += text(day, gridX + index * cellWidth + 5, gridTop + 12, 8, "0.42 0.50 0.62");
  });

  calendarDays.forEach((day, index) => {
    const row = Math.floor(index / 7);
    const col = index % 7;
    const x = gridX + col * cellWidth;
    const y = gridTop - 8 - (row + 1) * cellHeight;

    content += rect(x, y, cellWidth - 4, cellHeight - 4, day ? "0.98 0.99 1" : "0.95 0.96 0.98");
    if (!day) return;

    content += text(String(day), x + 6, y + cellHeight - 18, 9, "0.04 0.16 0.29");
    const dayEvents = eventMap[dateKey(input.year, input.month, day)] || [];
    dayEvents.slice(0, 2).forEach((event, eventIndex) => {
      const eventY = y + cellHeight - 32 - eventIndex * 12;
      content += filledRect(x + 6, eventY - 2, cellWidth - 16, 10, "0.86 0.92 1");
      content += text(
        truncate(`${formatTime(event.time)} ${event.type}`.trim(), 22),
        x + 9,
        eventY,
        6,
        "0.06 0.30 0.72",
      );
    });
    if (dayEvents.length > 2) {
      content += text(`+${dayEvents.length - 2} more`, x + 8, y + 6, 6, "0.42 0.50 0.62");
    }
  });

  const sideX = 560;
  content += filledRect(sideX, 84, 220, 350, "0.04 0.16 0.29");
  content += text("SELLER SUMMARY", sideX + 22, 394, 9, "0.72 0.83 1");
  content += text(`${monthEvents.length} planned milestones`, sideX + 22, 366, 18, "1 1 1");
  content += text("The campaign plan is visible before launch.", sideX + 22, 344, 9, "0.84 0.90 1");

  monthEvents.slice(0, 9).forEach((event, index) => {
    const eventDate = new Date(`${event.date}T00:00:00`);
    const dateLabel = eventDate.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
    });
    const y = 310 - index * 26;
    content += text(`${dateLabel}  ${formatTime(event.time)}`, sideX + 22, y, 8, "0.72 0.83 1");
    content += text(truncate(`${event.type}: ${event.title}`, 34), sideX + 22, y - 12, 8, "1 1 1");
  });

  if (!monthEvents.length) {
    content += text("No dates have been added yet.", sideX + 22, 310, 10, "1 1 1");
  }

  content += text("ListingWin | Show the campaign before the campaign.", 56, 58, 8, "0.42 0.50 0.62");

  const contentBuffer = Buffer.from(content, "binary");
  return makePdf([
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${contentBuffer.length} >>\nstream\n${content}\nendstream`,
  ]);
}
