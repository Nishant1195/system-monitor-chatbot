/**
 * MCP Tool Definitions
 * These define the schema for each tool that the AI can call
 */

export const toolDefinitions = [
  {
    name: "get_system_info",
    description: "Get basic system information including OS, CPU, memory, and uptime. Use this to get an overview of the system.",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "get_cpu_usage",
    description: "Get current CPU usage statistics including average load, per-core usage, and temperature. Use this to check CPU performance.",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "get_memory_usage",
    description: "Get memory usage statistics including total, used, free memory and usage percentage. Use this to check RAM status.",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "list_processes",
    description: "List top processes by CPU and memory usage. Returns the top 10 processes for each category with PIDs and resource usage.",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "get_disk_usage",
    description: "Get disk usage information for all mounted filesystems including size, used space, available space, and usage percentage.",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "get_network_info",
    description: "Get network interface information and statistics including IP addresses, MAC addresses, and data transfer rates.",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "store_in_file",
    description: "Save content to a file in the reports directory. Use this to save reports, logs, or any text content. Files are automatically timestamped.",
    inputSchema: {
      type: "object",
      properties: {
        fileName: {
          type: "string",
          description: "Name of the file (e.g., 'health-report.txt', 'system-status.md')"
        },
        content: {
          type: "string",
          description: "Content to write to the file"
        }
      },
      required: ["fileName", "content"]
    }
  }
];