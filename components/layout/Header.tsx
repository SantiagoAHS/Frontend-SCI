import Link from "next/link";

const Header = () => {
  return (
    <header className="w-full h-16 flex items-center justify-between px-8 border-b border-gray-300 bg-transparent">
      
      {/* Título */}
      <span className="text-lg font-medium">
        Sci
      </span>

      {/* Icono login */}
      <Link
        href="/login"
        className="text-2xl cursor-pointer hover:opacity-70 transition"
        title="Iniciar sesión"
      >
        👤
      </Link>

    </header>
  );
};

export default Header;
