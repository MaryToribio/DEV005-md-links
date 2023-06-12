# Markdown Links

## Índice

* [1. Preámbulo]
* [2. Resumen del proyecto]
* [3. 3. Md-links]
* [4. Como se Precede  a la Instalación]
* [5. Línea de comandos para el uso de modulo]
* [6. Casuisticas del manejo y uso]
* [7. Hacker edition]

***

## 1. Preámbulo

[Markdown](https://es.wikipedia.org/wiki/Markdown) es un lenguaje de marcado
ligero muy popular entre developers. Es usado en muchísimas plataformas que
manejan texto plano (GitHub, foros, blogs, ...) y es muy común
encontrar varios archivos en ese formato en cualquier tipo de repositorio
(empezando por el tradicional `README.md`).

Estos archivos `Markdown` normalmente contienen _links_ (vínculos/ligas) que
muchas veces están rotos o ya no son válidos y eso perjudica mucho el valor de
la información que se quiere compartir.

Dentro de una comunidad de código abierto, nos han propuesto crear una
herramienta usando [Node.js](https://nodejs.org/), que lea y analice archivos
en formato `Markdown`, para verificar los links que contengan y reportar
algunas estadísticas.

![md-links](https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg)

## 2. Resumen del proyecto

En este proyecto crearás una herramienta de línea de comando (CLI) así como tu
propia librería (o biblioteca - library) en JavaScript.

En esta oportunidad nos alejamos un poco del navegador para construir un
programa que se ejecute usando Node.js. Aprenderemos sobre procesos
(`process.env`, `process.argv`, ...), cómo interactuar con el sistema archivos,
cómo hacer consultas de red, etc.

[Node.js](https://nodejs.org/es/) es un entorno de ejecución para JavaScript
construido con el [motor de JavaScript V8 de Chrome](https://developers.google.com/v8/).
Esto nos va a permitir ejecutar JavaScript en el entorno del sistema operativo,
ya sea tu máquina o un servidor, lo cual nos abre las puertas para poder
interactuar con el sistema en sí, archivos, redes, ...

Diseñar tu propia librería es una experiencia fundamental para cualquier
desarrollador porque que te obliga a pensar en la interfaz (API) de tus
_módulos_ y cómo será usado por otros developers. Debes tener especial
consideración en peculiaridades del lenguaje, convenciones y buenas prácticas.

## 3. Md-links
Este es un módulo de Node.js que analiza archivos Markdown y devuelve los links encontrados. También puede validar los links y proporcionar estadísticas sobre los mismos.

## 4. Como se Precede  a la Instalación
Para instalar el módulo, ejecuta el siguiente comando:
```sh 
npm install MariaToribio/DEV005-md-links 
```

## 5. Línea de comandos para el uso de modulo
Puedes usar el módulo desde la línea de comandos ejecutando el siguiente comando:
```sh
md-links <path-to-file-or-directory> [--validate] [--stats]
```

## 6. Casuisticas del manejo y uso
**Donde:**
- `path-to-file-or-directory` : Ruta del archivo o directorio Markdown a analizar.
- `--validate`: Opción que permite validar los links encontrados.
- `--stats`: Opción que permite obtener estadísticas de los links encontrados.

**Ejemplos**
- Para obtener los links encontrados en el archivo README.md, ejecuta el siguiente comando:
```sh 
md-links README.md
```
- Para validar los links encontrados en el archivo README.md, ejecuta el siguiente comando:
```sh
md-links README.md --validate
```
- Para obtener estadísticas de los links encontrados en el archivo README.md, ejecuta el siguiente comando:
```sh
md-links README.md --stats
```
- Para obtener estadísticas y validar los links encontrados en el archivo README.md, ejecuta el siguiente comando:
```sh
md-links README.md --validate --stats


