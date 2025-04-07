import SwaggerParser from '@apidevtools/swagger-parser';
import axios from 'axios';
/**
 * 加载OpenAPI规范
 * @param specPath OpenAPI规范路径或URL
 * @returns 解析后的OpenAPI规范
 */
export async function loadOpenApiSpec(specPath) {
    try {
        console.error(`正在加载OpenAPI规范: ${specPath}`);
        let spec;
        if (specPath.startsWith('http')) {
            // 从URL加载
            const response = await axios.get(specPath);
            spec = await SwaggerParser.parse(response.data);
        }
        else {
            // 从文件加载
            spec = await SwaggerParser.parse(specPath);
        }
        console.error('OpenAPI规范加载成功');
        return spec;
    }
    catch (error) {
        console.error('加载OpenAPI规范时出错:', error);
        throw new Error(`无法加载OpenAPI规范: ${error instanceof Error ? error.message : String(error)}`);
    }
}
