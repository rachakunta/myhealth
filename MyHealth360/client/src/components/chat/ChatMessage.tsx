import { ChatMessage as ChatMessageType } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface ChatMessageProps {
  message: ChatMessageType;
  isCurrentUser: boolean;
}

export function ChatMessage({ message, isCurrentUser }: ChatMessageProps) {
  const formattedTime = format(new Date(message.sentAt), "h:mm a");
  
  return (
    <div className={cn(
      "flex gap-2 mb-4",
      isCurrentUser ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className="h-8 w-8 mt-0.5">
        <AvatarFallback>
          {message.isFromDoctor ? "DR" : "ME"}
        </AvatarFallback>
        {/* If we had avatar images, we could use this */}
        {/* <AvatarImage src={message.sender.avatar || undefined} /> */}
      </Avatar>
      
      <div className="max-w-[80%]">
        <div className={cn(
          "px-4 py-2 rounded-lg",
          isCurrentUser 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : "bg-muted text-foreground rounded-tl-none"
        )}>
          <p className="text-sm">{message.content}</p>
        </div>
        <p className={cn(
          "text-xs text-muted-foreground mt-1",
          isCurrentUser ? "text-right" : "text-left"
        )}>
          {formattedTime}
          {message.readAt && isCurrentUser && (
            <span className="ml-1 text-xs">• Read</span>
          )}
        </p>
      </div>
    </div>
  );
}