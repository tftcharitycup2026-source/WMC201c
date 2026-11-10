import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { Media } from '../data/media'
import { lockScroll } from '../lib/scroll'
import { Placeholder } from './ImageSlot'

type Ctx = { open: (items: Media[], index: number) => void }
const LightboxContext = createContext<Ctx>({ open: () => {} })
export const useLightbox = () => useContext(LightboxContext)

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ items: Media[]; index: number } | null>(null)
  const [dir, setDir] = useState(0)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)
  const touchX = useRef<number | null>(null)

  const open = useCallback((items: Media[], index: number) => {
    lastFocus.current = document.activeElement as HTMLElement
    setDir(0)
    setState({ items, index })
  }, [])
  const close = useCallback(() => setState(null), [])
  const go = useCallback((d: number) => {
    setDir(d)
    setState((s) => (s ? { ...s, index: (s.index + d + s.items.length) % s.items.length } : s))
  }, [])

  const isOpen = state !== null
  useEffect(() => {
    if (!isOpen) {
      lastFocus.current?.focus?.()
      return
    }
    lockScroll(true)
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lockScroll(false)
    }
  }, [isOpen, close, go])

  const item = state ? state.items[state.index] : null
  const many = (state?.items.length ?? 0) > 1

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {state && item && (
          <motion.div
            key="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Xem ảnh toàn màn hình"
            className="fixed inset-0 z-[120] flex flex-col bg-coal/95 text-paper backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={close}
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null || !many) return
              const dx = e.changedTouches[0].clientX - touchX.current
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
              touchX.current = null
            }}
          >
            <div className="flex items-center justify-between px-5 py-4 md:px-10 md:py-6">
              <span className="eyebrow text-sand">
                {String(state.index + 1).padStart(2, '0')} / {String(state.items.length).padStart(2, '0')}
              </span>
              <button
                ref={closeBtn}
                onClick={close}
                data-cursor="hover"
                className="grid size-12 place-items-center rounded-full border border-paper/30 transition hover:rotate-90 hover:border-brick hover:bg-brick"
                aria-label="Đóng"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 md:px-24">
              <AnimatePresence mode="popLayout" custom={dir} initial={false}>
                <motion.figure
                  key={item.id}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 80, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: dir * -80, scale: 0.96 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="flex max-h-full w-full max-w-6xl flex-col items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.src ? (
                    <img src={item.src} alt={item.alt} className="max-h-[72vh] w-auto max-w-full object-contain" decoding="async" />
                  ) : (
                    <div className="relative aspect-[3/2] max-h-[70vh] w-full overflow-hidden">
                      <Placeholder media={item} tone="ong" label="center" />
                    </div>
                  )}
                  <figcaption className="mt-5 max-w-2xl text-center">
                    <p className="quote-serif text-2xl text-paper md:text-3xl">{item.caption}</p>
                    {item.credit && <p className="mt-1 text-xs text-sand/70">{item.credit}</p>}
                  </figcaption>
                </motion.figure>
              </AnimatePresence>

              {many && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      go(-1)
                    }}
                    data-cursor="hover"
                    aria-label="Ảnh trước"
                    className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-paper/30 bg-coal/40 transition hover:-translate-x-1 hover:border-brick hover:bg-brick md:left-8 md:size-14"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      go(1)
                    }}
                    data-cursor="hover"
                    aria-label="Ảnh tiếp theo"
                    className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-paper/30 bg-coal/40 transition hover:translate-x-1 hover:border-brick hover:bg-brick md:right-8 md:size-14"
                  >
                    <ChevronRight />
                  </button>
                </>
              )}
            </div>

            {many && (
              <div className="no-scrollbar flex justify-center gap-2 overflow-x-auto px-5 py-5" onClick={(e) => e.stopPropagation()}>
                {state.items.map((it, i) => (
                  <button
                    key={it.id}
                    onClick={() => {
                      setDir(i > state.index ? 1 : -1)
                      setState({ ...state, index: i })
                    }}
                    aria-label={`Xem ảnh ${i + 1}: ${it.caption}`}
                    data-cursor="hover"
                    className={`h-1.5 shrink-0 rounded-full transition-all duration-500 ${i === state.index ? 'w-10 bg-brick' : 'w-4 bg-paper/30 hover:bg-paper/60'}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxContext.Provider>
  )
}
