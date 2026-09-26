import HabitHeatmap from "../components/Habitheatmap";

function HabitPage() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="mx-auto max-w-5xl p-3">
        <HabitHeatmap
          storageId="demo"
          title="habitHeatMaps"
          description="Each square represents a day of the year. Darker shades mean more time logged."
          initialHabits={[
            { id: "reading", name: "Reading", color: "#3fbf74" },
            { id: "gym", name: "Gym", color: "#5aa9e6" },
          ]}
        />
      </div>
    </div>
  );
}

export default HabitPage;

// import HabitHeatmap from "../components/Habitheatmap";

// function MultiHabitPage() {
//     return (
//         <>
//             <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-white">
//                 <h1 className="text-4xl font-bold mb-6">Habit Page</h1>
//                 <p className="text-lg text-gray-400">This is a placeholder for the Habit App page.</p>
//             </div>
//             < HabitHeatmap storageId="demo" title="My habits"/>
//         </>
//     )
// }

// export default MultiHabitPage;
