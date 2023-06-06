#!/usr/bin/env node

import {
  extractLinksFromDirectory,
  extractLinksFromFile,
  countLinks,
} from "../src/myLibrary.js";
// Se importa el módulo fs de Node.js y se usa la propiedad promises para acceder a las funciones del módulo que retornan promesas.
import { promises as fs } from "fs";

// Se importa el módulo path de Node.js Este módulo proporciona utilidades para trabajar con rutas de archivos y directorios
import path from "path";


// Se recibe como argumento la ruta de un archivo o directorio y se extraen todos los enlaces presentes en el archivo Markdown, o en el caso de que sea un directorio, se ejecuta la función extractLinksFromDirectory.
// la función se encarga de extraer los enlaces de un archivo o directorio 
function mdLinks(options, filePath) {
  //se completa el filepath con el directorio de trabajo actual del proceso
  const absolutePath = path.resolve(process.cwd(), filePath);
console.log('absolutePath:',absolutePath);
  return fs.stat(absolutePath)
  .then((metadata) => {
    if (metadata.isDirectory()) {
      //obtuvo información sobre un directorio en el sistema de archivos.

      return extractLinksFromDirectory(absolutePath, options.validate);
    } else if (metadata.isFile() && path.extname(absolutePath) === ".md") {
      //obtuvo información sobre un archivo en el sistema de archivos.

      return extractLinksFromFile(absolutePath, options.validate);
    } else {
      // Si la ruta no es ni un archivo Markdown ni un directorio, se lanza un error.
      throw new Error("La ruta debe ser un archivo Markdown o un directorio.");
    }
  }).catch(() => {
    throw new Error("La ruta debe ser un archivo Markdown o un directorio.");
  });
}

const optionTerminal = {
  validate: process.argv.includes("--validate"), // verifica si se proporcionó la opción --validate
  stats: process.argv.includes("--stats"), // verifica si se proporcionó la opción --stats
};
const filePathTerminal = process.argv[2]; // obtiene el primer argumento después del nombre del archivo

// Llamado a la función mdLinks con una ruta de archivo o directorio
mdLinks(optionTerminal, filePathTerminal)
  .then((links) => {
    if (optionTerminal.stats) {
      if (optionTerminal.validate) {
        console.log("links:", links);
      }

      return console.log("Stats:", countLinks(links, optionTerminal));
    } else {
      return console.log("Links:", links);
    }
  })
  .catch((error) => {
    console.error(error);
  });