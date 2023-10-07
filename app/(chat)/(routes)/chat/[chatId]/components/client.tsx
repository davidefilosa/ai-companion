"use client";

import { useRouter } from "next/navigation";
import { Companion, Message } from "@prisma/client";
import { FormEvent, useState } from "react";
import ChatHeader from "./chat-header";
import { useCompletion } from "ai/react";
import ChatForm from "./chat-form";
import ChatMessages from "./chat-messages";

interface ChatClientPromps {
  companion: Companion & {
    messages: Message[];
    _count: {
      messages: Number;
    };
  };
}

const ChatClient = ({ companion }: ChatClientPromps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>(companion.messages);

  const { input, isLoading, handleInputChange, handleSubmit, setInput } =
    useCompletion({
      api: `/api/chat/${companion.id}`,
      onFinish(prompt, completion) {
        const systemMessage = {
          role: "system",
          content: completion,
        };

        setMessages((current) => [...current, systemMessage]);
        setInput("");
        router.refresh();
      },
    });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((current) => [...current, userMessage]);

    handleSubmit(e);
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      <ChatHeader companion={companion} />
      <ChatMessages
        companion={companion}
        isLoading={isLoading}
        messages={messages}
      />
      <ChatForm
        isLoading={isLoading}
        input={input}
        handleInputChange={handleInputChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default ChatClient;
