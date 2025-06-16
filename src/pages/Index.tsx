import React, { useState, useEffect } from "react";
import { Header } from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { ChatContainer } from "../components/chat/ChatContainer";
import { useChat } from "../hooks/useChat";
import { useChatHistory } from "../hooks/useChatHistory";
import { cn } from "@/lib/utils";

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    messages,
    isTyping,
    voiceSettings,
    sendMessage,
    uploadImage,
    generateImage,
    startVoiceRecording,
    stopVoiceRecording,
    speakMessage,
    clearMessages,
  } = useChat();

  const { saveCurrentChat } = useChatHistory();

  // Handle mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-save chat history
  useEffect(() => {
    if (messages.length > 1) {
      saveCurrentChat(messages);
    }
  }, [messages, saveCurrentChat]);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleNewChat = () => {
    clearMessages();
  };

  const handleLoadChat = (loadedMessages: any[]) => {
    // This would typically replace the current messages with loaded ones
    // For now, we'll just start a new chat
    clearMessages();
  };

  const handleVoiceToggle = (isRecording: boolean) => {
    if (isRecording) {
      startVoiceRecording();
    } else {
      stopVoiceRecording();
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        onNewChat={handleNewChat}
        onLoadChat={handleLoadChat}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <Header
          onToggleSidebar={handleToggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Chat container */}
        <div className="flex-1 overflow-hidden">
          <ChatContainer
            messages={messages}
            isTyping={isTyping}
            voiceSettings={voiceSettings}
            onSendMessage={sendMessage}
            onUploadImage={uploadImage}
            onGenerateImage={generateImage}
            onVoiceToggle={handleVoiceToggle}
            onSpeakMessage={speakMessage}
          />
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-ai-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ai-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-ai-accent/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default Index;
