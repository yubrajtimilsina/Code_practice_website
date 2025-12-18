import { useState } from "react";
import { ChevronDown, Lightbulb, Lock } from "lucide-react";

export default function HintsPanel({ hints = [], isCompact = false }) {
  const [expandedHints, setExpandedHints] = useState({});
  const [revealedHints, setRevealedHints] = useState(new Set());

  if (!hints || hints.length === 0) return null;

  const toggleHint = (index) => {
    setExpandedHints((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const revealHint = (index) => {
    setRevealedHints((prev) => new Set([...prev, index]));
  };

  const getHintTitle = (index) => {
    if (hints.length === 1) return "Hint";
    if (index === 0) return "Hint 1 (Start here)";
    if (index === hints.length - 1) return `Hint ${hints.length} (Final hint)`;
    return `Hint ${index + 1}`;
  };

  const isHintRevealed = (index) => revealedHints.has(index);

  return (
    <div className={isCompact ? "" : "border-t border-gray-200 pt-4 mt-4"}>
      <div className="space-y-2">
        {hints.map((hint, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-md bg-white"
          >
            {/* Header */}
            <button
              onClick={() => toggleHint(index)}
              className="w-full flex items-center justify-between px-4 py-2 text-left"
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-800">
                  {getHintTitle(index)}
                </span>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-gray-500 ${
                  expandedHints[index] ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Content */}
            {expandedHints[index] && (
              <div className="px-4 py-3 border-t border-gray-200">
                {!isHintRevealed(index) ? (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Lock className="w-4 h-4 text-gray-500" />
                    <button
                      onClick={() => revealHint(index)}
                      className="text-blue-600 hover:underline"
                    >
                      Reveal hint
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {hint}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {!isCompact && (
        <div className="mt-3 text-xs text-gray-500">
          Tip: Try solving the problem first. Use hints only when needed.
        </div>
      )}
    </div>
  );
}
