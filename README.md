# vue-pdf-optimization

[PDF.js](https://mozilla.github.io/pdf.js/) is very advanced JS library for parsing and displaying PDF files by Mozilla. This project aims to provide simple and lightweight Vue.js component, that downloads library files lazily from cdn with minimal setup.

Similar projects:

* [vue-pdf](https://www.npmjs.com/package/vue-pdf/) - includes PDF.js files into your bundle with webpack. Sometimes this may be undesirable because:
    * it may require additional webpack [configuration](https://github.com/FranckFreiburger/vue-pdf/issues/13)
    * webpack processing can lead to [issues](https://github.com/FranckFreiburger/vue-pdf/issues/140)
    * latest webpack has a [bug](https://github.com/FranckFreiburger/vue-pdf/issues/97) in development mode with worker files
    * it will increase bundle size (pdf.js viewer + worker = about 800 kb) and build time.

## Install

```bash
yarn add vue-pdf-optimization
# or
npm install vue-pdf-optimization --save
```

## Usage

在根页面引入cdn
```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <title>vue-pdf-cdn</title>
  </head>
  <body>
    <noscript>
      <strong>We're sorry but vue-pdf-cdn doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
    <script  src="https://unpkg.com/pdfjs-dist@latest/build/pdf.min.js"></script>
    <!-- built files will be auto injected -->
  </body>
</html>
```
```vue
<template>
    <pdf
        v-for="i in numPages"
        :key="i"
        :src="src"
        :num="i"
    />
</template>

<script>
import pdf from 'vue-pdf-optimization'

export default {
  components: {
    pdf
  },
  created() {
        const loadingTask = window.pdfjsLib.getDocument('pdf地址')
        this.src = loadingTask.promise
        this.src.then( pdf => {
            this.numPages = pdf.numPages
        })
  }
}
</script>
```

### Props

- `src` - URL of PDF file to load and display

### Events

- `@status` - triggered when status update happens (library initialized, pdf downloaded, etc.). Provides string describing status.
- `@error` - triggered when error happens. Provides error message.
- `@loading` - triggered when loading status changes. Provides boolean (true/false).

