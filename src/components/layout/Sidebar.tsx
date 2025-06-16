import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatHistory } from "../../hooks/useChatHistory";
import {
  Plus,
  MessageSquare,
  Trash2,
  Download,
  Upload,
  X,
  Calendar,
  Archive,
} from "lucide-react";
import { ChatSession } from "../../types/chat";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onLoadChat: (messages: any[]) => void;
}

export function Sidebar({
  isOpen,
  onClose,
  onNewChat,
  onLoadChat,
}: SidebarProps) {
  const {
    sessions,
    currentSessionId,
    createNewSession,
    deleteSession,
    loadSession,
    clearAllHistory,
    exportHistory,
  } = useChatHistory();

  const handleNewChat = () => {
    onNewChat();
    createNewSession();
    onClose();
  };

  const handleLoadSession = (sessionId: string) => {
    const messages = loadSession(sessionId);
    onLoadChat(messages);
    onClose();
  };

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    deleteSession(sessionId);
  };

  const groupSessionsByDate = (sessions: ChatSession[]) => {
    const groups: Record<string, ChatSession[]> = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: [],
    };

    sessions.forEach((session) => {
      if (isToday(session.updatedAt)) {
        groups.today.push(session);
      } else if (isYesterday(session.updatedAt)) {
        groups.yesterday.push(session);
      } else if (isThisWeek(session.updatedAt)) {
        groups.thisWeek.push(session);
      } else {
        groups.older.push(session);
      }
    });

    return groups;
  };

  const sessionGroups = groupSessionsByDate(sessions);

  const renderSessionGroup = (title: string, sessions: ChatSession[]) => {
    if (sessions.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">
          {title}
        </h3>
        <div className="space-y-1">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                "group relative mx-2 rounded-lg p-3 cursor-pointer transition-all duration-200",
                "hover:bg-muted/80 hover:shadow-sm",
                currentSessionId === session.id
                  ? "bg-ai-primary/10 border border-ai-primary/20"
                  : "hover:bg-muted/60",
              )}
              onClick={() => handleLoadSession(session.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <p className="text-sm font-medium truncate">
                      {session.title}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{format(session.updatedAt, "MMM d, HH:mm")}</span>
                    <span>•</span>
                    <span>{session.messages.length} messages</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={(e) => handleDeleteSession(e, session.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-80 transform transition-transform duration-300 ease-in-out",
          "md:relative md:translate-x-0",
          "bg-background/95 backdrop-blur-md border-r",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Chat History</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="md:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* New chat button */}
          <div className="p-4 border-b">
            <Button
              onClick={handleNewChat}
              className="w-full justify-start bg-ai-primary hover:bg-ai-primary/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Chat sessions */}
          <ScrollArea className="flex-1 p-2">
            {sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
                <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No chat history yet</p>
                <p className="text-xs">Start a conversation to see it here</p>
              </div>
            ) : (
              <div className="pb-4">
                {renderSessionGroup("Today", sessionGroups.today)}
                {renderSessionGroup("Yesterday", sessionGroups.yesterday)}
                {renderSessionGroup("This Week", sessionGroups.thisWeek)}
                {renderSessionGroup("Older", sessionGroups.older)}
              </div>
            )}
          </ScrollArea>

          {/* Footer actions */}
          <div className="p-4 border-t space-y-2">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportHistory}
                className="flex-1"
                disabled={sessions.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = ".json";
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      // Import functionality would be implemented here
                      console.log("Import file:", file);
                    }
                  };
                  input.click();
                }}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </div>
            {sessions.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={clearAllHistory}
                className="w-full"
              >
                <Archive className="w-4 h-4 mr-2" />
                Clear All History
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
