import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "../../providers/ThemeProvider";
import { testApiKey, testSimpleChat } from "../../utils/testApi";
import {
  Sun,
  Moon,
  Settings,
  Menu,
  Bot,
  MessageCircle,
  Sparkles,
  TestTube,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function Header({ onToggleSidebar, isSidebarOpen }: HeaderProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center px-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo and brand */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ai-gradient-from to-ai-gradient-to p-0.5">
              <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                <Bot className="w-5 h-5 text-ai-primary" />
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-ai-accent rounded-full flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">
              🤖 Mikasal's Assistant
            </h1>
            <p className="text-xs text-muted-foreground">
              Created by Sir Mikasal Marak
            </p>
          </div>
        </div>

        {/* Center status indicator */}
        <div className="flex-1 flex justify-center">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-muted/50">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Online</span>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          {/* Chat stats */}
          <div className="hidden lg:flex items-center space-x-4 text-sm text-muted-foreground mr-4">
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>LLaMA 3 70B</span>
            </div>
          </div>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative overflow-hidden group"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all group-hover:scale-110 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all group-hover:scale-110 dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Settings button */}
          <Button variant="ghost" size="icon" className="relative group">
            <Settings className="h-4 w-4 transition-transform group-hover:rotate-90" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>

      {/* Gradient border effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ai-primary to-transparent opacity-50" />
    </header>
  );
}
