export const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";

  const saved = localStorage.getItem("theme");
  if (saved) return saved;

  // سیستم کاربر
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
};