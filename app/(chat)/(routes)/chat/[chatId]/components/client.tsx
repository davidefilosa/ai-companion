"use client";

import { Companion, Message } from "@prisma/client";
import ChatHeader from "./chat-header";

interface ChatClientPromps {
  companion: Companion & {
    messages: Message[];
    _count: {
      messages: Number;
    };
  };
}

const ChatClient = ({ companion }: ChatClientPromps) => {
  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      <ChatHeader companion={companion} />
    </div>
  );
};

export default ChatClient;
