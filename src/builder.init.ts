import { Builder } from "@builder.io/react";

// Initialize Builder.io with error handling
const BUILDER_API_KEY =
  import.meta.env.VITE_BUILDER_API_KEY || "your-builder-api-key";

// Only initialize Builder.io if we have a valid API key and we're in a stable environment
let builderInitialized = false;

try {
  if (
    typeof window !== "undefined" &&
    BUILDER_API_KEY !== "your-builder-api-key" &&
    !window.location.hostname.includes("projects.builder.codes")
  ) {
    Builder.init(BUILDER_API_KEY);
    builderInitialized = true;
  }
} catch (error) {
  console.warn("Builder.io initialization skipped:", error);
}

// Register components individually to avoid import issues
const registerBuilderComponents = () => {
  // Only register if Builder.io was successfully initialized
  if (builderInitialized) {
    try {
      // Register ChatContainer
      Builder.registerComponent(
        () =>
          import("../components/chat/ChatContainer").then(
            (m) => m.ChatContainer,
          ),
        {
          name: "ChatContainer",
          inputs: [
            {
              name: "title",
              type: "string",
              defaultValue: "Get started with these suggestions",
              helperText: "Title shown above prompt suggestions",
            },
            {
              name: "subtitle",
              type: "string",
              defaultValue: "Or type your own question below",
              helperText: "Subtitle shown below the title",
            },
            {
              name: "showPromptSuggestions",
              type: "boolean",
              defaultValue: true,
              helperText: "Show or hide the prompt suggestions section",
            },
          ],
        },
      );

      // Register PromptSuggestions
      Builder.registerComponent(
        () =>
          import("../components/chat/PromptSuggestions").then(
            (m) => m.PromptSuggestions,
          ),
        {
          name: "PromptSuggestions",
          inputs: [
            {
              name: "title",
              type: "string",
              defaultValue: "Get started with these suggestions",
            },
            {
              name: "subtitle",
              type: "string",
              defaultValue: "Or type your own question below",
            },
          ],
        },
      );

      // Register Header
      Builder.registerComponent(
        () => import("../components/layout/Header").then((m) => m.Header),
        {
          name: "AIAssistantHeader",
          inputs: [
            {
              name: "isSidebarOpen",
              type: "boolean",
              defaultValue: false,
            },
          ],
        },
      );
    } catch (error) {
      console.warn("Builder.io component registration failed:", error);
    }
  }
};

// Auto-register components
registerBuilderComponents();

export { Builder };
