import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "./use-auth";
import { useToast } from "./use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ChatSession, ChatMessage, InsertChatSession, InsertChatMessage } from "@shared/schema";

export function useChat(sessionId: number | null) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  
  // Fetch chat sessions for the current user
  const { 
    data: sessions = [],
    isLoading: isLoadingSessions,
    refetch: refetchSessions
  } = useQuery<ChatSession[]>({
    queryKey: ['/api/chat/sessions'],
    enabled: !!user,
  });
  
  // Find the current session from the sessions data
  const currentSession = sessionId 
    ? sessions.find(session => session.id === sessionId) 
    : null;
  
  // Fetch messages for the current chat session
  const {
    data: messages = [],
    isLoading: isLoadingMessages,
    refetch: refetchMessages
  } = useQuery<ChatMessage[]>({
    queryKey: ['/api/chat/messages', sessionId],
    enabled: !!sessionId && !!user,
  });
  
  // Create a new chat session
  const { 
    mutate: createSessionMutation,
    isPending: isCreatingSession
  } = useMutation({
    mutationFn: async (sessionData: Omit<InsertChatSession, "userId" | "status" | "startedAt" | "endedAt">) => {
      const res = await apiRequest('POST', '/api/chat/sessions', {
        ...sessionData,
        userId: user?.id
      });
      return await res.json();
    },
    onSuccess: (newSession: ChatSession) => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/sessions'] });
      setSelectedSessionId(newSession.id);
      toast({
        title: "Chat session created",
        description: "You can now start messaging with your healthcare provider",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create chat session",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Send a message in the current chat session
  const { 
    mutate: sendMessageMutation,
    isPending: isSendingMessage
  } = useMutation({
    mutationFn: async (content: string) => {
      if (!sessionId || !user) throw new Error("Session or user not found");
      
      // Create the message data
      const messageData: Omit<InsertChatMessage, "id" | "sentAt" | "readAt"> = {
        sessionId,
        senderId: user.id,
        receiverId: currentSession?.doctorId || 0, // This should be the doctor's ID
        content,
        isFromDoctor: false
      };
      
      // If websocket is connected, send via websocket
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: 'message',
          data: messageData
        }));
        
        // Return an optimistic response
        return {
          ...messageData,
          id: Date.now(), // Temporary ID for optimistic update
          sentAt: new Date(),
          readAt: null
        };
      } else {
        // Fall back to REST API
        const res = await apiRequest('POST', '/api/chat/messages', messageData);
        return await res.json();
      }
    },
    onSuccess: (newMessage: ChatMessage) => {
      // Add the new message to the cache
      queryClient.setQueryData(
        ['/api/chat/messages', sessionId],
        (oldMessages: ChatMessage[] = []) => [...oldMessages, newMessage]
      );
      
      // Update the session's lastMessagePreview and lastMessageAt
      queryClient.setQueryData(
        ['/api/chat/sessions'],
        (oldSessions: ChatSession[] = []) => 
          oldSessions.map(session => 
            session.id === sessionId 
              ? { 
                  ...session, 
                  lastMessagePreview: newMessage.content.substring(0, 50),
                  lastMessageAt: newMessage.sentAt
                }
              : session
          )
      );
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // WebSocket connection setup
  useEffect(() => {
    if (!user) return;
    
    // Create WebSocket connection
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;
    
    socket.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket connection established");
      
      // Send authentication message
      socket.send(JSON.stringify({
        type: 'auth',
        data: { userId: user.id }
      }));
    };
    
    socket.onclose = () => {
      setIsConnected(false);
      console.log("WebSocket connection closed");
    };
    
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'message') {
          const message = data.data;
          
          // Handle new message
          if (message.sessionId === sessionId) {
            queryClient.setQueryData(
              ['/api/chat/messages', sessionId],
              (oldMessages: ChatMessage[] = []) => {
                // Avoid duplicates by checking if the message already exists
                if (oldMessages.some(m => m.id === message.id)) {
                  return oldMessages;
                }
                return [...oldMessages, message];
              }
            );
          }
          
          // Update the sessions list with new message info
          queryClient.setQueryData(
            ['/api/chat/sessions'],
            (oldSessions: ChatSession[] = []) => 
              oldSessions.map(session => 
                session.id === message.sessionId 
                  ? { 
                      ...session, 
                      lastMessagePreview: message.content.substring(0, 50),
                      lastMessageAt: message.sentAt
                    }
                  : session
              )
          );
          
          // Show notification if the message is not in the current session
          if (message.sessionId !== sessionId && !message.isFromDoctor) {
            const session = sessions.find(s => s.id === message.sessionId);
            toast({
              title: `New message from ${session?.subject || 'Healthcare Provider'}`,
              description: message.content.substring(0, 50) + (message.content.length > 50 ? '...' : ''),
            });
          }
        } else if (data.type === 'readReceipt') {
          // Handle read receipts
          const { sessionId, messageIds } = data.data;
          
          if (sessionId === sessionId) {
            queryClient.setQueryData(
              ['/api/chat/messages', sessionId],
              (oldMessages: ChatMessage[] = []) => 
                oldMessages.map(message => 
                  messageIds.includes(message.id) 
                    ? { ...message, readAt: new Date() }
                    : message
                )
            );
          }
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };
    
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [user, sessionId, sessions, toast]);
  
  // Mark messages as read when the session changes or new messages arrive
  useEffect(() => {
    if (sessionId && user && messages.length > 0) {
      const unreadMessages = messages.filter(m => 
        m.isFromDoctor && !m.readAt
      );
      
      if (unreadMessages.length > 0) {
        // Call the API to mark messages as read
        apiRequest('POST', `/api/chat/sessions/${sessionId}/read`, { 
          userId: user.id 
        }).catch(console.error);
        
        // Optimistically update the UI
        queryClient.setQueryData(
          ['/api/chat/messages', sessionId],
          (oldMessages: ChatMessage[] = []) => 
            oldMessages.map(message => 
              message.isFromDoctor && !message.readAt
                ? { ...message, readAt: new Date() }
                : message
            )
        );
      }
    }
  }, [sessionId, user, messages]);
  
  // Create a new chat session
  const createSession = useCallback((sessionData: Omit<InsertChatSession, "userId" | "status" | "startedAt" | "endedAt">) => {
    createSessionMutation(sessionData);
  }, [createSessionMutation]);
  
  // Send a message
  const sendMessage = useCallback((content: string) => {
    if (content.trim()) {
      sendMessageMutation(content);
    }
  }, [sendMessageMutation]);
  
  // For managing the selected session
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(sessionId);
  
  // Update selectedSessionId when the sessionId prop changes
  useEffect(() => {
    if (sessionId !== null) {
      setSelectedSessionId(sessionId);
    }
  }, [sessionId]);
  
  return {
    user,
    sessions,
    messages,
    currentSession,
    isConnected,
    isLoadingSessions,
    isLoadingMessages,
    isCreatingSession,
    isSendingMessage,
    createSession,
    sendMessage,
    selectedSessionId,
    setSelectedSessionId,
    refetchSessions,
    refetchMessages
  };
}