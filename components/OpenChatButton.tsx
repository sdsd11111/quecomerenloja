"use client";

export function OpenChatButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <button className={className} onClick={() => window.dispatchEvent(new Event("open-chat"))}>
      {children}
    </button>
  );
}
