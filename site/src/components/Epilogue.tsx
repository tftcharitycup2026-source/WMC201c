import { useRef } from 'react'
import { ArrowUp } from 'lucide-react'
import { EPILOGUE, SUBTITLE, TITLE } from '../data/content'
import { MEDIA } from '../data/media'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { scrollToTarget } from '../lib/scroll'
import { ImageSlot } from './ImageSlot'
import { Split } from './Split'
import { groupLines } from './AutoAnimations'

/** PHẦN KẾT — Di sản còn mãi */
export function Epilogue() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root)
        // Ảnh nền phóng lớn nhẹ, chậm
        gsap.fromTo(
          q('.ep-bg .media-inner > *'),
          { scale: 1.28 },
          { scale: 1.02, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: 1.5 } },
        )
        // Tiêu đề và thông điệp lần lượt hiện ra
        const msg = groupLines(q('.ep-msg')[0] as HTMLElement)
        const tl = gsap.timeline({ scrollTrigger: { trigger: q('.ep-content')[0], start: 'top 70%', once: true } })
        tl.from(q('.ep-kicker'), { opacity: 0, y: 20, duration: 1 })
          .from(q('.ep-title .sw-i'), { yPercent: 120, duration: 1.4, stagger: 0.035, ease: 'expo.out' }, 0.2)
        msg.forEach((l, i) => tl.from(l, { yPercent: 115, opacity: 0, duration: 1.2, ease: 'expo.out' }, 0.9 + i * 0.18))
        tl.from(q('.ep-rule'), { scaleY: 0, duration: 1, ease: 'expo.inOut' }, '>-0.4')
          .from(q('.ep-final .sw-i'), { yPercent: 115, duration: 1.1, stagger: 0.05, ease: 'expo.out' }, '>-0.3')
      })
    },
    { scope: root },
  )

  return (
    <section id="loi-ket" ref={root} className="relative isolate overflow-hidden bg-coal text-paper" aria-label="Lời kết">
      <div className="ep-bg absolute inset-0 -z-10">
        <ImageSlot media={MEDIA.epilogue} tone="brick" label="corner" interactive={false} className="size-full" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(41_38_33_/_0.85)_0%,rgb(73_51_38_/_0.45)_45%,rgb(168_79_55_/_0.35)_70%,rgb(41_38_33_/_0.95)_100%)]" />
      </div>

      <div className="ep-content mx-auto flex min-h-[115svh] max-w-5xl flex-col items-center justify-center px-5 py-32 text-center md:px-10">
        <p className="ep-kicker eyebrow text-sand">Lời kết · Di sản còn mãi</p>
        <Split as="h2" by="char" anim="none" text={EPILOGUE.title} className="ep-title display mt-6 text-[clamp(3rem,9vw,8.5rem)]" />
        <p className="ep-msg quote-serif mt-10 max-w-4xl text-[clamp(1.5rem,3vw,2.6rem)] leading-[1.3] text-paper/95">
          <Split text={EPILOGUE.message} anim="none" />
        </p>
        <span className="ep-rule my-12 block h-20 w-px origin-top bg-brick" aria-hidden />
        <Split as="p" text={EPILOGUE.final} anim="none" className="ep-final display text-[clamp(1.6rem,3.4vw,3rem)] italic text-sand" />
      </div>

      <footer className="relative border-t border-paper/15 bg-coal/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 px-5 py-10 md:flex-row md:items-center md:px-10">
          <div>
            <p className="eyebrow text-[0.6rem] text-sand/80">Mega Story · Di sản xứ Đoài</p>
            <p className="display mt-2 text-3xl md:text-4xl">
              {TITLE}: <span className="italic text-sand">{SUBTITLE.toLowerCase()}</span>
            </p>
          </div>
          <button
            onClick={() => scrollToTarget(0)}
            className="group flex shrink-0 items-center gap-4 rounded-full border border-paper/30 py-2 pl-6 pr-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] transition-colors duration-500 hover:border-brick hover:bg-brick"
          >
            Trở về đầu trang
            <span className="grid size-10 place-items-center rounded-full bg-paper text-coal transition-transform duration-500 group-hover:-translate-y-1">
              <ArrowUp size={16} />
            </span>
          </button>
        </div>
      </footer>
    </section>
  )
}
