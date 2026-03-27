import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 將 basePath 設為相對路徑 './'，讓編譯後的檔案可以在任何 GitHub Repo 子目錄下正常載入 JS/CSS
  base: './', 
})
