import { useRef } from 'react'
import { Maximize2 } from 'lucide-react'
import { PART3, PART3_TITLE } from '../data/content'
import { MEDIA } from '../data/media'
import { gsap, useGSAP, MOTION_OK, DESKTOP } from '../lib/gsap'
import { useLightbox } from './Lightbox'
import { Caption, ImageSlot } from './ImageSlot'
import { Split } from './Split'

const TRAD = [MEDIA.ch3House, MEDIA.ch3Dinh, MEDIA.ch3Foundation]
const STRIP = [MEDIA.ch3Gate, MEDIA.ch3Fence, MEDIA.ch3House, MEDIA.ch3Dinh, MEDIA.ch3Foundation]
const GALLERY = [MEDIA.g1, MEDIA.g2, MEDIA.g3, MEDIA.g4, MEDIA.g5, MEDIA.g6]

/** CHƯƠNG 03 — Dấu ấn kiến trúc xứ Đoài */
export function Chapter3() {
  const root = useRef<HTMLElement>(null)
  const { open } = useLightbox()

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        // Mở đầu: lớp phủ dạng các tấm đá mở dần + chữ tiêu đề
        const tl = gsap.timeline({
          scrollTrigger: { trigger: q('.c3-opener')[0], start: 'top top', end: '+=120%', scrub: 1, pin: true, anticipatePin: 1 },
        })
        tl.to(q('.c3-slab'), { yPercent: -101, stagger: { each: 0.08, from: 'center' }, ease: 'power2.inOut', duration: 0.6 }, 0)
          .fromTo(q('.c3-opener .media-inner > *'), { scale: 1.3 }, { scale: 1, ease: 'none', duration: 1 }, 0)
          .from(q('.c3-big .sw-i'), { yPercent: 120, stagger: 0.012, duration: 0.3, ease: 'power3.out' }, 0.35)
          .from(q('.c3-sub'), { opacity: 0, y: 20, duration: 0.25 }, 0.6)
      })

      mm.add(DESKTOP, () => {
        // Dải ảnh chuyển động ngang theo cuộn dọc
        gsap.fromTo(
          q('.c3-strip'),
          { xPercent: 4 },
          { xPercent: -38, ease: 'none', scrollTrigger: { trigger: q('.c3-strip-wrap')[0], start: 'top bottom', end: 'bottom top', scrub: 0.6 } },
        )

        // Chùa Tây Phương: ảnh mở rộng thành toàn màn hình, nội dung trượt vào bên cạnh
        const tp = gsap.timeline({
          scrollTrigger: { trigger: q('.c3-tp')[0], start: 'top top', end: '+=150%', scrub: 1, pin: true, anticipatePin: 1 },
        })
        tp.fromTo(q('.c3-tp-img'), { clipPath: 'inset(14% 8% 14% 52% round 6px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut', duration: 1 })
          .fromTo(q('.c3-tp-img .media-inner > *'), { scale: 1.25 }, { scale: 1, ease: 'none', duration: 1.6 }, 0)
          .to(q('.c3-tp-intro'), { opacity: 0, x: -60, duration: 0.4 }, 0.1)
          .fromTo(q('.c3-tp-card'), { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }, 0.8)
          .to({}, { duration: 0.3 })
      })
    },
    { scope: root },
  )

  return (
    <section id="kien-truc" ref={root} className="relative bg-paper" aria-label={PART3_TITLE}>
      {/* --- Mở đầu toàn màn hình --- */}
      <div className="c3-opener relative h-svh min-h-[560px] overflow-hidden bg-coal text-paper">
        <ImageSlot media={MEDIA.ch3Opener} tone="coal" label="corner" interactive={false} className="absolute inset-0" />
        <div className="absolute inset-0 bg-coal/45" />
        <div className="pointer-events-none absolute inset-0 flex motion-reduce:hidden" aria-hidden>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="c3-slab laterite tone-earth h-full flex-1 border-r border-coal/40" />
          ))}
        </div>
        <div className="relative z-10 mx-auto flex h-full max-w-[1500px] flex-col justify-center px-5 md:px-10">
          <p className="c3-sub eyebrow mb-6 text-sand">Chương 03 · Dấu ấn kiến trúc xứ Đoài</p>
          <Split as="p" by="char" anim="none" text="Những dấu ấn được tạo nên từ đá" className="c3-big display max-w-6xl text-[clamp(3rem,9vw,9.5rem)] uppercase leading-[0.92]" />
        </div>
      </div>

      {/* --- Không gian kiến trúc truyền thống --- */}
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-ong" data-reveal="fade">Chương 03</p>
            <Split as="h2" text={PART3_TITLE} className="display mt-4 text-[clamp(2.4rem,5vw,4.8rem)]" accent={(w) => (w === 'kiến' || w === 'trúc' ? 'text-brick italic' : undefined)} />
            <h3 className="eyebrow mt-12 text-earth" data-reveal="left">Không gian kiến trúc truyền thống</h3>
            <div className="story mt-6" data-reveal="up">
              <p className="dropcap">{PART3[0]}</p>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4 lg:col-span-7 lg:gap-5">
            <figure className="col-span-6">
              <ImageSlot media={MEDIA.ch3House} group={TRAD} tone="ong" hoverCaption className="aspect-[16/10] w-full" dataAnim={{ 'data-mask': 'right' }} />
            </figure>
            <figure className="col-span-3 lg:col-span-2">
              <ImageSlot media={MEDIA.ch3Dinh} group={TRAD} tone="brick" hoverCaption className="aspect-[3/4] w-full" dataAnim={{ 'data-mask': 'up', 'data-delay': '0.1' }} />
            </figure>
            <figure className="col-span-3 lg:col-span-4">
              <ImageSlot media={MEDIA.ch3Foundation} group={TRAD} tone="earth" hoverCaption className="aspect-[3/4] w-full lg:aspect-[16/12]" dataAnim={{ 'data-mask': 'up', 'data-delay': '0.25' }} />
            </figure>
            <p className="col-span-6 -mt-1 text-xs text-earth/60">{TRAD.map((t) => t.caption).join(' · ')}</p>
          </div>
        </div>
      </div>

      {/* --- Dấu ấn chùa Tây Phương --- */}
      <div className="c3-tp relative overflow-hidden bg-coal text-paper lg:h-svh">
        <div className="c3-tp-intro motion-reduce:lg:hidden relative z-10 mx-auto max-w-[1500px] px-5 pt-20 md:px-10 lg:absolute lg:inset-y-0 lg:left-0 lg:flex lg:w-[48%] lg:flex-col lg:justify-center lg:pt-0">
          <p className="eyebrow text-sand">Điểm nhấn kiến trúc</p>
          <h3 className="display mt-4 text-[clamp(3rem,7vw,7rem)]">
            Chùa <em className="text-brick">Tây Phương</em>
          </h3>
          <p className="mt-6 hidden max-w-sm text-sm text-sand/80 lg:block">Cuộn để mở rộng không gian ảnh.</p>
        </div>
        <ImageSlot media={MEDIA.taiPhuong} tone="ong" label="center" className="c3-tp-img mt-10 aspect-[4/3] w-full lg:absolute lg:inset-0 lg:mt-0 lg:aspect-auto" />
        <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-coal/80 via-coal/30 to-transparent lg:block" />
        <div className="c3-tp-card relative z-10 px-5 py-14 md:px-10 lg:absolute lg:bottom-[10%] lg:left-[6%] lg:max-w-lg lg:rounded-sm lg:bg-coal/75 lg:p-10 lg:backdrop-blur-md">
          <p className="eyebrow mb-4 text-sand">Dấu ấn chùa Tây Phương</p>
          <div className="story text-paper/90">
            <p>{PART3[1]}</p>
          </div>
          <Caption light>{MEDIA.taiPhuong.caption}</Caption>
        </div>
      </div>

      {/* --- Nhà ở truyền thống: dải ảnh chuyển động ngang --- */}
      <div className="py-24 md:py-36">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 md:px-10 lg:grid-cols-12">
          <h3 className="display text-[clamp(2rem,4vw,3.6rem)] leading-[1.05] lg:col-span-5" data-split="words">
            Diện mạo đặc trưng của nhiều khu dân cư
          </h3>
          <div className="story lg:col-span-6 lg:col-start-7" data-reveal="right">
            <p>{PART3[2]}</p>
          </div>
        </div>
        <div className="c3-strip-wrap mt-16 overflow-hidden">
          <div className="c3-strip no-scrollbar flex w-max gap-4 px-5 max-lg:w-full max-lg:snap-x max-lg:snap-mandatory max-lg:overflow-x-auto md:gap-6 md:px-10">
            {STRIP.map((m, i) => (
              <figure key={m.id} className={`shrink-0 snap-start ${i % 2 ? 'w-[62vw] md:w-[30vw] lg:mt-16' : 'w-[78vw] md:w-[42vw]'}`}>
                <ImageSlot media={m} group={STRIP} tone={(['ong', 'earth', 'brick', 'sand', 'coal'] as const)[i]} className={`${i % 2 ? 'aspect-[3/4]' : 'aspect-[4/3]'} w-full`} />
                <Caption>{m.caption}</Caption>
              </figure>
            ))}
          </div>
        </div>
      </div>

      {/* --- Đá ong trong không gian hiện đại: thư viện ảnh --- */}
      <div className="bg-sand/40 py-24 md:py-36">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow text-ong" data-reveal="fade">Thư viện ảnh</p>
              <h3 className="display mt-4 text-[clamp(2.4rem,5vw,4.6rem)]" data-split="words">
                Đá ong trong không gian hiện đại
              </h3>
            </div>
            <div className="story lg:col-span-6 lg:col-start-7 lg:pt-10" data-reveal="up">
              <p>{PART3[3]}</p>
            </div>
          </div>

          <div className="mt-14 grid auto-rows-[44vw] grid-cols-2 gap-3 md:mt-20 md:auto-rows-[15vw] md:grid-cols-6 md:gap-5 xl:auto-rows-[200px]">
            {GALLERY.map((g, i) => {
              const layout = [
                'col-span-2 md:col-span-6 md:row-span-2', // ngang toàn chiều rộng
                'col-span-1 row-span-2 md:col-span-2 md:row-span-3', // dọc lớn
                'col-span-1 md:col-span-2 md:row-span-2', // vuông
                'col-span-1 md:col-span-2 md:row-span-2', // vuông
                'col-span-1 md:col-span-2 md:row-span-1', // ngang
                'col-span-1 md:col-span-2 md:row-span-1', // cận cảnh
              ][i]
              const tones = ['ong', 'earth', 'sand', 'brick', 'coal', 'ong'] as const
              return (
                <figure key={g.id} className={`relative ${layout}`} data-reveal={i % 2 ? 'up' : 'scale'} data-delay={String((i % 3) * 0.1)}>
                  <ImageSlot media={g} group={GALLERY} tone={tones[i]} hoverCaption className="size-full" />
                </figure>
              )
            })}
          </div>
          <button
            onClick={() => open(GALLERY, 0)}
            className="group mx-auto mt-10 flex items-center gap-3 rounded-full border border-earth/30 px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-earth transition hover:border-brick hover:bg-brick hover:text-paper"
          >
            <Maximize2 size={15} className="transition-transform duration-500 group-hover:scale-125" />
            Xem toàn bộ thư viện
          </button>
        </div>
      </div>
    </section>
  )
}
