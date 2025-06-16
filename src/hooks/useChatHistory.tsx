import { useState, useCallback, useEffect } from "react";
import { ChatSession, Message } from "../types/chat";

const STORAGE_KEY = "ai-chat-history";

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedSessions = JSON.parse(stored).map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
        setSessions(parsedSessions);
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    }
  }, []);

  // Save sessions to localStorage whenever sessions change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  const createNewSession = useCallback(
    (title?: string): ChatSession => {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: title || `Chat ${sessions.length + 1}`,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setSessions((prev) => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      return newSession;
    },
    [sessions.length],
  );

  const updateSession = useCallback(
    (sessionId: string, updates: Partial<ChatSession>) => {
      setSessions((prev) =>
        prev.map((session) =>
          session.id === sessionId
            ? { ...session, ...updates, updatedAt: new Date() }
            : session,
        ),
      );
    },
    [],
  );

  const deleteSession = useCallback(
    (sessionId: string) => {
      setSessions((prev) => prev.filter((session) => session.id !== sessionId));
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
      }
    },
    [currentSessionId],
  );

  const addMessageToSession = useCallback(
    (sessionId: string, message: Message) => {
      updateSession(sessionId, {
        messages: [
          ...(sessions.find((s) => s.id === sessionId)?.messages || []),
          message,
        ],
      });
    },
    [sessions, updateSession],
  );

  const getCurrentSession = useCallback((): ChatSession | null => {
    return sessions.find((session) => session.id === currentSessionId) || null;
  }, [sessions, currentSessionId]);

  const getSessionTitle = useCallback((messages: Message[]): string => {
    if (messages.length === 0) return "New Chat";

    const firstUserMessage = messages.find((msg) => msg.sender === "user");
    if (firstUserMessage) {
      return (
        firstUserMessage.content.slice(0, 50) +
        (firstUserMessage.content.length > 50 ? "..." : "")
      );
    }

    return "New Chat";
  }, []);

  const saveCurrentChat = useCallback(
    (messages: Message[]) => {
      if (messages.length <= 1) return; // Don't save empty chats

      const title = getSessionTitle(messages);
      const existingSession = getCurrentSession();

      if (existingSession) {
        updateSession(existingSession.id, { messages, title });
      } else {
        const newSession = createNewSession(title);
        updateSession(newSession.id, { messages });
      }
    },
    [createNewSession, getCurrentSession, getSessionTitle, updateSession],
  );

  const loadSession = useCallback(
    (sessionId: string) => {
      const session = sessions.find((s) => s.id === sessionId);
      if (session) {
        setCurrentSessionId(sessionId);
        return session.messages;
      }
      return [];
    },
    [sessions],
  );

  const clearAllHistory = useCallback(() => {
    setSessions([]);
    setCurrentSessionId(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const exportHistory = useCallback(() => {
    const dataStr = JSON.stringify(sessions, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chat-history-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [sessions]);

  const importHistory = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSessions = JSON.parse(e.target?.result as string);
        const validatedSessions = importedSessions.map((session: any) => ({
          ...session,
          id: session.id || Date.now().toString(),
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
        setSessions((prev) => [...validatedSessions, ...prev]);
      } catch (error) {
        console.error("Failed to import chat history:", error);
      }
    };
    reader.readAsText(file);
  }, []);

  return {
    sessions,
    currentSessionId,
    createNewSession,
    updateSession,
    deleteSession,
    addMessageToSession,
    getCurrentSession,
    saveCurrentChat,
    loadSession,
    clearAllHistory,
    exportHistory,
    importHistory,
    setCurrentSessionId,
  };
}
