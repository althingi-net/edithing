# Shared library for slatejs logic of the Edithing Editor
Can be used by frontend and backend for all slate operations.

## Separation of react code
This package does not use slate-react (in any way) and slate-history (except for types and tests) to allow the backend to run an efficient slate core for pure data operations.

## Index Barrel File
THe index.ts is generated via `npm run build:index`. All consuming packages should import anything from this package via the root e.g.: `import { MetaType, findNode, setMeta } from 'law-document';`

## How to consume this package
Add to tsconfig.json:
```
    "references": [{
        "path": "../law-document"
    }],
```
and run `npm i ../law-document`

Typescript references will include referenced packages during the build process of the main app compilation (also supported in various bundlers) so there is no need to build this package before consumption.