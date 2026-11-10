import { useRef, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { PART5, PART5_TITLE } from '../data/content'
import { MEDIA, type Media } from '../data/media'
import { gsap, useGSAP, MOTION_OK, DESKTOP } from '../lib/gsap'
import { Caption, ImageSlot } from './ImageSlot'
import { Split } from './Split'

const DIRECTIONS: { num: string; title: string; desc: string; media: Media; tone: 'ong' | 'brick' | 'earth' }[] = [
  { num: '01', title: 'Bảo tồn', desc: 'Gìn giữ công trình kiến trúc và các giá trị văn hóa truyền thống.', media: MEDIA.dir1, tone: 'earth' },
  { num: '02', title: 'Đổi mới', desc: 'Đa dạng hóa sản phẩm và mở rộng ứng dụng đá ong trong kiến trúc hiện đại.', media: MEDIA.dir2, tone: 'ong' },
  { num: '03', title: 'Kế thừa', desc: 'Lưu giữ kỹ thuật chế tác và truyền nghề cho thế hệ trẻ.', media: MEDIA.dir3, tone: 'brick' },
]
const DIR_GROUP = DIRECTIONS.map((d) => d.media)

/** Thẻ hướng phát triển có hiệu ứng chiều sâu theo con trỏ */
function DirectionCard({ d }: { d: (typeof DIRECTIONS)[number] }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 150, damping: 18 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 18 })
  const tx = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 120, damping: 20 })
  const ty = useSpring(useTransform(my, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 20 })

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const reset = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.article
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      className="group relative h-full w-full [transform-style:preserve-3d]"
    >
      <ImageSlot media={d.media} group={DIR_GROUP} tone={d.tone} label="none" className="absolute inset-0 shadow-[0_40px_80px_-40px_rgb(41_38_33_/_0.6)]" innerClassName="transition-transform duration-[1400ms] group-hover:scale-[1.12]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-coal/85 via-coal/25 to-transparent transition-opacity duration-700 group-hover:opacity-90" />
      <motion.div style={{ x: tx, y: ty, translateZ: 60 }} className="pointer-events-none absolute inset-0 flex flex-col justify-between p-7 text-paper md:p-10">
        <span className="display text-[6rem] leading-none text-paper/90 transition-colors duration-500 group-hover:text-sand md:text-[8rem]">{d.num}</span>
        <div>
          <h3 className="display text-5xl uppercase tracking-wide md:text-6xl">{d.title}</h3>
          <span className="my-4 block h-[2px] w-12 bg-brick transition-all duration-700 group-hover:w-28" />
          <p className="max-w-sm text-[0.98rem] leading-relaxed text-paper/90">{d.desc}</p>
          {!d.media.src && <p className="mt-4 text-[0.65rem] text-paper/55">Khung ảnh tư liệu · {d.media.brief}</p>}
        </div>
      </motion.div>
    </motion.article>
  )
}

/** CHƯƠNG 05 — Di sản tiếp nối */
export function Chapter5() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        // Chuyển từ tông nâu trầm sang không gian sáng
        gsap.fromTo(
          root.current,
          { backgroundColor: '#292621' },
          { backgroundColor: '#FFFFFF', ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 25%', scrub: true } },
        )
        // Ảnh mở đầu thay đổi kích thước & vị trí theo cuộn
        gsap.fromTo(
          q('.c5-open'),
          { scale: 0.72, borderRadius: '320px 320px 0 0', yPercent: 8 },
          { scale: 1, borderRadius: '0px 0px 0 0', yPercent: 0, ease: 'none', scrollTrigger: { trigger: q('.c5-open')[0], start: 'top bottom', end: 'center center', scrub: true } },
        )
        // Panorama trượt ngang
        gsap.fromTo(q('.c5-pano-inner'), { xPercent: 0 }, { xPercent: -18, ease: 'none', scrollTrigger: { trigger: q('.c5-pano')[0], start: 'top bottom', end: 'bottom top', scrub: true } })
      })

      mm.add(DESKTOP, () => {
        // Ba hướng phát triển: cuộn dọc → chuyển động ngang
        const track = q('.c5-track')[0] as HTMLElement
        const dist = () => track.scrollWidth - window.innerWidth
        gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: q('.c5-h')[0],
            start: 'top top',
            end: () => `+=${dist()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(q('.c5-bar'), { scaleX: self.progress }),
          },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="bao-ton" ref={root} className="relative bg-white text-coal" aria-label={PART5_TITLE}>
      {/* --- Mở đầu --- */}
      <div className="mx-auto max-w-[1400px] px-5 pt-28 md:px-10 md:pt-44">
        <p className="eyebrow flex items-center gap-3 text-ong" data-reveal="fade">
          Chương 05 <span className="h-px w-10 bg-ong/60" /> <span className="font-medium normal-case tracking-[0.08em]">{PART5_TITLE}</span>
        </p>
        <Split as="h2" by="char" text="Bảo tồn để tiếp nối" className="display mt-6 text-[clamp(3.2rem,10vw,10rem)] uppercase leading-[0.9]" accent={(w) => (w === 'tiếp' || w === 'nối' ? 'text-brick' : undefined)} />
      </div>
      <figure className="mx-auto mt-12 max-w-[1600px] px-0 md:mt-16 md:px-10">
        <ImageSlot media={MEDIA.ch5Opener} tone="sand" className="c5-open aspect-[16/10] w-full md:aspect-[21/9]" />
        <Caption className="px-5 md:px-0">{MEDIA.ch5Opener.caption}</Caption>
      </figure>

      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-32">
        <div className="grid gap-10 lg:grid-cols-12">
          <p className="display text-[clamp(1.9rem,3.4vw,3.2rem)] leading-[1.1] text-earth lg:col-span-5" data-split="words">
            Yêu cầu thích ứng để tiếp tục tồn tại
          </p>
          <div className="story lg:col-span-6 lg:col-start-7" data-reveal="up">
            <p className="dropcap">{PART5[0]}</p>
          </div>
        </div>
        <div className="story mt-16 grid gap-10 md:grid-cols-2 md:gap-16 lg:mt-24">
          <div className="md:border-t md:border-brick/40 md:pt-8" data-reveal="left">
            <p>{PART5[1]}</p>
          </div>
          <div className="md:mt-24 md:border-t md:border-brick/40 md:pt-8" data-reveal="right">
            <p>{PART5[2]}</p>
          </div>
        </div>
      </div>

      {/* --- Ba hướng phát triển --- */}
      <div className="c5-h relative overflow-hidden bg-paper lg:h-svh">
        <div className="c5-track flex flex-col gap-6 px-5 py-20 md:px-10 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-10 lg:py-0 lg:pl-[8vw] lg:pr-[10vw]">
          <div className="shrink-0 lg:w-[30vw]">
            <p className="eyebrow text-ong">Ba hướng phát triển</p>
            <h3 className="display mt-4 text-[clamp(2.6rem,4.6vw,5rem)] leading-[0.95]">
              Con đường <em className="text-brick">phía trước</em> của đá ong
            </h3>
            <p className="mt-6 hidden max-w-xs text-sm text-earth/70 lg:block">Tiếp tục cuộn để đi qua từng hướng — rê chuột để xem chi tiết.</p>
          </div>
          {DIRECTIONS.map((d) => (
            <div key={d.num} className="aspect-[4/5] w-full shrink-0 md:aspect-[16/11] lg:aspect-auto lg:h-[74svh] lg:w-[44vw]" data-reveal="up">
              <DirectionCard d={d} />
            </div>
          ))}
        </div>
        <div className="absolute inset-x-[8vw] bottom-8 hidden h-px bg-earth/15 lg:block motion-reduce:hidden">
          <div className="c5-bar h-full origin-left scale-x-0 bg-brick" />
        </div>
      </div>

      {/* --- Đoạn kết chương + panorama --- */}
      <div className="mx-auto max-w-3xl px-5 py-20 md:px-10 md:py-32">
        <div className="story" data-reveal="up">
          <p>{PART5[3]}</p>
        </div>
      </div>
      <figure className="c5-pano relative overflow-hidden">
        <div className="relative h-[60svh] w-full md:h-[85svh]">
          <div className="c5-pano-inner absolute inset-y-0 left-0 w-[122%]">
            <ImageSlot media={MEDIA.panorama} tone="ong" className="size-full" />
          </div>
        </div>
        <figcaption className="absolute bottom-6 right-5 z-10 rounded-full bg-paper/85 px-4 py-2 text-xs text-earth backdrop-blur md:right-10">
          {MEDIA.panorama.caption}
        </figcaption>
      </figure>
    </section>
  )
}
