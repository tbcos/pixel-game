import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 指定專案名稱，確保在 GitHub Pages 載入 assets 必定對應子目錄
  base: '/pixel-game/', 
})
