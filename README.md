# System Monitor AI Assistant 🤖

An intelligent CLI tool that uses AI to monitor and report on your system's health, performance, and status.

## Features

- 💬 Natural language interface for system monitoring
- 📊 Real-time CPU, memory, disk, and network statistics
- 🔍 Process monitoring and analysis
- 📝 Generate and save comprehensive system reports
- 🤖 AI-powered insights and recommendations

## Installation
```bash
npm install
```

## Setup

1. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. Create a `.env` file in the project root:
```env
GEMINI_API_KEY=your_api_key_here
REPORTS_DIR=./reports
MAX_HISTORY=50
```

## Usage

Start the assistant:
```bash
npm start
```

### Example Queries

- "What's my current CPU usage?"
- "Show me the top processes by memory"
- "Generate a full system health report"
- "Is my system running normally?"
- "Save a system report to a file"
- "What's my disk space?"

### Commands

- `exit`, `quit`, `bye` - Exit the application
- `clear` - Clear the screen
- `history` - Show conversation history

## Tools Available

The AI assistant has access to:

- **get_system_info** - OS, CPU, memory, uptime information
- **get_cpu_usage** - Real-time CPU statistics
- **get_memory_usage** - RAM usage details
- **list_processes** - Top processes by resource usage
- **get_disk_usage** - Disk space and mount points
- **get_network_info** - Network interfaces and statistics
- **store_in_file** - Save reports to files

## Project Structure
```
system-monitor-ai/
├── src/
│   ├── index.js              # Main entry point
│   ├── chat/
│   │   └── chatInterface.js  # CLI interface
│   ├── mcp/
│   │   ├── server.js         # MCP server
│   │   └── tools.js          # Tool definitions
│   ├── tools/
│   │   └── systemTools.js    # System monitoring functions
│   └── ai/
│       └── gemini.js         # Gemini AI integration
├── reports/                   # Generated reports
└── .env                       # Configuration
```

## License

MIT