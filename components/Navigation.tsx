import { Home, Settings, Database, Text } from "lucide-react";

function NavBar() {
  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-stone-800 rounded-full px-6 py-3 flex justify-around items-center w-80 shadow-lg">

      <button className="text-white">
        <Home size={20} strokeWidth={3}/>
      </button>

      <button className="text-white">
        <Database size={20} strokeWidth={3}/>
      </button>

      <button className="text-white">
        <Text size={20} strokeWidth={3}/>
      </button>

      <button className="text-white">
        <Settings size={20} strokeWidth={3}/>
      </button>
    </nav>
  );
}

export default NavBar;
