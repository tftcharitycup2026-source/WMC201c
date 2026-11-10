import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { CHAPTERS } from '../data/content'
import { lockScroll, scrollToTarget } from '../lib/scroll'

const NAV_ITEMS = CHAPTERS.slice(0, 6)

export function Navigation() {
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState(0)
  const [solid, setSolid] = useState(false)
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, y / max) : 0)
      setSolid(y > window.innerHeight * 0.8)
      let idx = 0
      CHAPTERS.forEach((c, i) => {
        const el = document.getElementById(c.id)
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) idx = i
      })
      setActive(idx)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    if (!menu) return
    lockScroll(true)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', onKey)
    return () => {
      lockScroll(false)
      window.removeEventListener('keydown', onKey)
    }
  }, [menu])

  const go = (id: string) => {
    setMenu(false)
    // chờ menu đóng & mở khóa cuộn rồi mới cuộn
    requestAnimationFrame(() => scrollToTarget(`#${id}`))
  }

  const current = CHAPTERS[active]
  const light = !solid && !menu

  return (
    <>
      {/* Thanh tiến trình đọc */}
      <div className="fixed inset-x-0 top-0 z-[110] h-[3px] bg-sand/30" aria-hidden>
        <div className="h-full origin-left bg-brick" style={{ transform: `scaleX(${progress})` }} />
      </div>

      <header
        className={`fixed inset-x-0 top-[3px] z-[100] transition-[background-color,box-shadow,color,backdrop-filter] duration-500 ${
          solid && !menu ? 'bg-paper/80 text-coal shadow-[0_1px_0_rgb(73_51_38_/_0.12)] backdrop-blur-md' : 'bg-transparent'
        } ${light ? 'text-paper' : 'text-coal'}`}
      >
        <nav className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-6 px-5 md:h-[72px] md:px-10" aria-label="Điều hướng chương">
          <button onClick={() => go('mo-dau')} className="group flex items-center gap-3 text-left" aria-label="Về phần mở đầu">
            <span className="laterite tone-ong grid size-9 place-items-center rounded-full ring-1 ring-current/20 transition-transform duration-700 group-hover:rotate-180" />
            <span className="leading-none">
              <span className="display block text-lg tracking-wide">Đá Ong</span>
              <span className="eyebrow mt-1 block text-[0.55rem] opacity-70">Mega Story</span>
            </span>
          </button>

          <ul className="hidden items-center gap-1 xl:flex">
            {NAV_ITEMS.map((c, i) => (
              <li key={c.id}>
                <button
                  onClick={() => go(c.id)}
                  className={`group relative overflow-hidden rounded-full px-4 py-2 text-[0.8rem] font-medium transition-colors ${
                    active === i ? 'text-brick' : ''
                  }`}
                  aria-current={active === i ? 'true' : undefined}
                >
                  <span className="relative block h-[1.3em] overflow-hidden">
                    <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">{c.nav}</span>
                    <span className="absolute inset-x-0 top-full block text-brick transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
                      {c.nav}
                    </span>
                  </span>
                  <span
                    className={`absolute bottom-1 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-brick transition-all duration-500 ${active === i ? 'w-4' : 'w-0'}`}
                  />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 text-[0.72rem] sm:flex" aria-live="polite">
              <span className="font-semibold text-brick">{current.num}</span>
              <span className="h-px w-5 bg-current opacity-40" />
              <span className="max-w-[16ch] truncate opacity-80">{current.nav}</span>
              <span className="ml-1 tabular-nums opacity-50">{Math.round(progress * 100)}%</span>
            </div>
            <button
              onClick={() => setMenu((v) => !v)}
              className="group flex items-center gap-2 rounded-full border border-current/30 px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] transition hover:border-brick hover:bg-brick hover:text-paper"
              aria-expanded={menu}
              aria-controls="chapter-menu"
            >
              <span className="hidden sm:inline">{menu ? 'Đóng' : 'Chương'}</span>
              <span className="transition-transform duration-500 group-hover:rotate-90">{menu ? <X size={16} /> : <Menu size={16} />}</span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            id="chapter-menu"
            className="fixed inset-0 z-[95] overflow-y-auto bg-paper text-coal"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="laterite tone-sand pointer-events-none absolute -right-40 top-1/2 hidden size-[38rem] -translate-y-1/2 rounded-full opacity-40 lg:block" />
            <div className="relative mx-auto flex min-h-full max-w-[1400px] flex-col justify-center px-5 pb-16 pt-28 md:px-10">
              <p className="eyebrow mb-8 text-ong">Mục lục · Mega Story</p>
              <ol className="divide-y divide-earth/15 border-y border-earth/15">
                {CHAPTERS.map((c, i) => (
                  <motion.li
                    key={c.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <button
                      onClick={() => go(c.id)}
                      className={`group grid w-full grid-cols-[3.5rem_1fr_auto] items-baseline gap-4 py-4 text-left transition-colors md:grid-cols-[6rem_1fr_auto] md:py-5 ${
                        active === i ? 'text-brick' : 'hover:text-ong'
                      }`}
                      aria-current={active === i ? 'true' : undefined}
                    >
                      <span className="display text-2xl md:text-4xl">{c.num}</span>
                      <span className="display text-3xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 md:text-6xl">
                        {c.title}
                      </span>
                      <span className="eyebrow hidden text-[0.6rem] md:inline">{active === i ? 'Đang đọc' : c.nav}</span>
                    </button>
                  </motion.li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
