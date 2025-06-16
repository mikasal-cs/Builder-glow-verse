import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, Bot, ArrowLeft, Sparkles } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-ai-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ai-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-ai-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="text-center max-w-md mx-auto px-6">
        {/* AI Bot Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-ai-gradient-from to-ai-gradient-to p-1">
            <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
              <Bot className="w-12 h-12 text-ai-primary" />
            </div>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-ai-accent rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-ai-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold gradient-text mb-3">
            Page Not Found
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Oops! It looks like this page wandered off into the digital void.
            Don't worry, our AI assistant is still here to help you find what
            you're looking for.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => navigate("/")}
            className="w-full bg-ai-primary hover:bg-ai-primary/90 text-white"
            size="lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Return to Chat
          </Button>

          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Need assistance? Start a conversation with our AI assistant and ask
            for help navigating the application.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
