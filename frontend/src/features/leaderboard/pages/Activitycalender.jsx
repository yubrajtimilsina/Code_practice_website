import { useState } from "react";

export function GitHubStyleCalendar({ activityCalendar = {} }) {
  const [hoveredCell, setHoveredCell] = useState(null);

  /* -------------------- DATE GENERATION -------------------- */
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);

  const allDates = [];
  const current = new Date(startDate);
  while (current <= today) {
    allDates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  /* -------------------- WEEKS -------------------- */
  const weeks = [];
  let week = [];

  for (let i = 0; i < allDates[0].getDay(); i++) week.push(null);

  allDates.forEach((date) => {
    week.push(date);
    if (date.getDay() === 6) {
      weeks.push(week);
      week = [];
    }
  });

  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  /* -------------------- MONTH LABELS -------------------- */
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const monthLabels = [];
  let lastMonth = -1;

  weeks.forEach((week, idx) => {
    const date = week.find(Boolean);
    if (date) {
      const month = date.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ idx, month });
        lastMonth = month;
      }
    }
  });

  /* -------------------- HELPERS -------------------- */
  const getCountForDate = (date) => {
    if (!date) return 0;
    return activityCalendar[date.toISOString().split("T")[0]] || 0;
  };

  const getColorClass = (count) => {
    if (count === 0) return "bg-slate-100";
    if (count <= 2) return "bg-green-200";
    if (count <= 5) return "bg-green-400";
    if (count <= 10) return "bg-green-600";
    return "bg-green-700";
  };

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  // Calculate total submissions
  const totalSubmissions = Object.values(activityCalendar).reduce((sum, count) => sum + count, 0);
  const activeDays = Object.values(activityCalendar).filter(count => count > 0).length;

  const CELL_SIZE = 12;
  const CELL_GAP = 4;
  const WEEK_WIDTH = CELL_SIZE + CELL_GAP;


  /* -------------------- UI -------------------- */
  return (
    <div className=" bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-200">
          {/* Header */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800">
                  Submission Activity
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Last 365 days
                </p>
              </div>

              {/* Stats */}
              <div className="flex gap-4 text-sm">
                <div className="bg-slate-50 rounded-lg px-3 py-2">
                  <div className="text-slate-500 text-xs">Total</div>
                  <div className="font-bold text-slate-800">{totalSubmissions}</div>
                </div>
                <div className="bg-slate-50 rounded-lg px-3 py-2">
                  <div className="text-slate-500 text-xs">Active Days</div>
                  <div className="font-bold text-slate-800">{activeDays}</div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between gap-4 text-xs text-slate-500 pt-4 border-t border-slate-200">
              <span className="hidden sm:inline">Contribution levels:</span>
              <div className="flex items-center gap-2">
                <span>Less</span>
                <div className="flex gap-1">
                  {[0, 1, 3, 6, 11].map((v) => (
                    <div
                      key={v}
                      className={`w-3 h-3 sm:w-4 sm:h-4 rounded-sm ${getColorClass(v)} border border-slate-300`}
                    />
                  ))}
                </div>
                <span>More</span>
              </div>
            </div>
          </div>

          {/* Scroll container */}
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <div className="min-w-max py-2">
              {/* Month labels */}
              <div className="relative ml-8 sm:ml-10 mb-2 h-4">
                {monthLabels.map(({ idx, month }) => (
                  <span
                    key={idx}
                    className="absolute text-xs font-semibold text-slate-600"
                    style={{
                      left: `${idx * WEEK_WIDTH}px`,
                    }}
                  >
                    {monthNames[month]}
                  </span>
                ))}
              </div>

              <div className="flex">
                {/* Day labels */}
                <div className="flex flex-col justify-between mr-2 text-[10px] sm:text-xs text-slate-500 py-4">
                  {[1, 3, 5].map((i) => (
                    <div key={i} className="h-[10px] sm:h-3 flex items-center">
                      <span className="hidden sm:inline">{dayNames[i]}</span>
                      <span className="sm:hidden">{dayNames[i][0]}</span>
                    </div>
                  ))}
                </div>

                {/* Grid */}
                <div className="flex gap-[3px] sm:gap-1">
                  {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px] sm:gap-1">
                      {week.map((date, di) => {
                        const count = getCountForDate(date);
                        return (
                          <div
                            key={`${wi}-${di}`}
                            className={`relative rounded-sm transition-all duration-200
                              w-[10px] h-[10px]
                              sm:w-3 sm:h-3
                              md:w-[13px] md:h-[13px]
                              ${date ? getColorClass(count) : "bg-transparent"}
                              ${date ? "hover:ring-2 hover:ring-blue-400 hover:scale-110 cursor-pointer" : ""}
                              ${date ? "border border-slate-200" : ""}
                            `}
                            onMouseEnter={() => date && setHoveredCell({ date, count })}
                            onMouseLeave={() => setHoveredCell(null)}
                            onClick={() => date && setHoveredCell({ date, count })}
                          >
                            {hoveredCell?.date === date && (
                              <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-3
                                bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl 
                                whitespace-nowrap pointer-events-none border border-slate-700">
                                <div className="font-bold text-sm">
                                  {count} {count === 1 ? "submission" : "submissions"}
                                </div>
                                <div className="text-slate-300 mt-1">
                                  {formatDate(date)}
                                </div>
                                <div className="absolute left-1/2 -translate-x-1/2 top-full border-[6px] border-transparent border-t-slate-900" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile hint */}
          <div className="sm:hidden mt-4 text-center text-xs text-slate-400">
            Swipe to see full calendar
          </div>
        </div>
      </div>
    </div>
  );
}