# 🤖 System Monitor AI Chatbot

An intelligent CLI tool that uses Google's Gemini AI to monitor and report on your system's health, performance, and status through natural language conversations.

[![npm version](https://badge.fury.io/js/@nishant1195%2Fsystem-monitor-chatbot.svg)](https://www.npmjs.com/package/@nishant1195/system-monitor-chatbot)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 💬 **Natural Language Interface** - Ask questions in plain English
- 📊 **Real-time Monitoring** - CPU, memory, disk, and network statistics
- 🔍 **Process Analysis** - Track resource-intensive processes
- 📝 **Report Generation** - Create and save comprehensive system reports
- 🤖 **AI-Powered Insights** - Get intelligent analysis and recommendations
- 🛠️ **MCP Integration** - Built on Model Context Protocol for extensibility

## 📦 Installation

### Global Installation (Recommended)
```bash
npm install -g @nishant1195/system-monitor-chatbot
```

### Local Installation
```bash
npm install @nishant1195/system-monitor-chatbot
```

## 🚀 Setup

1. **Get a Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key

2. **Create a `.env` file** in your project directory or home folder:
```env
GEMINI_API_KEY=your_api_key_here
REPORTS_DIR=./reports
MAX_HISTORY=50
```

## 💻 Usage

### If installed globally:
```bash
sysmon-ai
```

### If installed locally:
```bash
npx @nishant1195/system-monitor-chatbot
```

## 🎯 Example Queries

Try these natural language questions:

- "What's my current CPU usage?"
- "Show me the top 10 processes by memory"
- "Generate a complete system health report"
- "Is my system running normally?"
- "What's my disk space?"
- "Save a system report to a file"
- "How much RAM do I have free?"
- "Which processes are using the most CPU?"

## 🛠️ Available Tools

The AI assistant has access to these monitoring tools:

| Tool | Description |
|------|-------------|
| `get_system_info` | OS, CPU, memory, and uptime information |
| `get_cpu_usage` | Real-time CPU statistics and per-core usage |
| `get_memory_usage` | RAM usage details and percentages |
| `list_processes` | Top processes sorted by CPU and memory |
| `get_disk_usage` | Disk space, mount points, and usage |
| `get_network_info` | Network interfaces and transfer statistics |
| `store_in_file` | Save reports and data to files |

## 📝 Special Commands

- `exit`, `quit`, `bye` - Exit the application
- `clear` - Clear the screen
- `history` - Show conversation history

## 🏗️ Project Structure
```
system-monitor-chatbot/
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
├── reports/                   # Generated reports (auto-created)
└── .env                       # Configuration
```

## 🔧 Development

### Clone the repository:
```bash
git clone https://github.com/Nishant1195/system-monitor-chatbot.git
cd system-monitor-chatbot
```

### Install dependencies:
```bash
npm install
```

### Run locally:
```bash
npm start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Google Gemini AI](https://ai.google.dev/)
- Uses [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- System monitoring via [systeminformation](https://github.com/sebhildebrandt/systeminformation)

## 📧 Contact

Nishant - [@Nishant1195](https://github.com/Nishant1195)

Project Link: [https://github.com/Nishant1195/system-monitor-chatbot](https://github.com/Nishant1195/system-monitor-chatbot)

---

⭐ If you find this project useful, please consider giving it a star!