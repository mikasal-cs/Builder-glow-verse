import React, { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { PromptSuggestions } from "./PromptSuggestions";
import { ChatInput } from "./ChatInput";
import { Message, VoiceSettings } from "../../types/chat";
import { cn } from "@/lib/utils";

interface ChatContainerProps {
  messages: Message[];
  isTyping: boolean;
  voiceSettings: VoiceSettings;
  onSendMessage: (content: string, type?: "text" | "image") => void;
  onUploadImage: (file: File) => void;
  onVoiceToggle: (isRecording: boolean) => void;
  onSpeakMessage: (text: string) => void;
  className?: string;
}

export function ChatContainer({
  messages,
  isTyping,
  voiceSettings,
  onSendMessage,
  onUploadImage,
  onGenerateImage,
  onVoiceToggle,
  onSpeakMessage,
  className,
}: ChatContainerProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    };

    // Small delay to ensure the message is rendered
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isTyping]);

  const handlePromptSelect = (prompt: string) => {
    onSendMessage(prompt);
  };

  const hasMessages = messages.length > 1; // More than just the welcome message

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Messages area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
        <div className="min-h-full flex flex-col">
          {/* Empty state with prompt suggestions */}
          {!hasMessages && (
            <div className="flex-1 flex items-center justify-center py-12">
              <PromptSuggestions onSelectPrompt={handlePromptSelect} />
            </div>
          )}

          {/* Messages */}
          {hasMessages && (
            <div className="space-y-6 py-6">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onSpeak={onSpeakMessage}
                  isSpeaking={voiceSettings.isSpeaking}
                />
              ))}

              {/* Typing indicator */}
              {isTyping && <TypingIndicator className="mt-4" />}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Chat input */}
      <div className="border-t bg-background/80 backdrop-blur-sm">
        <ChatInput
          onSendMessage={onSendMessage}
          onUploadImage={onUploadImage}
          onGenerateImage={onGenerateImage}
          onVoiceToggle={onVoiceToggle}
          isRecording={voiceSettings.isRecording}
          disabled={isTyping}
        />
      </div>
    </div>
  );
}
