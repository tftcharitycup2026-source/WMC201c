import { useEffect } from 'react'
import { initSmoothScroll } from './lib/scroll'
import { LightboxProvider } from './components/Lightbox'
import { Navigation } from './components/Navigation'
import { Cursor } from './components/Cursor'
import { Hero } from './components/Hero'
import { Chapter1 } from './components/Chapter1'
import { Chapter2 } from './components/Chapter2'
import { Chapter3 } from './components/Chapter3'
import { Chapter4 } from './components/Chapter4'
import { Chapter5 } from './components/Chapter5'
import { Epilogue } from './components/Epilogue'
import { AutoAnimations } from './components/AutoAnimations'
import { MediaEditor } from './components/MediaEditor'
import { EDIT_MODE, useMediaVersion } from './lib/mediaStore'

export default function App() {
  useMediaVersion() // vẽ lại khi ảnh / chú thích thay đổi
  useEffect(() => initSmoothScroll(), [])

  return (
    <LightboxProvider>
      <Navigation />
      <main>
        <Hero />
        <Chapter1 />
        <Chapter2 />
        <Chapter3 />
        <Chapter4 />
        <Chapter5 />
        <Epilogue />
      </main>
      {/* Phải render sau cùng: các hiệu ứng chung được tạo sau các vùng ghim (pin) */}
      <AutoAnimations />
      <Cursor />
      {EDIT_MODE && <MediaEditor />}
      <div className="grain" aria-hidden />
    </LightboxProvider>
  )
}
