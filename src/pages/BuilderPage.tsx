import React from "react";
import { useLocation } from "react-router-dom";
import { BuilderContent } from "../components/builder/BuilderContent";
import { Header } from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { useChatHistory } from "../hooks/useChatHistory";

export default function BuilderPage() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { createNewSession } = useChatHistory();

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleNewChat = () => {
    createNewSession();
  };

  const handleLoadChat = () => {
    // Handle chat loading logic
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

        {/* Builder.io content */}
        <div className="flex-1 overflow-hidden">
          <BuilderContent model="page" url={location.pathname} />
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
}
