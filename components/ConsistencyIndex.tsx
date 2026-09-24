import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip);

function ConsistencyIndex() {
  const data = {
    labels: ["Consistency", "Remaining"],
    datasets: [
      {
        data: [82, 18], // 82% consistent, 18% gap
        backgroundColor: ["#8b5cf6", "#1f2937"], // purple + dark gray
        borderWidth: 0,
        cutout: "70%", // thick donut
        circumference: 180, // half donut
        rotation: -90, // start at top
        
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-zinc-900 rounded-xl shadow-md">
      <h2 className="font-bold text-gray-400 text-lg tracking-wide mb-2">
        Consistency Index
      </h2>

      <div className="ml-auto w-48 h-24">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Overall habit consistency this year
      </p>

      <div className="flex gap-4 mt-3 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
          <span>Consistent days</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-zinc-700 rounded-sm"></div>
          <span>Missed days</span>
        </div>
      </div>
    </div>
  );
}

export default ConsistencyIndex;
