"use client";

import { useState, useEffect, useRef } from "react";
import {
  useMutation,
  useStorage,
  useMyPresence,
  useOthers,
  useUpdateMyPresence,
} from "@/liveblocks.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChatMessage,
  createChatMessage,
  formatMessageTime,
  getUserName,
  updateUserName,
} from "@/lib/user-utils";
import Image from "next/image";

interface ChatComponentProps {
  roomCode: string;
}

export default function ChatComponent({ roomCode }: ChatComponentProps) {
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const others = useOthers();
  const [myPresence, updateMyPresence] = useMyPresence();

  // Get chat messages from Liveblocks storage
  const chatMessages = useStorage((root) => root.chatMessages);

  // Mutation to add a message to storage
  const addMessage = useMutation(({ storage }, message: ChatMessage) => {
    const messages = storage.get("chatMessages");
    if (messages) {
      messages.set(message.id, message);
    }
  }, []);

  // Initialize user name on component mount
  useEffect(() => {
    const currentUserName = getUserName();
    setUserName(currentUserName);
    updateMyPresence({
      userName: currentUserName,
      userId: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      cursor: null,
      message: "",
    });
  }, [updateMyPresence]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (
      !message.trim() ||
      !myPresence?.userId ||
      !myPresence?.userName ||
      !chatMessages
    )
      return;

    const newMessage = createChatMessage(
      myPresence.userId,
      myPresence.userName,
      message.trim()
    );

    addMessage(newMessage);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNameEdit = () => {
    setTempName(userName);
    setIsEditingName(true);
  };

  const handleNameSave = () => {
    const newName = updateUserName(tempName);
    setUserName(newName);
    updateMyPresence({ userName: newName });
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setTempName("");
    setIsEditingName(false);
  };

  const handleNameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNameSave();
    } else if (e.key === "Escape") {
      handleNameCancel();
    }
  };

  // Convert storage map to array and sort by timestamp
  const messageList = chatMessages
    ? Array.from(chatMessages.entries())
        .map(([id, msg]) => msg as ChatMessage)
        .sort((a, b) => a.timestamp - b.timestamp)
    : [];

  // Get typing indicators
  const typingUsers = others
    .filter((other) => other.presence?.isTyping && other.presence?.userName)
    .map((other) => other.presence.userName);

  return (
    <div className='flex h-full flex-col'>
      {/* Chat Header */}
      <div className='flex-shrink-0 border-b border-primary-grey-200 p-4'>
        <div className='mb-3 flex items-center justify-between'>
          <h3 className='text-lg font-semibold text-white'>Room Chat</h3>
          <div className='flex items-center gap-2 text-xs text-primary-grey-300'>
            <div className='h-2 w-2 rounded-full bg-primary-green'></div>
            {others.length + 1} online
          </div>
        </div>

        {/* User Name Display/Edit */}
        <div className='flex items-center gap-2'>
          <span className='text-xs text-primary-grey-300'>You:</span>
          {isEditingName ? (
            <div className='flex flex-1 items-center gap-2'>
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={handleNameKeyPress}
                className='h-6 border-primary-grey-300 bg-primary-grey-200 text-xs text-white'
                maxLength={20}
                autoFocus
              />
              <Button
                onClick={handleNameSave}
                size='sm'
                className='h-6 bg-primary-green px-2 text-xs text-primary-black'
              >
                ✓
              </Button>
              <Button
                onClick={handleNameCancel}
                size='sm'
                className='h-6 bg-primary-grey-300 px-2 text-xs text-white'
              >
                ✕
              </Button>
            </div>
          ) : (
            <button
              onClick={handleNameEdit}
              className='text-sm font-medium text-primary-green transition-colors hover:text-green-400'
              title='Click to edit your name'
            >
              {userName}
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className='custom-scrollbar flex-1 space-y-3 overflow-y-auto p-4'>
        {!chatMessages ? (
          <div className='mt-8 text-center text-primary-grey-300'>
            <div className='mb-4'>
              <div className='mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary-grey-300 border-t-primary-green'></div>
            </div>
            <p className='text-sm'>Loading chat...</p>
          </div>
        ) : messageList.length === 0 ? (
          <div className='mt-8 text-center text-primary-grey-300'>
            <div className='mb-4'>
              <Image
                src='/assets/comments.svg'
                alt='Chat'
                width={48}
                height={48}
                className='mx-auto opacity-50'
              />
            </div>
            <p className='text-sm'>No messages yet</p>
            <p className='mt-1 text-xs'>Be the first to say something!</p>
          </div>
        ) : (
          messageList.map((msg) => (
            <div key={msg.id} className='flex flex-col space-y-1'>
              <div className='flex items-baseline gap-2'>
                <span className='text-xs font-medium text-primary-green'>
                  {msg.userName}
                </span>
                <span className='text-xs text-primary-grey-300'>
                  {formatMessageTime(msg.timestamp)}
                </span>
              </div>
              <div className='ml-4 rounded-lg bg-primary-grey-200 px-3 py-2 text-sm text-white'>
                {msg.message}
              </div>
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className='ml-4 flex items-center gap-2 text-xs text-primary-grey-300'>
            <div className='flex gap-1'>
              <div className='typing-dot-1 h-1 w-1 rounded-full bg-primary-grey-300'></div>
              <div className='typing-dot-2 h-1 w-1 rounded-full bg-primary-grey-300'></div>
              <div className='typing-dot-3 h-1 w-1 rounded-full bg-primary-grey-300'></div>
            </div>
            {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"}{" "}
            typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className='flex-shrink-0 border-t border-primary-grey-200 p-4'>
        <div className='flex gap-2'>
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              updateMyPresence({ isTyping: e.target.value.length > 0 });
            }}
            onKeyDown={handleKeyPress}
            onBlur={() => updateMyPresence({ isTyping: false })}
            placeholder={chatMessages ? "Type a message..." : "Loading chat..."}
            className='flex-1 border-primary-grey-300 bg-primary-grey-200 text-white placeholder:text-primary-grey-300'
            maxLength={500}
            disabled={!chatMessages}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || !chatMessages}
            className='disabled:text-primary-grey-400 bg-primary-green text-primary-black hover:bg-green-600 disabled:bg-primary-grey-300'
          >
            <Image
              src='/assets/arrow.svg'
              alt='Send'
              width={16}
              height={16}
              className='rotate-45'
            />
          </Button>
        </div>
        <div className='mt-1 text-xs text-primary-grey-300'>
          {chatMessages
            ? "Press Enter to send, Shift+Enter for new line"
            : "Initializing chat..."}
        </div>
      </div>
    </div>
  );
}
