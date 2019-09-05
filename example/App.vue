<template>
  <div id="app">
    <input v-model='pdfUrl' style='width:100%' />
    <pdf
        v-for="i in numPages"
        :key="i"
        :src="src"
        :num="i"
    />
  </div>
</template>

<script>
import pdf from '@/components/VuePdf.js'

export default {
  name: 'app',
  components: {
    pdf,
  },
  data() {
    return {
      pdfUrl: 'https://prague.test.tyrecheck.com/API/api/Report/1cea522c-be61-41b3-818a-833c3c1ba5a5',
      numPages: 0
    }
  },
  created () {
      const loadingTask = window.pdfjsLib.getDocument(this.pdfUrl)
        this.src = loadingTask.promise
        this.src.then( pdf => {
            this.numPages = pdf.numPages
        })
  }
}
</script>

<style>
body {
  background: lightgray;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: white;
  width: 800px;
  padding: 50px;
  border-radius: 15px;
  margin: auto;
  margin-top: 100px;
}
.editor {
  width: 800px;
  height: 400px;
  border: 2px solid #2c3e50;
}
</style>
