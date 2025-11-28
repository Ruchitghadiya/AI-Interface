import '../styles/globals.css';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AIProvider } from '../contexts/AIContext';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => (
    <ThemeProvider>
      <AIProvider>
        <div className="p-4">
          <Story />
        </div>
      </AIProvider>
    </ThemeProvider>
  ),
];