import { useState, useCallback, useRef } from "react";
import { Message, VoiceSettings } from "../types/chat";
import { toast } from "@/components/ui/use-toast";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "👋 Hi! I'm Mikasal's personal AI assistant, created by Sir Mikasal Marak. How can I help you today?",
      type: "text",
      sender: "bot",
      timestamp: new Date(),
      metadata: {
        model: "LLaMA 3 70B",
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

        // LLaMA 3 OpenRouter API configuration
        const openRouterApiKey =
          "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";

        console.log("Using LLaMA 3 via OpenRouter for chat completion...");
        console.log(
          "API Key format:",
          openRouterApiKey.substring(0, 20) + "...",
        );

        // Prepare messages for OpenRouter API
        const apiMessages = [
          {
            role: "system",
            content:
              "You are Mikasal's personal assistant. Respond helpfully, clearly, and politely. If someone asks who created you or who you are, reply: 'I am Mikasal's personal assistant, created by Sir Mikasal Marak.'",
          },
          ...messages
            .filter((msg) => msg.sender === "user" || msg.sender === "bot")
            .map((msg) => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.content,
            })),
          { role: "user", content },
        ];

        const requestBody = {
          model: "meta-llama/llama-3-70b-instruct",
          messages: apiMessages,
        };

        console.log("Request body:", JSON.stringify(requestBody, null, 2));
        console.log("Making request to OpenRouter...");

        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${openRouterApiKey}`,
              "HTTP-Referer": "http://localhost",
              "X-Title": "llama3-chatbot",
            },
            body: JSON.stringify(requestBody),
          },
        );

        console.log("API Response status:", response.status);
        console.log("API Response ok:", response.ok);
        console.log("API Response statusText:", response.statusText);

        const responseText = await response.text();
        console.log("Response text length:", responseText.length);
        console.log("Response text preview:", responseText.substring(0, 200));

        if (!response.ok) {
          console.error("OpenRouter Error Details:");
          console.error("Status:", response.status);
          console.error("Status Text:", response.statusText);
          console.error("Response:", responseText);

          if (response.status === 401) {
            throw new Error(
              "OpenRouter authentication failed. Please check the API key.",
            );
          } else if (response.status === 403) {
            throw new Error(
              "OpenRouter access forbidden. Please check your subscription.",
            );
          } else if (response.status === 429) {
            throw new Error(
              "OpenRouter rate limit exceeded. Please try again later.",
            );
          } else {
            throw new Error(
              `OpenRouter error: ${response.status} - ${response.statusText}: ${responseText}`,
            );
          }
        }

        let data;
        try {
          data = JSON.parse(responseText);
          console.log("Parsed response data:", data);
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          console.error("Raw response:", responseText);
          throw new Error("Invalid JSON response from API");
        }

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
            model: "LLaMA 3 70B",
            processingTime,
            tokens: data.usage?.total_tokens || 0,
          },
        });
      } catch (error) {
        console.error("API Error:", error);
        console.error("Error details:", {
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : "No stack trace",
        });

        let errorMessage =
          "I'm sorry, I encountered an error while processing your request.";
        let toastMessage = "Failed to connect to AI service.";

        if (error instanceof TypeError && error.message.includes("fetch")) {
          errorMessage =
            "I'm having trouble connecting to the AI service. Please check your internet connection.";
          toastMessage = "Network error - failed to connect to OpenRouter.";
        } else if (error instanceof Error && error.message.includes("401")) {
          errorMessage =
            "Authentication failed. Please check the OpenRouter API configuration.";
          toastMessage = "OpenRouter authentication error.";
        } else if (error instanceof Error && error.message.includes("429")) {
          errorMessage =
            "I'm currently experiencing high demand. Please try again in a moment.";
          toastMessage = "OpenRouter rate limit exceeded. Please wait.";
        }

        toast({
          title: "OpenRouter Connection Error",
          description: toastMessage,
          variant: "destructive",
        });

        // Add error message
        addMessage({
          content: errorMessage,
          type: "text",
          sender: "bot",
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
        const openRouterApiKey =
          "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";

        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${openRouterApiKey}`,
              "HTTP-Referer": "http://localhost",
              "X-Title": "llama3-chatbot",
            },
            body: JSON.stringify({
              model: "meta-llama/llama-3-70b-instruct",
              messages: [
                {
                  role: "system",
                  content:
                    "You are Mikasal's helpful personal AI assistant that can analyze images.",
                },
                {
                  role: "user",
                  content:
                    "I've uploaded an image. Can you help me analyze or discuss it?",
                },
              ],
            }),
          },
        );

        const responseText = await response.text();

        if (!response.ok) {
          throw new Error(
            `OpenRouter API error: ${response.status} - ${responseText}`,
          );
        }

        const data = JSON.parse(responseText);
        const botResponse =
          data.choices?.[0]?.message?.content ||
          "I can see you've uploaded an image. What would you like to know about it?";

        addMessage({
          content: botResponse,
          type: "text",
          sender: "bot",
          metadata: {
            model: "LLaMA 3 70B",
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
      // Image generation disabled as requested
      addMessage({
        content: `I understand you'd like me to generate an image, but I don't have image generation capabilities. However, I can help you with text-based tasks, analysis, coding, and many other things. What else can I assist you with?`,
        type: "text",
        sender: "bot",
        metadata: {
          model: "Gemini 2.0 Flash",
          processingTime: 100,
          tokens: 30,
        },
      });
    },
    [addMessage],
  );

  const startVoiceRecording = useCallback(() => {
    setVoiceSettings((prev) => ({ ...prev, isRecording: true }));
    console.log("Voice recording started - using Web Speech API");
  }, []);

  const stopVoiceRecording = useCallback(() => {
    setVoiceSettings((prev) => ({ ...prev, isRecording: false }));
    console.log("Voice recording stopped");
  }, []);

  const speakMessage = useCallback(
    (text: string) => {
      if ("speechSynthesis" in window) {
        // Stop any current speech
        speechSynthesis.cancel();

        setVoiceSettings((prev) => ({ ...prev, isSpeaking: true }));

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = voiceSettings.speechRate;
        utterance.pitch = voiceSettings.speechPitch;
        utterance.volume = 1;

        // Try to get a more natural voice
        const voices = speechSynthesis.getVoices();
        const preferredVoice =
          voices.find(
            (voice) =>
              voice.lang.includes("en") &&
              (voice.name.includes("Google") ||
                voice.name.includes("Microsoft")),
          ) ||
          voices.find((voice) => voice.lang.includes("en")) ||
          voices[0];

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onend = () => {
          setVoiceSettings((prev) => ({ ...prev, isSpeaking: false }));
        };

        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event);
          setVoiceSettings((prev) => ({ ...prev, isSpeaking: false }));
        };

        speechSynthesis.speak(utterance);
      } else {
        toast({
          title: "Text-to-Speech Not Available",
          description: "Your browser doesn't support text-to-speech.",
          variant: "destructive",
        });
      }
    },
    [voiceSettings.speechRate, voiceSettings.speechPitch],
  );

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: "1",
        content:
          "👋 Hi! I'm Mikasal's personal AI assistant, created by Sir Mikasal Marak. How can I help you today?",
        type: "text",
        sender: "bot",
        timestamp: new Date(),
        metadata: {
          model: "LLaMA 3 70B",
          processingTime: 0,
          tokens: 0,
        },
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
