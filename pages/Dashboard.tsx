import { Plus } from "lucide-react";
import StreakMap from "../components/WeeklyHeatMap";
import TrajectoryWidget from "../components/Trajectory";

function DashboardPage() {
  return (
    <>
      <div className="dashboard text-center">
        <div className="flex">
          <h1 className="ml-auto font-semibold mt-8 text-3xl">blancP.</h1>
          <button className="font-semibold ml-auto mr-4 px-2 mt-6 rounded-sm border border-gray-600 bg-green-700">
            New Habit
          </button>
        </div>
        <p className="text-gray-200 mt-4 mb-5 text-sm">
          Welcome to blancP, aka blanc's playground. On this platform you will
          be tracking blanc's progress in real time... you are blanc
        </p>
      </div>

      <div className="mt-5">
        <div className="flex flex-row p-2 gap-2">
          <div className="flex-row w-1/4 h-55 p-4 rounded-xl bg-zinc-900 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex">
                <div className="flex flex-col gap-0">
                    <h2 className="font-bold text-gray-400 text-lg tracking-wide">
                    Streak Tracker
                    </h2>
                    <p className="font-semibold text-xs text-gray-200">track your streak.</p>
                </div>
                <Plus className=" ml-auto w-auto h-7 mr-3 bg-green-700 rounded-md" strokeWidth={3}></Plus>
            </div>
            <div className="flex">
                <div className="flex flex-col mt-4 ">
                    <span className="text-4xl font-extrabold text-green-500 drop-shadow-md">
                        14
                    </span>
                    <span className="font-bold text-base mt-4 pr-4">DAY STREAK</span>
                </div>
                <div className="ml-auto mr-4">
                    <StreakMap />
                </div>
            </div>
          </div>
          <div className="flex flex-col w-1/4 h-55 p-4 rounded-xl bg-zinc-900 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex">
                <div>
                    <h2 className="font-bold text-gray-400 text-lg tracking-wide border-zinc-700">
                    Trajectory
                    </h2>
                    <p className="text-xs font-semibold text-gray-200">visualize the stars that you are aiming for.</p>
                </div>
                <button className="font-bold ml-auto "></button>
            </div>
            <TrajectoryWidget />
          </div>
           <div className="flex-row w-1/4 h-55 p-4 rounded-xl bg-zinc-900 shadow-md hover:shadow-lg transition-shadow">
            <h2 className="font-bold text-gray-400 text-lg tracking-wide border-zinc-700 pb-2">
              Streak Tracker
            </h2>
            <div className="flex">
                <div className="flex flex-col mt-4 ">
                    <span className="text-4xl font-extrabold text-green-500 drop-shadow-md">
                        14
                    </span>
                    <span className="font-semibold text-lg text-gray-400">DAY STREAK </span>
                </div>
                <div className="ml-auto mr-5">
                    <StreakMap />
                </div>
            </div>
          </div>
           <div className="flex-row w-1/4 h-55 p-4 rounded-xl bg-zinc-900 shadow-md hover:shadow-lg transition-shadow">
            <h2 className="font-bold text-gray-400 text-lg tracking-wide border-zinc-700 pb-2">
              Streak Tracker
            </h2>
            <div className="flex">
                <div className="flex flex-col mt-4 ">
                    <span className="text-4xl font-extrabold text-green-500 drop-shadow-md">
                        14
                    </span>
                    <span className="font-semibold text-lg text-gray-400">DAY STREAK </span>
                </div>
                <div className="ml-auto mr-5">
                    <StreakMap />
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
