import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import axios, { AxiosError } from 'axios';
import { OpenAPI } from 'openapi-types';
import { z } from 'zod';

/**
 * 从OpenAPI路径操作中提取参数模式
 */
function extractParamsSchema(operation: any): any {
  const properties: Record<string, any> = {};
  const required: string[] = [];

  // 处理路径参数
  if (operation.parameters) {
    operation.parameters.forEach((param: any) => {
      if (param.in === 'path' || param.in === 'query') {
        let schema;
        switch (param.schema?.type) {
          case 'string':
            schema = z.string();
            break;
          case 'integer':
            schema = z.number().int();
            break;
          case 'number':
            schema = z.number();
            break;
          case 'boolean':
            schema = z.boolean();
            break;
          default:
            schema = z.any();
        }
        
        properties[param.name] = schema;
        if (param.required) {
          required.push(param.name);
        }
      }
    });
  }

  // 处理请求体
  if (operation.requestBody) {
    properties['body'] = z.any();
    required.push('body');
  }

  return properties;
}

/**
 * 从OpenAPI规范注册YCloud API工具
 */
export async function registerYCloudTools(
  server: McpServer, 
  openApiSpec: OpenAPI.Document, 
  apiBaseUrl: string, 
  headers: Record<string, string>
) {
  console.error('正在注册YCloud API工具...');

  const paths = openApiSpec.paths || {};
  let registeredToolsCount = 0;
  const registeredTools = new Set<string>();
  
  // 遍历所有API路径和操作
  Object.entries(paths).forEach(([path, pathItem]) => {
    // 只处理与WhatsApp相关的路径
    if (!path.startsWith('/whatsapp')) {
      return;
    }
    
    // 遍历所有HTTP方法
    ['get', 'post', 'put', 'delete', 'patch'].forEach(method => {
      const operation = pathItem?.[method as keyof typeof pathItem];
      if (operation) {
        // 获取原始operationId
        let operationId = operation.operationId || `${method}_${path.replace(/\//g, '_').replace(/[{}]/g, '')}`;
        
        console.error(`原始操作ID: ${operationId}`);
        
        // 处理特定的超长工具名称，无论长度如何
        // 这些是特别长的工具，需要特殊处理
        if (operationId === 'whatsapp_phone_number_retrieve_profile') {
          operationId = 'wa_phone_profile';
        } else if (operationId === 'phone_number_retrieve_commerce_settings' || 
                  operationId === 'whatsapp_phone_number_retrieve_commerce_settings') {
          operationId = 'wa_phone_commerce';
        } else if (operationId.includes('template-retrieve-by-name-and-language') || 
                  operationId.includes('whatsapp_template-retrieve-by-name-and-language')) {
          operationId = 'wa_template_get';
        } else if (operationId.includes('phone_number_update_commerce_settings')) {
          operationId = 'wa_phone_commerce_update';
        } else if (operationId.includes('template-delete-by-name-and-language') || 
                  operationId.includes('whatsapp_template-delete-by-name-and-language')) {
          operationId = 'wa_template_delete';
        } else if (operationId.includes('template-edit-by-name-and-language') || 
                  operationId.includes('whatsapp_template-edit-by-name-and-language')) {
          operationId = 'wa_template_edit';
        } else if (operationId.includes('whatsapp_business_account')) {
          // 从operationId中提取动作部分（list, retrieve等）
          const action = operationId.split('-')[1] || '';
          operationId = `wa_business_${action}`;
        } else if (operationId.includes('whatsapp_inbound_message')) {
          // 从operationId中提取动作部分
          const action = operationId.split('-')[1] || '';
          operationId = `wa_inbound_${action}`;
        } else if (operationId.includes('whatsapp_message_send_directly')) {
          operationId = 'wa_msg_send_direct';
        } else if (operationId.includes('whatsapp_message_send')) {
          operationId = 'wa_msg_send';
        } else if (operationId.includes('whatsapp_message_retrieve')) {
          operationId = 'wa_msg_get';
        } else if (operationId.includes('whatsapp_phone_number_list')) {
          operationId = 'wa_phone_list';
        } else if (operationId.includes('whatsapp_phone_number_retrieve')) {
          operationId = 'wa_phone_get';
        } else if (operationId.includes('whatsapp_phone_number_update')) {
          operationId = 'wa_phone_update';
        } else if (operationId.includes('whatsapp_phone_number_register')) {
          operationId = 'wa_phone_register';
        } else if (operationId.includes('whatsapp_template_list')) {
          operationId = 'wa_template_list';
        } else if (operationId.includes('whatsapp_template_create')) {
          operationId = 'wa_template_create';
        } else {
          // 移除"whatsapp_"前缀，因为我们已经只过滤了whatsapp相关的API
          operationId = operationId.replace(/^whatsapp_/, 'wa_');
          operationId = operationId.replace(/phone_number/, 'phone');
          operationId = operationId.replace(/message/, 'msg');
          operationId = operationId.replace(/business_account/, 'business');
          
          // 如果仍然太长，截断它
          const MAX_LENGTH = 60;
          if (operationId.length > MAX_LENGTH) {
            operationId = operationId.substring(0, MAX_LENGTH);
          }
        }

        // 将连字符替换为下划线
        operationId = operationId.replace(/-/g, '_');

        console.error(`处理后的操作ID: ${operationId}`);
        
        const description = operation.summary || operation.description || `${method.toUpperCase()} ${path}`;
        
        // 提取参数模式
        const paramsSchema = extractParamsSchema(operation);
        
        // 注册工具，直接使用处理后的operationId作为工具名称
        const toolName = operationId;
        
        // 检查工具名称是否已注册
        if (!registeredTools.has(toolName)) {
          server.tool(
            toolName,
            description,
            paramsSchema,
            async (args: Record<string, any>) => {
              try {
                // 解析URL中的路径参数
                let url = `${apiBaseUrl}${path}`;
                Object.keys(args).forEach(key => {
                  if (path.includes(`{${key}}`)) {
                    url = url.replace(`{${key}}`, encodeURIComponent(String(args[key])));
                    delete args[key];
                  }
                });
                
                // 提取请求体和查询参数
                const { body, ...queryParams } = args as Record<string, any>;
                
                // 设置请求选项
                const requestOptions: any = {
                  url,
                  method: method.toUpperCase(),
                  headers: { 
                    'Content-Type': 'application/json',
                    ...headers
                  },
                  params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
                  data: body,
                };
                
                // 发送请求
                const response = await axios(requestOptions);
                return {
                  content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }]
                };
              } catch (error: unknown) {
                if (axios.isAxiosError(error) && error.response) {
                  return {
                    content: [{
                      type: 'text' as const,
                      text: JSON.stringify({
                        error: true,
                        status: error.response.status,
                        message: error.response.data?.message || error.message,
                        data: error.response.data
                      }, null, 2)
                    }]
                  };
                }
                return {
                  content: [{
                    type: 'text' as const,
                    text: JSON.stringify({
                      error: true,
                      message: error instanceof Error ? error.message : String(error)
                    }, null, 2)
                  }]
                };
              }
            }
          );
          registeredTools.add(toolName);
          registeredToolsCount++;
        }
      }
    });
  });
  
  console.error(`YCloud API工具注册成功，共注册了 ${registeredToolsCount} 个WhatsApp相关工具`);
} 