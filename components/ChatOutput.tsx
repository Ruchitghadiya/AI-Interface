import React, { useEffect, useRef } from 'react';
import { Copy, Download, User, Bot, Trash2 } from 'lucide-react';
import { useAI, ChatMessage } from '../context/AIContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-primary-500 text-white'
            : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div
        className={`flex-1 max-w-3xl ${
          isUser ? 'text-right' : 'text-left'
        }`}
      >
        <div
          className={`inline-block px-4 py-2 rounded-2xl ${
            isUser
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {message.timestamp.toLocaleTimeString()}
          </span>
          <button
            onClick={handleCopy}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
            aria-label="Copy message"
          >
            <Copy className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const ChatArea: React.FC = () => {
  const { state, dispatch } = useAI();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.chatHistory]);

  const handleDownloadJSON = () => {
    const chatData = {
      timestamp: new Date().toISOString(),
      model: state.selectedModel?.name,
      parameters: {
        temperature: state.temperature,
        maxTokens: state.maxTokens,
        topP: state.topP,
        frequencyPenalty: state.frequencyPenalty,
        presencePenalty: state.presencePenalty,
      },
      chatHistory: state.chatHistory,
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-chat-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearChat = () => {
    dispatch({ type: 'CLEAR_CHAT' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Chat History
        </h3>
        <div className="flex space-x-2">
          <motion.button
            onClick={handleDownloadJSON}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={state.chatHistory.length === 0}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>JSON</span>
          </motion.button>
          <motion.button
            onClick={clearChat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={state.chatHistory.length === 0}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </motion.button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg h-96 overflow-y-auto p-4">
        <AnimatePresence>
          {state.chatHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400"
            >
              <div className="text-center">
                <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p>No messages yet. Start a conversation!</p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {state.chatHistory.map((message:any) => (
                <ChatBubble key={message.id} message={message} />
              ))}
              <div ref={chatEndRef} />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};