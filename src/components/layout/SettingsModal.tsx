import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, MessageSquare, Info, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteAllChats: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  onDeleteAllChats,
}: SettingsModalProps) {
  const handleDeleteAll = () => {
    onDeleteAllChats();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-black border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-white">
            <Bot className="w-5 h-5 text-green-400" />
            <span>Mikasal's AI Assistant</span>
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Settings and information about your AI assistant
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* AI Info Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-medium text-white">AI Information</h3>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <p className="text-sm text-gray-300 mb-2">
                <strong className="text-white">Model:</strong> LLaMA 3 8B
                Instruct
              </p>
              <p className="text-sm text-gray-300 mb-2">
                <strong className="text-white">Provider:</strong> OpenRouter API
              </p>
              <p className="text-sm text-gray-300">
                <strong className="text-white">Created by:</strong> Sir Mikasal
                Marak
              </p>
            </div>
          </div>

          {/* Chat Management Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-green-400" />
              <h3 className="text-sm font-medium text-white">
                Chat Management
              </h3>
            </div>
            <div className="space-y-2">
              <Button
                variant="destructive"
                onClick={handleDeleteAll}
                className="w-full justify-start bg-red-900 hover:bg-red-800 text-white border-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete All Chats
              </Button>
              <p className="text-xs text-gray-400 px-2">
                This will permanently delete all chat history from this session
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white">Features</h3>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Text conversations with AI</li>
                <li>• Image upload and analysis</li>
                <li>• Voice input (speech-to-text)</li>
                <li>• Text-to-speech output</li>
                <li>• Chat history persistence</li>
                <li>• Mobile-responsive design</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
