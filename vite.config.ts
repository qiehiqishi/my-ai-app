import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import { resolve } from 'path'

export default defineConfig({
  root: 'frontend',
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'frontend/src')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
