import { registry } from './openapi.js';
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import * as yaml from 'yaml';
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerRoutes } from './routes/index.js';

async function generate() {
  // Mock fastify instance to capture route registration
  const fastifyMock = {
    register: (plugin: any, opts: any) => {
      if (typeof plugin === 'function') {
        plugin(fastifyMock, opts);
      }
      return fastifyMock;
    },
    get: (path: string, handler: any) => {
      return fastifyMock;
    },
    decorate: () => {}
  } as any;

  await registerRoutes(fastifyMock);

  // Now generate the spec
  // Now generate the spec
  const generator = new OpenApiGeneratorV3(registry.definitions);
  const document = generator.generateDocument({
    openapi: '3.0.3',
    info: {
      title: 'Apex Fusion Data Provider API',
      description: 'API Spec',
      version: '1.0.0'
    },
    servers: [{ url: 'http://localhost:4010' }]
  });

  // Debug: Find functions
  function findFunctions(obj: any, path: string[] = []) {
    if (typeof obj === 'function') {
      console.error('Found function at path:', path.join('.'));
      return;
    }
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        findFunctions(obj[key], [...path, key]);
      }
    }
  }
  findFunctions(document);

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const outputPath = path.resolve(__dirname, '../../generated-openapi.yaml');
  const outputPathJson = path.resolve(__dirname, '../../generated-openapi.json');

  try {
    const yamlString = yaml.stringify(document);
    fs.writeFileSync(outputPath, yamlString);
    console.log(`OpenAPI spec generated at ${outputPath}`);
  } catch (e) {
    console.error('YAML stringify failed:', e);
    // Fallback to JSON
    fs.writeFileSync(outputPathJson, JSON.stringify(document, null, 2));
    console.log(`OpenAPI spec (JSON) generated at ${outputPathJson}`);
  }

  // Exit locally
  process.exit(0);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
