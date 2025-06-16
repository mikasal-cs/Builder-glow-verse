import { RegisteredComponent } from "@builder.io/react";
import React from "react";

// React components for Builder.io (no dynamic imports needed for React Router)
const ChatContainer = React.lazy(() =>
  import("./src/components/chat/ChatContainer").then((mod) => ({
    default: mod.ChatContainer,
  })),
);

const PromptSuggestions = React.lazy(() =>
  import("./src/components/chat/PromptSuggestions").then((mod) => ({
    default: mod.PromptSuggestions,
  })),
);

const MessageBubble = React.lazy(() =>
  import("./src/components/chat/MessageBubble").then((mod) => ({
    default: mod.MessageBubble,
  })),
);

const Header = React.lazy(() =>
  import("./src/components/layout/Header").then((mod) => ({
    default: mod.Header,
  })),
);

export const customComponents: RegisteredComponent[] = [
  {
    component: ChatContainer,
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
      {
        name: "className",
        type: "string",
        defaultValue: "",
        helperText: "Additional CSS classes",
      },
    ],
    canHaveChildren: false,
  },
  {
    component: PromptSuggestions,
    name: "PromptSuggestions",
    inputs: [
      {
        name: "title",
        type: "string",
        defaultValue: "Get started with these suggestions",
        helperText: "Main title text",
      },
      {
        name: "subtitle",
        type: "string",
        defaultValue: "Or type your own question below",
        helperText: "Subtitle text below the main title",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "",
        helperText: "Additional CSS classes",
      },
    ],
    canHaveChildren: false,
  },
  {
    component: Header,
    name: "AIAssistantHeader",
    inputs: [
      {
        name: "isSidebarOpen",
        type: "boolean",
        defaultValue: false,
        helperText: "Whether the sidebar is currently open",
      },
    ],
    canHaveChildren: false,
  },
];
