import { useRef, useEffect, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatSessionList } from "./ChatSessionList";
import { useChat } from "@/hooks/use-chat";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2Icon, AlertCircleIcon, WifiOffIcon } from "lucide-react";

// Form schema for creating a new chat session
const newSessionSchema = z.object({
  doctorId: z.string().min(1, "Please select a doctor"),
  subject: z.string().min(1, "Please enter a subject for this conversation"),
});

type NewSessionFormValues = z.infer<typeof newSessionSchema>;

export function ChatInterface() {
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [isNewSessionDialogOpen, setIsNewSessionDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    user,
    sessions,
    currentSession,
    messages,
    isConnected,
    isLoadingSessions,
    isLoadingMessages,
    createSession,
    isCreatingSession,
    sendMessage,
  } = useChat(selectedSessionId);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  // Form for creating a new chat session
  const form = useForm<NewSessionFormValues>({
    resolver: zodResolver(newSessionSchema),
    defaultValues: {
      doctorId: "",
      subject: "",
    },
  });
  
  const onSubmit = (values: NewSessionFormValues) => {
    createSession({
      doctorId: parseInt(values.doctorId, 10),
      subject: values.subject,
    });
    
    setIsNewSessionDialogOpen(false);
    form.reset();
  };
  
  // Mock doctors data (in a real app, this would come from an API)
  const doctors = [
    { id: 1, name: "Dr. Sarah Johnson", specialization: "Cardiology" },
    { id: 2, name: "Dr. Michael Chen", specialization: "Dermatology" },
    { id: 3, name: "Dr. Emily Wilson", specialization: "Neurology" },
  ];
  
  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Sessions sidebar */}
      <div className="w-1/4 max-w-xs">
        <ChatSessionList
          sessions={sessions}
          selectedSessionId={selectedSessionId}
          onSelectSession={setSelectedSessionId}
          onCreateSession={() => setIsNewSessionDialogOpen(true)}
          isLoading={isLoadingSessions}
        />
      </div>
      
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedSessionId && currentSession ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{currentSession.subject}</h3>
                <p className="text-sm text-muted-foreground">
                  {doctors.find(d => d.id === currentSession.doctorId)?.name || "Healthcare Provider"}
                </p>
              </div>
              
              {!isConnected && (
                <div className="flex items-center text-amber-500 text-sm">
                  <WifiOffIcon className="h-4 w-4 mr-1" />
                  Reconnecting...
                </div>
              )}
            </div>
            
            {/* Messages area */}
            <div className="flex-1 p-4 overflow-y-auto">
              {isLoadingMessages ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2Icon className="animate-spin h-6 w-6 text-muted-foreground" />
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <p className="text-muted-foreground mb-2">No messages yet</p>
                  <p className="text-sm text-muted-foreground">
                    Start the conversation by sending a message to your healthcare provider
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <ChatMessage 
                      key={message.id} 
                      message={message} 
                      isCurrentUser={message.senderId === user?.id}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
            
            {/* Input area */}
            <ChatInput 
              onSendMessage={sendMessage} 
              isConnected={isConnected}
            />
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <AlertCircleIcon className="h-8 w-8 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No conversation selected</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Select an existing conversation from the sidebar or start a new one
            </p>
            <Button onClick={() => setIsNewSessionDialogOpen(true)}>
              Start a new conversation
            </Button>
          </div>
        )}
      </div>
      
      {/* New session dialog */}
      <Dialog open={isNewSessionDialogOpen} onOpenChange={setIsNewSessionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Start a new conversation</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="doctorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Healthcare Provider</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a healthcare provider" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id.toString()}>
                            {doctor.name} ({doctor.specialization})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conversation Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Follow-up Question" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsNewSessionDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreatingSession}>
                  {isCreatingSession && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Start Conversation
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}