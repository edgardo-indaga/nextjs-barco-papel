#!/usr/bin/env node
/**
 * Script de backup para Vercel Blob Storage
 * Descarga todos los archivos manteniendo la estructura de carpetas
 * con soporte completo de paginación (más de 100 archivos)
 */

import { createWriteStream, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { pipeline } from "node:stream/promises";

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const OUTPUT_DIR = join(process.cwd(), "vercel-blob-backup");
const API_BASE = "https://blob.vercel-storage.com";

if (!TOKEN) {
  console.error("ERROR: Variable BLOB_READ_WRITE_TOKEN no encontrada.");
  console.error(
    "Ejecuta: BLOB_READ_WRITE_TOKEN=tu_token bun run scripts/backup-vercel-blob.mjs"
  );
  process.exit(1);
}

async function listarBlobs(cursor = null) {
  const params = new URLSearchParams({ limit: "1000" });
  if (cursor) params.set("cursor", cursor);

  const res = await fetch(`${API_BASE}?${params}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error listando blobs: ${res.status} ${text}`);
  }
  return res.json();
}

async function descargarArchivo(blob, index, total) {
  const { url, pathname, size } = blob;

  // Construir ruta local preservando estructura de carpetas
  const localPath = join(OUTPUT_DIR, pathname);
  const localDir = dirname(localPath);

  // Crear carpetas si no existen
  if (!existsSync(localDir)) {
    mkdirSync(localDir, { recursive: true });
  }

  // Saltar si ya existe (para reanudar descargas)
  if (existsSync(localPath)) {
    console.log(
      `  [${index}/${total}] OMITIDO (ya existe): ${pathname}`
    );
    return { status: "omitido", pathname };
  }

  console.log(
    `  [${index}/${total}] Descargando: ${pathname} (${formatSize(size)})`
  );

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) {
    // Intentar con token en query param como fallback
    const urlConToken = new URL(url);
    urlConToken.searchParams.set("token", TOKEN);
    const res2 = await fetch(urlConToken.toString());
    if (!res2.ok) {
      console.error(`    ERROR ${res2.status} al descargar: ${pathname}`);
      return { status: "error", pathname };
    }
    const fileStream2 = createWriteStream(localPath);
    await pipeline(res2.body, fileStream2);
    return { status: "ok", pathname };
  }

  const fileStream = createWriteStream(localPath);
  await pipeline(res.body, fileStream);

  return { status: "ok", pathname };
}

function formatSize(bytes) {
  if (!bytes) return "desconocido";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function main() {
  console.log("=".repeat(60));
  console.log("BACKUP VERCEL BLOB STORAGE");
  console.log("=".repeat(60));
  console.log(`Destino: ${OUTPUT_DIR}`);
  console.log("");

  // Crear carpeta de salida
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Listar TODOS los blobs con paginación
  console.log("Obteniendo lista de archivos...");
  const todosLosBlobs = [];
  let cursor = null;
  let pagina = 1;

  do {
    const data = await listarBlobs(cursor);
    // Filtrar entradas vacías (carpetas sin contenido)
    const blobs = (data.blobs || []).filter(
      (b) => b.pathname && !b.pathname.endsWith("/")
    );
    todosLosBlobs.push(...blobs);
    cursor = data.cursor || null;
    console.log(
      `  Página ${pagina}: ${blobs.length} archivos (total acumulado: ${todosLosBlobs.length})`
    );
    pagina++;
  } while (cursor);

  const total = todosLosBlobs.length;
  console.log(`\nTotal de archivos encontrados: ${total}`);
  console.log("-".repeat(60));

  if (total === 0) {
    console.log("No hay archivos en Vercel Blob.");
    return;
  }

  // Descargar archivos
  console.log("\nIniciando descarga...\n");
  const resultados = { ok: 0, omitido: 0, error: 0 };

  for (let i = 0; i < todosLosBlobs.length; i++) {
    const blob = todosLosBlobs[i];
    const resultado = await descargarArchivo(blob, i + 1, total);
    resultados[resultado.status]++;
  }

  // Resumen final
  console.log("\n" + "=".repeat(60));
  console.log("RESUMEN");
  console.log("=".repeat(60));
  console.log(`  Descargados:  ${resultados.ok}`);
  console.log(`  Omitidos:     ${resultados.omitido}`);
  console.log(`  Errores:      ${resultados.error}`);
  console.log(`  TOTAL:        ${total}`);
  console.log(`\nArchivos guardados en: ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error("\nERROR FATAL:", err.message);
  process.exit(1);
});
