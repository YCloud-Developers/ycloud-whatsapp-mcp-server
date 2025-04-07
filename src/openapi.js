import axios from 'axios';
import fs from 'fs/promises';
import yaml from 'js-yaml';

export async function loadOpenApiSpec(specPath) {
  try {
    let spec;
    
    if (specPath.startsWith('http://') || specPath.startsWith('https://')) {
      // 从URL加载
      const response = await axios.get(specPath);
      spec = response.data;
    } else {
      // 从本地文件加载
      const content = await fs.readFile(specPath, 'utf8');
      
      // 根据文件扩展名决定解析方式
      if (specPath.endsWith('.yaml') || specPath.endsWith('.yml')) {
        spec = yaml.load(content);
      } else {
        spec = JSON.parse(content);
      }
    }
    
    return spec;
  } catch (error) {
    throw new Error(`无法加载OpenAPI规范: ${error.message}`);
  }
} 