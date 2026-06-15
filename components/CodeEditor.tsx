import { cn } from "@/lib/utils";
import flourite from "flourite";
import { codeSnippets, fonts, languageExtensions } from "@/options";
import hljs from "highlight.js";
import { useEffect, useRef, useState } from "react";
import Editor from "react-simple-code-editor";
import { usePreferencesStore } from "@/store/use-preferences-store";

export default function CodeEditor() {
  const store = usePreferencesStore();
  const ext = languageExtensions[store.language] ?? "txt";
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputWidth, setInputWidth] = useState<number>(0);

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

  // Keep a hidden span in sync to measure the input width dynamically
  useEffect(() => {
    if (inputRef.current) {
      const span = document.createElement("span");
      span.style.cssText =
        "position:absolute;visibility:hidden;white-space:pre;font-size:0.875rem;font-weight:500;";
      span.textContent = store.fileName || " ";
      document.body.appendChild(span);
      setInputWidth(span.offsetWidth + 4);
      document.body.removeChild(span);
    }
  }, [store.fileName]);

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Strip any dots — the extension is managed separately
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
        <div className="col-span-4 flex justify-center items-center">
          <input
            ref={inputRef}
            type="text"
            value={store.fileName}
            onChange={handleFileNameChange}
            spellCheck={false}
            onClick={(e) => (e.target as HTMLInputElement).select()}
            style={{ width: inputWidth > 0 ? inputWidth : "auto" }}
            className="bg-transparent text-center text-gray-400 text-sm font-medium focus:outline-none min-w-[1ch]"
          />
          <span className="text-gray-400 text-sm font-medium select-none">
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
