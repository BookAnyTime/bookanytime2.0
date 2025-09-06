import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Determine initial mode
  useEffect(() => {
    const saved = localStorage.getItem("dark-mode");

    if (saved !== null) {
      // Use user preference from previous session
      setDarkMode(saved === "true");
    } else {
      // Auto mode based on time if no user preference
      const hour = new Date().getHours();
      if (hour >= 18 || hour < 6) {
        setDarkMode(true); // 6 PM - 6 AM -> dark
      } else {
        setDarkMode(false); // 6 AM - 6 PM -> light
      }
    }
  }, []);

  // Apply dark class to html and save preference
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("dark-mode", darkMode.toString());
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
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
