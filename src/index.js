#!/usr/bin/env node

import dotenv from 'dotenv';
import { GeminiClient } from './ai/gemini.js';
import { ChatInterface } from './chat/chatInterface.js';
import chalk from 'chalk';

// Load environment variables
dotenv.config();

/**
 * Main application entry point
 */
async function main() {
  try {
    // Check for API key
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error(chalk.red('\n❌ Error: GEMINI_API_KEY not found in .env file'));
      console.error(chalk.yellow('\nPlease create a .env file with your Gemini API key:'));
      console.error(chalk.gray('GEMINI_API_KEY=your_api_key_here\n'));
      console.error(chalk.blue('Get your API key from: https://makersuite.google.com/app/apikey\n'));
      process.exit(1);
    }

    // Initialize Gemini client
    console.log(chalk.gray('Initializing AI assistant...'));
    const geminiClient = new GeminiClient(apiKey);

    // Initialize and start chat interface
    const chatInterface = new ChatInterface(geminiClient);
    await chatInterface.start();

  } catch (error) {
    console.error(chalk.red('\n❌ Fatal Error: ') + error.message);
    console.error(chalk.gray('\nStack trace:'), error.stack);
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error(chalk.red('\n❌ Unhandled Promise Rejection:'), error);
  process.exit(1);
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  console.log(chalk.blue('\n\n👋 Shutting down gracefully...'));
  process.exit(0);
});

// Run the application
main();