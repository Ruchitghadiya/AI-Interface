import React, { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../components/ThemeToggle';
import { ModelSelector } from '../components/ModelSelector';
import { PromptEditor } from '../components/PromptEditor';
import { ParametersPanel } from '../components/ParametersPanel';
import { ChatArea } from '../components/ChatOutput';
import { useAI, AIModel, PromptTemplate, ChatMessage } from '../context/AIContext';

const mockModels: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    description: 'Most capable GPT-4 model, better than GPT-3.5 at understanding and generating natural language',
    maxTokens: 8192,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    description: 'Fast and cost-effective model for most everyday tasks',
    maxTokens: 4096,
  },
  {
    id: 'claude-2',
    name: 'Claude 2',
    provider: 'Anthropic',
    description: 'Balanced model with strong reasoning capabilities and safety features',
    maxTokens: 100000,
  },
  {
    id: 'llama-2-70b',
    name: 'Llama 2 70B',
    provider: 'Meta',
    description: 'Powerful open-source model for research and commercial use',
    maxTokens: 4096,
  },
];

const initialTemplates: PromptTemplate[] = [
  {
    id: '1',
    name: 'Creative Writing',
    content: 'Write a creative story about {topic} with the following elements: {elements}.',
    description: 'Template for creative writing tasks',
  },
  {
    id: '2',
    name: 'Code Explanation',
    content: 'Explain the following code in simple terms:\\n\\n{code}',
    description: 'Template for explaining code snippets',
  },
  {
    id: '3',
    name: 'Email Response',
    content: 'Write a professional email response to the following message:\\n\\n{message}',
    description: 'Template for professional email responses',
  },
];

export default function Home() {
  const { state, dispatch } = useAI();
  const [templates, setTemplates] = useState<PromptTemplate[]>(initialTemplates);

  const handleSendMessage = async () => {
    if (!state.prompt.trim() || !state.selectedModel || state.isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: state.prompt,
      timestamp: new Date(),
    };

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_PROMPT', payload: '' });

    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `This is a simulated response from ${state.selectedModel?.name}. In a real application, this would be the AI's actual response to: "${userMessage.content}"`,
        timestamp: new Date(),
      };

      dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 2000);
  };

  const handleSaveTemplate = (template: Omit<PromptTemplate, 'id'>) => {
    const newTemplate: PromptTemplate = {
      ...template,
      id: Date.now().toString(),
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              AI Interface
            </motion.h1>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ModelSelector models={mockModels} isLoading={state.isLoading} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ParametersPanel />
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <PromptEditor
                templates={templates}
                onSaveTemplate={handleSaveTemplate}
                onDeleteTemplate={handleDeleteTemplate}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex space-x-4"
            >
              <button
                onClick={handleSendMessage}
                disabled={!state.prompt.trim() || !state.selectedModel || state.isLoading}
                onKeyPress={handleKeyPress}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {state.isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message (Ctrl+Enter)</span>
                  </>
                )}
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ChatArea />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}