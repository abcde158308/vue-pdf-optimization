//import externalScriptLoader from '../services/externalScriptLoader.js'
export default {
  name: 'VuePdf',
  props: {
    src: {
      type: Promise
    },
    num: {
        type: Number,
        default: 1
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    src () {
      this.loadFile()
    }
  },
  methods: {
    cleanup () {
      if (this._pdf) {
        this._pdf.cleanup()
        this._pdf.destroy()
        this._pdf = null
      }
      if (this._page) {
        this._page.cleanup()
        this._page._destroy()
        this._page = null
      }
    },
    async init () {
      try {
        this.$emit('status', 'Initializing PDF viewer...')
        this.$emit('loading', true)
       // await externalScriptLoader.ensureScriptIsLoaded('https://unpkg.com/pdfjs-dist@latest/build/pdf.min.js')
        this.loadFile()
      } catch (e) {
        this.$emit('error', { message: 'Error during initializing PDF viewer', e })
        console.error('Failure during loading PDF.js:', e)
      }
    },
    async loadFile () {
      if (this._loadingPromise) await this._loadingPromise

      const newPromise = this.loadFileInner()
      this._loadingPromise = newPromise
      await newPromise
      if (this._loadingPromise === newPromise) {
        this._loadingPromise = null
      }
    },
    async loadFileInner () {
      if (this._loadingPromise) await this._loadingPromise
      this.cleanup()
      if (!this.src) return
      try {
        this.$emit('loading', true)
        this.$emit('status', 'Downloading document...')
        // const loadingTask = window.pdfjsLib.getDocument(this.src)
        // this._pdf = await loadingTask.promise
        this._pdf = await this.src
        console.log(this._pdf._pdfInfo.numPages)
        this.$emit('status', 'Rendering document...')
        const pageNumber = this.num
        this._page = await this._pdf.getPage(pageNumber)
        const desiredWidth = this.$el.clientWidth
        const viewport = this._page.getViewport(1)

        const scale = desiredWidth / viewport.width
        const scaledViewport = this._page.getViewport(scale)

        const canvas = this.$refs.canvas
        canvas.height = scaledViewport.height
        canvas.width = scaledViewport.width
        const renderTask = this._page.render({
          canvasContext: canvas.getContext('2d'),
          viewport: scaledViewport
        })
        await renderTask.promise
        this.$emit('status', 'Render complete!')
      } catch (e) {
        this.$emit('error', { message: 'Error during displaying PDF file', e })
        console.error('Failure during downloading PDF file:', e)
      }
      this.$emit('loading', false)
    }
  },
  beforeDestroy () {
    this.cleanup()
  },
  render (h) {
    return h('div', { attrs: { style: 'position: relative; overflow:auto;' } }, [
      h('canvas', { style: { display: 'block', width: '100%' }, ref: 'canvas' })
    ])
  }
}
