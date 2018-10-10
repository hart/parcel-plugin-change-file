# :ambulance: parcel-plugin-change-file

## :bulb: How ignore parcel bundler file ?

On Parcel build end, change index.html context, and copy static files in outDir

## :building_construction: Install

```sh
$ yarn add -D @hart/parcel-plugin-change-file
```

## :lipstick: Inject unbundled scripts into document.head

- Inject script tag(s) just before `</head>`
- copy config.js into the project root

```js
module.exports = {
  inject: ['<script src="/config.js"></script>']
  copy: ['./config.js']
};
```

```html
<head>
  <title><!-- parcel-plugin-change-file-0 --></title>
<script src="/config.js"></script></head>
```

## :truck: Copy files to dist/

Create `parcel-plugin-change-file.js` in project-dir

```js
module.exports = {
  copy: ["src/assets"]
};
```

## :beer: After build, change html and copy files!

File tree like this:

![](.imgs/2018-07-22-00-27-46.png)

## :beer: All config

```js
module.exports = {
  timeout: 30, // setTimeout replace Html file
  replaceName: "parcel-plugin-change-file", // default html replaceName
  html: ["hello"], // change string to html
  copy: ["src/assets"] // copy files in outDir
  inject: ["<script src=\"assets/image.jpg\">"] // inject a script tag before </head>
};
```

## Temporarily turn off this plugin?

Add `CHANGE_FILE=false`

```bash
$ CHANGE_FILE=false parcel index.html
```
