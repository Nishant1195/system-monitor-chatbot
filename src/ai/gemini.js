import { GoogleGenerativeAI } from '@google/generative-ai';
import { toolDefinitions } from '../mcp/tools.js';
import { executeTool } from '../mcp/server.js';

/**
 * Gemini AI Client with Function Calling
 */
export class GeminiClient {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = null;
    this.conversationHistory = [];
    this.initializeModel();
  }

  initializeModel() {
    // Convert MCP tool definitions to Gemini function declarations
    const functionDeclarations = toolDefinitions.map(tool => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema
    }));

    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      tools: [{ functionDeclarations }],
      systemInstruction: `You are a helpful system monitoring assistant. You have access to various system monitoring tools that provide real-time information about the computer's hardware, processes, and performance.

When a user asks about the system:
- Use the appropriate tools to gather accurate, real-time data
- Provide clear, concise explanations
- Interpret the data in a helpful way (e.g., "CPU usage is high" vs just showing numbers)
- When asked to generate reports, create well-formatted, comprehensive reports
- Always be proactive in suggesting relevant follow-up actions

Available tools:
- get_system_info: Basic system information
- get_cpu_usage: Current CPU statistics
- get_memory_usage: Memory/RAM statistics
- list_processes: Top processes by CPU and memory
- get_disk_usage: Disk space information
- get_network_info: Network interfaces and statistics
- store_in_file: Save content to a file

Be conversational and helpful. Explain technical terms when appropriate.`
    });
  }

  async sendMessage(userMessage) {
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });

      // Start chat with history
      const chat = this.model.startChat({
        history: this.conversationHistory.slice(0, -1) // Exclude the last message we just added
      });

      // Send message and get response
      let result = await chat.sendMessage(userMessage);
      let response = result.response;

      // Handle function calls in a loop
      while (response.candidates[0].content.parts.some(part => part.functionCall)) {
        const functionCalls = response.candidates[0].content.parts.filter(
          part => part.functionCall
        );

        // Execute all function calls
        const functionResponses = [];
        
        for (const call of functionCalls) {
          const { name, args } = call.functionCall;
          console.log(`\n🔧 Calling tool: ${name}`);
          
          const toolResult = await executeTool(name, args || {});
          
          functionResponses.push({
            functionResponse: {
              name: name,
              response: toolResult
            }
          });
        }

        // Send function results back to the model
        result = await chat.sendMessage(functionResponses);
        response = result.response;
      }

      // Extract final text response
      const finalText = response.candidates[0].content.parts
        .filter(part => part.text)
        .map(part => part.text)
        .join('\n');

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'model',
        parts: [{ text: finalText }]
      });

      // Trim history if it gets too long
      if (this.conversationHistory.length > 50) {
        this.conversationHistory = this.conversationHistory.slice(-50);
      }

      return finalText;
    } catch (error) {
      console.error('Error in Gemini API call:', error);
      throw new Error(`AI Error: ${error.message}`);
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  getHistory() {
    return this.conversationHistory;
  }
}