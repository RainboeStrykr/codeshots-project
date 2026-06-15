import { create } from "zustand";
import { persist } from "zustand/middleware";
import { languageExtensions } from "@/options";

interface PreferencesState {
  code: string;
  fileName: string; // basename without extension, e.g. "Untitled"
  background: string;
  darkMode: boolean;
  showBackground: boolean;
  language: string;
  autoDetectLanguage: boolean;
  fontSize: number;
  fontStyle: string;
  padding: number;

  // Setters
  setCode: (code: string) => void;
  setFileName: (name: string) => void;
  setBackground: (background: string) => void;
  toggleDarkMode: () => void;
  toggleBackground: () => void;
  setLanguage: (language: string) => void;
  setAutoDetectLanguage: (enabled: boolean) => void;
  setFontSize: (size: number) => void;
  setFontStyle: (style: string) => void;
  setPadding: (padding: number) => void;
}

// Create a persistent Zustand store with type safety and update methods
export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      code: "",
      fileName: "Untitled",
      background: "hyper",
      darkMode: true,
      showBackground: true,
      language: "plaintext",
      autoDetectLanguage: false,
      fontSize: 16,
      fontStyle: "jetBrainsMono",
      padding: 64,

      // Setters
      setCode: (code) => set({ code }),
      setFileName: (fileName) => set({ fileName }),
      setBackground: (background) => set({ background }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      toggleBackground: () =>
        set((state) => ({ showBackground: !state.showBackground })),
      setLanguage: (language) => set({ language }),
      setAutoDetectLanguage: (enabled) => set({ autoDetectLanguage: enabled }),
      setFontSize: (size) => set({ fontSize: size }),
      setFontStyle: (style) => set({ fontStyle: style }),
      setPadding: (padding) => set({ padding }),
    }),
    {
      name: "user-preferences", // Key used in localStorage
    }
  )
);

/** Returns the full filename with extension, e.g. "Untitled.cs" */
export function getFullFileName(fileName: string, language: string): string {
  const ext = languageExtensions[language] ?? "txt";
  return `${fileName}.${ext}`;
}
