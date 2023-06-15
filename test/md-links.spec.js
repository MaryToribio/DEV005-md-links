import path from 'path';
import { extractLinksFromFile, extractLinksFromDirectory, validateLinks, countLinks } from '../file/library.mjs';
import { mdLinks } from '../file/index.mjs';


const filePath = './test/test-directory/test-file.md';

// Devuelve una lista de objetos con href, text, file, status y ok cuando options.validate es true
describe('extractLinksFromFile', () => {
  it('Devuelve una lista de objetos con href, text, file, status y ok cuando options.validate es true', () => {
    const options = {
      validate: true
    };

    return extractLinksFromFile(filePath, options).then(links => {
      expect(links).toEqual([
        {
          href: 'https://www.google.com',
          text: 'Google',
          file: './test/test-directory/test-file.md',
          status: 200,
          ok: 'ok'
        },
        {
          href: 'https://www.otroejemplo.com',
          text: 'otro enlace',
          file: './test/test-directory/test-file.md',
          status: 'unknown',
          ok: 'fail'
        }
      ]);
    });
  });

  it('Debe encontrar dos links', () => {
    const options = {
      validate: false
    };

    return extractLinksFromFile(filePath, options).then(links => {
      expect(links.length).toEqual(2);
    });
  });
});

// Se Testea para verificar que la extracción de los links de todos los archivos dentro de directorios y subdirectorios se ejecute correctamente
describe('extractLinksFromDirectory', () => {
  it('Debe retornar un arreglo con los links de todos los archivos', () => {
    const directoryPath = './test/test-directory';
    const expectedLinks = [
      {
        href: 'https://www.google.com',
        text: 'Google',
        file: path.normalize('./test/test-directory/test-file.md')
      },
      {
        href: 'https://www.otroejemplo.com',
        text: 'otro enlace',
        file: path.normalize('./test/test-directory/test-file.md')
      },
      {
        href: 'https://www.github.com',
        text: 'GitHub',
        file: path.normalize('./test/test-directory/test-subdirectory/test-file2.md')
      }
    ];

    return extractLinksFromDirectory(directoryPath, true).then(links => {
      expect(links).toEqual(expectedLinks);
    });
  });
});

// Test de función para contar links y clasificarlos
describe('countLinks', () => {
  const links = [
    { href: 'https://www.google.com', ok: 'ok' },
    { href: 'https://www.github.com', ok: 'fail' },
    { href: 'https://www.twitter.com', ok: 'ok' },
    { href: 'https://www.google.com', ok: 'fail' }
  ];

  it('Debe retornar un objeto con links totales, únicos y rotos cuando validate y stats son true', () => {
    const options = {
      validate: true,
      stats: true
    };
    const expected = { total: 4, unique: 3, broken: 2 };
    expect(countLinks(links, options)).toEqual(expected);
  });

  it('Debe retornar un objeto con links totales y únicos cuando validate es false y stats es true', () => {
    const options = {
      validate: false,
      stats: true
    };
    const expected = { total: 4, unique: 3 };
    expect(countLinks(links, options)).toEqual(expected);
  });

  it('Debe retornar undefined cuando stats es false', () => {
    const options = {
      validate: true,
      stats: false
    };
    expect(countLinks(links, options)).toBeUndefined();
  });
});

// Test para verificar que la función valide links correctamente y arroje los atributos requeridos
describe('validateLinks', () => {
  it('Debe retornar un link como objeto con propiedades status y ok', () => {
    const link = {
      href: 'https://www.google.com',
      text: 'Google'
    };
    const filePath = '/path/file.md';

    return validateLinks(link, filePath).then(result => {
      expect(result).toHaveProperty('href', 'https://www.google.com');
      expect(result).toHaveProperty('text', 'Google');
      expect(result).toHaveProperty('file', '/path/file.md');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('ok');
    });
  });

  it('Debe arrojar la propiedad ok como "ok" si el link funciona', () => {
    const link = {
      href: 'https://www.google.com',
      text: 'Google'
    };
    const filePath = '/path/to/file.md';

    return validateLinks(link, filePath).then(result => {
      expect(result).toHaveProperty('ok', 'ok');
    });
  });

  it('Debe arrojar la propiedad ok como "fail" si el link no funciona', () => {
    const link = {
      href: 'https://www.otroejemplo.com',
      text: 'Otro enlace'
    };
    const filePath = '/path/to/file.md';

    return validateLinks(link, filePath).then(result => {
      expect(result).toHaveProperty('ok', 'fail');
    });
  });
});
