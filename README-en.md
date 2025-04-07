# YCloud WhatsApp API MCP Server

English | [中文](README.md)

This is a YCloud WhatsApp API server built on the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/). It automatically generates tools from YCloud WhatsApp OpenAPI specifications, allowing AI models (such as Claude) to interact directly with YCloud WhatsApp APIs.

## Prerequisites

Before using this server, you need to:

1. Register an account on the [YCloud website](https://www.ycloud.com)
2. Obtain your API key (see instructions below)
3. Install necessary software dependencies (see instructions below)

## System Requirements

- Node.js v16.0.0 or higher
- npm v7.0.0 or higher
- Claude desktop application (if integrating with Claude)

## Features

- Automatically generates MCP tools from OpenAPI specifications
- Supports all YCloud API endpoints
- Supports API authentication
- Automatically handles parameter types and validation
- Supports HTTP request and response processing

## Installation

```bash
# Clone the repository
git clone https://github.com/YCloud-Developers/ycloud-whatsapp-mcp-server.git
cd ycloud-whatsapp-mcp-server

# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

### Obtaining an API Key

To use the YCloud API, you need an API key for authentication:

1. Log in to the [YCloud Console](https://www.ycloud.com/console/)
2. Navigate to the Developers page
3. On this page, you can find your API key

The API key should be included in all API requests as the `X-API-Key` request header.

### Environment Variable Configuration

You can configure the server using the following environment variables:

- `API_BASE_URL`: Base URL for YCloud API (default: https://api.ycloud.com/v2)
- `OPENAPI_SPEC_PATH`: Path or URL to the OpenAPI specification (default: https://docs.ycloud.com/openapi.json)
- `API_HEADERS`: API request headers (format: key1:value1,key2:value2)

### Claude Desktop Integration

To use this server in the Claude desktop application, edit the Claude configuration file:

1. Find or create the Claude desktop configuration file:
   - On macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - On Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the following configuration:

```json
{
  "mcpServers": {
    "ycloud-whatsapp": {
      "command": "node",
      "args": ["path/to/ycloud-whatsapp-mcp-server/build/index.js"],
      "env": {
        "API_BASE_URL": "https://api.ycloud.com/v2",
        "API_HEADERS": "X-API-Key:your-api-key-here"
      }
    }
  }
}
```

3. Replace `your-api-key-here` with your YCloud API key

### Direct Execution

```bash
# Set environment variables and run
API_BASE_URL=https://api.ycloud.com/v2 \
API_HEADERS="X-API-Key:your-api-key-here" \
npm start
```

## Example

In Claude, you can use the following prompt to interact with the YCloud API:

```
Please help me check my YCloud account balance.
```

Claude will be able to call the appropriate API endpoint and return the results.

## Debugging

During development, you can use the following methods to debug the MCP server:

1. View server logs: The server outputs debug information during operation
2. Use MCP Inspector: You can use the [MCP Inspector](https://modelcontextprotocol.io/inspector) tool to check the server's operational status
3. Claude Desktop debugging: You can view server status and logs in the Claude desktop application

## Contributing

Pull requests and issues are welcome to improve this project.

## License

MIT
