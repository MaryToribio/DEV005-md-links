#!/usr/bin/env node

// Módulo path de Node.js
import path from "path";
// Módulo fs de Node.js
import { promises as fs } from "fs";
import {
  extractLinksFromDirectory,
  extractLinksFromFile,
  countLinks,
} from "./library.mjs";

const optionTerminal = {
  validate: process.argv.includes("--validate"), // Verifica si se proporcionó la opción --validate
  stats: process.argv.includes("--stats"), // Verifica si se proporcionó la opción --stats
};

const filePathTerminal = process.argv[2]; // Obtiene el primer argumento después del nombre del archivo

function mdLinks(options, filePath) {
  const absolutePath = path.resolve(process.cwd(), filePath);

  return fs
    .stat(absolutePath)
    .then((metadata) => {
      if (metadata.isDirectory()) {
        return extractLinksFromDirectory(absolutePath, options.validate);
      } else if (metadata.isFile() && path.extname(absolutePath) === ".md") {
        return extractLinksFromFile(absolutePath, options.validate);
      } else {
        throw new Error("La ruta debe ser un archivo Markdown o un directorio.");
      }
    })
    .catch(() => {
      throw new Error("La ruta debe ser un archivo Markdown o un directorio.");
    });
}

export { mdLinks }; // Exporta la función mdLinks

// Ejecución principal del programa
mdLinks(optionTerminal, filePathTerminal)
  .then((links) => {
    if (optionTerminal.stats) {
      if (optionTerminal.validate) {
      }
    } else {
    }
  })
  .catch((error) => {
    // Manejo de errores
  });
