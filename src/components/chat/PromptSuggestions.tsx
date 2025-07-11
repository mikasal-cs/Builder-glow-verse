import React from "react";
import { Button } from "@/components/ui/button";
import { PromptSuggestion } from "../../types/chat";
import {
  Lightbulb,
  Code,
  Image,
  FileText,
  Sparkles,
  MessageCircle,
  Zap,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptSuggestionsProps {
  onSelectPrompt: (prompt: string) => void;
  className?: string;
  title?: string;
  subtitle?: string;
}

const suggestions: PromptSuggestion[] = [
  {
    id: "1",
    text: "What's the weather like today?",
    category: "general",
    icon: "brain",
  },
  {
    id: "2",
    text: "Tell me a joke",
    category: "creative",
    icon: "lightbulb",
  },
  {
    id: "3",
    text: "Help me write a professional email",
    category: "general",
    icon: "file-text",
  },
  {
    id: "4",
    text: "Explain how AI works in simple terms",
    category: "general",
    icon: "brain",
  },
  {
    id: "5",
    text: "Give me some productivity tips",
    category: "analysis",
    icon: "sparkles",
  },
  {
    id: "6",
    text: "Help me plan my day",
    category: "general",
    icon: "lightbulb",
  },
];

const iconMap = {
  brain: Brain,
  code: Code,
  image: Image,
  lightbulb: Lightbulb,
  "file-text": FileText,
  sparkles: Sparkles,
  "message-circle": MessageCircle,
  zap: Zap,
};

const categoryColors = {
  general:
    "from-blue-500/10 to-blue-600/10 border-blue-200/50 hover:border-blue-300",
  coding:
    "from-green-500/10 to-green-600/10 border-green-200/50 hover:border-green-300",
  "image-generation":
    "from-purple-500/10 to-purple-600/10 border-purple-200/50 hover:border-purple-300",
  creative:
    "from-orange-500/10 to-orange-600/10 border-orange-200/50 hover:border-orange-300",
  analysis:
    "from-red-500/10 to-red-600/10 border-red-200/50 hover:border-red-300",
};

export function PromptSuggestions({
  onSelectPrompt,
  className,
  title = "Get started with these suggestions",
  subtitle = "Or type your own question below",
}: PromptSuggestionsProps) {
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent || MessageCircle;
  };

  const getCategoryColor = (category: PromptSuggestion["category"]) => {
    return categoryColors[category] || categoryColors.general;
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto px-4", className)}>
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold mb-2 gradient-text">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.map((suggestion) => {
          const IconComponent = getIcon(suggestion.icon || "message-circle");
          const colorClass = getCategoryColor(suggestion.category);

          return (
            <Button
              key={suggestion.id}
              variant="outline"
              onClick={() => onSelectPrompt(suggestion.text)}
              className={cn(
                "h-auto p-4 text-left justify-start bg-gradient-to-br",
                "transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
                "border border-border/50 hover:border-border",
                colorClass,
              )}
            >
              <div className="flex items-start space-x-3 w-full">
                <div className="mt-0.5">
                  <IconComponent className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1">
                    {suggestion.text}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground capitalize">
                      {suggestion.category.replace("-", " ")}
                    </span>
                    <Zap className="w-3 h-3 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          Click any suggestion to start a conversation, or type your own message
        </p>
      </div>
    </div>
  );
}
