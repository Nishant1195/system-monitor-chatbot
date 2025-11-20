import readline from 'readline';
import chalk from 'chalk';

/**
 * CLI Chat Interface for System Monitor
 */
export class ChatInterface {
  constructor(geminiClient) {
    this.geminiClient = geminiClient;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: chalk.cyan('\nYou: ')
    });
    
    this.isRunning = false;
  }

  displayWelcome() {
    console.log(chalk.bold.blue('\n╔════════════════════════════════════════════╗'));
    console.log(chalk.bold.blue('║   🤖 System Monitor AI Assistant         ║'));
    console.log(chalk.bold.blue('╚════════════════════════════════════════════╝'));
    console.log(chalk.gray('\nAsk me anything about your system!'));
    console.log(chalk.gray('Examples:'));
    console.log(chalk.gray('  • "What\'s my CPU usage?"'));
    console.log(chalk.gray('  • "Show me top processes"'));
    console.log(chalk.gray('  • "Generate a health report and save it"'));
    console.log(chalk.gray('  • "Is my system running normally?"'));
    console.log(chalk.gray('\nType "exit", "quit", or "bye" to end the session.\n'));
  }

  /**
   * Simple markdown to terminal formatter
   */
  formatMarkdown(text) {
    let formatted = text;

    // Bold text: **text** or __text__
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, (match, p1) => chalk.bold(p1));
    formatted = formatted.replace(/__(.+?)__/g, (match, p1) => chalk.bold(p1));

    // Italic text: *text* or _text_
    formatted = formatted.replace(/\*(.+?)\*/g, (match, p1) => chalk.italic(p1));
    formatted = formatted.replace(/_(.+?)_/g, (match, p1) => chalk.italic(p1));

    // Code blocks: `code`
    formatted = formatted.replace(/`(.+?)`/g, (match, p1) => chalk.bgGray.white(` ${p1} `));

    // Headers: ### Header
    formatted = formatted.replace(/^### (.+)$/gm, (match, p1) => chalk.bold.cyan(p1));
    formatted = formatted.replace(/^## (.+)$/gm, (match, p1) => chalk.bold.blue(p1));
    formatted = formatted.replace(/^# (.+)$/gm, (match, p1) => chalk.bold.magenta(p1));

    // Bullet points: * item or - item
    formatted = formatted.replace(/^\s*[\*\-]\s+(.+)$/gm, (match, p1) => `  ${chalk.yellow('•')} ${p1}`);

    // Numbered lists: 1. item
    formatted = formatted.replace(/^\s*\d+\.\s+(.+)$/gm, (match, p1) => `  ${chalk.yellow('→')} ${p1}`);

    return formatted;
  }

  async start() {
    this.isRunning = true;
    this.displayWelcome();

    this.rl.on('line', async (input) => {
      const trimmedInput = input.trim();

      // Handle exit commands
      if (['exit', 'quit', 'bye', 'q'].includes(trimmedInput.toLowerCase())) {
        this.stop();
        return;
      }

      // Handle empty input
      if (!trimmedInput) {
        this.rl.prompt();
        return;
      }

      // Handle special commands
      if (trimmedInput.toLowerCase() === 'clear') {
        console.clear();
        this.displayWelcome();
        this.rl.prompt();
        return;
      }

      if (trimmedInput.toLowerCase() === 'history') {
        this.displayHistory();
        this.rl.prompt();
        return;
      }

      // Process user message
      await this.processMessage(trimmedInput);
      this.rl.prompt();
    });

    this.rl.on('close', () => {
      this.stop();
    });

    this.rl.prompt();
  }

  async processMessage(message) {
    try {
      console.log(); // Add spacing

      // Show thinking indicator
      const thinkingInterval = this.showThinking();

      // Send to AI
      const response = await this.geminiClient.sendMessage(message);

      // Stop thinking indicator
      clearInterval(thinkingInterval);
      process.stdout.write('\r\x1b[K'); // Clear the thinking line

      // Display AI response with markdown formatting
      console.log(chalk.green.bold('AI:'));
      console.log(this.formatMarkdown(response));

    } catch (error) {
      console.log(chalk.red('\n❌ Error: ') + error.message);
      console.log(chalk.yellow('Please try again or rephrase your question.'));
    }
  }

  showThinking() {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;
    
    return setInterval(() => {
      process.stdout.write(`\r${chalk.yellow(frames[i])} Thinking...`);
      i = (i + 1) % frames.length;
    }, 80);
  }

  displayHistory() {
    const history = this.geminiClient.getHistory();
    
    if (history.length === 0) {
      console.log(chalk.gray('\nNo conversation history yet.'));
      return;
    }

    console.log(chalk.bold('\n📜 Conversation History:\n'));
    
    history.forEach((entry, index) => {
      if (entry.role === 'user') {
        console.log(chalk.cyan(`You: ${entry.parts[0].text}`));
      } else if (entry.role === 'model') {
        const text = entry.parts[0].text;
        console.log(chalk.green.bold('AI:'));
        console.log(this.formatMarkdown(text));
        console.log();
      }
    });
  }

  stop() {
    if (!this.isRunning) return;

    console.log(chalk.blue('\n\n👋 Thanks for using System Monitor AI!'));
    console.log(chalk.gray('Goodbye!\n'));
    
    this.isRunning = false;
    this.rl.close();
    process.exit(0);
  }
}