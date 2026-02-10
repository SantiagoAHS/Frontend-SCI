import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar = ({ isOpen, toggle }: SidebarProps) => {
  return (
    <aside
      className={`h-screen border-r border-black bg-black fixed top-0 left-0 transition-all duration-300 ${
        isOpen ? "w-48" : "w-16"
      }`}
    >
      {/* Header sidebar */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-300">
        {isOpen && (
          <span className="font-semibold text-lg text-white">
            Menú
          </span>
        )}
        <button onClick={toggle} className="text-white text-xl">
          ☰
        </button>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-2 p-2 text-gray-300">
        
        <Link
          href="/"
          className="px-3 py-2 rounded hover:bg-gray-800 cursor-pointer"
        >
          {isOpen ? "Inicio" : "🏠"}
        </Link>

        <Link
          href="/activos"
          className="px-3 py-2 rounded hover:bg-gray-800 cursor-pointer"
        >
          {isOpen ? "Activos" : "📦"}
        </Link>

        <Link
          href="/prestamos"
          className="px-3 py-2 rounded hover:bg-gray-800 cursor-pointer"
        >
          {isOpen ? "Préstamos" : "💰"}
        </Link>

        <Link
          href="/settings"
          className="px-3 py-2 rounded hover:bg-gray-800 cursor-pointer"
        >
          {isOpen ? "Ajustes" : "⚙️"}
        </Link>

      </nav>
    </aside>
  );
};

export default Sidebar;
