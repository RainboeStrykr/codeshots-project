import { cn } from "@/lib/utils";
import flourite from "flourite";
import { codeSnippets, fonts, languageExtensions } from "@/options";
import hljs from "highlight.js";
import { useEffect, useRef } from "react";
import Editor from "react-simple-code-editor";
import { usePreferencesStore } from "@/store/use-preferences-store";

export default function CodeEditor() {
  const store = usePreferencesStore();
  const ext = languageExtensions[store.language] ?? "txt";
  const sizerRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Add random code snippets on mount
  useEffect(() => {
    const randomSnippet =
      codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
    usePreferencesStore.setState(randomSnippet);
  }, []);

  // Auto Detect Language
  useEffect(() => {
    if (store.autoDetectLanguage) {
      const { language } = flourite(store.code, { noUnknown: true });
      usePreferencesStore.setState({
        language: language.toLowerCase() || "plaintext",
      });
    }
  }, [store.autoDetectLanguage, store.code]);

  // Sync input width to a hidden sizer span so it hugs the text exactly
  useEffect(() => {
    if (sizerRef.current && inputRef.current) {
      inputRef.current.style.width = sizerRef.current.offsetWidth + "px";
    }
  }, [store.fileName]);

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\./g, "");
    usePreferencesStore.setState({ fileName: value });
  };

  return (
    <div
      className={cn(
        "border-2 rounded-xl shadow-2xl",
        store.darkMode
          ? "bg-black/75 border-gray-600/40"
          : "bg-white/75 border-gray-200/20"
      )}
    >
      <header className="grid grid-cols-6 gap-3 items-center px-4 py-3">
        <div className="flex gap-1.5">
          <div className="rounded-full h-2 w-2 bg-red-500"></div>
          <div className="rounded-full h-2 w-2 bg-yellow-500"></div>
          <div className="rounded-full h-2 w-2 bg-green-500"></div>
        </div>

        {/* Filename display: input + extension, no gap between them */}
        <div className="col-span-4 flex justify-center items-center">
          {/* Hidden sizer — mirrors input text to compute exact width */}
          <span
            ref={sizerRef}
            aria-hidden
            className="absolute invisible whitespace-pre text-sm font-medium"
          >
            {store.fileName || " "}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={store.fileName}
            onChange={handleFileNameChange}
            spellCheck={false}
            onClick={(e) => (e.target as HTMLInputElement).select()}
            className="bg-transparent text-gray-400 text-sm font-medium focus:outline-none min-w-[1ch] p-0 m-0 border-0"
          />
          <span className="text-gray-400 text-sm font-medium select-none leading-none">
            .{ext}
          </span>
        </div>
      </header>
      <div
        className={cn(
          "px-4 pb-4",
          store.darkMode
            ? "brightness-110"
            : "text-gray-800 brightness-50 saturate-200 contrast-200"
        )}
      >
        <Editor
          value={store.code}
          onValueChange={(code) => usePreferencesStore.setState({ code })}
          highlight={(code) =>
            hljs.highlight(code, { language: store.language || "plaintext" })
              .value
          }
          style={{
            fontFamily: fonts[store.fontStyle as keyof typeof fonts].name,
            fontSize: store.fontSize,
          }}
          textareaClassName="focus:outline-none"
          onClick={(e) => {
            if (e.target instanceof HTMLTextAreaElement) {
              e.target.select();
            }
          }}
        />
      </div>
    </div>
  );
}
