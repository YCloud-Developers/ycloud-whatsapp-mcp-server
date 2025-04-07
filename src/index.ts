import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import { loadOpenApiSpec } from './openapi.js';
import { registerYCloudTools } from './tools.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    // 获取环境变量
    const apiBaseUrl = process.env.API_BASE_URL || 'https://api.ycloud.com/v2';
    const openApiSpecPath = process.env.OPENAPI_SPEC_PATH || path.join(__dirname, '..', 'ycloud-api-v2.yaml');
    const apiHeaders = process.env.API_HEADERS || '';
    
    // 解析API头信息
    const headers: Record<string, string> = {};
    if (apiHeaders) {
      apiHeaders.split(',').forEach(header => {
        const [key, value] = header.split(':');
        if (key && value) {
          headers[key.trim()] = value.trim();
        }
      });
    }

    console.error('启动YCloud MCP服务器...');
    console.error(`API基础URL: ${apiBaseUrl}`);
    console.error(`OpenAPI规范路径: ${openApiSpecPath}`);
    
    // 创建服务器
    const server = new McpServer({
      name: 'ycloud-mcp-server',
      version: '0.1.0',
      description: 'YCloud API MCP服务器'
    });

    // 加载OpenAPI规范并注册工具
    const openApiSpec = await loadOpenApiSpec(openApiSpecPath);
    await registerYCloudTools(server, openApiSpec, apiBaseUrl, headers);
    
    // 启动服务器
    const transport = new StdioServerTransport() as Transport;
    await server.connect(transport);
    
    console.error('YCloud MCP服务器已启动');
  } catch (error) {
    console.error('启动YCloud MCP服务器时出错:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('未处理的错误:', error);
  process.exit(1);
}); 