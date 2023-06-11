
import path from 'path';
import { extractLinksFromFile, extractLinksFromDirectory, validateLinks, countLinks  } from '../file/library.mjs';
import { mdLinks } from '../file/index.mjs';



describe('extractLinksFromFile', () => {
  it('debería ser una función', () => {
    expect(typeof extractLinksFromFile).toBe('function');
  });
});


const filePath = '../test/example/README2.md';

//Test para verificar que la extracción de los links de un archivo, se ejecute correctamente 
describe('extractLinksFromFile', () => {
  it('Devuelve una lista de objetos con href, text y file cuando options.validate es false', () => {
    // Definir el archivo de prue*ba
    

    // Definir las opciones
    const options = {
      validate: false
    };

    // Llamar a la función y evaluar el resultado
    return extractLinksFromFile(filePath, options).then(links => {
      expect(links).toEqual([
        {
          href: 'https://www.google.com',
          text: 'Google',
          file: './test/test-directory/test-file.md'
        },
        {
          href: 'https://www.otroejemplo.com',
          text: 'otro enlace',
          file: './test/test-directory/test-file.md'
        }
      ]);
    });
  });

  it('Devuelve una lista de objetos con href, text, file, status y ok cuando options.validate es true', () => {
    const options = {
      validate: true
    };

    // Llamar a la función y evaluar el resultado
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
    // Definir el archivo de prueba
    const filePath = './example/README2.md';

    // Definir las opciones
    const options = {
      validate: false
    };

    // Llamar a la función y evaluar el resultado
    return extractLinksFromFile(filePath, options).then(links => {
      expect(links.length).toEqual(2);
    });
  });
});

/*
//Test para verificar que la extracción de los links de todos los archivos dentro de directorios y subdirectorios, se ejecute correctamente 
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


// Verificar funcionamiendo de mdLinks
describe('mdLinks', () => {
  it('debe retornar un array de objetos con los links encontrados en un archivo Markdown', () => {
    const options = {
      validate: false
    };
    return mdLinks(filePath, options)
      .then(links => {
        expect(Array.isArray(links)).toBe(true);
        expect(links.length).toBeGreaterThan(0);
        expect(typeof links[0]).toBe('object');
        expect(links[0]).toHaveProperty('href');
        expect(links[0]).toHaveProperty('text');
        expect(links[0]).toHaveProperty('file');
        expect(links[0]).not.toHaveProperty('status');
        expect(links[0]).not.toHaveProperty('ok');
      });
  });
  it('Debe lanzar un error si se proporciona una ruta inválida', () => {
    const invalidPath = './thumb.png';
    return expect(mdLinks(invalidPath)).rejects.toThrow('La ruta debe ser un archivo Markdown o un directorio.');
  });

  it('Debe devolver un array de enlaces sin estadísticas para la opción --validate', () => {
    const options = { stats: false, validate: true };
    return mdLinks(filePath, options)
      .then(links => {
        expect(Array.isArray(links)).toBe(true);
        expect(links.length).toBeGreaterThan(0);
      });
  });

  it('Debe devolver un array de enlaces sin estadísticas para la opción por defecto', () => {
    const options = {};
    return mdLinks(filePath, options)
      .then(links => {
        expect(Array.isArray(links)).toBe(true);
        expect(links.length).toBeGreaterThan(0);
      });
  });
  it('Debería retornar una promesa que resuelve a un array de objetos', () => {
    const options = {validate: false};
    const result = mdLinks(filePath, options);

    return expect(result).resolves.toBeInstanceOf(Array); // Verificar que se retorna un array de objetos
  });
  it('Debería retornar un array de objetos de links cuando se ingresa la ruta de un directorio', () => {
    const options = {validate: false};
    const filePath = './test/test-directory/';

    return mdLinks(filePath, options).then(links => {
      expect(links).toBeInstanceOf(Array);
      expect(links.length).toBeGreaterThan(0);
    });
  });
});

//Test de función para contar links y clasificarlos
describe('countLinks', () => {
  const links = [
    { href: 'https://www.google.com', ok: 'ok' },
    { href: 'https://www.github.com', ok: 'fail' },
    { href: 'https://www.twitter.com', ok: 'ok' },
    { href: 'https://www.google.com', ok: 'fail' }
  ];
  
  it('Debe retornar un objeto con links totales, únicos y rotos cuando validate y stats son true', () => {
    const options = { validate: true, stats: true };
    const expected = { total: 4, unique: 3, broken: 2 };
    expect(countLinks(links, options)).toEqual(expected);
  });

  it('Debe retornar un objeto con links totales y únicos cuando validate es false y stats es true', () => {
    const options = { validate: false, stats: true };
    const expected = { total: 4, unique: 3 };
    expect(countLinks(links, options)).toEqual(expected);
  });

  it('Debe retornar undefined cuando stats es false', () => {
    const options = { validate: true, stats: false };
    const expected = { undefined };
    expect(countLinks(links, options)).toEqual.undefined;
  });
});

// Test para verificar que la función valide links correctamente y arroje los atributos requeridos
describe('validateLinks', () => {
  it('Debe retornar un link como objeto con propiedades status y ok', () => {
    const link = {
      href: 'https://www.google.com',
      text: 'Google',
    };
    const filePath = '/path/file.md';

    return validateLinks(link, filePath)
      .then(result => {
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
      text: 'Google',
    };
    const filePath = '/path/to/file.md';

    return validateLinks(link, filePath)
      .then(result => {
        expect(result).toHaveProperty('ok', 'ok');
      });
  });

  

  it('Debe arrojar la propiedad ok como "fail" si el link no funciona', () => {
    const link = {
      href: 'https://www.otroejemplo.com',
      text: 'Otro enlace',
    };
    const filePath = '/path/to/file.md';

    return validateLinks(link, filePath)
      .then(result => {
        expect(result).toHaveProperty('ok', 'fail');
      });
  });
});
*/
