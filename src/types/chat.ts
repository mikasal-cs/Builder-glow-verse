export interface Message {
  id: string;
  content: string;
  type: "text" | "image" | "generated-image";
  sender: "user" | "bot";
  timestamp: Date;
  image?: {
    url: string;
    alt?: string;
    caption?: string;
  };
  isTyping?: boolean;
  metadata?: {
    model?: string;
    processingTime?: number;
    tokens?: number;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  isArchived?: boolean;
}

export interface PromptSuggestion {
  id: string;
  text: string;
  category: "general" | "creative" | "coding" | "analysis" | "image-generation";
  icon?: string;
}

export interface ChatSettings {
  theme: "light" | "dark" | "system";
  soundEnabled: boolean;
  typingAnimationEnabled: boolean;
  autoSpeechEnabled: boolean;
  fontSize: "small" | "medium" | "large";
  language: string;
}

export interface VoiceSettings {
  isRecording: boolean;
  isSpeaking: boolean;
  voiceType: "male" | "female";
  speechRate: number;
  speechPitch: number;
}

export interface FileUpload {
  file: File;
  preview?: string;
  type: "image" | "document";
  status: "uploading" | "uploaded" | "error";
  progress?: number;
}
