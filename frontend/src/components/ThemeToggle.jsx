import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="
        flex h-10 w-10 items-center justify-center
        rounded-full
        border
        border-gray-300
        bg-white
        text-[#0B0B0B]
        transition
        hover:border-[#F5C518]
        dark:border-[#333333]
        dark:bg-[#171717]
        dark:text-white
      "
    >
      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export default ThemeToggle;
