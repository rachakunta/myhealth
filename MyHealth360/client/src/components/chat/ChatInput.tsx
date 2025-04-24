import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PaperPlaneIcon } from "@radix-ui/react-icons";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isConnected: boolean;
}

export function ChatInput({ onSendMessage, isConnected }: ChatInputProps) {
  const [message, setMessage] = useState("");
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    onSendMessage(message);
    setMessage("");
  };
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className="border-t p-4 flex gap-2 items-end"
    >
      <Textarea
        placeholder={isConnected ? "Type your message..." : "Connecting..."}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-[80px] resize-none"
        disabled={!isConnected}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (message.trim()) {
              onSendMessage(message);
              setMessage("");
            }
          }
        }}
      />
      <Button 
        type="submit" 
        size="icon" 
        disabled={!message.trim() || !isConnected}
      >
        <PaperPlaneIcon className="h-4 w-4" />
      </Button>
    </form>
  );
}