import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

function TrajectoryWidget() {
  const data = {
    labels: ["W1", "W2", "W3", "W4"],
    datasets: [
      {
        label: "Completion Rate",
        data: [65, 12, 158, 92],
        borderRadius: 5, // rounded bars
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return null;
          }
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, "rgba(59,130,246,0.6)"); // Tailwind blue-500, lighter bottom
          gradient.addColorStop(1, "rgba(37,99,235,0.9)");  // Tailwind blue-600, darker top
          return gradient;
        },
      },
    ],
  };

  const options1 = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { color: "#9ca3af", font: { weight: "bold" } },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#9ca3af" },
        grid: { color: "#374151" },
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div className="flex w-auto h-auto mt-2  rounded-xl bg-zinc-900">
      <div className="flex flex-col justify-center items-start w-1/3">
        <span className="text-3xl font-extrabold text-blue-500">82%</span>
        <span className="font-semibold text-xs text-gray-400">completion rate</span>
      </div>

      <div className="w-full h-auto">
        <Bar data={data} options={options1} />
      </div>
    </div>
  );
}

export default TrajectoryWidget;
