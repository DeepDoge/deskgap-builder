# deskgap-builder
builder for DeskGap (https://github.com/patr0nus/DeskGap/)

# usage
```bash
    deskgap-builder  -r <root directory> -o <output directory> -s <target os (linux, macos, windows)>
```

# vue+typescript example
## file structure
```js
project-dir/
├── package.json
├── src/ // vue src
|   └── main.ts // vue entry point
├── public/ // vue public
|   └──  index.html
└── app/
    └──  main.ts // deskgap node entry point
```
## package.json
```json
"scripts": 
{
    "build:render": "vue-cli-service build --modern",
    "build:compile": "tsc ./app/* --outDir ./dist",
    "build:deskgap": "npm run build:compile && deskgap-builder -r ./dist -o ./out -s windows",
    "build": "npm run build:render && npm run build:deskgap"
}

also don't forget to add `out/` in .gitignore
```