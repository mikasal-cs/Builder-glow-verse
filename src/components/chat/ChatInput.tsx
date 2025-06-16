import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Paperclip,
  Mic,
  MicOff,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FileUpload } from "../../types/chat";
import { toast } from "@/components/ui/use-toast";

interface ChatInputProps {
  onSendMessage: (content: string, type?: "text" | "image") => void;
  onUploadImage: (file: File) => void;
  onVoiceToggle: (isRecording: boolean) => void;
  isRecording?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSendMessage,
  onUploadImage,
  onVoiceToggle,
  isRecording = false,
  disabled = false,
  placeholder = "Type your message here...",
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsListening(false);

        // Auto-resize textarea
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
          textareaRef.current.style.height =
            Math.min(textareaRef.current.scrollHeight, 150) + "px";
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        toast({
          title: "Voice Input Error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!message.trim() || disabled) return;

      onSendMessage(message.trim());
      setMessage("");
      setUploadedFiles([]);

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    },
    [message, disabled, onSendMessage],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit],
  );

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value);

      // Auto-resize textarea
      const textarea = e.target;
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px";
    },
    [],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);

      files.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const newUpload: FileUpload = {
            file,
            preview: URL.createObjectURL(file),
            type: "image",
            status: "uploaded",
          };

          setUploadedFiles((prev) => [...prev, newUpload]);
          onUploadImage(file);
        }
      });

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [onUploadImage],
  );

  const removeUploadedFile = useCallback((index: number) => {
    setUploadedFiles((prev) => {
      const newFiles = [...prev];
      if (newFiles[index]?.preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  }, []);

  const handleVoiceInput = useCallback(() => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice input.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  }, [isListening]);

  const isMessageValid = message.trim().length > 0;
  const canSend = isMessageValid && !disabled;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* File previews */}
      {uploadedFiles.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {uploadedFiles.map((upload, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden bg-muted/50 p-2"
            >
              <div className="flex items-center space-x-2">
                {upload.preview && (
                  <img
                    src={upload.preview}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {upload.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(upload.file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeUploadedFile(index)}
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main input container */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative glass rounded-2xl border border-border/50 shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl focus-within:ring-2 focus-within:ring-ai-primary/20">
          {/* Textarea */}
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "min-h-[3rem] max-h-[200px] resize-none border-0 bg-transparent",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-muted-foreground/70",
              "text-sm leading-relaxed px-4 py-3 pr-20",
            )}
            style={{ height: "auto" }}
          />

          {/* Action buttons */}
          <div className="absolute right-2 bottom-2 flex items-center space-x-1">
            {/* Voice recording button */}
            <Button
              type="button"
              variant={isRecording ? "destructive" : "ghost"}
              size="icon"
              onClick={handleVoiceToggle}
              className={cn(
                "h-8 w-8 transition-all duration-200",
                isRecording && "animate-pulse-glow",
              )}
            >
              {isRecording ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </Button>

            {/* File upload button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 w-8"
              disabled={disabled}
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            {/* Send button */}
            <Button
              type="submit"
              size="icon"
              disabled={!canSend}
              className={cn(
                "h-8 w-8 transition-all duration-200",
                canSend
                  ? "bg-ai-primary hover:bg-ai-primary/90 text-white"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Bottom action buttons */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-2">
            {/* Image upload */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-muted-foreground hover:text-foreground"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Upload Image
            </Button>

            {/* Image generation toggle */}
            <Button
              type="button"
              variant={isImageGenMode ? "default" : "ghost"}
              size="sm"
              onClick={toggleImageGenMode}
              className={cn(
                isImageGenMode
                  ? "bg-ai-primary text-white hover:bg-ai-primary/90"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Palette className="w-4 h-4 mr-2" />
              Generate Image
            </Button>
          </div>

          {/* Character count and shortcuts */}
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>{message.length} / 4000</span>
            <span>•</span>
            <span className="hidden sm:inline">
              Enter to send, Shift+Enter for new line
            </span>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </form>
    </div>
  );
}
