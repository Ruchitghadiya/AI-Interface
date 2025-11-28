import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '../context/ThemeContext';
import { AIProvider } from '../context/AIContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <AIProvider>
        <Component {...pageProps} />
      </AIProvider>
    </ThemeProvider>
  );
}