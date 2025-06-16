import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Message } from "../../types/chat";
import {
  Copy,
  Volume2,
  VolumeX,
  User,
  Bot,
  Image as ImageIcon,
  Clock,
  Check,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface MessageBubbleProps {
  message: Message;
  onSpeak?: (text: string) => void;
  isSpeaking?: boolean;
}

export function MessageBubble({
  message,
  onSpeak,
  isSpeaking = false,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isUser = message.sender === "user";
  const isBot = message.sender === "bot";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const handleSpeak = () => {
    if (onSpeak && message.content) {
      onSpeak(message.content);
    }
  };

  const handleImageDownload = () => {
    if (message.image?.url) {
      const link = document.createElement("a");
      link.href = message.image.url;
      link.download = message.image.alt || "image";
      link.click();
    }
  };

  return (
    <div
      className={cn(
        "group flex w-full max-w-4xl mx-auto message-enter",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "flex max-w-[85%] space-x-3",
          isUser ? "flex-row-reverse space-x-reverse" : "flex-row",
        )}
      >
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              isUser
                ? "bg-ai-primary text-white"
                : "bg-gradient-to-br from-ai-gradient-from to-ai-gradient-to text-white",
            )}
          >
            {isUser ? (
              <User className="w-4 h-4" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
          </div>
        </div>

        {/* Message content */}
        <div className="flex-1 min-w-0">
          {/* Message bubble */}
          <div
            className={cn(
              "relative rounded-2xl px-4 py-3 shadow-sm",
              "transition-all duration-200 hover:shadow-md",
              isUser
                ? "bg-ai-primary text-white ml-4"
                : "bg-muted/70 backdrop-blur-sm mr-4",
              message.type === "image" || message.type === "generated-image"
                ? "p-2"
                : "",
            )}
          >
            {/* Image content */}
            {(message.type === "image" || message.type === "generated-image") &&
              message.image && (
                <div className="space-y-2">
                  <div className="relative group/image">
                    <img
                      src={message.image.url}
                      alt={message.image.alt || "Shared image"}
                      className={cn(
                        "max-w-full h-auto rounded-xl transition-opacity duration-300",
                        !imageLoaded ? "opacity-0" : "opacity-100",
                      )}
                      onLoad={() => setImageLoaded(true)}
                      style={{ maxHeight: "400px" }}
                    />
                    {!imageLoaded && (
                      <div className="absolute inset-0 bg-muted animate-pulse rounded-xl flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    {/* Image overlay actions */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover/image:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={handleImageDownload}
                        className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {message.image.caption && (
                    <p
                      className={cn(
                        "text-sm",
                        isUser ? "text-white/90" : "text-foreground",
                      )}
                    >
                      {message.image.caption}
                    </p>
                  )}
                </div>
              )}

            {/* Text content */}
            {message.content && (
              <div className="space-y-2">
                <p
                  className={cn(
                    "text-sm leading-relaxed whitespace-pre-wrap break-words",
                    isUser ? "text-white" : "text-foreground",
                  )}
                >
                  {message.content}
                </p>
              </div>
            )}
          </div>

          {/* Message actions */}
          <div
            className={cn(
              "flex items-center space-x-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity",
              isUser ? "justify-end" : "justify-start",
            )}
          >
            <div className="flex items-center space-x-1">
              {/* Timestamp */}
              <span className="text-xs text-muted-foreground flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{format(message.timestamp, "HH:mm")}</span>
              </span>

              {/* Copy button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
              >
                {copied ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>

              {/* Speak button (for bot messages) */}
              {isBot && message.content && onSpeak && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSpeak}
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                >
                  {isSpeaking ? (
                    <VolumeX className="w-3 h-3" />
                  ) : (
                    <Volume2 className="w-3 h-3" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
