import { ChatMessage } from "@shared/schema";

type MessageHandler = (message: ChatMessage) => void;
type ConnectionHandler = (status: boolean) => void;

// MessageTypes for WebSocket communication
export enum MessageType {
  AUTH = 'auth',
  AUTH_SUCCESS = 'auth_success',
  CHAT_MESSAGE = 'chat_message',
  NEW_MESSAGE = 'new_message',
  MESSAGE_SENT = 'message_sent',
  ERROR = 'error'
}

export class ChatService {
  private socket: WebSocket | null = null;
  private userId: number | null = null;
  private messageHandlers: Map<number, MessageHandler> = new Map();
  private connectionHandlers: Set<ConnectionHandler> = new Set();
  private reconnectTimer: NodeJS.Timeout | null = null;
  private connected = false;
  
  constructor() {
    this.connect();
  }
  
  private connect() {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      this.socket = new WebSocket(wsUrl);
      
      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this.connected = true;
        
        // If we have a userId, authenticate immediately
        if (this.userId) {
          this.authenticate(this.userId);
        }
        
        // Notify all connection handlers
        this.connectionHandlers.forEach(handler => handler(true));
        
        // Clear any reconnect timer
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };
      
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case MessageType.AUTH_SUCCESS:
            console.log('WebSocket authenticated');
            break;
            
          case MessageType.NEW_MESSAGE:
            if (data.sessionId && data.message) {
              const handler = this.messageHandlers.get(data.sessionId);
              if (handler) {
                handler(data.message);
              }
            }
            break;
            
          case MessageType.MESSAGE_SENT:
            // Currently just log the confirmation
            console.log('Message sent:', data.message);
            break;
            
          case MessageType.ERROR:
            console.error('WebSocket error:', data.message);
            break;
        }
      };
      
      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
        this.connected = false;
        
        // Notify all connection handlers
        this.connectionHandlers.forEach(handler => handler(false));
        
        // Attempt to reconnect after a delay
        this.reconnectTimer = setTimeout(() => {
          this.connect();
        }, 3000);
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
    }
  }
  
  public authenticate(userId: number) {
    this.userId = userId;
    
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: MessageType.AUTH,
        userId
      }));
    }
  }
  
  public sendMessage(sessionId: number, content: string, isFromDoctor: boolean = false) {
    if (!this.userId) {
      console.error('User not authenticated');
      return;
    }
    
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: MessageType.CHAT_MESSAGE,
        userId: this.userId,
        sessionId,
        content,
        isFromDoctor
      }));
    } else {
      console.error('WebSocket not connected');
    }
  }
  
  public subscribeToSession(sessionId: number, handler: MessageHandler) {
    this.messageHandlers.set(sessionId, handler);
  }
  
  public unsubscribeFromSession(sessionId: number) {
    this.messageHandlers.delete(sessionId);
  }
  
  public onConnectionChange(handler: ConnectionHandler) {
    this.connectionHandlers.add(handler);
    
    // Immediately call the handler with the current connection state
    handler(this.connected);
    
    // Return an unsubscribe function
    return () => {
      this.connectionHandlers.delete(handler);
    };
  }
  
  public disconnect() {
    if (this.socket) {
      this.socket.close();
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}

// Create a singleton instance
const chatService = new ChatService();
export default chatService;