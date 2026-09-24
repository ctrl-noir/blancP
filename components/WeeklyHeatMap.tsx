// WeeklyHeatMap.tsx
type DayData = {
  day: string;
  value: 0 | 1 | 2 | 3;
};

type WeekData = DayData[];

const monthData: WeekData[] = [
  [
    { day: "Mon", value: 3 },
    { day: "Tue", value: 2 },
    { day: "Wed", value: 1 },
    { day: "Thu", value: 0 },
    { day: "Fri", value: 2 },
    { day: "Sat", value: 3 },
    { day: "Sun", value: 1 },
  ],
  [
    { day: "Mon", value: 2 },
    { day: "Tue", value: 3 },
    { day: "Wed", value: 0 },
    { day: "Thu", value: 1 },
    { day: "Fri", value: 2 },
    { day: "Sat", value: 2 },
    { day: "Sun", value: 3 },
  ],
  [
    { day: "Mon", value: 1 },
    { day: "Tue", value: 0 },
    { day: "Wed", value: 2 },
    { day: "Thu", value: 3 },
    { day: "Fri", value: 1 },
    { day: "Sat", value: 2 },
    { day: "Sun", value: 0 },
  ],
  [
    { day: "Mon", value: 3 },
    { day: "Tue", value: 2 },
    { day: "Wed", value: 1 },
    { day: "Thu", value: 2 },
    { day: "Fri", value: 3 },
    { day: "Sat", value: 1 },
    { day: "Sun", value: 2 },
  ],
];

const colorMap: Record<number, string> = {
  0: "bg-zinc-700",   
  1: "bg-yellow-600", 
  2: "bg-green-600", 
  3: "bg-green-800",  
};

function StreakMap() {
  return (
    <div className="mt-3 flex flex-col gap-2">
      {monthData.map((week, wIdx) => (
        <div key={wIdx} className="flex justify-start gap-x-2">
          {week.map((day, dIdx) => (
            <div key={dIdx} className="flex flex-col items-center">
              <div
                className={`w-6 h-6 ${colorMap[day.value]} transition-colors`}
              ></div>
              {wIdx === monthData.length - 1 && (
                <span className="text-[10px] font-semibold text-white-700 mt-1">{day.day}</span>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default StreakMap;
