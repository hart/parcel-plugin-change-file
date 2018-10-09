# :ambulance: parcel-plugin-change-file

## :bulb: How ignore parcel bundler file ?

On Parcel build end, change index.html context, and copy static files in outDir

## :building_construction: Install

```sh
$ yarn add -D parcel-plugin-change-file
```

## :bookmark: Feature 1: Exegesis index.html

- **does not work in build mode w/ minification**
- Add `<!--[ your-code ]-->`

```html
<body>
  <!--[ <script src="lodash.min.js"></script> ]-->
</body>
```

The lodash.min.js jump to parcel bundler, this build end html:

```html
<body>
  <script src="lodash.min.js"></script>
</body>
```

## :lipstick: Feature 2: Replace index.html

- Inject a script tag before `</head>`
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

Create `parcel-plugin-change-file.js` in project-dir

```js
module.exports = {
  html: ["Product Name"]
};
```

parcel build end:

```html
<header>
  <title>Product Name</title>
</header>
```

## :truck: Feature3: Copy files to outDir

Create `parcel-plugin-change-file.js` in project-dir

```js
module.exports = {
  copy: ["src/assets"]
};
```

## :beer: OK, after build, we change static html and files!

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

Add `changeFile=false`

```bash
$ changeFile=false parcel index.html
```
