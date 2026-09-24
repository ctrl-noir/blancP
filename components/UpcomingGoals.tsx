import { Target, Calendar, Flame } from "lucide-react";

function UpcomingGoals() {
  const goals = [
    {
      icon: <Target className="text-red-400" size={18} />,
      title: "Complete client project",
      progress: 60,
      label: "6/10 tasks",
    },
  ];

  return (
    <div className="flex flex-col w-full h-full">
      <h2 className="font-bold text-gray-400 text-lg tracking-wide border-zinc-700 pb-2">
        Upcoming Goals
      </h2>
    </div>
  );
}

export default UpcomingGoals;
