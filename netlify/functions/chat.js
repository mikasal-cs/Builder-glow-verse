exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle OPTIONS requests for CORS preflight
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
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    console.log("Received request:", event.httpMethod);

    if (!event.body) {
      throw new Error("No request body provided");
    }

    const requestBody = JSON.parse(event.body);
    console.log("Request body parsed successfully");

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer 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",
          "HTTP-Referer": "https://mikasalpersonalassistant.netlify.app",
          "X-Title": "Mikasal's AI Assistant",
        },
        body: JSON.stringify(requestBody),
      },
    );

    console.log("OpenRouter API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);
      throw new Error(
        `OpenRouter API error: ${response.status} - ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log("Response received successfully");

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        message: error.message,
        details: "Check function logs for more information",
      }),
    };
  }
};
