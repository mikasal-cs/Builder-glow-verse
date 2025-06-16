import { useState, useCallback, useRef } from "react";
import { Message, VoiceSettings } from "../types/chat";
import { toast } from "@/components/ui/use-toast";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI assistant powered by Google's Gemini 2.0 Flash model. I can help you with questions, analysis, creative tasks, and more. How can I assist you today?",
      type: "text",
      sender: "bot",
      timestamp: new Date(),
      metadata: {
        model: "Gemini 2.0 Flash",
        processingTime: 0,
        tokens: 0,
      },
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

        toast({
          title: "Connection Error",
          description: "Failed to connect to AI service. Please try again.",
          variant: "destructive",
        });

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

      // Send image analysis request
      setIsTyping(true);

      try {
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
              messages: [
                {
                  role: "system",
                  content:
                    "You are a helpful assistant that can analyze images.",
                },
                {
                  role: "user",
                  content:
                    "I've uploaded an image. Can you help me analyze or discuss it?",
                },
              ],
              temperature: 0.7,
              max_tokens: 4000,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const botResponse =
          data.choices?.[0]?.message?.content ||
          "I can see you've uploaded an image. What would you like to know about it?";

        addMessage({
          content: botResponse,
          type: "text",
          sender: "bot",
          metadata: {
            model: "Gemini 2.0 Flash",
            processingTime: 1000,
            tokens: data.usage?.total_tokens || 0,
          },
        });
      } catch (error) {
        console.error("Image analysis error:", error);

        toast({
          title: "Image Analysis Error",
          description: "Unable to analyze the image. Please try again.",
          variant: "destructive",
        });

        addMessage({
          content:
            "I can see you've uploaded an image, but I'm having trouble analyzing it right now. Could you describe what you'd like to know about it?",
          type: "text",
          sender: "bot",
        });
      } finally {
        setIsTyping(false);
      }
    },
    [addMessage],
  );

  const generateImage = useCallback(
    async (prompt: string) => {
      addMessage({
        content: `Generate image: ${prompt}`,
        type: "text",
        sender: "user",
      });

      setIsTyping(true);

      try {
        // For now, we'll use a placeholder since Gemini doesn't generate images directly
        // This would be replaced with an actual image generation API like DALL-E
        const placeholderImage = `https://picsum.photos/512/512?random=${Date.now()}`;

        addMessage({
          content: `I understand you'd like me to generate an image with the prompt: "${prompt}". While I can't directly generate images yet, I can help you refine your prompt or suggest where you might get such an image created.`,
          type: "text",
          sender: "bot",
          metadata: {
            model: "Gemini 2.0 Flash",
            processingTime: 1000,
            tokens: 50,
          },
        });
      } catch (error) {
        console.error("Image generation error:", error);
        addMessage({
          content:
            "I'm sorry, I can't generate images at the moment. However, I can help you create a detailed description or suggest alternatives.",
          type: "text",
          sender: "bot",
        });
      } finally {
        setIsTyping(false);
      }
    },
    [addMessage],
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
