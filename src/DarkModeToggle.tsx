import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Initialize state from localStorage or system time
    const saved = localStorage.getItem("dark-mode");
    if (saved !== null) {
      return saved === "true";
    } else {
      const hour = new Date().getHours();
      return hour >= 18 || hour < 6; // Dark mode by default 6 PM - 6 AM
    }
  });

  useEffect(() => {
    // Apply dark class to html and save preference
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("dark-mode", darkMode.toString());
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(prev => !prev)}
      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {darkMode ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
      )}
    </button>
  );
};

export default DarkModeToggle;
