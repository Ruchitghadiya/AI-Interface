import React, { useState, useEffect } from 'react';
import { ChevronDown, Cpu } from 'lucide-react';
import { useAI, AIModel } from '../context/AIContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ModelSelectorProps {
  models: AIModel[];
  isLoading?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ models, isLoading = false }) => {
  const { state, dispatch } = useAI();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (models.length > 0 && !state.selectedModel) {
      dispatch({ type: 'SET_MODEL', payload: models[0] });
    }
  }, [models, state.selectedModel, dispatch]);

  const handleSelect = (model: AIModel) => {
    dispatch({ type: 'SET_MODEL', payload: model });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        AI Model
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-3">
          <Cpu className="w-5 h-5 text-gray-400" />
          <div className="text-left">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {state.selectedModel?.name || 'Select a model'}
            </div>
            {state.selectedModel && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {state.selectedModel.provider}
              </div>
            )}
          </div>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            <ul role="listbox" className="py-1">
              {models.map((model) => (
                <li
                  key={model.id}
                  role="option"
                  aria-selected={state.selectedModel?.id === model.id}
                  onClick={() => handleSelect(model)}
                  className={`flex items-start space-x-3 p-3 cursor-pointer transition-colors duration-150 ${
                    state.selectedModel?.id === model.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-900 dark:text-primary-100'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <Cpu className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{model.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {model.description}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Max tokens: {model.maxTokens.toLocaleString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};