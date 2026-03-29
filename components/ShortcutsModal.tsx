"use client";

import { useEffect, useRef } from "react";
import { shortcuts } from "@/constants";

interface ShortcutsModalProps {
  onClose: () => void;
}

const shortcutCategories: {
  name: string;
  keys: string[];
}[] = [
  {
    name: "Canvas",
    keys: ["5", "9", "10"], // Select All, Delete, Fit to Screen
  },
  {
    name: "Tools",
    keys: ["1", "4"], // Chat, Reactions
  },
  {
    name: "Editing",
    keys: ["2", "3", "6", "7", "8"], // Undo, Redo, Copy, Paste, Duplicate
  },
  {
    name: "Navigation",
    keys: ["11"], // Pan
  },
];

const ShortcutsModal = ({ onClose }: ShortcutsModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const shortcutMap = new Map(shortcuts.map((s) => [s.key, s]));

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg rounded-xl border border-primary-grey-100 bg-primary-black p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-primary-grey-300 transition-colors hover:bg-primary-grey-100 hover:text-white"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          {shortcutCategories.map((category) => {
            const categoryShortcuts = category.keys
              .map((key) => shortcutMap.get(key))
              .filter(Boolean);

            if (categoryShortcuts.length === 0) return null;

            return (
              <div key={category.name}>
                <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-primary-grey-300">
                  {category.name}
                </h3>
                <div className="space-y-1">
                  {categoryShortcuts.map((shortcut) => (
                    <div
                      key={shortcut!.key}
                      className="flex items-center justify-between rounded px-3 py-1.5 text-sm transition-colors hover:bg-primary-grey-100/30"
                    >
                      <span className="text-white">{shortcut!.name}</span>
                      <kbd className="rounded border border-primary-grey-100 bg-primary-grey-100/40 px-2 py-0.5 font-mono text-xs text-primary-grey-300">
                        {shortcut!.shortcut}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 border-t border-primary-grey-100 pt-3 text-center text-xs text-primary-grey-300">
          Press <kbd className="rounded border border-primary-grey-100 px-1.5 py-0.5 font-mono">?</kbd> or <kbd className="rounded border border-primary-grey-100 px-1.5 py-0.5 font-mono">Esc</kbd> to close
        </div>
      </div>
    </div>
  );
};

export default ShortcutsModal;
