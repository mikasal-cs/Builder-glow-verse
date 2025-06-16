import React from "react";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  className?: string;
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div className={cn("flex w-full max-w-4xl mx-auto", className)}>
      <div className="flex max-w-[85%] space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ai-gradient-from to-ai-gradient-to text-white flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
        </div>

        {/* Typing bubble */}
        <div className="flex-1 min-w-0">
          <div className="bg-muted/70 backdrop-blur-sm rounded-2xl px-4 py-3 mr-4 shadow-sm">
            <div className="typing-dots">
              <span
                className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
                style={{ "--delay": "0ms" } as React.CSSProperties}
              />
              <span
                className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
                style={{ "--delay": "200ms" } as React.CSSProperties}
              />
              <span
                className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
                style={{ "--delay": "400ms" } as React.CSSProperties}
              />
            </div>
          </div>
          <div className="flex items-center space-x-1 mt-1">
            <span className="text-xs text-muted-foreground">
              AI is typing...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
