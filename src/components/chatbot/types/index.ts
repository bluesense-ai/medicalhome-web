export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatMessageProps {
  message: Message;
}

export interface ChatWindowProps {
  onClose: () => void;
} 