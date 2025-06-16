import { useState, useCallback, useRef } from "react";
import { Message, VoiceSettings } from "../types/chat";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      type: "text",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    isRecording: false,
    isSpeaking: false,
    voiceType: "female",
    speechRate: 1,
    speechPitch: 1,
  });

  const messageIdCounter = useRef(2);

  const addMessage = useCallback(
    (message: Omit<Message, "id" | "timestamp">) => {
      const newMessage: Message = {
        ...message,
        id: messageIdCounter.current.toString(),
        timestamp: new Date(),
      };
      messageIdCounter.current++;
      setMessages((prev) => [...prev, newMessage]);
      return newMessage;
    },
    [],
  );

  const simulateTyping = useCallback(() => {
    setIsTyping(true);
    // Simulate realistic typing delay
    const delay = Math.random() * 2000 + 1000;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }, []);

  const sendMessage = useCallback(
    async (content: string, type: Message["type"] = "text") => {
      // Add user message
      const userMessage = addMessage({
        content,
        type,
        sender: "user",
      });

      // Start typing indicator
      setIsTyping(true);

      try {
        const startTime = Date.now();

        // Prepare messages for API
        const apiMessages = [
          { role: "system", content: "You are a helpful assistant." },
          ...messages
            .filter((msg) => msg.sender === "user" || msg.sender === "bot")
            .map((msg) => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.content,
            })),
          { role: "user", content },
        ];

        // Call OpenRouter API
        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer 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",
              "HTTP-Referer": window.location.origin,
              "X-Title": "AI Assistant Chat",
            },
            body: JSON.stringify({
              model: "google/gemini-2.0-flash-001",
              messages: apiMessages,
              temperature: 0.7,
              max_tokens: 4000,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();
        const botResponse =
          data.choices?.[0]?.message?.content ||
          "I apologize, but I couldn't generate a response. Please try again.";
        const processingTime = Date.now() - startTime;

        // Add bot response
        addMessage({
          content: botResponse,
          type: "text",
          sender: "bot",
          metadata: {
            model: "Gemini 2.0 Flash",
            processingTime,
            tokens: data.usage?.total_tokens || 0,
          },
        });
      } catch (error) {
        console.error("API Error:", error);

        // Add error message
        addMessage({
          content:
            "I'm sorry, I encountered an error while processing your request. Please check your connection and try again.",
          type: "text",
          sender: "bot",
          metadata: {
            model: "Error",
            processingTime: 0,
            tokens: 0,
          },
        });
      } finally {
        setIsTyping(false);
      }
    },
    [addMessage, messages],
  );

  const uploadImage = useCallback(
    async (file: File) => {
      const imageUrl = URL.createObjectURL(file);

      addMessage({
        content: "Image uploaded",
        type: "image",
        sender: "user",
        image: {
          url: imageUrl,
          alt: file.name,
        },
      });

      // Simulate AI image analysis
      await simulateTyping();
      setIsTyping(false);

      addMessage({
        content:
          "I can see this is an interesting image! Could you tell me more about what you'd like to know or discuss about it?",
        type: "text",
        sender: "bot",
      });
    },
    [addMessage, simulateTyping],
  );

  const generateImage = useCallback(
    async (prompt: string) => {
      addMessage({
        content: `Generate image: ${prompt}`,
        type: "text",
        sender: "user",
      });

      await simulateTyping();
      setIsTyping(false);

      // Simulate generated image (would be replaced with actual DALL-E API)
      const placeholderImage = `https://picsum.photos/512/512?random=${Date.now()}`;

      addMessage({
        content: "Generated image based on your prompt",
        type: "generated-image",
        sender: "bot",
        image: {
          url: placeholderImage,
          alt: prompt,
          caption: `Generated image: ${prompt}`,
        },
      });
    },
    [addMessage, simulateTyping],
  );

  const startVoiceRecording = useCallback(() => {
    setVoiceSettings((prev) => ({ ...prev, isRecording: true }));
    // Voice recording implementation would go here
    console.log("Starting voice recording...");
  }, []);

  const stopVoiceRecording = useCallback(() => {
    setVoiceSettings((prev) => ({ ...prev, isRecording: false }));
    // Stop recording and process speech-to-text
    console.log("Stopping voice recording...");
  }, []);

  const speakMessage = useCallback(
    (text: string) => {
      if ("speechSynthesis" in window) {
        setVoiceSettings((prev) => ({ ...prev, isSpeaking: true }));

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = voiceSettings.speechRate;
        utterance.pitch = voiceSettings.speechPitch;

        utterance.onend = () => {
          setVoiceSettings((prev) => ({ ...prev, isSpeaking: false }));
        };

        speechSynthesis.speak(utterance);
      }
    },
    [voiceSettings.speechRate, voiceSettings.speechPitch],
  );

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: "1",
        content: "Hello! I'm your AI assistant. How can I help you today?",
        type: "text",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
    messageIdCounter.current = 2;
  }, []);

  return {
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
    setVoiceSettings,
  };
}

// Helper function to generate bot responses (would be replaced with actual AI API)
function generateBotResponse(
  userMessage: string,
  type: Message["type"],
): string {
  const responses = [
    "That's an interesting point! Let me think about that...",
    "I understand what you're asking. Here's my perspective on that:",
    "Great question! Based on my knowledge, I'd say:",
    "That's a thoughtful inquiry. Let me provide you with some insights:",
    "I can help you with that. Here's what I know:",
  ];

  const randomResponse =
    responses[Math.floor(Math.random() * responses.length)];

  if (type === "image") {
    return "I can see the image you've shared. Could you tell me what you'd like to know about it?";
  }

  return `${randomResponse} ${userMessage.split(" ").reverse().join(" ")} - This is a simulated response that will be replaced with actual AI integration.`;
}
