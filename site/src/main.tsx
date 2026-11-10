import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { EDIT_MODE, initMedia, setEditMode } from './lib/mediaStore'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

// Bật/tắt chế độ chỉnh sửa ảnh: thêm ?edit vào địa chỉ, hoặc nhấn Ctrl + Shift + E
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e') {
    e.preventDefault()
    setEditMode(!EDIT_MODE)
  }
})

initMedia().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
