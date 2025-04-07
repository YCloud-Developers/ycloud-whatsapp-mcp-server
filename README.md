# YCloud WhatsApp API MCP 服务器

[English](README-en.md) | 中文

这是一个基于[Model Context Protocol (MCP)](https://modelcontextprotocol.io/)构建的YCloud WhatsApp API服务器。它能够自动从YCloud WhatsApp OpenAPI规范中生成工具，让AI模型（如Claude）可以直接与YCloud WhatsApp API交互。

## 前提条件

在使用此服务器之前，您需要：

1. 在 [YCloud官网](https://www.ycloud.com) 注册一个账户
2. 获取您的API密钥（请参阅下面的说明）
3. 安装必要的软件依赖（请参阅下面的说明）

## 系统要求

- Node.js v16.0.0 或更高版本
- npm v7.0.0 或更高版本
- Claude 桌面应用（如果要与 Claude 集成）

## 功能

- 自动从OpenAPI规范生成MCP工具
- 支持所有YCloud API端点
- 支持API认证
- 自动处理参数类型和验证
- 支持HTTP请求和响应处理

## 安装

```bash
# 克隆仓库
git clone https://github.com/YCloud-Developers/ycloud-whatsapp-mcp-server.git
cd ycloud-whatsapp-mcp-server

# 安装依赖
npm install

# 构建项目
npm run build
```

## 使用方法

### 获取API密钥

要使用YCloud API，您需要一个API密钥进行身份验证：

1. 登录到 [YCloud控制台](https://www.ycloud.com/console/)
2. 导航到开发者页面
3. 在此页面上，您可以找到您的API密钥

API密钥应作为请求头 `X-API-Key` 包含在所有API请求中。

### 环境变量配置

您可以通过以下环境变量配置服务器：

- `API_BASE_URL`: YCloud API的基础URL（默认：https://api.ycloud.com/v2）
- `OPENAPI_SPEC_PATH`: OpenAPI规范的路径或URL（默认：https://docs.ycloud.com/openapi.json）
- `API_HEADERS`: API请求头（格式：key1:value1,key2:value2）

### Claude桌面端集成

要在Claude桌面应用中使用此服务器，请编辑Claude配置文件：

1. 找到或创建Claude桌面配置文件：
   - 在macOS上：`~/Library/Application Support/Claude/claude_desktop_config.json`
   - 在Windows上：`%APPDATA%\Claude\claude_desktop_config.json`

2. 添加以下配置：

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

3. 替换`your-api-key-here`为您的YCloud API密钥

### 直接运行

```bash
# 设置环境变量并运行
API_BASE_URL=https://api.ycloud.com/v2 \
API_HEADERS="X-API-Key:your-api-key-here" \
npm start
```

## 示例

在Claude中，您可以使用以下提示来与YCloud API交互：

```
请帮我查询我的YCloud账户余额。
```

Claude将能够调用适当的API端点并返回结果。

## 调试

在开发过程中，您可以使用以下方法调试MCP服务器：

1. 查看服务器日志：服务器运行时会输出调试信息
2. 使用MCP Inspector：您可以使用[MCP Inspector](https://modelcontextprotocol.io/inspector)工具来检查服务器的运行状态
3. Claude桌面端调试：在Claude桌面应用中可以查看服务器状态和日志

## 贡献

欢迎提交Pull Request或创建Issue来改进此项目。

## 许可证

MIT 