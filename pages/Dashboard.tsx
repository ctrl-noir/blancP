import { FolderOpen, Plus } from "lucide-react";
import StreakMap from "../components/WeeklyHeatMap";
import TrajectoryWidget from "../components/Trajectory";
import TheHeatMap from "../components/TheHeatMap";
import ConsistencyIndex from "../components/ConsistencyIndex";
import ToDoList from "../components/ToDoList";

function DashboardPage() {
  return (
    <>
        <div className="dashboard text-center">
            <div className="flex items-start">
                <h1 className="pl-6 font-extrabold mt-8 text-8xl text-left">blancP <span className="text-red-800">.-</span><span className="text-red-800">   -...</span><span className="text-purple-800">   ---</span></h1>
                <p className="pl-6 font-semibold text-gray-300 text-xs text-left max-w-md mt-23">
                Welcome to blancP, aka blanc's playground. On this platform you will
                be tracking blanc's progress in real time... you are blanc
                </p>
                <FolderOpen className="font-bold ml-auto mr-5 mt-15 w-8 h-8" />
            </div>
        </div>
        <div className="mt-5">
            <div className="flex flex-row p-2 gap-2">
                <div className="flex-row w-1/4 h-55 p-4 rounded-xl bg-zinc-900 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex">
                        <div className="flex flex-col gap-0">
                            <h2 className="font-extrabold text-gray-300 text-lg tracking-wide">
                            Streak Tracker
                            </h2>
                            <p className="font-semibold text-xs text-gray-500">track your streak.</p>
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
                            <h2 className="font-extrabold text-gray-300 text-lg tracking-wide border-zinc-700">
                            Trajectory
                            </h2>
                            <p className="text-xs font-semibold text-gray-500">visualize the stars that you are aiming for.</p>
                        </div>
                        <button className="font-bold ml-auto "></button>
                    </div>
                    <TrajectoryWidget />
                </div>
                <div className="flex-row w-1/4 h-55 p-4 rounded-xl bg-zinc-900 shadow-md hover:shadow-lg transition-shadow">
                    < ToDoList />
                </div>
                <div className="flex-row w-1/4 h-55 p-4 rounded-xl bg-zinc-900 shadow-md hover:shadow-lg transition-shadow">
                   <ConsistencyIndex />
                </div>
            </div>
        </div>
        <div className="flex-row w-auto h-80 pl-4 pr-4 rounded-xl bg-zinc-900 shadow-md hover:shadow-lg transition-shadow">
            <TheHeatMap />
        </div>
    </>
  );
}

export default DashboardPage;
