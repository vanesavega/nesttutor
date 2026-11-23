# Answers

For each file: write the exact error message, why Node reacted that way, and what you changed.

## a-require.js
- Error message: ReferenceError: require is not defined in ES module scope, you can use import instead
- Why it happens: se esta suando require en lugar de import y el type dice que debe esperar archivos de tipo ESM
- Fix: cmabiar require por import

## b-extension.js
- Error message: Error [ERR_MODULE_NOT_FOUND]: Cannot find module
- Why it happens: faltaba la extencion
- Fix: poner el .js

## c-dirname.js
- Error message: ReferenceError: __dirname is not defined in ES module scope
- Why it happens: dirname no eciste para ESM 
- Fix:cambiarlo por import.meta.dirname
