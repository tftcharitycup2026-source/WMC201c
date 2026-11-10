import { useRef } from 'react'
import { ArrowDown } from 'lucide-react'
import { INTRO, SUBTITLE } from '../data/content'
import { MEDIA } from '../data/media'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { scrollToTarget } from '../lib/scroll'
import { ImageSlot } from './ImageSlot'
import { Split } from './Split'
import { groupLines } from './AutoAnimations'

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root)
        const para = q('.hero-intro')[0] as HTMLElement
        const lines = groupLines(para)

        // 1. Hiệu ứng khi tải trang
        const intro = gsap.timeline({ defaults: { ease: 'expo.out' } })
        intro
          .fromTo(q('.hero-bg'), { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1.08, duration: 3.2, ease: 'power2.out' })
          .from(q('.hero-eyebrow'), { y: 20, opacity: 0, duration: 1 }, 0.5)
          .from(q('.hero-title .sw-i'), { yPercent: 120, rotate: 6, duration: 1.4, stagger: 0.045 }, 0.65)
          .from(q('.hero-rule'), { scaleX: 0, duration: 1.4, ease: 'expo.inOut' }, 1.2)
          .from(q('.hero-sub .sw-i'), { yPercent: 120, duration: 1.1, stagger: 0.04 }, 1.35)
          .from(q('.hero-cta'), { y: 30, opacity: 0, duration: 1 }, 1.7)
          .from(q('.hero-side'), { opacity: 0, duration: 1.5 }, 1.8)

        // 2. Cuộn: parallax ảnh nền, tiêu đề lùi lên, đoạn mở đầu hiện dần theo từng dòng
        gsap.set(lines, { yPercent: 110, opacity: 0 })
        const st = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: 'top top', end: '+=130%', scrub: 0.8, pin: true, anticipatePin: 1 },
        })
        st.to(q('.hero-bg-wrap'), { yPercent: 12, ease: 'none', duration: 1 }, 0)
          .to(q('.hero-overlay'), { opacity: 0.85, ease: 'none', duration: 1 }, 0)
          .fromTo(q('.hero-head'), { y: () => para.offsetHeight * 0.55 }, { y: 0, scale: 0.86, transformOrigin: '50% 0%', ease: 'power1.inOut', duration: 0.5 }, 0)
          .to(q('.hero-hint'), { opacity: 0, duration: 0.15 }, 0)
        lines.forEach((l, i) => st.to(l, { yPercent: 0, opacity: 1, duration: 0.22, ease: 'power2.out' }, 0.18 + i * 0.07))
      })
    },
    { scope: root },
  )

  return (
    <section id="mo-dau" ref={root} className="relative h-svh min-h-[640px] overflow-hidden bg-coal text-paper" aria-label="Mở đầu">
      <div className="hero-bg-wrap absolute inset-[-8%_0_-8%_0]">
        <ImageSlot media={MEDIA.hero} className="hero-bg size-full" tone="ong" label="corner" interactive={false} priority />
      </div>
      <div className="hero-overlay pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgb(41_38_33_/_0.35),rgb(41_38_33_/_0.8))] opacity-70" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-coal/80 to-transparent" />

      {/* Chữ dọc trang trí */}
      <div className="hero-side pointer-events-none absolute left-6 top-1/2 hidden -translate-y-1/2 -rotate-90 origin-left lg:block">
        <span className="eyebrow whitespace-nowrap text-[0.6rem] text-sand/70">Hồn đá xứ Đoài · Triển lãm số</span>
      </div>
      <div className="hero-side pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex">
        {['00', '01', '02', '03', '04', '05'].map((n, i) => (
          <span key={n} className={`text-[0.6rem] tabular-nums ${i === 0 ? 'text-brick' : 'text-paper/40'}`}>
            {n}
          </span>
        ))}
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-5 pt-16 text-center md:px-10">
        <div className="hero-head flex flex-col items-center">
          <p className="hero-eyebrow eyebrow mb-6 flex items-center gap-3 text-sand md:mb-8">
            <span>Mega Story</span>
            <span className="h-3 w-px bg-sand/60" />
            <span>Di sản xứ Đoài</span>
          </p>
          <h1 className="hero-title display text-[clamp(3.4rem,13vw,11.5rem)] uppercase" aria-label="Đá ong Thạch Thất">
            <Split text="Đá ong" by="char" anim="none" className="block" />
            <Split text="Thạch Thất" by="char" anim="none" className="block text-sand" />
          </h1>
          <span className="hero-rule my-6 block h-px w-24 origin-center bg-brick md:my-8 md:w-40" />
          <Split text={SUBTITLE} as="p" anim="none" className="hero-sub quote-serif text-[clamp(1.35rem,2.6vw,2.2rem)] text-paper/95" />
        </div>

        <p className="hero-intro mt-6 max-w-2xl text-justify text-[0.95rem] leading-[1.8] text-paper/90 md:mt-8 md:text-[1.06rem]" data-split="lines" data-manual>
          <Split text={INTRO} anim="none" />
        </p>

        <button
          onClick={() => scrollToTarget('#lich-su')}
          className="hero-cta group mt-8 flex items-center gap-4 rounded-full border border-paper/40 py-2 pl-7 pr-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] backdrop-blur-sm transition-colors duration-500 hover:border-brick hover:bg-brick md:mt-10"
        >
          Khám phá câu chuyện
          <span className="grid size-10 place-items-center rounded-full bg-paper text-coal transition-transform duration-500 group-hover:translate-y-1 group-hover:rotate-[-8deg]">
            <ArrowDown size={16} />
          </span>
        </button>
      </div>

      <div className="hero-hint pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-sand/70">
        <span className="eyebrow text-[0.55rem]">Cuộn xuống</span>
        <span className="relative h-10 w-px overflow-hidden bg-sand/25">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollhint_2.2s_ease-in-out_infinite] bg-sand" />
        </span>
      </div>
    </section>
  )
}
