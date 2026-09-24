function TheHeatMap() {
  const daysInYear = 365;
  const data = Array.from({ length: daysInYear }, () =>
    Math.floor(Math.random() * 6)
  );

  const colorMap: Record<number, string> = {
    0: "bg-zinc-800",   
    1: "bg-green-200",
    2: "bg-green-400",
    3: "bg-green-500",
    4: "bg-green-600",
    5: "bg-green-800",   
  };

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  return (
    <div className="flex flex-col h-full w-full p-4">
      <h2 className="font-extrabold text-gray-300 text-lg tracking-wide">
        Consistency Heat Map
      </h2>
      <p className="text-xs text-gray-500 mb-5">
        Each square represents a day of the year. Darker reds indicate more habits logged, 
        lighter shades show fewer or no habits.
      </p>
      <div className="flex justify-between text-[10px] text-gray-400 mb-1">
        {months.map((month, idx) => (
          <span key={idx}>{month}</span>
        ))}
      </div>
      <div className="grid grid-cols-53 gap-1 flex-grow">
        {data.map((value, idx) => (
          <div
            key={idx}
            className={`w-5 h-4 ${colorMap[value]} transition-colors`}
            title={`Day ${idx + 1}: ${value} habits`}
          ></div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 bg-zinc-800 "></div>
          <div className="w-4 h-4 bg-green-200"></div>
          <div className="w-4 h-4 bg-green-400"></div>
          <div className="w-4 h-4 bg-green-600"></div>
          <div className="w-4 h-4 bg-green-800"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

export default TheHeatMap;
