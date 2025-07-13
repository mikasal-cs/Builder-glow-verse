import { Handler } from "@netlify/functions";

const OPENROUTER_API_KEY =
  process.env.OPENROUTER_API_KEY ||
  "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";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "meta-llama/llama-3-8b-instruct";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  temperature?: number;
}

const handler: Handler = async (event, context) => {
  // Enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // Parse request body
    const { messages, temperature = 0.7 }: ChatRequest = JSON.parse(
      event.body || "{}",
    );

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid messages format" }),
      };
    }

    // Sanitize and validate messages
    const sanitizedMessages = messages
      .map((msg) => ({
        role: msg.role,
        content: (msg.content || "").toString().trim().substring(0, 10000), // Limit content length
      }))
      .filter((msg) => msg.content.length > 0);

    if (sanitizedMessages.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "No valid messages provided" }),
      };
    }

    // Add system message if not present
    if (sanitizedMessages[0]?.role !== "system") {
      sanitizedMessages.unshift({
        role: "system",
        content:
          "You are Mikasal's personal assistant. Respond helpfully, clearly, and politely. If someone asks who created you or who you are, reply: 'I am Mikasal's personal assistant, created by Sir Mikasal Marak.'",
      });
    }

    console.log("Making request to OpenRouter with model:", MODEL);

    // Call OpenRouter API with retry logic
    let response;
    let attempt = 0;
    const maxAttempts = 2;

    while (attempt < maxAttempts) {
      try {
        response = await fetch(OPENROUTER_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": "https://mikasalpersonalassitant.netlify.app",
            "X-Title": "Mikasal Personal Assistant",
          },
          body: JSON.stringify({
            model: MODEL,
            messages: sanitizedMessages,
            temperature: Math.max(0, Math.min(2, temperature)), // Clamp temperature between 0-2
          }),
        });

        if (response.ok) {
          break; // Success, exit retry loop
        }

        // If rate limited (429) or server error (5xx), retry once
        if (
          (response.status === 429 || response.status >= 500) &&
          attempt < maxAttempts - 1
        ) {
          console.log(
            `API request failed with status ${response.status}, retrying...`,
          );
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
          attempt++;
          continue;
        }

        // For other errors, don't retry
        break;
      } catch (networkError) {
        console.error("Network error:", networkError);
        if (attempt < maxAttempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          attempt++;
          continue;
        }
        throw networkError;
      }
    }

    if (!response || !response.ok) {
      const errorText = (await response?.text()) || "Network error";
      console.error("OpenRouter API error:", response?.status, errorText);

      return {
        statusCode: response?.status || 500,
        headers,
        body: JSON.stringify({
          error: "Failed to get AI response",
          details:
            response?.status === 429 ? "Rate limit exceeded" : "API error",
        }),
      };
    }

    const data = await response.json();
    const botReply =
      data.choices?.[0]?.message?.content ||
      "I apologize, but I couldn't generate a response. Please try again.";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        reply: botReply.trim(),
        model: MODEL,
        usage: data.usage,
      }),
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};

export { handler };
