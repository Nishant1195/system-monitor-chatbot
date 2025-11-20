import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { toolDefinitions } from './tools.js';
import * as systemTools from '../tools/systemTools.js';

/**
 * MCP Server for System Monitoring Tools
 */
export class SystemMonitorMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'system-monitor-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  setupHandlers() {
    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: toolDefinitions,
      };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        let result;

        switch (name) {
          case 'get_system_info':
            result = await systemTools.getSystemInfo();
            break;

          case 'get_cpu_usage':
            result = await systemTools.getCpuUsage();
            break;

          case 'get_memory_usage':
            result = await systemTools.getMemoryUsage();
            break;

          case 'list_processes':
            result = await systemTools.listProcesses();
            break;

          case 'get_disk_usage':
            result = await systemTools.getDiskUsage();
            break;

          case 'get_network_info':
            result = await systemTools.getNetworkInfo();
            break;

          case 'store_in_file':
            if (!args.fileName || !args.content) {
              throw new Error('fileName and content are required');
            }
            result = await systemTools.storeInFile(args.fileName, args.content);
            break;

          default:
            throw new Error(`Unknown tool: ${name}`);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ error: error.message }),
            },
          ],
          isError: true,
        };
      }
    });
  }

  async connect() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('System Monitor MCP Server running on stdio');
  }
}

/**
 * Execute a tool directly (for non-MCP usage)
 */
export async function executeTool(toolName, args = {}) {
  try {
    let result;

    switch (toolName) {
      case 'get_system_info':
        result = await systemTools.getSystemInfo();
        break;

      case 'get_cpu_usage':
        result = await systemTools.getCpuUsage();
        break;

      case 'get_memory_usage':
        result = await systemTools.getMemoryUsage();
        break;

      case 'list_processes':
        result = await systemTools.listProcesses();
        break;

      case 'get_disk_usage':
        result = await systemTools.getDiskUsage();
        break;

      case 'get_network_info':
        result = await systemTools.getNetworkInfo();
        break;

      case 'store_in_file':
        if (!args.fileName || !args.content) {
          throw new Error('fileName and content are required');
        }
        result = await systemTools.storeInFile(args.fileName, args.content);
        break;

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}