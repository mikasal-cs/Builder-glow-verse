export async function testApiKey() {
  try {
    console.log("Testing API key...");

    const response = await fetch("https://openrouter.ai/api/v1/auth/key", {
      method: "GET",
      headers: {
        Authorization:
          "Bearer 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",
      },
    });

    console.log("Auth test response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("API key is valid:", data);
      return { valid: true, data };
    } else {
      const errorText = await response.text();
      console.error("API key validation failed:", errorText);
      return { valid: false, error: errorText };
    }
  } catch (error) {
    console.error("Error testing API key:", error);
    return { valid: false, error: error.message };
  }
}

export async function testSimpleChat() {
  try {
    console.log("Testing simple chat request...");

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer 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",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-thinking-exp",
          messages: [{ role: "user", content: "Hello" }],
          max_tokens: 10,
        }),
      },
    );

    console.log("Chat test response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("Chat test successful:", data);
      return { success: true, data };
    } else {
      const errorText = await response.text();
      console.error("Chat test failed:", errorText);
      return { success: false, error: errorText };
    }
  } catch (error) {
    console.error("Error testing chat:", error);
    return { success: false, error: error.message };
  }
}
