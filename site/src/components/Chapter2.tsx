import { useRef } from 'react'
import { PART2, PART2_TITLE } from '../data/content'
import { MEDIA } from '../data/media'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { Caption, ImageSlot } from './ImageSlot'
import { Split } from './Split'

const LIFE = [MEDIA.ch2Village, MEDIA.ch2Life1, MEDIA.ch2Life2]
const ECO = [MEDIA.ch2Eco1, MEDIA.ch2Eco2]
const CULTURE = [MEDIA.ch2Culture1, MEDIA.ch2Culture2, MEDIA.ch2Culture3]

function ZoneLabel({ index, title, light }: { index: string; title: string; light?: boolean }) {
  return (
    <div className="flex items-center gap-4" data-reveal="left">
      <span className={`display text-2xl italic ${light ? 'text-sand' : 'text-brick'}`}>{index}</span>
      <span className={`h-px w-14 ${light ? 'bg-sand/50' : 'bg-brick/50'}`} />
      <span className={`eyebrow ${light ? 'text-sand' : 'text-ong'}`}>{title}</span>
    </div>
  )
}

/** CHƯƠNG 02 — Những giá trị được lưu giữ qua nhiều thế hệ */
export function Chapter2() {
  const opener = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(opener)
        const tl = gsap.timeline({
          scrollTrigger: { trigger: opener.current, start: 'top top', end: '+=140%', scrub: 1, pin: true, anticipatePin: 1 },
        })
        tl.fromTo(
          q('.c2-frame'),
          { clipPath: () => (window.innerWidth < 768 ? 'inset(22% 8% 30% 8% round 200px 200px 0 0)' : 'inset(16% 30% 16% 30% round 400px 400px 0 0)') },
          { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0 0)', ease: 'power2.inOut', duration: 1 },
        )
          .fromTo(q('.c2-frame .media-inner > *'), { scale: 1.45 }, { scale: 1, ease: 'power1.out', duration: 1 }, 0)
          .to(q('.c2-pre'), { opacity: 0, y: -60, duration: 0.35 }, 0)
          .fromTo(q('.c2-veil'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.55)
          .from(q('.c2-title .sw-i'), { yPercent: 115, stagger: 0.03, duration: 0.4, ease: 'power3.out' }, 0.6)
          .from(q('.c2-kicker'), { opacity: 0, y: 20, duration: 0.3 }, 0.7)
      })
    },
    { scope: opener },
  )

  return (
    <section id="gia-tri" className="relative bg-paper" aria-label={PART2_TITLE}>
      {/* --- Mở đầu: ảnh toàn cảnh làng quê phóng lớn dần --- */}
      <div ref={opener} className="relative h-svh min-h-[560px] overflow-hidden">
        <div className="c2-pre motion-reduce:hidden absolute inset-x-0 top-[9%] z-10 text-center md:top-[7%]">
          <p className="eyebrow text-ong">Chương 02</p>
          <p className="quote-serif mt-2 text-2xl text-earth md:text-3xl">Những giá trị được lưu giữ qua nhiều thế hệ</p>
        </div>
        <ImageSlot media={MEDIA.ch2Village} group={LIFE} tone="ong" label="corner" className="c2-frame absolute inset-0" />
        <div className="c2-veil pointer-events-none absolute inset-0 bg-gradient-to-t from-coal/85 via-coal/30 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 mx-auto max-w-[1400px] px-5 pb-16 text-paper md:px-10 md:pb-20">
          <p className="c2-kicker eyebrow mb-4 text-sand">Chương 02 · Giá trị</p>
          <Split as="h2" text={PART2_TITLE} anim="none" className="c2-title display max-w-5xl text-[clamp(2.6rem,6.6vw,6.4rem)]" />
        </div>
      </div>

      {/* --- I. Giá trị đời sống --- */}
      <div className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <ZoneLabel index="i." title="Giá trị đời sống" />
        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <p className="display text-[clamp(2rem,4vw,3.6rem)] leading-[1.05] text-earth" data-split="words">
              Biểu tượng thân thương của không gian làng quê xứ Đoài
            </p>
            <div className="story mt-10 max-w-xl" data-reveal="up">
              <p className="dropcap">{PART2.p1}</p>
            </div>
          </div>
          <div className="relative grid grid-cols-5 gap-4 lg:col-span-6">
            <figure className="col-span-3">
              <ImageSlot media={MEDIA.ch2Life1} group={LIFE} tone="earth" className="aspect-[3/5] w-full" dataAnim={{ 'data-mask': 'up' }} />
              <Caption>{MEDIA.ch2Life1.caption}</Caption>
            </figure>
            <figure className="col-span-2 mt-[45%]" data-parallax="0.5">
              <ImageSlot media={MEDIA.ch2Life2} group={LIFE} tone="sand" className="aspect-[3/4] w-full" dataAnim={{ 'data-mask': 'down', 'data-delay': '0.2' }} />
              <Caption>{MEDIA.ch2Life2.caption}</Caption>
            </figure>
          </div>
        </div>
      </div>

      {/* --- II. Giá trị kinh tế --- */}
      <div className="relative bg-sand/45 py-24 md:py-36">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <ZoneLabel index="ii." title="Giá trị kinh tế" />
          <div className="mt-10 grid gap-10 lg:grid-cols-12">
            <figure className="relative lg:col-span-8">
              <ImageSlot media={MEDIA.ch2Eco1} group={ECO} tone="brick" className="aspect-[16/10] w-full" dataAnim={{ 'data-zoom': '1.35' }} />
              <Caption>{MEDIA.ch2Eco1.caption}</Caption>
            </figure>
            <div className="flex flex-col justify-end lg:col-span-4">
              <figure className="mb-10 hidden w-3/4 lg:block" data-reveal="right">
                <ImageSlot media={MEDIA.ch2Eco2} group={ECO} tone="earth" className="aspect-square w-full" />
                <Caption>{MEDIA.ch2Eco2.caption}</Caption>
              </figure>
              <div className="story" data-reveal="up">
                <p>{PART2.p2}</p>
              </div>
            </div>
            <figure className="lg:hidden">
              <ImageSlot media={MEDIA.ch2Eco2} group={ECO} tone="earth" className="aspect-[4/3] w-full" />
              <Caption>{MEDIA.ch2Eco2.caption}</Caption>
            </figure>
          </div>
          <p className="story mx-auto mt-20 max-w-3xl text-center !text-center" data-reveal="fade">
            {PART2.quoteLead}
          </p>
        </div>
      </div>

      {/* --- Điểm nhấn: Lời kể người thợ --- */}
      <figure className="relative isolate overflow-hidden bg-ong py-28 text-paper md:py-44">
        <div className="absolute inset-0 -z-10 opacity-35 mix-blend-multiply">
          <ImageSlot media={MEDIA.ch2Hands} tone="earth" label="none" interactive={false} className="size-full" dataAnim={{ 'data-zoom': '1.3' }} />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ong/30 via-ong/70 to-ong/30" />
        <div className="mx-auto max-w-5xl px-5 md:px-10">
          <p className="eyebrow mb-10 text-center text-sand">Lời kể người thợ</p>
          <span className="display mx-auto block h-16 text-center text-[9rem] leading-none text-brick md:text-[12rem]" aria-hidden>
            “
          </span>
          <blockquote>
            <p className="quote-serif text-center text-[clamp(1.55rem,3.1vw,2.9rem)] leading-[1.32]" data-split="lines">
              {PART2.quote.split(' ').map((w, i) => (
                <span key={i} className="sw">
                  <span className="sw-i">{w}&nbsp;</span>
                </span>
              ))}
            </p>
          </blockquote>
          <figcaption className="mt-12 flex flex-col items-center gap-3 text-center" data-reveal="up">
            <span className="h-px w-16 bg-sand/60" />
            <span className="text-sm tracking-wide text-sand">{PART2.quoteCaption}</span>
            {!MEDIA.ch2Hands.src && <span className="text-[0.65rem] text-paper/50">Nền: khung ảnh tư liệu – {MEDIA.ch2Hands.brief.toLowerCase()}</span>}
          </figcaption>
        </div>
      </figure>

      {/* --- III. Giá trị văn hóa --- */}
      <div className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <ZoneLabel index="iii." title="Giá trị văn hóa" />
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-12 md:gap-6">
          <figure className="col-span-2 md:col-span-5 md:row-span-2">
            <ImageSlot media={MEDIA.ch2Culture1} group={CULTURE} tone="ong" hoverCaption className="aspect-[4/5] w-full" dataAnim={{ 'data-mask': 'left' }} />
          </figure>
          <figure className="md:col-span-4 md:mt-24">
            <ImageSlot media={MEDIA.ch2Culture2} group={CULTURE} tone="earth" hoverCaption className="aspect-square w-full" dataAnim={{ 'data-mask': 'up', 'data-delay': '0.15' }} />
          </figure>
          <figure className="md:col-span-3">
            <ImageSlot media={MEDIA.ch2Culture3} group={CULTURE} tone="brick" hoverCaption className="aspect-[3/4] w-full" dataAnim={{ 'data-mask': 'right', 'data-delay': '0.3' }} />
          </figure>
          <div className="story col-span-2 md:col-span-7 md:col-start-6 md:pt-6" data-reveal="up">
            <p>{PART2.p4}</p>
          </div>
        </div>
        <p className="mt-6 text-xs text-earth/60">Ảnh: {CULTURE.map((c) => c.caption).join(' · ')}</p>
      </div>
    </section>
  )
}
