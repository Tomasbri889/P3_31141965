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

// 🔍 Imprimir diagnóstico del spec (claves principales)
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
