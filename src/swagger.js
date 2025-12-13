const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const fs = require('fs');

const baseUrl =
  process.env.RENDER_EXTERNAL_URL ||
  `http://localhost:${process.env.PORT || 3000}`;

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'P3 API - Depuración Swagger',
    version: '1.0.0',
    description: 'Verificando lectura de archivos y anotaciones @openapi',
  },
  servers: [{ url: baseUrl }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
    ,
    schemas: {
      Category: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Rock' },
          description: { type: 'string', example: 'Discos de rock clásico' }
        }
      },
      Tag: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Importado' }
        }
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'GeForce RTX 3080' },
          description: { type: 'string', example: 'Tarjeta gráfica de alto rendimiento para gaming y creación de contenido' },
          price: { type: 'number', format: 'float', example: 29.99 },
          stock: { type: 'integer', example: 5 },
          brand: { type: 'string', example: 'NVIDIA' },
          model: { type: 'string', example: 'RTX 3080' },
          generation: { type: 'string', example: 'Ampere' },
          socket: { type: 'string', example: 'PCIe 4.0' },
          formFactor: { type: 'string', example: 'Full Height' },
          wattage: { type: 'integer', example: 320 },
          sku: { type: 'string', example: 'VIN-0001' },
          condition: { type: 'string', example: 'New' },
          slug: { type: 'string', example: 'geforce-rtx-3080' },
          category: { $ref: '#/components/schemas/Category' },
          tags: { type: 'array', items: { $ref: '#/components/schemas/Tag' } }
        }
      }
      ,
      OrderItem: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          productId: { type: 'integer' },
          quantity: { type: 'integer' },
          unitprice: { type: 'number' }
        }
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          totalAmount: { type: 'number' },
          status: { type: 'string' },
          items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } }
        }
      }
    }
  },
};

const options = {
  definition: swaggerDefinition,
  apis: [
    // Use both absolute globs normalized to forward-slashes (safe on Windows)
    // and relative globs. swagger-jsdoc's glob matching can break with
    // backslashes on Windows, so convert them to POSIX-style paths.
    (() => {
      const base = path.join(process.cwd(), 'src').replace(/\\\\/g, '/');
      return `${base}/**/*.js`;
    })(),
    (() => {
      const base = path.join(process.cwd(), 'src').replace(/\\\\/g, '/');
      return `${base}/*.js`;
    })(),
    // Relative patterns as fallback
    'src/**/*.js',
    'src/*.js',
  ],
};

// 🔍 Depuración de rutas
console.log('\n🔍 Archivos que Swagger intentará leer:');
options.apis.forEach((p) => console.log('   -', p));

// 🔍 Listar los archivos reales en routes/
const routesDir = path.join(process.cwd(), 'src/routes');
console.log('\n📂 Archivos detectados en src/routes:');
if (fs.existsSync(routesDir)) {
  const files = fs.readdirSync(routesDir);
  files.forEach((f) => console.log('   •', f));
} else {
  console.log('   ❌ No se encontró la carpeta routes');
}

// 🔍 Generar documentación
const swaggerSpec = swaggerJsdoc(options);

// � Inyección manual de rutas faltantes para asegurar visibilidad en UI
// (se usan definiciones mínimas que referencian los schemas definidos arriba)
const extraPaths = {
  '/categories': {
    get: {
      summary: 'List categories (protected)',
      security: [{ bearerAuth: [] }],
      tags: ['Admin - Categories'],
      responses: {
        '200': { description: 'OK', content: { 'application/json': { schema: { type: 'object' } } } }
      }
    },
    post: {
      summary: 'Create category (protected)',
      security: [{ bearerAuth: [] }],
      tags: ['Admin - Categories'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Category' }
          }
        }
      },
      responses: { '201': { description: 'Created' } }
    }
  },
  '/categories/{id}': {
    get: { summary: 'Get category', security: [{ bearerAuth: [] }], tags: ['Admin - Categories'], parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'OK' } } },
    put: { summary: 'Update category', security: [{ bearerAuth: [] }], tags: ['Admin - Categories'], parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'OK' } } },
    delete: { summary: 'Delete category', security: [{ bearerAuth: [] }], tags: ['Admin - Categories'], parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'OK' } } }
  },
  '/tags': {
    get: { summary: 'List tags', security: [{ bearerAuth: [] }], tags: ['Admin - Tags'], responses: { '200': { description: 'OK' } } },
    post: { summary: 'Create tag', security: [{ bearerAuth: [] }], tags: ['Admin - Tags'], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Tag' } } } }, responses: { '201': { description: 'Created' } } }
  },
  '/tags/{id}': {
    get: { summary: 'Get tag', security: [{ bearerAuth: [] }], tags: ['Admin - Tags'], parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'OK' } } },
    put: { summary: 'Update tag', security: [{ bearerAuth: [] }], tags: ['Admin - Tags'], parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'OK' } } },
    delete: { summary: 'Delete tag', security: [{ bearerAuth: [] }], tags: ['Admin - Tags'], parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'OK' } } }
  },
  '/products': {
    get: {
      summary: 'Public list of products',
      tags: ['Public - Products'],
      parameters: [
        { name: 'page', in: 'query' },
        { name: 'limit', in: 'query' },
        { name: 'category', in: 'query' },
        { name: 'tags', in: 'query' },
        { name: 'price_min', in: 'query' },
        { name: 'price_max', in: 'query' },
        { name: 'search', in: 'query' },
        { name: 'brand', in: 'query' },
        { name: 'model', in: 'query' },
        { name: 'generation', in: 'query' }
      ],
      responses: { '200': { description: 'OK' } }
    },
    post: { summary: 'Create product', security: [{ bearerAuth: [] }], tags: ['Admin - Products'], responses: { '201': { description: 'Created' } } }
  },
  '/products/{id}': {
    get: { summary: 'Get product by id (admin)', security: [{ bearerAuth: [] }], tags: ['Admin - Products'], parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'OK' } } },
    put: { summary: 'Update product', security: [{ bearerAuth: [] }], tags: ['Admin - Products'], parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'OK' } } },
    delete: { summary: 'Delete product', security: [{ bearerAuth: [] }], tags: ['Admin - Products'], parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'OK' } } }
  },
  '/p/{id}-{slug}': {
    get: { summary: 'Public product by id and slug (self-healing)', tags: ['Public - Products'], parameters: [{ name: 'id', in: 'path', required: true }, { name: 'slug', in: 'path', required: true }], responses: { '200': { description: 'OK' }, '301': { description: 'Redirect' } } }
  }
};

// Merge extraPaths without overwriting any methods already detected by swagger-jsdoc.
swaggerSpec.paths = swaggerSpec.paths || {};
Object.keys(extraPaths).forEach((p) => {
  if (!swaggerSpec.paths[p]) {
    // path missing entirely: add it
    swaggerSpec.paths[p] = extraPaths[p];
    return;
  }
  // path exists: merge methods without overwriting
  Object.keys(extraPaths[p]).forEach((method) => {
    if (!swaggerSpec.paths[p][method]) {
      swaggerSpec.paths[p][method] = extraPaths[p][method];
    } else {
      // method exists: ensure security is present if missing
      if (!swaggerSpec.paths[p][method].security && extraPaths[p][method].security) {
        swaggerSpec.paths[p][method].security = extraPaths[p][method].security;
      }
      // ensure requestBody is present when extraPaths provides one
      if (!swaggerSpec.paths[p][method].requestBody && extraPaths[p][method].requestBody) {
        swaggerSpec.paths[p][method].requestBody = extraPaths[p][method].requestBody;
      }
      // ensure parameters are present when extraPaths provides them
      if ((!swaggerSpec.paths[p][method].parameters || swaggerSpec.paths[p][method].parameters.length === 0) && extraPaths[p][method].parameters) {
        swaggerSpec.paths[p][method].parameters = extraPaths[p][method].parameters;
      }
    }
  });
});

// �🔍 Imprimir diagnóstico del spec (claves principales)
try {
  console.log('\n🧾 Claves generadas en swaggerSpec:', Object.keys(swaggerSpec || {}));
  // Imprimir un fragmento del JSON para inspección rápida
  const dump = JSON.stringify(swaggerSpec || {}, null, 2);
  console.log('\n📄 Fragmento de swaggerSpec:\n', dump.slice(0, 2000));
} catch (err) {
  console.log('Error al serializar swaggerSpec:', err.message);
}

// 🔍 Mostrar archivos efectivos que coinciden con cada patrón (depuración)
try {
  const glob = require('glob');
  console.log('\n🔎 Resultados de los globs:');
  options.apis.forEach((pattern) => {
    try {
      const matches = glob.sync(pattern, { nodir: true });
      console.log(`  Pattern: ${pattern}`);
      if (matches.length === 0) console.log('    -> (no matches)');
      matches.forEach((m) => console.log('    -', m));
    } catch (err) {
      console.log('  Error al resolver pattern', pattern, err.message);
    }
  });
} catch (err) {
  console.log('\n⚠️ No se pudo cargar "glob" para depuración extra (no es crítico)');
}

// 🔍 Inspección rápida: leer cada archivo coincidente y mostrar si contiene '@openapi'
try {
  console.log('\n🔬 Comprobando contenido de archivos para "@openapi"...');
  const allPatterns = options.apis;
  const seen = new Set();
  allPatterns.forEach((pattern) => {
    try {
      const matches = require('glob').sync(pattern, { nodir: true });
      matches.forEach((file) => {
        if (seen.has(file)) return;
        seen.add(file);
        try {
          const content = fs.readFileSync(file, 'utf8');
          const idx = content.indexOf('@openapi');
          if (idx === -1) {
            console.log(`  [NO] ${file} -> no contiene @openapi`);
          } else {
            // intentar extraer el bloque JSDoc completo que contiene @openapi
            const startBlock = content.lastIndexOf('/**', idx);
            const endBlock = content.indexOf('*/', idx);
            console.log(`  [OK] ${file} -> @openapi a la posición ${idx}`);
            if (startBlock !== -1 && endBlock !== -1) {
              const block = content.slice(startBlock, endBlock + 2).trim();
              console.log('    JSDoc block:\n', block.split('\n').slice(0,20).join('\n'));
            } else {
              const start = Math.max(0, idx - 40);
              const snippet = content.slice(start, idx + 200).replace(/\r\n/g, '\\n');
              console.log('    snippet:', snippet.split('\n').slice(0,6).join(' | '));
            }
          }
        } catch (err) {
          console.log('   Error leyendo', file, err.message);
        }
      });
    } catch (err) {
      /* ignore */
    }
  });
} catch (err) {
  console.log('⚠️ Error durante la inspección de archivos:', err.message);
}

// 🔍 Mostrar cuántas rutas y componentes detectó
if (
  swaggerSpec &&
  swaggerSpec.paths &&
  Object.keys(swaggerSpec.paths).length > 0
) {
  console.log(
    '\n✅ Swagger detectó',
    Object.keys(swaggerSpec.paths).length,
    'rutas:'
  );
  console.log(Object.keys(swaggerSpec.paths));
} else {
  console.log('\n⚠️ Swagger NO detectó rutas @openapi');
}

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('✅ Swagger UI activo en /api-docs');
}

module.exports = setupSwagger;
// expose the generated spec for debugging/tests
module.exports.swaggerSpec = swaggerSpec;
