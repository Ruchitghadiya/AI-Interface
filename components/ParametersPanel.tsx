import React from 'react';
import { useAI } from '../context/AIContext';
import { motion } from 'framer-motion';

interface ParameterSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  description?: string;
}

const ParameterSlider: React.FC<ParameterSliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  description,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
          {value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
        aria-label={label}
        aria-describedby={description ? `${label}-desc` : undefined}
      />
      {description && (
        <p id={`${label}-desc`} className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
};

export const ParametersPanel: React.FC = () => {
  const { state, dispatch } = useAI();

  const parameters = [
    {
      label: 'Temperature',
      value: state.temperature,
      min: 0,
      max: 2,
      step: 0.1,
      description: 'Controls randomness: Lower = more deterministic, Higher = more creative',
      action: (value: number) => dispatch({ type: 'SET_TEMPERATURE', payload: value }),
    },
    {
      label: 'Max Tokens',
      value: state.maxTokens,
      min: 1,
      max: 4000,
      step: 1,
      description: 'Maximum number of tokens to generate',
      action: (value: number) => dispatch({ type: 'SET_MAX_TOKENS', payload: value }),
    },
    {
      label: 'Top P',
      value: state.topP,
      min: 0,
      max: 1,
      step: 0.1,
      description: 'Nucleus sampling: Consider tokens with top_p probability mass',
      action: (value: number) => dispatch({ type: 'SET_TOP_P', payload: value }),
    },
    {
      label: 'Frequency Penalty',
      value: state.frequencyPenalty,
      min: 0,
      max: 2,
      step: 0.1,
      description: 'Reduce repetition based on token frequency',
      action: (value: number) => dispatch({ type: 'SET_FREQUENCY_PENALTY', payload: value }),
    },
    {
      label: 'Presence Penalty',
      value: state.presencePenalty,
      min: 0,
      max: 2,
      step: 0.1,
      description: 'Reduce repetition regardless of frequency',
      action: (value: number) => dispatch({ type: 'SET_PRESENCE_PENALTY', payload: value }),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Model Parameters
      </h3>
      
      <div className="space-y-6">
        {parameters.map((param, index) => (
          <motion.div
            key={param.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ParameterSlider
              label={param.label}
              value={param.value}
              min={param.min}
              max={param.max}
              step={param.step}
              onChange={param.action}
              description={param.description}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};