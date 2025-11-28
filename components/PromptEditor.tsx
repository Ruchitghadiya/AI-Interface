import React, { useState } from 'react';
import { Save, FolderOpen, Trash2 } from 'lucide-react';
import { useAI, PromptTemplate } from '../context/AIContext';
import { motion } from 'framer-motion';

interface PromptEditorProps {
  templates: PromptTemplate[];
  onSaveTemplate: (template: Omit<PromptTemplate, 'id'>) => void;
  onDeleteTemplate: (id: string) => void;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({
  templates,
  onSaveTemplate,
  onDeleteTemplate,
}) => {
  const { state, dispatch } = useAI();
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  const handleSaveTemplate = () => {
    if (newTemplateName.trim() && state.prompt.trim()) {
      onSaveTemplate({
        name: newTemplateName.trim(),
        content: state.prompt,
        description: `Template for ${newTemplateName.trim()}`,
      });
      setNewTemplateName('');
      setShowSaveDialog(false);
    }
  };

  const loadTemplate = (template: PromptTemplate) => {
    dispatch({ type: 'SET_PROMPT', payload: template.content });
    setShowTemplates(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Prompt Editor
        </label>
        <div className="flex space-x-2">
          <motion.button
            onClick={() => setShowTemplates(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
            aria-label="Load template"
          >
            <FolderOpen className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={() => setShowSaveDialog(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!state.prompt.trim()}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Save template"
          >
            <Save className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <textarea
        value={state.prompt}
        onChange={(e) => dispatch({ type: 'SET_PROMPT', payload: e.target.value })}
        placeholder="Enter your prompt here... You can use {variables} like this in your templates."
        className="w-full h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none font-mono text-sm transition-colors duration-200"
        aria-label="Prompt input"
      />

      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Load Template
              </h3>
            </div>
            <div className="p-6 overflow-y-auto max-h-64">
              {templates.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No templates saved yet
                </p>
              ) : (
                <div className="space-y-3">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {template.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {template.description}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => loadTemplate(template)}
                          className="px-3 py-1 text-sm bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => onDeleteTemplate(template.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                          aria-label="Delete template"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setShowTemplates(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Save Template
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                  placeholder="Enter template name"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTemplate}
                disabled={!newTemplateName.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};