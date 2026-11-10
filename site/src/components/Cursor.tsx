import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { EDIT_MODE } from '../lib/mediaStore'

type Mode = 'default' | 'hover' | 'image' | 'hidden'

/** Con trỏ tròn tùy chỉnh – chỉ bật trên máy tính có chuột. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [mode, setMode] = useState<Mode>('default')
  const [label, setLabel] = useState('XEM ẢNH')

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)')
    const update = () => setEnabled(mq.matches && !EDIT_MODE) // chế độ chỉnh sửa dùng con trỏ thường
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return
    document.documentElement.classList.add('has-cursor')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power3' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power3' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: reduce ? 0.01 : 0.45, ease: 'power3' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: reduce ? 0.01 : 0.45, ease: 'power3' })
    gsap.set(dot.current, { xPercent: -50, yPercent: -50 })
    gsap.set([dot.current, ring.current], { opacity: 0 })

    let shown = false
    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true
        gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 })
      }
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }
    const over = (e: Event) => {
      const t = e.target as HTMLElement
      if (t.closest('iframe')) return setMode('hidden')
      const el = t.closest<HTMLElement>('[data-cursor], a, button, [role="button"], input, label')
      if (!el) return setMode('default')
      const c = el.dataset.cursor
      if (c === 'image') {
        setLabel(el.dataset.cursorLabel ?? 'XEM ẢNH')
        setMode('image')
      } else if (c === 'none') setMode('default')
      else setMode('hover')
    }
    const leave = () => {
      shown = false
      gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.3 })
    }
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over)
    document.documentElement.addEventListener('pointerleave', leave)
    window.addEventListener('blur', leave)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
      window.removeEventListener('blur', leave)
    }
  }, [enabled])

  if (!enabled) return null
  const size = mode === 'image' ? 104 : mode === 'hover' ? 64 : mode === 'hidden' ? 0 : 36
  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] size-0"
      >
        <div
          className={`absolute left-0 top-0 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mode === 'image'
              ? 'border-transparent bg-brick text-paper'
              : mode === 'hover'
                ? 'border-brick bg-brick/15'
                : 'border-ong'
          }`}
          style={{ width: size, height: size }}
        >
          <span
            className={`eyebrow whitespace-nowrap text-[0.62rem] tracking-[0.2em] transition-opacity duration-300 ${mode === 'image' ? 'opacity-100' : 'opacity-0'}`}
          >
            {label}
          </span>
        </div>
      </div>
      <div
        ref={dot}
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-[201] size-1.5 rounded-full bg-brick transition-transform duration-300 ${mode === 'image' || mode === 'hidden' ? 'scale-0' : 'scale-100'}`}
      />
    </>
  )
}
