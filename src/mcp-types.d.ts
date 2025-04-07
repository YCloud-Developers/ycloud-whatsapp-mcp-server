declare module '@modelcontextprotocol/sdk/server/index.js' {
  export class Server {
    constructor(options: { 
      name: string; 
      version: string; 
      description: string;
      capabilities: {
        tools: boolean;
        streaming: boolean;
      };
    });
    
    registerTool(tool: {
      name: string;
      description: string;
      parameters: any;
      handler: (params: any) => Promise<any>;
    }): void;
    
    listen(transport: any): Promise<void>;
  }
}

declare module '@modelcontextprotocol/sdk/server/stdio.js' {
  export class StdioServerTransport {
    constructor();
  }
}

declare module '@modelcontextprotocol/sdk/validation.js' {
  export const z: {
    string(): any;
    number(): {
      int(): any;
    };
    boolean(): any;
    any(): any;
    object(schema: Record<string, any>): any;
  };
} 