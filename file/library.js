import { promises as fs } from "fs";
import path from "path";

// Se importa el módulo axios para hacer peticiones HTTP
import axios from "axios";

// Se importa el módulo marked para hacer cambio de markdown a HTML
import { marked } from "marked";

// Se importa el módulo cheerio para crear documento virtual
import { load } from "cheerio";

//Extraer los links del archivo markdown
function extractLinksFromFile(filePath, validate) {
  // Leer el contenido del archivo en la ruta especificada
  return fs.readFile(filePath, "utf8").then((fileContent) => {
    // Tomar el contenido del archivo leído y lo convierte a HTML
    const htmlContent = marked(fileContent);
    // Crear un objeto DOM virtual en memoria del HTML
    const dom = load(htmlContent);

    const links = dom("a").map((_,element) => {
        const href = dom(element).attr("href");
        const text = dom(element).text();
        return { href, text };
      })
      .get(); //.get() convierte el objeto jQuery en una matriz JavaScript simple que contiene los elementos resultantes del método map().

    if (validate) {
      const linkPromises = links.map((link) => {
        return validateLinks(link, filePath);
      });

      return Promise.all(linkPromises);
    } else {
      return links.map((link) => ({
        href: link.href,
        text: link.text,
        file: filePath,
      }));
    }
  });
}

// Se recibe como argumento la ruta de un directorio y se encarga de extraer todos los enlaces presentes en los archivos Markdown.
function extractLinksFromDirectory(directoryPath, validate) {
  return fs.readdir(directoryPath).then((files) => {
    const promises = files.map((file) => {
      const filePath = path.join(directoryPath, file);
      return fs.stat(filePath).then((stats) => {
        if (stats.isDirectory()) {
          return extractLinksFromDirectory(filePath, validate);
        } else if (stats.isFile() && path.extname(file) === ".md") {
          return extractLinksFromFile(filePath, validate);
        } else {
          return Promise.resolve([]);
        }
      });
    });
    return Promise.all(promises).then((linksArray) => [].concat(...linksArray));
  });
}

//Validar el estado de los links encontrados
function validateLinks(link, filePath) {
  // Máximo 50 caracteres en el texto
  const text = link.text.length > 50 ? link.text.substring(0, 50) : link.text;

  return axios
    .head(link.href)
    .then((response) => ({
      href: link.href,
      text: text,
      file: filePath,
      status: response.status,
      ok: response.status >= 200 && response.status < 300 ? "ok" : "fail",
    }))
    .catch((error) => ({
      href: link.href,
      text: text,
      file: filePath,
      status: error.response ? error.response.status : "unknown",
      ok: "fail",
    }));
}

// Función para contar los links
function countLinks(links, options) {
  const uniqueLinks = new Set();

  if (options.validate && options.stats) {
    let brokenLinks = 0;
    links.forEach((link) => {
      uniqueLinks.add(link.href);
      if (link.ok === "fail") {
        brokenLinks++;
      }
    });
    return {
      total: links.length,
      unique: uniqueLinks.size,
      broken: brokenLinks,
    };
  } else if (!options.validate && options.stats) {
    links.forEach((link) => {
      uniqueLinks.add(link.href);
    });
    return {
      total: links.length,
      unique: uniqueLinks.size,
    };
  }
}

// Se exporta la función mdLinks para que pueda ser utilizada desde otro archivo.
export {
  extractLinksFromDirectory,
  extractLinksFromFile,
  validateLinks,
  countLinks,
};
