import { NavLink } from "react-router-dom";
import { Home, Settings, Database, Text } from "lucide-react";

function NavBar() {
  const navItems = [
    { to: "/", icon: <Home size={20} strokeWidth={3} />, label: "Home" },
    { to: "/database", icon: <Database size={20} strokeWidth={3} />, label: "Data" },
    { to: "/notes", icon: <Text size={20} strokeWidth={3} />, label: "Notes" },
    { to: "/settings", icon: <Settings size={20} strokeWidth={3} />, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 
                    bg-stone-800 rounded-full px-6 py-3 flex justify-around 
                    items-center w-80 shadow-lg">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center transition-colors ${
              isActive ? "text-blue-200" : "text-white hover:text-gray-300"
            }`
          }
        >
          {item.icon}
          <span className="text-[10px] mt-1">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default NavBar;
