import { ChatSession } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatSessionListProps {
  sessions: ChatSession[];
  selectedSessionId: number | null;
  onSelectSession: (sessionId: number) => void;
  onCreateSession: () => void;
  isLoading: boolean;
}

export function ChatSessionList({ 
  sessions, 
  selectedSessionId, 
  onSelectSession, 
  onCreateSession,
  isLoading
}: ChatSessionListProps) {
  if (isLoading) {
    return (
      <div className="p-4 border-r h-full overflow-y-auto space-y-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Messages</h2>
          <Button size="sm" variant="ghost" disabled>
            <PlusIcon className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="p-3 border rounded-md flex flex-col gap-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="p-4 border-r h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Messages</h2>
        <Button size="sm" variant="outline" onClick={onCreateSession}>
          <PlusIcon className="h-4 w-4 mr-2" />
          New
        </Button>
      </div>
      
      {sessions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No conversations yet</p>
          <Button 
            variant="link" 
            onClick={onCreateSession}
            className="mt-2"
          >
            Start a new conversation
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {sessions.map((session) => (
            <button
              key={session.id}
              className={cn(
                "p-3 w-full text-left border rounded-md hover:bg-accent transition-colors",
                selectedSessionId === session.id && "bg-accent"
              )}
              onClick={() => onSelectSession(session.id)}
            >
              <div className="font-medium truncate">{session.subject}</div>
              <p className="text-sm text-muted-foreground truncate">
                {"No messages yet"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(session.startedAt), "MMM d, yyyy • h:mm a")}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}