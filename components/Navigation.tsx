import { Home, Send, FileText, Store } from "lucide-react";

function NavBar() {
  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black rounded-full px-6 py-3 flex justify-around items-center w-80 shadow-lg">

      <button className="text-white">
        <Home size={20} />
      </button>

      <button className="text-white">
        <Send size={20} />
      </button>

      <button className="text-white">
        <FileText size={20} />
      </button>

      <button className="text-white">
        <Store size={20} />
      </button>
    </nav>
  );
}

export default NavBar;
