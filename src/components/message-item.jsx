import React from "react";
import { formatTimestamp, getInitials } from "../lib/utils";
import { useState, useEffect, useRef } from "react";

// ErrorBoundary component to catch rendering errors
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-500">Error rendering message. Please try again.</div>;
    }
    return this.props.children;
  }
}

// Utility to detect mobile
function isMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth <= 768;
}

export default function MessageItem({ message, isCurrentUser, onReply }) {
  const [showActions, setShowActions] = useState(false);
  const [showMobileCopy, setShowMobileCopy] = useState(false);
  const longPressTimeout = useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const [swiped, setSwiped] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [prismLoaded, setPrismLoaded] = useState(false);
  const messageRef = useRef(null);
  const codeRef = useRef(null);

  const isAi = message.isAi === true;

  // Load Prism.js and dependencies in sequence
  useEffect(() => {
    const loadPrism = async () => {
      if (window.Prism) {
        setPrismLoaded(true);
        return;
      }

      try {
        // Load Prism CSS
        const cssLink = document.createElement("link");
        cssLink.rel = "stylesheet";
        cssLink.href =
          "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css";
        document.head.appendChild(cssLink);

        // Load Prism core
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js";
          script.onload = resolve;
          document.head.appendChild(script);
        });

        // Load required language components in order
        const languages = [
          "prism-markup", // Required by JSX, PHP, etc.
          "prism-javascript", // Required by JSX
          "prism-typescript",
          "prism-jsx",
          "prism-tsx",
          "prism-css",
          "prism-python",
          "prism-java",
          "prism-c",
          "prism-cpp",
          "prism-csharp",
          "prism-php",
          "prism-sql",
          "prism-json",
          "prism-bash",
          "prism-powershell",
        ];

        for (const lang of languages) {
          await new Promise((resolve) => {
            const langScript = document.createElement("script");
            langScript.src = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/${lang}.min.js`;
            langScript.onload = resolve;
            document.head.appendChild(langScript);
          });
        }

        setPrismLoaded(true);
      } catch (error) {
        console.error("Failed to load Prism.js:", error);
      }
    };

    loadPrism();
  }, []);

  // Highlight code when Prism is loaded and message changes
  useEffect(() => {
    if (prismLoaded && codeRef.current && window.Prism) {
      try {
        window.Prism.highlightElement(codeRef.current);
      } catch (error) {
        console.error("Failed to highlight code:", error);
      }
    }
  }, [prismLoaded, message.text]);

  // Detect if message contains code
  const detectCode = (text) => {
    const codePatterns = [
      /```[\s\S]*?```/g,
      /`[^`\n]+`/g,
      /<[^>]+>[\s\S]*?<\/[^>]+>/g,
      /function\s+\w+\s*\([^)]*\)\s*\{/g,
      /class\s+\w+[\s\S]*?\{/g,
      /import\s+.*from\s+['"][^'"]+['"]/g,
      /export\s+(default\s+)?(function|class|const|let|var)/g,
      /#include\s*<.*>/g,
      /public\s+static\s+void\s+main/g,
      /def\s+\w+\s*\([^)]*\)\s*:/g,
      /\w+\s*:\s*\w+\s*[{;][\s\S]*?}/g,
      /\$\w+\s*=.*[;]?/g,
      /SELECT\s+.*FROM\s+/gi,
      /console\.log\(/g,
      /document\./g,
      /<!DOCTYPE\s+html>/gi,
    ];

    const lines = text.split("\n");
    if (lines.length > 2) {
      const programmingLines = lines.filter(
        (line) =>
          /^[\s]*[{}\[\];][\s]*$/.test(line) ||
          /^[\s]*(if|for|while|function|class|def|public|private|protected|import|export|const|let|var)[\s\(]/.test(line) ||
          /^[\s]*[<>\/]/.test(line) ||
          /[\{\};\(\)].*[\{\};\(\)]/.test(line)
      ).length;
      if (programmingLines >= 2) return true;
    }

    return codePatterns.some((pattern) => pattern.test(text));
  };

  const isCodeMessage = detectCode(message.text);

  // Detect programming language
  const detectLanguage = (text) => {
    if (text.includes("```")) {
      const match = text.match(/```(\w+)/);
      if (match) {
        const lang = match[1].toLowerCase();
        const langMap = {
          js: "javascript",
          ts: "typescript",
          py: "python",
          cpp: "cpp",
          "c++": "cpp",
          cs: "csharp",
          html: "markup",
          xml: "markup",
          sh: "bash",
          ps1: "powershell",
        };
        return langMap[lang] || lang;
      }
    }

    if (text.includes("#include") || text.match(/int\s+main\s*\(/)) return "c";
    if (text.includes("std::") || text.includes("#include <iostream>")) return "cpp";
    if (
      text.includes("public static void main") ||
      text.includes("System.out") ||
      text.includes("import java.")
    )
      return "java";
    if (
      (text.includes("def ") && text.includes(":")) ||
      (text.includes("import ") && !text.includes("from "))
    )
      return "python";
    if (
      text.includes("console.log") ||
      text.includes("document.") ||
      text.match(/function\s+\w+/)
    )
      return "javascript";
    if (
      text.includes("interface ") &&
      text.includes(": ") ||
      text.includes("type ")
    )
      return "typescript";
    if (
      text.includes("<!DOCTYPE") ||
      text.match(/<html[\s>]/i) ||
      text.match(/<\/\w+>/)
    )
      return "markup";
    if (
      text.includes("{") &&
      text.includes(":") &&
      text.includes(";") &&
      text.match(/[\w-]+\s*:\s*[^;]+;/)
    )
      return "css";
    if (text.includes("<?php") || text.includes("$_")) return "php";
    if (text.match(/SELECT\s+.*FROM/gi) || text.match(/INSERT\s+INTO/gi))
      return "sql";
    if (text.includes("using System") || text.includes("namespace "))
      return "csharp";
    if (text.includes('"scripts"') && text.includes('"dependencies"'))
      return "json";
    if (text.startsWith("$") || text.includes("Get-") || text.includes("Set-"))
      return "powershell";
    if (
      text.includes("#!/bin/bash") ||
      text.includes("echo ") ||
      text.includes("grep ")
    )
      return "bash";

    return "text";
  };

  const language = isCodeMessage ? detectLanguage(message.text) : "text";

  // Format code text for display
  const formatCodeText = (text) => {
    return text.replace(/```\w*\n?/g, "").replace(/```$/g, "").trim();
  };

  // Copy to clipboard
  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      const textToCopy = isCodeMessage ? formatCodeText(message.text) : message.text;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
      setCopied(false);
    }
  };

  // Handle swipe gesture
  const handleTouchStart = (e) => {
    const startX = e.touches[0].clientX;
    setTouchStart(startX);
    setIsDragging(true);
    if (isMobile()) {
      longPressTimeout.current = setTimeout(() => {
        setShowMobileCopy(true);
      }, 450);
    }
  };

  const handleTouchMove = (e) => {
    if (touchStart == null) return;
    const currentX = e.touches[0].clientX;
    const delta = currentX - touchStart; // positive -> right
    const limited = Math.max(Math.min(delta, 100), -100);
    if (!isCurrentUser && limited > 0) {
      setDragX(limited);
    } else if (isCurrentUser && limited < 0) {
      setDragX(limited);
    }
    if ((!isCurrentUser && limited > 55) || (isCurrentUser && limited < -55)) {
      setSwiped(true);
    } else {
      setSwiped(false);
    }
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (swiped) {
      onReply(message);
    }
    setSwiped(false);
    setTouchStart(null);
    setDragX(0);
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
    setTimeout(() => setShowMobileCopy(false), 1200);
  };

  // Reset swipe state on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (messageRef.current && !messageRef.current.contains(event.target)) {
        setShowActions(false);
        setShowMobileCopy(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const hexToHSL = (hex) => {
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;

    let max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h *= 60;
    }

    return `hsl(${h.toFixed(0)}, ${s * 100}%, ${Math.min(l * 100 + 30, 90)}%)`;
  };

  const colorCode = message.color.match(/#([0-9a-fA-F]{3,6})/)?.[0] || "#000000";
  const lightColor = hexToHSL(colorCode);

  const getLanguageDisplayName = (lang) => {
    const displayNames = {
      javascript: "JavaScript",
      typescript: "TypeScript",
      python: "Python",
      java: "Java",
      c: "C",
      cpp: "C++",
      csharp: "C#",
      php: "PHP",
      markup: "HTML",
      css: "CSS",
      sql: "SQL",
      json: "JSON",
      bash: "Bash",
      powershell: "PowerShell",
      text: "Text",
    };
    return displayNames[lang] || lang.toUpperCase();
  };

  return (
    <ErrorBoundary>
      <div
        id={`message-${message.id}`}
        ref={messageRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => setShowActions(!showActions)}
        className={`flex items-start gap-2 mb-4 ${isCurrentUser ? "justify-end" : "justify-start"} group`}
      >
        {!isCurrentUser && (
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full ${message.color} flex items-center justify-center text-white font-medium`}
          >
            {isAi ? "AI" : getInitials(message.nickname)}
          </div>
        )}

        <div
          className={`flex ${isCodeMessage ? "w-4/5 max-w-4xl" : "md:max-w-2xl min-w-24 max-w-72 w-full"} flex-col relative`}
          style={{
            transform: `translateX(${dragX}px)`,
            transition: isDragging ? 'none' : 'transform 0.25s ease-out',
          }}
        >
          <span className="font-medium pb-1 text-sm" style={{ color: lightColor }}>
            {isCurrentUser ? "" : message.nickname}
          </span>

          {message.replyTo && message.replyTo.id ? (
            <div
              className="bg-gray-200 dark:bg-zinc-600 p-2 rounded text-xs border-l-2 border-blue-500 mb-1 cursor-pointer hover:bg-gray-300 dark:hover:bg-zinc-700 transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                const replyElement = document.getElementById(`message-${message.replyTo.id}`);
                if (replyElement) {
                  replyElement.scrollIntoView({ behavior: "smooth" });
                  replyElement.classList.add("bg-zinc-400");
                  setTimeout(() => replyElement.classList.remove("bg-zinc-400"), 500);
                }
              }}
            >
              <span className="font-semibold">{message.replyTo.nickname}:</span>
              <p className="truncate">{message.replyTo.text || "Message deleted"}</p>
            </div>
          ) : null}

          <div
            className={`${isCurrentUser ? "bg-zinc-800 dark:bg-amber-100 text-primary-foreground" : "bg-zinc-300 dark:bg-zinc-800"} rounded-lg relative overflow-hidden`}
          >
            {Math.abs(dragX) > 15 && (
              <div className={`absolute top-1/2 -translate-y-1/2 ${!isCurrentUser ? 'right-full pr-2' : 'left-full pl-2'} text-xs text-zinc-500 opacity-70 transition-opacity`}>
                Reply ↩
              </div>
            )}
            {isCodeMessage && prismLoaded ? (
              <div className="relative w-full">
                <div className="flex items-center justify-between px-3 py-2 bg-zinc-700 dark:bg-zinc-900 border-b border-zinc-600 dark:border-zinc-700">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-xs font-medium text-gray-300 ml-2">
                      {getLanguageDisplayName(language)}
                    </span>
                  </div>
                  {/* Copy button for code: only show on desktop */}
                  {!isMobile() && (
                    <button
                      onClick={handleCopy}
                      className="text-xs px-2 py-1 bg-zinc-600 hover:bg-zinc-500 text-gray-200 rounded transition-all duration-200 flex items-center gap-1"
                      title="Copy code"
                    >
                      {copied ? (
                        <>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="bg-zinc-900 dark:bg-zinc-950 w-full h-72 overflow-auto">
                  <pre
                    className="!m-0 !p-4 !bg-transparent text-sm leading-6 h-full"
                    style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace' }}
                  >
                    <code
                      ref={codeRef}
                      className={`language-${language} !bg-transparent block whitespace-pre`}
                      style={{
                        color: "#f8f8f2",
                        textShadow: "none",
                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace',
                      }}
                    >
                      {formatCodeText(message.text)}
                    </code>
                  </pre>
                </div>
                <div className="absolute bottom-2 right-3 bg-zinc-800 bg-opacity-80 px-2 py-1 rounded">
                  <span className="text-xs text-gray-400">{formatTimestamp(message.timestamp)}</span>
                </div>
              </div>
            ) : (
              <div className="md:pl-4 pl-3 pb-4 md:pb-2 pt-2 pr-3 md:pr-20 min-w-32 md:min-w-0">
                <p className="break-words text-sm md:text-base whitespace-pre-wrap">{message.text}</p>
                <span className="text-xs bottom-1 absolute right-2 opacity-70">
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
            )}
            {/* Mobile copy button (long press) */}
            {isMobile() && showMobileCopy && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-50">
                <button
                  onClick={handleCopy}
                  className="bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black px-3 py-1 rounded-full shadow-lg text-xs transition-opacity duration-200"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            )}
          </div>

          {/* Reply/copy buttons: only show on desktop */}
          {!isMobile() && (
            <div className={`absolute ${isCurrentUser ? "-left-20" : "-right-20"} top-1/2 -translate-y-1/2 flex gap-1`}>
              {!isCodeMessage && (
                <button
                  onClick={handleCopy}
                  className="text-xs p-1 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 rounded-full opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity group/tooltip-copy"
                  aria-label="Copy message"
                >
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black px-2 py-1 rounded text-xs opacity-0 group-hover/tooltip-copy:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {copied ? "Copied!" : "Copy"}
                  </span>
                  {copied ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  )}
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReply(message);
                }}
                className="text-xs p-1 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 rounded-full opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity group/tooltip-reply"
                aria-label="Reply"
              >
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black px-2 py-1 rounded text-xs opacity-0 group-hover/tooltip-reply:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  Reply
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`${!isCurrentUser ? "" : "rotate-180"}`}
                >
                  <polyline points="9 17 4 12 9 7"></polyline>
                  <path d="M20 18v-2a4 4 0 0 0-4-4H4"></path>
                </svg>
              </button>
            </div>
          )}
        </div>

        {isCurrentUser && (
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full ${message.color} flex items-center justify-center text-white font-medium`}
          >
            {getInitials(message.nickname)}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}