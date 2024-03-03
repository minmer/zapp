import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
 
// https://vitejs.dev/config/
export default defineConfig({
    base: "https://minmer.github.io/zapp/",
  plugins: [react()],
})
